import React, { useState, useEffect, useCallback } from 'react';
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

  const fetchAvailableSlots = useCallback(async () => {
    try {
      console.log('Fetching available slots...');
      const response = await parkingSlotAPI.getAvailableSlots();
      console.log('Available slots response:', response.data);
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  }, []);

  const fetchSlotStatistics = useCallback(async () => {
    try {
      console.log('Fetching slot statistics...');
      const response = await parkingSlotAPI.getSlotStatistics();
      console.log('Slot statistics response:', response.data);
      setSlotStats(response.data);
    } catch (error) {
      console.error('Error fetching slot statistics:', error);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAvailableSlots();
    fetchSlotStatistics();
  }, [fetchAvailableSlots, fetchSlotStatistics]);

  // Socket listeners for real-time updates
  useEffect(() => {
    console.log('Setting up socket listeners...');
    console.log('Socket connected:', socket.connected);
    
    const handleUpdate = () => {
      console.log('Socket event received - updating data');
      fetchAvailableSlots();
      fetchSlotStatistics();
    };
    
    const handleSlotUpdate = (data) => {
      console.log('Slot update received:', data);
      handleUpdate();
    };
    
    const handleReservationUpdate = (data) => {
      console.log('Reservation update received:', data);
      handleUpdate();
    };
    
    const handleConnect = () => {
      console.log('Socket connected!');
    };
    
    const handleDisconnect = () => {
      console.log('Socket disconnected!');
    };
    
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('slotUpdate', handleSlotUpdate);
    socket.on('reservationUpdate', handleReservationUpdate);
    
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('slotUpdate', handleSlotUpdate);
      socket.off('reservationUpdate', handleReservationUpdate);
    };
  }, [fetchAvailableSlots, fetchSlotStatistics]);

  // Fallback polling mechanism - refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Polling for updates...');
      fetchAvailableSlots();
      fetchSlotStatistics();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [fetchAvailableSlots, fetchSlotStatistics]);

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
      <h2 style={{ marginBottom: '2rem', color: colors.darkGray }}>
        Reservation Portal
      </h2>
      
      {message.text && (
        <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'}`}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Reservation Form */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', color: colors.darkGray }}>
            Make a Reservation
          </h3>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, color: colors.darkGray }}>
              Parking Slot Availability
            </h3>
            <button 
              onClick={() => {
                console.log('Manual refresh triggered');
                fetchAvailableSlots();
                fetchSlotStatistics();
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: colors.blue,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Refresh
            </button>
          </div>
          
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
        <h3 style={{ marginBottom: '1.5rem', color: colors.darkGray }}>
          Available Parking Slots
        </h3>
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
                <h4 style={{ margin: '0 0 0.5rem 0', color: colors.darkGray }}>
                  {slot.slotId}
                </h4>
                <p style={{ margin: '0 0 0.5rem 0', color: colors.darkGray }}>
                  {slot.location}
                </p>
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
