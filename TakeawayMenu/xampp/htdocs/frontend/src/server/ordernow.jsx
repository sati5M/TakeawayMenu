import { client } from '../App.jsx';
import { DoesErrorExist } from './errorutil.jsx';

export function GetItemsFromServer() {
    return client.get('/food-item.php').then((res) => {
        return [res.data.items, res.data.salads]
    })
}

export function SendAddItemToBasket(itemId, salads) {
    return client.post('/add-item-to-basket.php', {
        'item_id': itemId,
        'toppings': salads,
    }).then((res) => {
        return [true, res.data.basket]
    }).catch((res) => {
        return [false, DoesErrorExist(res) && Object.values(res.response.data.errors)[0] || undefined]
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
        return [false, DoesErrorExist(res) && Object.values(res.response.data.errors)[0] || undefined]
    })
}