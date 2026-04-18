# TRAE 团队模式 - 多Agent协同开发环境

## 概述

TRAE (Team-based Robust AI Engineering) 是一个基于 Claude Code Agent Teams & Harness 工程最佳实践的多 Agent 协同开发框架，专为从 0-1 的大型项目开发设计。

### 核心特性

- **多 Agent 协同**：7 个专业 Agent 分工协作
- **记忆系统**：持久化项目状态，支持断点恢复
- **工程标准**：确保代码质量和可维护性
- **快速初始化**：支持从 0-1 快速构建项目
- **标准化流程**：基于工程最佳实践

### 五大核心原则

1. **数据模型优先** - 数据模型设计先于API设计，保证稳定性
2. **合同优先** - 架构师先设计API合同，再并行开发
3. **MVP冒烟** - 最小可用系统先跑通环境，再大规模开发
4. **技术栈锁定** - 确定后不随意引入新技术
5. **领地划分** - 每个Agent独占特定目录，避免冲突

## 目录结构

```
AliceGo/
├── .trae/
│   ├── team-config.json          # 团队配置
│   ├── rules/
│   │   ├── project_rules.md     # 核心规范
│   │   ├── code_standards.md    # 代码标准
│   │   └── engineering_standards.md  # 工程标准
│   ├── agents/                  # Agent 配置
│   ├── skills/                  # 技能定义
│   ├── mailbox/                 # 消息队列
│   ├── memory/                  # 记忆系统
│   ├── init/                    # 初始化脚本
│   ├── tasks.md                 # 任务看板
│   ├── tech-stack.md            # 技术栈清单
│   └── data-model.md            # 数据模型设计
├── database/                    # 数据库文件
│   ├── schema.sql
│   ├── migrations/
│   └── seeds/
└── README.md
```

## 系统要求

- Node.js 18.x 或更高版本
- npm 或 yarn 包管理器
- Git 版本控制

## 初始化项目

```bash
# 创建项目目录
mkdir my-project
cd my-project

# 初始化 TRAE
node .trae/init/init.js
```

## Agent角色配置

| Agent | 模型 | 职责 | 领地 |
|-------|------|------|------|
| **Team Lead** | Opus | 需求分析、任务拆解、全局协调 | 全局协调 |
| **Architect** | Opus | 系统设计、API合同、技术选型 | design/ |
| **DBA** | Opus | 数据模型设计、数据库管理 | database/ |
| **Frontend Dev** | Sonnet | 前端业务逻辑开发 | src/client/ |
| **Backend Dev** | Sonnet | 后端业务逻辑开发 | src/server/ |
| **DevOps** | Sonnet | 环境搭建、CI/CD、依赖管理 | infra/ |
| **QA** | Sonnet | 测试策略、测试用例、质量把控 | tests/ |

## 核心流程

### Phase 1: 架构与MVP设计（串行）

```
1. [Team Lead] 分析需求
       ↓
2. [Architect] 技术选型 + 架构设计
       ↓
3. [DBA] 数据模型设计
       ↓
4. [DevOps] 搭建MVP运行环境
       ↓
5. [Architect] 设计API合同
       ↓
[检查点1] MVP环境冒烟 → 用户确认
```

### Phase 2: 并行开发（合同锁定后）

```
6. [Frontend] ←→ [Backend] 基于合同并行开发
       ↓
7. [DevOps] 完善CI/CD流程
       ↓
[检查点2] 集成测试通过 → 用户确认
```

### Phase 3: 测试与验收

```
8. [QA] 全面测试
       ↓
9. [Team Lead] 最终验收
       ↓
[检查点3] 上线准备就绪
```

## 强制约束机制

### 领地划分
- Frontend Dev **只能**操作 `src/client/`
- Backend Dev **只能**操作 `src/server/`
- DBA **只能**操作 `database/`
- DevOps **只能**操作 `infra/` 和依赖配置
- QA **只能**操作 `tests/`

### 权限禁止
- ❌ Frontend/Backend Dev **禁止**修改 package.json
- ❌ Frontend/Backend Dev **禁止**执行 npm install/add
- ❌ Frontend/Backend Dev **禁止**修改数据库结构
- ❌ 只有 DevOps 可以管理依赖
- ❌ 只有 DBA 可以修改数据库

### 技术栈管控
- 所有新技术栈必须通过 `mailbox/to-devops.md` 申请
- 需要 Team Lead 审批
- 只有 DevOps 可以安装新依赖

## 常用命令

| 命令 | 描述 |
|------|------|
| `npm install` | 安装依赖 |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建项目 |
| `npm test` | 运行测试 |
| `npm run lint` | 代码质量检查 |

## 常见问题

### 1. 对话轮次限制
TRAE 在 50 轮对话后建议新建对话，导致上下文丢失。
**解决方案**：使用记忆系统，在新对话开始时加载项目状态。

### 2. Agent 冲突
多个 Agent 同时操作同一文件。
**解决方案**：遵循领地划分，使用任务分配机制。

### 3. 技术栈变更
需要引入新的技术栈。
**解决方案**：通过 mailbox/to-devops.md 申请，经 Team Lead 审批。

### 4. 初始化失败
**解决方案**：
- 检查 Node.js 版本
- 确保目录权限正确
- 检查网络连接

### 5. 依赖安装失败
**解决方案**：
- 清理 npm 缓存：`npm cache clean --force`
- 更换 npm 源：`npm config set registry https://registry.npmmirror.com`

## 工程标准

### 代码规范
- 文件命名：kebab-case
- 组件/类命名：PascalCase
- 变量命名：camelCase
- 常量命名：UPPER_SNAKE_CASE
- 函数长度：不超过 50 行
- 类/组件长度：不超过 300 行

### 测试策略
- **单元测试**：测试单个函数和组件，覆盖率目标 > 80%
- **集成测试**：测试模块间的交互
- **端到端测试**：测试完整的用户流程

### CI/CD 流程
1. 代码提交 → 质量检查 → 测试执行
2. 构建验证 → 部署准备 → 环境检查
3. 部署执行 → 健康检查 → 回滚机制

## 最佳实践

- **数据模型优先**：先设计数据模型，再设计API
- **合同锁定**：API合同一旦确定，变更需审批
- **MVP冒烟**：环境先跑通，再大规模开发
- **领地划分**：各Agent只操作自己的领地
- **强制约束**：通过熔断机制防止越权操作
- **Git快照**：每个检查点自动创建快照，支持回滚