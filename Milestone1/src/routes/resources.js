const express = require('express');
const router = express.Router();
const db = require('../db');
const { findAll, findById } = require('../db/queries');
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

router.get('/:id', async (req, res, next) => {
  try {
    const resource = await findById('resources', 'resource_id', req.params.id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    next(error);
  }
});

router.post('/', auth, requireRole('admin'), validate(['resource_name', 'resource_type', 'location']), async (req, res, next) => {
  try {
    const { resource_name, resource_type, location, capacity, description } = req.body;

    const [result] = await db.query(
      'INSERT INTO resources (resource_name, resource_type, location, capacity, description) VALUES (?, ?, ?, ?, ?)',
      [resource_name, resource_type, location, capacity || null, description || null]
    );

    res.status(201).json({ resource_id: result.insertId });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const { resource_name, resource_type, location, capacity, description, is_active } = req.body;
    const [result] = await db.query(
      `UPDATE resources SET
        resource_name = COALESCE(?, resource_name),
        resource_type = COALESCE(?, resource_type),
        location = COALESCE(?, location),
        capacity = COALESCE(?, capacity),
        description = COALESCE(?, description),
        is_active = COALESCE(?, is_active)
       WHERE resource_id = ?`,
      [resource_name || null, resource_type || null, location || null,
       capacity !== undefined ? capacity : null,
       description || null,
       is_active !== undefined ? is_active : null,
       req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json({ message: 'Resource updated successfully' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM resources WHERE resource_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
