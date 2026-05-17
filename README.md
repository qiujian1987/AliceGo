# AliceGo - TRAE IDE 多 Agent 协同 Harness 工程

## 项目介绍

AliceGo 是一个面向企业级 B 端系统的多 Agent 协同开发框架，基于 TRAE IDE 和 SOLO Coder 实现端到端交付，提高代码质量和开发效率。

### 核心特性

- 🤖 **多 Agent 协同**：通过专业化的 Agent 分工，实现复杂任务的协同处理
- 📋 **标准化流程**：28 步标准化开发流程，覆盖从需求到交付的全生命周期
- 🔄 **TDD 开发**：测试驱动的开发方法，确保代码质量和测试覆盖率
- 📚 **渐进式披露**：基于 Skill 的按需加载机制，减少 Token 消耗
- 🛡️ **Harness Engineering**：完善的约束和治理机制，确保 Agent 行为可控

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
   - `@architect`
   - `@backend-dev`
   - `@frontend-dev`
   - `@team-lead`
   - `@qa`
   - `@dba`
   - `@test-reviewer`
   - `@req-reviewer`
   - `@design-reviewer`
   - `@code-reviewer`
   - `@devops`
   - `@feature-analyst`
   - `@frontend-designer`

### 4. 开始使用

1. 在 SOLO 对话框中输入项目需求
2. SOLO Agent 会自动分析需求并规划任务
3. 根据规划，SOLO Agent 会调用相应的 Agent 完成开发任务
4. 你可以通过对话与 SOLO Agent 交互，监控系统进度

---

## 核心概念

### Agent（智能体）

Agent 是具有特定角色和职责的 AI 助手。AliceGo 包含以下 Agent：

#### 设计 Agent

| Agent | 职责 | 输出 |
|-------|------|------|
| `@architect` | 后端架构设计、API 设计 | `backend_architecture.md` |
| `@frontend-designer` | 前端架构设计 | `frontend_architecture.md` |
| `@dba` | 数据库设计 | `data_model.md` |
| `@feature-analyst` | 特性需求分析 | `features/*/requirements.md` |

#### 开发 Agent

| Agent | 职责 | 输出 |
|-------|------|------|
| `@backend-dev` | 后端业务代码实现 | `src/server/` |
| `@frontend-dev` | 前端业务代码实现 | `src/client/` |

#### 评审 Agent

| Agent | 职责 | 输出 |
|-------|------|------|
| `@code-reviewer` | 代码质量评审 | 评审报告 |
| `@design-reviewer` | 架构设计评审 | 评审报告 |
| `@test-reviewer` | 测试用例评审 | 评审报告 |
| `@req-reviewer` | 需求文档评审 | 评审报告 |

#### 支撑 Agent

| Agent | 职责 | 输出 |
|-------|------|------|
| `@team-lead` | 流程指导、质量把关 | 咨询建议 |
| `@qa` | 测试用例设计、测试执行 | `features/*/test-cases.md` |
| `@devops` | 环境配置、CI/CD | 部署配置 |

### Skill（技能）

Skill 是封装了特定任务流程的技能包。AliceGo 包含以下核心 Skill：

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

详细调用规范请参考：[Skill 调用规范](./.trae/docs/reference/skill-invocation.md)

### MCP Server（MCP 服务器）

MCP（Model Context Protocol）扩展 Agent 的能力。推荐配置：

| Server | 用途 | 配置难度 |
|--------|------|---------|
| mcp_Memory | 记忆系统，持久化项目状态 | ⭐ 简单 |
| mcp_Playwright | 浏览器自动化测试 | ⭐⭐ 中等 |
| mcp_Excel | Excel 文件操作 | ⭐⭐ 中等 |

详细配置请参考：[MCP Server 配置指南](./.trae/docs/getting-started/mcp-server-config.md)

### 示例项目

学习 AliceGo 最好的方式是参考示例项目：

| 项目 | 复杂度 | 说明 |
|------|--------|------|
| [简单待办事项应用](./.trae/examples/01_simple_todo/) | 简单 | 完整的需求、设计、测试示例 |

详细示例请参考：[示例项目列表](./.trae/examples/README.md)

### Rules（规则）

Rules 是全量加载的行为约束规范，定义了 Agent 的底线行为。AliceGo 包含以下 Rules：

| Rules | 描述 |
|-------|------|
| `01_security-constraints.md` | 安全约束规则 |
| `02_standards.md` | 标准规范（编码、质量、状态管理等） |
| `03_workflow.md` | 流程调度规则 |

---

## 开发流程

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

