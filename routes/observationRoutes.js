const express = require('express');
const router = express.Router();
const observationController = require('../controllers/observationController');

router.get('/', observationController.getAllObservations);
router.get('/recent', observationController.getRecentObservations);
router.post('/', observationController.logObservation);
router.get('/count', observationController.getObservationCount);

module.exports = router;
