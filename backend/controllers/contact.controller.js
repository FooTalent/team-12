const pool = require('../config/db');
const contactSchema = require('../validations/contact.validations'); // Ajusta la ruta según sea necesario

// Obtener todos los contactos
const getContacts = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM contacts');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un contacto por ID
const getContactById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('SELECT * FROM contacts WHERE id = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear un nuevo contacto
const createContact = async (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { first_name, last_name, email, phone } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO contacts (first_name, last_name, email, phone)
       VALUES (?, ?, ?, ?)`,
      [first_name, last_name, email, phone]
    );
    res.status(201).json({
      message: 'Contact created successfully',
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un contacto por ID
const updateContactById = async (req, res) => {
  const id = req.params.id;
  const { error } = contactSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { first_name, last_name, email, phone } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE contacts 
       SET first_name = ?, last_name = ?, email = ?, phone = ?
       WHERE id = ?`,
      [first_name, last_name, email, phone, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un contacto por ID
const deleteContactById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM contacts WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar parcialmente un contacto por ID
const patchContactById = async (req, res) => {
  const id = req.params.id;
  const { first_name, last_name, email, phone } = req.body;

  // Construir la consulta SQL dinámicamente
  let sql = "UPDATE contacts SET ";
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
  if (phone) {
    sql += "phone = ?, ";
    values.push(phone);
  }

  // Eliminar la última coma y espacio del SQL
  sql = sql.slice(0, -2);
  sql += " WHERE id = ?";
  values.push(id);

  try {
    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact partially updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById,
  patchContactById,
};
