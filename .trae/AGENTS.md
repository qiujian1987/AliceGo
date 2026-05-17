# AliceGo Agent 知识地图

这是 AliceGo 项目的 Agent 知识地图，为所有 AI Agent 提供统一的项目上下文和协作规范。

## 项目概述

### 项目名称
AliceGo - TRAE IDE 多 Agent 协同 Harness 工程

### 项目目标
为企业级 B 端系统提供完整的多 Agent 协同开发框架，通过 SOLO Coder 实现端到端交付，提高代码质量和开发效率。

### 核心架构
```
用户
  ↓
SOLO Coder (主控)
  ↓
多 Agent 协同层
  ├─ 设计 Agent：Architect, Frontend Designer, DBA, Feature Analyst
  ├─ 开发 Agent：Backend Dev, Frontend Dev
  ├─ 评审 Agent：Code Reviewer, Design Reviewer, Test Reviewer, Req Reviewer
  ├─ 支撑 Agent：Team Lead, QA, DevOps
  ↓
Skills 层（按需加载）
  ↓
MCP 工具层
```

---

## 仓库结构

```
AliceGo/
├── .trae/
│   ├── agents/           # Agent 提示词定义
│   │   ├── architect.md
│   │   ├── backend-dev.md
│   │   ├── frontend-dev.md
│   │   └── ...
│   ├── skills/           # Skill 技能包（按需加载）
│   │   ├── architecture-planner/
│   │   ├── code-generator/
│   │   ├── test-case-design/
│   │   └── ...
│   ├── rules/            # Rules 规则（全量加载）
│   │   ├── 01_security-constraints.md
│   │   ├── 02_standards.md
│   │   └── 03_workflow.md
│   └── documents/        # 项目文档
│       └── trae_harness_optimization_plan.md
├── design/               # 设计文档输出目录
│   ├── project_overview/
│   └── features/
├── src/                  # 源代码目录
│   ├── server/          # 后端代码
│   └── client/          # 前端代码
└── tests/               # 测试代码目录
```

---

## Agent 角色定义

### 设计 Agent

#### @architect
- **职责**：后端架构设计、API 设计
- **输出**：`backend_architecture.md`、`api_contracts.md`
- **调用 Skill**：`architecture-planner`、`api-designer`

#### @frontend-designer
- **职责**：前端架构设计、UI 设计
- **输出**：`frontend_architecture.md`
- **调用 Skill**：`frontend-design`

#### @dba
- **职责**：数据库设计、数据模型设计
- **输出**：`data_model.md`、`schema.sql`
- **调用 Skill**：`database-designer`

#### @feature-analyst
- **职责**：特性需求分析
- **输出**：`features/*/requirements.md`
- **调用 Skill**：`requirement-analyzer`

### 开发 Agent

#### @backend-dev
- **职责**：后端业务代码实现、TDD 开发
- **输出**：`src/server/` 下的代码文件
- **调用 Skill**：`code-generator`

#### @frontend-dev
- **职责**：前端业务代码实现、TDD 开发
- **输出**：`src/client/` 下的代码文件
- **调用 Skill**：`code-generator`、`frontend-design`

### 评审 Agent

#### @code-reviewer
- **职责**：代码质量评审
- **输出**：评审报告、反馈 JSON
- **调用 Skill**：`code-review`

#### @design-reviewer
- **职责**：架构设计评审
- **输出**：设计评审报告
- **调用 Skill**：无

#### @test-reviewer
- **职责**：测试用例评审
- **输出**：测试评审报告
- **调用 Skill**：`test-review`

#### @req-reviewer
- **职责**：需求文档评审
- **输出**：需求评审报告
- **调用 Skill**：无

### 支撑 Agent

#### @team-lead
- **职责**：流程指导、质量把关、决策支持
- **输出**：咨询建议、文档验证
- **调用 Skill**：`task-decomposition`

#### @qa
- **职责**：测试用例设计、测试执行
- **输出**：`features/*/test-cases.md`
- **调用 Skill**：`test-case-design`、`test-executor`

