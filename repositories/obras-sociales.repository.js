const pool = require("../config/db");

const findAll = async () => {
  const [rows] = await pool.query(
    `SELECT * FROM obras_sociales WHERE activo = 1 ORDER BY nombre`
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT * FROM obras_sociales WHERE id_obra_social = ? AND activo = 1`,
    [id]
  );
  return rows[0] || null;
};

const create = async ({ nombre, descripcion, porcentaje_descuento, es_particular }) => {
  const [result] = await pool.query(
    `INSERT INTO obras_sociales (nombre, descripcion, porcentaje_descuento, es_particular)
     VALUES (?, ?, ?, ?)`,
    [nombre, descripcion, porcentaje_descuento, es_particular ? 1 : 0]
  );
  return result.insertId;
};

const update = async (id, { nombre, descripcion, porcentaje_descuento, es_particular }) => {
  await pool.query(
    `UPDATE obras_sociales
     SET nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ?
     WHERE id_obra_social = ?`,
    [nombre, descripcion, porcentaje_descuento, es_particular ? 1 : 0, id]
  );
};

const softDelete = async (id) => {
  await pool.query(
    `UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ?`,
    [id]
  );
};

module.exports = { findAll, findById, create, update, softDelete };
