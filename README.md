# AliceGo - 基于 TRAE 的 Loop Engineering 脚手架

## 项目定位

AliceGo 是一个面向企业级软件交付的 **Loop Engineering 脚手架**，基于 TRAE IDE 构建，让 AI Agent 在自主循环中完成从需求到部署的全生命周期开发。

**核心思想**：从「人驱动 Agent」转向「人设计 Loop，Loop 驱动 Agent」。人从循环内部的执行者变成循环外部的设计者。

```
传统模式（人→Agent）：
  人 → 写 prompt → Agent 输出 → 人读结果 → 人写新 prompt → ...
  人处于循环内部，每个步骤都需要手动干预

Loop 模式（人→系统→Agent）：
  人 → 设计 Loop → Loop 自动 prompt Agent → Loop 验证 → Loop 决定下一步
  人处于循环外部，从执行者变成了设计者
```

---

## 什么是 Loop Engineering？

根据 2026 年 AI 工程社区的共识：

> **Loop Engineering** 是构建驱动 AI Agent 的系统，而不是构建单个 prompt。

| 层级 | 关注点 | AliceGo 的角色 |
|------|--------|---------------|
| **Prompt Engineering** | 怎么跟模型说话 | ✅ 封装在 Agent 和 Skill 中 |
| **Harness Engineering** | 给模型造运行环境（静态基础设施） | ✅ `.trae/agents/`, `.trae/skills/`, `.trae/rules/` |
| **Loop Engineering** | 让运行环境自己跑起来（动态编排层） | ✅ **核心定位**：26步标准化 Loop |
| **Factory Model** | 多 Loop 协同产出软件 | 🔮 未来方向 |

**AliceGo 的价值**：将复杂的企业级软件交付流程固化为可复用的 Loop，让 AI Agent 在自主循环中完成高质量交付。

---

## 核心特性（Loop 的七个原语）

