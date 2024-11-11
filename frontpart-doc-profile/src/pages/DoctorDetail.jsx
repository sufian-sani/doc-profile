import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const DoctorDetail = () => {
    const [doctor, setDoctor] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/schedule/doctors/${id}`);
                const data = await response.json();

                if (response.ok) {
                    setDoctor(data);
                } else {
                    setError(data.message || 'Failed to fetch doctor details');
                }

                // Fetch doctor schedules
                const scheduleResponse = await fetch(`http://localhost:5000/api/schedule/${id}/schedules`);
                const scheduleData = await scheduleResponse.json();

                if (scheduleResponse.ok) {
                    setSchedules(scheduleData);
                } else {
                    setError(scheduleData.message || 'Failed to fetch schedules');
                }

            } catch (err) {
                setError('Failed to fetch doctor details');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorDetails();
    }, [id]);

    if (loading) return <div>Loading doctor details...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
            <h2>Doctor Details</h2>
            {doctor ? (
                <div>
                    <h3>{doctor.name}</h3>
                    <p>Email: {doctor.email}</p>
                    <p>Specialization: {doctor.specialization}</p>
                    {/* Add more doctor details here */}
                </div>
            ) : (
                <p>No doctor found.</p>
            )}

            <h3>Available Schedules</h3>
            {schedules.length > 0 ? (
                <ul>
                    {schedules.map((schedule) => (
                        <li key={schedule.id}>
                            <p>Date: {schedule.date}</p>
                            <p>Time: {schedule.startTime} - {schedule.endTime}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No schedules available for this doctor.</p>
            )}
        </div>
    );
};

export default DoctorDetail;
