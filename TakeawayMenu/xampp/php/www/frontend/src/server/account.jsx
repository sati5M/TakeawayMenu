import { client } from '../App.jsx';

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
        const data = res.data;
        setUser(data.user);
        return [true, res.data.user, undefined]
    }).catch((res) => {
        return [false, undefined, res.response.data.description]
    })
}