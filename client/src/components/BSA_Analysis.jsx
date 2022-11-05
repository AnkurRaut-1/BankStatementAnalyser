import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import PieChart from './CategoryPieChart';
import LineChart from './MonthlyAvgBalanceLineChart';
import BarChart from './MonthlyBarChart';
import ReactToPrint from "react-to-print";

export default function BSA_Analyse(props, ref) {

    const componentRef = useRef();
    const [showPrintButton,setShowPrintButton] = useState(false);
    const [accountHoldersName, setAccountHoldersName] = useState('');
    const [showAccountHoldersName, setShowAccountHoldersName] = useState(false);
    const [emailAddress, setEmailAddress] = useState('');
    const [showEmailAddress, setShowEmailAddress] = useState(false);
    const [accountNumber, setAccountNumber] = useState('');
    const [showAccountNumber, setShowAccountNumber] = useState(false);
    const [customerId, setCustomerId] = useState('');
    const [showCustomerId, setShowCustomerId] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [showFromDate, setShowFromDate] = useState(false);
    const [toDate, setToDate] = useState('');
    const [showToDate, setShowToDate] = useState(false);
    const [showPersonalInfo, setShowPersonalInfo] = useState(false);
    const [monthsAndCredits, setMonthsAndCredits] = useState('');
    const [monthsAndDebits, setMonthsAndDebits] = useState('');
    const [monthsAndCreditsCount, setMonthsAndCreditsCount] = useState('');
    const [monthsAndDebitsCount, setMonthsAndDebitsCount] = useState('');
    const [monthlyAverageBalance, setMonthlyAverageBalance] = useState('');
    const [monthsAndBalance, setMonthsAndBalance] = useState('');
    const [smallCreditsTotal, setSmallCreditsTotal] = useState('');
    const [mediumCreditsTotal, setMediumCreditsTotal] = useState('');
    const [largeCreditsTotal, setLargeCreditsTotal] = useState('');
    const [smallDebitsTotal, setSmallDebitsTotal] = useState('');
    const [mediumDebitsTotal, setMediumDebitsTotal] = useState('');
    const [largeDebitsTotal, setLargeDebitsTotal] = useState('');
    const [smallCreditCount, setSmallCreditCount] = useState('');
    const [mediumCreditCount, setMediumCreditCount] = useState('');
    const [largeCreditCount, setLargeCreditCount] = useState('');
    const [smallDebitCount, setSmallDebitCount] = useState('');
    const [mediumDebitCount, setMediumDebitCount] = useState('');
    const [largeDebitCount, setLargeDebitCount] = useState('');
    let totalCreditCount = 0;
    let totalDebitCount = 0;
    let modeOfPaymentAndCreditValues = [];
    let modeOfPaymentAndDebitValues = [];
    const [creditModesOfPayment, setCreditModesOfPayment] = useState([]);
    const [debitModesOfPayment, setDebitModesOfPayment] = useState([]);
    const [openingBalance, setOpeningBalance] = useState('');
    const [closingBalance, setClosingBalance] = useState('');
    const [overallCredit, setOverallCredit] = useState('');
    const [highestCredits, setHighestCredits] = useState('');
    const [overallDebit, setOverallDebit] = useState('');
    const [highestDebits, setHighestDebits] = useState('');
    const [creditToDebitAmountRatio, setCreditToDebitAmountRatio] = useState('');
    const [numberOfTransactions, setNumberOfTransactions] = useState('');
    const [numberOfCreditTransactions, setNumberOfCreditTransactions] = useState('');
    const [numberOfDebitTransactions, setNumberOfDebitTransactions] = useState('');
    const [creditToDebitTransactionCountRatio, setCreditToDebitTransactionCountRatio] = useState('');
    const [creditCountOfIMPS, setCreditCountOfIMPS] = useState('');
    const [creditCountOfNEFT, setCreditCountOfNEFT] = useState('');
    const [creditCountOfInterest, setCreditCountOfInterest] = useState('');
    const [creditCountOfAutoTransaction, setCreditCountOfAutoTransaction] = useState('');
    const [creditCountOfUPI, setCreditCountOfUPI] = useState('');
    const [creditCountOfATMDeposit, setCreditCountOfATMDeposit] = useState('');
    const [creditCountOfCashDeposit, setCreditCountOfCashDeposit] = useState('');
    const [creditCountOfMisc, setCreditCountOfMisc] = useState('');
    const [debitCountOfATM, setDebitCountOfATM] = useState('');
    const [debitCountOfIMPSorNEFT, setDebitCountOfIMPSorNEFT] = useState('');
    const [debitCountOfUPI, setDebitCountOfUPI] = useState('');
    const [debitCountOfEMI, setDebitCountOfEMI] = useState('');
    const [debitCountOfBank, setDebitCountOfBank] = useState('');
    const [debitCountOfMisc, setDebitCountOfMisc] = useState('');
    const [averageBalance, setAverageBalance] = useState('');
    const [highestMonthlyAvg, setHighestMonthlyAvg] = useState('');
    const [lowestMonthlyAvg, setLowestMonthlyAvg] = useState('');
    const [inflowsIMPS, setInflowsIMPS] = useState(undefined);
    const [showInflowsIMPS, setShowInflowsIMPS] = useState(false);
    const [inflowsNEFT, setInflowsNEFT] = useState(undefined);
    const [showInflowsNEFT, setShowInflowsNEFT] = useState(false);
    const [inflowsUPI, setInflowsUPI] = useState(undefined);
    const [showInflowsUPI, setShowInflowsUPI] = useState(false);
    const [inflowsAutoTransactions, setInflowsAutoTransactions] = useState(undefined);
    const [showInflowsAutoTransactions, setShowInflowsAutoTransactions] = useState(false);
    const [inflowsInterest, setInflowsInterest] = useState(undefined);
    const [showInflowsInterest, setShowInflowsInterest] = useState(false);
    const [inflowsBulkPosting, setInflowsBulkPosting] = useState(undefined);
    const [showInflowsBulkPosting, setShowInflowsBulkPosting] = useState(false);
    const [outflowsATM, setOutflowsATM] = useState(undefined);
    const [showOutflowsATM, setShowOutflowsATM] = useState(false);
    const [outflowsIMPS, setOutflowsIMPS] = useState(undefined);
    const [showOutflowsIMPS, setShowOutflowsIMPS] = useState(false);
    const [outflowsUPI, setOutflowsUPI] = useState(undefined);
    const [showOutflowsUPI, setShowOutflowsUPI] = useState(false);
    const [outflowsEMI, setOutflowsEMI] = useState(undefined);
    const [showOutflowsEMI, setShowOutflowsEMI] = useState(false);
    const [outflowsInterest, setOutflowsInterest] = useState(undefined);
    const [showOutflowsInterest, setShowOutflowsInterest] = useState(false);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [showAdvancedSearchResult, setShowAdvancedSearchResult] = useState(false);
    const [searchIB, setSearchIB] = useState('');
    const [allParticulars, setAllParticulars] = useState([]);
    const [searchParticularCreditTotal, setSearchParticularCreditTotal] = useState(0);
    const [searchParticularDebitTotal, setSearchParticularDebitTotal] = useState(0);
    const [searchParticularCreditTotalCountArray, setSearchParticularCreditTotalCountArray] = useState([]);
    const [searchParticularDebitTotalCountArray, setSearchParticularDebitTotalCountArray] = useState([]);
    const [searchParticularCreditTotalCount, setSearchParticularCreditTotalCount] = useState(0);
    const [searchParticularDebitTotalCount, setSearchParticularDebitTotalCount] = useState(0);
    const [showChart__, setshowChart__] = useState(false);
    const formatter = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 });
    const switchBtn = document.querySelector('switchBtn');
    //for table
    const [searchedArray, setSearchedArray] = useState([]);
    const [amountSearchCredits, setAmountSearchCredits] = useState(0);
    const [amountSearchDebits, setAmountSearchDebits] = useState(0);
    let arraySearchCreditsMutable = [];
    let arraySearchDebitsMutable = [];
    let searchParticularsInputBox = document.getElementById('searchParticularsIb');
    const [searchParticularsValue, setSearchParticularsValue] = useState('');

    //for sending data in pie chart
    const [arraySearchCredits, setArraySearchCredits] = useState([]);
    const [arraySearchDebits, setArraySearchDebits] = useState([]);
    const [arraySearchPartculars, setArraySearchParticulars] = useState([]);
    //total amounts
    const [searchedArrayTotalCredit, setSearchedArrayTotalCredit] = useState(0);
    const [searchedArrayTotalDebit, setSearchedArrayTotalDebit] = useState(0);
    const advancedSearchBtn = () => {
        if (showAdvancedSearch === false) {
            setShowAdvancedSearch(true);
        } else {
            setShowAdvancedSearch(false);

        }
    }

    const switchBtnState = (e) => {
        if (e.target.checked) {
            toast("✅on");
        } else {
            toast("⛔️off");

        }
    }

    const particularsInputBox = (e) => {
        searchParticularsInputBox = document.getElementById('searchParticularsIb');
    }


    function isExist(particulars) {
        for (let i = 0; i < arraySearchPartculars.length; i++) {
            if (arraySearchPartculars[i].trim() == particulars.trim()) {
                return true;
            }
        }
        return false;
    }




    const addToChart = (e) => {

        if ((document.getElementById('searchParticularsIb').value).trim().toLowerCase() == '' || (searchedArrayTotalCredit == 0 && searchedArrayTotalDebit == 0)) {
            toast.warn("No Data to Add.");
        }
        else if (isExist((document.getElementById('searchParticularsIb').value).trim().toLowerCase())) {
            console.log("Exists");
            toast.warn("Data already exists.");
        }
        else {
            setSearchIB(document.getElementById('searchParticularsIb').value);
            arraySearchCredits.push(searchedArrayTotalCredit);
            arraySearchDebits.push(searchedArrayTotalDebit);
            arraySearchPartculars.push(document.getElementById('searchParticularsIb').value);
            toast.success("Added to Chart");

            let creditTotal = 0;
            arraySearchCredits.forEach((a) => {
                creditTotal += a;

            });
            let debitTotal = 0;
            arraySearchDebits.forEach((a) => {
                debitTotal += a;

            });
            setSearchParticularCreditTotal(creditTotal);
            setSearchParticularDebitTotal(debitTotal);

            let creditTotalCount = 0;
            let debitTotalCount = 0;
            searchParticularCreditTotalCountArray.forEach((a) => creditTotalCount += a);
            searchParticularDebitTotalCountArray.forEach((a) => debitTotalCount += a);
            setSearchParticularCreditTotalCount(creditTotalCount);
            setSearchParticularDebitTotalCount(debitTotalCount);


        }
    }




    const clearAdvancedSearch = () => {
        document.getElementById('searchParticularsIb').value = '';
        setSearchedArray([]);
        setSearchedArrayTotalCredit(0);
        setSearchedArrayTotalDebit(0);
        setArraySearchCredits([]);
        setArraySearchDebits([]);
        setArraySearchParticulars([]);
        setShowAdvancedSearchResult(false);
    }




    const searchByParticulars = () => {
        let sq = document.getElementById('searchParticularsIb').value;
        let arr = [];
        let arrCr = [];
        let arrDb = [];
        let crTotal = 0;
        let dbTotal = 0;
        if (sq.trim().length == 0) {
            toast.warn("Please, Enter value in Search Particulars");
        } else {
            allParticulars.forEach((i) => {
                let particulars = (i.particulars).toLowerCase();
                if (particulars.includes(sq.toLowerCase())) {
                    arr.push(i);
                    if (i.credit != 0) {
                        arrCr.push(i.credit);
                    }
                    if (i.debit != 0) {
                        arrDb.push(i.debit);
                    }
                }
            });
            if (arr.length == 0) {
                toast.warn(`No "${sq.trim()}" Data Found in File.`);
                arr = [];
                arrCr = [];
                arrDb = [];
            } else {
                setSearchedArray(arr.map(
                    (row) => {
                        return (
                            <tr>
                                <td>{row.trans_Date}</td>
                                <td>{row.particulars}</td>
                                <td className="text-end">{(row.debit == 0 ? "" : row.debit).toLocaleString('en-IN', {
                                    maximumFractionDigits: 2,
                                    style: 'currency',
                                    currency: 'INR'
                                })}</td>
                                <td className="text-end">{(row.credit == 0 ? "" : row.credit).toLocaleString('en-IN', {
                                    maximumFractionDigits: 2,
                                    style: 'currency',
                                    currency: 'INR'
                                })}</td>
                            </tr>
                        )
                    }
                ));
                let creditCount = searchParticularCreditTotalCount;
                let debitCount = searchParticularDebitTotalCount;
                arrCr.map((amount) => {
                    crTotal += amount;
                    creditCount += 1;
                });
                arrDb.map((amount) => {
                    dbTotal += amount;
                    debitCount += 1;
                });
                setSearchedArrayTotalCredit(crTotal);
                setSearchedArrayTotalDebit(dbTotal);
                searchParticularCreditTotalCountArray.push(creditCount);
                searchParticularDebitTotalCountArray.push(debitCount);
                setShowAdvancedSearchResult(true);
            }
        }
    }

    const goDefaultState = () => {
        setMonthsAndCredits(undefined);
        setMonthsAndDebits(undefined);
        setMonthsAndCreditsCount(undefined);
        setMonthsAndDebitsCount(undefined);
        setMonthsAndBalance(undefined);
        setSmallCreditsTotal(undefined);
        setMediumCreditsTotal(undefined);
        setLargeCreditsTotal(undefined);
        setSmallDebitsTotal(undefined);
        setMediumDebitsTotal(undefined);
        setLargeDebitsTotal(undefined);
        setSmallCreditCount(undefined);
        setMediumCreditCount(undefined);
        setLargeCreditCount(undefined);
        setSmallDebitCount(undefined);
        setMediumDebitCount(undefined);
        setLargeDebitCount(undefined);
        setCreditModesOfPayment(undefined);
        setDebitModesOfPayment(undefined);
        setOpeningBalance(undefined);
        setClosingBalance(undefined);
        setOverallCredit(undefined);
        setHighestCredits(undefined);
        setOverallDebit(undefined);
        setHighestDebits(undefined);
        setCreditToDebitAmountRatio(undefined);
        setNumberOfTransactions(undefined);
        setNumberOfCreditTransactions(undefined);
        setNumberOfDebitTransactions(undefined);
        setCreditToDebitTransactionCountRatio(undefined);
        setCreditCountOfIMPS(undefined);
        setCreditCountOfNEFT(undefined);
        setCreditCountOfInterest(undefined);
        setCreditCountOfAutoTransaction(undefined);
        setCreditCountOfUPI(undefined);
        setCreditCountOfATMDeposit(undefined);
        setCreditCountOfCashDeposit(undefined);
        setCreditCountOfMisc(undefined);
        setDebitCountOfATM(undefined);
        setDebitCountOfIMPSorNEFT(undefined);
        setDebitCountOfUPI(undefined);
        setDebitCountOfEMI(undefined);
        setDebitCountOfBank(undefined);
        setDebitCountOfMisc(undefined);
        setAverageBalance(undefined);
        setHighestMonthlyAvg(undefined);
        setLowestMonthlyAvg(undefined);
        setInflowsIMPS(undefined);
        setShowInflowsIMPS(undefined);
        setInflowsNEFT(undefined);
        setShowInflowsNEFT(undefined);
        setInflowsUPI(undefined);
        setShowInflowsUPI(undefined);
        setInflowsAutoTransactions(undefined);
        setShowInflowsAutoTransactions(undefined);
        setInflowsInterest(undefined);
        setShowInflowsInterest(undefined);
        setInflowsBulkPosting(undefined);
        setShowInflowsBulkPosting(undefined);
        setOutflowsATM(undefined);
        setShowOutflowsATM(undefined);
        setOutflowsIMPS(undefined);
        setShowOutflowsIMPS(undefined);
        setOutflowsUPI(undefined);
        setShowOutflowsUPI(undefined);
        setOutflowsEMI(undefined);
        setShowOutflowsEMI(undefined);
        setOutflowsInterest(undefined);
        setShowOutflowsInterest(undefined);
        setshowChart__(undefined);
        setshowChart__(false);
    }

    useEffect(() => {
        goDefaultState();
        if (props.response == undefined) {
            goDefaultState();
        } else {
            // console.log(props.response);
            setShowPrintButton(true);
            setAccountHoldersName(props.response.accountHolderName);
            setEmailAddress(props.response.emailAddress);
            setAccountNumber(props.response.accountNumber);
            setCustomerId(props.response.customerID);
            setFromDate(props.response.fromDate);
            setToDate(props.response.toDate);
            if ((props.response.accountHolderName) !== "NA") {
                setShowAccountHoldersName(true);
            } else {
                setShowAccountHoldersName(false);
            }
            if ((props.response.emailAddress) !== "NA") {
                setShowEmailAddress(true);
            } else {
                setShowEmailAddress(false);
            }
            if ((props.response.accountNumber) !== "NA") {
                setShowAccountNumber(true);
            } else {
                setShowAccountNumber(false);
            }
            if ((props.response.customerID) !== "NA") {
                setShowCustomerId(true);
            } else {
                setShowCustomerId(false);
            }
            if ((props.response.fromDate) !== "NA") {
                setShowFromDate(true);
            } else {
                setShowFromDate(false);
            }
            if ((props.response.toDate) !== "NA") {
                setShowToDate(true);
            } else {
                setShowToDate(false);
            }
            if ((props.response.accountHolderName) !== "NA" && (props.response.emailAddress) !== "NA"
                && (props.response.accountNumber) !== "NA" && (props.response.customerID) !== "NA"
                && (props.response.fromDate) !== "NA" && (props.response.toDate) !== "NA") {
                setShowPersonalInfo(true);
            } else {
                setShowPersonalInfo(false);
            }

            setMonthsAndCredits(JSON.stringify(props.response.monthsAndCredits));
            setMonthsAndDebits(JSON.stringify(props.response.monthsAndDebits))
            setMonthlyAverageBalance(JSON.stringify(props.response.monthlyAverageBalance));
            setMonthsAndBalance(JSON.stringify(props.response.monthsAndBalance));
            setMonthsAndCreditsCount(JSON.stringify(props.response.monthsAndCountOfCreditTransactions));
            setMonthsAndDebitsCount(JSON.stringify(props.response.monthsAndCountOfDebitTransactions));
            setSmallCreditsTotal((props.response.smallCreditsTotal));
            setMediumCreditsTotal((props.response.mediumCreditsTotal));
            setLargeCreditsTotal((props.response.largeCreditsTotal));
            setSmallDebitsTotal((props.response.smallDebitsTotal));
            setMediumDebitsTotal((props.response.mediumDebitsTotal));
            setLargeDebitsTotal((props.response.largeDebitsTotal));

            modeOfPaymentAndCreditValues.push(props.response.creditOfATMDeposit);
            modeOfPaymentAndCreditValues.push(props.response.creditOfIMPS);
            modeOfPaymentAndCreditValues.push(props.response.creditOfNEFT);
            modeOfPaymentAndCreditValues.push(props.response.creditOfUPI);
            modeOfPaymentAndCreditValues.push(props.response.creditOfCashDeposit);
            modeOfPaymentAndCreditValues.push(props.response.creditOfInterest);
            modeOfPaymentAndCreditValues.push(props.response.creditOfAutoTransaction);
            modeOfPaymentAndCreditValues.push(props.response.creditOfMisc);
            setCreditModesOfPayment(modeOfPaymentAndCreditValues);
            setCreditCountOfATMDeposit((props.response.creditCountOfATMDeposit));
            setCreditCountOfIMPS(props.response.creditCountOfIMPS);
            setCreditCountOfNEFT(props.response.creditCountOfNEFT);
            setCreditCountOfUPI(props.response.creditCountOfUPI);
            setCreditCountOfCashDeposit(props.response.creditCountOfCashDeposit);
            setCreditCountOfInterest(props.response.creditCountOfInterest);
            setCreditCountOfAutoTransaction(props.response.creditCountOfAutoTransaction);
            setCreditCountOfMisc(props.response.creditCountOfMisc);

            modeOfPaymentAndDebitValues.push(props.response.debitOfATM);
            modeOfPaymentAndDebitValues.push(props.response.debitOfIMPSorNEFT);
            modeOfPaymentAndDebitValues.push(props.response.debitOfUPI);
            modeOfPaymentAndDebitValues.push(props.response.debitOfEMI);
            modeOfPaymentAndDebitValues.push(props.response.debitOfBank);
            modeOfPaymentAndDebitValues.push(props.response.debitOfMisc);
            setDebitModesOfPayment(modeOfPaymentAndDebitValues);
            setDebitCountOfATM(props.response.debitCountOfATM);
            setDebitCountOfIMPSorNEFT(props.response.debitCountOfIMPSorNEFT);
            setDebitCountOfUPI(props.response.debitCountOfUPI);
            setDebitCountOfEMI(props.response.debitCountOfEMI);
            setDebitCountOfBank(props.response.debitCountOfBank);
            setDebitCountOfMisc(props.response.debitCountOfMisc);

            setOpeningBalance((props.response.openingBalance).toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                style: 'currency',
                currency: 'INR'
            }));
            setClosingBalance((props.response.closingBalance).toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                style: 'currency',
                currency: 'INR'
            }));
            setOverallCredit((props.response.overallCredit).toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                style: 'currency',
                currency: 'INR'
            }));
            setHighestCredits(JSON.stringify(props.response.highestCredits));
            setOverallDebit((props.response.overallDebit).toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                style: 'currency',
                currency: 'INR'
            }));
            setHighestDebits(JSON.stringify(props.response.highestDebits));
            setCreditToDebitAmountRatio((props.response.creditToDebitAmountRatio));

            setNumberOfTransactions((props.response.numberOfTransactions).toLocaleString('en-IN'));
            setNumberOfCreditTransactions((props.response.numberOfCreditTransactions).toLocaleString('en-IN'));
            setNumberOfDebitTransactions((props.response.numberOfDebitTransactions).toLocaleString('en-IN'));
            setCreditToDebitTransactionCountRatio(props.response.creditToDebitTransactionCountRatio);

            setSmallCreditCount((props.response.smallCreditCount));
            setMediumCreditCount((props.response.mediumCreditCount));
            setLargeCreditCount((props.response.largeCreditCount));
            setSmallDebitCount((props.response.smallDebitCount));
            setMediumDebitCount((props.response.mediumDebitCount));
            setLargeDebitCount((props.response.largeDebitCount));

            setAverageBalance((props.response.averageBalance).toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                style: 'currency',
                currency: 'INR'
            }));
            setHighestMonthlyAvg(JSON.stringify(props.response.highestMonthlyAvg));
            setLowestMonthlyAvg(JSON.stringify(props.response.lowestMonthlyAvg));

            if ((props.response.inflowsIMPS).length != 0)
                setShowInflowsIMPS(true);
            setInflowsIMPS(props.response.inflowsIMPS.sort((a, b) => b.credit - a.credit).slice(0, 10).map(
                (element) => {
                    return (
                        <tr>
                            <td>{element.trans_Date}</td>
                            <td>{element.particulars}</td>
                            <td className="text-end">{(element.credit).toLocaleString('en-IN', {
                                maximumFractionDigits: 2,
                                style: 'currency',
                                currency: 'INR'
                            })}</td>
                        </tr>
                    )
                }
            ));
            if ((props.response.inflowsNEFT).length != 0)
                setShowInflowsNEFT(true);
            setInflowsNEFT(props.response.inflowsNEFT.sort((a, b) => b.credit - a.credit).slice(0, 10).map(
                (element) => {
                    return (
                        <tr>
                            <td>{element.trans_Date}</td>
                            <td>{element.particulars}</td>
                            <td className="text-end">{(element.credit).toLocaleString('en-IN', {
                                maximumFractionDigits: 2,
                                style: 'currency',
                                currency: 'INR'
                            })}</td>
                        </tr>
                    )
                }
            ));
            if ((props.response.inflowsUPI).length != 0)
                setShowInflowsUPI(true);
            setInflowsUPI(props.response.inflowsUPI.sort((a, b) => b.credit - a.credit).slice(0, 10).map(
                (element) => {
                    return (
                        <tr>
                            <td>{element.trans_Date}</td>
                            <td>{element.particulars}</td>
                            <td className="text-end">{(element.credit).toLocaleString('en-IN', {
                                maximumFractionDigits: 2,
                                style: 'currency',
                                currency: 'INR'
                            })}</td>
                        </tr>
                    )
                }
            ));
            if ((props.response.inflowsInterest).length != 0)
                setShowInflowsInterest(true);
            setInflowsInterest(props.response.inflowsInterest.sort((a, b) => b.credit - a.credit).slice(0, 10).map(
                (element) => {
                    return (
                        <tr>
                            <td>{element.trans_Date}</td>
                            <td>{element.particulars}</td>
                            <td className="text-end">{(element.credit).toLocaleString('en-IN', {
                                maximumFractionDigits: 2,
                                style: 'currency',
                                currency: 'INR'
                            })}</td>
                        </tr>
                    )
                }
            ));

            if ((props.response.outflowsATM).length != 0)
                setShowOutflowsATM(true);
            setOutflowsATM(props.response.outflowsATM.sort((a, b) => b.debit - a.debit).slice(0, 10).map(
                (element) => {
                    return (
                        <tr>
                            <td>{element.trans_Date}</td>
                            <td>{element.particulars}</td>
                            <td className="text-end">{(element.debit).toLocaleString('en-IN', {
                                maximumFractionDigits: 2,
                                style: 'currency',
                                currency: 'INR'
                            })}</td>
                        </tr>
                    )
                }
            ));

            if ((props.response.outflowsIMPS).length != 0)
                setShowOutflowsIMPS(true);
            setOutflowsIMPS(props.response.outflowsIMPS.sort((a, b) => b.debit - a.debit).slice(0, 10).map(
                (element) => {
                    return (
                        <tr>
                            <td>{element.trans_Date}</td>
                            <td>{element.particulars}</td>
                            <td className="text-end">{(element.debit).toLocaleString('en-IN', {
                                maximumFractionDigits: 2,
                                style: 'currency',
                                currency: 'INR'
                            })}</td>
                        </tr>
                    )
                }
            ));

            if ((props.response.outflowsUPI).length != 0)
                setShowOutflowsUPI(true);
            setOutflowsUPI(props.response.outflowsUPI.sort((a, b) => b.debit - a.debit).slice(0, 10).map(
                (element) => {
                    return (
                        <tr>
                            <td>{element.trans_Date}</td>
                            <td>{element.particulars}</td>
                            <td className="text-end">{(element.debit).toLocaleString('en-IN', {
                                maximumFractionDigits: 2,
                                style: 'currency',
                                currency: 'INR'
                            })}</td>
                        </tr>
                    )
                }
            ));

            if ((props.response.outflowsEMI).length != 0)
                setShowOutflowsEMI(true);
            setOutflowsEMI(props.response.outflowsEMI.sort((a, b) => b.debit - a.debit).slice(0, 10).map(
                (element) => {
                    return (
                        <tr>
                            <td>{element.trans_Date}</td>
                            <td>{element.particulars}</td>
                            <td className="text-end">{(element.debit).toLocaleString('en-IN', {
                                maximumFractionDigits: 2,
                                style: 'currency',
                                currency: 'INR'
                            })}</td>
                        </tr>
                    )
                }
            ));

            if ((props.response.outflowsInterest).length != 0)
                setShowOutflowsInterest(true);
            setOutflowsInterest(props.response.outflowsInterest.sort((a, b) => b.debit - a.debit).slice(0, 10).map(
                (element) => {
                    return (
                        <tr>
                            <td>{element.trans_Date}</td>
                            <td>{element.particulars}</td>
                            <td className="text-end">{(element.debit).toLocaleString('en-IN', {
                                maximumFractionDigits: 2,
                                style: 'currency',
                                currency: 'INR'
                            })}</td>
                        </tr>
                    )
                }
            ));

            setAllParticulars(Object.values(props.response.allParticularsData));
            setshowChart__(true);
        }
    }, [props]);

    return (
        <div>
            {showPrintButton && <ReactToPrint
                trigger={() => <button className='ms-3 btn btn-dark border-0 hover-shadow mt-4 ' data-toggle="tooltip" data-placement="bottom" title="Print" ><i class="fa fa-print" aria-hidden="true"></i>&nbsp;Print</button>}
                content={() => componentRef.current}
            />}
            {showChart__ &&
                <div className='d-flex flex-column flex-wrap px-3' ref={componentRef} >
                    <hr />
                    <label htmlFor='Catsize ' ><h5>PERSONAL INFORMATION</h5></label>
                    <br />
                    <div className='d-flex flex-wrap personal_Info_div mt-2'>
                        <table className='table table-striped table-hover'>
                            <tbody>
                                {showAccountHoldersName && <tr>
                                    <td>Account Holder's Name</td>
                                    <td><h6>: {accountHoldersName}</h6></td>
                                </tr>}
                                {showEmailAddress && <tr>
                                    <td>E-mail Address</td>
                                    <td><h6>: {emailAddress}</h6></td>
                                </tr>}
                                {showAccountNumber && <tr>
                                    <td>Account Number</td>
                                    <td><h6>: {accountNumber}</h6></td>
                                </tr>}
                                {showCustomerId && <tr>
                                    <td>Customer ID</td>
                                    <td><h6>: {customerId}</h6></td>
                                </tr>}
                                {showFromDate && showToDate &&
                                    <tr>
                                        <td>Statement Period</td>
                                        <td><h6>: From {fromDate} To {toDate}</h6></td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        {showPersonalInfo && <p>No Personal Information.</p>}
                    </div>

                    <hr />
                    <label htmlFor='Catsize ' ><h5>OVERVIEW OF TRANSACTIONS</h5></label>
                    <br />
                    <div className='d-flex flex-column flex-wrap mt-2' >
                        <div className='d-flex flex-wrap flex-dir-change justify-content-around'>
                            <h6>Opening Balance:<big> {openingBalance} </big></h6>
                            <h6>Closing Balance:<big> {closingBalance} </big></h6>
                        </div>
                        <br />
                        <div className='d-flex flex-wrap flex-row justify-content-around '>
                            <div className="d-flex flex-column flex-wrap card m-3" >
                                <br />
                                <h6>All Transactions Over Time (in Rs.)</h6>
                                <br />
                                <BarChart type="monthwiseCrDb" creditData={monthsAndCredits} debitData={monthsAndDebits} />
                            </div>

                            <div className="d-flex flex-column flex-wrap card m-3" >
                                <br />
                                <h6>Count Of All Transactions</h6>
                                <br />
                                <BarChart type="monthwiseCrDb" creditData={monthsAndCreditsCount} debitData={monthsAndDebitsCount} />
                            </div>
                        </div>
                        <br />
                        <div className='d-flex flex-wrap flex-row justify-content-around'>
                            <div className='d-flex flex-wrap'>
                                <table className="table  table-striped    table-hover">
                                    <tbody>
                                        <tr>
                                            <td>Overall Credits</td>
                                            <td>: {overallCredit}</td>
                                        </tr>
                                        <tr>
                                            <td>Highest Credits</td>
                                            <td>: {Object.values(JSON.parse(highestCredits)).toLocaleString('en-IN', {
                                                maximumFractionDigits: 2,
                                                style: 'currency',
                                                currency: 'INR'
                                            })} in {Object.keys(JSON.parse(highestCredits))}</td>
                                        </tr>
                                        <tr>
                                            <td>Overall Debits</td>
                                            <td>: {overallDebit}</td>
                                        </tr>
                                        <tr>
                                            <td>Highest Debits</td>
                                            <td>: {Object.values(JSON.parse(highestDebits)).toLocaleString('en-IN', {
                                                maximumFractionDigits: 2,
                                                style: 'currency',
                                                currency: 'INR'
                                            })} in {Object.keys(JSON.parse(highestDebits))}</td>
                                        </tr>

                                        <tr>
                                            <td>Credit : Debit Amount Ratio</td>
                                            <td>: {creditToDebitAmountRatio}</td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>

                            <div className='d-flex flex-wrap'>
                                <table className="table  table-striped    table-hover">
                                    <tbody>
                                        <tr>
                                            <td>Total No. of Transactions</td>
                                            <td>: {numberOfTransactions}</td>
                                        </tr>
                                        <tr>
                                            <td>No. of Credit Transactions</td>
                                            <td>: {numberOfCreditTransactions}</td>
                                        </tr>
                                        <tr>
                                            <td>No. of Debit Transactions</td>
                                            <td>: {numberOfDebitTransactions}</td>
                                        </tr>
                                        <tr>
                                            <td>Debit : Credit Count Ratio</td>
                                            <td>: {creditToDebitTransactionCountRatio}</td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className='d-flex flex-wrap flex-row justify-content-around'>
                            <div className="d-flex flex-column flex-wrap card m-3 " >
                                <br />
                                <h6>Monthly Average Balance</h6>
                                <br />
                                <LineChart type="monthwiseAverage" data={monthlyAverageBalance} data_={monthsAndBalance} />
                            </div>
                            <div className='align-self-center'>
                                <table className='table table-striped table-hover'>
                                    <tbody>
                                        <tr>
                                            <td>Overall Average Balance</td>
                                            <td>:   {averageBalance}</td>
                                        </tr>
                                        <tr>
                                            <td>Highest Monthly Average Balance</td>
                                            <td>:   {Object.values(JSON.parse(highestMonthlyAvg)).toLocaleString('en-IN', {
                                                maximumFractionDigits: 2,
                                                style: 'currency',
                                                currency: 'INR'
                                            })} in {Object.keys(JSON.parse(highestMonthlyAvg))}</td>

                                        </tr>
                                        <tr>
                                            <td>Lowest Monthly Average Balance</td>
                                            <td>:   {Object.values(JSON.parse(lowestMonthlyAvg)).toLocaleString('en-IN', {
                                                maximumFractionDigits: 2,
                                                style: 'currency',
                                                currency: 'INR'
                                            })} in {Object.keys(JSON.parse(lowestMonthlyAvg))}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <label htmlFor='Catsize ' ><h5>TRANSACTIONS CATEGORISED BY TRANSACTION SIZE</h5></label>
                    <br />
                    <div id='Catsize' className='d-flex flex-wrap'>
                        <div className='d-flex flex-wrap flex-row justify-content-around w-100 mt-2'>
                            <div className="d-flex flex-column flex-wrap card pieChartcard m-3" >
                                <br />
                                <h6>Credits(in Rs.)</h6>
                                <br />
                                <PieChart categorizedBy={"size"} sm={smallCreditsTotal} md={mediumCreditsTotal} lg={largeCreditsTotal} />
                            </div>
                            <div className="d-flex flex-column flex-wrap card pieChartcard m-3" >
                                <br />
                                <h6>Debits(in Rs.)</h6>
                                <br />
                                <PieChart categorizedBy={"size"} sm={smallDebitsTotal} md={mediumDebitsTotal} lg={largeDebitsTotal} />
                            </div>
                        </div>
                        <div className='d-flex flex-wrap flex-row justify-content-around w-100 '>
                            <div>
                                <table className='table table-striped    table-hover'>
                                    <tbody>
                                        <tr>
                                            <td>Total Credit value</td>
                                            <td>:   {overallCredit}</td>
                                        </tr>
                                        <tr>
                                            <td><small><ul><li>Small at {(smallCreditsTotal).toLocaleString('en-IN', {
                                                maximumFractionDigits: 2,
                                                style: 'currency',
                                                currency: 'INR'
                                            })}</li><li>Medium at   {(mediumCreditsTotal).toLocaleString('en-IN', {
                                                maximumFractionDigits: 2,
                                                style: 'currency',
                                                currency: 'INR'
                                            })}</li></ul></small></td>
                                            <td><small><ul><li>Large at   {(largeCreditsTotal).toLocaleString('en-IN', {
                                                maximumFractionDigits: 2,
                                                style: 'currency',
                                                currency: 'INR'
                                            })}</li></ul></small></td>
                                        </tr>
                                        <tr>
                                            <td>Total Credit count</td>
                                            <td>: {(smallCreditCount + mediumCreditCount + largeCreditCount).toLocaleString('en-IN')}</td>
                                        </tr>
                                        <tr>
                                            <td><small><ul><li>Small at ({(smallCreditCount).toLocaleString('en-IN')}) times</li><li>Medium at ({(mediumCreditCount).toLocaleString('en-IN')}) times</li></ul></small></td>
                                            <td><small><ul><li>Large at ({(largeCreditCount).toLocaleString('en-IN')}) times</li></ul></small></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <table className='table table-striped    table-hover'>
                                    <tbody>
                                        <tr>
                                            <td>Total Debit value</td>
                                            <td>:   {overallDebit}</td>
                                        </tr>
                                        <tr>
                                            <td><small><ul><li>Small at   {(smallDebitsTotal).toLocaleString('en-IN', {
                                                maximumFractionDigits: 2,
                                                style: 'currency',
                                                currency: 'INR'
                                            })}</li><li>Medium at   {(mediumDebitsTotal).toLocaleString('en-IN', {
                                                maximumFractionDigits: 2,
                                                style: 'currency',
                                                currency: 'INR'
                                            })}</li></ul></small></td>
                                            <td><small><ul><li>Large at   {(largeDebitsTotal).toLocaleString('en-IN', {
                                                maximumFractionDigits: 2,
                                                style: 'currency',
                                                currency: 'INR'
                                            })}</li></ul></small></td>
                                        </tr>
                                        <tr>
                                            <td>Total Debit count</td>
                                            <td>: {(smallDebitCount + mediumDebitCount + largeDebitCount).toLocaleString('en-IN')}</td>
                                        </tr>
                                        <tr>
                                            <td><small><ul><li>Small at ({(smallDebitCount).toLocaleString('en-IN')}) times</li><li>Medium at ({(mediumDebitCount).toLocaleString('en-IN')}) times</li></ul></small></td>
                                            <td><small><ul><li>Large at ({(largeDebitCount).toLocaleString('en-IN')}) times</li></ul></small></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <hr />
                    <label htmlFor='CatMode' ><h5>TRANSACTIONS CATEGORISED BY MODE OF PAYMENT</h5></label>
                    <br />
                    <div id='CatMode' className='d-flex flex-wrap mt-2'>
                        <div className='d-flex flex-wrap flex-row justify-content-around w-100'>
                            <div className="d-flex flex-column flex-wrap card pieChartcard m-3" >
                                <br />
                                <h6>Credits(in Rs.)</h6>
                                <br />
                                <PieChart categorizedBy={"modeOfPaymentCredit"} data={creditModesOfPayment} />
                            </div>
                            <div className="d-flex flex-column flex-wrap pieChartcard card m-3" >
                                <br />
                                <h6>Debits(in Rs.)</h6>
                                <br />
                                <PieChart categorizedBy={"modeOfPaymentDebit"} data={debitModesOfPayment} />
                            </div>
                        </div>
                        <div className='d-flex flex-wrap flex-row justify-content-around w-100'>
                            <div>
                                <table className='table table-striped   table-hover'>
                                    <tbody>
                                        <tr>
                                            <td>Total Credit value</td>
                                            <td>:   {overallCredit}</td>
                                        </tr>
                                        <tr>
                                            <td>Total Credit count</td>
                                            <td>: {(creditCountOfATMDeposit + creditCountOfIMPS + creditCountOfNEFT + creditCountOfUPI +
                                                creditCountOfCashDeposit + creditCountOfInterest + creditCountOfAutoTransaction + creditCountOfMisc).toLocaleString('en-IN')
                                            }</td>
                                        </tr>
                                        <tr>
                                            <td><small><ul><li>ATM at ({(creditCountOfATMDeposit).toLocaleString('en-IN')}) times</li><li>IMPS at ({(creditCountOfIMPS).toLocaleString('en-IN')}) times</li><li>NEFT at ({(creditCountOfNEFT).toLocaleString('en-IN')}) times</li><li>UPI at ({(creditCountOfUPI).toLocaleString('en-IN')}) times</li></ul></small></td>
                                            <td><small><ul><li>CASH Deposit at ({(creditCountOfCashDeposit).toLocaleString('en-IN')}) times</li><li>Interest at ({(creditCountOfInterest).toLocaleString('en-IN')}) times</li><li>Auto Transaction at ({(creditCountOfAutoTransaction).toLocaleString('en-IN')}) times</li><li>Misc. at ({(creditCountOfMisc).toLocaleString('en-IN')}) times</li></ul></small></td>

                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <table className='table table-striped   table-hover'>
                                    <tbody>
                                        <tr>
                                            <td>Total Debit value</td>
                                            <td>:   {overallDebit}</td>
                                        </tr>
                                        <tr>
                                            <td>Total Debit count</td>
                                            <td>: {(debitCountOfATM + debitCountOfIMPSorNEFT + debitCountOfUPI + debitCountOfEMI + debitCountOfBank + debitCountOfMisc).toLocaleString('en-IN')}</td>
                                        </tr>
                                        <tr>
                                            <td><small><ul><li>ATM at ({(debitCountOfATM).toLocaleString('en-IN')}) times</li><li>IMPS/NEFT ({(debitCountOfIMPSorNEFT).toLocaleString('en-IN')}) times</li><li>UPI ({(debitCountOfUPI).toLocaleString('en-IN')}) times</li></ul></small></td>
                                            <td><small><ul><li>EMI at ({(debitCountOfEMI).toLocaleString('en-IN')}) times</li><li>By Bank ({(debitCountOfBank).toLocaleString('en-IN')}) times</li><li>Misc. ({(debitCountOfMisc).toLocaleString('en-IN')}) times</li></ul></small></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <hr />
                    <div id='CatMode' className='d-flex flex-wrap'>
                        <a className='advancedSearchBtn' onClick={advancedSearchBtn}  ><h5>Advanced Search</h5></a>
                        {showAdvancedSearch &&
                            <div id='advancedSearchDiv' className='d-flex flex-wrap w-100'>
                                <div className='d-flex flex-row flex-wrap justify-content-between w-100 mt-3 mb-3'>
                                    <div className='d-flex flex-row flex wrap justify-content-between avdanced_Search_LeftDiv'>
                                        <input className='form-control' type='text' placeholder='Search Particulars' id='searchParticularsIb' />
                                        <button className='btn btn-outline-primary ms-2' onClick={() => searchByParticulars()}><i class="fa fa-search" aria-hidden="true">&nbsp;Search</i></button>
                                        <button className='btn btn-outline-warning ms-2' onClick={clearAdvancedSearch}>Clear</button>
                                    </div>
                                    <div className='ms-2 me-3 mt-2 align-self-center'>
                                        <button className='ms-2 btn btn-outline-primary align-self-center' onClick={(e) => addToChart()}><i class="fa fa-pie-chart" aria-hidden="true">&nbsp;Add to Chart</i></button>
                                    </div>
                                </div>
                                {showAdvancedSearchResult &&
                                    <div className='ank flex-fill mt-2 justify-content-center'>
                                        <table className='table table-striped input_output_table'>
                                            <thead>
                                                <tr>
                                                    <th>Trans. Date </th>
                                                    <th>Particulars </th>
                                                    <th className="text-end">Debits </th>
                                                    <th className="text-end">Credits </th>

                                                </tr>
                                            </thead>
                                            <tbody>{searchedArray}</tbody>
                                            <tfoot>
                                                <tr>
                                                    <td></td>
                                                    <td>Total</td>
                                                    <td className="text-end">{searchedArrayTotalDebit.toLocaleString('en-IN', {
                                                        maximumFractionDigits: 2,
                                                        style: 'currency',
                                                        currency: 'INR'
                                                    })}</td>
                                                    <td className="text-end">{searchedArrayTotalCredit.toLocaleString('en-IN', {
                                                        maximumFractionDigits: 2,
                                                        style: 'currency',
                                                        currency: 'INR'
                                                    })}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                }
                                {showAdvancedSearchResult &&
                                    <div className='d-flex flex-wrap flex-row justify-content-around w-100'>
                                        <div className="d-flex flex-column flex-wrap card pieChartcard m-3" >
                                            <br />
                                            <h6>Credits(in Rs.)</h6>
                                            <br />
                                            <PieChart categorizedBy={"modeOfPaymentCredit"} arrayType='newMode' data={creditModesOfPayment} newModeData={arraySearchCredits} modeName={arraySearchPartculars} />
                                        </div>
                                        <div className="d-flex flex-column flex-wrap pieChartcard card m-3" >
                                            <br />
                                            <h6>Debits(in Rs.)</h6>
                                            <br />
                                            <PieChart categorizedBy={"modeOfPaymentDebit"} arrayType='newMode' data={debitModesOfPayment} newModeData={arraySearchDebits} modeName={arraySearchPartculars} />
                                        </div>
                                    </div>
                                }
                                {showAdvancedSearchResult &&
                                    <div className='d-flex flex-wrap flex-row justify-content-around w-100'>
                                        <div>
                                            <table className='table table-striped   table-hover'>
                                                <tbody>
                                                    <tr>
                                                        <td>Total Credit value</td>
                                                        <td>:   {(searchParticularCreditTotal).toLocaleString('en-IN', {
                                                            maximumFractionDigits: 2,
                                                            style: 'currency',
                                                            currency: 'INR'
                                                        })}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Credit count</td>
                                                        <td>: {(searchParticularCreditTotalCount).toLocaleString('en-IN')}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div>
                                            <table className='table table-striped   table-hover'>
                                                <tbody>
                                                    <tr>
                                                        <td>Total Debit value</td>
                                                        <td>:   {(searchParticularDebitTotal).toLocaleString('en-IN', {
                                                            maximumFractionDigits: 2,
                                                            style: 'currency',
                                                            currency: 'INR'
                                                        })}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Debit count</td>
                                                        <td>: {(searchParticularDebitTotalCount).toLocaleString('en-IN')}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                    </div>

                    <div className='inflowOutflowDataDiv'>
                        <hr />
                        <label htmlFor='inout' ><h5>INFLOW ANALYSIS</h5></label><br />
                        <div className='d-flex flex-wrap flex-column justify-content-center mt-3' style={{ 'width': '95%', 'marginLeft': 'auto', 'marginRight': 'auto' }}>
                            {/* <div className='d-flex flex-wrap flex-row justify-content-center flex-grow-1'> */}

                            {showInflowsIMPS &&
                                <div className='ank flex-fill mt-2 justify-content-center'>
                                    <center className='bg-dark text-light'>IMPS</center>
                                    <table className='table table-striped table-hover table-responsive input_output_table '>
                                        <thead>
                                            <tr>
                                                <th>Trans. Date </th>
                                                <th>Particulars </th>
                                                <th className="text-end">Amount </th>
                                            </tr>
                                        </thead>
                                        <tbody>{inflowsIMPS}</tbody>
                                    </table>
                                </div>
                            }
                            {showInflowsNEFT &&
                                <div className='ank flex-fill mt-2 justify-content-center    '>
                                    <center className='bg-dark text-light'>NEFT</center>
                                    <table className='table table-striped  table-hover table-responsive input_output_table'>
                                        <thead>
                                            <tr>
                                                <th>Trans. Date </th>
                                                <th>Particulars </th>
                                                <th className="text-end">Amount </th>
                                            </tr>
                                        </thead>
                                        <tbody>{inflowsNEFT}</tbody>
                                    </table>
                                </div>
                            }
                            {showInflowsUPI &&
                                <div className='ank flex-fill mt-2 justify-content-center'>
                                    <center className='bg-dark text-light'>UPI</center>
                                    <table className='table table-striped input_output_table table-responsive  table-hover' >
                                        <thead>
                                            <tr>
                                                <th>Trans. Date </th>
                                                <th>Particulars </th>
                                                <th className="text-end">Amount </th>
                                            </tr>
                                        </thead>
                                        <tbody>{inflowsUPI}</tbody>
                                    </table>
                                </div>
                            }
                            {showInflowsInterest &&
                                <div className='ank flex-fill mt-2 justify-content-center'>
                                    <center className='bg-dark text-light'>Interest</center>
                                    <table className='table table-striped input_output_table table-responsive  table-hover'>
                                        <thead>
                                            <tr>
                                                <th>Trans. Date </th>
                                                <th>Particulars </th>
                                                <th className="text-end">Amount </th>
                                            </tr>
                                        </thead>
                                        <tbody>{inflowsInterest}</tbody>
                                    </table>
                                </div>
                            }
                        </div>

                        <hr />
                        <label htmlFor='inout' ><h5>OUTFLOW ANALYSIS</h5></label><br />
                        <div className='d-flex flex-wrap flex-column justify-content-center mt-3' style={{ 'width': '95%', 'marginLeft': 'auto', 'marginRight': 'auto' }}>
                            {showOutflowsATM &&
                                <div className='ank flex-fill mt-2 justify-content-center'>
                                    <center className='bg-dark text-light'>ATM</center>
                                    <table className='table table-striped input_output_table table-responsive table-hover'>
                                        <thead>
                                            <tr>
                                                <th>Trans. Date</th>
                                                <th>Particulars</th>
                                                <th className="text-end">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>{outflowsATM}</tbody>
                                    </table>
                                </div>
                            }
                            {showOutflowsIMPS &&
                                <div className='ank flex-fill mt-2 justify-content-center'>
                                    <center className='bg-dark text-light'>IMPS</center>
                                    <table className='table table-striped input_output_table table-responsive table-hover'>
                                        <thead>
                                            <tr>
                                                <th>Trans. Date </th>
                                                <th>Particulars </th>
                                                <th className="text-end">Amount </th>
                                            </tr>
                                        </thead>
                                        <tbody>{outflowsIMPS}</tbody>
                                    </table>
                                </div>
                            }
                            {showOutflowsEMI &&
                                <div className='ank flex-fill mt-2 justify-content-center'>
                                    <center className='bg-dark text-light'>EMI</center>
                                    <table className='table table-striped input_output_table table-responsive table-hover'>
                                        <thead>
                                            <tr>
                                                <th>Trans. Date </th>
                                                <th>Particulars </th>
                                                <th className="text-end">Amount </th>
                                            </tr>
                                        </thead>
                                        <tbody>{outflowsEMI}</tbody>
                                    </table>
                                </div>
                            }
                            {showOutflowsInterest &&
                                <div className='ank flex-fill mt-2 justify-content-center'>
                                    <center className='bg-dark text-light'>Interest</center>
                                    <table className='table table-striped input_output_table table-responsive table-hover'>
                                        <thead>
                                            <tr>
                                                <th>Trans. Date </th>
                                                <th>Particulars </th>
                                                <th className="text-end">Amount </th>
                                            </tr>
                                        </thead>
                                        <tbody>{outflowsInterest}</tbody>
                                    </table>
                                </div>
                            }
                            {showOutflowsUPI &&
                                <div className='ank flex-fill mt-2 justify-content-center'>
                                    <center className='bg-dark text-light'>UPI</center>
                                    <table className='table table-striped input_output_table table-responsive table-hover'>
                                        <thead>
                                            <tr>
                                                <th>Trans. Date </th>
                                                <th>Particulars </th>
                                                <th className="text-end">Amount </th>
                                            </tr>
                                        </thead>
                                        <tbody>{outflowsUPI}</tbody>
                                    </table>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}