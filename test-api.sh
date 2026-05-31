#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Zentry Backend API Test${NC}"
echo "===================================="
echo ""

BACKEND_URL="http://localhost:5000"

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
response=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/api/health")
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$status_code" = "200" ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
    echo "Response: $body"
else
    echo -e "${RED}✗ Health check failed (Status: $status_code)${NC}"
    echo "Make sure backend is running on port 5000"
fi
echo ""

# Test 2: Test Endpoint
echo -e "${YELLOW}Test 2: Test Endpoint${NC}"
response=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/api/test")
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$status_code" = "200" ]; then
    echo -e "${GREEN}✓ Test endpoint passed${NC}"
    echo "Response: $body"
else
    echo -e "${RED}✗ Test endpoint failed (Status: $status_code)${NC}"
fi
echo ""

# Test 3: Sign Up
echo -e "${YELLOW}Test 3: Sign Up (New User)${NC}"
TIMESTAMP=$(date +%s)
USERNAME="testuser_$TIMESTAMP"
EMAIL="test_$TIMESTAMP@example.com"
PASSWORD="password123"

response=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$USERNAME\",
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"confirmPassword\": \"$PASSWORD\"
  }")

status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$status_code" = "201" ]; then
    echo -e "${GREEN}✓ Sign up successful${NC}"
    echo "Response: $body"
    TOKEN=$(echo "$body" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "Username: $USERNAME"
    echo "Token: ${TOKEN:0:20}..."
else
    echo -e "${RED}✗ Sign up failed (Status: $status_code)${NC}"
    echo "Response: $body"
fi
echo ""

# Test 4: Sign In
echo -e "${YELLOW}Test 4: Sign In (With Created User)${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/auth/signin" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$USERNAME\",
    \"password\": \"$PASSWORD\"
  }")

status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$status_code" = "200" ]; then
    echo -e "${GREEN}✓ Sign in successful${NC}"
    echo "Response: $body"
    TOKEN=$(echo "$body" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "Token: ${TOKEN:0:20}..."
else
    echo -e "${RED}✗ Sign in failed (Status: $status_code)${NC}"
    echo "Response: $body"
fi
echo ""

# Test 5: Invalid Sign In
echo -e "${YELLOW}Test 5: Invalid Sign In (Wrong Password)${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/auth/signin" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$USERNAME\",
    \"password\": \"wrongpassword\"
  }")

status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$status_code" = "401" ]; then
    echo -e "${GREEN}✓ Correctly rejected invalid password${NC}"
    echo "Response: $body"
else
    echo -e "${RED}✗ Should have rejected invalid password (Status: $status_code)${NC}"
fi
echo ""

echo "===================================="
echo -e "${GREEN}✨ API tests complete!${NC}"
echo ""
echo "If all tests passed, your backend is working correctly!"
echo "You can now test the frontend signup/signin functionality."
