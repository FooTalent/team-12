const pool = require('../config/db');
const moment = require('moment');

// Obtener toda la información de la clínica
const getClinicInfo = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM clinic_info');

    // Formatear las horas de apertura y cierre
    results.forEach(clinic => {
      clinic.opening_hours = moment(clinic.opening_hours, 'HH:mm:ss').format('HH:mm');
      clinic.closing_hours = moment(clinic.closing_hours, 'HH:mm:ss').format('HH:mm');
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get clinic information by ID
const getClinicInfoById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('SELECT * FROM clinic_info WHERE id = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    result[0].opening_hours = moment(result[0].opening_hours, 'HH:mm:ss').format('HH:mm')
    result[0].closing_hours = moment(result[0].closing_hours, 'HH:mm:ss').format('HH:mm')

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new clinic information
const createClinicInfo = async (req, res) => {
  const { name, phone_number, address, email, opening_hours, closing_hours } = req.body;

  // Validations
  if (!name || !phone_number || !address || !email || !opening_hours || !closing_hours) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO clinic_info (name, phone_number, address, email, opening_hours, closing_hours)
       VALUES (?, ?, ?, ?, ?)`,
      [name, phone_number, address, email, opening_hours, closing_hours]
    );
    res.status(201).json({
      message: 'Clinic information created successfully',
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update clinic information by ID
const updateClinicInfoById = async (req, res) => {
  const id = req.params.id;
  const { name, phone_number, address, email, opening_hours, closing_hours } = req.body;

  // Validations
  if (!phone_number || !address || !email || !opening_hours || !closing_hours) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE clinic_info 
       SET name = ?, phone_number = ?, address = ?, email = ?, opening_hours = ?, closing_hours = ?
       WHERE id = ?`,
      [name, phone_number, address, email, opening_hours, closing_hours, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    res.json({ message: 'Clinic information updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete clinic information by ID
const deleteClinicInfoById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM clinic_info WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    res.json({ message: 'Clinic information deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getClinicInfo,
  getClinicInfoById,
  createClinicInfo,
  updateClinicInfoById,
  deleteClinicInfoById,
};
