# 📚 Live Attendance System

A real-time attendance management system built with Node.js, Express, Socket.IO, and MongoDB. This system enables teachers to manage classes, mark attendance in real-time, and allows students to check their attendance status instantly.

## ✨ Features

- **User Authentication**: Secure JWT-based authentication for teachers and students
- **Class Management**: Teachers can create classes and enroll students
- **Real-time Attendance**: Live attendance marking using WebSocket (Socket.IO)
- **Role-based Access Control**: Separate permissions for teachers and students
- **Attendance Tracking**: Persistent storage of attendance records in MongoDB
- **Real-time Updates**: Instant notifications when attendance is marked or updated
- **Session Management**: In-memory session handling for active attendance sessions
- **RESTful API**: Well-structured REST endpoints for all operations

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose
- **Real-time Communication**: Socket.IO 4.8.3
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Development**: nodemon

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com-personal:shivdevop/Live-Attendance-System.git
   cd Live-Attendance-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   port=3000
   MONGO_URI=mongodb://localhost:27017
   DB_NAME=attendance_db
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   ```

   **Important**: Replace `your_super_secret_jwt_key_here` with a strong, random secret key for production.

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using MongoDB Atlas, update `MONGO_URI` in `.env`.

5. **Run the application**
   
   For development:
   ```bash
   npm run dev
   ```
   
   For production:
   ```bash
   npm start
   ```

6. **Verify the server is running**
   
   The server should start on `http://localhost:3000` (or your configured port). You can test the health endpoint:
   ```bash
   curl http://localhost:3000/health
   ```

## 📁 Project Structure

```
Live-Attendance-System/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── server.js              # Server entry point with Socket.IO initialization
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── env.js             # Environment variables
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication logic
│   │   ├── class.controller.js   # Class management logic
│   │   └── student.controller.js  # Student operations
│   ├── middlewares/
│   │   ├── auth.middleware.js     # JWT authentication
│   │   ├── role.middleware.js     # Role-based access control
│   │   └── validate.middleware.js # Request validation
│   ├── models/
│   │   ├── User.js            # User model (teacher/student)
│   │   ├── Class.js           # Class model
│   │   └── Attendance.js      # Attendance records model
│   ├── routes/
│   │   ├── auth.routes.js     # Authentication routes
│   │   ├── class.routes.js    # Class management routes
│   │   └── student.routes.js   # Student routes
│   ├── socket/
│   │   ├── index.js           # Socket.IO event handlers
│   │   └── session.js         # Session management
│   ├── utils/
│   │   ├── jwt.js             # JWT token generation
│   │   └── response.js        # Response helpers
│   ├── validators/
│   │   ├── auth.schema.js     # Auth validation schemas
│   │   ├── class.schema.js    # Class validation schemas
│   │   └── attendance.schema.js # Attendance validation
│   └── test_events/
│       ├── teacherClient.js   # Teacher socket test client
│       └── studentClient.js   # Student socket test client
├── package.json
└── README.md
```

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication

All protected routes require a JWT token in the `Authorization` header:
```
Authorization: <your_jwt_token>
```

### Endpoints

#### Health Check
- **GET** `/health`
  - Check server status
  - **Response**: `{ status: "ok" }`

#### Authentication Routes (`/api/v1/auth`)

1. **Sign Up**
   - **POST** `/api/v1/auth/signup`
   - **Body**:
     ```json
     {
       "name": "John Doe",
       "email": "john@example.com",
       "password": "password123",
       "role": "teacher" // or "student"
     }
     ```
   - **Response**: User object (without password)

2. **Login**
   - **POST** `/api/v1/auth/login`
   - **Body**:
     ```json
     {
       "email": "john@example.com",
       "password": "password123"
     }
     ```
   - **Response**:
     ```json
     {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
     ```

3. **Get Role**
   - **GET** `/api/v1/auth/get-role`
   - **Headers**: `Authorization: <token>`
   - **Response**:
     ```json
     {
       "role": "teacher"
     }
     ```

