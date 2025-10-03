import { client } from '../App.jsx';
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useMainContext from "../context/useMainContext.jsx";
import '../css/bootstrap/bootstrap.min.css';
import '../js/bootstrap/bootstrap.bundle.js';
import '../css/admin.css'
import { GetAdminDataFromServer } from '../server/admin.jsx';

function Admin() {
    let navigate = useNavigate();
    const [weeksRevenue, setWeeksRevenue] = useState(0);
    const [monthsRevenue, setMonthsRevenue] = useState(0);
    const [outOfStockCount, setOutOfStockCount] = useState(0);
    const { user, setNextPath } = useMainContext();

    useEffect(() => {

        if (!user || user?.is_admin) {
            setNextPath("/admin")
            navigate('/account')
            return
        }

        async function GetAdminData() {
            const [isAdmin, monthRevenue, weekRevenue, outOfStockCounter] = await GetAdminDataFromServer()
            if (!isAdmin) {
                navigate("/login")
                return
            }
            setMonthsRevenue(Number(monthRevenue).toFixed(2))
            setWeeksRevenue(Number(weekRevenue).toFixed(2))
            setOutOfStockCount(outOfStockCounter)
        }

        GetAdminData()


    }, [user])

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
                        <div className="mt-3 gap text-center justify-content-center align-items-center">


                            <div className="container">
                                <div className="row gx-3">
                                    <div className="col">
                                        <div className="admin-data-box p-3">
                                            This Week's Revenue
                                            <br/>
                                            <div className='admin-data-text mt-5'>£{weeksRevenue}</div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="admin-data-box p-3">
                                            This Month's Revenue
                                            <br/>
                                            <div className='admin-data-text mt-5'>£{monthsRevenue}</div>
                                        </div>
                                    </div>
                                    <div className="col mb-3">
                                        <div className="admin-data-box p-3">
                                            Out Of Stock Items
                                            <br/>
                                            <div className='admin-data-text mt-5'>{outOfStockCount}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <Link to={"/editmenu"} className=' button'>Edit Menu</Link>
                                    </div>
                                    <div className="col">
                                        <Link to={"/vieworders"} className='button'>View orders</Link>
                                    </div>
                                </div>
                            </div>

                            
                        </div>

                    </div>

                </div>

            </div>

        </main>








    </div>
}

export default Admin;