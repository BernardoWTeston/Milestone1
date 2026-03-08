const express = require('express');
const router = express.Router();
const db = require('../db');
const validate = require('../middleware/validateRequest');

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', validate(['full_name', 'email']), async (req, res, next) => {
  try {
    const { full_name, email, role } = req.body;

    const [result] = await db.query(
      'INSERT INTO users (full_name, email, role) VALUES (?, ?, ?)',
      [full_name, email, role || 'student']
    );

    res.status(201).json({ user_id: result.insertId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;