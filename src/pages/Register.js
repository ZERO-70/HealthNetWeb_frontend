import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [userType, setUserType] = useState('');
    const [formData, setFormData] = useState({});
    const [imageBase64, setImageBase64] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImageBase64(reader.result.split(',')[1]);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const usernameExists = await checkUsernameAvailability(username);
        if (usernameExists) {
            setErrorMessage('Username already exists. Please choose a different username.');
            return;
        }

        try {
            const updatedFormData = { ...formData, image: imageBase64, image_type: 'jpeg' };

            const baseUrl = 'https://healthnet-web-production.up.railway.app';
            const personEndpoint = userType === 'PATIENT' ? '/patient' : '/doctor';

            const personResponse = await fetch(`${baseUrl}${personEndpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFormData),
            });

            if (!personResponse.ok) {
                const errorResponse = await personResponse.text();
                throw new Error(`Failed to register ${userType.toLowerCase()}: ${errorResponse}`);
            }

            const personId = parseInt(await personResponse.text(), 10);

            const authPayload = {
                username,
                password,
                role: userType,
                personId,
            };

            const authResponse = await fetch(`${baseUrl}/user_authentication/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(authPayload),
            });

            if (!authResponse.ok) {
                const errorResponse = await authResponse.text();
                throw new Error(`Failed to register user: ${errorResponse}`);
            }

            setResponseMessage(`Registration successful! You are now registered as a ${userType}.`);

            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error(error.message);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="wrapper">
            <div className="container">
                <h1 className="title">Register</h1>
                {!userType && (
                    <div className="userTypeSelection">
                        <p>Are you registering as a:</p>
                        <button onClick={() => setUserType('PATIENT')} className="button">
                            Patient
                        </button>
                        <button onClick={() => setUserType('DOCTOR')} className="button">
                            Doctor
                        </button>
                    </div>
                )}
                {userType && (
                    <form onSubmit={handleSubmit} className="form">
                        <h2>Register as a {userType}</h2>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageUpload}
                            required
                        />
                        {userType === 'PATIENT' && (
                            <>
                                <input type="text" name="name" placeholder="Name" required onChange={handleChange} />
                                <input type="text" name="gender" placeholder="Gender" required onChange={handleChange} />
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
                                <input type="text" name="weight" placeholder="Weight" required onChange={handleChange} />
                                <input type="text" name="height" placeholder="Height" required onChange={handleChange} />
                            </>
                        )}
                        {userType === 'DOCTOR' && (
                            <>
                                <input type="text" name="name" placeholder="Name" required onChange={handleChange} />
                                <input type="text" name="gender" placeholder="Gender" required onChange={handleChange} />
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
                                    name="specialization"
                                    placeholder="Specialization"
                                    required
                                    onChange={handleChange}
                                />
                            </>
                        )}
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
                            Register
                        </button>
                        <button
                            type="button"
                            className="button"
                            onClick={() => navigate('/')} // Navigate back to login page
                        >
                            Back to Login
                        </button>
                    </form>
                )}
                {responseMessage && <p className="successMessage">{responseMessage}</p>}
                {errorMessage && <p className="errorMessage">{errorMessage}</p>}
            </div>
        </div>
    );
}

export default Register;
