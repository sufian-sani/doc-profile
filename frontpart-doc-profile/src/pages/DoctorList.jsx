import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch doctors from the backend API
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/schedule/doctors'); // Adjust the URL if necessary
                const data = await response.json();

                if (response.ok) {
                    setDoctors(data);
                } else {
                    setError(data.message || 'Failed to fetch doctors');
                }
            } catch (err) {
                setError('Failed to fetch doctors');
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    if (loading) return <div>Loading doctors...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
            <h2>Doctor List</h2>
            {doctors.length === 0 ? (
                <p>No doctors available</p>
            ) : (
                <ul>
                    {doctors.map((doctor) => (
                        <li key={doctor.id}>
                            <Link to={`/doctor/${doctor.id}`}>
                                {doctor.name} - {doctor.email}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DoctorList;
