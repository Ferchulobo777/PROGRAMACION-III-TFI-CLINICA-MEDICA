const express = require("express");
const cors    = require("cors");
const morgan  = require("morgan");
const helmet  = require("helmet");
require("dotenv").config();

const app = express();

/* ── Seguridad y utilidades ─────────────────────────────── */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/* ── Rutas versionadas ──────────────────────────────────── */
const BASE = "/api/v1";
app.use(`${BASE}/auth`,          require("./routes/auth.routes"));
app.use(`${BASE}/medicos`,       require("./routes/medicos.routes"));
app.use(`${BASE}/pacientes`,     require("./routes/pacientes.routes"));
app.use(`${BASE}/especialidades`,require("./routes/especialidades.routes"));
app.use(`${BASE}/obras-sociales`,require("./routes/obras-sociales.routes"));
app.use(`${BASE}/turnos`,        require("./routes/turnos.routes"));

/* ── Raíz ───────────────────────────────────────────────── */
app.get("/", (_req, res) =>
  res.status(200).json({
    success: true,
    message: "API Clínica Médica — TFI Programación III — Grupo Y",
    version: "2.0.0",
    endpoints: [
      `${BASE}/auth`,
      `${BASE}/medicos`,
      `${BASE}/pacientes`,
      `${BASE}/especialidades`,
      `${BASE}/obras-sociales`,
      `${BASE}/turnos`,
    ],
  })
);

/* ── 404 ────────────────────────────────────────────────── */
app.use((_req, res) =>
  res.status(404).json({ success: false, message: "Ruta no encontrada" })
);

/* ── Error global ───────────────────────────────────────── */
app.use((err, _req, res, _next) =>
  res.status(500).json({ success: false, message: err.message || "Error interno del servidor" })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));
