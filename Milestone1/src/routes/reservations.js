const express = require('express');
const router = express.Router();
const db = require('../db');
const { findAll, findById, findWhere } = require('../db/queries');
const validate = require('../middleware/validateRequest');
const auth = require('../middleware/authMiddleware');

router.get('/', async (req, res, next) => {
  try {
    const reservations = await findAll('reservations');
    res.json(reservations);
  } catch (error) {
    next(error);
  }
});

router.post('/', auth, validate(['user_id', 'resource_id', 'start_time', 'end_time']), async (req, res, next) => {
  try {
    const { user_id, resource_id, start_time, end_time, purpose } = req.body;

    if (new Date(end_time) <= new Date(start_time)) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    const resource = await findById('resources', 'resource_id', resource_id);
    if (!resource) {
      return res.status(404).json({ error: 'Cannot reserve a nonexistent resource' });
    }

    const conflicts = await findWhere(
      'reservations',
      `resource_id = ? AND status = 'active'
       AND start_time < ? AND end_time > ?`,
      [resource_id, end_time, start_time]
    );

    if (conflicts.length > 0) {
      return res.status(409).json({ error: 'Resource is already reserved for this time period' });
    }

    const [result] = await db.query(
      'INSERT INTO reservations (user_id, resource_id, start_time, end_time, purpose) VALUES (?, ?, ?, ?, ?)',
      [user_id, resource_id, start_time, end_time, purpose || null]
    );

    res.status(201).json({ reservation_id: result.insertId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
