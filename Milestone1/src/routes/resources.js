const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM resources');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { resource_name, resource_type, location, capacity, description } = req.body;

    const [result] = await db.query(
      'INSERT INTO resources (resource_name, resource_type, location, capacity, description) VALUES (?, ?, ?, ?, ?)',
      [resource_name, resource_type, location, capacity || null, description || null]
    );

    res.status(201).json({ resource_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;