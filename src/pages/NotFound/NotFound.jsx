// src/pages/NotFound/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './NotFound.css'; // Assuming you have a CSS file for styling

const NotFound = () => {
    return (
        <div className="not-found-container">
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
            <Link to="/Home " className="not-found-link">Go Back to Home</Link> {/* Use Link instead of a */}
        </div>
    );
};

export default NotFound;
