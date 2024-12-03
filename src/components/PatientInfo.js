import React, { useEffect, useState } from 'react';
import '../styles/PatientInfo.css'; // CSS for the component

function PatientInfo() {
    const [patientData, setPatientData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchPatientInfo = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Authentication token is missing. Please log in again.');
                }

                const response = await fetch('https://healthnet-web-production.up.railway.app/patient/getmine', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorResponse = await response.text();
                    throw new Error(`Error fetching patient info: ${errorResponse}`);
                }

                const data = await response.json();
                console.log('Fetched patient data:', data); // Debugging line
                setPatientData(data);

                // Save the patient ID to localStorage
                if (data?.id) {
                    localStorage.setItem('patientId', data.id);
                    console.log('Patient ID saved to localStorage:', data.id);
                } else {
                    console.warn('Patient ID is missing in the fetched data.');
                }
            } catch (error) {
                console.error('Error fetching patient info:', error);
                setErrorMessage(error.message);
            }
        };

        fetchPatientInfo();
    }, []);

    if (errorMessage) {
        return <p className="errorMessage">{errorMessage}</p>;
    }

    if (!patientData || Object.keys(patientData).length === 0) {
        return <p className="loadingMessage">Loading your information...</p>;
    }

    return (
        <div className="patientInfo">
            <h2 className="infoTitle">Your Information</h2>
            <div className="imageContainer">
                {patientData.image && patientData.image_type ? (
                    <img
                        src={`data:${patientData.image_type};base64,${patientData.image}`}
                        alt="Patient"
                        className="profileImage"
                    />
                ) : (
                    <div className="placeholderCircle">
                        <p className="placeholderText">No Image</p>
                    </div>
                )}
            </div>
            <div className="infoGrid">
                <div className="infoItem">
                    <strong>Name:</strong> {patientData.name || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Age:</strong> {patientData.age || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Gender:</strong> {patientData.gender || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Birthdate:</strong> {patientData.birthdate || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Contact Info:</strong> {patientData.contact_info || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Address:</strong> {patientData.address || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Weight:</strong> {patientData.weight || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Height:</strong> {patientData.height || 'N/A'}
                </div>
            </div>
        </div>
    );
}

export default PatientInfo;
