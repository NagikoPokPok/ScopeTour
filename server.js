// server.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
const teamRoutes = require('./src/routes/team_route');
const subjectRoute = require('./src/routes/subject_route');
const path = require('path');
const registerRoutes = require('./src/routes/register_route');
const profileRoutes = require('./src/routes/profile_route');

const app = express();
const PORT = 3000; // Your Express server port

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Update your CORS configuration in server.js
app.use(cors({
  origin: '*',  // This allows access from any origin - we'll add security later
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Routes
app.use('/profile', profileRoutes);
registerRoutes(app);

// Serve static files from "public"
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/team', teamRoutes);
app.use('/api/subject', subjectRoute);

// Test route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Sync Database & Start Server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
    
    // Listen on all interfaces
    app.listen(PORT, () => {
      console.log(`Server is running on http://<your-public-ip>:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
