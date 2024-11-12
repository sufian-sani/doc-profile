import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DoctorDetails = () => {
    const { doctorId } = useParams(); // Only doctorId is passed in the URL
    console.log(doctorId);
    const [doctor, setDoctor] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to current date
    const navigate = useNavigate();

    // Fetch doctor details and available slots based on doctorId and selected date
    useEffect(() => {
        const fetchDoctorDetails = async () => {
            setLoading(true);
            try {
                // Fetch doctor details (e.g., name, specialty)
                const doctorResponse = await fetch(`http://localhost:5000/api/schedule/doctors/${doctorId}`);
                const doctorData = await doctorResponse.json();
                setDoctor(doctorData);

                // Fetch available time slots for the selected doctor and date
                const slotsResponse = await fetch(`http://localhost:5000/api/schedule/doctors/${doctorId}/schedules/${selectedDate}/slots`);
                const slotsData = await slotsResponse.json();
                setAvailableSlots(slotsData);
            } catch (error) {
                console.error('Error fetching doctor details or available slots:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorDetails();
    }, [doctorId, selectedDate]); // Re-fetch on doctorId or selectedDate change

    // Handle the booking of the selected slot
    const handleBookAppointment = async () => {
        if (!selectedSlot) {
            alert('Please select a time slot');
            return;
        }

        try {
            // Book appointment
            const response = await fetch('/api/appointments/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    doctorId,
                    startTime: selectedSlot.startTime,
                    endTime: selectedSlot.endTime,
                    patientId: 1, // Static patientId for now, you can adjust as needed
                }),
            });

            const data = await response.json();
            if (data.message === 'Appointment booked successfully') {
                navigate(`/appointments/${data.appointment.id}`); // Redirect to appointment details page
            } else {
                alert(data.message); // Error message from backend
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Failed to book appointment');
        }
    };

    return (
        <div className="doctor-details">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {/* Doctor Details */}
                    {doctor && (
                        <div className="doctor-info">
                            <h1>{doctor.name}</h1>
                            <p>Specialty: {doctor.specialty}</p>
                        </div>
                    )}

                    {/* Date Selection */}
                    <div className="date-selection">
                        <label htmlFor="date">Select Date:</label>
                        <input
                            type="date"
                            id="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>

                    {/* Available Time Slots */}
                    <div className="available-slots">
                        <h2>Available Time Slots for {selectedDate}</h2>
                        <ul>
                            {availableSlots.length > 0 ? (
                                availableSlots.map((slot, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => setSelectedSlot(slot)}
                                            className={selectedSlot === slot ? 'selected' : ''}
                                        >
                                            {slot.formattedSlot}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <p>No available slots for this date</p>
                            )}
                        </ul>
                    </div>

                    {/* Book Appointment Button */}
                    <div className="book-appointment">
                        <button onClick={handleBookAppointment} disabled={!selectedSlot}>
                            Book Appointment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDetails;
