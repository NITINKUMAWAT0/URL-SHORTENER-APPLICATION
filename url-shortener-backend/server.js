const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const linkRoutes = require('./routes/links'); // Import your existing links routes
const authRoutes = require('./routes/auth'); // Correct import

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/links', linkRoutes); // Link routes
app.use('/api/auth', authRoutes.router); // Use the correct destructured `router` from `authRoutes`

// Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
