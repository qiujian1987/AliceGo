# TRAE 团队模式 - 多Agent协同开发环境

## 概述

TRAE (Team-based Robust AI Engineering) 是一个基于 Claude Code Agent Teams & Harness 工程最佳实践的多 Agent 协同开发框架，专为从 0-1 的大型项目开发设计。

### 核心特性

- **多 Agent 协同**：14 个专业 Agent 分工协作
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
│   ├── rules/                    # 规则体系（7个文件）
│   │   ├── 01_security-constraints.md   # 安全约束
│   │   ├── 02_agent-territory.md        # Agent领地
│   │   ├── 03_coding-conventions.md     # 编码规范
│   │   ├── 04_quality-standards.md      # 质量标准
│   │   ├── 05_mandatory-behaviors.md    # 强制行为
│   │   ├── 06_code-quality.md            # 代码质量
│   │   └── 07_workflow-standards.md     # 工作流程
│   ├── agents/                  # Agent配置（14个）
│   │   ├── team-lead.md         # 项目总协调
│   │   ├── architect.md          # 系统架构师
│   │   ├── dba.md               # 数据库设计师
│   │   ├── feature-analyst.md   # 特性需求分析师
│   │   ├── frontend-designer.md  # 前端设计师
│   │   ├── frontend-dev.md      # 前端开发
│   │   ├── backend-dev.md        # 后端开发
│   │   ├── devops.md            # 运维工程师
│   │   ├── qa.md                # 质量保证
│   │   ├── req-reviewer.md      # 需求评审
│   │   ├── design-reviewer.md   # 设计评审
│   │   ├── test-reviewer.md     # 测试评审
│   │   └── code-reviewer.md     # 代码评审
│   ├── skills/                  # 技能定义（13个）
│   │   ├── requirement-analyzer/
│   │   ├── project-planner/
│   │   ├── architecture-planner/
│   │   ├── api-designer/
│   │   ├── database-designer/
│   │   ├── frontend-design/
│   │   ├── test-generator/
│   │   ├── test-executor/
│   │   ├── code-generator/
│   │   ├── code-review/
│   │   ├── sql-optimizer/
│   │   ├── dependency-manager/
│   │   ├── devops-automation/
│   │   └── file-operation/
│   ├── docs/                    # 规范文档
│   │   ├── skill-invocation.md   # Skill调用规范
│   │   ├── review-feedback.md    # 评审反馈机制
│   │   ├── memory-usage.md       # 记忆系统使用
│   │   ├── file-ownership.md     # 文件所有权
│   │   └── project-initialization.md  # 项目初始化
│   ├── specs/                   # 分析文档
│   │   └── workflow-end-to-end-analysis/
│   ├── mcps/                    # MCP配置
│   └── documents/               # 文档
├── database/                    # 数据库文件
├── src/                        # 源代码
├── tests/                      # 测试代码
└── infra/                      # 基础设施
```

## Agent角色配置

| Agent | 职责 | 领地 |
|-------|------|------|
| **Team Lead** | 需求分析、任务拆解、全局协调 | 全局协调 |
| **Feature Analyst** | 特性需求分析、文档编写 | design/features/ |
| **Architect** | 系统设计、API合同、技术选型 | design/ |
| **Frontend Designer** | 前端界面设计 | design/ |
| **DBA** | 数据模型设计、数据库管理 | database/ |
| **QA** | 测试策略、测试用例、质量把控 | tests/ |
| **Frontend Dev** | 前端业务逻辑开发 | src/client/ |
| **Backend Dev** | 后端业务逻辑开发 | src/server/ |
| **DevOps** | 环境搭建、CI/CD、依赖管理 | infra/ |
| **req-reviewer** | 需求文档评审 | 评审 |
| **design-reviewer** | 设计文档评审 | 评审 |
| **test-reviewer** | 测试文档评审 | 评审 |
| **code-reviewer** | 代码评审 | 评审 |

## 规则体系

TRAE框架会自动加载 `.trae/rules/` 目录下的所有规则文件，这些规则对所有Agent生效。

### 规则分层

| 层级 | 文件 | 内容 |
|------|------|------|
| L1 | 01_security-constraints.md | 安全红线、禁止操作、输入验证 |
| L1 | 05_mandatory-behaviors.md | 确认机制、迭代控制、响应规范 |
| L2 | 02_agent-territory.md | Agent领地划分、权限边界 |
| L3 | 03_coding-conventions.md | 命名规范、长度规范、注释规范 |
| L3 | 04_quality-standards.md | 测试策略、覆盖率目标、CI/CD |
| L3 | 06_code-quality.md | 类型安全、错误处理、性能标准 |
| L3 | 07_workflow-standards.md | 开发流程、环境配置、分支策略 |

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

## 最佳实践

- **数据模型优先**：先设计数据模型，再设计API
- **合同锁定**：API合同一旦确定，变更需审批
- **MVP冒烟**：环境先跑通，再大规模开发
- **领地划分**：各Agent只操作自己的领地
- **强制约束**：通过熔断机制防止越权操作
- **Git快照**：每个检查点自动创建快照，支持回滚