| 原语 | 作用 | AliceGo 实现 | 规则文件 |
|------|------|-------------|---------|
| **Automations** | 定时发现与分诊 | 文件变更触发测试、测试失败触发修复、评审通过自动进入下一步、预算预警自动通知（auto-001~auto-005） | [06_loop-automations.md](file:///c:/Users/12345678/Documents/trae_projects/AliceGo/.trae/rules/06_loop-automations.md) |
| **Worktrees** | 并行隔离 | 前后端任务并行开发、多特性并行开发、Git Worktree隔离机制、冲突检测与解决 | [07_loop-worktrees.md](file:///c:/Users/12345678/Documents/trae_projects/AliceGo/.trae/rules/07_loop-worktrees.md) |
| **Skills** | 固化项目知识 | 38个专业 Skill，封装最佳实践（需求分析、架构设计、代码生成、测试执行、回环执行、预算管理、回环监控等） | `.trae/skills/` |
| **Connectors** | 连接外部工具 | MCP Server（Memory、Playwright、Excel）+ Git Connector + CI Connector | MCP Server |
| **Sub-agents** | 制作与审查分离 | 17个专业 Agent，职责清晰（设计、开发、评审、支撑、Loop协调五类） | `.trae/agents/` |
| **State** | 跨会话记忆 | mcp_Memory + 四层记忆架构 + Loop状态机 + 回退状态记录 + 预算状态追踪 | [04_experience-knowledge.md](file:///c:/Users/12345678/Documents/trae_projects/AliceGo/.trae/rules/04_experience-knowledge.md) |
| **Budget** | Token 预算控制 | 项目级总预算（1,000,000 token）、阶段级预算分配、步骤级预算上限、三级预警机制（normal/warning/critical）、四级降级策略 | [05_loop-budget.md](file:///c:/Users/12345678/Documents/trae_projects/AliceGo/.trae/rules/05_loop-budget.md) |

---

## 快速开始

### 1. 安装 TRAE IDE

1. 访问 [TRAE 官网](https://www.trae.ai/)
2. 下载并安装 TRAE IDE
3. 使用 Google 账号或海外邮箱登录

### 2. 导入 AliceGo 项目

1. 打开 TRAE IDE
2. 选择 `打开文件夹` 或 `克隆仓库`
3. 将 AliceGo 项目导入到 TRAE

### 3. 配置 SOLO Agent

1. 在 TRAE 界面左上角切换到 **SOLO 模式**
2. 点击 AI 对话输入框左下角的 `@` 符号
3. 选择 **SOLO Agent**
4. 在 SOLO Agent 配置中，添加项目中的自定义 Agent：

```
设计 Agent：
  @architect          # 后端架构设计、API设计
  @frontend-designer  # 前端架构设计
  @dba                # 数据库设计
  @feature-analyst    # 特性需求分析

开发 Agent：
  @backend-dev        # 后端业务代码实现
  @frontend-dev       # 前端业务代码实现

评审 Agent：
  @code-reviewer      # 代码质量评审
  @design-reviewer    # 架构设计评审
  @test-reviewer      # 测试用例评审
  @req-reviewer       # 需求文档评审
  @ui-ux-reviewer     # UI/UX设计评审

支撑 Agent：
  @team-lead          # 流程指导、质量把关
  @qa                 # 测试用例设计、测试执行
  @devops             # 环境配置、CI/CD

Loop 协调 Agent：
  @loop-coordinator   # 回环流程协调与调度
  @loop-monitor       # 回环状态监控与预警
  @budget-manager     # 预算管理与降级策略
```

### 4. 启动 Loop

```
在 SOLO 对话框中输入自然语言需求：

"开发一个电商订单管理系统"

系统将自动启动 Loop，按以下流程自主执行：
1. 需求分析 → 2. 特性分解 → 3. 需求评审 → 4. 架构设计 → ... → 26. 项目总结
```

---

## Loop Specification（循环规范）

每个 AliceGo Loop 包含五个核心部分：

### 1. Trigger（触发）
- 用户输入自然语言需求（如："开发一个电商订单管理系统"）
- 定义可验证的终止条件

### 2. Goal（目标）
- 以自然语言描述项目需求
- 系统自动分解为特性清单
- 每个特性有明确的验收标准

### 3. Verification（验证）
- **需求评审**：@req-reviewer 验证需求完整性和清晰度
- **设计评审**：@design-reviewer + @ui-ux-reviewer 验证架构和设计
- **测试评审**：@test-reviewer 验证测试用例覆盖率
- **代码评审**：@code-reviewer 验证代码质量和设计一致性
- **测试执行**：@qa 验证所有测试通过

### 4. Stopping Rule（停止规则）
- 所有步骤完成且验证通过
- 迭代次数达到上限（最多 3 次）
- 用户手动终止

### 5. Memory（记忆）
- **L1 热记忆**：`rules/` 目录自动加载，零延迟访问（01_security-constraints.md、02_standards.md、03_workflow.md、04_experience-knowledge.md）
- **L2 工作记忆**：mcp_Memory KV存储，持久化项目状态（`.trae/memory/project_state.json`），支持断点续传
- **L3 情景记忆**：`rules/experience/` 目录，包含历史问题记录（PROB-XXX.md）、用户习惯偏好（USER-XXX.md）、项目经验总结（PROJ-XXX.md）
- **L4 结构化记忆**：IDE内置代码索引、Git历史、架构文档（`design/project_overview/`）

---

## Loop 执行流程

### Loop 拓扑图

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         AliceGo Loop Engineering 流程                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  步骤1: 项目初始化                                                              │
│       ↓                                                                         │
│  步骤2: 需求分析                                                                 │
│       ↓                                                                         │
│  步骤3: 特性需求分析 ───────────────────────────────────┐                        │
│       ↓                                                │                        │
│  步骤4: 需求评审 ←── 失败回退 ──────────────────────────┘ (最多3次迭代)           │
│       ↓ 通过                                                                    │
│  步骤5: 需求确认                                                                 │
│       ↓                                                                         │
│  ... (步骤6-11: 设计阶段)                                                        │
│       ↓                                                                         │
│  步骤12: 设计评审 ←── 失败回退 ───→ 步骤8/9/10/11 (最多3次迭代)                  │
│       ↓ 通过                                                                    │
│  步骤13-14: 设计修改与确认                                                       │
│       ↓                                                                         │
│  ... (步骤15-16: 任务拆解与测试设计)                                             │
│       ↓                                                                         │
│  步骤17: 测试评审 ←── 失败回退 ───→ 步骤16 (最多3次迭代)                          │
│       ↓ 通过                                                                    │
│  步骤18-19: 测试确认与任务分配                                                   │
│       ↓                                                                         │
│  步骤20: TDD开发执行                                                            │
│       ↓                                                                         │
│  步骤21: 代码评审 ←── 失败回退 ───→ 步骤22 (最多3次迭代)                          │
│       ↓ 通过                                                                    │
│  步骤22: 代码修改与验证 ─────────────┐                                          │
│       ↓ 完成                        │                                          │
│       └─────────────────────────────┘                                          │
│       ↓                                                                         │
│  步骤23: 测试执行                                                               │
│       ↓                                                                         │
│  ... (步骤24-26: 验收与交付)                                                     │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

**关键回环定义**：
- 🔄 **需求评审回环**：步骤4失败 → 回退步骤3 → 重试步骤4（最多3次）
- 🔄 **设计评审回环**：步骤12失败 → 回退步骤8/9/10/11 → 重试步骤12（最多3次）
- 🔄 **测试评审回环**：步骤17失败 → 回退步骤16 → 重试步骤17（最多3次）
- 🔄 **代码评审回环**：步骤21失败 → 回退步骤22 → 重试步骤21（最多3次）
```

### 四大阶段，26 步自主循环

| 阶段 | 步骤范围 | 核心 Loop | 验证者 |
|------|---------|----------|--------|
| **Phase 1** | 步骤 1-5 | 需求分析 → 特性分解 → 需求评审 → 用户确认 | @req-reviewer |
| **Phase 2** | 步骤 6-14 | 架构设计 → API设计 → 数据模型设计 → 设计评审 | @design-reviewer + @ui-ux-reviewer |
| **Phase 3** | 步骤 15-23 | 任务拆解 → TDD开发 → 代码评审 → 测试执行 | @code-reviewer + @qa |
| **Phase 4** | 步骤 24-26 | 最终验收 → 部署上线 → 项目总结 | 用户确认 + @devops |

### 评审环节（Loop 的关键验证点）

| 评审类型 | 执行者 | 验证范围 | 迭代上限 |
|---------|-------|---------|---------|
| 需求评审 | @req-reviewer | 需求文档、特性需求、MECE 原则 | 3 次 |
| 架构设计评审 | @design-reviewer | 后端架构、数据模型、API 设计 | 3 次 |
| UI/UX 设计评审 | @ui-ux-reviewer | 界面布局、交互设计、用户体验 | 3 次 |
| 测试评审 | @test-reviewer | 测试用例覆盖率、完整性 | 3 次 |
| 代码评审 | @code-reviewer | 代码质量、设计一致性、业务逻辑 | 3 次 |

---

## 项目结构

```
AliceGo/
├── .trae/
│   ├── agents/           # Sub-agents：专业角色定义（17个）
│   │   ├── architect.md
│   │   ├── backend-dev.md
│   │   ├── frontend-dev.md
│   │   ├── loop-coordinator.md
│   │   ├── loop-monitor.md
│   │   ├── budget-manager.md
│   │   └── ...
│   ├── skills/          # Skills：固化的工作流程（38个）
│   │   ├── architecture-planner/
│   │   ├── code-generator/
│   │   ├── test-case-design/
│   │   ├── dependency-checker/
│   │   ├── loop-executor/
│   │   ├── budget-manager/
│   │   ├── loop-monitor/
│   │   └── ...
│   ├── rules/           # Harness：行为约束（7个核心规则）
│   │   ├── 01_security-constraints.md
│   │   ├── 02_standards.md
│   │   ├── 03_workflow.md
│   │   ├── 04_experience-knowledge.md
│   │   ├── 05_loop-budget.md
│   │   ├── 06_loop-automations.md
│   │   ├── 07_loop-worktrees.md
│   │   └── experience/   # L3 情景记忆
│   │       ├── projects/    # 项目经验总结
│   │       └── preferences/ # 用户习惯偏好
│   ├── memory/          # L2 工作记忆（mcp_Memory 持久化）
│   ├── AGENTS.md        # Agent 知识地图
│   └── docs/            # 文档
│       ├── reference/memory-system.md
│       ├── memory-usage.md
│       └── state-management.md
├── design/              # 设计文档输出目录
│   ├── project_overview/
│   └── features/
├── src/                 # 源代码目录
│   ├── server/         # 后端代码
│   └── client/         # 前端代码
├── tests/               # 测试代码目录
└── infra/              # 部署配置目录
```

---

## 核心组件说明

### Agent（智能体）

Agent 是 Loop 中的专业角色，负责特定领域的任务：

| 类别 | Agent | 职责 |
|------|-------|------|
| **设计** | @architect | 后端架构设计、API 设计 |
| | @frontend-designer | 前端架构设计 |
| | @dba | 数据库设计 |
| | @feature-analyst | 特性需求分析 |
| **开发** | @backend-dev | 后端业务代码实现（TDD） |
| | @frontend-dev | 前端业务代码实现（TDD） |
| **评审** | @code-reviewer | 代码质量、设计一致性、业务逻辑评审 |
| | @design-reviewer | 架构设计评审 |
| | @test-reviewer | 测试用例评审 |
| | @req-reviewer | 需求文档评审 |
| | @ui-ux-reviewer | UI/UX 设计评审 |
| **支撑** | @team-lead | 流程指导、质量把关、任务拆解 |
| | @qa | 测试用例设计、测试执行 |
| | @devops | 环境配置、CI/CD、依赖管理 |
| **Loop协调** | @loop-coordinator | 回环流程协调、回退路径执行、迭代次数控制 |
| | @loop-monitor | 回环状态监控、异常检测、状态报告 |
| | @budget-manager | 预算追踪、预警触发、降级策略执行 |

### Skill（技能）

Skill 是固化的工作流程，将项目知识写入磁盘：

| Skill | 用途 | 触发场景 |
|-------|------|----------|
| `architecture-planner` | 架构设计 | "架构设计"、"系统设计" |
| `code-generator` | 代码生成（TDD） | "编写代码"、"实现功能" |
| `test-case-design` | 测试用例设计 | "测试用例"、"生成测试" |
| `test-review` | 测试评审 | "测试评审"、"评审测试" |
| `task-decomposition` | 任务拆解 | "任务拆解"、"分解任务" |
| `file-operation` | 文件操作 | 任何需要创建/修改文件的场景 |
| `api-designer` | API 设计 | "API 设计"、"接口文档" |
| `database-designer` | 数据库设计 | "数据库设计"、"数据模型" |
| `frontend-design` | 前端设计 | "前端设计"、"界面设计" |
| `dependency-checker` | 依赖检查 | 代码生成后自动检查 |
| `tdd-execution-verifier` | TDD 验证 | 验证 TDD 流程执行 |
| `loop-executor` | 回环执行 | 管理回环状态转换、执行回退路径、管理迭代次数 |
| `budget-manager` | 预算管理 | 追踪Token消耗、检查预算预警、触发降级策略 |
| `loop-monitor` | 回环监控 | 监控回环状态、收集执行数据、生成状态报告 |

### Rules（规则）

Rules 是全量加载的行为约束，定义 Agent 的底线行为：

| Rules | 描述 | 类型 |
|-------|------|------|
| `01_security-constraints.md` | 安全红线、禁止操作、输入验证 | L1 强制 |
| `02_standards.md` | Agent 领地划分、编码规范、代码质量、状态管理 | L2 标准 |
| `03_workflow.md` | 26 步流程定义、Loop 拓扑、回环机制 | L2 标准 |
| `04_experience-knowledge.md` | 四层记忆架构、历史问题库、用户习惯偏好、Loop状态机 | L2 标准 |
| `05_loop-budget.md` | 预算控制体系、三级预警机制、四级降级策略 | L2 标准 |
| `06_loop-automations.md` | 自动触发规则、文件变更触发测试、评审通过自动推进 | L2 标准 |
| `07_loop-worktrees.md` | 并行开发机制、前后端并行、Git Worktree隔离 | L2 标准 |

### MCP Server（连接器）

MCP 扩展 Agent 的能力，连接外部工具：

| Server | 用途 | 配置难度 |
|--------|------|---------|
| mcp_Memory | 记忆系统，持久化项目状态（L2 工作记忆） | ⭐ 简单 |
| mcp_Playwright | 浏览器自动化测试 | ⭐⭐ 中等 |
| mcp_Excel | Excel 文件操作 | ⭐⭐ 中等 |

---

## TDD 开发 Loop

AliceGo 的开发 Loop 遵循严格的 TDD 流程：

```
RED（失败）→ GREEN（通过）→ REFACTOR（重构）
    │              │              │
    ▼              ▼              ▼
1. 编写测试用例   3. 实现业务代码   5. 优化代码结构
2. 运行测试验证   4. 运行测试验证   6. 保持测试通过
   初始状态失败       全部测试通过       覆盖率 ≥ 95%
```

**测试覆盖率目标**：
- 核心业务逻辑：≥ 95%
- 公共 API：100%
- 数据模型：100%
- 安全相关代码：100%

---

## 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件夹 | kebab-case | `test-cases`、`api-contracts` |
| 文件 | kebab-case | `requirements-spec.md` |
| 类/组件 | PascalCase | `UserService`、`LoginForm` |
| 变量/函数 | camelCase | `userName`、`getUserInfo` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY`、`API_BASE_URL` |

---

## 常见问题

### Q1: Loop 和 Harness 有什么区别？

**Harness** 是静态的基础设施，解决「Agent 能不能跑」：
- Agent 定义、Skill 封装、Rules 约束

**Loop** 是动态的编排层，解决「Agent 跑不跑、怎么跑、跑到什么时候停」：
- 26 步流程编排、Loop 拓扑回环、自动推进、验证终止

### Q2: 如何自定义 Loop？

修改 `.trae/rules/03_workflow.md` 中的流程定义，或创建新的 Skill 来扩展 Loop 行为。

### Q3: 如何恢复中断的项目？

系统使用 `mcp_Memory` 持久化状态。重新打开项目后，SOLO Agent 会自动读取状态并继续执行。

### Q4: 如何跳过评审环节？

评审环节是 Loop 的验证点，不能跳过。迭代次数最多 3 次，达到上限后系统会升级给用户决策。

### Q5: 如何添加新的 Agent 或 Skill？

**Agent**：在 `.trae/agents/` 目录创建新的 `.md` 文件，定义角色和职责。

**Skill**：在 `.trae/skills/` 目录创建新文件夹，包含 `SKILL.md` 定义执行流程。

---

## 参考文档

- [TRAE IDE 官方文档](https://docs.trae.cn/)
- [SOLO Agent 使用指南](https://docs.trae.cn/ide/solo-coder)
- [Model Context Protocol (MCP)](https://docs.trae.cn/ide/model-context-protocol)
- [Agent 知识地图](./.trae/AGENTS.md)
- [记忆系统设计](./.trae/docs/reference/memory-system.md)
- [记忆系统使用规范](./.trae/docs/memory-usage.md)
- [状态管理与断点续传](./.trae/docs/state-management.md)

---

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

*最后更新：2026-07-18*