const ObservationModel = require('../models/observationModel');

exports.getAllObservations = async (req, res) => {
    try {
        const observations = await ObservationModel.getAll();
        res.json({ success: true, data: observations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getRecentObservations = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const observations = await ObservationModel.getRecent(limit);
        res.json({ success: true, data: observations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.logObservation = async (req, res) => {
    try {
        const result = await ObservationModel.logObservation(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getObservationCount = async (req, res) => {
    try {
        const count = await ObservationModel.getCount();
        res.json({ success: true, data: { count } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
