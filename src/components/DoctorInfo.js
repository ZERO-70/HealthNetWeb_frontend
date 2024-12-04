import React, { useEffect, useState } from 'react';
import '../styles/DoctorInfo.css'; // CSS for the DoctorInfo component

function DoctorInfo() {
    const [doctorData, setDoctorData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchDoctorInfo = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Authentication token is missing. Please log in again.');
                }

                const response = await fetch('https://healthnet-web-production.up.railway.app/doctor/getmine', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorResponse = await response.text();
                    throw new Error(`Error fetching doctor info: ${errorResponse}`);
                }

                const data = await response.json();
                console.log('Fetched doctor data:', data); // Debugging line
                setDoctorData(data);

                // Save the doctor ID to localStorage (if required in future features)
                if (data?.id) {
                    localStorage.setItem('doctorId', data.id);
                    console.log('Doctor ID saved to localStorage:', data.id);
                } else {
                    console.warn('Doctor ID is missing in the fetched data.');
                }
            } catch (error) {
                console.error('Error fetching doctor info:', error);
                setErrorMessage(error.message);
            }
        };

        fetchDoctorInfo();
    }, []);

    if (errorMessage) {
        return <p className="errorMessage">{errorMessage}</p>;
    }

    if (!doctorData || Object.keys(doctorData).length === 0) {
        return <p className="loadingMessage">Loading your information...</p>;
    }

    return (
        <div className="doctorInfo">
            <h2 className="infoTitle">Your Information</h2>
            <div className="imageContainer">
                {doctorData.image && doctorData.image_type ? (
                    <img
                        src={`data:${doctorData.image_type};base64,${doctorData.image}`}
                        alt="Doctor"
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
                    <strong>Name:</strong> {doctorData.name || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Age:</strong> {doctorData.age || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Gender:</strong> {doctorData.gender || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Birthdate:</strong> {doctorData.birthdate || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Contact Info:</strong> {doctorData.contact_info || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Address:</strong> {doctorData.address || 'N/A'}
                </div>
                <div className="infoItem">
                    <strong>Specialization:</strong> {doctorData.specialization || 'N/A'}
                </div>
            </div>
        </div>
    );
}

export default DoctorInfo;
