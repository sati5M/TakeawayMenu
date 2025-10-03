import { client } from '../App.jsx';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useMainContext from "../context/useMainContext.jsx";
import '../css/bootstrap/bootstrap.min.css';
import '../js/bootstrap/bootstrap.bundle.js';
import '../css/login.css'

function ContactUs() {

    return <div>
        <main className="container mt-5">
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div className="d-flex justify-content-center">
                <form className="loginbox text-align p-3">
                    <h2 className='mb-5 headerbold'>Contact Us</h2>
                    <input className="inputdefault inputtext"  name={'email'} placeholder={'Return email'} />
                    <br />
                    <input className="mt-3 inputtext" name={'content'} placeholder={'Content'} />
                    <br />

                    <div className="d-flex justify-content-center mt-3">
                        <input className="px-4 mt-3 sendbox" type={'submit'} value={'Send'} name={"send"} />
                    </div>
                </form>
            </div>
        </main>








    </div>
}

export default ContactUs;