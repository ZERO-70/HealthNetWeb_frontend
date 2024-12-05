import React, { useEffect, useState } from 'react';
import '../styles/AdminInfo.css'; // CSS for AdminInfo component

function AdminInfo() {
    const [adminData, setAdminData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchAdminInfo = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Authentication token is missing. Please log in again.');
                }

                // Log the token for debugging
                console.log('Token being sent with request:', token);

                // Fetch admin data from the /getmine endpoint
                const response = await fetch(`https://healthnet-web-production.up.railway.app/persons/getmine`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorResponse = await response.text();
                    throw new Error(`Error fetching admin info: ${errorResponse}`);
                }

                const data = await response.json();
                console.log('Fetched admin data:', data); // Debugging line
                setAdminData(data);

                // Store the admin's ID in local storage
                if (data && data.id) {
                    localStorage.setItem('adminId', data.id);
                    console.log('Admin ID stored in localStorage:', data.id);
                }
            } catch (error) {
                console.error('Error fetching admin info:', error);
                setErrorMessage(error.message);
            }
        };

        fetchAdminInfo();
    }, []);

    if (errorMessage) {
        return <p className="errorMessage">{errorMessage}</p>;
    }

    if (!adminData || Object.keys(adminData).length === 0) {
        return <p className="loadingMessage">Loading your information...</p>;
    }

    return (
        <div className="adminInfo">
            <h2 className="infoTitle">Your Information</h2>
            <div className="imageContainer">
                {adminData.image && adminData.image_type ? (
                    <img
                        src={`data:${adminData.image_type};base64,${adminData.image}`}
                        alt="Admin"
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
                    <strong>Name:</strong> {adminData.name || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Age:</strong> {adminData.age || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Gender:</strong> {adminData.gender || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Birthdate:</strong> {adminData.birthdate || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Contact Info:</strong> {adminData.contact_info || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Address:</strong> {adminData.address || 'N/A'}
                </div>
            </div>
        </div>
    );
}

export default AdminInfo;
