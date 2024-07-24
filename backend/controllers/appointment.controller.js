const pool = require('../config/db');
const moment = require('moment');
const { parseDate } = require('../utils/parseDate');

// Get all appointments
const getAppointments = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT a.*, p.first_name AS patient_name, d.first_name AS dentist_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users d ON a.dentist_id = d.id
    `);

    // Formatear las fechas y horas
    const formattedResults = results.map(appointment => ({
      ...appointment,
      date: moment(appointment.date).format('DD-MM-YYYY'),
      time: moment(appointment.time, 'HH:mm:ss').format('HH:mm')
    }));

    res.json(formattedResults);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get an appointment by ID
const getAppointmentById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query(`
      SELECT a.*, p.first_name AS patient_name, d.first_name AS dentist_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users d ON a.dentist_id = d.id
      WHERE a.id = ?
    `, [id]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const appointment = result[0];

    // Formatear las propiedades date y time
    const formattedAppointment = {
      ...appointment,
      date: moment(appointment.date).format('DD-MM-YYYY'),
      time: moment(appointment.time, 'HH:mm:ss').format('HH:mm')
    };

    res.json(formattedAppointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new appointment
const createAppointment = async (req, res) => {
  const { patient_id, dentist_id, reason_id, date, time } = req.body;

  // Validaciones
  if (!patient_id || !dentist_id || !reason_id || !date || !time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Parse and format date
  const parsedDate = parseDate(date);
  if (!parsedDate) {
    return res.status(400).json({ error: "Invalid date format" });
  }
  const formattedDate = parsedDate.format('YYYY-MM-DD');

  // Asegurar que la hora esté en el formato HH:mm:ss
  const formattedTime = moment(time, 'HH:mm').format('HH:mm:ss');

  try {
    const sql = `
      INSERT INTO appointments (patient_id, dentist_id, reason_id, date, time)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [patient_id, dentist_id, reason_id, formattedDate, formattedTime];

    const [result] = await pool.query(sql, values);
    res.status(201).json({
      message: "Appointment created successfully",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an appointment by ID
const updateAppointmentById = async (req, res) => {
  const id = req.params.id;
  const { patient_id, dentist_id, reason_id, date, time } = req.body;

  // Parse and format date
  const parsedDate = date ? parseDate(date) : null;
  if (date && !parsedDate) {
    return res.status(400).json({ error: "Invalid date format" });
  }
  const formattedDate = parsedDate ? parsedDate.format('YYYY-MM-DD') : null;

  // Asegurar que la hora esté en el formato HH:mm:ss
  const formattedTime = time ? moment(time, 'HH:mm').format('HH:mm:ss') : null;

  let sql = "UPDATE appointments SET ";
  const values = [];

  if (patient_id) {
    sql += "patient_id = ?, ";
    values.push(patient_id);
  }
  if (dentist_id) {
    sql += "dentist_id = ?, ";
    values.push(dentist_id);
  }
  if (reason_id) {
    sql += "reason_id = ?, ";
    values.push(reason_id);
  }
  if (formattedDate) {
    sql += "date = ?, ";
    values.push(formattedDate);
  }
  if (formattedTime) {
    sql += "time = ?, ";
    values.push(formattedTime);
  }

  // Eliminar la última coma y espacio del SQL
  sql = sql.slice(0, -2);

  sql += " WHERE id = ?";
  values.push(id);

  try {
    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Partially update an appointment by ID
const patchAppointmentById = async (req, res) => {
  const id = req.params.id;
  const { patient_id, dentist_id, reason_id, date, time } = req.body;

  // Parse and format date
  const parsedDate = date ? parseDate(date) : null;
  if (date && !parsedDate) {
    return res.status(400).json({ error: "Invalid date format" });
  }
  const formattedDate = parsedDate ? parsedDate.format('YYYY-MM-DD') : null;

  // Asegurar que la hora esté en el formato HH:mm:ss
  const formattedTime = time ? moment(time, 'HH:mm').format('HH:mm:ss') : null;

  let sql = "UPDATE appointments SET ";
  const values = [];

  if (patient_id) {
    sql += "patient_id = ?, ";
    values.push(patient_id);
  }
  if (dentist_id) {
    sql += "dentist_id = ?, ";
    values.push(dentist_id);
  }
  if (reason_id) {
    sql += "reason_id = ?, ";
    values.push(reason_id);
  }
  if (formattedDate) {
    sql += "date = ?, ";
    values.push(formattedDate);
  }
  if (formattedTime) {
    sql += "time = ?, ";
    values.push(formattedTime);
  }

  // Eliminar la última coma y espacio del SQL
  sql = sql.slice(0, -2);

  sql += " WHERE id = ?";
  values.push(id);

  try {
    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an appointment by ID
const deleteAppointmentById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query("DELETE FROM appointments WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentById,
  patchAppointmentById,
  deleteAppointmentById,
};
