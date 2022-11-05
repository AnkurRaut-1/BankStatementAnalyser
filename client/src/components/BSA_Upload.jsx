import React, { useState } from 'react';
import UploadService from "../services/upload-files.service";
import BSA_Analyse from './BSA_Analysis';
import PieChart from './CategoryPieChart';
import LineChart from './MonthlyAvgBalanceLineChart';
import BarChart from './MonthlyBarChart';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastBody } from 'react-bootstrap';
import Loader from './Loader';

export default function BSA_Upload() {
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(true);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [sendResponse, setSendResponse] = useState(undefined);
    const [pdfPassword, setPdfPassword] = useState(undefined);
    const [custInfo, setCustInfo] = useState("");
    const [showReport, setShowReport] = useState(false);
    const [isPDF, setIsPDF] = useState(false);
    const [isExcel, setIsExcel] = useState(false);
    let isValidAccountNumber = false;
    let isValidCustomerId = false;
    const [shouldUpload, setShouldUpload] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const GetCustData = (e) => {
        e.preventDefault();
        setCustInfo(values => ({ ...values, [e.target.name]: e.target.value }));
    }

    const selectFileAnk = (e) => {
        e.preventDefault();
        selectFile(e.target.files[0]);
        checkFileType(e.target.files[0].name);
    }

    const selectFile = (f) => {
        setSelectedFiles(f);
    }

    const checkFileType = (n) => {
        document.getElementById('footer').style.position = 'absolute';

        let fileExtension = n.substring((n.length) - 4, (n.length));
        if (fileExtension == '.pdf') {
            setIsExcel(false);
            setIsPDF(true);
            setShowReport(false);
        } else if (fileExtension == '.xls' || fileExtension == 'xlsx') {
            setIsPDF(false);
            setPdfPassword('');
            setIsExcel(true);
            setShowReport(false);
        } else {
            setIsPDF(false);
            setIsExcel(false);
            toast.error('Invalid File Type.');
            setSelectedFiles(undefined);
        }
    }

    const setPassword = (event) => {
        event.preventDefault();
        setPdfPassword(event.target.value);
    }

    async function upload() {
        alert("Click OK to upload the file.");
        setProgress(0);
        let currentFileVar = selectedFiles;
        if (selectedFiles && (isPDF || isExcel)) {

            //verifying the Account Number and Customer ID length (if provided).
            if (isExcel) {
                if (document.getElementById("accNum").value.length != 0) {
                    if (document.getElementById("accNum").value.length == 15) {
                        isValidAccountNumber = true;
                    } else {
                        isValidAccountNumber = false;
                        toast.error("Invalid Account Number");
                    }
                } else {
                    isValidAccountNumber = true;
                }
                if (document.getElementById("custId").value.length != 0) {
                    if (document.getElementById("custId").value.length == 9) {
                        isValidCustomerId = true;
                    } else {
                        isValidCustomerId = false;
                        toast.error("Invalid Customer ID");
                    }
                } else {
                    isValidCustomerId = true;
                }
            }

            if (isPDF || (isExcel && isValidAccountNumber && isValidCustomerId)) {
                document.getElementById('footer').style.position = 'relative';
                setLoading(true);
                // toast.info("Uploading the file...");
                await UploadService.upload(currentFileVar, (event) => {
                    setProgress(Math.round((100 * event.loaded) / event.total));
                }, pdfPassword, custInfo.name_, custInfo.email_, custInfo.accNum_, custInfo.id_)
                    .then((response) => {
                        setLoading(false);
                        setProgress(0);
                        setMessage(response.data.message);
                        if (String(response.data.message).includes("You've entered Incorrect Password.")) {
                            toast.error("Incorrect Password", { autoClose: 7000 });
                            setPdfPassword('');
                            setShowReport(false);
                            document.getElementById('footer').style.position = 'absolute';
                        } else if (String(response.data.message).includes("The file is password protected. \nPlease provide the password.")) {
                            toast.error("The file is password protected. \nPlease provide the password.");
                            setPdfPassword('');
                            setShowReport(false);
                            document.getElementById('footer').style.position = 'absolute';

                        } else {
                            setPdfPassword('');
                            toast("BSA Report is ready.");
                            setSendResponse(response.data.bsa_report);
                            setShowReport(true);
                            document.getElementById('footer').style.position = 'relative';

                        }
                    })
                    .catch(() => {
                        setProgress(0);
                        setLoading(false);
                        setMessage("Could not upload the file!!!");
                        toast.error("Could not upload the file!!!");
                        setSelectedFiles(undefined);
                        setShowReport(false);
                    });
            }

        } else {
            toast.error("Invalid File. \n(Only PDF/Execl is allowed)");
            setPdfPassword('');
            setLoading(false);
            setShowReport(false);
        }
    }

    return (
        <div className='d-flex flex-fill flex-column flex-wrap justify-content-center mt-5'>
            <ToastContainer
                className="toast-top-right"
                ref={ref => {
                    this.topContainer = ref;
                }}
            />
            <div className='d-flex flex-column flex-wrap justify-content-center text-center upload-file-divElement mt-5'>
                <h3 className='mt-5'> Upload Bank Statement to Analyse</h3>
                <label className="btn btn-outline-default mt-5">
                    <input autoFocus id='fileUploadInput' className='form-control' type="file" onChange={selectFileAnk} />
                </label>
                {isPDF &&
                    <div className="d-flex flex-column flex-nowrap">
                        <label className="btn btn-default mt-1">
                            <input id='pdfFilePasswordInputBox' className='form-control' type="password" placeholder='Password' onChange={setPassword} data-toggle="tooltip" data-placement="TOP" title="First 4 letters of the Customer Name &amp; 9 digits Customer ID. Ex.'ANKU888342320'" />

                        </label>
                        <small className="alert alert-light p-0">Password : First 4 digits of customer name & 9 digits customer ID. Ex.'ANKU888342320'</small>
                    </div>
                }
                {isExcel &&
                    <div className="d-flex mt-1 div_CustInfo m-1">
                        <div className='d-flex  flex-column flex-fill m-1'>
                            <input name='name_' onChange={GetCustData} className='form-control m-1' type="text" placeholder='Customer Name' data-toggle="tooltip" data-placement="TOP" title="Enter Account Holder's Name" />
                            <input name='email_' onChange={GetCustData} className='form-control m-1' type="email" placeholder='E-Mail Address' data-toggle="tooltip" data-placement="TOP" title="Enter Customer E-Mail Address" />
                        </div>
                        <div className='d-flex flex-column flex-fill m-1'>
                            <input id='accNum' name='accNum_' onChange={GetCustData} className='form-control m-1' type="number" placeholder='Account Number' data-toggle="tooltip" data-placement="TOP" title="Enter Account Number" />
                            <input id='custId' name='id_' onChange={GetCustData} className='form-control m-1' type="number" placeholder='Customer ID' data-toggle="tooltip" data-placement="TOP" title="Enter Customer ID" />
                        </div>
                    </div>
                }
                <div className="d-flex flex-wrap progress mt-3">
                    <div
                        className="progress-bar progress-bar-info progress-bar-striped"
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: progress + "%" }}
                    >
                        {progress}%
                    </div>
                </div>
                <button className="btn btn-primary mt-1"
                    disabled={!selectedFiles}
                    onClick={upload}
                >
                    <i class="fa fa-upload" aria-hidden="true">&nbsp;Upload</i>
                </button>
                <div className="alert alert-light d-flex justify-content-center" role="alert">
                    <small className=''>{message}</small>
                </div>
            </div>
            <div className='m-0 p-0'>
                {isLoading && <Loader />}
                {showReport && <BSA_Analyse response={sendResponse} />}
            </div>
            <div className='' id='footer' style={{ position: 'absolute', bottom: '0', width: '99%' }}>
                <p className='text-center w-100 bg-white bottom mb-0' style={{ fontFamily: "'Electrolize',sans-serif" }}>Copyright© BankStatementAnalyser.com | All Rights Reserved. </p>
            </div>
        </div>
    );
}