const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');

// GET all actions
router.get('/', actionController.getAllActions);

// GET action by ID
router.get('/:id', actionController.getActionById);

// GET check if action is active
router.get('/check/active', actionController.checkActionActive);

// POST create new action
router.post('/', actionController.createAction);

// POST apply action to location (stored procedure)
router.post('/apply', actionController.applyActionToLocation);

// PUT update action
router.put('/:id', actionController.updateAction);

// DELETE action
router.delete('/:id', actionController.deleteAction);

module.exports = router;
