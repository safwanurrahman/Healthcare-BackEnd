// index.js

const express = require('express');
const app = express();
const dotenv = require('dotenv');

// Load environment variables from .env file (for PORT, DB credentials, etc.)
dotenv.config();

// --- Configuration ---
// Use the port from environment variables, or default to 5000 (Development URL port)
const PORT = process.env.PORT || 5000;
const API_VERSION = '/api/v1'; // Matches the base URL configuration

// --- Middleware ---
// 1. JSON Body Parser: Allows the application to read JSON data sent in requests
app.use(express.json());

// 2. CORS (Optional but highly recommended for React frontend during development)
// You may need to install 'cors': npm install cors
// const cors = require('cors');
// app.use(cors());

// --- Routes ---

// 1. Root route for system check
app.get('/', (req, res) => {
    // This isn't the main API, but a helpful check to see if the server is running.
    res.status(200).send('MediConnect Backend Server is running successfully!');
});

// 2. Placeholder for API routes (e.g., Doctors, Patients, Appointments)
// All subsequent routes will use the /api/v1 prefix.
// Example: require('./routes/doctorRoutes')(app);
// For the MVP, you'll start adding specific routes here (see next step in your plan).
app.get(API_VERSION, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to the MediConnect RESTful API!',
        baseUrl: `http://localhost:${PORT}${API_VERSION}`
    });
});

// --- Server Startup ---

// Listen for connections on the specified port
app.listen(PORT, () => {
    console.log(`✅ MediConnect API Server is running...`);
    console.log(`Development Base URL: http://localhost:${PORT}${API_VERSION}`); //
    console.log('Next step: Configure Sequelize ORM and define models.');
});