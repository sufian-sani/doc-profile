import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        // Check if a token exists in localStorage to determine authentication status
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token); // true if token exists, false otherwise
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from local storage
        setIsAuthenticated(false); // Update authentication state
        navigate('/login'); // Redirect to login page
    };

    return (
        <nav style={{padding: '10px', backgroundColor: '#f0f0f0'}}>
            <Link to="/" style={{margin: '10px'}}>Home</Link>
            <Link to="/doctors" style={{margin: '10px'}}>Doctors List</Link>

            {!isAuthenticated ? (
                <>
                    <Link to="/login" style={{margin: '10px'}}>Login</Link>
                    <Link to="/register" style={{margin: '10px'}}>Register</Link>
                </>
            ) : (
                <>
                    <Link to="/profile" style={{margin: '10px'}}>Profile</Link>
                    <button
                        onClick={handleLogout}
                        style={{margin: '10px', cursor: 'pointer'}}
                    >
                        Logout
                    </button>
                </>
            )}
        </nav>
    );
};

export default Navbar;
