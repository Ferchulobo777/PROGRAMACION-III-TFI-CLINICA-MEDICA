# 🏥 Clínica Médica — TFI Programación III — Grupo Y

**Facultad:** FCAD - Universidad Nacional de Entre Ríos (UNER)
**Carrera:** Tecnicatura Universitaria en Desarrollo Web
**Cátedra:** Programación III
**Clases Teóricas:** Prof. Ignacio Novello
**Clases Prácticas:** Prof. Cristian D. Faure
**Grupo:** Y

**Integrantes:**
- Fernando Rodriguez
- Natalia Ailén Gonzalez
- Martin Andres Conti
- Maria Pamela Conti
- Geronimo Leyes

**Repositorio:** https://github.com/Ferchulobo777/PROGRAMACION-III-TFI-CLINICA-MEDICA

---

## 1. Arquitectura

```
Cliente (Postman / Frontend)
        │  HTTP + JSON (Bearer JWT)
        ▼
┌─────────────────────────────────────────────────────────┐
│  app.js  →  /api/v1/...                                  │
│                                                           │
│  Routes        →  declaran endpoints + middlewares       │
│  Middlewares   →  auth (JWT), roles, validaciones         │
│  Controllers   →  reciben request, llaman al service      │
│  Services      →  lógica de negocio (cálculos, reglas)    │
│  Repositories  →  acceso a datos (SQL puro, mysql2)        │
│  DTOs          →  transforman filas de BD → respuesta JSON │
└─────────────────────────────────────────────────────────┘
        │
        ▼
      MySQL (prog3_turnos)
```

### Por qué esta arquitectura

La primera entrega recibió tres observaciones, y esta arquitectura las resuelve directamente:

| Observación del docente | Cómo se resolvió |
|---|---|
| *"Acceden a los datos desde el controlador, esto debería realizarse desde la capa de acceso a datos"* | Se creó la capa **`repositories/`**: es el único lugar del proyecto donde se escribe SQL. Los controladores nunca importan `mysql2`. |
| *"Falta capa de servicios"* | Se creó la capa **`services/`**: contiene toda la lógica de negocio (cálculo de `valor_total` con descuento, validación de existencia de relaciones, reglas de creación de usuario+médico/paciente en una sola operación, etc.) |
| *"En PUT están obligando al cliente a enviar todos los campos"* | Los servicios de `update` ahora hacen **merge** entre los campos recibidos y los valores actuales en BD. Las reglas de validación de PUT (`*UpdateRules`) usan `.optional()`, validando un campo solo si está presente. Se puede actualizar, por ejemplo, únicamente `{ "email": "nuevo@correo.com" }` sin reenviar documento, nombres, etc. |

---

## 2. Estructura de carpetas

```
backend/
├── app.js                       # punto de entrada, monta /api/v1
├── package.json
├── .env.example
├── config/
│   └── db.js                    # pool de conexiones mysql2
├── dtos/
│   └── index.js                 # toMedicoDTO, toPacienteDTO, toTurnoDTO, etc.
├── repositories/                # DAL — único lugar con SQL
│   ├── usuarios.repository.js
│   ├── medicos.repository.js
│   ├── pacientes.repository.js
│   ├── especialidades.repository.js
│   ├── obras-sociales.repository.js
│   └── turnos.repository.js
├── services/                    # lógica de negocio
│   ├── auth.service.js
│   ├── medicos.service.js
│   ├── pacientes.service.js
│   ├── especialidades.service.js
│   ├── obras-sociales.service.js
│   └── turnos.service.js
├── controllers/
│   ├── bread.controller.js      # factory genérica BREAD (browse/read/add/edit/destroy)
│   ├── auth.controller.js
│   └── turnos.controller.js     # extiende el BREAD con /facturacion
├── middlewares/
│   ├── auth.middleware.js       # valida JWT (Bearer)
│   ├── role.middleware.js       # valida rol (verificarRol(3) = Recepcionista)
│   └── validations.middleware.js
└── routes/
    ├── auth.routes.js
    ├── medicos.routes.js
    ├── pacientes.routes.js
    ├── especialidades.routes.js
    ├── obras-sociales.routes.js
    └── turnos.routes.js

database/
└── procedimiento_facturacion.sql  # CREATE PROCEDURE sp_facturacion_por_especialidad
```

---

## 3. Roles del sistema

| Rol (valor en BD) | Nombre | Permisos |
|---|---|---|
| `1` | Médico | Lectura de todos los recursos (GET) |
| `2` | Paciente | Lectura de todos los recursos (GET) |
| `3` | Recepcionista (admin) | Lectura + Alta + Modificación + Baja de todos los recursos, y acceso al reporte de facturación |

