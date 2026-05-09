# 流程调度规则（L1）

## 1. 流程概述

本规则定义SOLO Coder在项目开发过程中的28步标准流程。SOLO Coder作为主控，协调各专业Agent完成项目开发。

---

## 2. 完整流程定义

### 第一阶段：项目初始化与需求分析

**步骤1：项目初始化**
- **执行者**：@devops
- **触发条件**：用户启动新项目
- **输入**：用户需求概述
- **输出**：
  - 项目目录结构
  - `.git` 初始化
  - `mcp_Memory` 初始化项目状态
- **命令**：`/start` 或 `@devops`

---

**步骤2：需求分析**
- **执行者**：@team-lead（需求分析指导）
- **触发条件**：项目初始化完成
- **输入**：用户需求描述
- **输出**：`design/project_overview/requirements_spec.md`
- **文档路径**：`design/project_overview/requirements_spec.md`
- **SOLO Coder操作**：调用 @team-lead 进行需求分析

---

**步骤3：特性需求分析**
- **执行者**：@feature-analyst
- **触发条件**：需求分析完成
- **输入**：`design/project_overview/requirements_spec.md`
- **输出**：
  - `design/features/{feature-id}/requirements.md`（每个特性）
  - 特性列表（记录在mcp_Memory）
- **SOLO Coder操作**：调用 @feature-analyst

---

**步骤4：需求评审**
- **执行者**：@req-reviewer
- **触发条件**：特性需求分析完成
- **输入**：`design/project_overview/requirements_spec.md` + `design/features/*/requirements.md`
- **输出**：
  - 评审报告：`design/project_overview/reviews/requirements-{timestamp}.md`
  - 反馈JSON：`design/project_overview/feedback/req-review-{timestamp}.json`
  - 迭代次数更新（mcp_Memory）
- **迭代控制**：最多3次，通过mcp_Memory记录
- **SOLO Coder操作**：调用 @req-reviewer

---

**步骤5：需求确认**
- **执行者**：SOLO Coder + 用户
- **触发条件**：需求评审通过
- **输入**：需求评审报告
- **输出**：用户确认记录（mcp_Memory）
- **SOLO Coder操作**：展示评审通过结果，等待用户确认

---

### 第二阶段：系统设计

**步骤6：特性规划确认**
- **执行者**：SOLO Coder + 用户
- **触发条件**：需求确认完成
- **输入**：特性列表和划分方案
- **输出**：用户确认记录（mcp_Memory）

---

**步骤7：特性需求文档确认**
- **执行者**：SOLO Coder + 用户
- **触发条件**：特性规划确认完成
- **输入**：所有特性需求文档
- **输出**：用户确认记录（mcp_Memory）

---

**步骤8：后端架构设计**
- **执行者**：@architect
- **触发条件**：特性需求文档确认完成
- **输入**：`design/project_overview/requirements_spec.md` + `design/features/*/requirements.md`
- **输出**：`design/project_overview/backend_architecture.md`
- **SOLO Coder操作**：调用 @architect

---

**步骤9：后端架构确认**
- **执行者**：SOLO Coder + 用户
- **触发条件**：后端架构设计完成
- **输入**：`design/project_overview/backend_architecture.md`
- **输出**：用户确认记录（mcp_Memory）

---

**步骤10：前端架构设计**
- **执行者**：@architect
- **触发条件**：后端架构确认完成
- **输入**：`design/project_overview/requirements_spec.md` + `design/features/*/requirements.md`
- **输出**：`design/project_overview/frontend_architecture.md`
- **SOLO Coder操作**：调用 @architect

---

**步骤11：前端架构确认**
- **执行者**：SOLO Coder + 用户
- **触发条件**：前端架构设计完成
- **输入**：`design/project_overview/frontend_architecture.md`
- **输出**：用户确认记录（mcp_Memory）

---

