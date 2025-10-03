
import { client } from '../App.jsx';

export function GetOrdersFromServer() {
    return client.get('get-orders.php').then((res) => {
        return [true, res.data.orders]
    }).catch((res) => {
        return [false, undefined]
    })
}

export function SetOrderStatus(orderId) {
    return client.post('set-order-status.php', {
        'orderId': orderId,
    }).then((res) => {
        return [true, res.data.orders]
    }).catch((res) => {
        return [false, undefined]
    })
}

export function SendDeleteOrder(orderId) {
    return client.post('delete-order.php', {
        'orderId': orderId,
    }).then((res) => {
        return [true, res.data.orders]
    }).catch((res) => {
        return [false, undefined]
    })
}