Todas las rutas `GET` requieren JWT válido (cualquier rol). Las rutas `POST`, `PUT`, `DELETE` y `GET /turnos/facturacion` requieren rol `3`.

---

## 4. Instalación

### Requisitos
- Node.js ≥ 18
- MySQL / MariaDB con la base `prog3_turnos` (script de `modelo_de_datos.md`)

### Pasos

```bash
cd backend
cp .env.example .env       # completar credenciales de BD
npm install
```

1. Importar el script de la base de datos (tablas + datos de `modelo_de_datos.md`).
2. Ejecutar el procedimiento almacenado:
   ```bash
   mysql -u root -p prog3_turnos < ../database/procedimiento_facturacion.sql
   ```
   *(Si no se ejecuta este paso, el endpoint de facturación funciona igual: el repositorio detecta que el procedimiento no existe y usa automáticamente la consulta equivalente como respaldo.)*
3. Levantar el servidor:
   ```bash
   npm run dev      # con nodemon
   # o
   npm start
   ```

El servidor queda escuchando en `http://localhost:3000`.

---

## 5. Variables de entorno (`.env`)

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=prog3_turnos
JWT_SECRET=secret_key
```

---

## 6. Endpoints — API REST v1

Base URL: `http://localhost:3000/api/v1`

Formato de respuesta consistente en **todos** los endpoints:

```json
// Éxito
{ "success": true, "data": ..., "message": "opcional" }

// Error
{ "success": false, "message": "Descripción del error" }

// Error de validación (400)
{ "success": false, "errors": [{ "msg": "...", "path": "email", ... }] }
```

### 6.1 Auth (públicos)

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| POST | `/auth/login` | `{ email, password }` | Devuelve `{ token, usuario }` |
| POST | `/auth/register` | `{ documento, apellido, nombres, email, password, rol? }` | Crea un usuario básico (rol por defecto: 2 = paciente) |

> ⚠️ `/auth/register` crea solo un registro en `usuarios`. Para que un médico o paciente quede operativo (con su fila en `medicos`/`pacientes`), se debe usar `POST /medicos` o `POST /pacientes`, que crean ambos registros de forma atómica desde la capa de servicios.

### 6.2 Médicos — `/medicos`

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/medicos` | cualquiera | Listado de médicos activos |
| GET | `/medicos/:id` | cualquiera | Detalle de un médico |
| POST | `/medicos` | 3 | Crea usuario + médico (rol=1 automático) |
| PUT | `/medicos/:id` | 3 | Actualización parcial |
| DELETE | `/medicos/:id` | 3 | Baja lógica (usuario y médico) |

Body `POST /medicos`:
```json
{
  "documento": "31000115",
  "apellido": "Garcia",
  "nombres": "Ana",
  "email": "garana@correo.com",
  "contrasenia": "garana",
  "id_especialidad": 2,
  "matricula": 5000,
  "descripcion": "Médica clínica",
  "valor_consulta": 6000
}
```

Body `PUT /medicos/:id` (parcial — solo lo que se quiere cambiar):
```json
{ "valor_consulta": 6500 }
```

### 6.3 Pacientes — `/pacientes`

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/pacientes` | cualquiera | Listado de pacientes activos |
| GET | `/pacientes/:id` | cualquiera | Detalle de un paciente |
| POST | `/pacientes` | 3 | Crea usuario + paciente (rol=2 automático) |
| PUT | `/pacientes/:id` | 3 | Actualización parcial |
| DELETE | `/pacientes/:id` | 3 | Baja lógica |

Body `POST /pacientes`:
```json
{
  "documento": "41000115",
  "apellido": "Diaz",
  "nombres": "Carla",
  "email": "diacar@correo.com",
  "contrasenia": "diacar",
  "id_obra_social": 1
}
```

Body `PUT /pacientes/:id` (parcial):
```json
{ "id_obra_social": 2 }
```

### 6.4 Especialidades — `/especialidades`

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/especialidades` | cualquiera | Listado |
| GET | `/especialidades/:id` | cualquiera | Detalle |
| POST | `/especialidades` | 3 | Crear |
| PUT | `/especialidades/:id` | 3 | Actualizar (parcial) |
| DELETE | `/especialidades/:id` | 3 | Baja lógica |

### 6.5 Obras Sociales — `/obras-sociales`

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/obras-sociales` | cualquiera | Listado |
| GET | `/obras-sociales/:id` | cualquiera | Detalle |
| POST | `/obras-sociales` | 3 | Crear |
| PUT | `/obras-sociales/:id` | 3 | Actualizar (parcial) |
| DELETE | `/obras-sociales/:id` | 3 | Baja lógica |

