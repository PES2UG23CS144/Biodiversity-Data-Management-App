const SpeciesModel = require('../models/speciesModel');

// Get all species
exports.getAllSpecies = async (req, res) => {
    try {
        const species = await SpeciesModel.getAll();
        res.json({ success: true, data: species });
    } catch (error) {
        console.error('Error fetching species:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get species by ID
exports.getSpeciesById = async (req, res) => {
    try {
        const species = await SpeciesModel.getById(req.params.id);
        if (!species) {
            return res.status(404).json({ success: false, error: 'Species not found' });
        }
        res.json({ success: true, data: species });
    } catch (error) {
        console.error('Error fetching species:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get species full name
exports.getSpeciesFullName = async (req, res) => {
    try {
        const fullName = await SpeciesModel.getFullName(req.params.id);
        res.json({ success: true, data: { fullName } });
    } catch (error) {
        console.error('Error fetching species full name:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get species threats
exports.getSpeciesThreats = async (req, res) => {
    try {
        const threats = await SpeciesModel.getThreats(req.params.id);
        res.json({ success: true, data: threats });
    } catch (error) {
        console.error('Error fetching threats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get species actions
exports.getSpeciesActions = async (req, res) => {
    try {
        const actions = await SpeciesModel.getActions(req.params.id);
        res.json({ success: true, data: actions });
    } catch (error) {
        console.error('Error fetching actions:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create new species
exports.createSpecies = async (req, res) => {
    try {
        const result = await SpeciesModel.create(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        console.error('Error creating species:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update species
exports.updateSpecies = async (req, res) => {
    try {
        const result = await SpeciesModel.update(req.params.id, req.body);
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error updating species:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete species
exports.deleteSpecies = async (req, res) => {
    try {
        const result = await SpeciesModel.delete(req.params.id);
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error deleting species:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get species count by status
exports.getCountByStatus = async (req, res) => {
    try {
        const data = await SpeciesModel.getCountByStatus();
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching count:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
