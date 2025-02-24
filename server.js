// server.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
const teamRoutes = require('./src/routes/team_route');
const path = require('path');
const registerRoutes = require('./src/routes/register_route')

const app = express();
const PORT = 3000; // Linh hoạt PORT cho môi trường

// Middleware
app.use(express.json()); // Thay body-parser bằng built-in middleware
app.use(express.urlencoded({ extended: true })); // Hỗ trợ form-encoded data
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:3000', 'http://localhost'];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


registerRoutes(app);

// Serve static files từ thư mục "public"
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/team', teamRoutes);

// Test route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the server!' }); // Trả về JSON thay vì plain text
});

// Xử lý lỗi 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Xử lý lỗi server
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Sync Database & Start Server
const startServer = async () => {
  try {
    await sequelize.authenticate(); // Kiểm tra kết nối trước khi sync
    console.log('Database connected successfully');
    await sequelize.sync({ alter: true }); // alter: true để cập nhật schema nếu cần
    console.log('Database synced successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1); // Thoát nếu không kết nối được
  }
};

startServer();