**步骤12：设计评审**
- **执行者**：@design-reviewer
- **触发条件**：架构设计完成
- **输入**：`design/project_overview/backend_architecture.md` + `design/project_overview/frontend_architecture.md`
- **输出**：
  - 评审报告：`design/project_overview/reviews/design-{timestamp}.md`
  - 反馈JSON：`design/project_overview/feedback/design-review-{timestamp}.json`
- **迭代控制**：最多3次
- **SOLO Coder操作**：调用 @design-reviewer

---

**步骤13：数据模型设计**
- **执行者**：@dba
- **触发条件**：设计评审通过
- **输入**：`design/project_overview/backend_architecture.md` + `design/features/*/requirements.md`
- **输出**：
  - `design/project_overview/data_model.md`
  - `database/schema/schema.sql`
- **SOLO Coder操作**：调用 @dba

---

**步骤14：数据模型确认**
- **执行者**：SOLO Coder + 用户
- **触发条件**：数据模型设计完成
- **输入**：`design/project_overview/data_model.md`
- **输出**：用户确认记录（mcp_Memory）

---

**步骤15：API设计**
- **执行者**：@architect
- **触发条件**：数据模型确认完成
- **输入**：`design/project_overview/backend_architecture.md` + `design/project_overview/data_model.md` + `design/features/*/requirements.md`
- **输出**：`design/project_overview/api_contracts.md` + `design/features/*/api.md`
- **SOLO Coder操作**：调用 @architect

---

**步骤16：API确认**
- **执行者**：SOLO Coder + 用户
- **触发条件**：API设计完成
- **输入**：`design/project_overview/api_contracts.md`
- **输出**：用户确认记录（mcp_Memory）

---

**步骤17：前端设计**
- **执行者**：@frontend-designer
- **触发条件**：API确认完成
- **输入**：`design/project_overview/frontend_architecture.md` + `design/project_overview/api_contracts.md` + `design/features/*/requirements.md`
- **输出**：`design/features/{feature-id}/frontend_design.md`
- **SOLO Coder操作**：调用 @frontend-designer

---

**步骤18：前端设计确认**
- **执行者**：SOLO Coder + 用户
- **触发条件**：前端设计完成
- **输入**：前端设计文档
- **输出**：用户确认记录（mcp_Memory）

---

### 第三阶段：任务规划

**步骤19：任务拆解**
- **执行者**：@team-lead（任务拆解指导）
- **触发条件**：前端设计确认完成
- **输入**：所有设计文档
- **输出**：
  - `design/project_overview/project_plan.md`
  - `design/features/{feature-id}/tasks/{task-id}.md`
- **SOLO Coder操作**：调用 @team-lead 进行任务拆解

---

**步骤20：测试用例设计**
- **执行者**：@qa
- **触发条件**：任务拆解完成
- **输入**：`design/features/{feature-id}/requirements.md` + `design/project_overview/api_contracts.md` + 设计文档
- **输出**：`design/features/{feature-id}/test-cases.md`（每个特性）
- **SOLO Coder操作**：调用 @qa

---

**步骤21：测试评审**
- **执行者**：@test-reviewer
- **触发条件**：测试用例设计完成
- **输入**：`design/features/*/test-cases.md`
- **输出**：
  - 评审报告：`design/project_overview/reviews/test-{timestamp}.md`
  - 反馈JSON：`design/project_overview/feedback/test-review-{timestamp}.json`
- **迭代控制**：最多3次
- **SOLO Coder操作**：调用 @test-reviewer

---

**步骤22：任务分配**
- **执行者**：SOLO Coder
- **触发条件**：测试评审通过
- **输入**：任务列表和测试用例文档
- **输出**：
  - 任务分配记录（mcp_Memory）
  - 每个任务状态设置为`pending`

---

### 第四阶段：开发与测试

**步骤23：TDD开发执行**
- **执行者**：@backend-dev / @frontend-dev
- **触发条件**：任务分配完成
- **输入**：
  - 任务文档：`design/features/{feature-id}/tasks/{task-id}.md`
  - API文档：`design/project_overview/api_contracts.md`
  - 测试用例：`design/features/{feature-id}/test-cases.md`
