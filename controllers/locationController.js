const LocationModel = require('../models/locationModel');

// Get all locations
exports.getAllLocations = async (req, res) => {
    try {
        const locations = await LocationModel.getAll();
        res.json({ success: true, data: locations });
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get location by ID
exports.getLocationById = async (req, res) => {
    try {
        const location = await LocationModel.getById(req.params.id);
        if (!location) {
            return res.status(404).json({ success: false, error: 'Location not found' });
        }
        res.json({ success: true, data: location });
    } catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create new location
exports.createLocation = async (req, res) => {
    try {
        const result = await LocationModel.create(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        console.error('Error creating location:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update location
exports.updateLocation = async (req, res) => {
    try {
        const result = await LocationModel.update(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Location not found' });
        }
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete location
exports.deleteLocation = async (req, res) => {
    try {
        const result = await LocationModel.delete(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Location not found' });
        }
        res.json({ success: true, message: 'Location deleted successfully' });
    } catch (error) {
        console.error('Error deleting location:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