| 评审类型 | 执行者 | 评审范围 | 迭代次数 |
|---------|-------|---------|---------|
| 需求评审 | @req-reviewer | 需求文档、特性需求 | 最多 3 次 |
| 设计评审 | @design-reviewer | 架构、数据模型、API | 最多 3 次 |
| 测试评审 | @test-reviewer | 测试用例 | 最多 3 次 |
| 代码评审 | @code-reviewer | 开发代码 | 最多 3 次 |

---

## 项目结构

```
AliceGo/
├── .trae/
│   ├── agents/           # Agent 提示词定义
│   │   ├── architect.md
│   │   ├── backend-dev.md
│   │   ├── frontend-dev.md
│   │   └── ...（13个Agent）
│   ├── skills/          # Skill 技能包
│   │   ├── architecture-planner/
│   │   ├── code-generator/
│   │   ├── test-case-design/
│   │   └── ...（19个Skill）
│   ├── rules/           # Rules 规则
│   │   ├── 01_security-constraints.md
│   │   ├── 02_standards.md
│   │   ├── 06_workflow.md
│   │   └── 00_index.md
│   ├── AGENTS.md        # Agent 知识地图
│   └── documents/       # 项目文档
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

## 文件操作规范

**必须使用** `file-operation` **Skill** 进行所有文件操作

### 常用操作

| 场景 | 操作 | Skill调用 |
|------|------|-----------|
| 创建文档 | 创建新文件 | `file-operation.createFile()` |
| 修改文档 | 修改已有文件 | `file-operation.modifyFile()` |
| 删除文件 | 删除文件 | `file-operation.deleteFile()` |
| 创建目录 | 创建新目录 | `file-operation.createDirectory()` |
| 读取文件 | 读取文件内容 | `file-operation.readFile()` |

### 操作示例

```
[文件操作]
- 操作：创建
- 文件：design/project_overview/requirements_spec.md
- 调用：file-operation.createFile({
    filePath: "design/project_overview/requirements_spec.md",
    content: "# 需求规约\n\n..."
  })
```

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

## TDD 开发规范

### 流程

1. **阅读测试用例**：仔细阅读 `test-cases.md`，理解所有测试场景
2. **编写失败测试**：编写单元测试，确保测试初始状态为失败
3. **实现业务逻辑**：编写业务代码，使所有测试通过
4. **执行自测**：运行所有单元测试，确保 100% 通过
5. **代码重构**：优化代码结构，保持所有测试通过

### 测试覆盖率目标

- 核心业务逻辑：≥ 80%
- 公共 API：100%
- 数据模型：100%
- 安全相关代码：100%

---

## 常见问题

### Q1: 如何让 Agent 调用特定的 Skill？

在 Agent 的提示词中，已经定义了 Skill 调用指引。当需要使用 Skill 时，Agent 会自动调用。

### Q2: 如何跳过评审环节？

评审环节是强制性的，不能跳过。迭代次数最多 3 次，达到上限后系统会升级给用户决策。

### Q3: 如何恢复中断的项目？

系统使用 `mcp_Memory` 记录项目状态。重新打开项目后，SOLO Agent 会自动读取状态并继续执行。

### Q4: 如何添加新的 Agent？

1. 在 `.trae/agents/` 目录创建新的 `.md` 文件
2. 定义 Agent 的角色、职责和能力边界
3. 在 SOLO Agent 配置中添加该 Agent

### Q5: 如何添加新的 Skill？

1. 在 `.trae/skills/` 目录创建新的 Skill 文件夹
2. 创建 `SKILL.md` 文件，定义 Skill 的触发条件和执行流程
3. 可选：创建 `scripts/` 目录，添加可执行脚本

---

## 参考文档

- [TRAE IDE 官方文档](https://docs.trae.cn/)
- [SOLO Agent 使用指南](https://docs.trae.cn/ide/solo-coder)
- [Model Context Protocol (MCP)](https://docs.trae.cn/ide/model-context-protocol)
- [AliceGo 优化计划](./.trae/documents/trae_harness_optimization_plan.md)
- [Agent 知识地图](./.trae/AGENTS.md)
- [SOLO Agent 配置指南](./.trae/docs/getting-started/solo-agent-config.md)
- [MCP Server 配置指南](./.trae/docs/getting-started/mcp-server-config.md)
- [Skill 结构规范](./.trae/skills/SKILL_STRUCTURE.md)
- [Skill 协作网络](./.trae/skills/SKILL_NETWORK.md)
- [示例项目列表](./.trae/examples/README.md)

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

*最后更新：2026-05-17*
