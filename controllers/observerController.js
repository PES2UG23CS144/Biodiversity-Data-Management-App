const ObserverModel = require('../models/observerModel');

// Get all observers
exports.getAllObservers = async (req, res) => {
    try {
        const observers = await ObserverModel.getAll();
        res.json({ success: true, data: observers });
    } catch (error) {
        console.error('Error fetching observers:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get observer by ID
exports.getObserverById = async (req, res) => {
    try {
        const observer = await ObserverModel.getById(req.params.id);
        if (!observer) {
            return res.status(404).json({ success: false, error: 'Observer not found' });
        }
        res.json({ success: true, data: observer });
    } catch (error) {
        console.error('Error fetching observer:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get observer seniority level
exports.getObserverSeniority = async (req, res) => {
    try {
        const level = parseInt(req.params.level);
        const seniority = await ObserverModel.getSeniority(level);
        res.json({ success: true, data: { seniority } });
    } catch (error) {
        console.error('Error fetching seniority:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get observation count for observer
exports.getObservationCount = async (req, res) => {
    try {
        const count = await ObserverModel.getObservationCount(req.params.id);
        res.json({ success: true, data: { count } });
    } catch (error) {
        console.error('Error fetching observation count:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create new observer
exports.createObserver = async (req, res) => {
    try {
        const result = await ObserverModel.create(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        console.error('Error creating observer:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update observer
exports.updateObserver = async (req, res) => {
    try {
        const result = await ObserverModel.update(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Observer not found' });
        }
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error updating observer:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete observer
exports.deleteObserver = async (req, res) => {
    try {
        const result = await ObserverModel.delete(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Observer not found' });
        }
        res.json({ success: true, message: 'Observer deleted successfully' });
    } catch (error) {
        console.error('Error deleting observer:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
