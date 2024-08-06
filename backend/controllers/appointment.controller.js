const pool = require("../config/db");
const moment = require("moment");
const { parseDate } = require("../utils/parseDate");
const { appointmentSchema } = require('../validations/appointment.validations'); 
const { createReminderConfig, updateReminderConfig } = require('./reminder_configurations.controller'); // Asegúrate de que la ruta sea correcta

// Get all appointments
const getAppointments = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT a.*, p.first_name AS patient_name, d.first_name AS dentist_name, r.time AS reason_duration
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users d ON a.dentist_id = d.id
      JOIN reasons r ON a.reason_id = r.id
    `);

    // Formatear las fechas, horas y calcular ending_time
    const formattedResults = results.map((appointment) => {
      const endingTime = moment(appointment.time, "HH:mm:ss")
        .add(appointment.reason_duration, 'minutes')
        .format("HH:mm");

      return {
        id: appointment.id,
        patient_id: appointment.patient_id,
        dentist_id: appointment.dentist_id,
        reason_id: appointment.reason_id,
        date: moment(appointment.date).format("DD-MM-YYYY"),
        time: moment(appointment.time, "HH:mm:ss").format("HH:mm"),
        ending_time: endingTime,
        state: appointment.state,
        assistance: appointment.assistance,
        observations: appointment.observations,
        patient_name: appointment.patient_name,
        dentist_name: appointment.dentist_name,
        created_at: moment(appointment.created_at).format("DD-MM-YYYY:HH:mm:ss"),
        updated_at: moment(appointment.updated_at).format("DD-MM-YYYY:HH:mm:ss"),
      };
    });

    res.json(formattedResults);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get an appointment by ID
const getAppointmentById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query(
      `
      SELECT a.*, p.first_name AS patient_name, d.first_name AS dentist_name, r.time AS reason_duration
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users d ON a.dentist_id = d.id
      JOIN reasons r ON a.reason_id = r.id
      WHERE a.id = ?
    `,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const appointment = result[0];

    // Calcular ending_time y formatear las propiedades date y time
    const endingTime = moment(appointment.time, "HH:mm:ss")
      .add(appointment.reason_duration, 'minutes')
      .format("HH:mm");

    const formattedAppointment = {
      id: appointment.id,
      patient_id: appointment.patient_id,
      dentist_id: appointment.dentist_id,
      reason_id: appointment.reason_id,
      date: moment(appointment.date).format("DD-MM-YYYY"),
      time: moment(appointment.time, "HH:mm:ss").format("HH:mm"),
      ending_time: endingTime,
      state: appointment.state,
      assistance: appointment.assistance,
      observations: appointment.observations,
      patient_name: appointment.patient_name,
      dentist_name: appointment.dentist_name,
      created_at: moment(appointment.created_at).format("DD-MM-YYYY:HH:mm:ss"),
      updated_at: moment(appointment.updated_at).format("DD-MM-YYYY:HH:mm:ss"),
    };

    res.json(formattedAppointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new appointment
const createAppointment = async (req, res) => {
  // Validar el cuerpo de la solicitud
  const { error } = appointmentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { patient_id, dentist_id, reason_id, date, time, state, observations, anticipation_time, is_active } = req.body;

  // Parse and format date
  const parsedDate = parseDate(date);
  if (!parsedDate) {
    return res.status(400).json({ error: "Invalid date format" });
  }
  const formattedDate = parsedDate.format("YYYY-MM-DD");

  // Asegurar que la hora esté en el formato HH:mm:ss
  const formattedTime = moment(time, "HH:mm").format("HH:mm:ss");

  try {
    // Verificar si ya existe un turno en la misma fecha y hora para el mismo dentista
    const checkSql = `
      SELECT COUNT(*) AS count
      FROM appointments
      WHERE dentist_id = ? AND date = ? AND time = ? AND state NOT IN ('cancelled', 'rescheduled')
    `;
    const [checkResult] = await pool.query(checkSql, [dentist_id, formattedDate, formattedTime]);

    if (checkResult[0].count > 0) {
      return res.status(409).json({ error: "Appointment slot already taken" });
    }

    // Insertar el nuevo turno
    const sql = `
      INSERT INTO appointments (patient_id, dentist_id, reason_id, date, time, state, observations, assistance)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      patient_id,
      dentist_id,
      reason_id,
      formattedDate,
      formattedTime,
      state,
      observations,
      null
    ];

    const [result] = await pool.query(sql, values);
    const appointment_id = result.insertId;

    // Si hay una configuración de recordatorio, crear o actualizar la configuración
    if (is_active) {      
        await createReminderConfig( appointment_id, anticipation_time, is_active );     
    }

    res.status(201).json({
      message: "Appointment created successfully",
      id: appointment_id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an appointment by ID
const updateAppointmentById = async (req, res) => {
  const id = req.params.id;
  const { patient_id, dentist_id, reason_id, date, time, state, observations, assistance, anticipation_time, is_active } = req.body;

  // Validar el cuerpo de la solicitud
  const { error } = appointmentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Parse and format date
  const parsedDate = date ? parseDate(date) : null;
  if (date && !parsedDate) {
    return res.status(400).json({ error: "Invalid date format" });
  }
  const formattedDate = parsedDate ? parsedDate.format("YYYY-MM-DD") : null;

  // Asegurar que la hora esté en el formato HH:mm:ss
  const formattedTime = time ? moment(time, "HH:mm").format("HH:mm:ss") : null;

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
  if (state) {
    sql += "state = ?, ";
    values.push(state);
  }
  if (observations) {
    sql += "observations = ?, ";
    values.push(observations);
  }
  if (typeof assistance === 'boolean') {
    sql += "assistance = ?, ";
    values.push(assistance);
  }

  // Eliminar la última coma y espacio del SQL
  sql = sql.slice(0, -2);

  sql += " WHERE id = ?";
  values.push(id);

  try {
    // Verificar si el nuevo horario está disponible
    if (formattedDate && formattedTime) {
      const [existingAppointments] = await pool.query(
        `SELECT id FROM appointments
         WHERE date = ? AND time = ? AND dentist_id = ? AND id <> ?`,
        [formattedDate, formattedTime, dentist_id, id]
      );
      
      if (existingAppointments.length > 0) {
        return res.status(400).json({ error: "The selected time slot is already taken" });
      }
    }

    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Verificar y actualizar o crear configuración de recordatorio
    if (is_active) {
      // Buscar configuración de recordatorio existente para la cita
      const [existingReminderConfigs] = await pool.query(
        `SELECT id FROM reminder_configurations WHERE appointment_id = ?`,
        [id]
      );

      if (existingReminderConfigs.length > 0) {
        // Actualizar configuración de recordatorio existente
        await updateReminderConfig(id, anticipation_time, is_active);
      }
    } 

    res.json({ message: "Appointment updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Partially update an appointment by ID
const patchAppointmentById = async (req, res) => {
  const id = req.params.id;
  const { patient_id, dentist_id, reason_id, date, time, state, observations, assistance } = req.body;

  // Validar el cuerpo de la solicitud
  const { error } = appointmentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Parse and format date
  const parsedDate = date ? parseDate(date) : null;
  if (date && !parsedDate) {
    return res.status(400).json({ error: "Invalid date format" });
  }
  const formattedDate = parsedDate ? parsedDate.format("YYYY-MM-DD") : null;

  // Asegurar que la hora esté en el formato HH:mm:ss
  const formattedTime = time ? moment(time, "HH:mm").format("HH:mm:ss") : null;

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
  if (state) {
    sql += "state = ?, ";
    values.push(state);
  }
  if (observations) {
    sql += "observations = ?, ";
    values.push(observations);
  }
  if (typeof assistance === 'boolean') {
    sql += "assistance = ?, ";
    values.push(assistance);
  }

  // Eliminar la última coma y espacio del SQL
  sql = sql.slice(0, -2);

  sql += " WHERE id = ?";
  values.push(id);

  try {
    // Verificar si el nuevo horario está disponible
    if (formattedDate && formattedTime) {
      const [existingAppointments] = await pool.query(
        `SELECT id FROM appointments
         WHERE date = ? AND time = ? AND dentist_id = ? AND id <> ?`,
        [formattedDate, formattedTime, dentist_id, id]
      );
      
      if (existingAppointments.length > 0) {
        return res.status(400).json({ error: "The selected time slot is already taken" });
      }
    }

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

// Get all appointments by dentist ID and state
const getAppointmentsByDentistIdAndState = async (req, res) => {
  const dentistId = req.params.dentist_id;
  const state = req.query.state;

  // Validación del ID del odontólogo
  if (!dentistId) {
    return res.status(400).json({ error: "Dentist ID is required" });
  }

  try {
    let query = `
      SELECT a.*, p.first_name AS patient_name, d.first_name AS dentist_name, r.time AS reason_duration
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users d ON a.dentist_id = d.id
      JOIN reasons r ON a.reason_id = r.id
      WHERE a.dentist_id = ?
    `;

    const queryParams = [dentistId];

    if (state) {
      query += ' AND a.state = ?';
      queryParams.push(state);
    }

    const [results] = await pool.query(query, queryParams);

    // Formatear las fechas, horas y calcular ending_time
    const formattedResults = results.map((appointment) => {
      const endingTime = moment(appointment.time, "HH:mm:ss")
        .add(appointment.reason_duration, 'minutes')
        .format("HH:mm");

      return {
        id: appointment.id,
        patient_id: appointment.patient_id,
        dentist_id: appointment.dentist_id,
        reason_id: appointment.reason_id,
        date: moment(appointment.date).format("DD-MM-YYYY"),
        time: moment(appointment.time, "HH:mm:ss").format("HH:mm"),
        ending_time: endingTime,
        state: appointment.state,
        assistance: appointment.assistance,
        observations: appointment.observations,
        patient_name: appointment.patient_name,
        dentist_name: appointment.dentist_name,
        created_at: moment(appointment.created_at).format("DD-MM-YYYY:HH:mm:ss"),
        updated_at: moment(appointment.updated_at).format("DD-MM-YYYY:HH:mm:ss"),
      };
    });

    res.json(formattedResults);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get appointment history by patient ID
const getAppointmentsByPatientId = async (req, res) => {
  const patientId = req.params.patient_id;

  // Validación del ID del paciente
  if (!patientId) {
    return res.status(400).json({ error: "Patient ID is required" });
  }

  try {
    const [results] = await pool.query(
      `
      SELECT a.*, p.first_name AS patient_name, d.first_name AS dentist_name, r.time AS reason_duration
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users d ON a.dentist_id = d.id
      JOIN reasons r ON a.reason_id = r.id
      WHERE a.patient_id = ?
    `,
      [patientId]
    );

    // Formatear las fechas, horas y calcular ending_time
    const formattedResults = results.map((appointment) => {
      const endingTime = moment(appointment.time, "HH:mm:ss")
        .add(appointment.reason_duration, 'minutes')
        .format("HH:mm");

      return {
        id: appointment.id,
        patient_id: appointment.patient_id,
        dentist_id: appointment.dentist_id,
        reason_id: appointment.reason_id,
        date: moment(appointment.date).format("DD-MM-YYYY"),
        time: moment(appointment.time, "HH:mm:ss").format("HH:mm"),
        ending_time: endingTime,
        state: appointment.state,
        assistance: appointment.assistance,
        observations: appointment.observations,
        patient_name: appointment.patient_name,
        dentist_name: appointment.dentist_name,
        created_at: moment(appointment.created_at).format("DD-MM-YYYY:HH:mm:ss"),
        updated_at: moment(appointment.updated_at).format("DD-MM-YYYY:HH:mm:ss"),
      };
    });

    res.json(formattedResults);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Función para actualizar el estado de la cita
const updateAppointmentState = async (appointmentId, newState) => {
  try {
      const sql = "UPDATE appointments SET state = ? WHERE id = ?";
      const values = [newState, appointmentId];
      const [result] = await pool.query(sql, values);
      if (result.affectedRows === 0) {
          console.error('Appointment not found for ID:', appointmentId);
      }
  } catch (error) {
      console.error('Error updating appointment state:', error);
  }
};

module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentById,
  patchAppointmentById,
  deleteAppointmentById,
  getAppointmentsByDentistIdAndState,
  updateAppointmentState,
  getAppointmentsByPatientId
};
