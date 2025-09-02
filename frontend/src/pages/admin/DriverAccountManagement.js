import React, { useState, useEffect } from 'react';
import { driverAPI } from '../../services/api';
import { colors } from '../../utils/helpers';

const DriverAccountManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [formData, setFormData] = useState({
    driverId: '',
    name: '',
    email: '',
    nic: '',
    password: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await driverAPI.getAllDrivers();
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setMessage({ type: 'error', text: 'Error fetching drivers' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (editingDriver) {
        // Update driver (exclude password and driverId from updates)
        const { password, driverId, ...updateData } = formData;
        await driverAPI.updateDriver(editingDriver._id, updateData);
        setMessage({ type: 'success', text: 'Driver updated successfully!' });
      } else {
        // Create new driver
        await driverAPI.createDriver(formData);
        setMessage({ type: 'success', text: 'Driver created successfully!' });
      }

      // Reset form and refresh data
      setFormData({ driverId: '', name: '', email: '', nic: '', password: '' });
      setShowForm(false);
      setEditingDriver(null);
      fetchDrivers();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || `Error ${editingDriver ? 'updating' : 'creating'} driver` 
      });
    }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setFormData({
      driverId: driver.driverId,
      name: driver.name,
      email: driver.email,
      nic: driver.nic,
      password: '' // Don't populate password for editing
    });
    setShowForm(true);
  };

  const handleDelete = async (driverId, driverName) => {
    if (window.confirm(`Are you sure you want to delete driver ${driverName}?`)) {
      try {
        await driverAPI.deleteDriver(driverId);
        setMessage({ type: 'success', text: 'Driver deleted successfully!' });
        fetchDrivers();
      } catch (error) {
        setMessage({ 
          type: 'error', 
          text: error.response?.data?.message || 'Error deleting driver' 
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({ driverId: '', name: '', email: '', nic: '', password: '' });
    setShowForm(false);
    setEditingDriver(null);
    setMessage({ type: '', text: '' });
  };

  if (loading) {
    return <div className="loading">Loading drivers...</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', color: colors.darkGray }}>Driver Account Management</h2>

      {message.text && (
        <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'}`}>
          {message.text}
        </div>
      )}

      {/* Add New Driver Button */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          className="btn-primary"
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          Add New Driver
        </button>
      </div>

      {/* Driver Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: colors.darkGray }}>
            {editingDriver ? 'Update Driver' : 'Add New Driver'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Driver ID</label>
                <input
                  type="text"
                  name="driverId"
                  value={formData.driverId}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                  disabled={editingDriver} // Don't allow editing driver ID
                  placeholder="Enter driver ID"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group">
                <label className="form-label">NIC Number</label>
                <input
                  type="text"
                  name="nic"
                  value={formData.nic}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                  placeholder="Enter NIC number"
                />
              </div>

              {!editingDriver && (
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                    placeholder="Enter password"
                  />
                </div>
              )}
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn-success">
                {editingDriver ? 'Update Driver' : 'Add Driver'}
              </button>
              <button type="button" className="btn-danger" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Drivers Table */}
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem', color: colors.darkGray }}>
          Registered Drivers ({drivers.length})
        </h3>

        {drivers.length === 0 ? (
          <div className="no-data">No drivers registered yet</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Driver ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>NIC</th>
                  <th>Registration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver._id}>
                    <td style={{ fontWeight: 'bold', color: colors.blue }}>
                      {driver.driverId}
                    </td>
                    <td>{driver.name}</td>
                    <td>{driver.email}</td>
                    <td>{driver.nic}</td>
                    <td>{new Date(driver.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn-warning"
                          onClick={() => handleEdit(driver)}
                          style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                        >
                          Update
                        </button>
                        <button
                          className="btn-danger"
                          onClick={() => handleDelete(driver._id, driver.name)}
                          style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: colors.darkGray }}>Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-number">{drivers.length}</div>
            <div className="stat-label">Total Drivers</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {drivers.filter(d => 
                new Date(d.createdAt).toDateString() === new Date().toDateString()
              ).length}
            </div>
            <div className="stat-label">Registered Today</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {drivers.filter(d => 
                new Date(d.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ).length}
            </div>
            <div className="stat-label">This Week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverAccountManagement;
