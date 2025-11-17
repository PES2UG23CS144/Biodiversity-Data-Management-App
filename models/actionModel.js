const db = require('../config/database');

class ActionModel {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM ConservationAction ORDER BY StartDate DESC');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM ConservationAction WHERE ActionId = ?', [id]);
        return rows[0];
    }

    // Check if action is active using custom function
    static async isActive(actionId, date) {
        const [rows] = await db.query(
            'SELECT fn_action_is_active(?, ?) as IsActive',
            [actionId, date]
        );
        return rows[0]?.IsActive === 1;
    }

    static async create(action) {
        const [result] = await db.query(
            'INSERT INTO ConservationAction (ActionId, ActionType, StartDate, EndDate, ResponsibleOrg, Effectiveness) VALUES (?, ?, ?, ?, ?, ?)',
            [action.actionId, action.actionType, action.startDate, action.endDate, action.responsibleOrg, action.effectiveness]
        );
        return result;
    }

    static async update(id, action) {
        const [result] = await db.query(
            'UPDATE ConservationAction SET ActionType = ?, StartDate = ?, EndDate = ?, ResponsibleOrg = ?, Effectiveness = ? WHERE ActionId = ?',
            [action.actionType, action.startDate, action.endDate, action.responsibleOrg, action.effectiveness, id]
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM ConservationAction WHERE ActionId = ?', [id]);
        return result;
    }

    // Apply action to location using stored procedure
    static async applyToLocation(actionId, locationId) {
        const [result] = await db.query(
            'CALL sp_apply_action_to_location(?, ?, @created)',
            [actionId, locationId]
        );
        const [output] = await db.query('SELECT @created as created');
        return output[0].created;
    }
}

module.exports = ActionModel;
