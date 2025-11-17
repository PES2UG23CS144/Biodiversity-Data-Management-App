const db = require('../config/database');

class ObservationModel {
    // Get all observations with joined data
    static async getAll() {
        const [rows] = await db.query(`
            SELECT 
                o.*,
                s.CommonName as SpeciesName,
                l.Country, l.Region,
                ob.Name as ObserverName
            FROM Observation o
            INNER JOIN Species s ON o.SpeciesId = s.SpeciesId
            INNER JOIN Location l ON o.LocationId = l.LocationId
            INNER JOIN Observer ob ON o.ObserverId = ob.ObserverId
            ORDER BY o.DateTime DESC
        `);
        return rows;
    }

    // Get recent observations (for dashboard)
    static async getRecent(limit = 10) {
        const [rows] = await db.query(`
            SELECT 
                o.*,
                s.CommonName as SpeciesName,
                l.Country, l.Region,
                ob.Name as ObserverName
            FROM Observation o
            INNER JOIN Species s ON o.SpeciesId = s.SpeciesId
            INNER JOIN Location l ON o.LocationId = l.LocationId
            INNER JOIN Observer ob ON o.ObserverId = ob.ObserverId
            ORDER BY o.DateTime DESC
            LIMIT ?
        `, [limit]);
        return rows;
    }

    // Get observations by species
    static async getBySpecies(speciesId) {
        const [rows] = await db.query(`
            SELECT o.*, l.Country, l.Region, ob.Name as ObserverName
            FROM Observation o
            INNER JOIN Location l ON o.LocationId = l.LocationId
            INNER JOIN Observer ob ON o.ObserverId = ob.ObserverId
            WHERE o.SpeciesId = ?
            ORDER BY o.DateTime DESC
        `, [speciesId]);
        return rows;
    }

    // Call stored procedure to log observation
    static async logObservation(observation) {
        const [result] = await db.query(
            'CALL sp_log_observation(?, ?, ?, ?, ?, ?, ?, ?)',
            [
                observation.observerId,
                observation.observationNo,
                observation.speciesId,
                observation.locationId,
                observation.dateTime,
                observation.count,
                observation.behavior,
                observation.evidence
            ]
        );
        return result;
    }

    // Get total observation count
    static async getCount() {
        const [rows] = await db.query('SELECT COUNT(*) as count FROM Observation');
        return rows[0].count;
    }
}

module.exports = ObservationModel;
