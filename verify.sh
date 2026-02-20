#!/bin/bash

# Project Verification Script
# Runs: bun test (backend) + npx playwright test (frontend)

set -e

echo "========================================"
echo "Project Verification"
echo "========================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}[PASS]${NC} $2"
    else
        echo -e "${RED}[FAIL]${NC} $2"
        exit 1
    fi
}

# Step 1: Bun Test (Backend)
echo "Running bun test (backend)..."
bun test
print_status $? "bun test"

# Step 2: Playwright (Frontend)
echo "Running Playwright (frontend)..."
npx playwright test
print_status $? "Playwright tests"

echo ""
echo "========================================"
echo "All tests passed!"
echo "========================================"
