import { client } from '../App.jsx';

export function SendSignupRequest(firstName, surname, email, address, number, password) {
    return client.post('/signup.php', {
        'firstname': firstName,
        'surname': surname,
        'email': email,
        'address': address,
        'number': number,
        'password': password,
    }).then((res) => {
        const data = res.data;
        return [true, res.data.user, undefined]
    }).catch((res) => {
        return [false, undefined, res.response.data.description]
    })
}