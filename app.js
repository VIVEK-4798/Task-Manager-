const express = require('express');
const app = express();
const tasks = require('./routes/tasks');
const authRoutes = require('./routes/auth');
const connectDB = require('./db/connect');
require('dotenv').config();
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authMiddleware = require('./middleware/auth');

// middleware

app.use(express.json());

// Initialize database connection on startup
if (process.env.MONGO_URI) {
  connectDB(process.env.MONGO_URI).catch(err => {
    console.error('Initial DB connection failed:', err);
  });
} else {
  console.error('MONGO_URI not found in environment variables');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongoUri: process.env.MONGO_URI ? 'configured' : 'missing',
    jwtSecret: process.env.JWT_SECRET ? 'configured' : 'missing',
    jwtLifetime: process.env.JWT_LIFETIME || 'using default',
    nodeEnv: process.env.NODE_ENV || 'not set'
  });
});

// routes

app.use('/api/auth', authRoutes);
app.use('/api/v1/tasks', authMiddleware, tasks);

// Static files and root redirect
app.use(express.static('./public'));
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

app.use(notFound);
app.use(errorHandlerMiddleware);

// Export for Vercel serverless
module.exports = app;

// Local development server
if (require.main === module) {
  const port = process.env.PORT || 5000;
  const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI);
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  start();
}