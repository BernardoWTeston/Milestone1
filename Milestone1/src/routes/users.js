const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');
const { findAll, findById } = require('../db/queries');
const validate = require('../middleware/validateRequest');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

router.get('/', auth, async (req, res, next) => {
  try {
    const users = await findAll('users', 'user_id, full_name, email, role');
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', auth, async (req, res, next) => {
  try {
    const user = await findById('users', 'user_id', req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const { full_name, email, role } = req.body;
    const [result] = await db.query(
      'UPDATE users SET full_name = COALESCE(?, full_name), email = COALESCE(?, email), role = COALESCE(?, role) WHERE user_id = ?',
      [full_name || null, email || null, role || null, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
