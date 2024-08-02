const pool = require("../config/db");

// Get all reminder configurations
const getReminderConfigurations = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT rc.*, p.first_name AS patient_name, p.last_name AS patient_last_name
      FROM reminder_configurations rc
      JOIN patients p ON rc.patient_id = p.id
    `);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a reminder configuration by ID
const getReminderConfigurationById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query(
      `
      SELECT rc.*, p.first_name AS patient_name, p.last_name AS patient_last_name
      FROM reminder_configurations rc
      JOIN patients p ON rc.patient_id = p.id
      WHERE rc.id = ?
    `,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Reminder configuration not found" });
    }

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new reminder configuration
const createReminderConfiguration = async (req, res) => {
  const { patient_id, anticipation_time, is_active } = req.body;

  // Validate required fields
  if (!patient_id || is_active === undefined) {
    return res.status(400).json({ error: "Patient ID and is_active are required" });
  }

  // Set default value for anticipation_time if not provided
  const anticipationTime = anticipation_time || '00:00:00';

  try {
    const sql = `
      INSERT INTO reminder_configurations (patient_id, anticipation_time, is_active)
      VALUES (?, ?, ?)
    `;
    const values = [patient_id, anticipationTime, is_active];

    const [result] = await pool.query(sql, values);
    res.status(201).json({
      message: "Reminder configuration created successfully",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a reminder configuration by ID
const updateReminderConfigurationById = async (req, res) => {
  const id = req.params.id;
  const { patient_id, anticipation_time, is_active } = req.body;

  // Validate request body
  if (patient_id === undefined && anticipation_time === undefined && is_active === undefined) {
    return res.status(400).json({ error: "At least one field is required to update" });
  }

  let sql = "UPDATE reminder_configurations SET ";
  const values = [];

  if (patient_id !== undefined) {
    sql += "patient_id = ?, ";
    values.push(patient_id);
  }
  if (anticipation_time !== undefined) {
    sql += "anticipation_time = ?, ";
    values.push(anticipation_time);
  }
  if (is_active !== undefined) {
    sql += "is_active = ?, ";
    values.push(is_active);
  }

  // Remove the last comma and space from the SQL query
  sql = sql.slice(0, -2);

  sql += " WHERE id = ?";
  values.push(id);

  try {
    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reminder configuration not found" });
    }
    res.json({ message: "Reminder configuration updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a reminder configuration by ID
const deleteReminderConfigurationById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query("DELETE FROM reminder_configurations WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reminder configuration not found" });
    }
    res.json({ message: "Reminder configuration deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getReminderConfigurations,
  getReminderConfigurationById,
  createReminderConfiguration,
  updateReminderConfigurationById,
  deleteReminderConfigurationById,
};
