const pool = require("../config/db");

const findAll = async (filters = {}) => {
  let query = `
    SELECT tr.*,
           um.apellido AS medico_apellido, um.nombres AS medico_nombres,
           up.apellido AS paciente_apellido, up.nombres AS paciente_nombres,
           os.nombre AS obra_social
    FROM turnos_reservas tr
    JOIN medicos m ON tr.id_medico = m.id_medico
    JOIN usuarios um ON m.id_usuario = um.id_usuario
    JOIN pacientes p ON tr.id_paciente = p.id_paciente
    JOIN usuarios up ON p.id_usuario = up.id_usuario
    JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
    WHERE tr.activo = 1
  `;
  const values = [];
  if (filters.id_medico) { query += " AND tr.id_medico = ?"; values.push(filters.id_medico); }
  if (filters.id_paciente) { query += " AND tr.id_paciente = ?"; values.push(filters.id_paciente); }
  query += " ORDER BY tr.fecha_hora DESC";

  const [rows] = await pool.query(query, values);
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT tr.*,
            um.apellido AS medico_apellido, um.nombres AS medico_nombres,
            up.apellido AS paciente_apellido, up.nombres AS paciente_nombres,
            os.nombre AS obra_social
     FROM turnos_reservas tr
     JOIN medicos m ON tr.id_medico = m.id_medico
     JOIN usuarios um ON m.id_usuario = um.id_usuario
     JOIN pacientes p ON tr.id_paciente = p.id_paciente
     JOIN usuarios up ON p.id_usuario = up.id_usuario
     JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
     WHERE tr.id_turno_reserva = ? AND tr.activo = 1`,
    [id]
  );
  return rows[0] || null;
};

const create = async ({ id_medico, id_paciente, id_obra_social, fecha_hora, valor_total }) => {
  const [result] = await pool.query(
    `INSERT INTO turnos_reservas (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atentido)
     VALUES (?, ?, ?, ?, ?, 0)`,
    [id_medico, id_paciente, id_obra_social, fecha_hora, valor_total]
  );
  return result.insertId;
};

const update = async (id, { id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atendido }) => {
  await pool.query(
    `UPDATE turnos_reservas
     SET id_medico = ?, id_paciente = ?, id_obra_social = ?, fecha_hora = ?, valor_total = ?, atentido = ?
     WHERE id_turno_reserva = ?`,
    [id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atendido ? 1 : 0, id]
  );
};

const softDelete = async (id) => {
  await pool.query(
    `UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ?`,
    [id]
  );
};

// Facturación por especialidad (mes anterior) — usa el procedimiento
// almacenado sp_facturacion_por_especialidad (ver database/procedimiento_facturacion.sql).
// Si el procedimiento no fue creado en la base, se recurre a la consulta
// equivalente como respaldo para no interrumpir el servicio.
const facturacionPorEspecialidad = async () => {
  try {
    const [rows] = await pool.query(`CALL sp_facturacion_por_especialidad()`);
    return rows[0]; // CALL devuelve un array de result sets; el primero son las filas
  } catch (err) {
    if (err.code !== "ER_SP_DOES_NOT_EXIST") throw err;
    const [rows] = await pool.query(
      `SELECT
         e.id_especialidad,
         e.nombre AS especialidad,
         COUNT(tr.id_turno_reserva) AS cantidad_turnos,
         COALESCE(SUM(tr.valor_total), 0) AS facturacion_total
       FROM especialidades e
       LEFT JOIN medicos m ON e.id_especialidad = m.id_especialidad
       LEFT JOIN turnos_reservas tr
         ON m.id_medico = tr.id_medico
         AND MONTH(tr.fecha_hora) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
         AND tr.activo = 1
       WHERE e.activo = 1
       GROUP BY e.id_especialidad, e.nombre
       ORDER BY cantidad_turnos DESC`
    );
    return rows;
  }
};

module.exports = { findAll, findById, create, update, softDelete, facturacionPorEspecialidad };
