const db = require('../config/database');

class ObserverModel {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM Observer ORDER BY Name');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM Observer WHERE ObserverId = ?', [id]);
        return rows[0];
    }

    // Get seniority using custom function
    static async getSeniority(level) {
        const [rows] = await db.query('SELECT fn_observer_seniority(?) as Seniority', [level]);
        return rows[0]?.Seniority;
    }

    static async create(observer) {
        const [result] = await db.query(
            'INSERT INTO Observer (ObserverId, Name, Contact, Affiliation, ExperienceLevel) VALUES (?, ?, ?, ?, ?)',
            [observer.observerId, observer.name, observer.contact, observer.affiliation, observer.experienceLevel]
        );
        return result;
    }

    static async update(id, observer) {
        const [result] = await db.query(
            'UPDATE Observer SET Name = ?, Contact = ?, Affiliation = ?, ExperienceLevel = ? WHERE ObserverId = ?',
            [observer.name, observer.contact, observer.affiliation, observer.experienceLevel, id]
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM Observer WHERE ObserverId = ?', [id]);
        return result;
    }

    // Get observation count per observer
    static async getObservationCount(observerId) {
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM Observation WHERE ObserverId = ?',
            [observerId]
        );
        return rows[0].count;
    }
}

module.exports = ObserverModel;
