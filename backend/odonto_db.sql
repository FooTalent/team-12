-- Roles
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcado de datos para la tabla `roles`
INSERT INTO roles (id, name) VALUES
(1, 'admin'),
(2, 'odontologo'),
(3, 'secretario');

-- Usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(255) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    reset_password_token VARCHAR(255) DEFAULT NULL,
    reset_password_expiration DATETIME DEFAULT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Pacientes
CREATE TABLE pacientes (
    paciente_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero ENUM('M', 'F') NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    correo_electronico VARCHAR(255),
    direccion VARCHAR(255),
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Odontologos
CREATE TABLE odontologos (
    odontologo_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    especialidad VARCHAR(255) NOT NULL,
    horario_atencion VARCHAR(255) NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Citas
CREATE TABLE citas (
    cita_id INT PRIMARY KEY AUTO_INCREMENT,
    paciente_id INT NOT NULL,
    odontologo_id INT NOT NULL,
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    duracion_cita INT NOT NULL,
    motivo_cita VARCHAR(255),
    estado ENUM('pendiente', 'confirmada', 'cancelada') NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id),
    FOREIGN KEY (odontologo_id) REFERENCES odontologos(odontologo_id)
);

-- Expedientes Médicos
CREATE TABLE expedientes_medicos (
    expediente_id INT PRIMARY KEY AUTO_INCREMENT,
    paciente_id INT NOT NULL,
    historial_medico TEXT,
    diagnosticos TEXT,
    tratamientos TEXT,
    alergias TEXT,
    medicamentos TEXT,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id)
);

-- Recordatorios
CREATE TABLE recordatorios (
    recordatorio_id INT PRIMARY KEY AUTO_INCREMENT,
    cita_id INT NOT NULL,
    fecha_recordatorio DATE NOT NULL,
    hora_recordatorio TIME NOT NULL,
    mensaje TEXT NOT NULL,
    estado ENUM('enviado', 'pendiente') NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cita_id) REFERENCES citas(cita_id)
);

-- Indices de la tabla `roles`
ALTER TABLE roles
  ADD UNIQUE KEY (name);

-- Indices de la tabla `usuarios`
ALTER TABLE usuarios
  ADD UNIQUE KEY (correo_electronico),
  ADD UNIQUE KEY (reset_password_token);

-- Indices de la tabla `pacientes`
ALTER TABLE pacientes
  ADD UNIQUE KEY (correo_electronico);

-- Indices de la tabla `odontologos`
ALTER TABLE odontologos
  ADD UNIQUE KEY (nombre, apellido, especialidad);

-- Indices de la tabla `citas`
ALTER TABLE citas
  ADD KEY (paciente_id),
  ADD KEY (odontologo_id);

-- Indices de la tabla `expedientes_medicos`
ALTER TABLE expedientes_medicos
  ADD KEY (paciente_id);

-- Indices de la tabla `recordatorios`
ALTER TABLE recordatorios
  ADD KEY (cita_id);

