import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { reservationAPI, parkingSlotAPI, socket } from '../../services/api';
import { colors } from '../../utils/helpers';

ChartJS.register(ArcElement, Tooltip, Legend);

const ReservationPortal = () => {
  const [formData, setFormData] = useState({
    driverId: '',
    parkingSlotId: '',
    entryTime: '',
    exitTime: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotStats, setSlotStats] = useState({ totalSlots: 0, availableSlots: 0, reservedSlots: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchAvailableSlots();
    fetchSlotStatistics();

    // Socket listeners for real-time updates
    socket.on('slotUpdate', () => {
      fetchAvailableSlots();
      fetchSlotStatistics();
    });

    socket.on('reservationUpdate', () => {
      fetchSlotStatistics();
    });

    return () => {
      socket.off('slotUpdate');
      socket.off('reservationUpdate');
    };
  }, []);

  const fetchAvailableSlots = async () => {
    try {
      const response = await parkingSlotAPI.getAvailableSlots();
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const fetchSlotStatistics = async () => {
    try {
      const response = await parkingSlotAPI.getSlotStatistics();
      setSlotStats(response.data);
    } catch (error) {
      console.error('Error fetching slot statistics:', error);
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
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Combine date and time for entry and exit
      const entryDateTime = new Date(`${formData.date}T${formData.entryTime}`);
      const exitDateTime = new Date(`${formData.date}T${formData.exitTime}`);

      if (exitDateTime <= entryDateTime) {
        setMessage({ type: 'error', text: 'Exit time must be after entry time' });
        setLoading(false);
        return;
      }

      const reservationData = {
        driverId: formData.driverId,
        parkingSlotId: formData.parkingSlotId,
        entryTime: entryDateTime.toISOString(),
        exitTime: exitDateTime.toISOString(),
      };

      const response = await reservationAPI.createReservation(reservationData);
      
      setMessage({ 
        type: 'success', 
        text: `Reservation created successfully! Reservation ID: ${response.data.reservationId}` 
      });
      
      // Reset form
      setFormData({
        driverId: '',
        parkingSlotId: '',
        entryTime: '',
        exitTime: '',
        date: new Date().toISOString().split('T')[0],
      });

      // Emit socket event for real-time update
      socket.emit('reservationUpdate', response.data);
      socket.emit('slotUpdate', { slotId: formData.parkingSlotId, isAvailable: false });

      // Refresh data
      fetchAvailableSlots();
      fetchSlotStatistics();
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error creating reservation' 
      });
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ['Available Slots', 'Reserved Slots'],
    datasets: [
      {
        data: [slotStats.availableSlots, slotStats.reservedSlots],
        backgroundColor: [colors.green, colors.red],
        borderColor: [colors.green, colors.red],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = slotStats.totalSlots;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', color: colors.darkGray }}>Reservation Portal</h2>
      
      {message.text && (
        <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'}`}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Reservation Form */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', color: colors.darkGray }}>Make a Reservation</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Driver ID</label>
              <input
                type="text"
                name="driverId"
                value={formData.driverId}
                onChange={handleInputChange}
                className="form-control"
                required
                placeholder="Enter your driver ID"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Parking Slot</label>
              <select
                name="parkingSlotId"
                value={formData.parkingSlotId}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Select a parking slot</option>
                {availableSlots.map(slot => (
                  <option key={slot._id} value={slot._id}>
                    {slot.slotId} - {slot.location} (Floor: {slot.floor}, Section: {slot.section})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="form-control"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Entry Time</label>
              <input
                type="time"
                name="entryTime"
                value={formData.entryTime}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Exit Time</label>
              <input
                type="time"
                name="exitTime"
                value={formData.exitTime}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem' }}
            >
              {loading ? 'Creating Reservation...' : 'Reserve Parking Slot'}
            </button>
          </form>
        </div>

        {/* Live Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', color: colors.darkGray }}>Parking Slot Availability</h3>
          
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '2rem' }}>
            <div className="stat-card total">
              <div className="stat-number">{slotStats.totalSlots}</div>
              <div className="stat-label">Total Slots</div>
            </div>
            <div className="stat-card available">
              <div className="stat-number">{slotStats.availableSlots}</div>
              <div className="stat-label">Available</div>
            </div>
            <div className="stat-card reserved">
              <div className="stat-number">{slotStats.reservedSlots}</div>
              <div className="stat-label">Reserved</div>
            </div>
          </div>

          <div style={{ maxWidth: '300px', margin: '0 auto' }}>
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Available Slots List */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: colors.darkGray }}>Available Parking Slots</h3>
        {availableSlots.length === 0 ? (
          <div className="no-data">No parking slots available at the moment</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {availableSlots.map(slot => (
              <div 
                key={slot._id} 
                style={{
                  padding: '1rem',
                  border: `2px solid ${colors.green}`,
                  borderRadius: '8px',
                  backgroundColor: colors.cream,
                  textAlign: 'center'
                }}
              >
                <h4 style={{ margin: '0 0 0.5rem 0', color: colors.darkGray }}>{slot.slotId}</h4>
                <p style={{ margin: '0 0 0.5rem 0', color: colors.darkGray }}>{slot.location}</p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: colors.darkGray }}>
                  Floor: {slot.floor} | Section: {slot.section}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationPortal;
