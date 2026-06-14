const pool = require("../config/db");

/* =========================================================
   CAPA DE ACCESO A DATOS - Pacientes
   ========================================================= */

const findAll = async () => {
  const [rows] = await pool.query(
    `SELECT p.*, u.apellido, u.nombres, u.email, u.foto_path,
            os.nombre AS nombre_obra_social, os.descripcion AS descripcion_obra_social
     FROM pacientes p
     JOIN usuarios u ON p.id_usuario = u.id_usuario
     JOIN obras_sociales os ON p.id_obra_social = os.id_obra_social
     WHERE u.activo = 1`
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT p.*, u.apellido, u.nombres, u.email, u.foto_path,
            os.nombre AS nombre_obra_social, os.descripcion AS descripcion_obra_social
     FROM pacientes p
     JOIN usuarios u ON p.id_usuario = u.id_usuario
     JOIN obras_sociales os ON p.id_obra_social = os.id_obra_social
     WHERE p.id_paciente = ? AND u.activo = 1`,
    [id]
  );
  return rows[0] || null;
};

const findIdUsuario = async (id) => {
  const [rows] = await pool.query(
    `SELECT id_usuario FROM pacientes WHERE id_paciente = ?`,
    [id]
  );
  return rows[0]?.id_usuario || null;
};

const create = async ({ id_usuario, id_obra_social }) => {
  const [result] = await pool.query(
    `INSERT INTO pacientes (id_usuario, id_obra_social) VALUES (?, ?)`,
    [id_usuario, id_obra_social]
  );
  return result.insertId;
};

const update = async (id, { id_obra_social }) => {
  await pool.query(
    `UPDATE pacientes SET id_obra_social = ? WHERE id_paciente = ?`,
    [id_obra_social, id]
  );
};

module.exports = { findAll, findById, findIdUsuario, create, update };
