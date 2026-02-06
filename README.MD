# Task Manager

A full-stack task management app with JWT authentication where users can create, organize, and track their personal tasks with due dates and status updates.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + bcrypt

## Features

- User registration and login with secure password hashing
- Personal task lists (users only see their own tasks)
- Create, read, update, and delete tasks
- Add task descriptions, due dates, and status tracking
- Filter tasks by status (Pending, In Progress, Completed)
- Real-time search functionality
- Visual indicators for overdue tasks
- Clean, responsive UI

## Quick Start

**Prerequisites:** Node.js (v14+) and a MongoDB Atlas account

1. Clone and install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
JWT_LIFETIME=30d
```

3. Start the server:
```bash
npm start
```

4. Open `http://localhost:5000` in your browser

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login and receive JWT token

### Tasks (Protected)
- `GET /api/v1/tasks` - Get all user tasks
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/:id` - Get specific task
- `PATCH /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

**Query params:** `status`, `search`, `sort=dueDate`

## How It Works

Users must log in to access their tasks. The JWT token is stored in localStorage and sent with every request. Each user's data is completely isolated—you only see and manage your own tasks.

## Project Structure

```
├── app.js              # Main application
├── controllers/        # Business logic
├── models/            # Database schemas
├── routes/            # API routes
├── middleware/        # Auth & error handlers
├── db/                # Database connection
└── public/            # Frontend files
```

## License

ISC