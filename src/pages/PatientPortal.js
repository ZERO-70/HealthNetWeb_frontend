import React, { useState } from 'react';
import PatientInfo from '../components/PatientInfo';
import AvailableDoctors from '../components/AvailableDoctors';
import UpdateProfile from '../components/UpdateProfile';
import PatientAppointments from '../components/PatientAppointments';
import PatientMedicalRecords from '../components/PatientMedicalRecords'; // Import Medical Records component
import '../styles/PatientPortal.css'; // Enhanced styles

function PatientPortal() {
    const [activeTab, setActiveTab] = useState('PatientInfo'); // Default tab

    const renderTabContent = () => {
        switch (activeTab) {
            case 'PatientInfo':
                return <PatientInfo />;
            case 'AvailableDoctors':
                return <AvailableDoctors />;
            case 'UpdateProfile':
                return <UpdateProfile />;
            case 'Appointments':
                return <PatientAppointments />;
            case 'MedicalRecords':
                return <PatientMedicalRecords />;
            default:
                return <PatientInfo />;
        }
    };

    return (
        <div className="patientPortal">
            <div className="tabNavigation">
                <button
                    className={`tabButton ${activeTab === 'PatientInfo' ? 'active' : ''}`}
                    onClick={() => setActiveTab('PatientInfo')}
                >
                    Patient Info
                </button>
                <button
                    className={`tabButton ${activeTab === 'AvailableDoctors' ? 'active' : ''}`}
                    onClick={() => setActiveTab('AvailableDoctors')}
                >
                    Available Doctors
                </button>
                <button
                    className={`tabButton ${activeTab === 'UpdateProfile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('UpdateProfile')}
                >
                    Update Profile
                </button>
                <button
                    className={`tabButton ${activeTab === 'Appointments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Appointments')}
                >
                    Appointments
                </button>
                <button
                    className={`tabButton ${activeTab === 'MedicalRecords' ? 'active' : ''}`}
                    onClick={() => setActiveTab('MedicalRecords')} // New tab for Medical Records
                >
                    Medical Records
                </button>
            </div>
            <div className="tabContent">{renderTabContent()}</div>
        </div>
    );
}

export default PatientPortal;
