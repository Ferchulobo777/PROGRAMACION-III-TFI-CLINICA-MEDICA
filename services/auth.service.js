const jwt = require("jsonwebtoken");
const usuariosRepo = require("../repositories/usuarios.repository");

/* =========================================================
   CAPA DE SERVICIOS - Autenticación
   ========================================================= */

const login = async (email, password) => {
  const user = await usuariosRepo.findByEmailAndPassword(email, password);
  if (!user) {
    const err = new Error("Credenciales inválidas");
    err.status = 401;
    throw err;
  }
  const token = jwt.sign(
    { id: user.id_usuario, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
  return {
    token,
    usuario: {
      id: user.id_usuario,
      email: user.email,
      rol: user.rol,
      nombres: user.nombres,
      apellido: user.apellido,
    },
  };
};

const register = async ({ documento, apellido, nombres, email, password, rol }) => {
  const id = await usuariosRepo.create({ documento, apellido, nombres, email, password, rol: rol || 2 });
  return id;
};

module.exports = { login, register };
