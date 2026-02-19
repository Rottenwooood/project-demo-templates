# Progress Report

## Template Usage

This template is based on lessons learned from the EPUB Reader project. All known issues and solutions are documented here.

## Common Issues and Solutions

### Issue 1: Bun install timeout

- **Problem**: `bun install` hangs on slow networks
- **Solution**: Use mirror registry: `bun install --registry https://registry.npmmirror.com`

### Issue 2: Playwright test.describe conflict with Bun

- **Problem**: `bun test` crashes with "Playwright Test did not expect test.describe()"
- **Cause**: Bun has built-in Playwright integration that conflicts with `@playwright/test`
- **Solution**:
  - Store Playwright tests in `.e2e-tests/` (hidden directory)
  - Run Playwright tests with `npx playwright test`
  - Bun test only runs backend tests

### Issue 3: React.useQuery is not a function

- **Problem**: Browser console shows "TypeError: React.useQuery is not a function"
- **Cause**: `import React` was placed after hooks were used, or using `React.useQuery` instead of direct import
- **Solution**:
  - Always import hooks directly from their packages:
    ```tsx
    import { useState, useEffect } from "react";
    import { useQuery } from "@tanstack/react-query";
    import { useParams } from "react-router-dom";
    ```
  - Never use `React.useXxx()` pattern

### Issue 4: SQL reserved word "index"

- **Problem**: `SQLiteError: near "index": syntax error`
- **Solution**: Rename `index` field to `chapter_index` or similar

### Issue 5: better-sqlite3 not supported in Bun

- **Problem**: `error: 'better-sqlite3' is not yet supported in Bun`
- **Solution**: Use Bun's native `bun:sqlite` instead

---

## Project Phases

### Phase 1: Infrastructure Setup (Completed)

- [ ] Initialize monorepo workspace
- [ ] Set up backend with Hono
- [ ] Set up frontend with Vite + React
- [ ] Configure Playwright E2E tests
- [ ] Configure Bun test for backend
- [ ] Create verify.sh script

### Phase 2: Core Features

*(Add your project-specific phases here)*

---

## Verification Commands

```bash
# Install dependencies
bun install

# Run backend tests
bun test

# Run E2E tests
npx playwright test

# Run full verification
./verify.sh

# Start development server
bun dev
```

## Next Steps

*(Add your project-specific next steps here)*
