# Project Instructions

## Bun First

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun install` instead of `npm install` or `yarn install`
- Use `bun run <script>` instead of `npm run <script>`
- Use `bunx <package> <command>` instead of `npx <package>`
- Bun automatically loads `.env`, so don't use dotenv.

## APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.file` over `node:fs`'s readFile/writeFile

## Testing

Use `bun test` to run backend tests.

```ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Frontend

- Use Vite for React bundling
- Use Tailwind CSS for styling
- Use `@tanstack/react-query` for data fetching

## React Hooks Import Pattern

Always import hooks directly from their packages, not from `React`:

```tsx
// Good
import { useState, useEffect, useQuery } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Bad - causes "React.xxx is not a function" errors
import React from "react";
// ...
const { data } = React.useQuery(...);
```

## Playwright Tests

- Store tests in `.e2e-tests/` directory (hidden from bun test)
- Run with `npx playwright test`
- Bun test and Playwright test cannot run together due to version conflicts

## Progress Tracking

Record issues and solutions in `PROGRESS.md`:
- Problem description
- Solution
- Prevention tips
- Commit ID
