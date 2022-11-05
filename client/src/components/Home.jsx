import React, { useState } from 'react';
import { Link } from "react-router-dom";
import BSA_API from './BSA_API';
import BSA_Upload from './BSA_Upload';
import { Nav, Navbar, NavLink } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import "./styles.css";
import logo_sm from '../assets/sm-screen-logo.png';

export default function Home() {

    const [showBSA_API_Page, setShowBSA_API_Page] = useState(false);
    const [showBSAUpload_Page, setShowBSAUpload_Page] = useState(true);

    const call_BSA_API = (e) => {
        e.preventDefault();
        setShowBSA_API_Page(true);
        setShowBSAUpload_Page(false);
    }

    const call_BSAUpload = (e) => {
        e.preventDefault();
        setShowBSA_API_Page(false);
        setShowBSAUpload_Page(true);
    }

    useEffect(() => {
        toast.success('Login Successful', { position: toast.POSITION.TOP_RIGHT });
    }, []);

    const navLinks = document.querySelectorAll('.toggle');
    navLinks.forEach((l) => {
        l.addEventListener('click', () => {
            document.getElementById('navbarScroll').classList.remove('show');
        });
    });

    return (
        <div className='d-flex flex-wrap flex-column m-0 p-0'>
            <ToastContainer
                className="toast-top-right"
                ref={ref => {
                    this.topContainer = ref;
                }}
            />

            <div className='d-flex flex-wrap flex-column justify-content-md-between w-100 m-0 p-0'>
                <div className='w-100 border bg-body rounded  navbar_styles' style={{ boxShadow: "0 5px 15px #212529" }}>
                    <Navbar collapseOnSelect expand="sm" bg=" dark " variant=" dark " >
                        <img className='toggle ms-2 small_screen_navbar' style={{ width: "300px" }} src={logo_sm} alt="logo" />
                        <Navbar.Toggle aria-controls="navbarScroll " data-bs-target=" #navbarScroll " />
                        < Navbar.Collapse id="navbarScroll" >
                            <div className='d-flex flex-nowrap flex-row me-2 w-100 '>&nbsp;
                            </div>
                            <div className='d-flex navigationButtons justify-content-end flex-shrink-1 toggle'>
                                <button type='button' className='toggle btn btn-outline-primary me-5 border hover-shadow' data-toggle="tooltip" data-placement="bottom" title="Search Customer" onClick={call_BSA_API}><i class="fa fa-search" aria-hidden="true">&nbsp;Search</i></button>
                                <button className='toggle btn btn-outline-primary me-5 border hover-shadow ' data-toggle="tooltip" data-placement="bottom" title="Upload Bank Statement File" onClick={call_BSAUpload}><i class="fa fa-upload" aria-hidden="true">&nbsp;Upload</i></button>
                                <Link to="/"><button className='toggle btn btn-danger me-5 border hover-shadow' data-toggle="tooltip" data-placement="bottom" title="Log out the session." ><i class="fa fa-sign-out" aria-hidden="true">&nbsp;Logout</i></button></Link>
                            </div>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
                <div className='m-0 p-0'>
                    {showBSA_API_Page && <BSA_API />}
                    {showBSAUpload_Page && <BSA_Upload />}
                </div>
            </div>
        </div>
    );
}
