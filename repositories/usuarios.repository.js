const pool = require("../config/db");

/* =========================================================
   CAPA DE ACCESO A DATOS - Usuarios
   ========================================================= */

const findByEmailAndPassword = async (email, password) => {
  const [rows] = await pool.query(
    `SELECT * FROM usuarios
     WHERE email = ? AND contrasenia = SHA2(?, 256) AND activo = 1`,
    [email, password]
  );
  return rows[0] || null;
};

const create = async ({ documento, apellido, nombres, email, password, rol }) => {
  const [result] = await pool.query(
    `INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol)
     VALUES (?, ?, ?, ?, SHA2(?, 256), '', ?)`,
    [documento, apellido, nombres, email, password, rol]
  );
  return result.insertId;
};

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT * FROM usuarios WHERE id_usuario = ? AND activo = 1`,
    [id]
  );
  return rows[0] || null;
};

const update = async (id, fields) => {
  const updates = [];
  const values = [];
  if (fields.documento !== undefined) { updates.push("documento = ?"); values.push(fields.documento); }
  if (fields.apellido !== undefined)  { updates.push("apellido = ?");  values.push(fields.apellido);  }
  if (fields.nombres !== undefined)   { updates.push("nombres = ?");   values.push(fields.nombres);   }
  if (fields.email !== undefined)     { updates.push("email = ?");     values.push(fields.email);     }
  if (fields.password !== undefined)  { updates.push("contrasenia = SHA2(?, 256)"); values.push(fields.password); }
  if (updates.length === 0) return;
  values.push(id);
  await pool.query(`UPDATE usuarios SET ${updates.join(", ")} WHERE id_usuario = ?`, values);
};

const softDelete = async (id) => {
  await pool.query(`UPDATE usuarios SET activo = 0 WHERE id_usuario = ?`, [id]);
};

module.exports = { findByEmailAndPassword, create, findById, update, softDelete };
