import React, { useState } from 'react';
import '../styles/FindPatients.css';

function FindPatients() {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        // Add logic to search for patients
        console.log('Searching for patients with query:', searchQuery);
    };

    return (
        <div className="find-patients">
            <h2>Find Patients</h2>
            <input
                type="text"
                placeholder="Enter patient name or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />
            <button onClick={handleSearch} className="search-button">
                Search
            </button>
            <div className="patients-list">
                {/* Add logic to render patients */}
                <p>No patients found yet.</p>
            </div>
        </div>
    );
}

export default FindPatients;
