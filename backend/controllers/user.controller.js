const bcrypt = require("bcrypt");
const pool = require("../config/db");

const getUsers = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT u.*, r.name AS role
      FROM usuarios u
      JOIN roles r ON u.role_id = r.id
    `);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query(
      `
      SELECT u.*, r.name AS role
      FROM usuarios u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `,
      [id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createUser = async (req, res) => {
  const { nombre, apellido, correo_electronico, contrasena, role_id } = req.body;
  const hashedPassword = await bcrypt.hash(contrasena, 10);

  const sqlUser = `
    INSERT INTO usuarios (nombre, apellido, correo_electronico, contrasena, role_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  const valuesUser = [nombre, apellido, correo_electronico, hashedPassword, role_id];

  try {
    const [resultUser] = await pool.query(sqlUser, valuesUser);

    res.json({
      message: "User created successfully",
      id: resultUser.insertId,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Duplicate entry for correo_electronico" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

const updateUserById = async (req, res) => {
  const id = req.params.id;
  const { nombre, apellido, correo_electronico, role_id } = req.body;

  const sql = `
    UPDATE usuarios 
    SET nombre = ?, apellido = ?, correo_electronico = ?, role_id = ?
    WHERE id = ?
  `;
  const values = [nombre, apellido, correo_electronico, role_id, id];

  try {
    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const patchUserById = async (req, res) => {
  const id = req.params.id;
  const { nombre, apellido, correo_electronico, role_id } = req.body;

  // Construir el SQL dinámicamente basado en los campos proporcionados en la solicitud
  let sql = "UPDATE usuarios SET ";
  const values = [];

  if (nombre) {
    sql += "nombre = ?, ";
    values.push(nombre);
  }
  if (apellido) {
    sql += "apellido = ?, ";
    values.push(apellido);
  }
  if (correo_electronico) {
    sql += "correo_electronico = ?, ";
    values.push(correo_electronico);
  }
  if (role_id) {
    sql += "role_id = ?, ";
    values.push(role_id);
  }

  // Eliminar la última coma y espacio del SQL
  sql = sql.slice(0, -2);

  sql += " WHERE id = ?";
  values.push(id);

  try {
    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  deleteUserById,
  createUser,
  updateUserById,
  patchUserById,
};
