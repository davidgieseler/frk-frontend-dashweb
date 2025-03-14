import {Link} from "react-router";

const NotFoundPage = () => {
    return (
        <div>
            <h1>404 Page Not Found</h1>
            <Link to="/">
                <button>Go To Home</button>
            </Link>
        </div>
    )
}

export default NotFoundPage