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

// Connect to database
connectDB(process.env.MONGO_URI);

// Export for Vercel serverless
module.exports = app;

// Local development server
if (require.main === module) {
  const port = process.env.PORT || 5000;
  app.listen(port, () =>
    console.log(`Server is listening on port ${port}...`)
  );
}