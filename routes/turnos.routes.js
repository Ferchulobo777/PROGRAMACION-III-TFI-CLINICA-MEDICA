const express = require("express");
const router = express.Router();
const turnosController = require("../controllers/turnos.controller");
const auth = require("../middlewares/auth.middleware");
const verificarRol = require("../middlewares/role.middleware");
const { turnoRules, turnoUpdateRules } = require("../middlewares/validations.middleware");

// Reporte de facturación (procedimiento almacenado)
router.get("/facturacion", auth, verificarRol(3), turnosController.getFacturacion);

router.get("/",       auth, turnosController.browse);
router.get("/:id",    auth, turnosController.read);
router.post("/",      auth, verificarRol(3), turnoRules, turnosController.add);
router.put("/:id",    auth, verificarRol(3), turnoUpdateRules, turnosController.edit);
router.delete("/:id", auth, verificarRol(3), turnosController.destroy);

module.exports = router;
