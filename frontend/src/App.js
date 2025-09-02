import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';

// User Pages
import ReservationPortal from './pages/user/ReservationPortal.jsx';
import TrackingStatus from './pages/user/TrackingStatus.jsx';

// Admin Pages
import DriverAccountManagement from './pages/admin/DriverAccountManagement.jsx';
import ReservationManagement from './pages/admin/ReservationManagement.jsx';
import AdminTrackingStatus from './pages/admin/AdminTrackingStatus.jsx';

function App() {
  const [activeView, setActiveView] = useState('reservation-portal');
  const [userType, setUserType] = useState('user'); // 'user' or 'admin'

  const renderContent = () => {
    switch (activeView) {
      // User views
      case 'reservation-portal':
        return <ReservationPortal />;
      case 'tracking-status':
        return <TrackingStatus />;
      
      // Admin views
      case 'driver-management':
        return <DriverAccountManagement />;
      case 'reservation-management':
        return <ReservationManagement />;
      case 'admin-tracking':
        return <AdminTrackingStatus />;
      
      default:
        return <ReservationPortal />;
    }
  };

  return (
    <div className="app">
      <Navbar userType={userType} setUserType={setUserType} />
      <div style={{ display: 'flex' }}>
        <Sidebar 
          activeView={activeView} 
          setActiveView={setActiveView} 
          userType={userType} 
        />
        <div className="content" style={{ flex: 1 }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
