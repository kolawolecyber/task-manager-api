# ⚙️ Task Management API (Backend)

## 📌 Overview

This is a secure and scalable backend API for a Task Management System built with Node.js, Express, and MongoDB.

The system provides authenticated task management with role-based access control and real-time updates using WebSockets. It is designed with clean architecture principles, ensuring maintainability, scalability, and security.

---

## 🚀 Features

* 🔐 JWT Authentication (Register, Login)
* 👥 Role-Based Access Control (RBAC)
* 📋 Full CRUD for Tasks
* 🧑‍🤝‍🧑 Task Assignment to Users
* ⚡ Real-time Updates (Socket.io)
* 🔍 Task Filtering (status, assignee)
* 🛡️ Input Validation
* ❗ Centralized Error Handling
* 📄 RESTful API Design

---

## 🏗️ Tech Stack

* Node.js
* Express.js
* TypeScript
* MongoDB (Mongoose)
* JSON Web Token (JWT)
* Socket.io

---

## 📁 Project Structure

```id="bg4mgb"
src/
 ├── modules/
 │    ├── auth/
 │    ├── task/
 │
 ├── shared/
 │    ├── middlewares/
 │    ├── utils/
 │
 ├── config/
 │    ├── db.ts
 │    ├── socket.ts
 │
 ├── app.ts
 └── server.ts
```

---

## 🔐 Authentication & Authorization

### Authentication

* Uses JWT (JSON Web Tokens)
* Token is issued at login and required for protected routes
* Token is passed via `Authorization: Bearer <token>`

### Authorization (RBAC)

Access rules enforced at service layer:

* ✅ Task Creator → Full control over task
* ✅ Assigned User → Can update task status
* ✅ Admin → Full access

---

## 🔄 Real-Time System

* Integrated using Socket.io
* Emits events:

  * `taskCreated`
  * `taskUpdated`
  * `taskDeleted`
* Ensures frontend stays synchronized without polling

---

## 📡 API Endpoints

### 🔐 Auth

```id="u54yp6"
POST /api/auth/register
POST /api/auth/login
```

### 📋 Tasks

```id="r3gs2x"
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

---

## 🧪 Example Request

### Create Task

```id="8zbt1z"
POST /api/tasks
Authorization: Bearer <token>

{
  "title": "Finish assessment",
  "assignedTo": "userId"
}
```

---

## ⚙️ Setup Instructions

### 1. Clone repository

```id="lq5f2t"
git clone <repo-url>
cd backend
```

### 2. Install dependencies

```id="tqtv7e"
npm install
```

### 3. Configure environment variables

Create `.env` file:

```env id="8brnlt"
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

### 4. Run server

```id="ow0lb0"
npm run dev
```

---

## 🛡️ Security Considerations

* Passwords hashed using bcrypt
* JWT verification for all protected routes
* Input validation before processing requests
* Role-based access control enforced at service layer
* Protection against invalid MongoDB ObjectIDs
* Controlled socket connections

---

## ⚠️ Challenges & Engineering Decisions

### 1. JWT Authentication Consistency

A key challenge was ensuring tokens remain valid across requests and preventing unauthorized access.

**Solution:**

* Centralized authentication middleware
* Strict token validation with error handling
* Consistent token structure including `userId` and `role`

---

### 2. Role-Based Access Control (RBAC)

Defining flexible yet secure permissions for different users.

**Solution:**

* Implemented logic at service layer instead of controller
* Separated concerns between authentication and authorization
* Supported multiple roles (creator, assigned user, admin)

---

### 3. Real-Time Data Synchronization

Keeping frontend in sync without heavy polling.

**Solution:**

* Used Socket.io for event-driven updates
* Emitted only necessary events
* Avoided redundant database queries

---

### 4. Preventing Invalid Database Operations

Handling invalid IDs and malformed inputs.

**Solution:**

* Validated MongoDB ObjectIDs before queries
* Added defensive checks before DB operations

---

### 5. Clean Architecture & Scalability

Avoiding tightly coupled code structure.

**Solution:**

* Separated routes, controllers, and services
* Centralized shared utilities and middleware
* Designed modules to be easily extendable

---

## 🧪 Future Improvements (Within Scope Awareness)

* Refresh token mechanism
* Rate limiting (anti-brute force)
* API documentation (Swagger)
* Unit and integration testing

---

## 👨‍💻 Author

Built as part of a full-stack engineering assessment focusing on secure backend design, real-time systems, and clean architecture principles.