Body `POST /obras-sociales`:
```json
{
  "nombre": "Swiss Medical",
  "descripcion": "swiss",
  "porcentaje_descuento": 15,
  "es_particular": false
}
```

### 6.6 Turnos — `/turnos`

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/turnos` | cualquiera | Listado (admite `?id_medico=` y `?id_paciente=`) |
| GET | `/turnos/:id` | cualquiera | Detalle |
| GET | `/turnos/facturacion` | 3 | Reporte de facturación por especialidad (mes anterior) |
| POST | `/turnos` | 3 | Crea un turno — **calcula `valor_total` automáticamente** |
| PUT | `/turnos/:id` | 3 | Actualización parcial |
| DELETE | `/turnos/:id` | 3 | Baja lógica |

Body `POST /turnos`:
```json
{
  "id_medico": 1,
  "id_paciente": 1,
  "id_obra_social": 1,
  "fecha_hora": "2026-07-15T10:00:00.000Z"
}
```

> El campo `valor_total` **no se envía**: el servicio lo calcula como
> `valor_consulta_del_medico * (1 - porcentaje_descuento_obra_social / 100)`.

---

## 7. Códigos de estado HTTP utilizados

| Código | Cuándo se usa |
|---|---|
| 200 | GET / PUT / DELETE exitosos |
| 201 | POST exitoso (recurso creado) |
| 400 | Error de validación de datos de entrada |
| 401 | Falta el token, token inválido/expirado, o credenciales incorrectas en login |
| 403 | Token válido pero el rol no tiene permiso sobre el recurso |
| 404 | Recurso no encontrado |
| 500 | Error interno / de base de datos |

---

## 8. Usuarios de prueba (obligatorios)

Las contraseñas en `modelo_de_datos.md` están hasheadas con **SHA2-256** y corresponden a la parte del email anterior al `@`. La consulta de login (`usuarios.repository.js`) compara con `SHA2(?, 256)`, por lo que estas tres cuentas funcionan tal cual están en el dump:

| Email | Contraseña | Rol | id_usuario |
|---|---|---|---|
| `benhor@correo.com` | `benhor` | 1 — Médico | 3 |
| `ferben@correo.com` | `ferben` | 3 — Recepcionista (admin) | 8 |
| `lopjac@correo.com` | `lopjac` | 2 — Paciente | 5 |

---

## 9. Guía de pruebas (curl / Postman)

> Reemplazar `TOKEN_ADMIN`, `TOKEN_MEDICO`, `TOKEN_PACIENTE` por los tokens devueltos en cada login.

### 9.1 Login — obtener tokens

```bash
# Recepcionista / admin
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ferben@correo.com","password":"ferben"}'

# Médico
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"benhor@correo.com","password":"benhor"}'

# Paciente
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"lopjac@correo.com","password":"lopjac"}'
```

Respuesta esperada (200):
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "usuario": { "id": 8, "email": "ferben@correo.com", "rol": 3, "nombres": "Benito", "apellido": "Fernandez" }
  }
}
```

Login con credenciales incorrectas → **401**:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ferben@correo.com","password":"incorrecta"}'
# {"success":false,"message":"Credenciales inválidas"}
```

### 9.2 BREAD de Médicos

```bash
TOKEN_ADMIN="..."   # token de ferben (rol 3)
TOKEN_PACIENTE="..." # token de lopjac (rol 2)

# Browse (cualquier rol)
curl http://localhost:3000/api/v1/medicos \
  -H "Authorization: Bearer $TOKEN_PACIENTE"

# Read
curl http://localhost:3000/api/v1/medicos/1 \
  -H "Authorization: Bearer $TOKEN_PACIENTE"

# Add (solo admin)
curl -X POST http://localhost:3000/api/v1/medicos \
  -H "Authorization: Bearer $TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "documento":"31000115","apellido":"Garcia","nombres":"Ana",
    "email":"garana@correo.com","contrasenia":"garana",
    "id_especialidad":2,"matricula":5000,
    "descripcion":"Médica clínica","valor_consulta":6000
  }'
# -> 201 { "success": true, "message": "Recurso creado", "data": { "id": 5 } }

# Add con paciente (sin permiso) -> 403
curl -X POST http://localhost:3000/api/v1/medicos \
  -H "Authorization: Bearer $TOKEN_PACIENTE" \
  -H "Content-Type: application/json" -d '{}'
# -> 403 { "success": false, "message": "No autorizado para este recurso" }

