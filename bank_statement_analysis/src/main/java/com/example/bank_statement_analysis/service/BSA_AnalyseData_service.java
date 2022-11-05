package com.example.bank_statement_analysis.service;

import com.example.bank_statement_analysis.model.BSA_Report;
import com.example.bank_statement_analysis.model.Extracted_JSON;
import com.example.bank_statement_analysis.model.FileDB;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Stream;

public class BSA_AnalyseData_service {
    private Logger logger = LoggerFactory.getLogger(BSA_AnalyseData_service.class);

    public BSA_Report createReport(FileDB fileDB) throws ParseException {
        String fileType = fileDB.getType() + "";
        String fromDate = "";
        String toDate = "";
        BSA_Report bsa_report = new BSA_Report();
        logger.info("Creating BSA Report...");
        //Creating JSON Array of table data
        String extracted_json_data = fileDB.getExtracted_json().toBsonDocument().getDocument("data").get("Sheet").toString();
        String extracted_json_to_parse = extracted_json_data.substring(17, extracted_json_data.length() - 1);
        JSONArray jsonArray = (JSONArray) JSONValue.parse(extracted_json_to_parse);
        List<Extracted_JSON> extracted_jsonList = new ArrayList<>();
        for (Object obj : jsonArray) {
            extracted_jsonList.add(getExtractedJsonObject(obj));
        }

        //PERSONAL INFORMATION
        bsa_report.setAccountHolderName(fileDB.getCustomerName().equals("undefined") ? "NA" : fileDB.getCustomerName());
        bsa_report.setEmailAddress(fileDB.getCustomerEmailAddress().equals("undefined") ? "NA" : fileDB.getCustomerEmailAddress());
        bsa_report.setAccountNumber(fileDB.getCustomerAccountNumber().equals("undefined") ? "NA" : fileDB.getCustomerAccountNumber());
        bsa_report.setCustomerID(fileDB.getCustomerId().equals("undefined") ? "NA" : fileDB.getCustomerId());

        //setting fromDate & toDate according to fileType
        switch (fileType) {
            case "application/pdf":
                bsa_report.setFromDate(fileDB.getFromDate());
                bsa_report.setToDate(fileDB.getToDate());
                break;
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                fromDate = getFromDateExcel(extracted_jsonList);
                toDate = getToDateExcel(extracted_jsonList);
                fileDB.setFromDate(fromDate);
                fileDB.setToDate(toDate);
                bsa_report.setFromDate(fromDate);
                bsa_report.setToDate(toDate);
                break;
            case "application/vnd.ms-excel":
                fromDate = getFromDateExcel(extracted_jsonList);
                toDate = getToDateExcel(extracted_jsonList);
                fileDB.setFromDate(fromDate);
                fileDB.setToDate(toDate);
                bsa_report.setFromDate(fromDate);
                bsa_report.setToDate(toDate);
                break;
        }

        //OVERVIEW OF TRANSACTIONS
        bsa_report.setOpeningBalance(getOpeningBalance(extracted_jsonList));
        bsa_report.setClosingBalance(getClosingBalance(extracted_jsonList));
        //All Transactions Over Time (in Rs.)
        bsa_report.setMonthsAndCredits(getMonthwiseCredits_(extracted_jsonList));
        bsa_report.setMonthsAndDebits(getMonthwiseDebits_(extracted_jsonList));
        bsa_report.setOverallCredit(getOverallCreditBalance(extracted_jsonList));
        bsa_report.setHighestCredits(getSetOfHighestCredits(bsa_report.getMonthsAndCredits()));
        bsa_report.setOverallDebit(getOverallDebitBalance(extracted_jsonList));
        bsa_report.setHighestDebits(getSetOfHighestDebit(bsa_report.getMonthsAndDebits()));
        bsa_report.setCreditToDebitAmountRatio(getCrToDbRatio((int) bsa_report.getOverallCredit(), (int) bsa_report.getOverallDebit()));
        //Count Of All Transactions
        bsa_report.setMonthsAndCountOfCreditTransactions(getMonthwiseCountOfCredits(extracted_jsonList));
        bsa_report.setMonthsAndCountOfDebitTransactions(getMonthwiseCountOfDebits(extracted_jsonList));
        bsa_report.setNumberOfCreditTransactions(getNumberOfCr(extracted_jsonList));
        bsa_report.setNumberOfDebitTransactions(getNumberOfDb(extracted_jsonList));
        bsa_report.setNumberOfTransactions(bsa_report.getNumberOfCreditTransactions() + bsa_report.getNumberOfDebitTransactions());
        bsa_report.setCreditToDebitTransactionCountRatio(getCrToDbRatio(bsa_report.getNumberOfCreditTransactions(), bsa_report.getNumberOfDebitTransactions()));
        //Monthly Average Balance
        Map<String, Double> monthlyAverageBalance_ = getMonthlyAvgBalanceNew(extracted_jsonList, fileDB.getFromDate(), fileDB.getToDate(), bsa_report.getOpeningBalance(), bsa_report.getClosingBalance());
        bsa_report.setMonthlyAverageBalance(monthlyAverageBalance_);
        bsa_report.setHighestMonthlyAvg(getHighestMonthlyAvg(monthlyAverageBalance_));
        bsa_report.setLowestMonthlyAvg(getLowestMonthlyAvg(monthlyAverageBalance_));
        bsa_report.setMonthsAndBalance(getMonthwiseBalance(extracted_jsonList));
        bsa_report.setAverageBalance(getOverallAverageBalance(bsa_report.getMonthsAndBalance()));

        //TRANSACTIONS CATEGORISED BY TRANSACTION SIZE small(<Rs.2,000), medium(Rs.2,000-Rs.10,000), large(>Rs.10,000)
        //Credits(in Rs.)
        double[] crBySize = getSizewiseCr(extracted_jsonList);
        bsa_report.setSmallCreditCount((int) crBySize[0]);
        bsa_report.setMediumCreditCount((int) crBySize[1]);
        bsa_report.setLargeCreditCount((int) crBySize[2]);
        bsa_report.setSmallCreditsTotal(crBySize[3]);
        bsa_report.setMediumCreditsTotal(crBySize[4]);
        bsa_report.setLargeCreditsTotal(crBySize[5]);
        //Debits(in Rs.)
        double[] dbBySize = getSizewiseDb(extracted_jsonList);
        bsa_report.setSmallDebitCount((int) dbBySize[0]);
        bsa_report.setMediumDebitCount((int) dbBySize[1]);
        bsa_report.setLargeDebitCount((int) dbBySize[2]);
        bsa_report.setSmallDebitsTotal(dbBySize[3]);
        bsa_report.setMediumDebitsTotal(dbBySize[4]);
        bsa_report.setLargeDebitsTotal(dbBySize[5]);

        //TRANSACTIONS CATEGORISED BY MODE OF PAYMENT Debit(ATM,IMPS/NEFT,UPI,Misc.) Credit(IMPS/NEFT,UPI,Misc.,Interest,Auto Transaction)
        //Credits(in Rs.)
        double[] crByModeOfPayment = getModewiseCr(extracted_jsonList);
        bsa_report.setCreditCountOfIMPS((int) crByModeOfPayment[0]);
        bsa_report.setCreditCountOfNEFT((int) crByModeOfPayment[1]);
        bsa_report.setCreditCountOfInterest((int) crByModeOfPayment[2]);
        bsa_report.setCreditCountOfAutoTransaction((int) crByModeOfPayment[3]);
        bsa_report.setCreditCountOfUPI((int) crByModeOfPayment[4]);
        bsa_report.setCreditCountOfATMDeposit((int) crByModeOfPayment[5]);
        bsa_report.setCreditCountOfCashDeposit((int) crByModeOfPayment[6]);
        bsa_report.setCreditCountOfMisc((int) crByModeOfPayment[7]);
        bsa_report.setCreditOfIMPS(crByModeOfPayment[8]);
        bsa_report.setCreditOfNEFT(crByModeOfPayment[9]);
        bsa_report.setCreditOfInterest(crByModeOfPayment[10]);
        bsa_report.setCreditOfAutoTransaction(crByModeOfPayment[11]);
        bsa_report.setCreditOfUPI(crByModeOfPayment[12]);
        bsa_report.setCreditOfATMDeposit(crByModeOfPayment[13]);
        bsa_report.setCreditOfCashDeposit(crByModeOfPayment[14]);
        bsa_report.setCreditOfMisc(crByModeOfPayment[15]);
        //Debits(in Rs.)
        double[] dbByModeOfPayment = getModewiseDb(extracted_jsonList);
        bsa_report.setDebitCountOfATM((int) dbByModeOfPayment[0]);
        bsa_report.setDebitCountOfIMPSorNEFT((int) dbByModeOfPayment[1]);
        bsa_report.setDebitCountOfUPI((int) dbByModeOfPayment[2]);
        bsa_report.setDebitCountOfEMI((int) dbByModeOfPayment[3]);
        bsa_report.setDebitCountOfBank((int) dbByModeOfPayment[4]);
        bsa_report.setDebitCountOfMisc((int) dbByModeOfPayment[5]);
        bsa_report.setDebitOfATM(dbByModeOfPayment[6]);
        bsa_report.setDebitOfIMPSorNEFT(dbByModeOfPayment[7]);
        bsa_report.setDebitOfUPI(dbByModeOfPayment[8]);
        bsa_report.setDebitOfEMI(dbByModeOfPayment[9]);
        bsa_report.setDebitOfBank(dbByModeOfPayment[10]);
        bsa_report.setDebitOfMisc(dbByModeOfPayment[11]);

        //Advanced Search
        bsa_report.setAllParticularsData(getAllParticulars(extracted_jsonList));

        //INFLOW ANALYSIS
        bsa_report.setInflowsIMPS(getArrayOfInflows(extracted_jsonList, "IMPS"));
        bsa_report.setInflowsNEFT(getArrayOfInflows(extracted_jsonList, "NEFT"));
        bsa_report.setInflowsUPI(getArrayOfInflows(extracted_jsonList, "UPI"));
        bsa_report.setInflowsInterest(getArrayOfInflows(extracted_jsonList, "Int.Pd"));
        //OUTFLOW ANALYSIS
        bsa_report.setOutflowsATM(getArrayOfOutflows(extracted_jsonList, "ATM"));
        bsa_report.setOutflowsIMPS(getArrayOfOutflows(extracted_jsonList, "IMPS"));
        bsa_report.setOutflowsUPI(getArrayOfOutflows(extracted_jsonList, "UPI"));
        bsa_report.setOutflowsEMI(getArrayOfOutflows(extracted_jsonList, "EMI"));
        bsa_report.setOutflowsInterest(getArrayOfOutflows(extracted_jsonList, "Int.Coll"));

        bsa_report.setId(fileDB.getId());

        logger.info("BSA Report Created Successfully.");
        return bsa_report;
    }

