import React, { useState, useEffect } from 'react';
import '../styles/PatientMedicalRecords.css'; // Add relevant styles

function PatientMedicalRecords() {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchMedicalRecords = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Authentication token is missing. Please log in again.');
                }

                const response = await fetch('https://healthnet-web-production.up.railway.app/medical_record/getmine', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorResponse = await response.text();
                    throw new Error(`Failed to fetch medical records: ${errorResponse}`);
                }

                const data = await response.json();
                // Sort records by date (most recent first)
                data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setMedicalRecords(data);
            } catch (error) {
                console.error('Error fetching medical records:', error);
                setErrorMessage(error.message);
            }
        };

        fetchMedicalRecords();
    }, []);

    if (errorMessage) {
        return <p className="errorMessage">{errorMessage}</p>;
    }

    if (medicalRecords.length === 0) {
        return <p className="loadingMessage">No medical records found.</p>;
    }

    return (
        <div className="medicalRecords">
            <h2 className="recordsTitle">Your Medical Records</h2>
            <div className="recordsList">
                {medicalRecords.map((record) => (
                    <div key={record.record_id} className="recordCard">
                        <p><strong>Date:</strong> {record.date}</p>
                        <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                        <p><strong>Blood Pressure:</strong> {record.bloodpressure}</p>
                        <p><strong>Treatment ID:</strong> {record.treatement_id}</p>
                        <p><strong>Department ID:</strong> {record.department_id}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PatientMedicalRecords;
