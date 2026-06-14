const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    if (!header) return res.status(401).json({ success: false, message: "Token requerido" });
    const token = header.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "Token inválido" });
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Token inválido o expirado" });
  }
};

module.exports = auth;
