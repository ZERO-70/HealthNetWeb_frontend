import React, { useState } from 'react';
import StaffInfo from '../components/StaffInfo';
import ManageMedicalRecords from '../components/ManageMedicalRecords';
import ManageInventory from '../components/ManageInventory';
import FindPatients from '../components/FindPatients'; // Updated name
import SearchAppointments from '../components/SearchAppointments';
import '../styles/StaffPortal.css';

function StaffPortal() {
    const [activeTab, setActiveTab] = useState('StaffInfo'); // Default tab

    const renderTabContent = () => {
        switch (activeTab) {
            case 'StaffInfo':
                return <StaffInfo />;
            case 'ManageMedicalRecords':
                return <ManageMedicalRecords />;
            case 'ManageInventory':
                return <ManageInventory />;
            case 'FindPatients': // Updated reference
                return <FindPatients />;
            case 'SearchAppointments':
                return <SearchAppointments />;
            default:
                return <StaffInfo />;
        }
    };

    return (
        <div className="staffPortal">
            <div className="tabNavigation">
                <button
                    className={`tabButton ${activeTab === 'StaffInfo' ? 'active' : ''}`}
                    onClick={() => setActiveTab('StaffInfo')}
                >
                    Staff Info
                </button>
                <button
                    className={`tabButton ${activeTab === 'ManageMedicalRecords' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ManageMedicalRecords')}
                >
                    Manage Medical Records
                </button>
                <button
                    className={`tabButton ${activeTab === 'ManageInventory' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ManageInventory')}
                >
                    Manage Inventory
                </button>
                <button
                    className={`tabButton ${activeTab === 'FindPatients' ? 'active' : ''}`} // Updated reference
                    onClick={() => setActiveTab('FindPatients')}
                >
                    Find Patients
                </button>
                <button
                    className={`tabButton ${activeTab === 'SearchAppointments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('SearchAppointments')}
                >
                    Search Appointments
                </button>
            </div>
            <div className="tabContent">{renderTabContent()}</div>
        </div>
    );
}

export default StaffPortal;
