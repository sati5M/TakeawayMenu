
import { client } from '../App.jsx';
import { DoesErrorExist } from './errorutil.jsx';

export function GetUserDataFromServer() {
    return client.get('user.php').then((res) => {
        return [true, res.data, res.data.firstName, res.data.lastName, res.data.address, res.data.email, res.data.phone]
    }).catch((res) => {
        
        return [false]
    })
}
export function SendEditUserRequest(firstName, surname, email, address, number, password) {
    return client.post('/edit-user.php', {
        'firstname': firstName,
        'surname': surname,
        'email': email,
        'address': address,
        'number': number,
        'password': password,
    }).then((res) => {
        return [true, res.data.user, undefined]
    }).catch((res) => {
        return [false, undefined, DoesErrorExist(res) && Object.values(res.response.data.errors)[0] || undefined]
    })
}

export function SendLogoutRequest() {
    return client.post('/logout.php', {
    }).then((res) => {
        return true
    }).catch((res) => {
        return false
    })
}

