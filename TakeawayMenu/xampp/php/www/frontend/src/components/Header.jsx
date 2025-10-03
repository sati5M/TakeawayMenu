import useMainContext from "../context/useMainContext.jsx";
import { Link } from "react-router-dom";
import '../css/index.css';

function Header() {
    const { user } = useMainContext();

    return <header className="position-fixed top-0 z-3">


        <div className="container">
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid">
                    <Link to={'/'} className="navbar-brand" href="" style={{ color: '#FFFFFF' }}>Yummies</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item px-2">
                                <Link style={{ color: "white" }} className="nav-link" to={'/'}>Home</Link>
                            </li>

                            <li className="nav-item px-2">
                                <Link style={{ color: "white" }} className="nav-link" to={'/ordernow'}>Order Now</Link>
                            </li>

                            <li className="nav-item px-2">
                                <Link style={{ color: "white" }} className="nav-link" to={'/reviews'}>Reviews</Link>
                            </li>

                            <li className="nav-item px-2">
                                <Link style={{ color: "white" }} className="nav-link" to={'/contactus'}>Contact Us</Link>
                            </li>

                            <li className="nav-item px-2">
                                <Link style={{ color: "white" }} className="nav-link" to={'/login'}>Account</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    </header>
}

export default Header;