import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const DoctorDetailsPage = () => {
    const { doctorId } = useParams();  // Get doctorId from the URL
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingStatus, setBookingStatus] = useState(null);
    const [scheduleId, setScheduleId] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);  // Initialize with today's date

    // Fetch available slots for the doctor on the selected date
    useEffect(() => {
        const fetchAvailableSlots = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/schedule/doctors/${doctorId}/schedules/${date}/available-slots`);
                if (!response.ok) {
                    throw new Error('Error fetching available slots');
                }
                const data = await response.json();
                setAvailableSlots(data.availableSlots);
                setScheduleId(data.scheduleIdGet);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchAvailableSlots();
    }, [doctorId, date]);

    // Book a selected time slot
    const handleBookAppointment = async (slot) => {
        const { startTime, endTime } = slot;
        const formattedDate = `${date}T`;

        const appointmentData = {
            patientId: 1,  // Placeholder patientId, replace with actual patient data
            scheduleId,
            startTime: `${formattedDate}${slot.startTime}`,
            endTime: `${formattedDate}${slot.endTime}`,
        };

        try {
            const response = await fetch(`http://localhost:5000/api/schedule/doctors/${doctorId}/schedules/${scheduleId}/slots/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData),
            });
            console.log(appointmentData)

            if (!response.ok) {
                throw new Error('Failed to book the appointment');
            }

            const result = await response.json();
            setBookingStatus({ success: true, message: 'Appointment booked successfully!' });

            // Optionally, refetch available slots if needed after booking
            // fetchAvailableSlots();

        } catch (error) {
            setBookingStatus({ success: false, message: error.message });
        }
    };

    // Update date when a new date is selected
    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    return (
        <div>
            <h1>Doctor Details Page</h1>
            <h2>Available Slots for {date}</h2>

            {/* Date Picker */}
            <div>
                <label htmlFor="date-picker">Select Date: </label>
                <input
                    type="date"
                    id="date-picker"
                    value={date}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}  // Limit to today or future dates
                />
            </div>

            {/* Display available slots or loading/error messages */}
            {loading ? (
                <p>Loading available slots...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : availableSlots.length === 0 ? (
                <p>No available slots for this doctor on {date}.</p>
            ) : (
                <div>
                    <h3>Available Time Slots</h3>
                    <ul>
                        {availableSlots.map((slot, index) => (
                            <li key={index}>
                                <strong>{slot.formattedSlot}</strong>
                                <br />
                                <button onClick={() => handleBookAppointment(slot)}>
                                    Book Appointment
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Display booking status message */}
            {bookingStatus && (
                <div style={{ marginTop: '20px', color: bookingStatus.success ? 'green' : 'red' }}>
                    {bookingStatus.message}
                </div>
            )}
        </div>
    );
};

export default DoctorDetailsPage;
