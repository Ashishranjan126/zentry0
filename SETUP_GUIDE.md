# Zentry Backend & Frontend Setup Complete! 🚀

## Quick Start Guide

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Start MongoDB
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or check if it's running
brew services list
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables
Update `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/zentry
JWT_SECRET=your_super_secret_key_here
PORT=5000
NODE_ENV=development
```

### Step 4: Start the Backend Server
```bash
cd backend
npm run dev
```
Server should start on: `http://localhost:5000`

### Step 5: Start the Frontend (in another terminal)
```bash
# From the zentry0 directory
npm run dev
```
Frontend should start on: `http://localhost:5173`

## Testing the Authentication Flow

### Test 1: Create a New Account
1. Go to `http://localhost:5173`
2. Click "Sign In" button
3. Scroll to the Auth section
4. Click "Sign Up" link
5. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
6. Click "Sign Up"
7. You should see a success message

### Test 2: Sign In with Created Account
1. Click "Sign In" link in the auth form
2. Fill in:
   - Username: `testuser`
   - Password: `password123`
3. Click "Sign In"
4. You should see a success message

### Test 3: Verify MongoDB Storage
```bash
# In terminal, connect to MongoDB
mongo

# Switch to zentry database
use zentry

# View all users
db.users.find().pretty()
```

## Data Flow

```
Frontend (React)
    ↓
    User fills signup/signin form
    ↓
    Validates on frontend
    ↓
    Calls authAPI.signup() or authAPI.signin()
    ↓
Backend (Express + Node.js)
    ↓
    Receives POST request to /api/auth/signup or /api/auth/signin
    ↓
    Validates input
    ↓
MongoDB (Database)
    ↓
    Checks if username/email exists
    ↓
    For signup: Creates new user with hashed password
    For signin: Validates password and creates JWT
    ↓
    Returns token and user data
    ↓
Frontend (React)
    ↓
    Stores JWT in localStorage
    ↓
    Displays success message
    ↓
    User can now access authenticated features
```

## API Endpoints

### Public Endpoints

**POST /api/auth/signup**
- Body: `{ username, email, password, confirmPassword }`
- Returns: `{ success, token, user }`

**POST /api/auth/signin**
- Body: `{ username, password }`
- Returns: `{ success, token, user }`

**GET /api/health**
- Returns: `{ success, message }`

**GET /api/test**
- Returns: `{ success, message }`

### Protected Endpoints

**GET /api/auth/me**
- Headers: `Authorization: Bearer <token>`
- Returns: `{ success, user }`

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique, optional),
  password: String (hashed),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## File Structure

```
zentry0/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   └── authController.js     # Auth logic (signup, signin)
│   ├── middleware/
│   │   └── auth.js               # JWT verification
│   ├── models/
│   │   └── User.js               # User schema
│   ├── routes/
│   │   └── auth.js               # Auth endpoints
│   ├── server.js                 # Express server
│   ├── package.json
│   ├── .env
│   └── README.md
├── src/
│   ├── components/
│   │   └── Auth.jsx              # Sign up/Sign in UI
│   └── utils/
│       └── authAPI.js            # API calls to backend
└── ...
```

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `brew services list`
- Check connection string in `.env`
- Try local connection: `mongodb://localhost:27017/zentry`

### CORS Errors
- Backend CORS is configured for `localhost:5173`
- Make sure backend is on port 5000
- Check browser console for exact CORS error

### "Username already exists" Error
- Username must be unique in database
- Try a different username
- Or clear MongoDB and start fresh

### Token Errors
- Tokens expire in 7 days
- Users will need to sign in again after expiry
- Check JWT_SECRET is consistent in `.env`

## Security Checklist

- ✅ Passwords hashed with bcryptjs (10 rounds)
- ✅ JWT tokens for authentication
- ✅ CORS properly configured
- ✅ Input validation on both frontend and backend
- ⚠️ Change JWT_SECRET in production
- ⚠️ Use environment variables for sensitive data
- ⚠️ Deploy to production-grade MongoDB

## Next Steps

1. **Email Verification**: Add email confirmation before account activation
2. **Password Reset**: Implement forgot password functionality
3. **Refresh Tokens**: Add refresh token mechanism
4. **Protected Routes**: Redirect unauthorized users
5. **User Profile**: Create user profile update endpoint
6. **Error Logging**: Add logging for debugging
7. **Rate Limiting**: Prevent brute force attacks
8. **Deployment**: Deploy to production (Vercel, Heroku, AWS)

## Support

For issues:
1. Check the browser console (F12)
2. Check the terminal output of backend
3. Verify MongoDB is running
4. Check all environment variables are set
