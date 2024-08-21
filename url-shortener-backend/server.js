// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const linkRoutes = require('./routes/links');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/links', linkRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
