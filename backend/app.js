const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const folderRoutes = require('./routes/folderRoutes');

// Initialize dotenv to access environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Enable CORS
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB connected');
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Home route to ensure server is running
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Route middleware for user authentication (register/login)
app.use('/api/auth', authRoutes);

// Route middleware for folder-related operations
app.use('/api/folders', folderRoutes);

// Global error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        success: false,
        message: 'Something went wrong!',
    });
});

// Define the port from environment or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
