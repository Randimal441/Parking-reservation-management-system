const Driver = require('../models/Driver');
const bcrypt = require('bcryptjs');

// Get all drivers
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select('-password');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get driver by ID
const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).select('-password');
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new driver
const createDriver = async (req, res) => {
  try {
    const { driverId, name, email, nic, password } = req.body;

    // Check if driver already exists
    const existingDriver = await Driver.findOne({ 
      $or: [{ email }, { driverId }, { nic }] 
    });
    
    if (existingDriver) {
      return res.status(400).json({ 
        message: 'Driver with this email, driver ID, or NIC already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const driver = new Driver({
      _id: driverId,
      driverId,
      name,
      email,
      nic,
      password: hashedPassword
    });

    const savedDriver = await driver.save();
    
    // Remove password from response
    const { password: _, ...driverResponse } = savedDriver.toObject();
    
    res.status(201).json(driverResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update driver
const updateDriver = async (req, res) => {
  try {
    const { name, email, nic } = req.body;
    
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { name, email, nic },
      { new: true, runValidators: true }
    ).select('-password');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete driver
const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver
};