    private String getFromDateExcel(List<Extracted_JSON> extracted_jsonList) {
        String firstDate = "";
        //first entry of date
        for (int i = 0; i < extracted_jsonList.size(); i++) {
            if (!extracted_jsonList.get(i).getTrans_Date().isBlank()) {
                firstDate = extracted_jsonList.get(i).getTrans_Date();
                break;
            }
        }
        return firstDate;
    }

    private String getToDateExcel(List<Extracted_JSON> extracted_jsonList) {
        String lastDate = "";
        //last entry of date
        for (int i = extracted_jsonList.size() - 1; i >= 1; i--) {
            if (!extracted_jsonList.get(i).getTrans_Date().isBlank()) {
                lastDate = extracted_jsonList.get(i).getTrans_Date();
                break;
            }
        }
        return lastDate;
    }

    private double getOpeningBalance(List<Extracted_JSON> extracted_jsonList) {
        logger.info("Getting Opening Balance.");
        double balance = 0.0;
        for (int i = 0; i < extracted_jsonList.size(); i++) {
            if (extracted_jsonList.get(i).getParticulars().equals("OPENING BALANCE")) {
                balance = extracted_jsonList.get(i).getBalance();
                break;
            }
        }
        return balance;
    }

    private double getClosingBalance(List<Extracted_JSON> extracted_jsonList) {
        logger.info("Getting Closing Balance.");
        double balance = 0.0;
        for (int i = extracted_jsonList.size() - 1; i > 1; i--) {
            if (extracted_jsonList.get(i).getParticulars().equals("CLOSING BALANCE")) {
                balance = extracted_jsonList.get(i).getBalance();
                break;
            }
        }
        return balance;
    }

