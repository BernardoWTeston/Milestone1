const express = require('express');
const router = express.Router();
const db = require('../db');
const { findAll } = require('../db/queries');
const validate = require('../middleware/validateRequest');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

router.get('/', async (req, res, next) => {
  try {
    const resources = await findAll('resources');
    res.json(resources);
  } catch (error) {
    next(error);
  }
});

router.post('/', auth, requireRole('admin'), validate(['resource_name', 'resource_type']), async (req, res, next) => {
  try {
    const { resource_name, resource_type, location, capacity, description } = req.body;

    if (!location) {
      return res.status(400).json({
        error: 'Resources cannot be created without a location'
      });
    }

    const [result] = await db.query(
      'INSERT INTO resources (resource_name, resource_type, location, capacity, description) VALUES (?, ?, ?, ?, ?)',
      [resource_name, resource_type, location, capacity || null, description || null]
    );

    res.status(201).json({ resource_id: result.insertId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;