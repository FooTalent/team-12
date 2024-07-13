const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const { createToken } = require("../utils/token");

const login = async (req, res) => {
  const { correo_electronico, contrasena } = req.body;

  try {
    // Consulta para obtener el usuario y el rol asociado
    const [userRows] = await pool.query(
      `
      SELECT u.*, r.name AS role
      FROM usuarios u
      JOIN roles r ON u.role_id = r.id
      WHERE u.correo_electronico = ?
    `,
      [correo_electronico]
    );

    // Verifica si el usuario existe
    const user = userRows[0];
    if (!user) {
      return res.status(400).json({ error: "Correo electrónico o contraseña inválidos" });
    }

    // Compara la contraseña proporcionada con la contraseña almacenada
    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Correo electrónico o contraseña inválidos" });
    }

    // Crea y devuelve un token para el usuario autenticado
    res.json({
      success: "Inicio de sesión exitoso",
      token: createToken(user),
    });
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const forgotPassword = async (req, res) => {
  const { correo_electronico } = req.body;

  try {
    // Verificar si el correo electrónico existe en la base de datos
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE correo_electronico = ?", [correo_electronico]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Correo electrónico no encontrado." });
    }

    const user = rows[0];

    // Generar token único y establecer fecha de vencimiento
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Actualizar en la base de datos (almacenar el token y la fecha de vencimiento)
    await pool.query(
      "UPDATE usuarios SET reset_password_token = ?, reset_password_expiration = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = ?",
      [resetToken, user.id]
    );

    res.json({
      message: "Se ha generado el token para restablecer su contraseña.",
      token: resetToken,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al procesar la solicitud." });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { nueva_contrasena } = req.body;

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar si el token es válido y no ha expirado
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE id = ? AND reset_password_token = ? AND reset_password_expiration > NOW()",
      [decoded.id, token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Token inválido o expirado." });
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(nueva_contrasena, 10);

    // Actualizar la contraseña en la base de datos
    await pool.query(
      "UPDATE usuarios SET contrasena = ?, reset_password_token = NULL, reset_password_expiration = NULL WHERE id = ?",
      [hashedPassword, decoded.id]
    );

    res.json({ message: "Contraseña restablecida con éxito." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al procesar la solicitud." });
  }
};

const changePassword = async (req, res) => {
  const id = req.params.id;
  const { contrasena_antigua, nueva_contrasena, confirmar_contrasena } = req.body;

  if (nueva_contrasena !== confirmar_contrasena) {
    return res.status(400).json({ error: "Las contraseñas no coinciden" });
  }

  try {
    // Verificar si el usuario existe en la base de datos
    const [results] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = results[0];
    // Verificar si la contraseña antigua es correcta
    const passwordMatch = await bcrypt.compare(contrasena_antigua, user.contrasena);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Contraseña antigua incorrecta" });
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(nueva_contrasena, 10);
    // Actualizar la contraseña en la base de datos
    await pool.query("UPDATE usuarios SET contrasena = ? WHERE id = ?", [hashedPassword, id]);

    res.json({ message: "Contraseña cambiada con éxito" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = { 
  login,
  forgotPassword,
  resetPassword,
  changePassword 
};
