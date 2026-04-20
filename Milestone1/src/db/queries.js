const db = require('../db');

async function findAll(table, fields = '*') {
  const [rows] = await db.query(`SELECT ${fields} FROM ${table}`);
  return rows;
}

async function findById(table, idColumn, id) {
  const [rows] = await db.query(
    `SELECT * FROM ${table} WHERE ${idColumn} = ?`,
    [id]
  );
  return rows[0] || null;
}

async function findWhere(table, conditions, values) {
  const [rows] = await db.query(
    `SELECT * FROM ${table} WHERE ${conditions}`,
    values
  );
  return rows;
}

module.exports = { findAll, findById, findWhere };
