# Zentry Backend Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)
- npm or yarn

## Installation Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
Create a `.env` file in the backend directory with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/zentry
JWT_SECRET=your_super_secret_jwt_key_change_in_production
PORT=5000
NODE_ENV=development
```

**Important:** Replace `MONGODB_URI` with your MongoDB connection string:
- **Local MongoDB**: `mongodb://localhost:27017/zentry`
- **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/zentry`

### 3. Start MongoDB (if running locally)
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or manually
mongod
```

### 4. Run the Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server should start on `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### Sign Up
- **Endpoint**: `POST /api/auth/signup`
- **Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "confirmPassword": "securepassword123"
}
```
- **Response**: Returns JWT token and user data

#### Sign In
- **Endpoint**: `POST /api/auth/signin`
- **Body**:
```json
{
  "username": "john_doe",
  "password": "securepassword123"
}
```
- **Response**: Returns JWT token and user data

#### Get Current User (Protected)
- **Endpoint**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Returns current user data

#### Health Check
- **Endpoint**: `GET /api/health`
- **Response**: `{ "success": true, "message": "Server is running" }`

## Frontend Configuration

The frontend is already configured to connect to the backend at `http://localhost:5000`. The authentication API calls are handled in `src/utils/authAPI.js`.

### Features Implemented:
- User Registration (Sign Up)
- User Login (Sign In)
- JWT Token-based Authentication
- Password hashing with bcryptjs
- MongoDB user data persistence
- Error handling and validation

## Database Schema

### User Model
```
{
  username: String (required, unique),
  email: String (required if provided, unique),
  password: String (hashed, required),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Notes

1. **JWT Secret**: Change `JWT_SECRET` in production to a strong, random key
2. **CORS**: Configured to accept requests from localhost:5173 (Vite dev server)
3. **Password Hashing**: All passwords are hashed using bcryptjs before storage
4. **Token Expiry**: JWT tokens expire in 7 days

## Troubleshooting

### Connection Refused Error
- Make sure MongoDB is running
- Check your `MONGODB_URI` is correct
- Verify MongoDB port (default: 27017)

### CORS Errors
- Ensure backend is running on port 5000
- Check frontend is running on localhost:5173 (Vite default)

### Token Errors
- Ensure JWT_SECRET is consistent across server restarts
- Token expires in 7 days, users need to sign in again after

## Next Steps

1. Deploy MongoDB (MongoDB Atlas recommended)
2. Update `.env` with production values
3. Deploy backend to a hosting service (Vercel, Render, Heroku, etc.)
4. Update `API_BASE_URL` in `src/utils/authAPI.js` to production URL
5. Implement password reset functionality
6. Add email verification
7. Implement refresh token mechanism
