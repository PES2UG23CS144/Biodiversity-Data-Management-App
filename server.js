const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));
app.use(express.static('views'));

// Import routes
const dashboardRoutes = require('./routes/dashboardRoutes');
const speciesRoutes = require('./routes/speciesRoutes');
const observationRoutes = require('./routes/observationRoutes');
const locationRoutes = require('./routes/locationRoutes');
const observerRoutes = require('./routes/observerRoutes');
const actionRoutes = require('./routes/actionRoutes');

// Use routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/species', speciesRoutes);
app.use('/api/observations', observationRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/observers', observerRoutes);
app.use('/api/actions', actionRoutes);

// Root route - serve dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
