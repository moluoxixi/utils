# Monorepo And ViteConfig Design

## Goal

先把仓库整理成可持续扩展的 `pnpm workspace` 工具库，再优先落地 `ViteConfig` 的最小可用版本。当前阶段不追求把 `ViteBuild` 做完整实现，只保证三个包都有清晰边界和可继续演进的骨架。

## Architecture

- 根目录负责 workspace、共享 TypeScript 约束、统一构建与测试脚本。
- `@utils/core` 提供通用文件与 `package.json` 读取能力，避免 `ViteConfig` 直接耦合底层 IO 细节。
- `@utils/vite-config` 提供基于 `vite.mergeConfig` 的配置工厂，按项目依赖自动启用 React、Vue、UnoCSS、Tailwind 相关插件。
- `@utils/vite-build` 先保留包结构与对外入口，后续再承载更完整的构建编排能力。

## Components

### Root Workspace

根工程新增 `package.json`、`pnpm-workspace.yaml`、共享 `tsconfig`，统一约束构建、测试、类型检查入口。所有包使用一致的 ESM 输出方式，避免后续包间互调时再补兼容层。

### Core Package

`core` 仅承载 `package.json` 查找、JSON 读取、依赖探测等小型基础能力。它不直接知道 Vite，也不处理框架插件，只输出通用结果。

### ViteConfig Package

`ViteConfig` 暴露三个核心能力：

1. 读取当前项目或指定目录下的 `package.json`
2. 识别 React、Vue、UnoCSS、Tailwind 相关依赖是否存在
3. 在基础配置上拼装插件，并与用户传入配置做二次合并

插件加载采用动态导入，避免对每个消费者都强制要求安装全部生态包。被检测到的能力如果缺少对应插件依赖，应给出明确错误。

## Data Flow

`createViteConfig()` 的流程是：

1. 解析传入 `cwd` 或显式 `manifest`
2. 汇总依赖特征
3. 计算应该启用的插件集合
4. 动态加载对应 Vite 插件
5. 通过 `mergeConfig` 合并基础配置与用户覆盖项

## Error Handling

- 找不到 `package.json` 时抛出清晰错误，指出搜索起点目录。
- 找到依赖特征但对应插件包未安装时抛出清晰错误，指出缺失包名。
- 显式关闭某类插件时，不因项目依赖存在而自动启用。

## Testing

- 根工程先验证 workspace 能正确安装并执行各包脚本。
- `ViteConfig` 采用 TDD，先写失败测试覆盖依赖探测、插件启用与配置合并。
- `core` 的底层读取逻辑通过 `ViteConfig` 集成测试覆盖，必要时补独立单测。
