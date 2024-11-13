import React, { useState } from 'react';

const DoctorSchedulePage = () => {
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [scheduleStatus, setScheduleStatus] = useState(null);

    const handleCreateSchedule = async () => {
        const scheduleData = {
            date,
            startTime,
            endTime,
        };

        try {
            const response = await fetch(`http://localhost:5000/api/schedule/doctors/3/schedules`, {
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
