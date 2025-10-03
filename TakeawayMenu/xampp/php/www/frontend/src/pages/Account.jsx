
import { useEffect, useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import useMainContext from "../context/useMainContext.jsx";
import '../css/bootstrap/bootstrap.min.css';
import '../js/bootstrap/bootstrap.bundle.js';
import '../css/login.css'
import { GetUserDataFromServer } from '../server/account.jsx';

function ValidateFormData(firstName, surname, address, email, number) {
    if (firstName == "" || surname == "" || email == "" || address == "" || number == "") {
        return "One or more fields were blank."
    }

    return null
}


function Account() {
    let navigate = useNavigate();
    const { user, setUser } = useMainContext();
    const [error, setError] = useState();

    const [firstName, setFirstName] = useState("");
    const [surname, setSurname] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");

    useEffect(() => {
        async function GetUserData() {
            const [isLoggedIn, userData] = await GetUserDataFromServer()
            if (!isLoggedIn) {
                navigate("/login")
                return
            }

            setUser(userData)
            setFirstName(userData.firstName);
            setSurname(userData.lastName);
            setAddress(userData.address);
            setEmail(userData.email);
            setNumber(userData.phone);
        }

        GetUserData()
    }, [])

    async function onEdit(event) {
        setError(undefined);
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const errorMsg = ValidateFormData(firstName, surname, address, email, number)

        if (errorMsg) {
            setError(errorMsg)
            return
        }

        const [success, user, errorMessage] = await SendEditUserRequest(firstName, surname, email, address, number, password, formData.get("password"))
        if (!success) {
            setError(errorMessage)
            return
        }

        setUser(user)

        return true
    }
    return <div>
        <main className="container">
        <br />
        <br />
        <br />
        <br />
            <div className="w-100 d-flex justify-content-center">
                <form onSubmit={onEdit} className="loginbox text-align p-5">
                    <h2 className='mb-5 headerbold'>Change User Details</h2>
                    <input className="inputtext" onChange={e => setFirstName(e.target.value)} name={'firstname'} placeholder={'First name'} value={firstName} />
                    <br />
                    <input className="mt-3 inputtext" onChange={e => setSurname(e.target.value)} name={'surname'} placeholder={'Surname'} value={surname} />
                    <br />
                    <input className="mt-3 inputtext" onChange={e => setEmail(e.target.value)} name={'email'} placeholder={'Email'} value={email} />
                    <br />
                    <input className="mt-3 inputtext" onChange={e => setAddress(e.target.value)} name={'address'} placeholder={'Address'} value={address} />
                    <br />
                    <input className="mt-3 inputtext" onChange={e => setNumber(e.target.value)} name={'number'} placeholder={'Phone Number'} value={number} />
                    <br />
                    <input className="mt-3 inputtext" name={'password'} type={'password'} placeholder={'Password'} />

                    <div className={"d-flex mt-3" + (user?.isAdmin == true ? ' justify-content-between' : ' justify-content-center')}>
                        <input className="mt-3 submitbox2" type={'submit'} value={'Confirm Changes'} name={"confirmchanges"} />
                        {user?.isAdmin == true && <input className="mt-3 submitbox2" type={'submit'} value={'Admin'} name={"admin"} />}
                    </div>
                    {error && <div className='error mt-3'>{error}</div>}
                </form>
            </div>
        </main>








    </div>
}

export default Account;