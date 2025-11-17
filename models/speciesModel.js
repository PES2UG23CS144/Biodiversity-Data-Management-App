const db = require('../config/database');

class SpeciesModel {
    // Get all species
    static async getAll() {
        const [rows] = await db.query(`
            SELECT s.*, GROUP_CONCAT(sd.Diet) as Diets
            FROM Species s
            LEFT JOIN SpeciesDiet sd ON s.SpeciesId = sd.SpeciesId
            GROUP BY s.SpeciesId
            ORDER BY s.CommonName
        `);
        return rows;
    }

    // Get species by ID
    static async getById(id) {
        const [rows] = await db.query(`
            SELECT s.*, GROUP_CONCAT(sd.Diet) as Diets
            FROM Species s
            LEFT JOIN SpeciesDiet sd ON s.SpeciesId = sd.SpeciesId
            WHERE s.SpeciesId = ?
            GROUP BY s.SpeciesId
        `, [id]);
        return rows[0];
    }

    // Get species with full name using your custom function
    static async getFullName(id) {
        const [rows] = await db.query(
            'SELECT fn_species_full_name(?) as FullName',
            [id]
        );
        return rows[0]?.FullName;
    }

    // Get species threats
    static async getThreats(speciesId) {
        const [rows] = await db.query(`
            SELECT t.* FROM Threat t
            INNER JOIN Faces f ON t.ThreatId = f.ThreatId
            WHERE f.SpeciesId = ?
        `, [speciesId]);
        return rows;
    }

    // Get species conservation actions
    static async getActions(speciesId) {
        const [rows] = await db.query(`
            SELECT ca.* FROM ConservationAction ca
            INNER JOIN Targets t ON ca.ActionId = t.ActionId
            WHERE t.SpeciesId = ?
        `, [speciesId]);
        return rows;
    }

    // Create new species
    static async create(species) {
        const [result] = await db.query(
            'INSERT INTO Species (SpeciesId, ScientificName, CommonName, ConservationStatus, HabitatType) VALUES (?, ?, ?, ?, ?)',
            [species.speciesId, species.scientificName, species.commonName, species.conservationStatus, species.habitatType]
        );
        return result;
    }

    // Update species
    static async update(id, species) {
        const [result] = await db.query(
            'UPDATE Species SET ScientificName = ?, CommonName = ?, ConservationStatus = ?, HabitatType = ? WHERE SpeciesId = ?',
            [species.scientificName, species.commonName, species.conservationStatus, species.habitatType, id]
        );
        return result;
    }

    // Delete species
    static async delete(id) {
        const [result] = await db.query('DELETE FROM Species WHERE SpeciesId = ?', [id]);
        return result;
    }

    // Get species count by conservation status
    static async getCountByStatus() {
        const [rows] = await db.query(`
            SELECT ConservationStatus, COUNT(*) as Count
            FROM Species
            GROUP BY ConservationStatus
        `);
        return rows;
    }
}

module.exports = SpeciesModel;