    private Map<String, Double> getMonthwiseCredits_(List<Extracted_JSON> extracted_jsonList) {
        logger.info("Getting Monthwise Credits");
        Map<String, Double> monthsAndCredits = new HashMap<>();
        double creditSum = 0.00d;
        String monthName = null;
        for (int i = 0; i < extracted_jsonList.size(); i++) {
            if (extracted_jsonList.get(i).getTrans_Date().length() != 0) {
                monthName = getMonth(Integer.parseInt(extracted_jsonList.get(i).getTrans_Date().substring(3, 5)));
                if (extracted_jsonList.get(i).getCredit() != 0) {
                    creditSum += extracted_jsonList.get(i).getCredit();
                }
                if (extracted_jsonList.get(i + 1).getTrans_Date().length() == 0) {
                    monthsAndCredits.put(getMonth(Integer.parseInt(extracted_jsonList.get(i).getTrans_Date().substring(3, 5))), creditSum);
                    break;
                } else if (!monthName.equals(getMonth(Integer.parseInt(extracted_jsonList.get(i + 1).getTrans_Date().substring(3, 5))))) {
                    monthsAndCredits.put(getMonth(Integer.parseInt(extracted_jsonList.get(i).getTrans_Date().substring(3, 5))), creditSum);
                    creditSum = 0.00d;
                }
            }
        }
        return monthsAndCredits;
    }

    private Map<String, Double> getMonthwiseDebits_(List<Extracted_JSON> extracted_jsonList) {
        logger.info("Getting Monthwise Debits");
        Map<String, Double> monthsAndDebits = new HashMap<>();
        double debitSum = 0.00d;
        String monthName = null;
        for (int i = 0; i < extracted_jsonList.size(); i++) {
            if (extracted_jsonList.get(i).getTrans_Date().length() != 0) {
                monthName = getMonth(Integer.parseInt(extracted_jsonList.get(i).getTrans_Date().substring(3, 5)));
                if (extracted_jsonList.get(i).getDebit() != 0) {
                    debitSum += extracted_jsonList.get(i).getDebit();
                }
                if (extracted_jsonList.get(i + 1).getTrans_Date().length() == 0) {
                    monthsAndDebits.put(getMonth(Integer.parseInt(extracted_jsonList.get(i).getTrans_Date().substring(3, 5))), debitSum);
                    break;
                } else if (!monthName.equals(getMonth(Integer.parseInt(extracted_jsonList.get(i + 1).getTrans_Date().substring(3, 5))))) {
                    monthsAndDebits.put(getMonth(Integer.parseInt(extracted_jsonList.get(i).getTrans_Date().substring(3, 5))), debitSum);
                    debitSum = 0.00d;
                }

            }
        }
        return monthsAndDebits;
    }

    private double getOverallCreditBalance(List<Extracted_JSON> extracted_jsonList) {
        logger.info("Getting Overall Credit Balance");
        double balance = 0.0;
        for (int i = extracted_jsonList.size() - 1; i > 1; i--) {
            if (extracted_jsonList.get(i).getParticulars().equals("TRANSACTION TOTAL")) {
                balance = extracted_jsonList.get(i).getCredit();
                break;
            }
        }
        return balance;
    }

