import React from 'react';
import { colors } from '../utils/helpers';

const Sidebar = ({ activeView, setActiveView, userType }) => {
  const userMenuItems = [
    { id: 'reservation-portal', label: 'Reservation Portal', icon: '🅿️' },
    { id: 'tracking-status', label: 'Tracking Status', icon: '📍' },
  ];

  const adminMenuItems = [
    { id: 'driver-management', label: 'Driver Account Management', icon: '👥' },
    { id: 'reservation-management', label: 'Reservation Management', icon: '📋' },
    { id: 'admin-tracking', label: 'Tracking Status', icon: '📊' },
  ];

  const menuItems = userType === 'user' ? userMenuItems : adminMenuItems;

  return (
    <div className="sidebar" style={{ backgroundColor: colors.darkGray }}>
      <div style={{ padding: '1rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: colors.white }}>
          {userType === 'user' ? 'User Menu' : 'Admin Menu'}
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item) => (
            <li key={item.id} style={{ marginBottom: '0.5rem' }}>
              <button
                onClick={() => setActiveView(item.id)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: activeView === item.id ? colors.blue : 'transparent',
                  color: colors.white,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => {
                  if (activeView !== item.id) {
                    e.target.style.backgroundColor = colors.orange;
                  }
                }}
                onMouseOut={(e) => {
                  if (activeView !== item.id) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
