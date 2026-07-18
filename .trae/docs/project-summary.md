# AliceGo 项目摘要

## 🚀 新会话快速启动

将以下内容复制到新的TRAE对话中，即可快速恢复上下文：

```
#Workspace #Rule
我正在使用AliceGo项目，请基于项目规则和知识体系理解我的需求。
这是一个基于TRAE的Loop Engineering脚手架，包含17个Agent、38个Skill、7个规则文件和6个MCP服务器。
核心设计包括：四层记忆架构、四个回环机制、预算控制体系、自动触发规则、并行开发机制。
```

---

## 一、项目定位

**AliceGo** 是基于 TRAE IDE 的 **Loop Engineering 脚手架**，核心思想是从「人驱动 Agent」转向「人设计 Loop，Loop 驱动 Agent」。

**核心价值**：将复杂的企业级软件交付流程固化为可复用的 Loop，让 AI Agent 在自主循环中完成从需求到部署的全生命周期开发。

---

## 二、核心组件

### 1. Agent（17个）

| 分类 | Agent | 职责 |
|------|-------|------|
| **设计** | architect, dba, frontend-designer, feature-analyst | 架构设计、数据库设计、前端设计、需求分析 |
| **开发** | backend-dev, frontend-dev | 后端开发、前端开发 |
| **评审** | code-reviewer, design-reviewer, test-reviewer, req-reviewer, ui-ux-reviewer | 代码、设计、测试、需求、UI/UX评审 |
| **支撑** | team-lead, qa, devops | 流程指导、测试执行、CI/CD |
| **Loop协调** | loop-coordinator, loop-monitor, budget-manager | 回环调度、状态监控、预算管理 |

### 2. Skill（38个）

**核心Skill**：requirement-analyzer, architecture-planner, code-generator, test-driven-development, test-executor, git-commit, web-artisan

**Loop相关Skill**：loop-executor（回环执行）、budget-manager（预算管理）、loop-monitor（回环监控）

### 3. Rules（7个）

| 文件 | 内容 |
|------|------|
| `01_security-constraints.md` | 安全红线、禁止操作、输入验证 |
| `02_standards.md` | Agent领地划分、编码规范、状态管理 |
| `03_workflow.md` | 26步流程、Loop拓扑、四个回环 |
| `04_experience-knowledge.md` | 四层记忆架构、经验知识管理 |
| `05_loop-budget.md` | 预算控制体系、三级预警、四级降级 |
| `06_loop-automations.md` | 自动触发规则、智能修复 |
| `07_loop-worktrees.md` | 并行开发机制、Git Worktree隔离 |

### 4. MCP服务器（6个）

| 服务器 | 用途 |
|--------|------|
| mcp_Memory | 记忆持久化 |
| mcp_Playwright | 前端测试 |
| mcp_Excel | 数据管理 |
| integrated_browser | 浏览器操作 |
| git-mcp | Git版本控制 |
| database-mcp | 数据库操作 |

---

## 三、关键设计

### 1. Loop Engineering 七大原语

| 原语 | 实现 |
|------|------|
| **Automations** | 文件变更触发测试、测试失败触发修复、评审通过自动推进 |
| **Worktrees** | 前后端并行、多特性并行、Git Worktree隔离 |
| **Skills** | 38个专业Skill封装最佳实践 |
| **Connectors** | MCP Server连接外部工具 |
| **Sub-agents** | 17个专业Agent职责分离 |
| **State** | mcp_Memory + 四层记忆架构 + Loop状态机 |
| **Budget** | 三级预警（normal/warning/critical）+ 四级降级策略 |

### 2. 四层记忆架构

- **L1热记忆**：TRAE System Prompt自动注入规则文件
- **L2工作记忆**：mcp_Memory存储任务状态和上下文
- **L3情景记忆**：mcp_Memory索引 + 文件系统（.trae/rules/experience/）
- **L4结构化记忆**：IDE原生代码索引 + Git版本控制

### 3. Loop拓扑（四个回环）

| 回环 | 步骤 | 失败回退 | 最大重试 |
|------|------|---------|---------|
| 需求评审回环 | 步骤4 | 步骤3 | 3次 |
| 设计评审回环 | 步骤12 | 步骤8 | 3次 |
| 测试评审回环 | 步骤17 | 步骤16 | 3次 |
| 代码评审回环 | 步骤21 | 步骤20 | 3次 |

---

## 四、对话历史总结

### 1. 2026-07-18 MCP服务器完善
- 实现Git MCP（分支管理、提交、推送、合并、冲突检测）
- 实现Database MCP（数据库连接、CRUD、查询优化）
- 项目从C盘移动到D:\projects\AliceGo

### 2. 2026-07-18 Loop组件实现
- 创建loop-executor、budget-manager、loop-monitor Skill
- 创建loop-coordinator、loop-monitor、budget-manager Agent
- 更新README反映最新组件状态

### 3. 2026-07-12 Loop工程化改造
- 创建预算控制体系（05_loop-budget.md）
- 创建自动触发规则（06_loop-automations.md）
- 创建并行开发机制（07_loop-worktrees.md）
- 更新26步流程添加Loop拓扑
- 更新记忆架构添加Loop状态机
- 定位调整为Loop Engineering脚手架

### 4. 2026-05-31 经验知识管理
- 创建经验知识管理规则（04_experience-knowledge.md）
- 建立历史问题库、用户习惯偏好、项目经验总结机制

### 5. 2026-04-18 框架构建
- 讨论多Agent协同框架设计
- 实现记忆系统（解决50轮对话上下文丢失）
- 更新Agent配置符合TRAE平台规范

---

## 五、用户偏好与约束

### 用户偏好
- 沟通风格：简洁但完整的技术细节
- 工程方法：强调流程遵循、模块化设计、清晰的职责边界
- 问题解决：主动识别问题和优化工作流
- 文档：重视结构化、可检索的知识和经验总结

### 硬约束
- 所有开发必须遵循TDD，覆盖率≥95%
- 依赖必须由开发Agent识别，DevOps Agent安装验证
- 特性文件夹命名：`feature-{3-digit number}-{kebab-case name}`
- Agent-Skill-Rules边界必须严格维护

### 工程约定
- 增量需求和Bug修复必须遵循完整流程
- 代码评审包含7个专业维度：风格、性能、安全、可用性、设计一致性、业务逻辑正确性、DFX
- 记忆架构使用TRAE原生机制

---

## 六、使用说明

### 新对话恢复上下文
1. 输入 `#Workspace` 引用整个项目
2. 输入 `#Rule` 加载项目规则
3. 输入 `#Past Chats` 引用历史对话

### 核心文件位置
- **规则文件**：`.trae/rules/`
- **Agent定义**：`.trae/agents/`
- **Skill定义**：`.trae/skills/`
- **MCP配置**：`.trae/mcps/`
- **文档**：`.trae/docs/`

### 待完善项
- CI/CD MCP服务器（未来方向）

---

**最后更新**：2026-07-18  
**项目位置**：D:\projects\AliceGo  
**GitHub仓库**：https://github.com/qiujian1987/AliceGo