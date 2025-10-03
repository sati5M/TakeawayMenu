import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { Context as MainContext } from "./context/MainContext.jsx";
import React, { useEffect, useState } from "react";
import axios from 'axios';

import { Outlet, useNavigate } from "react-router-dom";
import { GetUserDataFromServer } from "./server/account.jsx";


axios.defaults.withCredentials = true
export const client = axios.create({
    baseURL: "http://127.0.0.1/api",
    withCredentials: true,
});


function App() {
    const [user, setUser] = useState();
    const [nextPath, setNextPath] = useState();
    const [isLoaded, setLoaded] = useState(false);

    useEffect(() => {
        async function SetUser() {
            const [success, userData] = await GetUserDataFromServer()
            if (success) {
                setUser(userData)
                setLoaded(true)
                if (nextPath) {
                    useNavigate().navigate(nextPath)
                }
            } else {
                setLoaded(true)
            }

        }
        SetUser();

    }, [])
    return <MainContext.Provider value={{
        user, setUser,
        nextPath, setNextPath
    }}>
        {isLoaded && <>
            <Header />
            <Outlet />
            <Footer />
        </>}
    </MainContext.Provider>
}

export default App;