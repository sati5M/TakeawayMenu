import '../css/bootstrap/bootstrap.min.css';
import '../js/bootstrap/bootstrap.bundle.js';
import '../css/reviews.css';

function Fail() {

    return <div>

        <main className="container pt-10">
            <div className="backgroundreview text-center">
                <h2 className="headerName">Order unsuccessful</h2>
                <h3 className="pb-3">Your payment was declined, please try again</h3>

            </div>
        </main>

    </div>
}


export default Fail;