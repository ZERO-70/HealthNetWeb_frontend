import React, { useState, useEffect } from 'react';
import '../styles/AddTreatment.css';

function AddTreatment() {
    const [treatmentName, setTreatmentName] = useState('');
    const [departmentId, setDepartmentId] = useState(''); // For selected department
    const [departments, setDepartments] = useState([]); // List of departments
    const [treatments, setTreatments] = useState([]); // Store treatments owned by the doctor
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch departments and treatments on component mount
    useEffect(() => {
        fetchAllDepartments();
        fetchDoctorTreatments();
    }, []);

    const fetchAllDepartments = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token is missing. Please log in again.');
            }

            const response = await fetch('https://healthnet-web-production.up.railway.app/department', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch departments.');
            }

            const data = await response.json();
            console.log('Fetched Departments:', data); // Debug log for departments
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments:', error);
            setErrorMessage('Failed to fetch departments.');
        }
    };

    const fetchDoctorTreatments = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const doctorId = localStorage.getItem('doctorId'); // Fetch doctor ID from local storage
            if (!token || !doctorId) {
                throw new Error('Authentication token or doctor ID is missing. Please log in again.');
            }

            const response = await fetch('https://healthnet-web-production.up.railway.app/treatement', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch treatments.');
            }

            const data = await response.json();
            console.log('Fetched Treatments:', data); // Print fetched treatments to the console

            // Filter treatments based on doctor ID
            const doctorTreatments = data.filter((treatment) => treatment.doctor_id.toString() === doctorId);
            console.log('Filtered Treatments for Current Doctor:', doctorTreatments); // Debug log for filtered treatments

            setTreatments(doctorTreatments);
        } catch (error) {
            console.error('Error fetching treatments:', error);
            setErrorMessage('Failed to fetch treatments.');
        }
    };

    const handleAddTreatment = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const doctorId = localStorage.getItem('doctorId'); // Fetch doctor ID from local storage
            if (!token || !doctorId) {
                throw new Error('Authentication token or doctor ID is missing. Please log in again.');
            }

            const treatmentData = {
                name: treatmentName,
                department_id: parseInt(departmentId, 10),
                doctor_id: parseInt(doctorId, 10),
            };

            console.log('Sending Treatment Data:', treatmentData); // Log treatment data to the console

            const response = await fetch('https://healthnet-web-production.up.railway.app/treatement', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(treatmentData),
            });

            if (!response.ok) {
                throw new Error('Failed to add treatment.');
            }

            setSuccessMessage('Treatment added successfully!');
            setErrorMessage('');
            setTreatmentName('');
            setDepartmentId('');

            // Refresh treatments list after adding a new treatment
            fetchDoctorTreatments();
        } catch (error) {
            console.error('Error adding treatment:', error);
            setErrorMessage('Failed to add treatment.');
            setSuccessMessage('');
        }
    };

    const handleDeleteTreatment = async (treatmentId) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token is missing. Please log in again.');
            }

            const response = await fetch(`https://healthnet-web-production.up.railway.app/treatement/${treatmentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete treatment.');
            }

            setSuccessMessage('Treatment deleted successfully!');
            setErrorMessage('');

            // Refresh treatments list after deleting a treatment
            fetchDoctorTreatments();
        } catch (error) {
            console.error('Error deleting treatment:', error);
            setErrorMessage('Failed to delete treatment.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="add-treatment">
            <h2>Add Treatment</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <form onSubmit={(e) => e.preventDefault()}>
                <label>
                    Treatment Name:
                    <input
                        type="text"
                        value={treatmentName}
                        onChange={(e) => setTreatmentName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Department:
                    <select
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            Select a Department
                        </option>
                        {departments.map((department) => (
                            <option key={department.department_id} value={department.department_id}>
                                {department.name}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="button" onClick={handleAddTreatment}>
                    Add Treatment
                </button>
            </form>

            <h2>Your Treatments</h2>
            <div className="treatment-list">
                {treatments.length > 0 ? (
                    treatments.map((treatment) => (
                        <div key={treatment.treatement_id} className="treatment-card">
                            <h3>{treatment.name}</h3>
                            <p>Department ID: {treatment.department_id}</p>
                            <p>Doctor ID: {treatment.doctor_id}</p>
                            <p>Treatment ID: {treatment.treatement_id}</p>
                            <button
                                className="delete-button"
                                onClick={() => handleDeleteTreatment(treatment.treatement_id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No treatments found.</p>
                )}
            </div>
        </div>
    );
}

export default AddTreatment;
