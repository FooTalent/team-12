const bcrypt = require("bcrypt");
const pool = require("../config/db");

const getUsers = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT u.*, r.name AS role
      FROM users u
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
      FROM users u
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
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createUser = async (req, res) => {
  const { first_name, last_name, dni, email, phone_number, password, role_id, active } = req.body;

  // Validaciones
  if (!first_name || !last_name || !dni || !email || !phone_number || !password || !role_id || active === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Validación de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Validación de longitud de la contraseña
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long" });
  }

  // Validación de role_id (suponiendo que tienes roles definidos en tu base de datos)
  const validRoles = [1, 2, 3]; // Ejemplo de IDs de roles válidos
  if (!validRoles.includes(role_id)) {
    return res.status(400).json({ error: "Invalid role ID" });
  }

  try {
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserción en la base de datos
    const sqlUser = `
      INSERT INTO users (first_name, last_name, dni, email, phone_number, password, role_id, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const valuesUser = [first_name, last_name, dni, email, phone_number, hashedPassword, role_id, active];

    const [resultUser] = await pool.query(sqlUser, valuesUser);

    res.json({
      message: "User created successfully",
      id: resultUser.insertId,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Duplicate entry for email or dni" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};



const updateUserById = async (req, res) => {
  const id = req.params.id;
  const { first_name, last_name, email, role_id, dni, active, telefono } = req.body;

  const sql = `
    UPDATE users 
    SET first_name = ?, last_name = ?, email = ?, role_id = ?, dni = ?, active = ?, telefono = ?
    WHERE id = ?
  `;
  const values = [first_name, last_name, email, role_id, dni, active, telefono, id];

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
  const { first_name, last_name, email, role_id, dni, active, telefono } = req.body;

  // Construir el SQL dinámicamente basado en los campos proporcionados en la solicitud
  let sql = "UPDATE users SET ";
  const values = [];

  if (first_name) {
    sql += "first_name = ?, ";
    values.push(first_name);
  }
  if (last_name) {
    sql += "last_name = ?, ";
    values.push(last_name);
  }
  if (email) {
    sql += "email = ?, ";
    values.push(email);
  }
  if (role_id) {
    sql += "role_id = ?, ";
    values.push(role_id);
  }
  if (dni) {
    sql += "dni = ?, ";
    values.push(dni);
  }
  if (typeof active === 'boolean') {
    sql += "active = ?, ";
    values.push(active);
  }
  if (telefono) {
    sql += "telefono = ?, ";
    values.push(telefono);
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
