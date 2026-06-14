const { validationResult } = require("express-validator");
const authService = require("../services/auth.service");

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const data = await authService.login(req.body.email, req.body.password);
    return res.status(200).json({ success: true, message: "Login exitoso", data });
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    await authService.register(req.body);
    return res.status(201).json({ success: true, message: "Usuario registrado correctamente" });
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

module.exports = { login, register };
