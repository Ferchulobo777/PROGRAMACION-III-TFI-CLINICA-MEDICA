const repo = require("../repositories/turnos.repository");
const medicosRepo = require("../repositories/medicos.repository");
const pacientesRepo = require("../repositories/pacientes.repository");
const obrasSocialesRepo = require("../repositories/obras-sociales.repository");
const { toTurnoDTO } = require("../dtos");

/* =========================================================
   CAPA DE SERVICIOS - Turnos
   Calcula automáticamente el valor_total aplicando descuento
   ========================================================= */

const calcularValorTotal = async (id_medico, id_obra_social) => {
  const medico = await medicosRepo.findById(id_medico);
  if (!medico) { const e = new Error("Médico no encontrado"); e.status = 404; throw e; }
  const os = await obrasSocialesRepo.findById(id_obra_social);
  if (!os) { const e = new Error("Obra social no encontrada"); e.status = 404; throw e; }
  const descuento = parseFloat(os.porcentaje_descuento) / 100;
  const valor = parseFloat(medico.valor_consulta) * (1 - descuento);
  return parseFloat(valor.toFixed(2));
};

const getAll = async (filters) => (await repo.findAll(filters)).map(toTurnoDTO);

const getById = async (id) => {
  const row = await repo.findById(id);
  if (!row) { const e = new Error("Turno no encontrado"); e.status = 404; throw e; }
  return toTurnoDTO(row);
};

const create = async ({ id_medico, id_paciente, id_obra_social, fecha_hora }) => {
  const valor_total = await calcularValorTotal(id_medico, id_obra_social);
  const id = await repo.create({ id_medico, id_paciente, id_obra_social, fecha_hora, valor_total });
  return id;
};

const update = async (id, data) => {
  const existing = await repo.findById(id);
  if (!existing) { const e = new Error("Turno no encontrado"); e.status = 404; throw e; }
  const merged = {
    id_medico:      data.id_medico      ?? existing.id_medico,
    id_paciente:    data.id_paciente    ?? existing.id_paciente,
    id_obra_social: data.id_obra_social ?? existing.id_obra_social,
    fecha_hora:     data.fecha_hora     ?? existing.fecha_hora,
    valor_total:    data.valor_total    ?? parseFloat(existing.valor_total),
    atendido:       data.atendido       ?? existing.atentido,
  };
  if (data.id_medico || data.id_obra_social) {
    merged.valor_total = await calcularValorTotal(merged.id_medico, merged.id_obra_social);
  }
  await repo.update(id, merged);
};

const remove = async (id) => {
  const row = await repo.findById(id);
  if (!row) { const e = new Error("Turno no encontrado"); e.status = 404; throw e; }
  await repo.softDelete(id);
};

const getFacturacion = async () => repo.facturacionPorEspecialidad();

module.exports = { getAll, getById, create, update, remove, getFacturacion };
