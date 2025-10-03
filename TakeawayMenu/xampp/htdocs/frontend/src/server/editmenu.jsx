import { client } from '../App.jsx';
import { DoesErrorExist } from './errorutil.jsx';

export function SendEditItemRequest(itemId, itemName, itemPrice, itemDesc, itemInStock) {
    return client.post('/edit-item.php', {
        'itemId': itemId,
        'itemName': itemName,
        'itemPrice': itemPrice,
        'itemDesc': itemDesc,
        'itemInStock': itemInStock,
    }).then((res) => {
        return [true, res.data.items, undefined]
    }).catch((res) => {
        return [false, undefined, DoesErrorExist(res) && Object.values(res.response.data.errors)[0] || undefined]

    })
}

export function SendAddSaladToCategory(categoryId, saladId) {
    return client.post('/add-salad-to-category.php', {
        'categoryId': categoryId,
        'saladId': saladId,
    }).then((res) => {
        return [true, res.data.items, res.data.salads, undefined]
    }).catch((res) => {
        return [false,  undefined, undefined, DoesErrorExist(res) && Object.values(res.response.data.errors)[0] || undefined]
    })
}

export function SendRemoveSaladFromCategory(categoryId, saladId) {
    return client.post('/remove-salad.php', {
        'categoryId': categoryId,
        'saladId': saladId,
    }).then((res) => {
        return [true, res.data.items, res.data.salads, undefined]
    }).catch((res) => {
        return [false, undefined, undefined, DoesErrorExist(res) && Object.values(res.response.data.errors)[0] || undefined]
    })
}

export function SendAddCategory(categoryName, categoryDesc) {
    return client.post('/category.php', {
        'categoryName': categoryName,
        'categoryDesc': categoryDesc,
    }).then((res) => {
        return [true, res.data.items, res.data.salads]
    }).catch((res) => {
        return [false, undefined, undefined, DoesErrorExist(res) && Object.values(res.response.data.errors)[0] || undefined]
    })
}

export function SendAddItem(newItemName, newItemDesc, newItemPrice, newItemSelectedCategory) {
    return client.post('/food-item.php', {
        'name': newItemName,
        'description': newItemDesc,
        'price': newItemPrice,
        'category_id': newItemSelectedCategory,
        'is_available': true,
    }).then((res) => {
        return [true, res.data.items, res.data.salads, undefined]
    }).catch((res) => {
        return [false, undefined, undefined, DoesErrorExist(res) && Object.values(res.response.data.errors)[0] || undefined ]
    })
}

export function SendRemoveItem(itemId) {
    return client.post('/remove-item.php', {
        'itemId': itemId,
    }).then((res) => {
        return [true, res.data.items, res.data.salads, undefined]
    }).catch((res) => {
        return [false, undefined, undefined, DoesErrorExist(res) && Object.values(res.response.data.errors)[0] || undefined]
    })
}