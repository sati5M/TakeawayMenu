import { client } from '../App.jsx';

export function SendLoginRequest(email, password) {
    return client.post('/login.php', {
        'email': email,
        'password': password,
    }).then((res) => {
        return [true, res.data.user, undefined]
    }).catch((res) => {
        return [false, undefined, res.response.data.description]
    })
}