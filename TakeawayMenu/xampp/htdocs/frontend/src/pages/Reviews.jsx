
import '../css/bootstrap/bootstrap.min.css';
import '../js/bootstrap/bootstrap.bundle.js';
import '../css/reviews.css';
import { useEffect, useState } from 'react';
import useMainContext from '../context/useMainContext.jsx';
import { AddReviewToServer, GetReviewsFromServer } from '../server/reviews.jsx';
import { useNavigate } from 'react-router-dom';

function Reviews() {

    const { user, nextPath, setNextPath } = useMainContext();
    const [reviews, setReviews] = useState([]);
    const [name, setName] = useState([]);
    const [stars, setStars] = useState([]);
    let navigate = useNavigate()
    useEffect(() => {

        if (!user) {
            setNextPath("/reviews")
            navigate("/login")

            return
        }
    }, [user])

    useEffect(() => {
        async function GetReviews() {
            const [success, reviews] = await GetReviewsFromServer()
            if (!success) {
                return
            }
            setReviews(Object.values(reviews))
        }

        GetReviews()

    }, [])

    async function addReview() {
        const [success, reviews] = await AddReviewToServer(name, stars)
        if (!success) {
            return
        }
        setReviews(Object.values(reviews))

    }

    function setStarCount(value) {
        if (value == "") {
            setStars("")
            return
        }
        
        if (value >= 1 && value <= 5) {
            setStars(value)
        }
    }

    return <div>

        <main className="container pt-10">
            <div className="backgroundreview text-center">
                <h2 className="headerName">Reviews</h2>
                <button className="btn btn-secondary btn-sm mb-3 mx-3" data-bs-toggle="modal" data-bs-target="#reviewModal">
                    Add
                </button>
                <div className="d-flex flex-wrap flex-column  align-items-center justify-content-center mt-3 pallaround-10">
                    {reviews && reviews.map(review => (
                        <div key={review.review_id} className="name">
                            <span className="name mx-3">{review.name}</span> {Array.from({ length: review.starCount }, (_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="yellow" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                            ))}
                        </div>
                    ))}
                

                </div>
            </div>
        </main>

        <div className="modal fade" id="reviewModal" tabIndex="-1" aria-labelledby="reviewModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="reviewModalLabel">Review</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body">
                        <label htmlFor="item-name" className="col-form-label">Name of person reviewing:</label>
                        <input type="text" className="form-control" id="review-name" value={name} onChange={(e) => setName(e.target.value)}></input>
                        <label htmlFor="item-price" className="col-form-label">Number of stars:</label>
                        <input type="number" min={1} max={5} className="form-control" id="review-stars" value={stars} placeholder='1-5' onChange={(e) => setStarCount(e.target.value)}></input>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={addReview}>Add review</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
}

export default Reviews;