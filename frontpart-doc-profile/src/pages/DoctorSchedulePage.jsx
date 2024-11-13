import React, { useState, useEffect } from 'react';

const DoctorSchedulePage = () => {
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [scheduleStatus, setScheduleStatus] = useState(null);
    const [doctorId, setDoctorId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        if (token) {
            const decodedToken = decodeJWT(token); // Decode the token
            setDoctorId(decodedToken.id); // Assuming the doctor's ID is stored as 'id' in the JWT payload
        }
    }, []);

    // Function to manually decode the JWT token
    const decodeJWT = (token) => {
        if (!token) return null;

        const base64Url = token.split('.')[1]; // Extract the payload (middle part of the token)
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace special characters
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')); // Decode the base64 string

        return JSON.parse(jsonPayload); // Parse the decoded payload into an object
    };

    const handleCreateSchedule = async () => {
        if (!doctorId) {
            setScheduleStatus({ success: false, message: 'Doctor not found. Please login.' });
            return;
        }

        const scheduleData = {
            date,
            startTime,
            endTime,
        };

        try {
            console.log(doctorId)
            const response = await fetch(`http://localhost:5000/api/schedule/doctors/${doctorId}/schedules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scheduleData),
            });

            if (!response.ok) {
                throw new Error('Failed to create schedule');
            }

            const result = await response.json();
            setScheduleStatus({ success: true, message: 'Schedule created successfully!' });
        } catch (error) {
            setScheduleStatus({ success: false, message: error.message });
        }
    };

    return (
        <div>
            <h1>Create Doctor Schedule</h1>

            <div>
                <label>
                    Date:
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </label>
            </div>

            <div>
                <label>
                    Start Time:
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </label>
            </div>

            <div>
                <label>
                    End Time:
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </label>
            </div>

            <button onClick={handleCreateSchedule}>Create Schedule</button>

            {scheduleStatus && (
                <div style={{ marginTop: '20px', color: scheduleStatus.success ? 'green' : 'red' }}>
                    {scheduleStatus.message}
                </div>
            )}
        </div>
    );
};

export default DoctorSchedulePage;
