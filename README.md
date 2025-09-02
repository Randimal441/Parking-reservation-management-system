# Smart Parking Management System

A comprehensive parking management system built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring real-time updates, reservation management, and administrative controls.

## 🚀 Features

### User Features
- **Reservation Portal**: Make parking reservations with auto-generated reservation IDs
- **Live Slot Availability**: Real-time chart showing available vs reserved slots
- **Tracking Status**: View and track all reservations with live updates

### Admin Features
- **Driver Account Management**: CRUD operations for driver accounts
- **Reservation Management**: Monitor, update, and delete reservations
- **Real-time Analytics**: Live dashboard with parking statistics
- **Report Generation**: Generate and download detailed reservation reports

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI Development
- **Chart.js** - Data visualization and analytics
- **Socket.io-client** - Real-time updates
- **Axios** - API communication

### Backend
- **Node.js** - Server-side runtime
- **Express.js** - REST API framework
- **Socket.io** - Real-time communication
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM

## 🎨 Color Scheme

- **Primary Blue**: #0074D5
- **Success Green**: #069B47
- **Danger Red**: #C80306
- **Warning Orange**: #C16D00
- **Warning Yellow**: #F1A100
- **Dark Gray**: #40403E
- **Cream**: #FBE1AD
- **White**: #FFFFFF

## 📁 Project Structure

```
smart-parking-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── driverController.js
│   │   ├── parkingSlotController.js
│   │   └── reservationController.js
│   ├── models/
│   │   ├── Driver.js
│   │   ├── ParkingSlot.js
│   │   └── Reservation.js
│   ├── routes/
│   │   ├── drivers.js
│   │   ├── parkingSlots.js
│   │   └── reservations.js
│   ├── .env
│   ├── server.js
│   ├── seedDatabase.js
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   └── Sidebar.js
    │   ├── pages/
    │   │   ├── user/
    │   │   │   ├── ReservationPortal.js
    │   │   │   └── TrackingStatus.js
    │   │   └── admin/
    │   │       ├── DriverAccountManagement.js
    │   │       ├── ReservationManagement.js
    │   │       └── AdminTrackingStatus.js
    │   ├── services/
    │   │   └── api.js
    │   ├── utils/
    │   │   └── helpers.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   cd "C:\Users\HP\Desktop\pro driver"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   The backend `.env` file is already configured with:
   ```
   MONGODB_URL=mongodb+srv://root:1234@cluster0.86wn0nb.mongodb.net/smartparking
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

5. **Seed the Database**
   ```bash
   cd backend
   npm run seed
   ```
   This will create sample parking slots and driver accounts.

6. **Start the Applications**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm start
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📊 Sample Data

After running the seed script, you'll have:

### Parking Slots (20 total)
- Ground Floor - Section A: A001-A005
- Ground Floor - Section B: B001-B005
- Second Floor - Section A: A101-A105
- Second Floor - Section B: B101-B105

### Sample Drivers
| Driver ID | Name | Email | Password |
|-----------|------|--------|----------|
| DRV001 | John Doe | john.doe@email.com | password123 |
| DRV002 | Jane Smith | jane.smith@email.com | password123 |
| DRV003 | Bob Johnson | bob.johnson@email.com | password123 |
| DRV004 | Alice Brown | alice.brown@email.com | password123 |
| DRV005 | Charlie Wilson | charlie.wilson@email.com | password123 |

## 🔄 API Endpoints

### Drivers
- `GET /api/drivers` - Get all drivers
- `POST /api/drivers` - Create new driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

### Parking Slots
- `GET /api/parking-slots` - Get all slots
- `GET /api/parking-slots/available` - Get available slots
- `GET /api/parking-slots/statistics` - Get slot statistics

### Reservations
- `GET /api/reservations` - Get all reservations
- `POST /api/reservations` - Create reservation
- `PUT /api/reservations/:id` - Update reservation
- `DELETE /api/reservations/:id` - Delete reservation
- `POST /api/reservations/generate-report` - Generate report

## 🔴 Real-time Features

The application uses Socket.io for real-time updates:
- Live slot availability updates
- Real-time reservation status changes
- Instant chart updates
- Live dashboard statistics

## 📱 Usage Guide

### For Users:
1. **Making a Reservation**:
   - Enter your Driver ID
   - Select an available parking slot
   - Choose date, entry time, and exit time
   - Submit to create reservation

2. **Tracking Reservations**:
   - View all reservations in real-time
   - Filter by Driver ID
   - Monitor reservation status

### For Admins:
1. **Driver Management**:
   - Add new drivers
   - Update driver information
   - Delete driver accounts

2. **Reservation Management**:
   - View all reservations
   - Update reservation details
   - Cancel or complete reservations
   - Generate detailed reports

3. **Analytics Dashboard**:
   - Real-time parking statistics
   - Visual charts and graphs
   - Filter and analyze data

## 🛡️ Error Handling

The application includes comprehensive error handling:
- Form validation
- API error responses
- Real-time error notifications
- Graceful fallbacks

## 📈 Performance Features

- Optimized database queries
- Real-time updates without page refresh
- Responsive design for all devices
- Efficient state management

## 🔧 Troubleshooting

### Common Issues:

1. **Database Connection Error**:
   - Check MongoDB URL in `.env` file
   - Ensure network connectivity

2. **Socket Connection Issues**:
   - Verify backend is running on port 5000
   - Check CORS configuration

3. **Missing Data**:
   - Run the seed script: `npm run seed`

## 📝 License

This project is created for educational purposes as part of a group project.

## 👥 Contributors

This is a group project for Smart Parking Management System using MERN stack.

---

**Note**: Remember to run both backend and frontend servers simultaneously for full functionality.
