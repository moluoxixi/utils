# Monorepo And ViteConfig Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建 `pnpm workspace` 的三包工具仓库骨架，并实现 `@utils/vite-config` 的最小可用版本。

**Architecture:** 根工程提供统一脚本、TypeScript 与测试基础设施；`core` 提供通用清单读取能力；`vite-config` 负责依赖识别、插件装配和 `mergeConfig` 合并；`vite-build` 先保留入口壳子。

**Tech Stack:** pnpm workspace, TypeScript, tsup, Vitest, Vite

---

### Task 1: Scaffold The Workspace

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `tsconfig.json`

- [ ] **Step 1: Add root workspace metadata**

定义根 `package.json` 的私有仓库属性、共享脚本和开发依赖。

- [ ] **Step 2: Add workspace package discovery**

创建 `pnpm-workspace.yaml`，让 `packages/*` 进入工作区。

- [ ] **Step 3: Add shared TypeScript defaults**

创建共享 `tsconfig.base.json`，统一 ESM、严格模式和 JSON 解析能力。

- [ ] **Step 4: Add root project references**

创建根 `tsconfig.json`，声明三个包的引用关系。

- [ ] **Step 5: Install dependencies**

Run: `pnpm install`
Expected: workspace install succeeds without resolution errors

### Task 2: Scaffold Package Boundaries

**Files:**
- Create: `packages/core/package.json`
- Create: `packages/core/tsconfig.json`
- Create: `packages/core/src/index.ts`
- Create: `packages/ViteBuild/package.json`
- Create: `packages/ViteBuild/tsconfig.json`
- Create: `packages/ViteBuild/src/index.ts`
- Create: `packages/ViteConfig/package.json`
- Create: `packages/ViteConfig/tsconfig.json`
- Create: `packages/ViteConfig/src/index.ts`

- [ ] **Step 1: Create the `core` package shell**

补齐入口、构建脚本与类型检查脚本。

- [ ] **Step 2: Create the `ViteBuild` package shell**

仅保留后续扩展入口，不实现构建编排逻辑。

- [ ] **Step 3: Create the `ViteConfig` package shell**

声明对 `vite` 与可选插件生态的依赖边界。

- [ ] **Step 4: Verify workspace script discovery**

Run: `pnpm -r --filter ./packages/* exec node -e "console.log(process.cwd())"`
Expected: each package is discovered by workspace commands

### Task 3: Write Failing Tests For ViteConfig

**Files:**
- Create: `packages/ViteConfig/test/index.test.ts`

- [ ] **Step 1: Write a feature-detection test**

覆盖 `dependencies`、`devDependencies`、`peerDependencies`、`optionalDependencies` 的依赖识别。

- [ ] **Step 2: Write a config-factory integration test**

覆盖自动启用插件与 `mergeConfig` 合并用户别名配置。

- [ ] **Step 3: Run tests to verify failure**

Run: `pnpm --filter @utils/vite-config test`
Expected: FAIL because `ViteConfig` exports are not implemented yet

### Task 4: Implement Core Utilities And ViteConfig

**Files:**
- Modify: `packages/core/src/index.ts`
- Modify: `packages/ViteConfig/src/index.ts`
- Test: `packages/ViteConfig/test/index.test.ts`

- [ ] **Step 1: Implement package manifest discovery in `core`**

提供最近 `package.json` 查找、JSON 读取和依赖探测工具。

- [ ] **Step 2: Implement `ViteConfig` feature resolution**

实现依赖特征判断与显式开关覆盖逻辑。

- [ ] **Step 3: Implement plugin loading and config merge**

按需动态导入 React、Vue、UnoCSS、Tailwind 插件，并使用 `mergeConfig` 组合结果。

- [ ] **Step 4: Run tests to verify green**

Run: `pnpm --filter @utils/vite-config test`
Expected: PASS

### Task 5: Verify The Whole Workspace

**Files:**
- Verify only

- [ ] **Step 1: Run package type checks**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 2: Run package tests**

Run: `pnpm test`
Expected: PASS

- [ ] **Step 3: Run package builds**

Run: `pnpm build`
Expected: PASS and emit `dist` outputs for all packages
