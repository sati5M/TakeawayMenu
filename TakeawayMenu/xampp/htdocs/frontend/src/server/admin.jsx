import { client } from '../App.jsx';

export function GetAdminDataFromServer() {
    return client.get('get-admin-data.php').then((res) => {
        return [res.data.isAdmin, res.data.amountThisMonth, res.data.amountThisWeek, res.data.outOfStockItems]
    }).catch(() => {
        return [false, undefined, undefined, undefined]
    })
}
