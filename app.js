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

app.use(express.static('./public'));
app.use(express.json());

// routes

app.use('/api/auth', authRoutes);
app.use('/api/v1/tasks', authMiddleware, tasks);

app.use(notFound);
app.use(errorHandlerMiddleware);
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