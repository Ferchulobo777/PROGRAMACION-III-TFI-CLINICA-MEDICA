const express = require("express");
const router = express.Router();
const makeBreadController = require("../controllers/bread.controller");
const medicosService = require("../services/medicos.service");
const auth = require("../middlewares/auth.middleware");
const verificarRol = require("../middlewares/role.middleware");
const { medicoRules, medicoUpdateRules } = require("../middlewares/validations.middleware");

const { browse, read, add, edit, destroy } = makeBreadController(medicosService);

// Roles: 1=médico, 2=paciente, 3=recepcionista (admin)
router.get("/",      auth, browse);
router.get("/:id",   auth, read);
router.post("/",     auth, verificarRol(3), medicoRules, add);
router.put("/:id",   auth, verificarRol(3), medicoUpdateRules, edit);
router.delete("/:id",auth, verificarRol(3), destroy);

module.exports = router;
