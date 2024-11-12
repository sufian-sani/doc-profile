import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Profile from './components/Profile.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Home from "./components/Home.jsx";
import DoctorList from "./pages/DoctorList.jsx";
import DoctorDetail from "./pages/DoctorDetail.jsx";

const App = () => {
    return (
        <Router>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/doctors" element={<DoctorList />} />
                    <Route path="/doctor/:doctorId" element={<DoctorDetail />} /> {/* Doctor detail page */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
