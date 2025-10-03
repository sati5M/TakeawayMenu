import { client } from '../App.jsx';

export function GetItemsFromServer() {
    return client.get('/food-item.php').then((res) => {
        return res.data
    })
}

export function SendAddItemToBasket(itemId, salads) {
    console.log("yo")
    return client.post('/add-item-to-basket.php', {
        'item_id': itemId,
        'toppings': salads,
    }).then((res) => {
        return [true, res.data.basket]
    }).catch((res) => {
        return [false, undefined]
    })
}

export function GetUserBasketFromServer() {
    return client.get('/get-basket.php').then((res) => {
        return res.data.basket
    })
}

export function SendRemoveItemFromBasket(basket_item_id) {
    return client.post('/remove-item-from-basket.php', {
        'basket_item_id': basket_item_id
    }).then((res) => {
        return [true, res.data.basket]
    }).catch((res) => {
        return [false, undefined]
    })
}