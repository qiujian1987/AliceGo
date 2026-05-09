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
- **执行者**：@req-reviewer（**必须调用，不得自行评审**）
- **触发条件**：
  1. 步骤3完成（状态=completed）
  2. 迭代次数<3
- **前置检查**：
  1. 查询mcp_Memory确认步骤3状态
  2. 验证输入文档存在
  3. 确认@req-reviewer Agent可用
- **输入**：`design/project_overview/requirements_spec.md` + `design/features/*/requirements.md`
- **输出**：
  - 评审报告：`design/project_overview/reviews/requirements-{timestamp}.md`
  - 反馈JSON：`design/project_overview/feedback/req-review-{timestamp}.json`
  - 迭代次数更新（mcp_Memory）
  - 步骤状态更新（mcp_Memory）
- **迭代控制**：最多3次，通过mcp_Memory记录
- **强制规则**：必须调用 @req-reviewer，SOLO Coder不得自行执行评审
- **验证机制**：评审完成后检查`verified_by`字段是否为`@req-reviewer`
- **SOLO Coder操作**：调用 @req-reviewer 进行需求评审

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
- **执行者**：@design-reviewer（**必须调用，不得自行评审**）
- **触发条件**：
  1. 步骤8完成（状态=completed）
  2. 步骤10完成（状态=completed）
  3. 迭代次数<3
- **前置检查**：
  1. 查询mcp_Memory确认步骤8和10状态
  2. 验证输入文档存在
  3. 确认@design-reviewer Agent可用
- **输入**：`design/project_overview/backend_architecture.md` + `design/project_overview/frontend_architecture.md`
- **输出**：
  - 评审报告：`design/project_overview/reviews/design-{timestamp}.md`
  - 反馈JSON：`design/project_overview/feedback/design-review-{timestamp}.json`
  - 步骤状态更新（mcp_Memory）
- **迭代控制**：最多3次，通过mcp_Memory记录
- **强制规则**：必须调用 @design-reviewer，SOLO Coder不得自行执行评审
- **验证机制**：评审完成后检查`verified_by`字段是否为`@design-reviewer`
- **SOLO Coder操作**：调用 @design-reviewer 进行设计评审

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
- **输出**：`design/project_overview/api_contracts.md` + `design/features/*/api.md` + `design/project_overview/api_checklist.md`
- **API完整性检查清单（必须完成）**：
  1. **CRUD操作完整性**：每个主要实体必须有Create/Read/Update/Delete端点
  2. **数据模型覆盖**：所有数据模型表必须有对应的API
  3. **特性需求覆盖**：每个特性需求必须有对应的API实现
  4. **输入验证**：所有API必须有输入参数验证规则
  5. **错误处理**：所有API必须有错误响应格式定义
  6. **认证授权**：所有API必须有认证/授权说明
  7. **分页机制**：列表类API必须有分页说明
  8. **速率限制**：所有API必须有速率限制说明
  9. **文档完整性**：每个API必须有示例请求和响应
  10. **版本管理**：API版本策略必须明确
- **完整性验证文件**：生成 `design/project_overview/api_checklist.md`，记录每个检查项的完成状态
- **验证机制**：
  - API设计完成后，必须检查所有特性都有对应的API
  - 必须检查所有数据模型都有对应的CRUD操作
  - 完整性检查结果记录到mcp_Memory
  - 只有完整性检查通过后才能进入步骤16
- **SOLO Coder操作**：调用 @architect，并验证API完整性

---

**步骤16：API确认**
- **执行者**：SOLO Coder + 用户
- **触发条件**：API设计完成且完整性检查通过
- **前置检查**：
  1. 验证 `design/project_overview/api_checklist.md` 存在
  2. 验证所有检查项状态为`completed`
  3. 验证 `design/features/*/api.md` 存在
  4. 验证每个特性都有对应的API
- **输入**：
  - `design/project_overview/api_contracts.md`
  - `design/project_overview/api_checklist.md`
- **输出**：用户确认记录（mcp_Memory）
- **完整性确认提示**：向用户展示API覆盖情况，确认所有功能完整性
- **SOLO Coder操作**：验证API完整性并等待用户确认

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
- **执行者**：@test-reviewer（**必须调用，不得自行评审**）
- **触发条件**：
  1. 步骤20完成（状态=completed）
  2. 迭代次数<3
- **前置检查**：
  1. 查询mcp_Memory确认步骤20状态
  2. 验证输入文档存在
  3. 确认@test-reviewer Agent可用
- **输入**：`design/features/*/test-cases.md`
- **输出**：
  - 评审报告：`design/project_overview/reviews/test-{timestamp}.md`
  - 反馈JSON：`design/project_overview/feedback/test-review-{timestamp}.json`
  - 步骤状态更新（mcp_Memory）
- **迭代控制**：最多3次，通过mcp_Memory记录
- **强制规则**：必须调用 @test-reviewer，SOLO Coder不得自行执行评审
- **验证机制**：评审完成后检查`verified_by`字段是否为`@test-reviewer`
- **SOLO Coder操作**：调用 @test-reviewer 进行测试评审

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
- **执行者**：@code-reviewer（**必须调用，不得自行评审**）
- **触发条件**：
  1. 单个任务开发完成（状态=done）
  2. 迭代次数<3
- **前置检查**：
  1. 查询mcp_Memory确认任务状态
  2. 验证代码文件存在
  3. 确认@code-reviewer Agent可用
- **输入**：`src/server/` 或 `src/client/` 中的相关代码
- **输出**：
  - 评审报告：`design/project_overview/reviews/code-{task-id}-{timestamp}.md`
  - 反馈JSON：`design/project_overview/feedback/code-review-{task-id}-{timestamp}.json`
  - 步骤状态更新（mcp_Memory）
- **迭代控制**：最多3次，通过mcp_Memory记录
- **通过条件**：所有测试通过，代码符合规范
- **强制规则**：必须调用 @code-reviewer，SOLO Coder不得自行执行评审
- **验证机制**：评审完成后检查`verified_by`字段是否为`@code-reviewer`
- **SOLO Coder操作**：调用 @code-reviewer 进行代码评审

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

---

## 6. 工作流程标准

### 6.1 开发流程

#### 核心流程
1. 需求分析 → 需求对齐 → 架构设计 → 任务分配
2. 数据模型设计 → API设计 → SQL编写 → 代码开发（TDD）
3. 代码审查 → 测试执行 → 集成部署 → 监控维护

#### TDD流程
- 先编写测试用例
- 实现代码使测试通过
- 验证测试覆盖率

### 6.2 环境配置

- **开发环境**：local
- **测试环境**：staging
- **生产环境**：production

### 6.3 分支策略

#### 分支命名
- `main`：主分支，稳定版本
- `develop`：开发分支
- `feature/*`：特性分支
- `bugfix/*`：修复分支

#### 合并流程
- 特性分支 → develop（PR审查）
- develop → main（发布前）

### 6.4 发布流程

#### 版本号规范
- 语义化版本：MAJOR.MINOR.PATCH
- 示例：1.0.0, 1.1.0, 1.1.1

#### 发布步骤
1. 更新版本号
2. 编写发布说明
3. 执行构建验证
4. 部署到生产环境
5. 执行健康检查
