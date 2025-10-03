import { client } from '../App.jsx';
import { DoesErrorExist } from './errorutil.jsx';

export function SendStartCheckout(postcode, address, number) {
    return client.post('/checkout.php', {
        'postcode': postcode,
        'address': address,
        'number': number,
    }).then((res) => {
        return [true, res.data.url, undefined]
    }).catch((res) => {
        return [false, undefined, DoesErrorExist(res) && Object.values(res.response.data.errors)[0] || undefined]
    })
}