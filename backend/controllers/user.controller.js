const bcrypt = require("bcrypt");
const pool = require("../config/db");
const moment = require('moment');
const { userSchema, updateUserSchema } = require('../validations/user.validations');

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT u.*, r.name AS role, c.name AS clinic_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN clinic_info c ON u.clinic_id = c.id
    `);

    results.forEach(user => {
      user.created_at = moment(user.created_at).format('DD-MM-YYYY:HH:mm:ss');
      user.updated_at = moment(user.updated_at).format('DD-MM-YYYY:HH:mm:ss');
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  const id = req.params.id;
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid or missing user ID" });
  }

  try {
    const [result] = await pool.query(`
      SELECT u.*, r.name AS role, c.name AS clinic_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN clinic_info c ON u.clinic_id = c.id
      WHERE u.id = ?
    `, [id]);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    result[0].created_at = moment(result[0].created_at).format('DD-MM-YYYY:HH:mm:ss');
    result[0].updated_at = moment(result[0].updated_at).format('DD-MM-YYYY:HH:mm:ss');

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Borrar un usuario por ID
const deleteUserById = async (req, res) => {
  const id = req.params.id;
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid or missing user ID" });
  }

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

// Crear un nuevo usuario
const createUser = async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { first_name, last_name, dni, email, phone_number, password, role_id, active, clinic_id } = req.body;

  try {
    // Validar si clinic_id existe
    const [clinicResult] = await pool.query('SELECT id FROM clinic_info WHERE id = ?', [clinic_id]);
    if (clinicResult.length === 0) {
      return res.status(400).json({ error: 'Clinic ID does not exist' });
    }

    // Validar si role_id existe
    const [roleResult] = await pool.query('SELECT id FROM roles WHERE id = ?', [role_id]);
    if (roleResult.length === 0) {
      return res.status(400).json({ error: 'Role ID does not exist' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sqlUser = `
      INSERT INTO users (first_name, last_name, dni, email, phone_number, password, role_id, active, clinic_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const valuesUser = [first_name, last_name, dni, email, phone_number, hashedPassword, role_id, active, clinic_id];

    const [resultUser] = await pool.query(sqlUser, valuesUser);

    const [newUser] = await pool.query('SELECT * FROM users WHERE id = ?', [resultUser.insertId]);

    newUser[0].created_at = moment(newUser[0].created_at).format('DD-MM-YYYY:HH:mm:ss');
    newUser[0].updated_at = moment(newUser[0].updated_at).format('DD-MM-YYYY:HH:mm:ss');

    res.json({
      message: "User created successfully",
      user: newUser[0],
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Duplicate entry for email or dni" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Actualizar un usuario por ID
const updateUserById = async (req, res) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const id = req.params.id;
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid or missing user ID" });
  }

  const { first_name, last_name, email, role_id, dni, active, phone_number, clinic_id } = req.body;

  // Validar si role_id existe (si se proporciona)
  if (role_id) {
    const [roleResult] = await pool.query('SELECT id FROM roles WHERE id = ?', [role_id]);
    if (roleResult.length === 0) {
      return res.status(400).json({ error: 'Role ID does not exist' });
    }
  }

  // Validar si clinic_id existe (si se proporciona)
  if (clinic_id) {
    const [clinicResult] = await pool.query('SELECT id FROM clinic_info WHERE id = ?', [clinic_id]);
    if (clinicResult.length === 0) {
      return res.status(400).json({ error: 'Clinic ID does not exist' });
    }
  }

  const sql = `
    UPDATE users 
    SET first_name = ?, last_name = ?, email = ?, role_id = ?, dni = ?, active = ?, phone_number = ?, clinic_id = ?
    WHERE id = ?
  `;
  const values = [first_name, last_name, email, role_id, dni, active, phone_number, clinic_id, id];

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

// Actualizar parcialmente un usuario por ID
const patchUserById = async (req, res) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const id = req.params.id;
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid or missing user ID" });
  }

  const { first_name, last_name, email, role_id, dni, active, phone_number, clinic_id } = req.body;

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
  if (phone_number) {
    sql += "phone_number = ?, ";
    values.push(phone_number);
  }
  if (clinic_id) {
    sql += "clinic_id = ?, ";
    values.push(clinic_id);
  }

  sql = sql.slice(0, -2);
  sql += " WHERE id = ?";
  values.push(id);

  // Validar si role_id existe (si se proporciona)
  if (role_id) {
    const [roleResult] = await pool.query('SELECT id FROM roles WHERE id = ?', [role_id]);
    if (roleResult.length === 0) {
      return res.status(400).json({ error: 'Role ID does not exist' });
    }
  }

  // Validar si clinic_id existe (si se proporciona)
  if (clinic_id) {
    const [clinicResult] = await pool.query('SELECT id FROM clinic_info WHERE id = ?', [clinic_id]);
    if (clinicResult.length === 0) {
      return res.status(400).json({ error: 'Clinic ID does not exist' });
    }
  }

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
