import React from 'react'
import ReactDOM from 'react-dom/client'
// import './css/index.css'

import App from './App.jsx'
import Index from "./pages/Index.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Account from './pages/Account.jsx';
import Admin from './pages/Admin.jsx';
import ContactUs from './pages/ContactUs.jsx';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Ordernow from './pages/Ordernow.jsx';
import OrderPage from './pages/Ordernow.jsx';


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: '',
                element: <Index />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'signup',
                element: <Signup />
            },
            {
                path: 'account',
                element: <Account />
            },
            {
                path: 'admin',
                element: <Admin />
            },
            {
                path: 'contactus',
                element: <ContactUs/>
            },
            {
                path: 'ordernow',
                element: <OrderPage/>
            },
            
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
      <RouterProvider router={router} />
//   </React.StrictMode>,
)
