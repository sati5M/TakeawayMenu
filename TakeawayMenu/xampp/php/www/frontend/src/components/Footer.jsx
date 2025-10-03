

import useMainContext from "../context/useMainContext.jsx";
import { Link } from "react-router-dom";
import '../css/index.css';

function Footer() {

    return <footer className="">
        <div className="container">
            <div className="row mt-3">
                <Link to="/" className="col removedecoration">Home</Link>
                <Link to="/termsandconditions" className="col removedecoration">Terms and Conditions</Link>
            </div>

            <div className="row mt-3">
                <Link to="/ordernow" className="col removedecoration">Order Now</Link>
                <Link to="/termsofuse" className="col removedecoration">Terms of Use</Link>
            </div>

            <div className="row mt-3">
                <Link to="/reviews" className="col removedecoration">Reviews</Link>
                <Link to="/allergeninfo" className="col removedecoration">Allergen Info</Link>
            </div>

            <div className="row mt-3">
                <Link to="/contactus" className="col removedecoration">Contact Us</Link>
                <Link to="/privacypolicy" className="col removedecoration">Privacy Policy</Link>
            </div>
        </div>
    </footer>
}

export default Footer;