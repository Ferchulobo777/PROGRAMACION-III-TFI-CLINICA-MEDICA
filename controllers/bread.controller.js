/* =========================================================
   Factory de controladores BREAD genérico
   Recibe un service y devuelve los handlers del controlador.
   ========================================================= */

const { validationResult } = require("express-validator");

const makeBreadController = (service) => {
  const browse = async (req, res) => {
    try {
      const data = await service.getAll(req.query);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  };

  const read = async (req, res) => {
    try {
      const data = await service.getById(req.params.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  };

  const add = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    try {
      const id = await service.create(req.body);
      return res.status(201).json({ success: true, message: "Recurso creado", data: { id } });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  };

  const edit = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    try {
      await service.update(req.params.id, req.body);
      return res.status(200).json({ success: true, message: "Recurso actualizado" });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  };

  const destroy = async (req, res) => {
    try {
      await service.remove(req.params.id);
      return res.status(200).json({ success: true, message: "Recurso eliminado" });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  };

  return { browse, read, add, edit, destroy };
};

module.exports = makeBreadController;
