const express = require('express');
const router = express.Router();
const observerController = require('../controllers/observerController');

// GET all observers
router.get('/', observerController.getAllObservers);

// GET observer by ID
router.get('/:id', observerController.getObserverById);

// GET seniority level (custom function)
router.get('/seniority/:level', observerController.getObserverSeniority);

// GET observation count for observer
router.get('/:id/observations/count', observerController.getObservationCount);

// POST create new observer
router.post('/', observerController.createObserver);

// PUT update observer
router.put('/:id', observerController.updateObserver);

// DELETE observer
router.delete('/:id', observerController.deleteObserver);

module.exports = router;
