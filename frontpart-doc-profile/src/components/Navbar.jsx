import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
            <Link to="/" style={{ margin: '10px' }}>Profile</Link>
            <Link to="/login" style={{ margin: '10px' }}>Login</Link>
            <Link to="/register" style={{ margin: '10px' }}>Register</Link>
        </nav>
    );
};

export default Navbar;
