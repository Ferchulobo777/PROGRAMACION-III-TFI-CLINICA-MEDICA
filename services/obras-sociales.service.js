const repo = require("../repositories/obras-sociales.repository");
const { toObraSocialDTO } = require("../dtos");

const getAll = async () => (await repo.findAll()).map(toObraSocialDTO);

const getById = async (id) => {
  const row = await repo.findById(id);
  if (!row) { const e = new Error("Obra social no encontrada"); e.status = 404; throw e; }
  return toObraSocialDTO(row);
};

const create = async (data) => repo.create(data);

const update = async (id, data) => {
  const row = await repo.findById(id);
  if (!row) { const e = new Error("Obra social no encontrada"); e.status = 404; throw e; }
  const merged = {
    nombre:               data.nombre               !== undefined ? data.nombre               : row.nombre,
    descripcion:          data.descripcion          !== undefined ? data.descripcion          : row.descripcion,
    porcentaje_descuento: data.porcentaje_descuento  !== undefined ? data.porcentaje_descuento : row.porcentaje_descuento,
    es_particular:        data.es_particular        !== undefined ? data.es_particular        : !!row.es_particular,
  };
  await repo.update(id, merged);
};

const remove = async (id) => {
  const row = await repo.findById(id);
  if (!row) { const e = new Error("Obra social no encontrada"); e.status = 404; throw e; }
  await repo.softDelete(id);
};

module.exports = { getAll, getById, create, update, remove };
