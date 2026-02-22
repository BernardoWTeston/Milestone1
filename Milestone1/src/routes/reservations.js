const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM reservations');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, resource_id, start_time, end_time, purpose } = req.body;

    const [result] = await db.query(
      `INSERT INTO reservations (user_id, resource_id, start_time, end_time, purpose)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, resource_id, start_time, end_time, purpose || null]
    );

    res.status(201).json({ reservation_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;