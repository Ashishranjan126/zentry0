#!/bin/bash

echo "🔍 Zentry Setup Verification Script"
echo "===================================="
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js not installed"
    exit 1
fi
echo "✓ Node.js version: $(node --version)"
echo ""

# Check npm
echo "✓ Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "✗ npm not installed"
    exit 1
fi
echo "✓ npm version: $(npm --version)"
echo ""

# Check MongoDB
echo "✓ Checking MongoDB..."
if ! command -v mongo &> /dev/null; then
    echo "⚠ MongoDB CLI not found (but MongoDB might still be running)"
else
    echo "✓ MongoDB is installed"
fi
echo ""

# Check backend dependencies
echo "✓ Checking backend dependencies..."
if [ ! -d "backend/node_modules" ]; then
    echo "⚠ Backend node_modules not found. Run: cd backend && npm install"
else
    echo "✓ Backend dependencies installed"
fi
echo ""

# Check .env file
echo "✓ Checking backend .env file..."
if [ ! -f "backend/.env" ]; then
    echo "⚠ backend/.env not found"
else
    echo "✓ backend/.env exists"
    echo "  Content:"
    sed 's/JWT_SECRET=.*/JWT_SECRET=***/' backend/.env | sed 's/^/    /'
fi
echo ""

# Check key files
echo "✓ Checking essential backend files..."
files=(
    "backend/server.js"
    "backend/config/db.js"
    "backend/models/User.js"
    "backend/controllers/authController.js"
    "backend/routes/auth.js"
    "backend/middleware/auth.js"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file missing"
    fi
done
echo ""

# Check frontend files
echo "✓ Checking essential frontend files..."
frontend_files=(
    "src/utils/authAPI.js"
    "src/components/Auth.jsx"
    "src/components/Navbar.jsx"
)

for file in "${frontend_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file missing"
    fi
done
echo ""

echo "===================================="
echo "✨ Setup Verification Complete!"
echo ""
echo "Next steps:"
echo "1. Make sure MongoDB is running: brew services start mongodb-community"
echo "2. Start backend: cd backend && npm run dev"
echo "3. In another terminal, start frontend: npm run dev"
echo "4. Visit http://localhost:5173 and test the sign up/sign in"
