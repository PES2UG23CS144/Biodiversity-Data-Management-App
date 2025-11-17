const express = require('express');
const router = express.Router();
const speciesController = require('../controllers/speciesController');

// GET all species
router.get('/', speciesController.getAllSpecies);

// GET species by ID
router.get('/:id', speciesController.getSpeciesById);

// GET species full name (custom function)
router.get('/:id/fullname', speciesController.getSpeciesFullName);

// GET species threats
router.get('/:id/threats', speciesController.getSpeciesThreats);

// GET species actions
router.get('/:id/actions', speciesController.getSpeciesActions);

// POST create new species
router.post('/', speciesController.createSpecies);

// PUT update species
router.put('/:id', speciesController.updateSpecies);

// DELETE species
router.delete('/:id', speciesController.deleteSpecies);

// GET count by status
router.get('/stats/by-status', speciesController.getCountByStatus);

module.exports = router;
