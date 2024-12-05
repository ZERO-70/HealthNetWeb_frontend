import React, { useState } from 'react';
import '../styles/RegisterStaff.css'; // Optional: Include your custom CSS styles for better UI

function AddStaff() {
    const [formData, setFormData] = useState({});
    const [imageBase64, setImageBase64] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle image upload and convert it to Base64
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImageBase64(reader.result.split(',')[1]); // Extract Base64 string
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    // Check if username is available
    const checkUsernameAvailability = async (username) => {
        try {
            const response = await fetch(
                `https://healthnet-web-production.up.railway.app/user_authentication/exists/${username}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            if (!response.ok) {
                throw new Error('Error checking username availability.');
            }

            const exists = await response.json();
            return exists;
        } catch (error) {
            console.error(error.message);
            setErrorMessage('Failed to check username availability. Please try again.');
            return true;
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if username is available
        const usernameExists = await checkUsernameAvailability(username);
        if (usernameExists) {
            setErrorMessage('Username already exists. Please choose a different username.');
            return;
        }

        try {
            // Add image data to formData
            const updatedFormData = { ...formData, image: imageBase64, image_type: 'jpeg' };

            // First, register the staff
            const staffResponse = await fetch('https://healthnet-web-production.up.railway.app/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFormData),
            });

            if (!staffResponse.ok) {
                const errorResponse = await staffResponse.text();
                throw new Error(`Failed to register staff: ${errorResponse}`);
            }

            // Get the generated staff ID
            const staffId = parseInt(await staffResponse.text(), 10);

            // Then, set up credentials
            const authPayload = {
                username,
                password,
                role: 'STAFF',
                personId: staffId,
            };

            const authResponse = await fetch('https://healthnet-web-production.up.railway.app/user_authentication/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(authPayload),
            });

            if (!authResponse.ok) {
                const errorResponse = await authResponse.text();
                throw new Error(`Failed to register user: ${errorResponse}`);
            }

            setResponseMessage('Staff registration successful!');
            setFormData({});
            setUsername('');
            setPassword('');
            setImageBase64('');
        } catch (error) {
            console.error('Error during registration:', error.message);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="wrapper">
            <div className="container">
                <h1 className="title">Register Staff</h1>
                <form onSubmit={handleSubmit} className="form">
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        required
                    />
                    <input type="text" name="name" placeholder="Name" required onChange={handleChange} />
                    <select name="gender" required onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        required
                        onChange={handleChange}
                        className="fullWidthInput"
                    />
                    <input
                        type="date"
                        name="birthdate"
                        placeholder="Birthdate"
                        required
                        onChange={handleChange}
                        className="fullWidthInput"
                    />
                    <input
                        type="text"
                        name="contact_info"
                        placeholder="Contact Info"
                        required
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        required
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="proffession"
                        placeholder="Profession"
                        required
                        onChange={handleChange}
                    />
                    <h3>Set up your credentials</h3>
                    <input
                        type="text"
                        placeholder="Username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="fullWidthInput"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="fullWidthInput"
                    />
                    <button type="submit" className="button">
                        Register Staff
                    </button>
                </form>
                {responseMessage && <p className="successMessage">{responseMessage}</p>}
                {errorMessage && <p className="errorMessage">{errorMessage}</p>}
            </div>
        </div>
    );
}

export default AddStaff;
