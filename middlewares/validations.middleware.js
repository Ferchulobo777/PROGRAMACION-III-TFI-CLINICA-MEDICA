const { body } = require("express-validator");

const loginRules = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Contraseña requerida"),
];

const registerRules = [
  body("documento").notEmpty().withMessage("Documento requerido"),
  body("apellido").notEmpty().withMessage("Apellido requerido"),
  body("nombres").notEmpty().withMessage("Nombres requerido"),
  body("email").isEmail().withMessage("Email inválido"),
  body("password").isLength({ min: 4 }).withMessage("Contraseña mínimo 4 caracteres"),
];

const medicoRules = [
  body("documento").notEmpty().withMessage("Documento requerido"),
  body("apellido").notEmpty().withMessage("Apellido requerido"),
  body("nombres").notEmpty().withMessage("Nombres requerido"),
  body("email").isEmail().withMessage("Email inválido"),
  body("contrasenia").notEmpty().withMessage("Contraseña requerida"),
  body("id_especialidad").isInt({ min: 1 }).withMessage("Especialidad requerida"),
  body("matricula").isInt({ min: 1 }).withMessage("Matrícula requerida"),
  body("valor_consulta").isFloat({ min: 0 }).withMessage("Valor de consulta inválido"),
];

const pacienteRules = [
  body("documento").notEmpty().withMessage("Documento requerido"),
  body("apellido").notEmpty().withMessage("Apellido requerido"),
  body("nombres").notEmpty().withMessage("Nombres requerido"),
  body("email").isEmail().withMessage("Email inválido"),
  body("contrasenia").notEmpty().withMessage("Contraseña requerida"),
  body("id_obra_social").isInt({ min: 1 }).withMessage("Obra social requerida"),
];

const especialidadRules = [
  body("nombre").notEmpty().withMessage("Nombre requerido"),
];

const obraSocialRules = [
  body("nombre").notEmpty().withMessage("Nombre requerido"),
  body("descripcion").notEmpty().withMessage("Descripción requerida"),
  body("porcentaje_descuento").isFloat({ min: 0, max: 100 }).withMessage("Porcentaje inválido"),
];

const turnoRules = [
  body("id_medico").isInt({ min: 1 }).withMessage("Médico requerido"),
  body("id_paciente").isInt({ min: 1 }).withMessage("Paciente requerido"),
  body("id_obra_social").isInt({ min: 1 }).withMessage("Obra social requerida"),
  body("fecha_hora").isISO8601().withMessage("Fecha y hora inválidas"),
];

/* =========================================================
   Reglas para PUT (actualización parcial)
   Solo validan el campo SI está presente en el body.
   Permiten que el cliente envíe únicamente los campos que
   desea modificar, sin obligar a reenviar el objeto completo.
   ========================================================= */

const medicoUpdateRules = [
  body("documento").optional().notEmpty().withMessage("Documento no puede estar vacío"),
  body("apellido").optional().notEmpty().withMessage("Apellido no puede estar vacío"),
  body("nombres").optional().notEmpty().withMessage("Nombres no puede estar vacío"),
  body("email").optional().isEmail().withMessage("Email inválido"),
  body("id_especialidad").optional().isInt({ min: 1 }).withMessage("Especialidad inválida"),
  body("matricula").optional().isInt({ min: 1 }).withMessage("Matrícula inválida"),
  body("valor_consulta").optional().isFloat({ min: 0 }).withMessage("Valor de consulta inválido"),
];

const pacienteUpdateRules = [
  body("documento").optional().notEmpty().withMessage("Documento no puede estar vacío"),
  body("apellido").optional().notEmpty().withMessage("Apellido no puede estar vacío"),
  body("nombres").optional().notEmpty().withMessage("Nombres no puede estar vacío"),
  body("email").optional().isEmail().withMessage("Email inválido"),
  body("id_obra_social").optional().isInt({ min: 1 }).withMessage("Obra social inválida"),
];

const turnoUpdateRules = [
  body("id_medico").optional().isInt({ min: 1 }).withMessage("Médico inválido"),
  body("id_paciente").optional().isInt({ min: 1 }).withMessage("Paciente inválido"),
  body("id_obra_social").optional().isInt({ min: 1 }).withMessage("Obra social inválida"),
  body("fecha_hora").optional().isISO8601().withMessage("Fecha y hora inválidas"),
  body("atendido").optional().isBoolean().withMessage("Atendido debe ser booleano"),
];

const especialidadUpdateRules = [
  body("nombre").optional().notEmpty().withMessage("Nombre no puede estar vacío"),
];

const obraSocialUpdateRules = [
  body("nombre").optional().notEmpty().withMessage("Nombre no puede estar vacío"),
  body("descripcion").optional().notEmpty().withMessage("Descripción no puede estar vacía"),
  body("porcentaje_descuento").optional().isFloat({ min: 0, max: 100 }).withMessage("Porcentaje inválido"),
  body("es_particular").optional().isBoolean().withMessage("es_particular debe ser booleano"),
];

module.exports = {
  loginRules, registerRules,
  medicoRules, pacienteRules,
  especialidadRules, obraSocialRules,
  turnoRules,
  medicoUpdateRules, pacienteUpdateRules,
  turnoUpdateRules, especialidadUpdateRules, obraSocialUpdateRules,
};
