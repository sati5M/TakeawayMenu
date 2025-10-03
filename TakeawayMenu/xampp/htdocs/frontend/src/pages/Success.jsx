
import { useState } from "react";
import useMainContext from "../context/useMainContext.jsx";
import '../css/bootstrap/bootstrap.min.css';
import '../js/bootstrap/bootstrap.bundle.js';
import '../css/reviews.css';
import Header from "../components/Header.jsx";
import { Link } from "react-router-dom";

function Success() {

    return <div>

        <main className="container pt-10">
            <div className="backgroundreview text-center">
                <h2 className="headerName">Order Successful</h2>
                <h3 className="pb-3">Your order has gone through and will be delivered soon!</h3>
            </div>
        </main>

    </div>
}


export default Success;