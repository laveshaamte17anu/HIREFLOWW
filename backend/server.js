if (process.env.NODE_ENV !== 'production') {
  try {
    const dns = require('dns');
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (err) {
    // Ignore DNS override errors in restricted environments
  }
}

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

/*
|--------------------------------------------------------------------------
| CORS Configuration
|--------------------------------------------------------------------------
*/

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://hirefloww-portal.netlify.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // (Postman, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      const sanitizedOrigin = origin.replace(/\/$/, '');

      if (allowedOrigins.includes(sanitizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },

    credentials: true,
  })
);

/*
|--------------------------------------------------------------------------
| Body Parsers
|--------------------------------------------------------------------------
*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
|--------------------------------------------------------------------------
| Static Files
|--------------------------------------------------------------------------
*/

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/jobs', require('./routes/jobRoutes'));

app.use('/api/applications', require('./routes/applicationRoutes'));

app.use('/api/users', require('./routes/userRoutes'));

app.use('/api/saved-jobs', require('./routes/savedJobRoutes'));

app.use('/api/notifications', require('./routes/notificationRoutes'));

app.use('/api/interviews', require('./routes/interviewRoutes'));

app.use('/api/analytics', require('./routes/analyticsRoutes'));

app.use('/api/candidate-leads', require('./routes/candidateLeadRoutes'));

app.use('/api/employer-requests', require('./routes/employerRequestRoutes'));

app.use('/api/consultancy-bookings', require('./routes/consultancyBookingRoutes'));

/*
|--------------------------------------------------------------------------
| Health Check & Browser DB Data Inspector
|--------------------------------------------------------------------------
*/

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'HireFlow API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/db-view', async (req, res) => {
  try {
    const User = require('./models/User');
    const Job = require('./models/Job');
    const Application = require('./models/Application');
    const Interview = require('./models/Interview');
    const Notification = require('./models/Notification');

    const [users, jobs, applications, interviews, notifications] = await Promise.all([
      User.find().select('-password'),
      Job.find().populate('createdBy', 'name email'),
      Application.find().populate('jobId', 'title companyName').populate('candidateId', 'name email'),
      Interview.find(),
      Notification.find().sort({ createdAt: -1 }).limit(20),
    ]);

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      counts: {
        users: users.length,
        jobs: jobs.length,
        applications: applications.length,
        interviews: interviews.length,
        notifications: notifications.length,
      },
      data: {
        users,
        jobs,
        applications,
        interviews,
        notifications,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/*
|--------------------------------------------------------------------------
| Error Handling
|--------------------------------------------------------------------------
*/

app.use(notFound);
app.use(errorHandler);

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});