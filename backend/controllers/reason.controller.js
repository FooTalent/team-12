const pool = require('../config/db');

const getReasons = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM reasons');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getReasonById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('SELECT * FROM reasons WHERE id = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Reason not found' });
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createReason = async (req, res) => {
  const { description } = req.body;

  // Validaciones
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO reasons (description) VALUES (?)',
      [description]
    );
    res.status(201).json({
      message: 'Reason created successfully',
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateReasonById = async (req, res) => {
  const id = req.params.id;
  const { description } = req.body;

  // Validaciones
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE reasons SET description = ? WHERE id = ?',
      [description, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reason not found' });
    }
    res.json({ message: 'Reason updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteReasonById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM reasons WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reason not found' });
    }
    res.json({ message: 'Reason deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getReasons,
  getReasonById,
  createReason,
  updateReasonById,
  deleteReasonById,
};
