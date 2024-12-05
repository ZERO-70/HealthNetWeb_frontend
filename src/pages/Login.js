import React, { useState } from 'react';
import '../styles/Login.css'; // Adjust the path based on your project structure
import { useNavigate } from 'react-router-dom'; // For redirection

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate for navigation

    const handleSubmit = async (event) => {
        event.preventDefault();

        const loginUrl = 'https://healthnet-web-production.up.railway.app/user_authentication/login';
        const homeUrl = 'https://healthnet-web-production.up.railway.app/home';

        const payload = {
            username: username,
            password: password,
            role: 'PATIENT', // Default role (can be adjusted in the backend if necessary)
            personId: null,
        };

        try {
            // First API call: Login
            const loginResponse = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!loginResponse.ok) {
                const errorResponse = await loginResponse.text();
                throw new Error(`Login failed: ${errorResponse}`);
            }

            // Get the token from login response
            const token = await loginResponse.text();
            console.log('Token received:', token);

            // Store the token in localStorage
            localStorage.setItem('authToken', token);

            // Second API call: Access the /home endpoint
            const homeResponse = await fetch(homeUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in Authorization header
                    'Content-Type': 'application/json',
                },
            });

            if (!homeResponse.ok) {
                const errorResponse = await homeResponse.text();
                throw new Error(`Failed to fetch home data: ${errorResponse}`);
            }

            // Get the response from /home and store it
            const homeData = await homeResponse.text();
            console.log('Home Data:', homeData);
            localStorage.setItem('homeData', homeData);

            alert('Login successful!');

            // Redirect user based on role
            if (homeData.includes('PATIENT')) {
                navigate('/patient-portal'); // Redirect to Patient Portal
            } else if (homeData.includes('DOCTOR')) {
                navigate('/doctor-portal'); // Redirect to Doctor Portal
            } else if (homeData.includes('STAFF')) {
                navigate('/staff-portal');
            }
            else if (homeData.includes('ADMIN')) {
                navigate('/admin-portal');
            }

            else {
                throw new Error('Unknown role in response data');
            }
        } catch (error) {
            console.error('Error during login process:', error.message);
            setErrorMessage('Login failed. Please check your username and password.');
        }
    };

    return (
        <div className="wrapper">
            <div className="container">
                <h1 className="title">Welcome Back</h1>
                <p className="subtitle">Access your HealthNet dashboard.</p>
                <form onSubmit={handleSubmit} className="form">
                    <div className="inputGroup">
                        <label htmlFor="username" className="label">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="input"
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="password" className="label">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input"
                        />
                    </div>
                    {errorMessage && (
                        <p className="errorMessage">{errorMessage}</p>
                    )}
                    <button type="submit" className="button">
                        Login
                    </button>
                </form>
                <p className="footerText">
                    Don't have an account?{' '}
                    <a href="/register" className="signUpLink">
                        Sign up?
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Login;
