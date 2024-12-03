import React, { useState, useEffect } from 'react';
import '../styles/PatientAppointments.css'; // Custom CSS for styling

function PatientAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchDoctorName = async (doctorId, token) => {
        try {
            const response = await fetch(`https://healthnet-web-production.up.railway.app/doctor/${doctorId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch doctor details.');
            }

            const doctor = await response.json();
            return doctor.name; // Assuming the API returns a `name` field in the doctor object
        } catch (error) {
            console.error(`Error fetching doctor name for ID ${doctorId}:`, error);
            return 'Unknown Doctor'; // Fallback in case of an error
        }
    };

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token is missing. Please log in again.');
            }

            const response = await fetch('https://healthnet-web-production.up.railway.app/appointment/getmine', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorResponse = await response.text();
                throw new Error(`Failed to fetch appointments: ${errorResponse}`);
            }

            const data = await response.json();

            // Fetch doctor names and update appointments with doctor names
            const updatedAppointments = await Promise.all(
                data.map(async (appointment) => {
                    const doctorName = await fetchDoctorName(appointment.doctor_id, token);
                    return { ...appointment, doctorName };
                })
            );

            // Sort appointments by date and time
            updatedAppointments.sort((a, b) => {
                if (a.date === b.date) {
                    return a.startTime.localeCompare(b.startTime);
                }
                return new Date(a.date) - new Date(b.date);
            });

            setAppointments(updatedAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    if (errorMessage) {
        return <p className="errorMessage">{errorMessage}</p>;
    }

    if (appointments.length === 0) {
        return <p className="loadingMessage">No appointments found.</p>;
    }

    return (
        <div className="appointments">
            <h2 className="appointmentsTitle">Your Appointments</h2>
            <div className="appointmentsList">
                {appointments.map((appointment) => (
                    <div key={appointment.appointment_id} className="appointmentCard">
                        <p><strong>Date:</strong> {appointment.date}</p>
                        <p><strong>Time:</strong> {appointment.startTime} - {appointment.endTime}</p>
                        <p><strong>Doctor:</strong> {appointment.doctorName}</p>
                        <p><strong>Is Approved:</strong> {appointment.is_approved ? 'Yes' : 'No'}</p>
                        <p><strong>Status:</strong> {appointment.is_approved ? 'Approved' : appointment.is_pending ? 'Pending' : 'Rejected'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PatientAppointments;
