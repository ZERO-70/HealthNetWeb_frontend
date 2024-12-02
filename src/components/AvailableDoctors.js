import React, { useState, useEffect } from 'react';

function AvailableDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                // Retrieve the token from localStorage
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('No authentication token found. Please log in again.');
                }

                const response = await fetch('https://healthnet-web-production.up.railway.app/doctor', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Include the token
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

    if (errorMessage) {
        return <p className="errorMessage">{errorMessage}</p>;
    }

    if (doctors.length === 0) {
        return <p>Loading available doctors...</p>;
    }

    return (
        <div className="availableDoctors">
            <h2>Available Doctors</h2>
            <ul>
                {doctors.map((doctor) => (
                    <li key={doctor.id}>
                        <p><strong>Name:</strong> {doctor.name}</p>
                        <p><strong>Specialization:</strong> {doctor.specialization}</p>
                        <p><strong>Contact:</strong> {doctor.contact_info}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AvailableDoctors;
