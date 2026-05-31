# 🎯 Quick Start - Run Both Frontend & Backend

## What You Need to Do

Your application requires **2 terminal windows** running simultaneously:

### Terminal 1: Backend Server ✅ (Already Running)
```bash
Port: 5000
Status: ✓ Running
MongoDB: ✓ Connected
```

### Terminal 2: Frontend Server (Start Now)
```bash
cd /Users/manishaditiyagupta/Desktop/zentry/zentry0
npm run dev
```
This will start on `http://localhost:5173`

---

## Complete Workflow

### Step 1: Open a New Terminal Window
1. In VS Code, click **Terminal → New Terminal** (or press `Ctrl + Shift + ~`)
2. You should now have 2 terminals

### Step 2: Start Frontend in New Terminal
```bash
cd /Users/manishaditiyagupta/Desktop/zentry/zentry0
npm run dev
```

### Step 3: Open the Application
- Open browser and go to: `http://localhost:5173`
- You should see the Zentry website

### Step 4: Test Sign Up
1. Click the **"Sign In"** button in the navbar
2. Page scrolls to the Auth section
3. Click **"Sign Up"** link (if not already on sign up form)
4. Fill in the form:
   - Username: `testuser123`
   - Email: `test@example.com`
   - Password: `Password123`
   - Confirm Password: `Password123`
5. Click **"Sign Up"** button
6. You should see: **"Sign up successful! Welcome to Zentry!"** ✅

### Step 5: Verify Data in MongoDB Compass

1. **Open MongoDB Compass** (install from mongodb.com if needed)
2. Click **"New Connection"**
3. Connect to: `mongodb://localhost:27017`
4. Click **"Connect"**
5. You should see a new database called **`zentry`**
6. Click to expand it and navigate to:
   - `zentry` → `users` collection
7. You should see your signup data with:
   ```json
   {
     "_id": ObjectId(...),
     "username": "testuser123",
     "email": "test@example.com",
     "password": "hashedpasswordhere...",
     "isActive": true,
     "createdAt": "2026-05-31...",
     "updatedAt": "2026-05-31..."
   }
   ```

### Step 6: Test Sign In
1. Go back to the auth form
2. Click **"Sign In"** (toggle mode)
3. Enter your credentials:
   - Username: `testuser123`
   - Password: `Password123`
4. Click **"Sign In"**
5. You should see: **"Sign in successful! Welcome back!"** ✅

---

## Terminal Commands Reference

### Terminal 1 (Backend - Already Running)
```bash
cd backend
npm run dev
# Output shows: "Server running on port 5000"
#              "MongoDB connected: localhost"
```

### Terminal 2 (Frontend - Start Now)
```bash
cd /Users/manishaditiyagupta/Desktop/zentry/zentry0
npm run dev
# Output shows: "VITE v5.x.x  ready in xxx ms"
#              "➜  Local:   http://localhost:5173/"
```

---

## Verify Everything is Working

### ✅ Checklist:
- [ ] MongoDB running (`brew services list` shows started)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Both terminals showing no errors
- [ ] Can access `http://localhost:5173` in browser
- [ ] Sign up works with success message
- [ ] Data appears in MongoDB Compass
- [ ] Sign in works with same credentials

---

## Troubleshooting

### Frontend shows "API Error" or "Cannot connect"
- Make sure backend terminal is running
- Check backend shows: "Server running on port 5000"
- Check MongoDB shows: "MongoDB connected: localhost"

### MongoDB Compass won't connect
- Ensure MongoDB is running: `brew services start mongodb-community`
- Connection string: `mongodb://localhost:27017`

### Port 5000 already in use
```bash
lsof -i :5000 | grep -v COMMAND | awk '{print $2}' | xargs kill -9
```

### Port 5173 already in use
```bash
lsof -i :5173 | grep -v COMMAND | awk '{print $2}' | xargs kill -9
```

---

## Your Current Setup

✅ Backend: `http://localhost:5000`
✅ Frontend: `http://localhost:5173` (start now)
✅ MongoDB: `localhost:27017`
✅ Database: `zentry`
✅ Collection: `users`

Start the frontend now and test the flow! 🚀
