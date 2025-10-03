import { client } from '../App.jsx';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useMainContext from "../context/useMainContext.jsx";
import '../css/bootstrap/bootstrap.min.css';
import '../js/bootstrap/bootstrap.bundle.js';
import '../css/login.css'
import { SendSignupRequest } from '../server/signup.jsx';

function ValidateFormData(formData) {
    const firstName = formData.get("firstname");
    const surname = formData.get("surname");
    const email = formData.get("email");
    const address = formData.get("address");
    const number = formData.get("number");
    const password = formData.get("password");
    if (firstName == "" || surname == "" || email == "" || address == "" || number == "" || password == "") {
        return ["One or more fields were blank.", null, null, null, null, null]
    }

    return [null, firstName, surname, email, address, number, password]
}

function Signup() {
    const [error, setError] = useState();
    const { setUser, nextPath } = useMainContext();
    const navigate = useNavigate()
    async function onSignup(event) {
        setError(undefined);
        event.preventDefault(); 

        const formData = new FormData(event.currentTarget);
        const [errorMsg, firstName, surname, email, address, number, password] = ValidateFormData(formData)

        if (errorMsg) {
            setError(errorMsg)
            return
        }

        const [success, user, errorMessage] = await SendSignupRequest(firstName, surname, email, address, number, password)

        if (!success) {
            setError(errorMessage);
            return
        }

        setUser(user)
        navigate(nextPath & nextPath || '/account')

        return false
    }
    return <div>
        <main className="container">
            <br></br>
            <br></br>

            <div className="w-100 d-flex justify-content-center">
                <form onSubmit={onSignup} className="loginbox text-align p-5">
                    <h2 className='mb-5 headerbold'>Signup</h2>
                    <input className="inputdefault inputtext"  name={'firstname'} placeholder={'First name'} />
                    <br />
                    <input className="mt-3 inputdefault inputtext"  name={'surname'} placeholder={'Surname'} />
                    <br />
                    <input className="mt-3 inputtext" name={'email'} placeholder={'Email'} />
                    <br />
                    <input className="mt-3 inputtext" name={'address'} placeholder={'Address'} />
                    <br />
                    <input className="mt-3 inputtext" name={'number'} placeholder={'Phone Number'} />
                    <br />
                    <input className="mt-3 inputtext" name={'password'} type={'password'} placeholder={'Password'} />

                    <div className="d-flex justify-content-center mt-3">
                        <input className="mt-3 submitbox" type={'submit'} value={'Signup'} name={"signup"} />
                    </div>
                    {error && <div className='error mt-3'>{error}</div>}
                </form>
            </div>
        </main>








    </div>
}

export default Signup;