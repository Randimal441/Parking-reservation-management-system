import React, { useState, useEffect } from 'react';
import { reservationAPI, socket } from '../../services/api';
import { colors, formatDate, formatTime } from '../../utils/helpers';

const TrackingStatus = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchDriverId, setSearchDriverId] = useState('');

  useEffect(() => {
    fetchAllReservations();

    // Socket listeners for real-time updates
    socket.on('reservationUpdate', (data) => {
      fetchAllReservations();
    });

    return () => {
      socket.off('reservationUpdate');
    };
  }, []);

  useEffect(() => {
    // Filter reservations based on driver ID search
    if (searchDriverId.trim() === '') {
      setFilteredReservations(reservations);
    } else {
      const filtered = reservations.filter(reservation => {
        const driverIdToSearch = typeof reservation.driverId === 'object' 
          ? reservation.driverId._id 
          : reservation.driverId;
        return driverIdToSearch.toLowerCase().includes(searchDriverId.toLowerCase());
      });
      setFilteredReservations(filtered);
    }
  }, [searchDriverId, reservations]);

  const fetchAllReservations = async () => {
    try {
      setLoading(true);
      const response = await reservationAPI.getAllReservations();
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return colors.green;
      case 'completed':
        return colors.blue;
      case 'cancelled':
        return colors.red;
      default:
        return colors.darkGray;
    }
  };

  const getStatusBadge = (status) => (
    <span
      style={{
        padding: '0.25rem 0.5rem',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        color: colors.white,
        backgroundColor: getStatusColor(status),
      }}
    >
      {status.toUpperCase()}
    </span>
  );

  if (loading) {
    return <div className="loading">Loading tracking information...</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', color: colors.darkGray }}>
        Tracking Status
      </h2>

      {/* Search Filter */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="form-group">
          <label className="form-label">Search by Driver ID</label>
          <input
            type="text"
            value={searchDriverId}
            onChange={(e) => setSearchDriverId(e.target.value)}
            className="form-control"
            placeholder="Enter driver ID to filter reservations"
            style={{ maxWidth: '400px' }}
          />
        </div>
      </div>

      {/* Reservations Table */}
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem', color: colors.darkGray }}>
          Reservation Status 
          <span 
            style={{ 
              fontSize: '1rem', 
              fontWeight: 'normal', 
              color: colors.blue,
              marginLeft: '1rem' 
            }}
          >
            (Live Updates)
          </span>
        </h3>

        {filteredReservations.length === 0 ? (
          <div className="no-data">
            {searchDriverId ? 'No reservations found for the specified driver ID' : 'No reservations found'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Reservation ID</th>
                  <th>Driver ID</th>
                  <th>Reserved Date</th>
                  <th>Reserved Time</th>
                  <th>Parking Slot (Location)</th>
                  <th>Entry Time</th>
                  <th>Exit Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation) => (
                  <tr key={reservation._id}>
                    <td style={{ fontWeight: 'bold', color: colors.blue }}>
                      {reservation.reservationId}
                    </td>
                    <td>{typeof reservation.driverId === 'object' ? reservation.driverId._id : reservation.driverId}</td>
                    <td>{formatDate(reservation.reservedDate)}</td>
                    <td>{formatTime(reservation.reservedDate)}</td>
                    <td>
                      <div>
                        <strong>{reservation.parkingSlotId?.slotId || 'N/A'}</strong>
                        <br />
                        <small style={{ color: colors.darkGray }}>
                          {reservation.parkingSlotId?.location || 'Location not available'}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>{formatDate(reservation.entryTime)}</div>
                        <small style={{ color: colors.darkGray }}>
                          {formatTime(reservation.entryTime)}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>{formatDate(reservation.exitTime)}</div>
                        <small style={{ color: colors.darkGray }}>
                          {formatTime(reservation.exitTime)}
                        </small>
                      </div>
                    </td>
                    <td>{getStatusBadge(reservation.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: colors.darkGray }}>Summary</h3>
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-number">{filteredReservations.length}</div>
            <div className="stat-label">Total Reservations</div>
          </div>
          <div className="stat-card available">
            <div className="stat-number">
              {filteredReservations.filter(r => r.status === 'active').length}
            </div>
            <div className="stat-label">Active Reservations</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {filteredReservations.filter(r => r.status === 'completed').length}
            </div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card reserved">
            <div className="stat-number">
              {filteredReservations.filter(r => r.status === 'cancelled').length}
            </div>
            <div className="stat-label">Cancelled</div>
          </div>
        </div>
      </div>

      {/* Real-time indicator */}
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        background: colors.green, 
        color: colors.white, 
        padding: '0.5rem 1rem', 
        borderRadius: '20px',
        fontSize: '0.8rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        🟢 Live Updates Active
      </div>
    </div>
  );
};

export default TrackingStatus;
