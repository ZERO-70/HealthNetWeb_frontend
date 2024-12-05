import React, { useState, useEffect } from 'react';
import '../styles/AvailableDoctors.css'; // New CSS file for AvailableDoctors

function AvailableDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showAppointmentTab, setShowAppointmentTab] = useState(false); // State to toggle the appointment tab
    const [errorMessage, setErrorMessage] = useState('');
    const [appointmentDate, setAppointmentDate] = useState(''); // State to store selected date
    const [availableTimes, setAvailableTimes] = useState([]); // State to store available times
    const [selectedTimeRange, setSelectedTimeRange] = useState(''); // State to store selected time range
    const [startTime, setStartTime] = useState(''); // State for selected start time
    const [maxDuration, setMaxDuration] = useState(120); // State for max allowed duration
    const [appointmentDuration, setAppointmentDuration] = useState(5); // State for selected duration
    const [responseMessage, setResponseMessage] = useState(''); // State for backend response message

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Authentication token is missing. Please log in again.');
                }

                const response = await fetch('https://healthnet-web-production.up.railway.app/doctor', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorResponse = await response.text();
                    throw new Error(`Failed to fetch doctors: ${errorResponse}`);
                }

                const data = await response.json();
                setDoctors(data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setErrorMessage(error.message);
            }
        };

        fetchDoctors();
    }, []);

    const handleDoctorClick = (doctor) => {
        setSelectedDoctor(doctor);
        setShowAppointmentTab(false); // Reset the appointment tab when selecting a new doctor
    };

    const handleBackClick = () => {
        setSelectedDoctor(null);
    };

    const handleBookAppointmentClick = () => {
        setShowAppointmentTab(true); // Toggle the display of the appointment tab
    };

    const handleDateChange = async (e) => {
        const date = e.target.value;
        setAppointmentDate(date);

        if (date) {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Authentication token is missing. Please log in again.');
                }

                const response = await fetch(
                    `https://healthnet-web-production.up.railway.app/doctor/${selectedDoctor.id}/available_time?date=${date}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch available times.');
                }

                const times = await response.json();
                setAvailableTimes(times);
            } catch (error) {
                console.error('Error fetching available times:', error);
                setAvailableTimes([]); // Reset times in case of an error
            }
        }
    };

    const handleTimeRangeChange = (e) => {
        setSelectedTimeRange(e.target.value);

        const [rangeStart, rangeEnd] = e.target.value.split(' - ');
        setStartTime(''); // Reset start time when a new range is selected
        setMaxDuration(120); // Reset max duration to default
    };

    const handleStartTimeChange = (e) => {
        // Simply allow the user to select the time without any restrictions
        setStartTime(e.target.value);
    };


    const handleDurationChange = (e) => {
        setAppointmentDuration(e.target.value);
    };

    const handleSendAppointmentProposal = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token is missing. Please log in again.');
            }

            if (!selectedTimeRange) {
                alert('Please select a valid time range.');
                return;
            }

            if (!startTime) {
                alert('Please select a valid start time.');
                return;
            }

            const [rangeStart, rangeEnd] = selectedTimeRange.split(' - ');

            if (startTime < rangeStart || startTime > rangeEnd) {
                alert('The selected start time is outside the available time range.');
                return;
            }

            // Get the current date and time
            const now = new Date();
            const today = new Date().toISOString().split('T')[0];

            if (appointmentDate === today) {
                const currentTime = now.toTimeString().split(' ')[0].slice(0, 5); // Extract HH:mm format

                if (startTime < currentTime) {
                    alert('You cannot select a start time earlier than the current time.');
                    return;
                }
            }

            const patientId = localStorage.getItem('patientId'); // Retrieve patient ID from localStorage

            // Calculate the end time
            const [hours, minutes] = startTime.split(':').map(Number);
            const startDateTime = new Date();
            startDateTime.setHours(hours);
            startDateTime.setMinutes(minutes);

            const endDateTime = new Date(startDateTime.getTime() + appointmentDuration * 60 * 1000);
            const endTime = endDateTime.toTimeString().split(' ')[0].slice(0, 5); // Extract HH:mm format

            const appointmentPayload = {
                patient_id: patientId,
                doctor_id: selectedDoctor.id,
                date: appointmentDate,
                startTime: startTime,
                endTime: endTime,
                is_pending: true,
                is_approved: false,
            };

            console.log('Appointment Payload:', appointmentPayload);

            const response = await fetch('https://healthnet-web-production.up.railway.app/appointment', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentPayload),
            });

            if (!response.ok) {
                const errorResponse = await response.text();
                throw new Error(`Failed to send appointment proposal: ${errorResponse}`);
            }

            setResponseMessage('Appointment proposal sent successfully!');
        } catch (error) {
            console.error('Error sending appointment proposal:', error);
            setResponseMessage('Failed to send appointment proposal.');
        }
    };




    if (errorMessage) {
        return <p className="errorMessage">{errorMessage}</p>;
    }

    if (doctors.length === 0) {
        return <p className="loadingMessage">Loading available doctors...</p>;
    }

    return (
        <div className="availableDoctors">
            <h2 className="infoTitle">Available Doctors</h2>
            {!selectedDoctor ? (
                <div className="doctorGrid">
                    {doctors.map((doctor) => (
                        <div
                            key={doctor.id}
                            className="doctorItem"
                            onClick={() => handleDoctorClick(doctor)}
                        >
                            <p><strong>Name:</strong> {doctor.name}</p>
                            <p><strong>Specialization:</strong> {doctor.specialization}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="doctorDetails">
                    {selectedDoctor.image && selectedDoctor.image_type ? (
                        <img
                            src={`data:${selectedDoctor.image_type};base64,${selectedDoctor.image}`}
                            alt="Doctor"
                            className="profileImage"
                        />
                    ) : (
                        <div className="placeholderCircle">
                            <p className="placeholderText">No Image</p>
                        </div>
                    )}
                    <p><strong>Name:</strong> {selectedDoctor.name}</p>
                    <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
                    <p><strong>Gender:</strong> {selectedDoctor.gender}</p>
                    <p><strong>Age:</strong> {selectedDoctor.age}</p>
                    <p><strong>Contact Info:</strong> {selectedDoctor.contact_info}</p>
                    <p><strong>Address:</strong> {selectedDoctor.address}</p>

                    <button className="bookAppointmentButton" onClick={handleBookAppointmentClick}>
                        Book Appointment
                    </button>

                    <button className="backButton" onClick={handleBackClick}>
                        Back to List
                    </button>

                    {showAppointmentTab && (
                        <div className="appointmentTab">
                            <h3>Select Appointment Date</h3>
                            <input
                                type="date"
                                value={appointmentDate}
                                onChange={handleDateChange}
                                className="appointmentDateInput"
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                            {availableTimes.length > 0 && (
                                <>
                                    <h3>Select Available Time Range</h3>
                                    <select
                                        value={selectedTimeRange}
                                        onChange={handleTimeRangeChange}
                                        className="appointmentTimeSelect"
                                        required
                                    >
                                        <option value="">Select a range</option>
                                        {availableTimes.map((time, index) => (
                                            <option key={index} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedTimeRange && (
                                        <>
                                            <h3>Select Start Time</h3>
                                            <input
                                                type="time"
                                                value={startTime}
                                                onChange={handleStartTimeChange}
                                                className="appointmentStartTimeInput"
                                                required
                                            />
                                            <h3>Select Appointment Duration (in minutes)</h3>
                                            <select
                                                value={appointmentDuration}
                                                onChange={handleDurationChange}
                                                className="appointmentDurationSelect"
                                                required
                                            >
                                                {[...Array(Math.floor(maxDuration / 5)).keys()].map((i) => (
                                                    <option key={i} value={(i + 1) * 5}>
                                                        {(i + 1) * 5} minutes
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                className="sendProposalButton"
                                                onClick={handleSendAppointmentProposal}
                                            >
                                                Send Appointment Proposal
                                            </button>
                                            {responseMessage && (
                                                <p className="responseMessage">{responseMessage}</p>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AvailableDoctors;
