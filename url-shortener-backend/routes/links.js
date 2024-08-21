// routes/links.js
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
  const { name, description, alias, destinationUrl, created_at, scans, clicks } = req.body;

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
      return res.status(400).json({ message: 'This Endpoint Already Taken. Change your Endpoint' });
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


// PUT update click count
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


router.get('/scan/:alias', (req, res) => {
  const { alias } = req.params;
  const query = 'UPDATE links SET scans = scans + 1 WHERE alias = ?';
  
  connection.query(query, [alias], (err) => {
    if (err) {
      console.error('Error updating click count:', err);
      return res.status(500).json({ error: 'An error occurred while updating click count' });
    }
    res.status(200).json({ message: 'Click count updated successfully' });
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

//Get a single data
router.get('/id/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
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
  } catch (err) {
    console.error('Error in route handler:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, alias, destinationUrl, created_at } = req.body;

  if (!name || !description || !alias || !destinationUrl || !created_at) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const updateQuery = `
      UPDATE links
      SET name = ?, description = ?, alias = ?, destinationUrl = ?
      WHERE id = ?
    `;
    const values = [name, description, alias, destinationUrl, id];

    connection.query(updateQuery, values, (error, results) => {
      if (error) {
        console.error("Error updating record:", error);
        return res.status(500).json({ message: 'Error updating record' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Record not found' });
      }

      res.status(200).json({ message: 'Record updated successfully' });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: 'Unexpected error occurred' });
  }
});

module.exports = router;
