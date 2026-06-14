const makeBreadController = require("./bread.controller");
const turnosService = require("../services/turnos.service");

const bread = makeBreadController(turnosService);

const getFacturacion = async (req, res) => {
  try {
    const data = await turnosService.getFacturacion();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { ...bread, getFacturacion };
