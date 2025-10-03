import { client } from '../App.jsx';
import { DoesErrorExist } from './errorutil.jsx';


export function SendSignupRequest(firstName, surname, email, address, number, password) {
    return client.post('/signup.php', {
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