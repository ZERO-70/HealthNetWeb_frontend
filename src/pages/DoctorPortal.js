import React, { useState } from 'react';
import DoctorInfo from '../components/DoctorInfo';
import ManageAppointments from '../components/ManageAppointments';
import UpdateProfile from '../components/UpdateDoctorProfile';
import ManageAvailability from '../components/ManageAvailability';
import SearchPatients from '../components/SearchPatients';
import AddTreatment from '../components/AddTreatment'; // New tab for adding a treatment
import '../styles/DoctorPortal.css'; // Enhanced styles for the doctor portal

function DoctorPortal() {
    const [activeTab, setActiveTab] = useState('DoctorInfo'); // Default tab

    const renderTabContent = () => {
        switch (activeTab) {
            case 'DoctorInfo':
                return <DoctorInfo />;
            case 'ManageAppointments':
                return <ManageAppointments />;
            case 'UpdateProfile':
                return <UpdateProfile />;
            case 'ManageAvailability':
                return <ManageAvailability />;
            case 'SearchPatients':
                return <SearchPatients />;
            case 'AddTreatment':
                return <AddTreatment />; // Tab for adding a treatment
            default:
                return <DoctorInfo />;
        }
    };

    return (
        <div className="doctorPortal">
            <div className="tabNavigation">
                <button
                    className={`tabButton ${activeTab === 'DoctorInfo' ? 'active' : ''}`}
                    onClick={() => setActiveTab('DoctorInfo')}
                >
                    Doctor Info
                </button>
                <button
                    className={`tabButton ${activeTab === 'ManageAppointments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ManageAppointments')}
                >
                    Manage Appointments
                </button>
                <button
                    className={`tabButton ${activeTab === 'UpdateProfile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('UpdateProfile')}
                >
                    Update Profile
                </button>
                <button
                    className={`tabButton ${activeTab === 'ManageAvailability' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ManageAvailability')}
                >
                    Manage Availability
                </button>
                <button
                    className={`tabButton ${activeTab === 'SearchPatients' ? 'active' : ''}`}
                    onClick={() => setActiveTab('SearchPatients')}
                >
                    Search Patients
                </button>
                <button
                    className={`tabButton ${activeTab === 'AddTreatment' ? 'active' : ''}`}
                    onClick={() => setActiveTab('AddTreatment')}
                >
                    Add Treatment
                </button>
            </div>
            <div className="tabContent">{renderTabContent()}</div>
        </div>
    );
}

export default DoctorPortal;
