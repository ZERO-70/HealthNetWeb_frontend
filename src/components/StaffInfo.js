import React, { useEffect, useState } from 'react';
import '../styles/StaffInfo.css'; // CSS for the component

function StaffInfo() {
    const [staffData, setStaffData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchStaffInfo = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Authentication token is missing. Please log in again.');
                }

                const response = await fetch('https://healthnet-web-production.up.railway.app/staff/getmine', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorResponse = await response.text();
                    throw new Error(`Error fetching staff info: ${errorResponse}`);
                }

                const data = await response.json();
                console.log('Fetched staff data:', data); // Debugging line
                setStaffData(data);

                // Save the staff ID to localStorage
                if (data?.id) {
                    localStorage.setItem('staffId', data.id);
                    console.log('Staff ID saved to localStorage:', data.id);
                } else {
                    console.warn('Staff ID is missing in the fetched data.');
                }
            } catch (error) {
                console.error('Error fetching staff info:', error);
                setErrorMessage(error.message);
            }
        };

        fetchStaffInfo();
    }, []);

    if (errorMessage) {
        return <p className="errorMessage">{errorMessage}</p>;
    }

    if (!staffData || Object.keys(staffData).length === 0) {
        return <p className="loadingMessage">Loading your information...</p>;
    }

    return (
        <div className="staffInfo">
            <h2 className="infoTitle">Your Information</h2>
            <div className="imageContainer">
                {staffData.image && staffData.image_type ? (
                    <img
                        src={`data:${staffData.image_type};base64,${staffData.image}`}
                        alt="Staff"
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
                    <strong>Name:</strong> {staffData.name || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Age:</strong> {staffData.age || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Gender:</strong> {staffData.gender || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Birthdate:</strong> {staffData.birthdate || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Contact Info:</strong> {staffData.contact_info || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Address:</strong> {staffData.address || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Profession:</strong> {staffData.proffession || 'N/A'}
                </div>
            </div>
        </div>
    );
}

export default StaffInfo;
