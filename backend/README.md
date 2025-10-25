# Student Dashboard Backend API

A RESTful API built with Express.js and MongoDB for managing student quizzes and announcements.

## 🚀 Features

- **Authentication**: JWT-based authentication with secure password hashing
- **User Management**: Role-based access control (Student, Teacher, Admin)
- **Quiz Management**: Full CRUD operations for quizzes with questions
- **Announcement Management**: Full CRUD operations for course announcements
- **Security**: Helmet, CORS, input validation
 
 

## 📁 Project Structure

 
### Prerequisites
- Node.js  
- MongoDB (local or Atlas)

### Steps

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment**:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-dashboard
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5001
```

3. **Run in development**:
 
npm run dev
 

 
 

##   API Endpoints ##

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login user
-`POST /api/v1/auth/googleLogin` – Login or register with Google OAuth
-`POST /api/v1/auth/forgotPassword` – Send password reset code via email
-`POST /api/v1/auth/verifyResetCode` – Verify reset code
-`POST /api/v1/auth/resetPassword`– Reset password using verified code

### Quizzes
- `GET /api/v1/quizzes` - Get all quizzes (Protected)
- `GET /api/v1/quizzes/:id` - Get single quiz (Protected)
- `POST /api/v1/quizzes` - Create quiz (Teacher/Admin)
- `PUT /api/v1/quizzes/:id` - Update quiz (Teacher/Admin)
- `DELETE /api/v1/quizzes/:id` - Delete quiz (Teacher/Admin)

### Announcements
- `GET /api/v1/announcements` - Get all announcements (Protected)
- `GET /api/v1/announcements/:id` - Get single announcement (Protected)
- `POST /api/v1/announcements` - Create announcement (Teacher/Admin)
- `PUT /api/v1/announcements/:id` - Update announcement (Teacher/Admin)
- `DELETE /api/v1/announcements/:id` - Delete announcement (Teacher/Admin)

 

##  Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based authorization
- Input validation
- Helmet security headers
- CORS configuration
- MongoDB injection protection

 

  # code include 
- All controllers, models, routes, and middleware
- Authentication and authorization logic
- Error handling
- Database configuration
- Test suites

 

### Core
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing

 
### Testing
 test with postman for each api created 
 by import this file **Student Dashboard API.postman_collection.json**
 in this file test for main basic operation used in project 

