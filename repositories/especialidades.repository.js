const pool = require("../config/db");

const findAll = async () => {
  const [rows] = await pool.query(
    `SELECT * FROM especialidades WHERE activo = 1 ORDER BY nombre`
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT * FROM especialidades WHERE id_especialidad = ? AND activo = 1`,
    [id]
  );
  return rows[0] || null;
};

const create = async ({ nombre }) => {
  const [result] = await pool.query(
    `INSERT INTO especialidades (nombre) VALUES (?)`,
    [nombre.toUpperCase()]
  );
  return result.insertId;
};

const update = async (id, { nombre }) => {
  await pool.query(
    `UPDATE especialidades SET nombre = ? WHERE id_especialidad = ?`,
    [nombre.toUpperCase(), id]
  );
};

const softDelete = async (id) => {
  await pool.query(
    `UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?`,
    [id]
  );
};

module.exports = { findAll, findById, create, update, softDelete };