    private Map<String, Double> getSetOfHighestCredits(Map<String, Double> allCreditsPerMonths) {
        logger.info("Getting Monthwise Highest Credits");
        Double max = Collections.max(allCreditsPerMonths.values());
        Map<String, Double> highestCredit = new HashMap<>();
        for (Map.Entry<String, Double> entry : allCreditsPerMonths.entrySet()) {
            if (entry.getValue() == max)
                highestCredit.put(entry.getKey(), entry.getValue());
        }
        return highestCredit;
    }

    private double getOverallDebitBalance(List<Extracted_JSON> extracted_jsonList) {
        logger.info("Getting Overall Debit Balance");
        double balance = 0.0;
        for (int i = extracted_jsonList.size() - 1; i > 1; i--) {
            if (extracted_jsonList.get(i).getParticulars().equals("TRANSACTION TOTAL")) {
                balance = extracted_jsonList.get(i).getDebit();
                break;
            }
        }
        return balance;
    }

    private Map<String, Double> getSetOfHighestDebit(Map<String, Double> allDebitPerMonths) {
        logger.info("Getting Monthwise Highest Debits");
        Double max = Collections.max(allDebitPerMonths.values());
        Map<String, Double> highestDebit = new HashMap<>();
        for (Map.Entry<String, Double> entry : allDebitPerMonths.entrySet()) {
            if (entry.getValue() == max)
                highestDebit.put(entry.getKey(), entry.getValue());
        }
        return highestDebit;
    }

    private String getCrToDbRatio(int overallCredit, int overallDebit) {
        logger.info("Getting Credit to Debit Ratio");
        int gcd = 1;
        for (int i = 1; i <= overallCredit && i <= overallDebit; i++) {
            if (overallCredit % i == 0 && overallDebit % i == 0)
                gcd = i;
        }
        int cr = overallCredit / gcd;
        int db = overallDebit / gcd;
        return cr + " : " + db;
    }

    private Map<String, Integer> getMonthwiseCountOfCredits(List<Extracted_JSON> extracted_jsonList) {
        logger.info("Getting Monthwise Count Of Credits");
        Map<String, Integer> monthsAndCredits = new HashMap<>();
        int count = 0;
        String monthName = null;
        for (int i = 0; i < extracted_jsonList.size(); i++) {
            if (extracted_jsonList.get(i).getTrans_Date().length() != 0) {
                monthName = getMonth(Integer.parseInt(extracted_jsonList.get(i).getTrans_Date().substring(3, 5)));
                if (extracted_jsonList.get(i).getCredit() != 0) {
                    count++;
                }
                if (extracted_jsonList.get(i + 1).getTrans_Date().length() == 0) {
                    monthsAndCredits.put(getMonth(Integer.parseInt(extracted_jsonList.get(i).getTrans_Date().substring(3, 5))), count);
                    break;
                } else if (!monthName.equals(getMonth(Integer.parseInt(extracted_jsonList.get(i + 1).getTrans_Date().substring(3, 5))))) {
                    monthsAndCredits.put(getMonth(Integer.parseInt(extracted_jsonList.get(i).getTrans_Date().substring(3, 5))), count);
                    count = 0;
                }
            }
        }
        return monthsAndCredits;
    }

    private Map<String, Integer> getMonthwiseCountOfDebits(List<Extracted_JSON> extracted_jsonList) {
        logger.info("Getting Monthwise Count Of Debits");
        Map<String, Integer> monthsAndCredits = new HashMap<>();
        int count = 0;
        String monthName = null;
        for (int i = 0; i < extracted_jsonList.size(); i++) {
            if (extracted_jsonList.get(i).getTrans_Date().length() != 0) {
                monthName = getMonth(Integer.parseInt(extracted_jsonList.get(i).getTrans_Date().substring(3, 5)));
                if (extracted_jsonList.get(i).getDebit() != 0) {
                    count++;
                }
                if (extracted_jsonList.get(i + 1).getTrans_Date().length() == 0) {
                    monthsAndCredits.put(getMonth(Integer.parseInt(extracted_jsonList.get(i).getTrans_Date().substring(3, 5))), count);
                    break;
                } else if (!monthName.equals(getMonth(Integer.parseInt(extracted_jsonList.get(i + 1).getTrans_Date().substring(3, 5))))) {
                    monthsAndCredits.put(getMonth(Integer.parseInt(extracted_jsonList.get(i).getTrans_Date().substring(3, 5))), count);
                    count = 0;
                }
            }
        }
        return monthsAndCredits;
    }

    private int getNumberOfCr(List<Extracted_JSON> extracted_jsonList) {
        logger.info("Getting Number of Credit");
        int count = 0;
        for (int i = 0; i < extracted_jsonList.size(); i++) {
            if (extracted_jsonList.get(i).getCredit() != 0 && extracted_jsonList.get(i).getTrans_Date().length() != 0) {
                count++;
            }
        }
        return count;
    }

