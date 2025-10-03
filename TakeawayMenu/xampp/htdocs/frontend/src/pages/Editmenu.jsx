import { useState, Fragment, useEffect } from 'react';
import '../css/ordernow.css'
import '../css/bootstrap/bootstrap.min.css';
import '../js/bootstrap/bootstrap.bundle.js';
import { GetItemsFromServer } from '../server/ordernow.jsx';
import useMainContext from '../context/useMainContext.jsx';
import { useNavigate } from 'react-router-dom';
import { SendAddCategory, SendAddItem, SendAddSaladToCategory, SendEditItemRequest, SendRemoveItem, SendRemoveSaladFromCategory } from '../server/editmenu.jsx';

function Menu(categories, onItemEdit, onCategoryEdit) {
    return (
        <div className='mb-5'>
            <h2 className="text-center mb-3">Menu</h2>
            <div className="d-flex align-items-center gap-2 justify-content-between">
                <button className="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#newCategoryModal">
                    Add category
                </button>
                <button className="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#newItemModal">
                    Add item
                </button>
            </div>
            {categories && categories.map((category) => (
                <Fragment key={category.id}>
                    <hr></hr>
                    <h3 className="fw-semibold">
                        <div className="d-flex align-items-center gap-2">
                            <span className='fw-semibold'>{category.name}</span>
                            <button className="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#categoryModal" onClick={() => onCategoryEdit(category.id, categories)}>
                                Edit
                            </button>
                        </div>
                    </h3>
                    <div className='description mb-3 overflow-hidden'>
                        {category.description}
                    </div>
                    <ul className="ps-4">
                        {category.items && category.items.map((item) => (
                            <li key={item.id} className="justify-content-between align-items-center gap-2 mb-1">

                                <div className='d-flex justify-content-between align-items-center gap-2 itemcolor'>
                                    <span className='itemcolor'>{item.name}</span>

                                    <div className="d-flex align-items-center gap-2">
                                        <span>£{Number(item.price).toFixed(2)}</span>
                                        <button className="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#editItemModal" onClick={() => onItemEdit(item.id, item.name, item.price, item.description, item.is_available)}>
                                            Edit
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

function editItemModal(itemName, itemPrice, itemDesc, itemInStock, setItemName, setItemPrice, setItemInStock, setItemDesc, confirmItemEdit, confirmItemDelete) {
    return (
        <div className="modal fade" id="editItemModal" tabIndex="-1" aria-labelledby="editItemLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="editItemLabel">Editing {itemName}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <label htmlFor="item-name" className="col-form-label">Item name:</label>
                        <input type="text" className="form-control" id="item-name" value={itemName} onChange={e => setItemName(e.target.value)}></input>
                        <label htmlFor="item-price" className="col-form-label">Item price:</label>
                        <input type="text" className="form-control" id="item-price" value={itemPrice} onChange={e => setItemPrice(e.target.value)}></input>
                        <label htmlFor="item-desc" className="col-form-label">Item description:</label>
                        <input type="text" className="form-control" id="item-desc" value={itemDesc} onChange={e => setItemDesc(e.target.value)}></input>
                        <div>
                            <label htmlFor="item-in-stock">In stock</label>
                            <input type="checkbox" className="mx-3" id="item-in-stock" checked={itemInStock} onChange={e => setItemInStock(e.target.checked)}></input>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={confirmItemEdit}>Confirm Changes</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={confirmItemDelete}>Delete item</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function editCategoryModal(categoryName, categorySalads, saladOptions, addSaladToCategory, removeSaladFromCategory) {
    return (<div className="modal fade" id="categoryModal" tabIndex="-1" aria-labelledby="categoryModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="categoryModalLabel">Editing {categoryName}</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    {saladOptions && saladOptions.map((salad) => (

                        <div key={salad.id} className="d-flex justify-content-between align-items-center gap-2 mb-1">
                            <span>{salad.name}</span>
                            <div className="d-flex align-items-center gap-2">
                                {categorySalads && !categorySalads.some(saladData => saladData.id === salad.id) ? (
                                    <button className="btn btn-secondary btn-sm" onClick={() => addSaladToCategory(salad.id)}>
                                        Add
                                    </button>) : (
                                    <button className="btn btn-secondary btn-sm" onClick={() => removeSaladFromCategory(salad.id)}>
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}


                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>)
}

function addCategoryModal(newCategoryName, newCategoryDesc, setNewCategoryName, setNewCategoryDesc, addNewCategory) {
    return (
        <div className="modal fade" id="newCategoryModal" tabIndex="-1" aria-labelledby="newCategoryLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="newCategoryLabel">Add new category</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <label htmlFor="category-name" className="col-form-label">Category name:</label>
                        <input type="text" className="form-control" id="category-name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)}></input>
                        <label htmlFor="category-desc" className="col-form-label">Category description:</label>
                        <input type="text" className="form-control" id="category-desc" value={newCategoryDesc} onChange={e => setNewCategoryDesc(e.target.value)}></input>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={addNewCategory}>Add category</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


function addItemModal(newItemName, newItemDesc, newItemPrice, selectedNewCategory, categories, setNewItemName, setNewItemDesc, setNewItemPrice, editNewItemSelectedCategory, addNewItem) {
    return (
        <div className="modal fade" id="newItemModal" tabIndex="-1" aria-labelledby="newItemLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="newItemLabel">Add new item</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <label htmlFor="item-name" className="col-form-label">Item name:</label>
                        <input type="text" className="form-control" id="item-name" value={newItemName} onChange={e => setNewItemName(e.target.value)}></input>
                        <label htmlFor="item-description" className="col-form-label">Item description:</label>
                        <input type="text" className="form-control" id="item-description" value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)}></input>
                        <label htmlFor="item-price" className="col-form-label">Item price:</label>
                        <input type="text" className="form-control" id="item-price" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)}></input>
                        <h3 className='mt-2'>Categories</h3>
                        {categories.map((category) => (
                            <div key={category.id} className='mt-2'>
                                <input type="radio" id={category.id} name="category" value={category.id} checked={selectedNewCategory == category.id} onChange={e => editNewItemSelectedCategory(e.target.value)}></input>
                                <label htmlFor={category.id}>{category.name}</label>
                            </div>
                        ))}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={addNewItem}>Add item</button>
                    </div>
                </div>
            </div>
        </div>
    )
}



function EditMenu() {
    let navigate = useNavigate();

    const { user, nextPath, setNextPath } = useMainContext();
    const [availableItems, setAvailableItems] = useState([]);
    const [availableSalads, setAvailableSalads] = useState();

    const [categorySalads, setCategorySalads] = useState();
    const [categoryName, setCategoryName] = useState("");
    const [categoryId, setCategoryId] = useState();

    const [itemId, setItemId] = useState();
    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [itemDesc, setItemDesc] = useState("");
    const [itemInStock, setItemInStock] = useState(true);

    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryDesc, setNewCategoryDesc] = useState("");

    
    const [newItemName, setNewItemName] = useState("");
    const [newItemDesc, setNewItemDesc] = useState("");
    const [newItemSelectedCategory, setNewItemSelectedCategory] = useState();
    const [newItemPrice, setNewItemPrice] = useState();

    const [error, setError] = useState("");

    useEffect(() => {

        if (!user) {
            setNextPath("/ordernow")
            navigate("/login")
            return
        }

        async function GetAvailableItems() {
            const [items, salads] = await GetItemsFromServer()
            setAvailableItems(items)
            setAvailableSalads(salads)
        }

        GetAvailableItems()
    }, [user])


    function selectItemToEdit(id, name, price, desc, inStock) {
        setItemId(id)
        setItemName(name)
        setItemDesc(desc)
        setItemPrice(price)
        setItemInStock(inStock)
    }

    function editItemName(newName) {
        setItemName(newName)
    }

    function editItemPrice(newPrice) {
        setItemPrice(newPrice)
    }

    function editItemInStock(inStock) {
        setItemInStock(inStock)
    }

    function editItemDesc(newDesc) {
        setItemDesc(newDesc)
    }

    function editNewCategoryDesc(newDesc) {
        setNewCategoryDesc(newDesc)
    }

    function editNewCategoryName(newName) {
        setNewCategoryName(newName)
    }


    function editNewItemName(newName) {
        setNewItemName(newName)
    }

    function editNewItemPrice(newPrice) {
        setNewItemPrice(newPrice)
    }

    function editNewItemSelectedCategory(newCategory) {
        setNewItemSelectedCategory(newCategory)
    }
    
    function editNewItemDesc(newDesc) {
        setNewItemDesc(newDesc)
    }

    function cleanupItemAdd() {
        setNewItemName("")
        setNewItemDesc("")
        setNewItemPrice("")
        setNewItemSelectedCategory(undefined)
    }

    function cleanupItemEdit() {
        setItemId(undefined)
        setItemName("")
        setItemDesc("")
        setItemPrice("")
        setItemInStock(undefined)
    }

    function cleanupCategoryAdd() {
        setNewCategoryName("")
        setNewCategoryDesc("")
    }


    async function finishItemEdit() {
        setError("")
        const [success, newItems, error] = await SendEditItemRequest(itemId, itemName, itemPrice, itemDesc, itemInStock)
        cleanupItemEdit()
        if (success) {
            setAvailableItems(newItems)
            return
        }
        setError(error)
    }



    function onCategoryEdit(id, newItems) {
        for (let i = 0; i < newItems.length; i++) {

            const category = newItems.find(categoryData => categoryData.id === id);
            if (category) {
                setCategorySalads(category.salads)
                setCategoryId(id)
                setCategoryName(category.name)
                return
            }
        }
    }

    async function addSaladToCategory(saladId) {
        setError("")
        const [success, newItems, salads, error] = await SendAddSaladToCategory(categoryId, saladId)
        if (success) {
            setAvailableItems(newItems)
            setAvailableSalads(salads)
            onCategoryEdit(categoryId, newItems)
            return
        }
        setError(error)

    }

    async function removeSaladFromCategory(saladId) {
        setError("")
        const [success, newItems, salads, error] = await SendRemoveSaladFromCategory(categoryId, saladId)
        if (success) {
            setAvailableItems(newItems)
            setAvailableSalads(salads)
            onCategoryEdit(categoryId, newItems)
            return
        }
        setError(error)
    }

    async function addNewCategory() {
        setError("")
        cleanupCategoryAdd()
        const [success, newItems, salads, error] = await SendAddCategory(newCategoryName, newCategoryDesc)
        if (success) {
            setAvailableItems(newItems)
            setAvailableSalads(salads)
            return
        }
        setError(error)
    }

    async function onItemAdd() {
        setError("")
        cleanupItemAdd()
        const [success, newItems, salads, error] = await SendAddItem(newItemName, newItemDesc, newItemPrice, newItemSelectedCategory)
        if (success) {
            setAvailableItems(newItems)
            setAvailableSalads(salads)
        }
        setError(error)
    }

    async function confirmItemDelete() {
        setError("")
        const [success, newItems, salads, error] = await SendRemoveItem(itemId)
        if (success) {
            setAvailableItems(newItems)
            setAvailableSalads(salads)
        }
        setError(error)
    }


    return (
        <div className="container mt-5">
            <br></br>
            <br></br>
            <div className="row gx-3">
                <div className="col-sm"></div>
                <div className="col-sm mb-3">
                    <div className="background p-3">
                    {error && <div className="alert alert-danger text-center" role="alert">{error}</div>}
                        {Menu(availableItems, selectItemToEdit, onCategoryEdit)}
                    </div>
                </div>
                <div className="col-sm"></div>
            </div>

            {editItemModal(itemName, itemPrice, itemDesc, itemInStock, editItemName, editItemPrice, editItemInStock, editItemDesc, finishItemEdit, confirmItemDelete)}
            {editCategoryModal(categoryName, categorySalads, availableSalads, addSaladToCategory, removeSaladFromCategory)}
            {addCategoryModal(newCategoryName, newCategoryDesc, editNewCategoryName, editNewCategoryDesc, addNewCategory)}
            {addItemModal(newItemName, newItemDesc, newItemPrice, newItemSelectedCategory, availableItems, editNewItemName, editNewItemDesc, editNewItemPrice, editNewItemSelectedCategory, onItemAdd)}
        </div>

    );
};
export default EditMenu;