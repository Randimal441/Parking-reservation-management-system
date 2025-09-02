const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  reservationId: {
    type: String,
    required: true,
    unique: true
  },
  driverId: {
    type: String,
    required: true,
    ref: 'Driver'
  },
  parkingSlotId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ParkingSlot'
  },
  entryTime: {
    type: Date,
    required: true
  },
  exitTime: {
    type: Date,
    required: true
  },
  reservedDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reservation', reservationSchema);
