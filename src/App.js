import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientPortal from './pages/PatientPortal'; // Import the Patient Portal component
import DoctorPortal from './pages/DoctorPortal'; // Import the Doctor Portal component
import StaffPortal from './pages/StaffPortal';
import AdminPortal from './pages/AdminPortal';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />

        {/* Register Route */}
        <Route path="/register" element={<Register />} />

        {/* Patient Portal Route */}
        <Route path="/patient-portal" element={<PatientPortal />} />

        {/* Doctor Portal Route */}
        <Route path="/doctor-portal" element={<DoctorPortal />} /> {/* Add Doctor Portal */}
        <Route path="/staff-portal" element={<StaffPortal />} />
        <Route path="/admin-portal" element={<AdminPortal />} />
      </Routes>
    </Router>
  );
}

export default App;
