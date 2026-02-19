# my-app 项目模板

一个开箱即用的 Bun + React + Hono 全栈项目模板，内置自动化测试闭环。

## 特性

- **Monorepo 架构**：基于 Bun Workspaces，packages 和 apps 分离
- **后端**：Hono + Bun + TypeScript，高性能 API 服务
- **前端**：React + Vite + Tailwind CSS + TanStack Query
- **自动化测试**：
  - Bun Test：后端 API 测试
  - Playwright：E2E 冒烟测试，检测控制台错误
- **已验证**：所有测试通过，无控制台报错

## 快速开始

### 1. 复制模板

```bash
cp -r template my-project
cd my-project
```

### 2. 替换项目名

将所有 `my-app` 替换为你的实际项目名：

```bash
# Linux/Mac
find . -type f \( -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.html" \) -exec sed -i 's/my-app/你的项目名/g' {} \;

# Windows PowerShell
Get-ChildItem -Recurse -Include *.json,*.ts,*.tsx,*.html | ForEach-Object { (Get-Content $_.FullName) -replace 'my-app', '你的项目名' | Set-Content $_.FullName }
```

### 3. 安装依赖

```bash
bun install
```

### 4. 运行测试

```bash
# 后端测试 (Bun Test)
bun test

# E2E 测试 (Playwright)
npx playwright test

# 完整验证
./verify.sh
```

### 5. 启动开发

```bash
bun dev
```

访问 http://localhost:5173

## 项目结构

```
my-project/
├── apps/                      # 应用层
│   └── web/                   # React 前端
│       ├── src/
│       │   ├── App.tsx       # 主应用组件
│       │   ├── main.tsx      # 入口文件
│       │   └── index.css     # 全局样式
│       ├── package.json
│       ├── vite.config.ts    # Vite 配置
│       └── tailwind.config.js
├── packages/                  # 包层
│   ├── server/               # Hono 后端
│   │   ├── src/
│   │   │   ├── index.ts     # 主服务器
│   │   │   └── routes/
│   │   │       └── __test__/
│   │   │           └── api.test.ts  # API 测试
│   │   └── package.json
│   └── core/                 # 共享工具
│       ├── src/
│       │   ├── index.ts
│       │   └── index.test.ts
│       └── package.json
├── .e2e-tests/              # Playwright E2E 测试
│   └── smoke.playwright.spec.ts
├── playwright.config.ts      # Playwright 配置
├── verify.sh                # 验证脚本
├── package.json             # 根 workspace 配置
└── tsconfig.json           # TypeScript 配置
```

## 命令

| 命令 | 说明 |
|------|------|
| `bun dev` | 启动前后端开发服务器 |
| `bun test` | 运行后端 Bun Test |
| `npx playwright test` | 运行 E2E 测试 |
| `bun run verify` | 完整验证（安装+测试+构建） |
| `bun run build` | 构建所有包 |

## 添加新功能

### 1. 添加后端 API

在 `packages/server/src/index.ts` 中添加路由：

```typescript
// 添加新路由
apiRouter.get("/api/v1/items", (c) => {
  return c.json({ items: [] });
});

apiRouter.post("/api/v1/items", async (c) => {
  const body = await c.req.json();
  // 处理逻辑
  return c.json({ id: "new-id" }, 201);
});
```

### 2. 添加前端页面

在 `apps/web/src/App.tsx` 中添加：

```tsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

function MyPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-data"],
    queryFn: async () => {
      const res = await fetch("/api/v1/items");
      return res.json();
    },
  });

  if (isLoading) return <div>加载中...</div>;

  return <div>{JSON.stringify(data)}</div>;
}

// 添加路由
<Route path="/my-page" element={<MyPage />} />
```

### 3. 添加测试

后端测试（添加到 `packages/server/src/routes/__test__/api.test.ts`）：

```typescript
describe("Items API", () => {
  it("returns items list", async () => {
    const app = createTestApp();
    const res = await app.request("/api/v1/items");
    expect(res.status).toBe(200);
  });
});
```

E2E 测试（添加到 `.e2e-tests/smoke.playwright.spec.ts`）：

```typescript
test("My page loads without errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/my-page");
  expect(errors).toHaveLength(0);
});
```

### 4. 验证并提交

```bash
# 运行完整验证
./verify.sh

# 提交代码
git add -A
git commit -m "feat: 添加新功能"
```

## 已知问题与解决方案

详见 [PROGRESS.md](./PROGRESS.md)

### 问题 1：Bun install 超时

- **问题**：`bun install` 在网络慢时卡住
- **解决**：使用国内镜像：`bun install --registry https://registry.npmmirror.com`

### 问题 2：Playwright 与 Bun 冲突

- **问题**：`bun test` 报错 "Playwright Test did not expect test.describe()"
- **原因**：Bun 内置 Playwright 集成，与 @playwright/test 版本冲突
- **解决**：
  - Playwright 测试放在 `.e2e-tests/` 目录
  - 使用 `npx playwright test` 独立运行
  - Bun test 只运行后端测试

### 问题 3：React.useQuery is not a function

- **问题**：浏览器控制台报错
- **原因**：使用 `React.useQuery` 而非直接导入
- **解决**：

```tsx
// 正确
import { useQuery } from "@tanstack/react-query";
const { data } = useQuery(...);

// 错误
import React from "react";
const { data } = React.useQuery(...);
```

### 问题 4：SQL 保留字冲突

- **问题**：`SQLiteError: near "index": syntax error`
- **解决**：字段名避开保留字，如用 `chapter_index` 代替 `index`

### 问题 5：better-sqlite3 不支持

- **问题**：`error: 'better-sqlite3' is not yet supported in Bun`
- **解决**：使用 Bun 原生 `bun:sqlite`

## 开发规范

### React Hooks 导入

始终从各自包导入 hooks，不要从 React 导入：

```tsx
// ✅ 正确
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

// ❌ 错误 - 会导致 "React.xxx is not a function"
import React from "react";
const { data } = React.useQuery(...);
```

### API 设计

使用 Hono 路由器模式：

```typescript
const apiRouter = new Hono();

apiRouter.get("/resource", handler);
apiRouter.post("/resource", handler);
apiRouter.put("/resource/:id", handler);
apiRouter.delete("/resource/:id", handler);

app.route("/api/v1", apiRouter);
```

### 测试

- 后端：使用 Bun Test，每个路由有对应测试
- E2E：使用 Playwright，检测控制台错误
- 运行顺序：先 `bun test`，再 `npx playwright test`

## 依赖版本

| 包 | 版本 | 用途 |
|---|------|------|
| bun | ^1.1.0 | 运行时/包管理器 |
| hono | ^4.0.0 | Web 框架 |
| react | ^18.2.0 | UI 库 |
| vite | ^5.0.0 | 构建工具 |
| tailwindcss | ^3.4.0 | 样式 |
| @tanstack/react-query | ^5.0.0 | 数据获取 |
| @playwright/test | ^1.40.0 | E2E 测试 |

## 基于

模板创建基于 EPUB Reader 项目，吸收了所有踩坑经验。

---

如有问题，请查看 [PROGRESS.md](./PROGRESS.md) 或提交 Issue。