    private int getNumberOfDb(List<Extracted_JSON> extracted_jsonList) {
        logger.info("Getting Number of Debit");
        int count = 0;
        for (int i = 0; i < extracted_jsonList.size(); i++) {
            if (extracted_jsonList.get(i).getDebit() != 0 && extracted_jsonList.get(i).getTrans_Date().length() != 0) {
                count++;
            }
        }
        return count;
    }

    public Map<String, Double> getMonthlyAvgBalanceNew(List<Extracted_JSON> extracted_jsonList, String fromDateStr, String toDateStr, double openingBal, double closingBal) throws ParseException {
        logger.info("Getting Monthwise Average Balance");
        double openingBalance = openingBal;
        double monthlyBalance = 0.00d;
        int fromDate = Integer.parseInt(fromDateStr.substring(0, 2));
        int toDate = Integer.parseInt(toDateStr.substring(0, 2));
        Map<String, Double> monthsAndBalance = new HashMap<>();
        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
        //creating a map of unique dates and their balance
        Map<Date, Double> uniquedatewithbal = getUniqueDateandBalance(extracted_jsonList);
        //sorting the above map according to dates for list of dates
        Stream<Map.Entry<Date, Double>> sortedData = uniquedatewithbal.entrySet().stream().sorted(Map.Entry.comparingByKey());
        //creating another copy of sorted map for list of balance
        Stream<Map.Entry<Date, Double>> sortedDataCopy = uniquedatewithbal.entrySet().stream().sorted(Map.Entry.comparingByKey());
        //now we are having two list of same length containing dates and balance
        List<Date> dates = new ArrayList<>();
        List<Double> balances = new ArrayList<>();
        sortedData.forEach(s -> dates.add(s.getKey()));
        sortedDataCopy.forEach(s -> balances.add(s.getValue()));
        for (int i = 0; i < dates.size(); i++) {
            String currentMonth = getMonth(dates.get(i).getMonth() + 1);
            if (i == 0) {
                //logic for multipying the balance with number of days ahead of it					System.out.println("monthlyBalance->"+monthlyBalance);
                if (currentMonth.equals(getMonth(Integer.parseInt(fromDateStr.substring(3, 5))))) {
                    if (dates.get(i).getDate() != fromDate) {
                        monthlyBalance += openingBalance * (dates.get(i).getDate() - (fromDate - 1));
                    } else {
                        monthlyBalance += balances.get(i) * dates.get(i).getDate();
                    }
                } else {
                    monthlyBalance += balances.get(i) * ((dates.get(i).getTime() - formatter.parse(fromDateStr).getTime()) / (1000 * 60 * 60 * 24));
                }
                continue;
            }
            //for first day of the month
            if (dates.get(i).getDate() == 1) {
                monthlyBalance += balances.get(i);
                continue;
            }
            //for last day of the list
            if (i == dates.size() - 1) {
                //whether the last entry is of toDate's Month
                if (currentMonth == getMonth(Integer.parseInt(toDateStr.substring(3, 5)))) {
                    //whether the current date is less that toDate
                    if ((dates.get(i).getDate() + 0) < toDate) {
                        monthlyBalance += balances.get(i - 1) * (dates.get(i).getDate() - 1);
                        monthlyBalance += balances.get(i) * (toDate - dates.get(i).getDate());
                        monthsAndBalance.put(currentMonth, (double) Math.round((monthlyBalance) / toDate));
                        monthlyBalance = 0.00d;
                        continue;
                    }
                    //UNNECESSARY CODE BLOCK whether its the last day of that month
                    else if (dates.get(i).getDate() == getNumberOfDaysInMonth(dates.get(i).getMonth() + 1, dates.get(i).getYear())) {
                        monthlyBalance += balances.get(i);
                        monthsAndBalance.put(currentMonth, (double) Math.round(monthlyBalance / getNumberOfDaysInMonth(dates.get(i).getMonth() + 1, dates.get(i).getYear())));
                        monthlyBalance = 0.00d;
                        continue;
                    }
                }
                //when last entry is not of the toDats's month, It must be prior of it
                else {
                    monthlyBalance += balances.get(i) * ((formatter.parse(toDateStr).getTime() - dates.get(i - 1).getTime()) / (1000 * 60 * 60 * 24));
                    monthsAndBalance.put(currentMonth, (double) Math.round((monthlyBalance) / getNumberOfDaysInMonth(dates.get(i).getMonth() + 1, dates.get(i).getYear())));
                    monthlyBalance = 0.00d;
                    continue;
                }
            }
            //for last entry of the month
            if (i < dates.size() - 1 && i >= 1 && currentMonth != getMonth(dates.get(i + 1).getMonth() + 1)) {
                //if it's last day of month
                if (dates.get(i).getDate() + 0 == getNumberOfDaysInMonth(dates.get(i).getMonth() + 1, dates.get(i).getYear())) {
                    monthlyBalance += balances.get(i - 1) * (dates.get(i).getDate() - dates.get(i - 1).getDate());
                    monthlyBalance += balances.get(i);
                    monthsAndBalance.put(currentMonth, (double) Math.round(monthlyBalance / getNumberOfDaysInMonth(dates.get(i).getMonth() + 1, dates.get(i).getYear())));
                    monthlyBalance = 0.00d;
                    continue;
                } else if (i > 1) {
                    monthlyBalance += balances.get(i - 1) * (dates.get(i).getTime() - dates.get(i - 1).getTime()) / (1000 * 60 * 60 * 24);
                    monthlyBalance += balances.get(i) * (getNumberOfDaysInMonth(dates.get(i).getMonth() + 1, dates.get(i).getYear()) - dates.get(i).getDate());
                    monthsAndBalance.put(currentMonth, (double) Math.round(monthlyBalance / getNumberOfDaysInMonth(dates.get(i).getMonth() + 1, dates.get(i).getYear())));
                    monthlyBalance = 0.00d;
                    continue;
                }

            }
            //for not the first entry of month
            else {
                if (i > 1 && dates.get(i - 1).getDate() < dates.get(i).getDate()) {
                    monthlyBalance += balances.get(i - 1) * ((int) (dates.get(i).getDate() + 0) - (int) (dates.get(i - 1).getDate() + 0));
                    continue;
                }
            }
        }
        return monthsAndBalance;
    }

