import React from 'react';
import { colors } from '../utils/helpers';

const Navbar = ({ userType, setUserType }) => {
  return (
    <nav className="navbar" style={{ backgroundColor: colors.blue }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
          Smart Parking Management System
        </h1>
        <div>
          <button
            className={`btn-${userType === 'user' ? 'warning' : 'primary'}`}
            onClick={() => setUserType(userType === 'user' ? 'admin' : 'user')}
            style={{ marginLeft: '1rem' }}
          >
            Switch to {userType === 'user' ? 'Admin' : 'User'} View
          </button>
          <span style={{ marginLeft: '1rem', fontWeight: 'bold' }}>
            {userType === 'user' ? 'User Panel' : 'Admin Panel'}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
