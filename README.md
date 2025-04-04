# Task Management RESTful API

A complete task management application with a Node.js RESTful API backend and a simple frontend. This project demonstrates how to build a RESTful API using Node.js, Express, and MongoDB.

## Features

* User authentication (register, login, logout)
* Task management (create, read, update, delete tasks)
* Task filtering and sorting (by status, priority, date)
* RESTful API architecture
* MongoDB database for data storage
* JWT-based authentication
* Clean and responsive UI

## Technologies Used

### Backend

* Node.js
* Express.js
* MongoDB with Mongoose ORM
* JSON Web Tokens (JWT) for authentication
* bcrypt.js for password hashing
* dotenv for environment variable management

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript

## Project Structure

```
task-management-api/
├── src/
│   ├── config/
│   ├── controllers/
│   │   ├── task.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── cors.js
│   │   └── error.js
│   ├── models/
│   │   ├── task.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── task.routes.js
│   │   └── user.routes.js
│   ├── utils/
│   │   └── apiError.js
│   └── server.js
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── index.html
├── .env
├── package.json
└── README.md
```

## API Endpoints

### User Endpoints

* `POST /api/users/register` - Register a new user
* `POST /api/users/login` - Authenticate user
* `POST /api/users/logout` - Logout user
* `GET /api/users/profile` - Get user profile
* `PATCH /api/users/profile` - Update user profile
* `DELETE /api/users` - Delete user account

### Task Endpoints

* `GET /api/tasks` - Get all tasks (with optional filtering and sorting)
* `POST /api/tasks` - Create a new task
* `GET /api/tasks/:id` - Get a specific task
* `PATCH /api/tasks/:id` - Update a task
* `DELETE /api/tasks/:id` - Delete a task

## Installation and Setup

### Prerequisites

* Node.js (v14 or higher)
* MongoDB (local or Atlas URI)

### Steps

1. Clone the repository:
   ```
   git clone <repository-url>
   cd task-management-api
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-manager
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5000`

## Usage

### User Registration and Login

1. Click on the "Register" button and fill out the registration form
2. After successful registration, you will be logged in automatically
3. For future sessions, use the "Login" button with your email and password

### Task Management

1. Create tasks using the "Create New Task" button
2. View all your tasks in the task list
3. Edit tasks by clicking the "Edit" button on a task
4. Delete tasks by clicking the "Delete" button on a task
5. Filter tasks by status or priority using the dropdown menus
6. Sort tasks by creation date or due date using the sort dropdown

## RESTful API Design Principles

This project follows RESTful API design principles:

1. **Resource-Based URLs** : Resources are accessed via URLs that represent nouns (e.g., `/tasks`, `/users`)
2. **HTTP Methods** : Appropriate HTTP methods are used for different operations:

* GET for retrieving resources
* POST for creating resources
* PATCH for updating resources
* DELETE for removing resources

1. **Statelessness** : Each request from client to server contains all information needed to understand and process the request
2. **Status Codes** : Appropriate HTTP status codes are returned:

* 200 OK for successful GET, PUT, PATCH
* 201 Created for successful POST
* 204 No Content for successful DELETE
* 400 Bad Request for invalid input
* 401 Unauthorized for authentication issues
* 404 Not Found for non-existent resources
* 500 Internal Server Error for server issues

1. **JSON Data Format** : Data is exchanged in JSON format

## Security Considerations

* Passwords are hashed using bcrypt before storage
* Authentication is implemented using JSON Web Tokens (JWT)
* Authorization ensures users can only access their own resources
* Input validation prevents malicious data
* CORS policy is implemented to control API access

## License

This project is licensed under the MIT License - see the LICENSE file for details.
