const express = require("express");
const router = express.Router();
const makeBreadController = require("../controllers/bread.controller");
const pacientesService = require("../services/pacientes.service");
const auth = require("../middlewares/auth.middleware");
const verificarRol = require("../middlewares/role.middleware");
const { pacienteRules, pacienteUpdateRules } = require("../middlewares/validations.middleware");

const { browse, read, add, edit, destroy } = makeBreadController(pacientesService);

router.get("/",       auth, browse);
router.get("/:id",    auth, read);
router.post("/",      auth, verificarRol(3), pacienteRules, add);
router.put("/:id",    auth, verificarRol(3), pacienteUpdateRules, edit);
router.delete("/:id", auth, verificarRol(3), destroy);

module.exports = router;
