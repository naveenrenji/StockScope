import React from 'react';
import '../assets/css/404.css';
import { Link } from 'react-router-dom';
import { HouseExclamation } from 'react-bootstrap-icons';

function NotFoundPage() {
    return (
        <div className="glass-404">
            <div className="container-404">
            <h1>404</h1>
            <p>The link you clicked may be broken or the page may have been removed.</p>
            <small>
                Go back to <Link to="/">home page <HouseExclamation /></Link>
            </small>
        </div>
        </div>
    );
}

export default NotFoundPage;