#### Class Routes (`/api/v1/class`)

1. **Create Class** (Teacher only)
   - **POST** `/api/v1/class/create`
   - **Headers**: `Authorization: <teacher_token>`
   - **Body**:
     ```json
     {
       "className": "Mathematics 101"
     }
     ```
   - **Response**: Created class object

2. **Add Student to Class** (Teacher only)
   - **POST** `/api/v1/class/:classId/add-student`
   - **Headers**: `Authorization: <teacher_token>`
   - **Body**:
     ```json
     {
       "studentId": "6946af243b38eae832537e14"
     }
     ```
   - **Response**: Updated class object

3. **Get Class Details**
   - **GET** `/api/v1/class/:classId`
   - **Headers**: `Authorization: <token>`
   - **Response**: Class details with enrolled students
   - **Note**: Only accessible by class teacher or enrolled students

4. **Start Attendance** (Teacher only)
   - **POST** `/api/v1/class/start-attendance`
   - **Headers**: `Authorization: <teacher_token>`
   - **Body**:
     ```json
     {
       "classId": "6946af243b38eae832537e14"
     }
     ```
   - **Response**: `"attendance started successfully"`
   - **Note**: Must be called before using socket events

#### Student Routes (`/api/v1/student`)

1. **Get All Students** (Teacher only)
   - **GET** `/api/v1/student/all`
   - **Headers**: `Authorization: <teacher_token>`
   - **Response**: Array of student objects (name and email only)

## 🔌 Socket.IO Events

### Connection

Connect to the Socket.IO server with authentication:

```javascript
import { io } from "socket.io-client"

const socket = io("http://localhost:3000", {
  auth: {
    token: "your_jwt_token_here"
  }
})
```

### Client → Server Events

#### 1. `ATTENDANCE_MARKED` (Teacher only)
Mark attendance for a student.

**Payload**:
```json
{
  "studentId": "6946af243b38eae832537e14",
  "status": "present" // or "absent"
}
```

**Example**:
```javascript
socket.emit("ATTENDANCE_MARKED", {
  studentId: "6946af243b38eae832537e14",
  status: "present"
})
```

#### 2. `MY_ATTENDANCE` (Student only)
Get the current attendance status for the connected student.

**Payload**: None

**Example**:
```javascript
socket.emit("MY_ATTENDANCE")
```

#### 3. `TODAY_SUMMARY` (Teacher only)
Get today's attendance summary for the active session.

**Payload**: None

**Example**:
```javascript
socket.emit("TODAY_SUMMARY")
```

#### 4. `END_ATTENDANCE` (Teacher only)
End the attendance session and save records to database.

**Payload**: None

**Example**:
```javascript
socket.emit("END_ATTENDANCE")
```

### Server → Client Events

#### 1. `ATTENDANCE_MARKED`
Broadcasted when attendance is marked (received by all connected clients).

**Payload**:
```json
{
  "studentId": "6946af243b38eae832537e14",
  "status": "present"
}
```

#### 2. `MY_ATTENDANCE`
Response to `MY_ATTENDANCE` event.

**Payload**:
```json
{
  "studentId": "6946af243b38eae832537e14",
  "attendance": "present" // or "absent" or "not marked"
}
```

#### 3. `TODAY_SUMMARY`
Response to `TODAY_SUMMARY` event (broadcasted to all).

**Payload**:
```json
{
  "date": "2024-01-15",
  "totalStudents": 25,
  "present": 20,
  "absent": 5
}
```

#### 4. `END_ATTENDANCE`
Broadcasted when attendance session ends.

**Payload**:
```json
{
  "message": "attendance ended successfully",
  "studentsPresent": 20,
  "studentsAbsent": 5
}
```

#### 5. `ERROR`
Error response for any invalid operation.

**Payload**:
```json
{
  "message": "error description"
}
```

### Connection Events

```javascript
socket.on("connect", () => {
  console.log("Connected:", socket.id)
})

socket.on("disconnect", () => {
  console.log("Disconnected")
})

socket.on("connect_error", (error) => {
  console.error("Connection error:", error.message)
})
```

