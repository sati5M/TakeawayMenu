import React from 'react'
import ReactDOM from 'react-dom/client'

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
import OrderPage from './pages/Ordernow.jsx';
import Reviews from './pages/Reviews.jsx';
import Checkout from './pages/Checkout.jsx';
import Editmenu from './pages/Editmenu.jsx';
import Success from './pages/Success.jsx';
import Fail from './pages/Fail.jsx';
import ViewOrders from './pages/Vieworders.jsx';


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
            {
                path: 'editmenu',
                element: <Editmenu/>
            },
            {
                path: 'reviews',
                element: <Reviews/>
            },
            {
                path: 'checkout',
                element: <Checkout/>
            
            },
            {
                path: 'success',
                element: <Success/>
            
            },
            {
                path: 'fail',
                element: <Fail/>
            
            },
            {
                path: 'vieworders',
                element: <ViewOrders/>
            },
            
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
      <RouterProvider router={router} />
//   </React.StrictMode>,
)
