import React, { useState, useEffect } from 'react';
import '../styles/SearchAppointment.css';

function SearchAppointment() {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('https://healthnet-web-production.up.railway.app/appointment', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch appointments.');
            }

            const data = await response.json();

            // Fetch patient and doctor names dynamically for each appointment
            const updatedAppointments = await Promise.all(
                data.map(async (appointment) => {
                    const patientName = await fetchPatientName(appointment.patient_id, token);
                    const doctorName = await fetchDoctorName(appointment.doctor_id, token);

                    return {
                        ...appointment,
                        patient_name: patientName || 'Unknown Patient',
                        doctor_name: doctorName || 'Unknown Doctor',
                    };
                })
            );

            setAppointments(updatedAppointments);
            setFilteredAppointments(updatedAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setErrorMessage(error.message);
        }
    };

    const fetchPatientName = async (id, token) => {
        try {
            const response = await fetch(`https://healthnet-web-production.up.railway.app/patient/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch patient with ID: ${id}`);
            }

            const patient = await response.json();
            return patient.name;
        } catch (error) {
            console.error(`Error fetching patient with ID ${id}:`, error);
            return null;
        }
    };

    const fetchDoctorName = async (id, token) => {
        try {
            const response = await fetch(`https://healthnet-web-production.up.railway.app/doctor/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch doctor with ID: ${id}`);
            }

            const doctor = await response.json();
            return doctor.name;
        } catch (error) {
            console.error(`Error fetching doctor with ID ${id}:`, error);
            return null;
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = appointments.filter((appointment) => {
            const patientNameMatch = appointment.patient_name?.toLowerCase().includes(term);
            const doctorNameMatch = appointment.doctor_name?.toLowerCase().includes(term);
            return patientNameMatch || doctorNameMatch;
        });

        setFilteredAppointments(filtered);
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    return (
        <div className="searchAppointment">
            <h2 className="searchAppointmentTitle">Search Appointment</h2>
            <input
                type="text"
                placeholder="Search by Patient Name or Doctor Name"
                value={searchTerm}
                onChange={handleSearch}
                className="searchBar"
            />
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
            <div className="appointmentGrid">
                {filteredAppointments.map((appointment) => (
                    <div key={appointment.appointment_id} className="appointmentCard">
                        <p><strong>Appointment ID:</strong> {appointment.appointment_id}</p>
                        <p><strong>Patient Name:</strong> {appointment.patient_name}</p>
                        <p><strong>Doctor Name:</strong> {appointment.doctor_name}</p>
                        <p><strong>Date:</strong> {appointment.date}</p>
                        <p><strong>Start Time:</strong> {appointment.startTime}</p>
                        <p><strong>End Time:</strong> {appointment.endTime}</p>
                        <p><strong>Status:</strong> {appointment.is_pending ? 'Pending' : appointment.is_approved ? 'Approved' : 'Rejected'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchAppointment;
