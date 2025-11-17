const ActionModel = require('../models/actionModel');

// Get all conservation actions
exports.getAllActions = async (req, res) => {
    try {
        const actions = await ActionModel.getAll();
        res.json({ success: true, data: actions });
    } catch (error) {
        console.error('Error fetching actions:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get action by ID
exports.getActionById = async (req, res) => {
    try {
        const action = await ActionModel.getById(req.params.id);
        if (!action) {
            return res.status(404).json({ success: false, error: 'Action not found' });
        }
        res.json({ success: true, data: action });
    } catch (error) {
        console.error('Error fetching action:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Check if action is active
exports.checkActionActive = async (req, res) => {
    try {
        const { actionId, date } = req.query;
        const isActive = await ActionModel.isActive(actionId, date);
        res.json({ success: true, data: { isActive } });
    } catch (error) {
        console.error('Error checking action status:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create new action
exports.createAction = async (req, res) => {
    try {
        const result = await ActionModel.create(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        console.error('Error creating action:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update action
exports.updateAction = async (req, res) => {
    try {
        const result = await ActionModel.update(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Action not found' });
        }
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error updating action:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete action
exports.deleteAction = async (req, res) => {
    try {
        const result = await ActionModel.delete(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Action not found' });
        }
        res.json({ success: true, message: 'Action deleted successfully' });
    } catch (error) {
        console.error('Error deleting action:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Apply action to location (calls stored procedure)
exports.applyActionToLocation = async (req, res) => {
    try {
        const { actionId, locationId } = req.body;
        const created = await ActionModel.applyToLocation(actionId, locationId);
        res.json({ 
            success: true, 
            data: { created: created === 1 },
            message: created === 1 ? 'Action applied to location' : 'Action already applied to this location'
        });
    } catch (error) {
        console.error('Error applying action to location:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
