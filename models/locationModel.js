const db = require('../config/database');

class LocationModel {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM Location ORDER BY Country, Region');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM Location WHERE LocationId = ?', [id]);
        return rows[0];
    }

    static async create(location) {
        const [result] = await db.query(
            'INSERT INTO Location (LocationId, Country, Region, Latitude, Longitude, EcosystemType) VALUES (?, ?, ?, ?, ?, ?)',
            [location.locationId, location.country, location.region, location.latitude, location.longitude, location.ecosystemType]
        );
        return result;
    }

    static async update(id, location) {
        const [result] = await db.query(
            'UPDATE Location SET Country = ?, Region = ?, Latitude = ?, Longitude = ?, EcosystemType = ? WHERE LocationId = ?',
            [location.country, location.region, location.latitude, location.longitude, location.ecosystemType, id]
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM Location WHERE LocationId = ?', [id]);
        return result;
    }
}

module.exports = LocationModel;
