# Task Manager - Full Stack Web Application

A responsive Task Management web application with **JWT Authentication**, built with **Node.js**, **Express**, **MongoDB**, and vanilla **HTML/CSS/JavaScript**.

---

## Tech Stack

| Layer          | Technology                            |
| -------------- | ------------------------------------- |
| Frontend       | HTML5, CSS3, JavaScript (Vanilla)     |
| Backend        | Node.js, Express.js                   |
| Database       | MongoDB (via Mongoose ODM)            |
| Authentication | JSON Web Tokens (JWT) + bcrypt        |
| Deployment     | Ready for Heroku / Render / Railway   |

---

## Features

- **JWT Authentication** – Register & Login with hashed passwords (bcrypt)
- **Protected Routes** – Only authenticated users can access tasks
- **User Scoped Tasks** – Each user sees only their own tasks
- **Full CRUD** – Create, Read, Update, and Delete tasks
- **Task Fields** – Title, Description, Status, Due Date
- **Due Dates** – Set deadlines with visual overdue highlighting
- **Filter by Status** – Dropdown filter (All / Pending / In Progress / Completed)
- **Search** – Real-time search by task name
- **Edit Page** – Dedicated page for editing a task's details
- **Responsive UI** – Works on desktop and mobile screens
- **Error Handling** – Custom error middleware with proper HTTP status codes
- **Timestamps** – Automatic `createdAt` / `updatedAt` on every task

---

## Project Structure

```
├── app.js                  # Express app entry point
├── package.json
├── .env                    # Environment variables
├── controllers/
│   ├── auth.js             # Register & Login logic
│   └── tasks.js            # CRUD + filters (user-scoped)
├── db/
│   └── connect.js          # MongoDB connection
├── errors/
│   └── custom-error.js     # Custom error class
├── middleware/
│   ├── auth.js             # JWT verification middleware
│   ├── async.js            # Async wrapper (try/catch helper)
│   ├── error-handler.js    # Global error handler
│   └── not-found.js        # 404 middleware
├── models/
│   ├── User.js             # User schema (name, email, password)
│   └── Task.js             # Task schema (+ dueDate, createdBy)
├── public/                 # Static frontend files
│   ├── login.html          # Login / Register page
│   ├── auth.js             # Auth frontend logic
│   ├── index.html          # Main task list page
│   ├── task.html           # Edit task page
│   ├── browser-app.js      # Frontend JS (list page)
│   ├── edit-task.js         # Frontend JS (edit page)
│   ├── main.css            # Main styles
│   └── normalize.css       # CSS reset
└── routes/
    ├── auth.js             # Auth routes (/api/auth/*)
    └── tasks.js            # Task routes (/api/v1/tasks/*)
```

---

## Authentication Flow

1. User visits `http://localhost:5000` → redirected to `/login.html` if not logged in
2. User **registers** (name + email + password) or **logs in** (email + password)
3. Server returns a **JWT token** → stored in `localStorage`
4. All subsequent API requests include `Authorization: Bearer <token>` header
5. Server verifies the JWT on every protected route
6. **Logout** clears `localStorage` and redirects to login page
7. If token expires or is invalid → automatic redirect to login

---

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier works)

### 1. Clone the repository

```bash
git clone <repo-url>
cd 03-task-manager/final
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/task-manager?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your-secret-key-here
JWT_LIFETIME=30d
```

### 4. Start the server

```bash
npm start
```

### 5. Open in browser

Navigate to `http://localhost:5000`

---

## API Endpoints

### Auth Routes (public)

| Method | Endpoint             | Description          | Body                               |
| ------ | -------------------- | -------------------- | ---------------------------------- |
| `POST` | `/api/auth/register` | Register a new user  | `{ name, email, password }`        |
| `POST` | `/api/auth/login`    | Login existing user  | `{ email, password }`              |

**Response:** `{ user: { name, email }, token }`

### Task Routes (protected – requires `Authorization: Bearer <token>`)

| Method   | Endpoint              | Description                          |
| -------- | --------------------- | ------------------------------------ |
| `GET`    | `/api/v1/tasks`       | Get all tasks for logged-in user     |
| `POST`   | `/api/v1/tasks`       | Create a new task                    |
| `GET`    | `/api/v1/tasks/:id`   | Get a single task by ID              |
| `PATCH`  | `/api/v1/tasks/:id`   | Update a task by ID                  |
| `DELETE` | `/api/v1/tasks/:id`   | Delete a task by ID                  |

### Query Parameters (GET `/api/v1/tasks`)

| Param    | Type   | Description                                    |
| -------- | ------ | ---------------------------------------------- |
| `status` | string | Filter: `pending`, `in-progress`, `completed`  |
| `search` | string | Search tasks by name (case-insensitive)         |
| `sort`   | string | Sort by `dueDate` (ascending)                   |

### Task Schema

```json
{
  "name": "string (required, max 100 chars)",
  "description": "string (optional, max 500 chars)",
  "status": "pending | in-progress | completed",
  "dueDate": "date (optional, null by default)",
  "completed": "boolean",
  "createdBy": "userId (auto-set from JWT)",
  "createdAt": "auto-generated",
  "updatedAt": "auto-generated"
}
```

---

## Sample API Usage

**Register:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com", "password": "secret123"}'
```

**Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "secret123"}'
```

**Create a task (authenticated):**

```bash
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"name": "Buy groceries", "description": "Milk, eggs", "status": "pending", "dueDate": "2026-02-15"}'
```

**Get tasks filtered by status:**

```
GET /api/v1/tasks?status=pending
```

**Search tasks:**

```
GET /api/v1/tasks?search=groceries
```

---

## License

ISC
