import { client } from '../App.jsx';
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useMainContext from "../context/useMainContext.jsx";
import '../css/bootstrap/bootstrap.min.css';
import '../js/bootstrap/bootstrap.bundle.js';
import '../css/login.css'
import { SendLoginRequest } from '../server/login.jsx';

function Login() {
    let navigate = useNavigate();
    const [error, setError] = useState();
    const {user, setUser, nextPath, setNextPath} = useMainContext();

    useEffect(() => {
        if (user) {
            navigate(nextPath & nextPath || '/account')
            setNextPath(undefined)
        }
    }, [])

    async function onLogin(event) {
        setError(undefined);
        event.preventDefault(); 

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");
        if (email == "" || password == "") {
            setError("Email or password was blank")
            return
        }

        const [success, user, errorMessage] = await SendLoginRequest(email, password)
        if (!success) {
            setError(errorMessage);
            return
        }
        const nextPath2 = (nextPath == undefined) ? "/account" : nextPath

        navigate(nextPath2);
        setUser(user);
        return false
    }

    return <div>
        <main className="container mt-5">
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div className="d-flex justify-content-center">
                <form onSubmit={onLogin} className="loginbox text-align p-3">
                    <h2 className='mb-5 headerbold'>Login</h2>
                    <input className="inputdefault inputtext"  name={'email'} placeholder={'Username'} />
                    <br />
                    <input className="mt-3 inputtext" name={'password'} type={'password'} placeholder={'Password'} />
                    <br />

                    <div className="d-flex justify-content-between mt-3">
                        <Link className="mt-3 submitbox" to={'/signup'}>Sign up</Link>
                        <Link className="mt-3 me-2 mx-2 submitbox">Reset Password</Link>

                        <input className="mt-3 submitbox" type={'submit'} value={'Login'} name={"login"} />
                        

                    </div>
                    {error && <div className='error mt-3'>{error}</div>}
                </form>
            </div>
        </main>








    </div>
}

export default Login;