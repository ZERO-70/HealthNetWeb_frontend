import React, { useState, useEffect } from 'react';
import '../styles/ManageMedicalRecords.css';

function ManageMedicalRecords() {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isCreateMode, setIsCreateMode] = useState(false); // Track if adding a new record
    const [treatments, setTreatments] = useState([]); // Store treatments
    const [newRecord, setNewRecord] = useState({
        department_id: '',
        patient_id: '',
        treatement_id: '',
        diagnosis: '',
        bloodpressure: '',
        date: '',
    });

    const fetchMedicalRecords = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('https://healthnet-web-production.up.railway.app/medical_record', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorResponse = await response.text();
                throw new Error(`Failed to fetch medical records: ${errorResponse}`);
            }

            const records = await response.json();
            setMedicalRecords(records);
            setFilteredRecords(records);
        } catch (error) {
            console.error('Error fetching medical records:', error);
            setErrorMessage(error.message);
        }
    };


    const fetchTreatments = async () => {
        try {
            const token = localStorage.getItem('authToken');
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
            setTreatments(data);
        } catch (error) {
            console.error('Error fetching treatments:', error);
            setErrorMessage(error.message);
        }
    };



    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('authToken');
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
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments:', error);
            setErrorMessage(error.message);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = medicalRecords.filter((record) => {
            const patientIdMatch = record.patient_id.toString().includes(term);
            const treatmentNameMatch = record.treatment?.name?.toLowerCase().includes(term);
            return patientIdMatch || treatmentNameMatch;
        });

        setFilteredRecords(filtered);
    };

    const handleCreateFieldChange = (field, value) => {
        setNewRecord((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('https://healthnet-web-production.up.railway.app/medical_record', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRecord),
            });

            if (!response.ok) {
                throw new Error('Failed to create medical record.');
            }

            alert('Medical record created successfully!');
            setNewRecord({
                department_id: '',
                patient_id: '',
                treatement_id: '',
                diagnosis: '',
                bloodpressure: '',
                date: '',
            });
            setIsCreateMode(false);
            setErrorMessage(''); // Clear the error message after success
            fetchMedicalRecords();
        } catch (error) {
            console.error('Error creating medical record:', error);
            setErrorMessage(error.message); // Set error message only when there's an error
        }
    };


    const handleDelete = async (recordId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://healthnet-web-production.up.railway.app/medical_record/${recordId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete medical record.');
            }

            fetchMedicalRecords();
            alert('Medical record deleted successfully!');
        } catch (error) {
            console.error('Error deleting medical record:', error);
            setErrorMessage(error.message);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('https://healthnet-web-production.up.railway.app/medical_record', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedRecord),
            });

            if (!response.ok) {
                throw new Error('Failed to update medical record.');
            }

            alert('Medical record updated successfully!');
            setSelectedRecord(null);
            fetchMedicalRecords();
        } catch (error) {
            console.error('Error updating medical record:', error);
            setErrorMessage(error.message);
        }
    };

    const handleEditFieldChange = (field, value) => {
        setSelectedRecord((prev) => ({ ...prev, [field]: value }));
    };

    const getTreatmentName = (treatmentId) => {
        const treatment = treatments.find((t) => t.treatement_id === treatmentId);
        return treatment ? treatment.name : 'Unknown Treatment';
    };


    useEffect(() => {
        fetchMedicalRecords();
        fetchDepartments();
        fetchTreatments();
    }, []);


    return (
        <div className="medicalRecords">
            <h2 className="medicalRecordsTitle">Medical Records</h2>
            {!isCreateMode && ( // Conditionally render search bar only if not in create mode
                <input
                    type="text"
                    placeholder="Search by Patient ID or Treatment Name"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="searchBar"
                />
            )}
            <button className="createButton" onClick={() => setIsCreateMode(true)}>Add Medical Record</button>
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
            {isCreateMode ? (
                <div className="createTab">
                    <h3>Create Medical Record</h3>
                    <form onSubmit={handleCreateSubmit}>
                        <label>
                            Diagnosis:
                            <input
                                type="text"
                                value={newRecord.diagnosis}
                                onChange={(e) => handleCreateFieldChange('diagnosis', e.target.value)}
                            />
                        </label>
                        <label>
                            Blood Pressure:
                            <input
                                type="text"
                                value={newRecord.bloodpressure}
                                onChange={(e) => handleCreateFieldChange('bloodpressure', e.target.value)}
                            />
                        </label>
                        <label>
                            Date:
                            <input
                                type="date"
                                value={newRecord.date}
                                onChange={(e) => handleCreateFieldChange('date', e.target.value)}
                            />
                        </label>
                        <label>
                            Department:
                            <select
                                value={newRecord.department_id}
                                onChange={(e) => handleCreateFieldChange('department_id', e.target.value)}
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept.department_id} value={dept.department_id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Patient ID:
                            <input
                                type="number"
                                value={newRecord.patient_id}
                                onChange={(e) => handleCreateFieldChange('patient_id', e.target.value)}
                            />
                        </label>
                        <label>
                            Treatment:
                            <select
                                value={newRecord.treatement_id}
                                onChange={(e) => handleCreateFieldChange('treatement_id', e.target.value)}
                            >
                                <option value="">Select Treatment</option>
                                {treatments.map((treatment) => (
                                    <option key={treatment.treatement_id} value={treatment.treatement_id}>
                                        {treatment.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <button type="submit" className="saveButton">Save</button>
                        <button type="button" onClick={() => setIsCreateMode(false)} className="cancelButton">
                            Cancel
                        </button>
                    </form>
                </div>
            ) : selectedRecord ? (
                <div className="editTab">
                    <h3>Edit Medical Record</h3>
                    <form onSubmit={handleUpdateSubmit}>
                        <label>
                            Diagnosis:
                            <input
                                type="text"
                                value={selectedRecord?.diagnosis || ''}
                                onChange={(e) => handleEditFieldChange('diagnosis', e.target.value)}
                            />
                        </label>
                        <label>
                            Blood Pressure:
                            <input
                                type="text"
                                value={selectedRecord?.bloodpressure || ''}
                                onChange={(e) => handleEditFieldChange('bloodpressure', e.target.value)}
                            />
                        </label>
                        <label>
                            Date:
                            <input
                                type="date"
                                value={selectedRecord?.date || ''}
                                onChange={(e) => handleEditFieldChange('date', e.target.value)}
                            />
                        </label>
                        <label>
                            Department:
                            <select
                                value={selectedRecord?.department_id || ''}
                                onChange={(e) => handleEditFieldChange('department_id', e.target.value)}
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept.department_id} value={dept.department_id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Patient ID:
                            <input
                                type="number"
                                value={selectedRecord?.patient_id || ''}
                                onChange={(e) => handleEditFieldChange('patient_id', e.target.value)}
                            />
                        </label>
                        <label>
                            Treatment ID:
                            <select
                                value={selectedRecord?.treatement_id || ''}
                                onChange={(e) => handleEditFieldChange('treatement_id', e.target.value)}
                            >
                                <option value="">Select Treatment</option>
                                {treatments.map((treatment) => (
                                    <option key={treatment.treatement_id} value={treatment.treatement_id}>
                                        {treatment.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <button type="submit" className="saveButton">Save</button>
                        <button type="button" onClick={() => setSelectedRecord(null)} className="cancelButton">
                            Cancel
                        </button>
                    </form>
                </div>
            ) : (
                <div className="medicalRecordsList">
                    {filteredRecords.map((record) => (
                        <div key={record.record_id} className="medicalRecordCard">
                            <p><strong>Record ID:</strong> {record.record_id}</p>
                            <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                            <p><strong>Blood Pressure:</strong> {record.bloodpressure}</p>
                            <p><strong>Date:</strong> {record.date}</p>
                            <p><strong>Department:</strong> {record.department_id}</p>
                            <p><strong>Patient ID:</strong> {record.patient_id}</p>
                            <p><strong>Treatment:</strong> {getTreatmentName(record.treatement_id)}</p>
                            <div className="recordActions">
                                <button onClick={() => handleDelete(record.record_id)} className="deleteButton">
                                    Delete
                                </button>
                                <button onClick={() => setSelectedRecord(record)} className="updateButton">
                                    Update
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

}

export default ManageMedicalRecords;
