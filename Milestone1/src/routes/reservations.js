const express = require('express');
const router = express.Router();
const db = require('../db');
const { findAll, findById, findWhere } = require('../db/queries');
const validate = require('../middleware/validateRequest');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

router.get('/', auth, async (req, res, next) => {
  try {
    const reservations = await findAll('reservations');
    res.json(reservations);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', auth, async (req, res, next) => {
  try {
    const reservation = await findById('reservations', 'reservation_id', req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(reservation);
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

router.patch('/:id/status', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['active', 'cancelled', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }
    const [result] = await db.query(
      'UPDATE reservations SET status = ? WHERE reservation_id = ?',
      [status, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json({ message: 'Reservation status updated successfully' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const reservation = await findById('reservations', 'reservation_id', req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const isOwner = reservation.user_id === req.user.user_id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.query('DELETE FROM reservations WHERE reservation_id = ?', [req.params.id]);
    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
