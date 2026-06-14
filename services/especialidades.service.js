const repo = require("../repositories/especialidades.repository");
const { toEspecialidadDTO } = require("../dtos");

const getAll = async () => (await repo.findAll()).map(toEspecialidadDTO);

const getById = async (id) => {
  const row = await repo.findById(id);
  if (!row) { const e = new Error("Especialidad no encontrada"); e.status = 404; throw e; }
  return toEspecialidadDTO(row);
};

const create = async ({ nombre }) => repo.create({ nombre });

const update = async (id, data) => {
  const row = await repo.findById(id);
  if (!row) { const e = new Error("Especialidad no encontrada"); e.status = 404; throw e; }
  const nombre = data.nombre !== undefined ? data.nombre : row.nombre;
  await repo.update(id, { nombre });
};

const remove = async (id) => {
  const row = await repo.findById(id);
  if (!row) { const e = new Error("Especialidad no encontrada"); e.status = 404; throw e; }
  await repo.softDelete(id);
};

module.exports = { getAll, getById, create, update, remove };
