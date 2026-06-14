const pool = require("../config/db");

/* =========================================================
   CAPA DE ACCESO A DATOS - Médicos
   ========================================================= */

const findAll = async () => {
  const [rows] = await pool.query(
    `SELECT m.*, u.apellido, u.nombres, u.email, u.foto_path,
            e.nombre AS especialidad
     FROM medicos m
     JOIN usuarios u ON m.id_usuario = u.id_usuario
     JOIN especialidades e ON m.id_especialidad = e.id_especialidad
     WHERE u.activo = 1`
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT m.*, u.apellido, u.nombres, u.email, u.foto_path,
            e.nombre AS especialidad
     FROM medicos m
     JOIN usuarios u ON m.id_usuario = u.id_usuario
     JOIN especialidades e ON m.id_especialidad = e.id_especialidad
     WHERE m.id_medico = ? AND u.activo = 1`,
    [id]
  );
  return rows[0] || null;
};

const findIdUsuario = async (id) => {
  const [rows] = await pool.query(
    `SELECT id_usuario FROM medicos WHERE id_medico = ?`,
    [id]
  );
  return rows[0]?.id_usuario || null;
};

const create = async ({ id_usuario, id_especialidad, matricula, descripcion, valor_consulta }) => {
  const [result] = await pool.query(
    `INSERT INTO medicos (id_usuario, id_especialidad, matricula, descripcion, valor_consulta)
     VALUES (?, ?, ?, ?, ?)`,
    [id_usuario, id_especialidad, matricula, descripcion, valor_consulta]
  );
  return result.insertId;
};

const update = async (id, { id_especialidad, matricula, descripcion, valor_consulta }) => {
  await pool.query(
    `UPDATE medicos
     SET id_especialidad = ?, matricula = ?, descripcion = ?, valor_consulta = ?
     WHERE id_medico = ?`,
    [id_especialidad, matricula, descripcion, valor_consulta, id]
  );
};

module.exports = { findAll, findById, findIdUsuario, create, update };
