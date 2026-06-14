const pacientesRepo = require("../repositories/pacientes.repository");
const usuariosRepo = require("../repositories/usuarios.repository");
const { toPacienteDTO } = require("../dtos");

/* =========================================================
   CAPA DE SERVICIOS - Pacientes
   ========================================================= */

const getAll = async () => {
  const rows = await pacientesRepo.findAll();
  return rows.map(toPacienteDTO);
};

const getById = async (id) => {
  const row = await pacientesRepo.findById(id);
  if (!row) {
    const err = new Error("Paciente no encontrado");
    err.status = 404;
    throw err;
  }
  return toPacienteDTO(row);
};

const create = async (data) => {
  const { documento, apellido, nombres, email, contrasenia, id_obra_social } = data;
  const id_usuario = await usuariosRepo.create({
    documento, apellido, nombres, email, password: contrasenia, rol: 2,
  });
  const id_paciente = await pacientesRepo.create({ id_usuario, id_obra_social });
  return id_paciente;
};

const update = async (id, data) => {
  const id_usuario = await pacientesRepo.findIdUsuario(id);
  if (!id_usuario) {
    const err = new Error("Paciente no encontrado");
    err.status = 404;
    throw err;
  }
  const userFields = {};
  if (data.documento !== undefined) userFields.documento = data.documento;
  if (data.apellido !== undefined)  userFields.apellido  = data.apellido;
  if (data.nombres !== undefined)   userFields.nombres   = data.nombres;
  if (data.email !== undefined)     userFields.email     = data.email;
  if (Object.keys(userFields).length) await usuariosRepo.update(id_usuario, userFields);

  if (data.id_obra_social !== undefined) {
    await pacientesRepo.update(id, { id_obra_social: data.id_obra_social });
  }
};

const remove = async (id) => {
  const id_usuario = await pacientesRepo.findIdUsuario(id);
  if (!id_usuario) {
    const err = new Error("Paciente no encontrado");
    err.status = 404;
    throw err;
  }
  await usuariosRepo.softDelete(id_usuario);
};

module.exports = { getAll, getById, create, update, remove };
