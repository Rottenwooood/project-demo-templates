# my-app 项目模板

一个专为 AI 设计的**可闭环验证**的全栈项目模板，基于 Bun + React + Hono。

## 核心特性：AI 友好 + 自动化验证

本模板专为 AI 开发设计，确保每一步修改都能被自动化验证，**无需人工检查即可发现错误**。

### 🔒 闭环验证机制

```
代码修改 → bun test (后端) → npx playwright test (前端) → 验证通过 ✅
                                   ↓
                              检测到错误 → 测试失败 ❌
```

- **后端测试 (bun test)**：自动验证所有 API 路由返回 200 OK
- **E2E 测试 (Playwright)**：自动检测浏览器控制台错误、页面崩溃
- **验证脚本 (verify.sh)**：一键运行所有测试

### 🛡️ 防护措施

| 防护类型 | 检测内容 | 测试工具 |
|---------|---------|---------|
| 后端错误 | API 返回错误、异常抛出 | Bun Test |
| 前端崩溃 | JS 异常、控制台 error | Playwright |
| 移动端兼容 | 视口渲染错误 | Playwright (手机模式) |

## 快速开始

### 1. 复制模板

```bash
cp -r template my-project
cd my-project
```

### 2. 替换项目名

```bash
# Linux/Mac
find . -type f \( -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.html" \) -exec sed -i 's/my-app/你的项目名/g' {} \;
```

### 3. 安装依赖

```bash
bun install
```

### 4. 运行验证（必做！）

```bash
# 完整验证（推荐）
./verify.sh

# 或分步执行
bun test              # 后端 API 测试
npx playwright test   # 前端 E2E 测试
```

### 5. 启动开发

```bash
bun dev
```

访问 http://localhost:5173

## 验证流程说明

### 为什么需要闭环验证？

AI 修改代码时常见问题：
- 忘记更新类型定义 → TypeScript 报错
- API 路由写错 → 404 错误
- 引入 JS 运行时错误 → 页面崩溃

**传统方式**：人工测试 → 发现问题 → 反馈 AI → 修复 → 循环...

**本模板方式**：AI 修改 → 自动测试 → 失败自动重试 → 通过 ✅

### 验证流程

```
1. bun test
   ├── 测试 /health → 返回 { status: "ok" }
   ├── 测试 /api/v1/hello → 返回 200
   └── 测试 /api/v1/echo → POST 正常响应

2. npx playwright test
   ├── 访问首页 → 检查无控制台错误
   ├── 访问 /library → 检查无 JS 异常
   ├── 测试导航 → 检查页面切换正常
   └── 手机视口 → 检查响应式布局正常
```

### AI 开发工作流

```bash
# 1. 理解需求
# 2. 编写代码
# 3. 运行验证
./verify.sh

# 如果失败 → 修复错误 → 重新验证
# 如果通过 → git add && git commit
```

## 项目结构

```
my-project/
├── apps/
│   └── web/                    # React 前端 (Vite)
│       ├── src/
│       │   ├── App.tsx        # 路由 + 页面
│       │   ├── main.tsx       # 入口
│       │   └── index.css      # Tailwind 样式
│       ├── vite.config.ts
│       └── tailwind.config.js
├── packages/
│   ├── server/                # Hono 后端
│   │   ├── src/
│   │   │   ├── index.ts       # 路由定义
│   │   │   └── routes/
│   │   │       └── __test__/
│   │   │           └── api.test.ts  # API 测试
│   │   └── package.json
│   └── core/                  # 共享工具
│       ├── src/
│       │   ├── index.ts
│       │   └── index.test.ts
│       └── package.json
├── .e2e-tests/               # Playwright 测试
│   └── smoke.playwright.spec.ts
├── playwright.config.ts
├── verify.sh                 # 一键验证脚本
├── package.json
└── tsconfig.json
```

## 命令

| 命令 | 说明 | 验证内容 |
|------|------|---------|
| `bun test` | 后端测试 | API 路由正确性 |
| `npx playwright test` | E2E 测试 | 前端无崩溃 |
| `./verify.sh` | 完整验证 | 所有测试 + 构建 |
| `bun dev` | 开发服务器 | - |

## 添加新功能指南

### 1. 添加后端 API

```typescript
// packages/server/src/index.ts
apiRouter.get("/api/v1/items", (c) => {
  return c.json({ items: [] });
});

apiRouter.post("/api/v1/items", async (c) => {
  const body = await c.req.json();
  return c.json({ id: "1" }, 201);
});
```

**必须添加测试**（在 `api.test.ts`）：

```typescript
describe("Items API", () => {
  it("returns items list", async () => {
    const app = createTestApp();
    const res = await app.request("/api/v1/items");
    expect(res.status).toBe(200);
  });
});
```

### 2. 添加前端页面

```tsx
// apps/web/src/App.tsx
function ItemsPage() {
  const { data } = useQuery({
    queryKey: ["items"],
    queryFn: () => fetch("/api/v1/items").then(r => r.json()),
  });

  return <div>{JSON.stringify(data)}</div>;
}

// 添加路由
<Route path="/items" element={<ItemsPage />} />
```

**必须添加 E2E 测试**（在 `smoke.playwright.spec.ts`）：

```typescript
test("Items page loads without errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", msg => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", err => errors.push(err.message));

  await page.goto("/items");
  expect(errors).toHaveLength(0);
});
```

### 3. 验证并提交

```bash
# 每次修改后必须运行
./verify.sh

# 通过后提交
git add -A && git commit -m "feat: 添加 items 功能"
```

## 常见问题与解决方案

### 问题 1：Bun install 超时

```bash
# 使用国内镜像
bun install --registry https://registry.npmmirror.com
```

### 问题 2：Playwright 与 Bun 冲突

- **原因**：Bun 内置 Playwright，与 @playwright/test 版本冲突
- **解决**：Playwright 测试放 `.e2e-tests/`，用 `npx playwright test` 运行

### 问题 3：React.useQuery is not a function

```tsx
// ❌ 错误
import React from "react";
React.useQuery(...)

// ✅ 正确
import { useQuery } from "@tanstack/react-query";
useQuery(...)
```

### 问题 4：SQL 保留字

- **错误**：`SQLiteError: near "index"`
- **解决**：字段名避开 SQL 保留字，如用 `chapter_index`

### 问题 5：better-sqlite3 不支持

- **解决**：使用 Bun 原生 `bun:sqlite`

## 开发规范

### 必须遵循

1. **每改必测**：每次代码修改后运行 `./verify.sh`
2. **测试先行**：先写测试，再写功能
3. **失败重试**：测试失败自动修复，直到通过

### React Hooks 导入

```tsx
// ✅ 正确
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

// ❌ 错误
import React from "react";
```

### API 设计模式

```typescript
const apiRouter = new Hono();

apiRouter.get("/resource", handler);
apiRouter.post("/resource", handler);
apiRouter.put("/resource/:id", handler);
apiRouter.delete("/resource/:id", handler);

app.route("/api/v1", apiRouter);
```

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

## 模板来源

本模板基于 EPUB Reader 项目开发经验总结，吸收了所有踩坑教训，确保 AI 开发时：
- 不会因为环境问题卡住
- 不会因为测试配置问题遗漏错误
- 不会因为导入顺序问题导致运行时崩溃

---

**使用本模板时，每次代码修改后运行 `./verify.sh` 进行验证。**