    private Map<String, Double> getHighestMonthlyAvg(Map<String, Double> allAverages) {
        logger.info("Getting Highest Monthly Average Balance");
        Double max = Collections.max(allAverages.values());
        Map<String, Double> highest = new HashMap<>();
        for (Map.Entry<String, Double> entry : allAverages.entrySet()) {
            if (entry.getValue() == max)
                highest.put(entry.getKey(), entry.getValue());
        }
        return highest;
    }

    private Map<String, Double> getLowestMonthlyAvg(Map<String, Double> allAverages) {
        logger.info("Getting Lowest Monthly Average Balance");
        Double min = Collections.min(allAverages.values());
        Map<String, Double> lowest = new HashMap<>();
        for (Map.Entry<String, Double> entry : allAverages.entrySet()) {
            if (entry.getValue() == min)
                lowest.put(entry.getKey(), entry.getValue());
        }
        return lowest;
    }

    private Map<String, Double> getMonthwiseBalance(List<Extracted_JSON> extracted_jsonList) {
        logger.info("Getting monthwise balance.");
        Map<String, Double> monthsAndBalance = new HashMap<>();
        double balance = 0.0;
        for (int i = 0; i < extracted_jsonList.size(); i++) {
            if (extracted_jsonList.get(i).getTrans_Date().length() != 0) {
                for (int j = i; j < extracted_jsonList.size(); j++) {
                    if (extracted_jsonList.get(j).getTrans_Date().length() != 0) {
                        if (getMonth(Integer.parseInt(extracted_jsonList.get(i).getTrans_Date().substring(3, 5))).equals(getMonth(Integer.parseInt(extracted_jsonList.get(j).getTrans_Date().substring(3, 5))))) {
                            balance = extracted_jsonList.get(j).getBalance();
                        } else {
                            monthsAndBalance.put(getMonth(Integer.parseInt(extracted_jsonList.get(i).getTrans_Date().substring(3, 5))), balance);
                            balance = 0.0;
                            i = j - 1;
                            break;
                        }
                    } else
                        break;
                }
            } else
                continue;
        }
        return monthsAndBalance;
    }

    private double getOverallAverageBalance(Map<String, Double> monthsAndBalance) {
        logger.info("Getting Overall Average Balance");
        double balance = 0.0;
        for (double monthlybalance : monthsAndBalance.values()) {
            balance += monthlybalance;
        }
        return Math.round(balance / monthsAndBalance.size());
    }

    private double[] getSizewiseCr(List<Extracted_JSON> extracted_jsonList) {
        logger.info("Getting Sizewise Credits");
        double smCount = 0.00d, mdCount = 0.00d, lgCount = 0.00d;
        double smCr = 0.00d, mdCr = 0.00d, lgCr = 0.00d;
        for (int i = 0; i < extracted_jsonList.size(); i++) {
            double cr = extracted_jsonList.get(i).getCredit();
            if (extracted_jsonList.get(i).getTrans_Date().length() != 0 && cr != 0.0) {
                if (cr > 0.00d && cr <= 2000.0) {
                    smCount++;
                    smCr += cr;
                } else if (cr > 2000.0 && cr <= 10000.0) {
                    mdCount++;
                    mdCr += cr;
                } else if (cr > 10000.0) {
                    lgCount++;
                    lgCr += cr;
                }
            }
        }
        return new double[]{smCount, mdCount, lgCount, smCr, mdCr, lgCr};
    }

    private double[] getSizewiseDb(List<Extracted_JSON> extracted_jsonList) {
        logger.info("Getting Sizewise Debits");
        double smCount = 0.00d, mdCount = 0.00d, lgCount = 0.00d;
        double smDb = 0.00d, mdDb = 0.00d, lgDb = 0.00d;
        for (int i = 0; i < extracted_jsonList.size(); i++) {
            double db = extracted_jsonList.get(i).getDebit();
            if (extracted_jsonList.get(i).getTrans_Date().length() != 0 && db != 0.0) {
                if (db > 0 && db <= 2000) {
                    smCount++;
                    smDb += db;
                } else if (db > 2000 && db <= 10000) {
                    mdCount++;
                    mdDb += db;
                } else if (db > 10000) {
                    lgCount++;
                    lgDb += db;
                }
            }
        }
        return new double[]{smCount, mdCount, lgCount, smDb, mdDb, lgDb};
    }

