import React, { useEffect, useState, useRef } from 'react';
import BSA_API_Service from "../services/BSA_API_Service";
import BSA_Analyse from './BSA_Analysis';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './Loader';

export default function BSA_API() {

    const [selection, setSelection] = useState("Select Search By...");
    const [showReport, setShowReport] = useState(false);
    const [inputBox, setInputBox] = useState(undefined);
    const [sendResponse_, setsendResponse_] = useState(undefined);
    const [isLoading, setLoading] = useState(false);


    useEffect(() => {
        setInputBox(document.getElementById('searchInputbox'));
    }, []);

    const inputBoxText = (e) => {
        e.preventDefault();
        switch (e.target.value) {
            case 'Account_Number': inputBox.value = ''; setSelection("Enter Customer Account Number"); inputBox.disabled = false; inputBox.type = 'number'; break;
            case 'Email_Address': inputBox.value = ''; setSelection("Enter Email Address"); inputBox.disabled = false; inputBox.type = 'email'; break;
            case 'Customer_ID': inputBox.value = ''; setSelection("Enter Customer ID"); inputBox.disabled = false; inputBox.type = 'number'; break;
            default: inputBox.value = ''; setSelection("Select Search By..."); break;
        }
    }

    const search = (e) => {
        e.preventDefault();
        setShowReport(false);
        let searchBy = document.getElementById('searchDropdown').value;
        if (inputBox.value === '' || searchBy === '0') {
            setShowReport(false);
            setLoading(false);
            toast.warning('Please, Select "Search By" option\nand Enter value');
        } else if (searchBy === 'Account_Number' && inputBox.value.match(/\b\d{15}\b/g)) {
            setShowReport(true);
            setLoading(true);
            BSA_API_Service.searchByAccountNumber(String(inputBox.value))
                .then((response) => {
                    if (String(response.data.message).includes('No customer found')) {
                        toast.error('No Customer Found');
                        setShowReport(false);
                        setLoading(false);
                        document.getElementById('footer').style.position = 'absolute';

                    }
                    else {
                        toast("BSA Report is ready.");
                        setsendResponse_(response.data.bsa_report);
                        setShowReport(true);
                        setLoading(false);
                        document.getElementById('footer').style.position = 'relative';

                    }
                });
        }
        else if (searchBy === 'Email_Address') {
            inputBox.type = 'email';
            setLoading(true);
            BSA_API_Service.searchByEmailAddress(inputBox.value)
                .then((response) => {
                    if (String(response.data.message).includes('No customer found')) {
                        toast.error('No Customer Found');
                        setShowReport(false);
                        setLoading(false);
                        document.getElementById('footer').style.position = 'absolute';

                    }
                    else {
                        toast("BSA Report is ready.");
                        setsendResponse_(response.data.bsa_report);
                        setShowReport(true);
                        setLoading(false);
                        document.getElementById('footer').style.position = 'relative';

                    }
                });
        }
        else if (searchBy === 'Customer_ID' && inputBox.value.match(/\b\d{9}\b/g)) {
            setShowReport(true);
            setLoading(true);
            inputBox.type = 'number';
            BSA_API_Service.searchByCustomerId(String(inputBox.value))
                .then((response) => {
                    if (String(response.data.message).includes('No customer found')) {
                        toast.error('No Customer Found');
                        setShowReport(false);
                        setLoading(false);
                        document.getElementById('footer').style.position = 'absolute';
                    }
                    else {
                        toast("BSA Report is ready.");
                        setsendResponse_(response.data.bsa_report);
                        setShowReport(true);
                        setLoading(false);
                        document.getElementById('footer').style.position = 'relative';

                    }
                });
        }
        else {
            setLoading(false);
            setShowReport(false);
            toast.warning('Incorrect Input');
        }
    }

    return (
        <div className='d-flex flex-wrap flex-column justify-content-center mb-2 mt-5' >
            <ToastContainer
                className="toast-top-right"
                ref={ref => {
                    this.topContainer = ref;
                }}
            />
            <center className='mt-5'><h3 className='mt-5'>Analysed Data Directly from the Bank Database</h3></center><br /><br />
            <div className='mb-5'>
                <form className="bsa_api_form d-flex needs-validation justify-content-center text-center " noValidate>
                    <div className="m-2 ">
                        <select className="form-select" id="searchDropdown" onClick={inputBoxText} required>
                            <option selected disabled value='0' >Search By...</option>
                            <option value='Account_Number'>Account Number</option>
                            <option value='Email_Address'>Email Address</option>
                            <option value='Customer_ID'>Customer ID</option>
                        </select>
                        <div className="invalid-feedback ">
                            Please select a valid option.
                        </div>
                    </div>
                    <div className="m-2">
                        <input type="text" className="form-control" id="searchInputbox" placeholder={selection} required disabled />
                        <div className="invalid-feedback">
                            Please provide a valid input.
                        </div>
                    </div>
                    <div>
                        <button type='button' className='btn btn-primary  m-2' onClick={search} >
                            <i class="fa fa-search" aria-hidden="true">&nbsp;Search</i>
                        </button>
                    </div>
                </form>
            </div>
            <div className='m-0 p-0'>
                {isLoading && <Loader />}
                {showReport && <BSA_Analyse response={sendResponse_} />}
            </div>
            <div className='' id='footer' style={{ position: 'absolute', bottom: '0', width: '99%' }}>
                <p className='text-center w-100 bg-white bottom mb-0' style={{ fontFamily: "'Electrolize',sans-serif" }}>Copyright© BankStatementAnalyser.com | All Rights Reserved. </p>
            </div>
        </div>
    );
}