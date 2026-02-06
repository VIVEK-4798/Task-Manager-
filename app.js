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

// Database connection middleware for serverless
app.use(async (req, res, next) => {
  try {
    await connectDB(process.env.MONGO_URI);
    next();
  } catch (error) {
    console.error('DB connection failed:', error);
    res.status(500).json({ msg: 'Database connection failed' });
  }
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
}