## 💡 Usage Examples

### Complete Workflow

1. **Create a teacher account**
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Dr. Smith",
       "email": "smith@example.com",
       "password": "password123",
       "role": "teacher"
     }'
   ```

2. **Login as teacher**
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "smith@example.com",
       "password": "password123"
     }'
   ```
   Save the returned token.

3. **Create a class**
   ```bash
   curl -X POST http://localhost:3000/api/v1/class/create \
     -H "Content-Type: application/json" \
     -H "Authorization: <teacher_token>" \
     -d '{
       "className": "Mathematics 101"
     }'
   ```
   Save the class ID.

4. **Create student accounts** (repeat for each student)
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "name": "John Doe",
       "email": "john@example.com",
       "password": "password123",
       "role": "student"
     }'
   ```

5. **Get all students** (to get student IDs)
   ```bash
   curl -X GET http://localhost:3000/api/v1/student/all \
     -H "Authorization: <teacher_token>"
   ```

6. **Add students to class**
   ```bash
   curl -X POST http://localhost:3000/api/v1/class/<classId>/add-student \
     -H "Content-Type: application/json" \
     -H "Authorization: <teacher_token>" \
     -d '{
       "studentId": "<student_id>"
     }'
   ```

7. **Start attendance session**
   ```bash
   curl -X POST http://localhost:3000/api/v1/class/start-attendance \
     -H "Content-Type: application/json" \
     -H "Authorization: <teacher_token>" \
     -d '{
       "classId": "<class_id>"
     }'
   ```

8. **Connect via Socket.IO and mark attendance**
   ```javascript
   import { io } from "socket.io-client"
   
   const socket = io("http://localhost:3000", {
     auth: { token: "<teacher_token>" }
   })
   
   socket.on("connect", () => {
     socket.emit("ATTENDANCE_MARKED", {
       studentId: "<student_id>",
       status: "present"
     })
   })
   ```

##  Testing

### Test Socket Events

The project includes test clients in `src/test_events/`:

1. **Teacher Client**
   ```bash
   node src/test_events/teacherClient.js
   ```

2. **Student Client**
   ```bash
   node src/test_events/studentClient.js
   ```

**Note**: Update the JWT tokens in these files before running.

### Manual Testing

1. Use Postman or Thunder Client for REST API testing
2. Use the HTML test client (create one based on the example in the Socket.IO section)
3. Use the provided Node.js test clients for Socket.IO events

## 🔒 Security Considerations

- **JWT Secret**: Use a strong, random secret key in production
- **Password Hashing**: Passwords are hashed using bcrypt (10 rounds)
- **CORS**: Currently set to `"*"` - restrict in production
- **Environment Variables**: Never commit `.env` file to version control
- **Token Expiration**: Configure appropriate JWT expiration time
- **Input Validation**: All inputs are validated using Zod schemas

##  Error Handling

The API uses a consistent error response format:

```json
{
  "success": false,
  "message": "error message"
}
```

Common error scenarios:
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Insufficient permissions (wrong role)
- **400 Bad Request**: Invalid input data
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `port` | Server port | `3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `DB_NAME` | Database name | `attendance_db` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key` |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |

## 🚀 Deployment

### Production Checklist

- [ ] Set strong `JWT_SECRET` in environment variables
- [ ] Configure proper CORS origins
- [ ] Use MongoDB Atlas or secure MongoDB instance
- [ ] Enable HTTPS
- [ ] Set up process manager (PM2, systemd)
- [ ] Configure logging
- [ ] Set up monitoring and error tracking
- [ ] Review and update security headers
- [ ] Set appropriate JWT expiration times
- [ ] Backup database regularly


##  Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



## 👥 Author

**Shivdevop**

- GitHub: [@shivdevop](https://github.com/shivdevop)

## 🙏 Acknowledgments

- Express.js community
- Socket.IO documentation
- MongoDB and Mongoose teams

## 📞 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

