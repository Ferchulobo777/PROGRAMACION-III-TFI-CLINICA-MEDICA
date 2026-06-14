const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/auth.controller");
const { loginRules, registerRules } = require("../middlewares/validations.middleware");

router.post("/login", loginRules, login);
router.post("/register", registerRules, register);

module.exports = router;
