const SpeciesModel = require('../models/speciesModel');
const ObservationModel = require('../models/observationModel');

exports.getDashboardStats = async (req, res) => {
    try {
        const [speciesCount, observationCount, recentObservations, statusCounts] = await Promise.all([
            SpeciesModel.getAll().then(species => species.length),
            ObservationModel.getCount(),
            ObservationModel.getRecent(5),
            SpeciesModel.getCountByStatus()
        ]);

        res.json({
            success: true,
            data: {
                speciesCount,
                observationCount,
                recentObservations,
                statusCounts
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
