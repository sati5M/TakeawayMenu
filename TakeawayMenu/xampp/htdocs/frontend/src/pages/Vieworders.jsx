import { useState, Fragment, useEffect } from 'react';
import '../css/vieworders.css'
import '../css/bootstrap/bootstrap.min.css';
import '../js/bootstrap/bootstrap.bundle.js';
import { GetItemsFromServer } from '../server/ordernow.jsx';
import useMainContext from '../context/useMainContext.jsx';
import { useNavigate } from 'react-router-dom';
import { GetOrdersFromServer, SendDeleteOrder, SetOrderStatus } from '../server/vieworders.jsx';

function Orders(orders, setOrder) {
    return (
        <div className='mb-5'>
            {orders && orders.length > 0 && <h2 className="text-center mb-3">Recent orders</h2>}
            {orders && orders.length > 0 ? (
                <div>
                    {orders && orders.map((order) => (
                        <Fragment key={order.id}>
                            <ul className="ps-4">
                                <li key={order.id} className="justify-content-between align-items-center gap-2 mb-1">
                                    <hr></hr>
                                    <div className='d-flex justify-content-between align-items-center gap-2 itemcolor'>
                                        <div>
                                            <span className='itemcolor'>{order.delivery_address}</span>
                                            <br></br>
                                            <span className='itemcolor'>{order.postcode}</span>
                                        </div>

                                        <div className="d-flex align-items-center gap-2">
                                            <span>£{order.total_price}</span>
                                            <button className="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#showOrderModal" onClick={() => setOrder(order.id, order.items, order.phone_number, order.status)}>
                                                Show order
                                            </button>
                                        </div>
                                    </div>

                                </li>
                            </ul>
                        </Fragment>
                    ))}
                </div>
            ) : (
                <div>
                    <h2 className="text-center mb-3">No orders</h2>
                </div>
            )}

        </div>
    );
};

function showOrderModal(orderItems, number, status, completeCurrentStatus, deleteSelectedOrder) {
    return (
        <div>
            <div className="modal fade" id="showOrderModal" tabIndex="-1" aria-labelledby="showOrderModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="showOrderModalLabel">Contact Details: {number}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {orderItems && orderItems.map((item) => (
                                <div key={item.id} className="">
                                    <span>{item.name}</span>
                                    {item?.toppings?.length > 0 ? item.toppings.map((toppingData) => (
                                        <div key={toppingData.id} className='mx-3 toppingnames'>- {toppingData.name}</div>
                                    )) : (<div>
                                        <div className='mx-3 toppingnames'>- No extras</div>
                                    </div>)}

                                </div>
                            ))}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>

                            {status == "Ordered" && <button type="button" className="btn btn-primary" onClick={() => completeCurrentStatus()}>Set as on the way</button>}
                            {status == "Ontheway" && <button type="button" className="btn btn-primary" onClick={() => completeCurrentStatus()}>Set as delivered</button>}
                            {status == "Delivered" && <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => deleteSelectedOrder()}>Delete order from system</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}


function ViewOrders() {
    let navigate = useNavigate();

    const { user, setNextPath } = useMainContext();
    const [recentOrders, setRecentOrders] = useState([]);
    const [items, setItems] = useState([]);
    const [number, setNumber] = useState();
    const [status, setStatus] = useState();
    const [orderId, setOrderId] = useState();

    useEffect(() => {
        if (!user || user.isAdmin != true) {
            setNextPath("/vieworders")
            navigate("/login")
            return
        }

        async function GetRecentOrders() {
            const [success, orders] = await GetOrdersFromServer()
            if (!success) {
                navigate("/login")
                return
            }

            setRecentOrders(orders)
        }

        GetRecentOrders()
    }, [user])


    function setOrder(orderId, items, number, status) {
        setOrderId(orderId)
        setItems(items)
        setNumber(number)
        setStatus(status)
    }

    async function completeCurrentStatus() {
        const [success, newOrders] = await SetOrderStatus(orderId)
        if (!success) {
            return
        }
        const orderData = newOrders.find(order => {
            if (order.id == orderId) {
                return order
            }
        })
        setOrder(orderData.id, orderData.items, orderData.phone_number, orderData.status)
        setRecentOrders(newOrders)
    }

    async function deleteSelectedOrder() {
        const [success, newOrders] = await SendDeleteOrder(orderId)
        if (!success) {
            return
        }
        setRecentOrders(newOrders)
    }

    return (
        <div className="container mt-5">
            <br></br>
            <br></br>
            <div className="row gx-3">
                <div className="col-sm"></div>
                <div className="col-sm mb-3">
                    <div className="background p-3">
                        {Orders(recentOrders, setOrder)}
                    </div>
                </div>
                <div className="col-sm"></div>
            </div>

            {showOrderModal(items, number, status, completeCurrentStatus, deleteSelectedOrder)}

        </div>

    );
};

export default ViewOrders;