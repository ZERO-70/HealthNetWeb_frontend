import React, { useState, useEffect } from 'react';
import '../styles/SearchPatients.css';

function SearchPatients() {
    const [searchQuery, setSearchQuery] = useState('');
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [treatmentDetails, setTreatmentDetails] = useState([]); // For storing treatment details
    const [selectedPatient, setSelectedPatient] = useState(null); // For showing patient name in the modal
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Fetch patients on page load
        fetchAllPatients();
    }, []); // Empty dependency array ensures it runs only once

    useEffect(() => {
        // Filter patients whenever the search query changes
        if (searchQuery) {
            const filtered = patients.filter((patient) =>
                patient.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredPatients(filtered);
        } else {
            setFilteredPatients(patients); // Reset to all patients if search query is empty
        }
    }, [searchQuery, patients]); // Runs whenever searchQuery or patients changes

    const fetchAllPatients = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token is missing. Please log in again.');
            }

            const response = await fetch(`https://healthnet-web-production.up.railway.app/patient`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch patients.');
            }

            const data = await response.json();
            setPatients(data);
            setFilteredPatients(data); // Initialize filtered patients
        } catch (error) {
            console.error('Error fetching patients:', error);
            setErrorMessage('Failed to fetch patients.');
        }
    };

    const fetchMedicalRecords = async (patientId, patientName) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token is missing. Please log in again.');
            }

            const response = await fetch(`https://healthnet-web-production.up.railway.app/medical_record/patient/${patientId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch medical records.');
            }

            const data = await response.json();
            setMedicalRecords(data);
            setSelectedPatient(patientName); // Set the patient's name for the modal title

            // Fetch treatment details for each medical record
            const treatments = await Promise.all(
                data.map(async (record) => {
                    if (record.treatement_id) {
                        const treatment = await fetchTreatmentDetails(record.treatement_id);
                        return { ...treatment, treatement_id: record.treatement_id }; // Include treatement_id for mapping
                    }
                    return null;
                })
            );

            setTreatmentDetails(treatments.filter((treatment) => treatment !== null)); // Exclude null values
            setShowModal(true); // Open the modal
        } catch (error) {
            console.error('Error fetching medical records:', error);
            setErrorMessage('Failed to fetch medical records.');
        }
    };

    const fetchTreatmentDetails = async (treatmentId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://healthnet-web-production.up.railway.app/treatement/${treatmentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch treatment details.');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching treatment details:', error);
            return null;
        }
    };

    const closeModal = () => {
        setShowModal(false); // Close the modal
        setMedicalRecords([]); // Clear the records
        setTreatmentDetails([]); // Clear the treatment details
        setSelectedPatient(null); // Clear the selected patient
    };

    return (
        <div className="search-patients">
            <h2>Search Patients</h2>
            <input
                type="text"
                placeholder="Enter patient name or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="patients-list">
                {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                        <div key={patient.id} className="patient-card">
                            <h3>{patient.name}</h3>
                            <p>ID: {patient.id}</p>
                            <p>Age: {patient.age}</p>
                            <p>Contact: {patient.contact_info}</p>
                            <button
                                onClick={() => fetchMedicalRecords(patient.id, patient.name)}
                                className="view-records-button"
                            >
                                View Medical Records
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No patients found.</p>
                )}
            </div>

            {/* Modal for displaying medical records and treatments */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-button" onClick={closeModal}>&times;</span>
                        <h2>Medical Records for {selectedPatient}</h2>
                        {medicalRecords.length > 0 ? (
                            <ul>
                                {medicalRecords.map((record) => {
                                    const treatmentDetail = treatmentDetails.find(
                                        (treatment) => treatment.treatement_id === record.treatement_id
                                    );
                                    return (
                                        <li key={record.record_id}>
                                            <p>Diagnosis: {record.diagnosis}</p>
                                            <p>Blood Pressure: {record.bloodpressure}</p>
                                            <p>Date: {record.date}</p>
                                            {treatmentDetail ? (
                                                <div className="treatment-details">
                                                    <h4>Treatment Details:</h4>
                                                    <p>Treatment Name: {treatmentDetail.name || 'N/A'}</p>
                                                    <p>Doctor ID: {treatmentDetail.doctor_id}</p>
                                                </div>
                                            ) : (
                                                <p>No treatment details found.</p>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p>No medical records found.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchPatients;
