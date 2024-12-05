import React, { useState, useEffect } from 'react';
import '../styles/FindPatients.css';

function FindPatient() {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('https://healthnet-web-production.up.railway.app/patient', {
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
            setFilteredPatients(data);
        } catch (error) {
            console.error('Error fetching patients:', error);
            setErrorMessage(error.message);
        }
    };

    const fetchPatientById = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://healthnet-web-production.up.railway.app/patient/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Patient not found.');
            }

            const patient = await response.json();
            setFilteredPatients([patient]); // Show only the specific patient
        } catch (error) {
            console.error('Error fetching patient by ID:', error);
            setErrorMessage(error.message);
            setFilteredPatients([]); // Clear results if not found
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        // Filter by name dynamically while typing
        if (isNaN(term)) {
            const filtered = patients.filter((patient) =>
                patient.name?.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredPatients(filtered);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            // If a number is entered, fetch the specific patient by ID
            if (!isNaN(searchTerm) && searchTerm.trim() !== '') {
                fetchPatientById(searchTerm.trim());
            }
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        <div className="findPatient">
            <h2 className="findPatientTitle">Find Patient</h2>
            <input
                type="text"
                placeholder="Search by Name or ID"
                value={searchTerm}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
                className="searchBar"
            />
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
            <div className="patientGrid">
                {filteredPatients.map((patient) => (
                    <div key={patient.id} className="patientCard">
                        <p><strong>Name:</strong> {patient.name}</p>
                        <p><strong>Age:</strong> {patient.age}</p>
                        <p><strong>Gender:</strong> {patient.gender}</p>
                        <p><strong>Weight:</strong> {patient.weight}</p>
                        <p><strong>Height:</strong> {patient.height}</p>
                        <p><strong>Contact Info:</strong> {patient.contact_info}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FindPatient;
