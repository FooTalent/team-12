const pool = require('../config/db');

const getPatients = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM patients');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPatientById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('SELECT * FROM patients WHERE id = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createPatient = async (req, res) => {
  const { first_name, last_name, birth_date, gender, marital_status, address, city, phone, email, occupation } = req.body;

  // Validaciones
  if (!first_name || !last_name || !birth_date || !gender) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO patients (first_name, last_name, birth_date, gender, marital_status, address, city, phone, email, occupation)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, birth_date, gender, marital_status, address, city, phone, email, occupation]
    );
    res.status(201).json({
      message: 'Patient created successfully',
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePatientById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM patients WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePatientById = async (req, res) => {
  const id = req.params.id;
  const { first_name, last_name, birth_date, gender, marital_status, address, city, phone, email, occupation } = req.body;

  // Validaciones
  if (!first_name || !last_name || !birth_date || !gender) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE patients 
       SET first_name = ?, last_name = ?, birth_date = ?, gender = ?, marital_status = ?, address = ?, city = ?, phone = ?, email = ?, occupation = ?
       WHERE id = ?`,
      [first_name, last_name, birth_date, gender, marital_status, address, city, phone, email, occupation, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: 'Patient updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  deletePatientById,
  updatePatientById,
};