# Edit parcial (solo admin) — actualiza UN campo
curl -X PUT http://localhost:3000/api/v1/medicos/5 \
  -H "Authorization: Bearer $TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{"valor_consulta": 6500}'
# -> 200 { "success": true, "message": "Recurso actualizado" }

# Destroy (baja lógica)
curl -X DELETE http://localhost:3000/api/v1/medicos/5 \
  -H "Authorization: Bearer $TOKEN_ADMIN"
# -> 200 { "success": true, "message": "Recurso eliminado" }
```

### 9.3 BREAD de Pacientes

```bash
curl -X POST http://localhost:3000/api/v1/pacientes \
  -H "Authorization: Bearer $TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "documento":"41000115","apellido":"Diaz","nombres":"Carla",
    "email":"diacar@correo.com","contrasenia":"diacar","id_obra_social":1
  }'

curl -X PUT http://localhost:3000/api/v1/pacientes/4 \
  -H "Authorization: Bearer $TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{"id_obra_social": 2}'
```

### 9.4 Especialidades y Obras Sociales

```bash
curl -X POST http://localhost:3000/api/v1/especialidades \
  -H "Authorization: Bearer $TOKEN_ADMIN" -H "Content-Type: application/json" \
  -d '{"nombre":"CARDIOLOGÍA"}'

curl -X POST http://localhost:3000/api/v1/obras-sociales \
  -H "Authorization: Bearer $TOKEN_ADMIN" -H "Content-Type: application/json" \
  -d '{"nombre":"Swiss Medical","descripcion":"swiss","porcentaje_descuento":15,"es_particular":false}'
```

### 9.5 Turnos — cálculo automático de `valor_total`

```bash
# Médico id=1 tiene valor_consulta = 5000.00
# Obra social id=1 (Jerárquicos) tiene porcentaje_descuento = 10.00
curl -X POST http://localhost:3000/api/v1/turnos \
  -H "Authorization: Bearer $TOKEN_ADMIN" -H "Content-Type: application/json" \
  -d '{
    "id_medico": 1,
    "id_paciente": 1,
    "id_obra_social": 1,
    "fecha_hora": "2026-07-20T10:00:00.000Z"
  }'
# -> valor_total calculado = 5000 * (1 - 0.10) = 4500.00

# Verificar el resultado
curl http://localhost:3000/api/v1/turnos?id_medico=1 \
  -H "Authorization: Bearer $TOKEN_PACIENTE"

# Marcar como atendido (actualización parcial)
curl -X PUT http://localhost:3000/api/v1/turnos/8 \
  -H "Authorization: Bearer $TOKEN_ADMIN" -H "Content-Type: application/json" \
  -d '{"atendido": true}'
```

### 9.6 Facturación (procedimiento almacenado)

```bash
curl http://localhost:3000/api/v1/turnos/facturacion \
  -H "Authorization: Bearer $TOKEN_ADMIN"
```

Respuesta esperada (200):
```json
{
  "success": true,
  "data": [
    { "id_especialidad": 2, "especialidad": "CLÍNICA", "cantidad_turnos": 3, "facturacion_total": 27000 },
    { "id_especialidad": 4, "especialidad": "INFECTOLOGÍA", "cantidad_turnos": 1, "facturacion_total": 133500 },
    { "id_especialidad": 1, "especialidad": "PEDIATRÍA", "cantidad_turnos": 0, "facturacion_total": 0 },
    { "id_especialidad": 3, "especialidad": "TRAUMATOLOGÍA", "cantidad_turnos": 0, "facturacion_total": 0 },
    { "id_especialidad": 9, "especialidad": "NEUROLOGÍA", "cantidad_turnos": 0, "facturacion_total": 0 }
  ]
}
```
*(Los valores varían según la fecha del sistema, ya que el reporte filtra por "mes anterior".)*

### 9.7 Casos de error a validar

```bash
# Sin token -> 401
curl http://localhost:3000/api/v1/medicos
# {"success":false,"message":"Token requerido"}

# Token inválido -> 401
curl http://localhost:3000/api/v1/medicos -H "Authorization: Bearer abc123"
# {"success":false,"message":"Token inválido o expirado"}

# Recurso inexistente -> 404
curl http://localhost:3000/api/v1/medicos/9999 -H "Authorization: Bearer $TOKEN_PACIENTE"
# {"success":false,"message":"Médico no encontrado"}

# Validación fallida -> 400
curl -X POST http://localhost:3000/api/v1/medicos \
  -H "Authorization: Bearer $TOKEN_ADMIN" -H "Content-Type: application/json" \
  -d '{"apellido":"SinDocumento"}'
# {"success":false,"errors":[{"msg":"Documento requerido", ...}, ...]}
```

---

