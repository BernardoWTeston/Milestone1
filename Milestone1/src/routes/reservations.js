const express = require('express');
const router = express.Router();
const db = require('../db');
const validate = require('../middleware/validateRequest');
const auth = require('../middleware/authMiddleware');

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM reservations');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', auth, validate(['user_id', 'resource_id', 'start_time', 'end_time']), async (req, res, next) => {
  try {
    const { user_id, resource_id, start_time, end_time, purpose } = req.body;

    if (new Date(end_time) <= new Date(start_time)) {
      return res.status(400).json({
        error: 'End time must be after start time'
      });
    }

    const [resource] = await db.query(
      'SELECT * FROM resources WHERE resource_id = ?',
      [resource_id]
    );

    if (resource.length === 0) {
      return res.status(404).json({
        error: 'Cannot reserve a nonexistent resource'
      });
    }

    const [duplicate] = await db.query(
      `SELECT * FROM reservations 
       WHERE resource_id = ? 
       AND status = 'active'
       AND ((start_time <= ? AND end_time > ?) 
            OR (start_time < ? AND end_time >= ?)
            OR (start_time >= ? AND end_time <= ?))`,
      [resource_id, start_time, start_time, end_time, end_time, start_time, end_time]
    );

    if (duplicate.length > 0) {
      return res.status(409).json({
        error: 'Resource is already reserved for this time period'
      });
    }

    const [result] = await db.query(
      `INSERT INTO reservations (user_id, resource_id, start_time, end_time, purpose)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, resource_id, start_time, end_time, purpose || null]
    );

    res.status(201).json({ reservation_id: result.insertId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;