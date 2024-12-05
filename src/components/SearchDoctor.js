import React, { useState, useEffect } from 'react';
import '../styles/SearchDoctor.css';

function SearchDoctor() {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch doctors from the server
    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('https://healthnet-web-production.up.railway.app/doctor', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch doctors.');
            }

            const data = await response.json();
            setDoctors(data);
            setFilteredDoctors(data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setErrorMessage('Failed to fetch doctor data.');
        }
    };

    // Handle search input changes
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = doctors.filter((doctor) => {
            const nameMatch = doctor.name?.toLowerCase().includes(term);
            const specializationMatch = doctor.specialization?.toLowerCase().includes(term);
            const idMatch = doctor.id?.toString() === term; // Exact ID match
            return nameMatch || specializationMatch || idMatch;
        });

        setFilteredDoctors(filtered);
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    return (
        <div className="searchDoctor">
            <h2 className="searchDoctorTitle">Search Doctor</h2>
            <input
                type="text"
                placeholder="Search by Name, Specialization, or ID"
                value={searchTerm}
                onChange={handleSearch}
                className="searchBar"
            />
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
            <div className="doctorGrid">
                {filteredDoctors.map((doctor) => (
                    <div key={doctor.id} className="doctorCard">
                        <p><strong>Name:</strong> {doctor.name}</p>
                        <p><strong>Specialization:</strong> {doctor.specialization}</p>
                        <p><strong>Gender:</strong> {doctor.gender}</p>
                        <p><strong>Age:</strong> {doctor.age}</p>
                        <p><strong>Birthdate:</strong> {doctor.birthdate}</p>
                        <p><strong>Contact Info:</strong> {doctor.contact_info}</p>
                        <p><strong>Address:</strong> {doctor.address}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchDoctor;
