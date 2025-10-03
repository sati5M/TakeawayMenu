import { client } from '../App.jsx';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useMainContext from "../context/useMainContext.jsx";
import '../css/bootstrap/bootstrap.min.css';
import '../js/bootstrap/bootstrap.bundle.js';
import '../css/admin.css'

function Admin() {
    let navigate = useNavigate();
    const [error, setError] = useState();
    const { setUser } = useMainContext();

    return <div>
        <main className="container">
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div className="w-100 d-flex flex-wrap justify-content-center background mb-5">

                <div className="w-100 d-flex flex-wrap justify-content-center background">

                    <div className="p-5 admin-data-box-background">
                        <h2 className='headerbold'>Admin</h2>
                        <div className="mt-3 d-flex flex-wrap flex-column gap text-center justify-content-center align-items-center">
                            <div className="d-flex flex-wrap gap-4">
                                <div className="admin-data-box">ADMIN DATA</div>
                                <div className="admin-data-box">ADMIN DATA</div>
                                <div className="admin-data-box">ADMIN DATA</div>
                            </div>
                            <button className='p-2 px-5 button'>Edit Menu</button>
                        </div>

                    </div>

                </div>

            </div>

        </main>








    </div>
}

export default Admin;