    private double[] getModewiseCr(List<Extracted_JSON> extracted_jsonList) {
        logger.info("Getting Modewise Credits");
        double impsCount = 0.00d, neftCount = 0.00d, interestCount = 0.00d, autoTrCount = 0.00d, upiCount = 0.00d, atmDepositCount = 0.00d, cashDepositCount = 0.00d, miscCount = 0.00d;
        double impsCr = 0.00d, neftCr = 0.00d, interestCr = 0.00d, autoTrCr = 0.00d, upiCr = 0.00d, amtDepositCr = 0.00d, cashDepositCr = 0.00d, miscCr = 0.00d;
        for (int i = 0; i < extracted_jsonList.size(); i++) {
            double cr = extracted_jsonList.get(i).getCredit();
            String particular = extracted_jsonList.get(i).getParticulars();
            if (extracted_jsonList.get(i).getTrans_Date().length() != 0 && cr != 0.0) {
                if (particular.contains("IMPS")) {
                    impsCount++;
                    impsCr += cr;
                } else if (particular.contains("NEFT")) {
                    neftCount++;
                    neftCr += cr;
                } else if (particular.contains("Int.Pd") || particular.contains("REV SWEEP")) {
                    interestCount++;
                    interestCr += cr;
                } else if (particular.contains("INB")) {
                    autoTrCount++;
                    autoTrCr += cr;
                } else if (particular.contains("UPI")) {
                    upiCount++;
                    upiCr += cr;
                } else if (particular.contains("EDC") || particular.contains("CWDR") || particular.contains("VMT")) {
                    atmDepositCount++;
                    amtDepositCr += cr;
                } else if (particular.contains("CASH DEP") || particular.contains("SAK")) {
                    cashDepositCount++;
                    cashDepositCr += cr;
                } else {
                    miscCount++;
                    miscCr += cr;
                }
            }
        }
        return new double[]{impsCount, neftCount, interestCount, autoTrCount, upiCount, atmDepositCount, cashDepositCount, miscCount, impsCr, neftCr, interestCr, autoTrCr, upiCr, amtDepositCr, cashDepositCr, miscCr};
    }

    private double[] getModewiseDb(List<Extracted_JSON> extracted_jsonList) {
        logger.info("Getting Modewise Debits");
        double atmCount = 0.00d, impsOrNeftCount = 0.00d, upiCount = 0.00d, emiCount = 0.00d, bankCount = 0.00d, miscCount = 0.00d;
        double atmDb = 0.00d, impsOrNeftDb = 0.00d, upiDb = 0.00d, emiDb = 0.00d, bankDb = 0.00d, miscDb = 0.00d;
        for (int i = 0; i < extracted_jsonList.size(); i++) {
            double db = extracted_jsonList.get(i).getDebit();
            String particular = extracted_jsonList.get(i).getParticulars();
            if (extracted_jsonList.get(i).getTrans_Date().length() != 0 && db != 0.0) {
                if (particular.contains("ATM") || particular.contains("CWDR") || particular.contains("VMT")) {
                    atmCount++;
                    atmDb += db;
                } else if (particular.contains("NEFT") || particular.contains("IMPS")) {
                    impsOrNeftCount++;
                    impsOrNeftDb += db;
                } else if (particular.contains("UPI")) {
                    upiCount++;
                    upiDb += db;
                } else if (particular.contains("_EMI_") || particular.contains("EMI")) {
                    emiCount++;
                    emiDb += db;
                } else if (particular.contains("Int.Coll") || particular.contains("SETU") || extracted_jsonList.get(i).getChequeNumber() != 0) {
                    bankCount++;
                    bankDb += db;
                } else {
                    miscCount++;
                    miscDb += db;
                }
            }
        }
        return new double[]{atmCount, impsOrNeftCount, upiCount, emiCount, bankCount, miscCount, atmDb, impsOrNeftDb, upiDb, emiDb, bankDb, miscDb};
    }

    private ArrayList<Extracted_JSON> getAllParticulars(List<Extracted_JSON> extracted_jsonList) {
        logger.info("Getting Particulars...");
        ArrayList<Extracted_JSON> allParticularData = new ArrayList<>();
        for (int i = 0; i < extracted_jsonList.size(); i++) {
            if (!extracted_jsonList.get(i).getTrans_Date().isBlank()) {
                String trans_Date = extracted_jsonList.get(i).getTrans_Date();
                long chequeNumber = extracted_jsonList.get(i).getChequeNumber();
                String particulars = extracted_jsonList.get(i).getParticulars();
                double debit = extracted_jsonList.get(i).getDebit();
                double credit = extracted_jsonList.get(i).getCredit();
                double balance = extracted_jsonList.get(i).getBalance();
                long init_Br = extracted_jsonList.get(i).getInit_Br();
                allParticularData.add(new Extracted_JSON(trans_Date, chequeNumber, particulars, debit, credit, balance, init_Br));
            }
        }
        return allParticularData;
    }