#### @devops
- **职责**：环境配置、CI/CD、依赖管理
- **输出**：部署配置、环境文档
- **调用 Skill**：`devops-automation`、`dependency-manager`

---

## Skill 调用指引

### 核心 Skill

| Skill | 用途 | 触发场景 |
|-------|------|----------|
| `architecture-planner` | 架构设计 | "架构设计"、"系统设计" |
| `code-generator` | 代码生成 | "编写代码"、"实现功能" |
| `test-case-design` | 测试用例设计 | "测试用例"、"生成测试" |
| `test-review` | 测试评审 | "测试评审"、"评审测试" |
| `task-decomposition` | 任务拆解 | "任务拆解"、"分解任务" |
| `file-operation` | 文件操作 | 任何需要创建/修改文件的场景 |
| `api-designer` | API 设计 | "API 设计"、"接口文档" |
| `database-designer` | 数据库设计 | "数据库设计"、"数据模型" |
| `frontend-design` | 前端设计 | "前端设计"、"界面设计" |

### Skill 调用规则

1. **按需加载**：只有当任务需要时才调用对应 Skill
2. **渐进披露**：Agent 提示词中只包含 Skill 名称和用途，完整流程在 Skill 中定义
3. **Tool 优先**：确定性操作优先使用 MCP 工具，Skill 用于复杂流程

---

## 工作流程概览

### 四大阶段

```
┌─────────────────────────────────────────┐
│ Phase 1: 项目初始化与需求分析            │
│   步骤 1-5                             │
│   产出：需求文档、特性清单              │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ Phase 2: 系统设计                        │
│   步骤 6-14                            │
│   产出：架构设计、API、数据模型          │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ Phase 3: 任务规划与开发（TDD）          │
│   步骤 15-23                           │
│   产出：代码、测试报告                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ Phase 4: 验收与交付                     │
│   步骤 24-26                           │
│   产出：部署记录、项目总结              │
└─────────────────────────────────────────┘
```

### 评审环节

| 评审类型 | 执行者 | 评审范围 |
|---------|-------|---------|
| 需求评审 | @req-reviewer | 需求文档、特性需求 |
| 设计评审 | @design-reviewer | 架构、数据模型、API |
| 测试评审 | @test-reviewer | 测试用例 |
| 代码评审 | @code-reviewer | 开发代码 |

---

## Agent 协作规范

### 交接规范（HANDOFF）

当 Agent A 将任务交接给 Agent B 时，必须提供：

```
HANDOFF TO: [Agent Name/Role]
CONTEXT: [已完成的工作]
CURRENT STATE: [当前状态]
NEXT STEPS: [下一步操作]
RESOURCES: [相关文件和数据]
DEADLINE: [截止时间]
```

### 文件操作规范

**必须使用** `file-operation` **Skill** 进行所有文件操作：
- `createFile()` - 创建文件
- `modifyFile()` - 修改文件
- `deleteFile()` - 删除文件
- `readFile()` - 读取文件
- `createDirectory()` - 创建目录

**禁止**：
- 使用文字描述"假装"创建文件
- 在 Agent 或 Skill 内部直接使用 fs 模块

---

## 关键约定

### 1. 流程顺序
- 必须按顺序执行步骤，不能跳过前置步骤
- 评审必须由专门的评审 Agent 执行
- 迭代次数最多 3 次

### 2. 文件位置
- 设计文档 → `design/`
- 源代码 → `src/`
- 测试代码 → `tests/`
- 部署配置 → `infra/`

### 3. 命名规范
- 文件夹：kebab-case（示例：`test-cases`）
- 文件：kebab-case（示例：`api-contracts.md`）
- 类/组件：PascalCase（示例：`UserService`）
- 变量/函数：camelCase（示例：`userName`）

### 4. 评审通过标准
- 需求评审：需求文档完整、无歧义
- 设计评审：架构合理、API 完整、数据模型规范
- 测试评审：测试用例覆盖所有功能
- 代码评审：代码质量达标、测试通过

---

## 参考文档

- **Rules 规则**：`.trae/rules/`
- **Skills 技能**：`.trae/skills/`
- **设计文档**：`design/`

---

*最后更新：2026-05-16*
