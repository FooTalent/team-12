const pool = require("../config/db");

const getPatients = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM patients");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPatientById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query("SELECT * FROM patients WHERE id = ?", [
      id,
    ]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createPatient = async (req, res) => {
  const {
    first_name,
    last_name,
    birth_date,
    dni,
    phone_number,
    alternative_phone_number,
    email,
  } = req.body;

  // Validaciones
  if (!first_name || !last_name || !birth_date || !dni || !phone_number || email) {
    if (!first_name) {
      return res.status(400).json({ error: "First name is required" });
    }
    if (!last_name) {
      return res.status(400).json({ error: "Last name is required" });
    }
    if (!birth_date) {
      return res.status(400).json({ error: "Birth date is required" });
    }
    if (!dni) {
      return res.status(400).json({ error: "DNI is required" });
    }
    if (!phone_number) {
      return res.status(400).json({ error: "phone_number number is required" });
    }
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO patients (first_name, last_name, birth_date, dni, phone_number, alternative_phone_number, email)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, birth_date, dni, phone_number, alternative_phone_number, email]
    );
    res.status(201).json({
      message: "Patient created successfully",
      id: result.insertId,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Duplicate entry for email or dni" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

const deletePatientById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query("DELETE FROM patients WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePatientById = async (req, res) => {
  const id = req.params.id;
  const {
    first_name,
    last_name,
    birth_date,
    dni,
    phone_number,
    alternative_phone_number,
    email,
  } = req.body;

  // Validaciones
  if (!first_name || !last_name || !birth_date || !dni || !phone_number || !email) {
    if (!first_name) {
      return res.status(400).json({ error: "First name is required" });
    }
    if (!last_name) {
      return res.status(400).json({ error: "Last name is required" });
    }
    if (!birth_date) {
      return res.status(400).json({ error: "Birth date is required" });
    }
    if (!dni) {
      return res.status(400).json({ error: "DNI is required" });
    }
    if (!phone_number) {
      return res.status(400).json({ error: "phone_number number is required" });
    }
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
  }

  try {
    const [result] = await pool.query(
      `UPDATE patients 
       SET first_name = ?, last_name = ?, birth_date = ?, dni = ?, phone_number, alternative_phone_number = ?, email = ? 
       WHERE id = ?`,
      [
        first_name,
        last_name,
        birth_date,
        dni,
        phone_number,
        alternative_phone_number,
        email,
        id,
      ]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json({ message: "Patient updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPatientsByDentistId = async (req, res) => {
  const dentistId = req.params.dentist_id;

  try {
    const [results] = await pool.query(
      `
      SELECT DISTINCT p.*
      FROM patients p
      JOIN appointments a ON p.id = a.patient_id
      WHERE a.dentist_id = ?
    `,
      [dentistId]
    );

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No patients found for this dentist" });
    }

    res.json(results);
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
  getPatientsByDentistId,
};
