import React, { useState, useEffect } from 'react';
import '../styles/ProfileUpdate.css';

function UpdateAdminProfile() {
    const [formData, setFormData] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [imageFile, setImageFile] = useState(null);

    // Fetch current admin data
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Authentication token is missing. Please log in again.');
                }

                const response = await fetch('https://healthnet-web-production.up.railway.app/persons/getmine', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorResponse = await response.text();
                    throw new Error(`Error fetching admin data: ${errorResponse}`);
                }

                const data = await response.json();
                setFormData(data); // Pre-fill form fields with fetched data
            } catch (error) {
                console.error('Error fetching admin data:', error);
                setErrorMessage('Failed to fetch admin data.');
            }
        };

        fetchAdminData();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    image: reader.result.split(',')[1], // Extract base64 string
                    image_type: file.type,
                });
            };
            reader.readAsDataURL(file);
            setImageFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log('Data to be sent:', formData); // Log the form data to the console

            const token = localStorage.getItem('authToken');
            const adminId = localStorage.getItem('adminId'); // Retrieve admin ID from localStorage
            const response = await fetch(`https://healthnet-web-production.up.railway.app/persons/${adminId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorResponse = await response.text();
                throw new Error(`Failed to update profile: ${errorResponse}`);
            }

            setSuccessMessage('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage('Failed to update profile.');
        }
    };

    return (
        <div className="updateProfile">
            <h2>Update Admin Profile</h2>
            <form onSubmit={handleSubmit} className="updateForm">
                <div className="formGroup">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="birthdate">Birthdate</label>
                    <input
                        type="date"
                        name="birthdate"
                        id="birthdate"
                        value={formData.birthdate || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="gender">Gender</label>
                    <select
                        name="gender"
                        id="gender"
                        value={formData.gender || ''}
                        onChange={handleChange}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="formGroup">
                    <label htmlFor="contact_info">Contact Info</label>
                    <input
                        type="text"
                        name="contact_info"
                        id="contact_info"
                        value={formData.contact_info || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        name="address"
                        id="address"
                        value={formData.address || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="profileImage">Profile Image</label>
                    <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                {imageFile && <p className="fileName">Selected File: {imageFile.name}</p>}
                <button type="submit" className="submitButton">Update</button>
            </form>
            {successMessage && <p className="successMessage">{successMessage}</p>}
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
        </div>
    );
}

export default UpdateAdminProfile;
