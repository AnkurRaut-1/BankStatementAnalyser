package com.example.bank_statement_analysis.model;

import lombok.*;

import java.util.ArrayList;
import java.util.Map;

@Data
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class BSA_Report {

    //Personal Information
    private String accountHolderName = "NA";
    private String accountNumber = "NA";
    private String emailAddress = "NA";
    private String customerID = "NA";
    private String fromDate = "NA";
    private String toDate = "NA";

    //OVERVIEW OF TRANSACTIONS
    private double openingBalance;
    private double closingBalance;

    //All Transactions Over Time (in Rs.)
    private Map<String, Double> monthsAndCredits;
    private Map<String, Double> monthsAndDebits;
    private double overallCredit;
    private Map<String, Double> highestCredits;
    private double overallDebit;
    private Map<String, Double> highestDebits;
    private String creditToDebitAmountRatio;
    //Count Of All Transactions
    private Map<String, Integer> monthsAndCountOfCreditTransactions;
    private Map<String, Integer> monthsAndCountOfDebitTransactions;
    private int numberOfTransactions;
    private int numberOfCreditTransactions;
    private int numberOfDebitTransactions;
    private String creditToDebitTransactionCountRatio;
    //Monthly Average Balance
    private Map<String, Double> monthlyAverageBalance;
    private Map<String, Double> monthsAndBalance;
    private double averageBalance;
    private Map<String, Double> highestMonthlyAvg;
    private Map<String, Double> lowestMonthlyAvg;

    //TRANSACTIONS CATEGORISED BY TRANSACTION SIZE small(<Rs.2,000), medium(Rs.2,000-Rs.10,000), large(>Rs.10,000)
    //Credits(in Rs.)
    private double smallCreditsTotal;
    private double mediumCreditsTotal;
    private double largeCreditsTotal;
    private int smallCreditCount;
    private int mediumCreditCount;
    private int largeCreditCount;
    //Debits(in Rs.)
    private double smallDebitsTotal;
    private double mediumDebitsTotal;
    private double largeDebitsTotal;
    private int smallDebitCount;
    private int mediumDebitCount;
    private int largeDebitCount;

    //TRANSACTIONS CATEGORISED BY MODE OF PAYMENT Debit(ATM,IMPS/NEFT,UPI,Misc.) Credit(IMPS/NEFT,UPI,Misc.,Interest,Auto Transaction)
    //Credits(in Rs.)
    private double creditOfIMPS;
    private double creditOfNEFT;
    private double creditOfInterest;
    private double creditOfAutoTransaction;
    private double creditOfUPI;
    private double creditOfATMDeposit;
    private double creditOfCashDeposit;
    private double creditOfMisc;
    private int creditCountOfIMPS;
    private int creditCountOfNEFT;
    private int creditCountOfInterest;
    private int creditCountOfAutoTransaction;
    private int creditCountOfUPI;
    private int creditCountOfATMDeposit;
    private int creditCountOfCashDeposit;
    private int creditCountOfMisc;
    //Debits(in Rs.)
    private double debitOfATM;
    private double debitOfIMPSorNEFT;
    private double debitOfUPI;
    private double debitOfEMI;
    private double debitOfBank;
    private double debitOfMisc;
    private int debitCountOfATM;
    private int debitCountOfIMPSorNEFT;
    private int debitCountOfUPI;
    private int debitCountOfEMI;
    private int debitCountOfBank; //includes Cheque, Interest
    private int debitCountOfMisc;

    //Advanced Search
    private ArrayList<Extracted_JSON> allParticularsData;

    //INFLOW ANALYSIS
    private ArrayList<Extracted_JSON> inflowsIMPS;
    private ArrayList<Extracted_JSON> inflowsNEFT;
    private ArrayList<Extracted_JSON> inflowsUPI;
    private ArrayList<Extracted_JSON> inflowsAutoTransactions;
    private ArrayList<Extracted_JSON> inflowsInterest;
    private ArrayList<Extracted_JSON> inflowsBulkPosting;
    //OUTFLOW ANALYSIS
    private ArrayList<Extracted_JSON> outflowsATM;
    private ArrayList<Extracted_JSON> outflowsIMPS;
    private ArrayList<Extracted_JSON> outflowsUPI;
    private ArrayList<Extracted_JSON> outflowsEMI;
    private ArrayList<Extracted_JSON> outflowsInterest;


    //FOR FUTURE UPDATE
//    private String bankName;
//    private int statementPeriodInMonths;
//    private int totalRecurringCredits;
//    private int totalRecurringDebits;
//    private Map<String,Double> highestBalance;
//    private int monthsWhereCreditGreaterThanDebit;
//    private int monthsWhereDebitGreaterThanCredit;
//    private Map<String,Double> monthAndHighestBalance;
//    private Map<String,Double> monthAndLowestBalance;
//    private Map<String,Double> monthAndHighestCredit;
//    private Map<String,Double> monthAndLowestCredit;
//    private Map<String,Double> monthAndHighestDebit;
//    private Map<String,Double> monthAndLowestDebit;
//    private double averageChangePerMonth;
//    private Map<String,Integer> monthAndMaxNumberOfCreditTransaction;   //from monthsAndCountOfCreditTransactions
//    private Map<String,Integer> monthAndMinNumberOfCreditTransaction;   //from monthsAndCountOfCreditTransactions
//    private Map<String,Integer> monthAndMaxNumberOfDebitTransaction;   //from monthsAndCountOfDebitTransactions
//    private Map<String,Integer> monthAndMinNumberOfDebitTransaction;   //from monthsAndCountOfDebitTransactions
    private String id;

}