    private ArrayList<Extracted_JSON> getArrayOfInflows(List<Extracted_JSON> extracted_jsonList, String modeOfPayment) {
        logger.info("Getting " + modeOfPayment + " Inflows");
        ArrayList<Extracted_JSON> inflow = new ArrayList<>();
        for (int i = 0; i < extracted_jsonList.size(); i++) {
            double cr = extracted_jsonList.get(i).getCredit();
            String particular = extracted_jsonList.get(i).getParticulars();
            if (extracted_jsonList.get(i).getTrans_Date().length() != 0 && cr != 0.0 && particular.contains(modeOfPayment)) {
                String trans_Date = extracted_jsonList.get(i).getTrans_Date();
                long chequeNumber = extracted_jsonList.get(i).getChequeNumber();
                String particulars = extracted_jsonList.get(i).getParticulars();
                double debit = extracted_jsonList.get(i).getDebit();
                double credit = extracted_jsonList.get(i).getCredit();
                double balance = extracted_jsonList.get(i).getBalance();
                long init_Br = extracted_jsonList.get(i).getInit_Br();
                inflow.add(new Extracted_JSON(trans_Date, chequeNumber, particulars, debit, credit, balance, init_Br));
            }
        }
        return inflow;
    }

    private ArrayList<Extracted_JSON> getArrayOfOutflows(List<Extracted_JSON> extracted_jsonList, String modeOfPayment) {
        logger.info("Getting " + modeOfPayment + " Outflows");
        ArrayList<Extracted_JSON> outflows = new ArrayList<>();
        for (int i = 0; i < extracted_jsonList.size(); i++) {
            double db = extracted_jsonList.get(i).getDebit();
            String particular = extracted_jsonList.get(i).getParticulars();
            if (extracted_jsonList.get(i).getTrans_Date().length() != 0 && db != 0.0 && particular.contains(modeOfPayment)) {
                String trans_Date = extracted_jsonList.get(i).getTrans_Date();
                long chequeNumber = extracted_jsonList.get(i).getChequeNumber();
                String particulars = extracted_jsonList.get(i).getParticulars();
                double debit = extracted_jsonList.get(i).getDebit();
                double credit = extracted_jsonList.get(i).getCredit();
                double balance = extracted_jsonList.get(i).getBalance();
                long init_Br = extracted_jsonList.get(i).getInit_Br();
                outflows.add(new Extracted_JSON(trans_Date, chequeNumber, particulars, debit, credit, balance, init_Br));
            }
        }
        return outflows;
    }

    private Extracted_JSON getExtractedJsonObject(Object object) {
        JSONObject jsonObject = (JSONObject) object;
        Extracted_JSON extracted_json = new Extracted_JSON();
        String chequeNumber = jsonObject.get("Chq No").toString();
        String debit = jsonObject.get("Debit").toString();
        String credit = jsonObject.get("Credit").toString();
        String balance = jsonObject.get("Balance").toString();
        String initBr = jsonObject.get("Init. Br").toString();
        extracted_json.setTrans_Date(jsonObject.get("Tran Date").toString());
        extracted_json.setChequeNumber(chequeNumber.isBlank() ? 0 : Long.parseLong(chequeNumber));
        extracted_json.setParticulars(jsonObject.get("Particulars").toString());
        extracted_json.setDebit(debit.isBlank() ? 0 : Double.parseDouble(debit));
        extracted_json.setCredit(credit.isBlank() ? 0 : Double.parseDouble(credit));
        extracted_json.setBalance(balance.isBlank() ? 0 : Double.parseDouble(balance));
        extracted_json.setInit_Br(initBr.isBlank() ? 0 : Long.parseLong(initBr));
        return extracted_json;
    }

    private int getNumberOfDaysInMonth(int mm, int yyyy) {
        int days = 0;
        int[] days31 = new int[]{1, 3, 5, 8, 10, 12};
        int[] days30 = new int[]{4, 6, 7, 9, 11};
        //logic for leap year
        if (mm == 2) {
            if (yyyy % 4 == 0) {
                if (yyyy % 100 == 0) {
                    if (yyyy % 400 == 0)
                        return 29;
                    else
                        return 28;
                } else
                    return 29;
            } else
                return 28;
        }
        for (int m : days31) {
            if (mm == m)
                return 31;
        }
        for (int m : days30) {
            if (mm == m)
                return 30;
        }
        return days;
    }

    private String getMonth(int monthNumber) {
        switch (monthNumber) {
            case 1:
                return "JAN";
            case 2:
                return "FEB";
            case 3:
                return "MAR";
            case 4:
                return "APR";
            case 5:
                return "MAY";
            case 6:
                return "JUN";
            case 7:
                return "JUL";
            case 8:
                return "AUG";
            case 9:
                return "SEP";
            case 10:
                return "OCT";
            case 11:
                return "NOV";
            case 12:
                return "DEC";
        }
        return "INVALID MonthNumber";
    }

    private Map<Date, Double> getUniqueDateandBalance(List<Extracted_JSON> extracted_jsonList) throws ParseException {
        logger.info("Getting Monthwise Balance");
        Map<Date, Double> dateNbal = new HashMap<>();
        Date date = null;
        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
        for (int i = 0; i < extracted_jsonList.size(); i++) {
            if (extracted_jsonList.get(i).getTrans_Date().length() != 0) {
                date = formatter.parse(extracted_jsonList.get(i).getTrans_Date());
                dateNbal.put(date, extracted_jsonList.get(i).getBalance());
            }
        }
        return dateNbal;
    }

}
