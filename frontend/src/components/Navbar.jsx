import React from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../utils/helpers';

const Navbar = ({ userType, setUserType, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/signin');
  };

  const handleUserTypeSwitch = () => {
    const newUserType = userType === 'user' ? 'admin' : 'user';
    setUserType(newUserType);
    // Navigate to appropriate dashboard
    const redirectPath = newUserType === 'admin' ? '/admin/drivers' : '/user/reservations';
    navigate(redirectPath);
  };
  return (
    <nav className="navbar" style={{ backgroundColor: colors.blue }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
          Smart Parking Management System
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            className={`btn-${userType === 'user' ? 'warning' : 'primary'}`}
            onClick={handleUserTypeSwitch}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: userType === 'user' ? colors.orange : colors.green,
              color: colors.white,
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Switch to {userType === 'user' ? 'Admin' : 'User'} View
          </button>
          <span style={{ fontWeight: 'bold', color: colors.white }}>
            {userType === 'user' ? 'User Panel' : 'Admin Panel'}
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: colors.red,
              color: colors.white,
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
