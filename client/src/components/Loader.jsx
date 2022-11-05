import React from 'react';
import "./styles.css";


export default function Loader() {

    return (
        <div className='alert alert-light spinner_div'>
            <hr/>
            <br/>
            <div className='spinner p-2'></div>
            <br/>
            <center>Please, wait while we are processing the file...</center>
        </div>
    );
}