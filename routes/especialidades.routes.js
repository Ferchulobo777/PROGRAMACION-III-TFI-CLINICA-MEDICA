const express = require("express");
const router = express.Router();
const makeBreadController = require("../controllers/bread.controller");
const especialidadesService = require("../services/especialidades.service");
const auth = require("../middlewares/auth.middleware");
const verificarRol = require("../middlewares/role.middleware");
const { especialidadRules, especialidadUpdateRules } = require("../middlewares/validations.middleware");

const { browse, read, add, edit, destroy } = makeBreadController(especialidadesService);

router.get("/",       auth, browse);
router.get("/:id",    auth, read);
router.post("/",      auth, verificarRol(3), especialidadRules, add);
router.put("/:id",    auth, verificarRol(3), especialidadUpdateRules, edit);
router.delete("/:id", auth, verificarRol(3), destroy);

module.exports = router;
