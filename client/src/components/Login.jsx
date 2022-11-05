import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./styles.css";
import logo from '../assets/logo.png';
import bgPic from '../assets/bg.jpg';

export default function Login() {

    const [inputs, setInputs] = useState('');

    const navigate = useNavigate();

    const GetData = (e) => {
        e.preventDefault();
        setInputs(values => ({ ...values, [e.target.name]: e.target.value }));
    }

    const LoginCheck = (e) => {
        e.preventDefault();
        if (String(inputs.email).length == 0 || String(inputs.password).length == 0 || !inputs.email || !inputs.password) {
            toast.warning('Please, Enter Email Address \nand Password :( ', { position: toast.POSITION.TOP_RIGHT });
        }
        else {
            let local_email = localStorage.getItem('Email:');
            let local_pass = localStorage.getItem('Password:');
            if (local_email === inputs.email && local_pass === inputs.password) {
                document.getElementById('email').value = "";
                document.getElementById('password').value = "";
                toast.success('Login Successful :)');
                navigate('/home');
            }
            else if (inputs.email === "emp@gmail.com" && inputs.password === "12345678") {
                document.getElementById('email').value = "";
                document.getElementById('password').value = "";
                toast.success('Login Successful :)', { position: toast.POSITION.TOP_RIGHT });
                navigate('/home');
            }
            else {
                toast.error('Invalid Credentials :( ', { position: toast.POSITION.TOP_RIGHT });
            }
        }
    }

    return (
        <>
            <div className='w-100 login_page_main_div vh-100'>
                <ToastContainer
                    className="toast-top-right"
                    ref={ref => {
                        this.topContainer = ref;
                    }}
                />
                <div className='d-flex flex-column m-0'>
                    <img className='mx-auto d-block mt-3 bg-transparent rounded' src={logo} height='50px' alt="logo" />
                    <p className="login_page_title font-effect-shadow-multiple" name="title" id="title">Bank  Statement  Analyser</p>
                    <p className='text-center text-dark bg-transparent border-0 mt=0 ms-auto w-50' htmlFor='title' style={{ fontFamily: "Great Vibes", textAlign: "right" }}>Quick & Easy way to analyse bank statements.</p>
                </div>
                <div className=' d-flex flex-column mt-1 justify-content-center login_form_div mx-auto'>
                    <h4 className=' text-center mt-3 login_name'><i className="fa fa-sign-in" aria-hidden="true"></i> LOGIN</h4>
                    <input className='mt-5 form-control' type='email' placeholder='Email Address' name='email' id='email' onChange={GetData} />
                    <input className='mt-3 form-control' type='password' placeholder='Password' name='password' id='password' onChange={GetData} />
                    <button className='btn btn-outline-primary text-white border-white mt-5 mb-3 w-25 ms-auto login_btn' type='button' onClick={LoginCheck}>LOGIN</button>
                </div>

            </div>
            <p className='footer_ text-center mb-0' style={{ fontFamily: "'Electrolize',sans-serif" }}>Copyright© BankStatementAnalyser.com | All Rights Reserved. </p>
        </>
    );
}