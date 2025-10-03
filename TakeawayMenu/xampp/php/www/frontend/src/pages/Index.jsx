
import { useState } from "react";
import useMainContext from "../context/useMainContext.jsx";
import '../css/bootstrap/bootstrap.min.css';
import '../js/bootstrap/bootstrap.bundle.js';
import '../css/index.css';
import Header from "../components/Header.jsx";
import { Link } from "react-router-dom";

function Index() {
    
    return <div>
        <main className="container">
            <h1 className="title-font text-center mt-3">Welcome to Yummies</h1>
            <h4 className="sec-title-font text-center"> Delicious meals at your doorstep</h4>

            <div className="order-now mt-3 text-center">
                <Link to={'/ordernow'} className="order-now-box">Order now</Link>

            </div>

            <div className="d-flex flex-wrap justify-content-center mt-3">
                <div className="me-5 mt-3 food-picture">FOOD STOCK PICTURE</div>
                <div className="me-5 mt-3 food-picture">FOOD STOCK PICTURE</div>
                <div className="me-5 mt-3 food-picture">FOOD STOCK PICTURE</div>
            </div>

            <div className="d-flex flex-wrap justify-content-center mt-3">

                <div className="mt-2 food-picture">REVIEWS SLIDESHOW</div>

                <div className="ms-4 mt-5 reviews-text text-center mb-5">
                    Reviews
                    <div className="reviews-text-subtext">At Yummies, we thrive on ensuring that <br />all customers are
                        satisfied with their orders.<br />You can see some of our recent reviews here</div>
                </div>
            </div>
        </main>
    </div>
}

export default Index;