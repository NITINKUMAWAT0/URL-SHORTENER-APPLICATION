const express = require('express');
const router = express.Router();
const connection = require('../db');

// GET all links
router.get('/', (req, res) => {
  connection.query('SELECT * FROM links', (err, results) => {
    if (err) {
      console.error('Error fetching links:', err);
      return res.status(500).json({ error: 'An error occurred while fetching links' });
    }
    res.json(results);
  });
});

// POST create a new link
router.post('/', (req, res) => {
  const { name, description, alias, destinationUrl, created_at = new Date(), scans = 0, clicks = 0 } = req.body;

  if (!name || !alias || !destinationUrl) {
    return res.status(400).json({ error: 'Name, alias, and destination URL are required' });
  }
  if (typeof name !== 'string' || typeof alias !== 'string' || typeof destinationUrl !== 'string') {
    return res.status(400).json({ error: 'Invalid input types' });
  }

  const checkQuery = 'SELECT * FROM links WHERE alias = ?';
  connection.query(checkQuery, [alias], (err, results) => {
    if (err) {
      console.error('Error checking for duplicate alias:', err);
      return res.status(500).json({ error: 'An error occurred while checking for duplicates' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'This alias is already taken. Please choose a different alias.' });
    }

    const query = 'INSERT INTO links (name, description, alias, destinationUrl, created_at, scans, clicks) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [name, description, alias, destinationUrl, created_at, scans, clicks], (err, results) => {
      if (err) {
        console.error('Error creating link:', err);
        return res.status(500).json({ error: 'An error occurred while creating the link' });
      }
      res.status(201).json({ message: 'Link created successfully!', id: results.insertId });
    });
  });
});

// GET and update click count
router.get('/:alias', (req, res) => {
  const { alias } = req.params;
  const updateQuery = 'UPDATE links SET clicks = clicks + 1 WHERE alias = ?';

  connection.query(updateQuery, [alias], (err) => {
    if (err) {
      console.error('Error updating click count:', err);
      return res.status(500).json({ error: 'An error occurred while updating click count' });
    }
    const findQuery = 'SELECT * FROM links WHERE alias = ?';
    connection.query(findQuery, [alias], (err, result) => {
      if (err) {
        console.error('Error fetching link details:', err);
        return res.status(500).json({ error: 'An error occurred while fetching link details' });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: 'Link not found' });
      }
      const { destinationUrl } = result[0];
      res.status(200).redirect(destinationUrl);
    });
  });
});

// Increment scan count
router.get('/scan/:alias', (req, res) => {
  const { alias } = req.params;
  const query = 'UPDATE links SET scans = scans + 1 WHERE alias = ?';

  connection.query(query, [alias], (err) => {
    if (err) {
      console.error('Error updating scan count:', err);
      return res.status(500).json({ error: 'An error occurred while updating scan count' });
    }
    res.status(200).json({ message: 'Scan count updated successfully' });
  });
});

// DELETE a link
router.delete('/:alias', (req, res) => {
  const { alias } = req.params;
  const query = 'DELETE FROM links WHERE alias = ?';

  connection.query(query, [alias], (err) => {
    if (err) {
      console.error('Error deleting link:', err);
      return res.status(500).json({ error: 'An error occurred while deleting the link' });
    }
    res.status(200).json({ message: 'Link deleted successfully' });
  });
});

// GET a single link by ID
router.get('/id/:id', (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  const query = 'SELECT * FROM links WHERE id = ?';
  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    res.json(results[0]);
  });
});

// UPDATE a link by ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, alias, destinationUrl } = req.body;

  if (!name || !alias || !destinationUrl) {
    return res.status(400).json({ message: 'Name, alias, and destination URL are required' });
  }

  const updateQuery = 'UPDATE links SET name = ?, description = ?, alias = ?, destinationUrl = ? WHERE id = ?';
  connection.query(updateQuery, [name, description, alias, destinationUrl, id], (error, results) => {
    if (error) {
      console.error("Error updating record:", error);
      return res.status(500).json({ message: 'Error updating record' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.status(200).json({ message: 'Record updated successfully' });
  });
});

module.exports = router;
