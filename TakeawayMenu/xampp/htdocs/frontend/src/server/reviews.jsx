
import { client } from '../App.jsx';
import { DoesErrorExist } from './errorutil.jsx';

export function GetReviewsFromServer() {
    return client.get('reviews.php').then((res) => {

        return [true, res.data.reviews]
    }).catch((res) => {
        
        return [false, undefined]
    })
}

export function AddReviewToServer(name, starCount) {
    return client.post('/reviews.php', {
        'name': name,
        'starCount': starCount,
    }).then((res) => {
        return [true, res.data.reviews]
    }).catch((res) => {
        return [false, DoesErrorExist(res) && Object.values(res.response.data.errors)[0] || undefined]
    })
}