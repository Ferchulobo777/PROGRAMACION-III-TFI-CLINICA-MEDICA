const express = require("express");
const router = express.Router();
const makeBreadController = require("../controllers/bread.controller");
const obrasSocialesService = require("../services/obras-sociales.service");
const auth = require("../middlewares/auth.middleware");
const verificarRol = require("../middlewares/role.middleware");
const { obraSocialRules, obraSocialUpdateRules } = require("../middlewares/validations.middleware");

const { browse, read, add, edit, destroy } = makeBreadController(obrasSocialesService);

router.get("/",       auth, browse);
router.get("/:id",    auth, read);
router.post("/",      auth, verificarRol(3), obraSocialRules, add);
router.put("/:id",    auth, verificarRol(3), obraSocialUpdateRules, edit);
router.delete("/:id", auth, verificarRol(3), destroy);

module.exports = router;
