
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useMainContext from "../context/useMainContext.jsx";
import '../css/bootstrap/bootstrap.min.css';
import '../js/bootstrap/bootstrap.bundle.js';
import '../css/login.css'
import { GetUserDataFromServer } from '../server/account.jsx';
import { GetUserBasketFromServer, SendRemoveItemFromBasket } from "../server/ordernow.jsx";
import { SendStartCheckout } from "../server/checkout.jsx";

function ValidateFormData(postcode, address, number) {
    if (postcode == "" || address == "" || number == "") {
        return "One or more fields were blank."
    }

    return null
}


function Checkout() {
    let navigate = useNavigate();
    const { user, setUser, nextPath, setNextPath } = useMainContext();
    const [error, setError] = useState();

    const [postcode, setPostcode] = useState("");
    const [address, setAddress] = useState("");
    const [number, setNumber] = useState("");
    const [basket, setBasket] = useState("");

    useEffect(() => {
        async function GetUserData() {
            const [isLoggedIn, userData] = await GetUserDataFromServer()
            if (!isLoggedIn) {
                setNextPath("/checkout")
                navigate("/login")
                return
            }
        }


        async function GetUserBasket() {
            const items = await GetUserBasketFromServer()
            const itemsArray = Object.values(items);
            setBasket(itemsArray)
        }

        GetUserData()
        GetUserBasket()
    }, [])

    async function removeItemFromBasket(basketItemId) {
        const [success, newBasket] = await SendRemoveItemFromBasket(basketItemId)
        if (success) {
            const basketArray = Object.values(newBasket);
            setBasket(basketArray)
        }
    };

    async function startCheckout(event) {
        setError(undefined);
        event.preventDefault(); 

        if (basket.length == 0) {
            setError("Your basket is empty.")
            return
        }

        const validationError = ValidateFormData(postcode, address, number)
        if (validationError) {
            setError(validationError)
            return
        }

        const [success, url, error] = await SendStartCheckout(postcode, address, number);
        if (!success) {
            setError(error)
            return
        }
        window.open(url)

    }

    return <div>
        <main className="container">
            <br />
            <br />
            <br />
            <br />
            <div className="w-100 d-flex justify-content-center">
                <form onSubmit={startCheckout} className="loginbox text-align p-5">
                    <h2 className='mb-5 headerbold'>Checkout</h2>
                    <ul className="ps-4">
                        {basket.length > 0 && (
                            <>
                                {basket.map((item) => (
                                    <li key={item.basket_item_id} className="justify-content-between align-items-center gap-2 mb-1">

                                        <div className='d-flex justify-content-between align-items-center gap-2 itemcolor'>
                                            <span className='itemcolor'>{item.item_name}</span>

                                            <div className="d-flex align-items-center gap-2">
                                                <span>£{item.item_price}</span>
                                                <button type="button" className="btn btn-secondary btn-sm" onClick={() => removeItemFromBasket(item.basket_item_id)}>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                        <div className='description mx-3 overflow-hidden'>
                                            {item.description}
                                        </div>

                                    </li>
                                ))}
                            </>
                        )}


                    </ul>

                    {basket.length > 0 ? (
                        <div>
                            <input className="inputtext" onChange={e => setPostcode(e.target.value)} name={'postcode'} placeholder={'Postcode'} value={postcode} />
                            <br />
                            <input className="mt-3 inputtext" onChange={e => setAddress(e.target.value)} name={'address'} placeholder={'Address'} value={address} />
                            <br />
                            <input className="mt-3 inputtext" onChange={e => setNumber(e.target.value)} name={'contactnumber'} placeholder={'Contact number'} value={number} />
                            <div className={"d-flex mt-3 justify-content-center"}>
                                 <button type="submit" className="mt-3 submitbox2">Pay by card</button>
                            </div>
                        </div>
                    ) : (
                        <p>Your basket is empty</p>
                    )}
                    {error && <div className='error mt-3'>{error}</div>}
                </form>
            </div>
        </main>








    </div>
}

export default Checkout;