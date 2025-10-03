import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import {Context as MainContext} from "./context/MainContext.jsx";
import React, {useEffect, useState} from "react";
import axios from 'axios';

import { Outlet } from "react-router-dom";
import { GetUserDataFromServer } from "./server/account.jsx";


axios.defaults.withCredentials = true
export const client = axios.create({ // Creates the connection between frontend and backend
    baseURL: "http://127.0.0.1/api",
    withCredentials: true,
});


function App() {
    const [user, setUser] = useState();
    const [nextPath, setNextPath] = useState();

    useEffect(() => {
        async function SetUser() {
            const [success, userData] = await GetUserDataFromServer()
            if (success) {
                setUser(userData)
            }
        }
        console.log("yo")
        SetUser()

    }, [])
    return <MainContext.Provider value={{
        user, setUser,
        nextPath, setNextPath
    }}>

        <Header />
        <Outlet />
        <Footer />
    </MainContext.Provider>
}

export default App;