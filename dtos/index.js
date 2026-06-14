/* =========================================================
   DTOs - Data Transfer Objects
   Desacoplan el modelo de BD de las respuestas HTTP
   ========================================================= */

const toUsuarioDTO = (row) => ({
  id: row.id_usuario,
  documento: row.documento,
  apellido: row.apellido,
  nombres: row.nombres,
  email: row.email,
  rol: row.rol,
  activo: row.activo,
});

const toMedicoDTO = (row) => ({
  id: row.id_medico,
  id_usuario: row.id_usuario,
  apellido: row.apellido,
  nombres: row.nombres,
  email: row.email,
  foto_path: row.foto_path || "",
  id_especialidad: row.id_especialidad,
  especialidad: row.especialidad || null,
  matricula: row.matricula,
  descripcion: row.descripcion,
  valor_consulta: parseFloat(row.valor_consulta),
});

const toPacienteDTO = (row) => ({
  id: row.id_paciente,
  id_usuario: row.id_usuario,
  apellido: row.apellido,
  nombres: row.nombres,
  email: row.email,
  foto_path: row.foto_path || "",
  id_obra_social: row.id_obra_social,
  descripcion_obra_social: row.descripcion_obra_social || null,
  obra_social: row.nombre_obra_social || null,
});

const toEspecialidadDTO = (row) => ({
  id: row.id_especialidad,
  nombre: row.nombre,
  activo: row.activo,
});

const toObraSocialDTO = (row) => ({
  id: row.id_obra_social,
  nombre: row.nombre,
  descripcion: row.descripcion,
  porcentaje_descuento: parseFloat(row.porcentaje_descuento),
  es_particular: !!row.es_particular,
  activo: row.activo,
});

const toTurnoDTO = (row) => ({
  id: row.id_turno_reserva,
  id_medico: row.id_medico,
  medico: row.medico_apellido
    ? `${row.medico_apellido}, ${row.medico_nombres}`
    : null,
  id_paciente: row.id_paciente,
  paciente: row.paciente_apellido
    ? `${row.paciente_apellido}, ${row.paciente_nombres}`
    : null,
  id_obra_social: row.id_obra_social,
  obra_social: row.obra_social || null,
  fecha_hora: row.fecha_hora,
  valor_total: parseFloat(row.valor_total),
  atendido: !!row.atentido,
  activo: !!row.activo,
});

module.exports = {
  toUsuarioDTO,
  toMedicoDTO,
  toPacienteDTO,
  toEspecialidadDTO,
  toObraSocialDTO,
  toTurnoDTO,
};
