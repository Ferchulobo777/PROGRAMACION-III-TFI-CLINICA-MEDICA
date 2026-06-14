const medicosRepo = require("../repositories/medicos.repository");
const usuariosRepo = require("../repositories/usuarios.repository");
const { toMedicoDTO } = require("../dtos");

/* =========================================================
   CAPA DE SERVICIOS - Médicos
   ========================================================= */

const getAll = async () => {
  const rows = await medicosRepo.findAll();
  return rows.map(toMedicoDTO);
};

const getById = async (id) => {
  const row = await medicosRepo.findById(id);
  if (!row) {
    const err = new Error("Médico no encontrado");
    err.status = 404;
    throw err;
  }
  return toMedicoDTO(row);
};

const create = async (data) => {
  const { documento, apellido, nombres, email, contrasenia,
          id_especialidad, matricula, descripcion, valor_consulta } = data;

  const id_usuario = await usuariosRepo.create({
    documento, apellido, nombres, email, password: contrasenia, rol: 1,
  });
  const id_medico = await medicosRepo.create({
    id_usuario, id_especialidad, matricula, descripcion, valor_consulta,
  });
  return id_medico;
};

const update = async (id, data) => {
  const id_usuario = await medicosRepo.findIdUsuario(id);
  if (!id_usuario) {
    const err = new Error("Médico no encontrado");
    err.status = 404;
    throw err;
  }
  // Solo actualizar los campos que llegaron (PATCH-friendly)
  const userFields = {};
  if (data.documento !== undefined) userFields.documento = data.documento;
  if (data.apellido !== undefined)  userFields.apellido  = data.apellido;
  if (data.nombres !== undefined)   userFields.nombres   = data.nombres;
  if (data.email !== undefined)     userFields.email     = data.email;

  if (Object.keys(userFields).length) await usuariosRepo.update(id_usuario, userFields);

  const medicoFields = {};
  if (data.id_especialidad !== undefined) medicoFields.id_especialidad = data.id_especialidad;
  if (data.matricula !== undefined)       medicoFields.matricula       = data.matricula;
  if (data.descripcion !== undefined)     medicoFields.descripcion     = data.descripcion;
  if (data.valor_consulta !== undefined)  medicoFields.valor_consulta  = data.valor_consulta;

  if (Object.keys(medicoFields).length) {
    // completar con valores actuales si faltan
    const current = await medicosRepo.findById(id);
    await medicosRepo.update(id, {
      id_especialidad: medicoFields.id_especialidad ?? current.id_especialidad,
      matricula:       medicoFields.matricula       ?? current.matricula,
      descripcion:     medicoFields.descripcion     ?? current.descripcion,
      valor_consulta:  medicoFields.valor_consulta  ?? current.valor_consulta,
    });
  }
};

const remove = async (id) => {
  const id_usuario = await medicosRepo.findIdUsuario(id);
  if (!id_usuario) {
    const err = new Error("Médico no encontrado");
    err.status = 404;
    throw err;
  }
  await usuariosRepo.softDelete(id_usuario);
};

module.exports = { getAll, getById, create, update, remove };
