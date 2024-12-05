import React, { useState } from 'react';
import AdminInfo from '../components/AdminInfo'; // Admin Info Component
import StaffDepartmentManagement from '../components/StaffDepartmentManagement'; // Component for managing staff and departments
import Analytics from '../components/Analytics'; // Component for analytics
import ProfileUpdate from '../components/ProfileUpdate'; // Component for updating profile
import '../styles/AdminPortal.css'; // Styles for the admin portal

function AdminPortal() {
    const [activeTab, setActiveTab] = useState('AdminInfo'); // Default active tab

    const renderTabContent = () => {
        switch (activeTab) {
            case 'AdminInfo':
                return <AdminInfo />;
            case 'StaffDepartmentManagement':
                return <StaffDepartmentManagement />;
            case 'Analytics':
                return <Analytics />;
            case 'ProfileUpdate':
                return <ProfileUpdate />;
            default:
                return <AdminInfo />;
        }
    };

    return (
        <div className="adminPortal">
            <h1 className="portalTitle">Admin Portal</h1>
            <div className="tabNavigation">
                <button
                    className={`tabButton ${activeTab === 'AdminInfo' ? 'active' : ''}`}
                    onClick={() => setActiveTab('AdminInfo')}
                >
                    Admin Info
                </button>
                <button
                    className={`tabButton ${activeTab === 'StaffDepartmentManagement' ? 'active' : ''}`}
                    onClick={() => setActiveTab('StaffDepartmentManagement')}
                >
                    Management
                </button>
                <button
                    className={`tabButton ${activeTab === 'Analytics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Analytics')}
                >
                    Analytics
                </button>
                <button
                    className={`tabButton ${activeTab === 'ProfileUpdate' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ProfileUpdate')}
                >
                    Profile Update
                </button>
            </div>
            <div className="tabContent">{renderTabContent()}</div>
        </div>
    );
}

export default AdminPortal;
