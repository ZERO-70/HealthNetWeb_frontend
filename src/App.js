import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientPortal from './pages/PatientPortal'; // Import the Patient Portal component

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

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
