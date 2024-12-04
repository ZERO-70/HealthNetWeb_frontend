import React, { useState, useEffect } from 'react';
import '../styles/ManageAvailability.css'; // Link to the CSS file

function ManageAvailability() {
    const [availability, setAvailability] = useState({});
    const [isNotFound, setIsNotFound] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Fetch current availability
        const fetchAvailability = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Authentication token is missing. Please log in again.');
                }

                const response = await fetch('https://healthnet-web-production.up.railway.app/avalibility/getmine', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 404) {
                    setIsNotFound(true); // No availability found
                } else if (!response.ok) {
                    throw new Error('Error fetching availability.');
                } else {
                    const data = await response.json();
                    setAvailability(data || {}); // Ensure availability is initialized as an object
                }
            } catch (error) {
                console.error('Error fetching availability:', error);
                setErrorMessage('Failed to fetch availability.');
            }
        };

        fetchAvailability();
    }, []);

    const handleChange = (day, field, value) => {
        const lowercaseDay = day.toLowerCase(); // Convert day to lowercase for consistent keys
        setAvailability((prev) => {
            const updatedAvailability = {
                ...prev,
                [`${lowercaseDay}_${field}`]: value, // Use lowercase keys
            };
            return updatedAvailability;
        });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const url = isNotFound
                ? 'https://healthnet-web-production.up.railway.app/avalibility'
                : 'https://healthnet-web-production.up.railway.app/avalibility';

            const method = isNotFound ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(availability),
            });

            if (!response.ok) {
                throw new Error('Failed to save availability.');
            }

            setSuccessMessage(isNotFound ? 'Availability added successfully!' : 'Availability updated successfully!');
            setIsNotFound(false); // Reset not found after saving
        } catch (error) {
            console.error('Error saving availability:', error);
            setErrorMessage('Failed to save availability.');
        }
    };

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="manage-availability">
            <h2>{isNotFound ? 'Add Availability' : 'Update Availability'}</h2>
            {availability || isNotFound ? (
                <form onSubmit={(e) => e.preventDefault()} className="availability-form">
                    {days.map((day) => (
                        <div key={day} className="day-row">
                            <h3>{day}</h3>
                            <label>
                                Start Time:
                                <input
                                    type="time"
                                    value={availability?.[`${day.toLowerCase()}_startTime`] || ''}
                                    onChange={(e) => handleChange(day, 'startTime', e.target.value)}
                                />
                            </label>
                            <label>
                                End Time:
                                <input
                                    type="time"
                                    value={availability?.[`${day.toLowerCase()}_endTime`] || ''}
                                    onChange={(e) => handleChange(day, 'endTime', e.target.value)}
                                />
                            </label>
                        </div>
                    ))}
                    <button type="button" onClick={handleSave} className="save-button">
                        {isNotFound ? 'Add Availability' : 'Update Availability'}
                    </button>
                </form>
            ) : (
                <p>Loading availability...</p>
            )}
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default ManageAvailability;
