#!/bin/bash

# Project Verification Script
# This script runs all automated tests to verify the project is working correctly.

set -e

echo "========================================"
echo "Project Verification Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}[PASS]${NC} $2"
    else
        echo -e "${RED}[FAIL]${NC} $2"
        exit 1
    fi
}

# Step 1: Install dependencies
echo "Step 1: Installing dependencies..."
echo "-----------------------------------"
if [ ! -d "node_modules" ]; then
    bun install
    print_status $? "bun install"
else
    echo -e "${YELLOW}[SKIP]${NC} node_modules already exists"
fi
echo ""

# Step 2: Server tests (Bun Test)
echo "Step 2: Running server tests (Bun Test)..."
echo "-----------------------------------"
bun run test:server
TEST_RESULT=$?
print_status $TEST_RESULT "Server tests"
echo ""

# Step 3: Type check
echo "Step 3: Type checking..."
echo "-----------------------------------"
bun run build:server 2>&1 | head -20
if [ ${PIPESTATUS[0]} -ne 0 ]; then
    print_status 1 "Type check failed"
else
    print_status 0 "Type check passed"
fi
echo ""

# Step 4: Build web
echo "Step 4: Building web application..."
echo "-----------------------------------"
bun run build:web
BUILD_RESULT=$?
print_status $BUILD_RESULT "Web build"
echo ""

# Step 5: E2E tests (Playwright)
echo "Step 5: Running E2E tests (Playwright)..."
echo "-----------------------------------"
echo "Starting dev server in background..."

# Start dev server in background
bun run dev:web &
DEV_SERVER_PID=$!

# Wait for server to be ready
echo "Waiting for dev server to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo "Dev server is ready!"
        break
    fi
    sleep 1
done

# Run playwright tests
bun run test:e2e
PLAYWRIGHT_RESULT=$?

# Kill dev server
kill $DEV_SERVER_PID 2>/dev/null || true

print_status $PLAYWRIGHT_RESULT "Playwright tests"
echo ""

# Summary
echo "========================================"
echo "Verification Complete!"
echo "========================================"
echo ""
echo "All tests passed. The project is ready for development."
