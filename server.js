// server.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
const teamRoutes = require('./src/routes/team_route');
const subjectRoute = require('./src/routes/subject_route');
const taskRoutes = require('./src/routes/task_route');
const path = require('path');
const loginRoutes = require("./src/routes/login_route");
const signupRoutes = require("./src/routes/signup_route");
const invitationRoutes = require("./src/routes/invitation_route");
// const { log } = require('console');
const userProfileRoutes = require("./src/routes/user_profile_route");

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
app.use("/api/login", loginRoutes);
app.use("/api/signup", signupRoutes);
app.use("/api/user-profile", userProfileRoutes);

// Serve static files from "public"
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/team', teamRoutes);
app.use('/api/subject', subjectRoute);
app.use('/api/task', taskRoutes)

// //Email invention
app.use("/api/invitation", invitationRoutes);
// app.post("/api/sendInvitation", async (req, res) => {
//   console.log("📩 API /api/sendInvitation được gọi");
//   console.log("📧 Email nhận:", req.body);
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ error: "Email is required" });

//   const inviteLink = `https://localhost/join?email=${encodeURIComponent(email)}`;
//   console.log('invenLink: '+inviteLink);

//   try {
//       await sendInvitationEmail(email, `http://localhost:5500/src/views/login.html`);
//       res.json({ message: "Invitation sent successfully" });
//   } catch (error) {
//       res.status(500).json({ error: "Failed to send invitation" });
//   }
// });


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
