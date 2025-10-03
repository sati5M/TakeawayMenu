import { useState, Fragment, useEffect } from 'react';
import '../css/ordernow.css'
import '../css/bootstrap/bootstrap.min.css';
import '../js/bootstrap/bootstrap.bundle.js';
import { GetItemsFromServer, GetUserBasketFromServer, SendAddItemToBasket, SendRemoveItemFromBasket } from '../server/ordernow.jsx';
import useMainContext from '../context/useMainContext.jsx';
import { useNavigate } from 'react-router-dom';

function Menu(categories, onItemAdd) {
    return (
        <div className='mb-5'>
            <h2 className="text-center mb-3">Menu</h2>
            {categories.map((category) => (
                <Fragment key={category.id}>
                    <hr></hr>
                    <h3 className="fw-semibold">{category.name}</h3>
                    <ul className="ps-4">
                        {category.items.map((item) => (
                            <li key={item.id} className="justify-content-between align-items-center gap-2 mb-1">

                                <div className='d-flex justify-content-between align-items-center gap-2 itemcolor'>
                                    <span className='itemcolor'>{item.name}</span>

                                    <div className="d-flex align-items-center gap-2">
                                        <span>£{item.price}</span>
                                        <button className="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#saladModal" onClick={() => onItemAdd(item.id)}>
                                            Add
                                        </button>
                                    </div>
                                </div>
                                <div className='description mx-3 overflow-hidden'>
                                    {item.description}
                                </div>

                            </li>


                        ))}

                    </ul>
                </Fragment>
            ))}
        </div>
    );
};

function Basket(items, onItemRemove) {
    const itemsLength = items.length;
    const total = items.reduce((acc, item) => acc + item.item_price, 0);

    return (
        <div className="d-flex flex-column align-items-center gap-4">
            <h2 className="text-center mb-3">Basket</h2>
            {itemsLength > 0 ? (
                
                <>
                    <div className="w-100">
                        {items.map((item) => (
                            
                            <div key={item.basket_item_id} className="d-flex justify-content-between align-items-center gap-2 mb-1">
                                <span>{item.item_name}</span>
                                <div className="d-flex align-items-center gap-2">
                                    <span>£{item.item_price}</span>
                                    <button className="btn btn-secondary btn-sm" onClick={() => onItemRemove(item.basket_item_id)}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="d-flex gap-4 align-items-center">
                        <span className="fw-bold">Total:</span>
                        <span>£{total.toFixed(2)}</span>
                    </div>
                </>
            ) : (
                <p>Your basket is empty</p>
            )}
            <a href="#" className="btn btn-secondary btn-sm">
                Checkout
            </a>
        </div>
    );
};

function OrderPage() {
    let navigate = useNavigate();

    const { user, nextPath, setNextPath } = useMainContext();
    const [basket, setBasket] = useState([]);
    const [availableItems, setAvailableItems] = useState([]);
    const [currentId, setCurrentId] = useState();
    const [availableSalads, setAvailableSalads] = useState();
    const [selectedSalads, setSelectedSalads] = useState([]);

    useEffect(() => {

        if (!user) {
            setNextPath("/ordernow")
            navigate("/login")
            return
        }

        async function GetAvailableItems() {
            const items = await GetItemsFromServer()
            setAvailableItems(items)
        }

        async function GetUserBasket() {
            const items = await GetUserBasketFromServer()
            const itemsArray = Object.values(items);
            setBasket(itemsArray)
        }
        // IsUserLoggedIn()
        GetUserBasket()
        GetAvailableItems()
    }, [])

    async function addItemToBasket() {
        const [success, newBasket] = await SendAddItemToBasket(currentId, selectedSalads)
        console.log(success)
        if (success) {
            const basketArray = Object.values(newBasket);
            console.log(basketArray)
            setBasket(basketArray)
        }
    }

    async function removeItemFromBasket(basketItemId) {
        const [success, newBasket] = await SendRemoveItemFromBasket(basketItemId)
        if (success) {
            const basketArray = Object.values(newBasket);
            setBasket(basketArray)
        }  
    };

    function selectItemToAdd(id) {

        for (let i = 0; i < availableItems.length; i++) {
            const category = availableItems[i];
            const item = category.items.find(item => item.id === id);
            if (item) {

                setAvailableSalads(category.salads)
                setCurrentId(id)
                return
            }
        }
    }

    function onSaladAdd(salad) {
        setSelectedSalads((prevSalads) => [...prevSalads, salad]);
    }

    function onSaladRemove(id) {
        setSelectedSalads((prevSalads) => prevSalads.filter((salad) => salad.id !== id));
    }

    return (
        <div className="container mt-5">
            <br></br>
            <br></br>
            <div className="row gx-3">
                <div className="col-sm"></div>
                <div className="col-sm order-md-1 order-2 mb-3">
                    <div className="background p-3">
                        {Menu(availableItems, selectItemToAdd)}
                    </div>
                </div>
                <div className="col-sm order-md-2 order-1 mb-3">
                    <div className="background p-3">
                        {Basket(basket, removeItemFromBasket)}
                    </div>
                </div>


            </div>

            <div className="modal fade" id="saladModal" tabIndex="-1" aria-labelledby="saladModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="saladModalLabel">Extras</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {availableSalads && availableSalads.map((salad) => (
                                <div key={salad.id} className="d-flex justify-content-between align-items-center gap-2 mb-1">
                                    <span>{salad.name}</span>
                                    <div className="d-flex align-items-center gap-2">

                                        {!selectedSalads.some(saladData => saladData.id === salad.id) ? (
                                            <button className="btn btn-secondary btn-sm" onClick={() => onSaladAdd(salad)}>
                                                Add
                                            </button>) : (
                                            <button className="btn btn-secondary btn-sm" onClick={() => onSaladRemove(salad.id)}>
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={addItemToBasket}>Add to basket</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default OrderPage;