- **输出**：
  - 代码：`src/server/` 或 `src/client/`
  - 单元测试：`tests/unit/`
  - 任务状态更新（mcp_Memory）
- **流程**：先写测试 → 实现代码 → 重构 → 自测通过
- **SOLO Coder操作**：调用 @backend-dev 或 @frontend-dev

---

**步骤24：代码评审（按任务）**
- **触发条件**：单个任务开发完成后
- **执行者**：@code-reviewer
- **输入**：`src/server/` 或 `src/client/` 中的相关代码
- **输出**：
  - 评审报告：`design/project_overview/reviews/code-{task-id}-{timestamp}.md`
  - 反馈JSON：`design/project_overview/feedback/code-review-{task-id}-{timestamp}.json`
- **迭代控制**：最多3次
- **通过条件**：所有测试通过，代码符合规范
- **SOLO Coder操作**：调用 @code-reviewer

---

**步骤25：测试执行**
- **触发条件**：所有开发任务完成并通过代码评审
- **执行者**：@qa
- **输入**：代码和测试用例文档
- **输出**：测试报告
- **SOLO Coder操作**：调用 @qa

---

**步骤26：进度监控**
- **执行者**：SOLO Coder
- **触发条件**：测试执行完成
- **输入**：所有输出文档
- **输出**：进度报告（mcp_Memory）

---

### 第五阶段：验收与交付

**步骤27：最终验收**
- **执行者**：SOLO Coder + 用户
- **触发条件**：测试通过
- **输入**：所有交付物
- **输出**：验收报告

---

**步骤28：部署上线**
- **执行者**：@devops
- **触发条件**：最终验收通过
- **输入**：所有代码和配置
- **输出**：上线环境
- **SOLO Coder操作**：调用 @devops

---

**步骤29：项目总结**
- **执行者**：SOLO Coder
- **触发条件**：部署上线完成
- **输入**：所有文档
- **输出**：项目总结报告

---

## 3. 迭代控制规则

### 3.1 迭代次数限制
- 每个评审环节（需求评审、设计评审、测试评审、代码评审）最多迭代3次
- 通过mcp_Memory记录当前迭代次数

### 3.2 迭代处理流程
```
迭代1次：评审 → 不通过 → 反馈 → 修改 → 重新评审
迭代2次：评审 → 不通过 → 反馈 → 修改 → 重新评审
迭代3次：评审 → 不通过 → 反馈 → 修改 → 重新评审
         ↓ (如果仍不通过)
        升级用户决策
```

### 3.3 迭代记录格式（mcp_Memory）
```json
{
  "workflow": "requirements-review",
  "iteration": 1,
  "max_iterations": 3,
  "started_at": "2026-05-10T10:00:00Z",
  "status": "in-progress"
}
```

---

## 4. 状态管理规则

### 4.1 流程状态定义
| 状态 | 说明 |
|------|------|
| `pending` | 未开始 |
| `in-progress` | 进行中 |
| `waiting-review` | 等待评审 |
| `approved` | 已通过 |
| `rejected` | 未通过（待修改） |
| `completed` | 已完成 |

### 4.2 状态更新时机
- 任务开始时：设置状态为 `in-progress`
- 提交评审时：设置状态为 `waiting-review`
- 评审通过时：设置状态为 `approved`
- 评审不通过时：设置状态为 `rejected`
- 任务完成时：设置状态为 `completed`

---

## 5. SOLO Coder操作规范

### 5.1 调用Agent格式
```
@agent-name [操作指令]
```

示例：
```
@req-reviewer 请对 requirements_spec.md 进行评审
@architect 请设计后端架构
```

### 5.2 流程状态检查
在每个步骤开始前，SOLO Coder应：
1. 检查mcp_Memory中的当前步骤状态
2. 确认前置步骤已完成
3. 验证输入文档存在

### 5.3 错误处理
- Agent调用失败：重试最多3次
- 文档不存在：提示用户或创建默认文档
- 评审不通过：按迭代控制规则处理
