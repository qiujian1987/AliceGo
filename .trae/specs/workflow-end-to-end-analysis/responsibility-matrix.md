# Agent 责任分配矩阵

## 1. Agent 职责概览

| Agent名称 | 核心职责 | 主要输出文档 | 主要技能 |
|-----------|----------|-------------|---------|
| **Team Lead** | 需求分析、任务协调、进度监控、最终验收 | requirements_spec.md, project_plan.md | requirement-analyzer, project-planner |
| **req-reviewer** | 需求评审 | 需求评审报告 | - |
| **Architect** | 架构设计、API设计 | backend_architecture.md, frontend_architecture.md, api_contracts.md | architecture-planner, api-designer |
| **design-reviewer** | 设计评审 | 设计评审报告 | - |
| **DBA** | 数据模型设计、SQL优化 | data_model.md, schema.sql | database-designer, sql-optimizer |
| **Frontend Designer** | 前端界面设计 | frontend_design.md | frontend-design |
| **QA** | 测试用例设计、测试执行 | test-cases.md, 测试报告 | test-generator, test-executor |
| **test-reviewer** | 测试评审 | 测试评审报告 | - |
| **Backend Dev** | 后端开发、TDD | src/server/ 目录代码, 单元测试 | code-generator, test-generator |
| **Frontend Dev** | 前端开发、TDD | src/client/ 目录代码, 单元测试 | code-generator, test-generator |
| **code-reviewer** | 代码评审 | 代码评审报告 | code-review |
| **DevOps** | 环境配置、部署 | CI/CD配置, 部署脚本 | dependency-manager, devops-automation |
| **Feature Analyst** | 特性需求分析 | features/ 目录下的需求文档 | requirement-analyzer |

---

## 2. 流程环节责任分配

| 环节 | 负责人 | 协作人 | 输入 | 输出 |
|------|--------|--------|------|------|
| 1. 项目初始化 | DevOps | - | 用户需求 | 项目目录结构, .git, 初始配置 |
| 2. 需求分析 | Team Lead | - | 用户需求 | requirements_spec.md |
| 3. 特性需求分析 | Feature Analyst | Team Lead | requirements_spec.md | features/ 目录结构, 特性列表 |
| 4. 需求评审 | req-reviewer | - | requirements_spec.md, 特性需求文档 | 需求评审报告 |
| 5. 需求确认 | 用户 | Team Lead | 需求文档, 评审报告 | 确认状态 |
| 6. 特性分解 | Team Lead | - | 需求文档 | 特性划分方案 |
| 7. 特性规划确认 | 用户 | Team Lead | 特性划分方案 | 确认状态 |
| 8. 特性需求文档编写 | Feature Analyst | - | 需求文档, 特性列表 | 每个特性的 requirements.md |
| 9. 后端架构设计 | Architect | - | requirements_spec.md, 特性需求文档 | backend_architecture.md |
| 10. 前端架构设计 | Architect | - | requirements_spec.md, 特性需求文档 | frontend_architecture.md |
| 11. 设计评审 | design-reviewer | - | backend_architecture.md, frontend_architecture.md | 设计评审报告 |
| 12. 数据模型设计 | DBA | - | backend_architecture.md, 特性需求文档 | data_model.md, schema.sql |
| 13. 数据模型确认 | 用户 | Team Lead, DBA | data_model.md | 确认状态 |
| 14. API设计 | Architect | - | backend_architecture.md, data_model.md, 特性需求文档 | api_contracts.md, features/*/api.md |
| 15. API确认 | 用户 | Team Lead, Architect | api_contracts.md | 确认状态 |
| 16. 前端设计 | Frontend Designer | - | frontend_architecture.md, api_contracts.md, 特性需求文档 | frontend_design.md |
| 17. 前端设计确认 | 用户 | Team Lead, Frontend Designer | frontend_design.md | 确认状态 |
| 18. 任务拆解 | Team Lead | - | 所有设计文档 | project_plan.md, features/*/tasks/ 目录 |
| 19. 测试用例设计 | QA | - | 特性需求文档, API文档 | test-cases.md |
| 20. 测试评审 | test-reviewer | - | test-cases.md | 测试评审报告 |
| 21. 任务分配 | Team Lead | - | project_plan.md, tasks.md | 任务分配状态 |
| 22. TDD开发执行 | Backend Dev / Frontend Dev | - | 任务文档, API文档, 测试用例 | src/ 代码, tests/ 测试 |
| 23. 代码评审 | code-reviewer | - | 代码, 测试 | 代码评审报告 |
| 24. 测试执行 | QA | - | 代码, 测试用例 | 测试报告 |
| 25. 进度监控 | Team Lead | - | 所有输出 | 进度报告 |
| 26. 最终验收 | Team Lead + 用户 | - | 所有交付物 | 验收报告 |
| 27. 部署上线 | DevOps | - | 代码, 配置 | 上线环境 |
| 28. 项目总结 | Team Lead | - | 所有文档 | 项目总结报告 |

---

## 3. 文档所有权 (守护Agent)

| 文档/目录 | 守护Agent | 说明 |
|-----------|----------|------|
| design/project_overview/requirements_spec.md | Team Lead | 只有Team Lead可以修改 |
| design/project_overview/backend_architecture.md | Architect | 只有Architect可以修改 |
| design/project_overview/frontend_architecture.md | Architect | 只有Architect可以修改 |
| design/project_overview/data_model.md | DBA | 只有DBA可以修改 |
| design/project_overview/api_contracts.md | Architect | 只有Architect可以修改 |
| design/project_overview/project_plan.md | Team Lead | 只有Team Lead可以修改 |
| design/features/{feature-id}/ | Feature Analyst | 特性目录由Feature Analyst管理 |
| design/features/{feature-id}/tasks/ | Team Lead | 任务目录由Team Lead管理 |
| database/ | DBA | 数据库相关文件由DBA管理 |
| src/server/ | Backend Dev | 后端代码由Backend Dev管理 |
| src/client/ | Frontend Dev | 前端代码由Frontend Dev管理 |
| tests/ | QA | 测试代码由QA管理 |
| infra/ | DevOps | 基础设施配置由DevOps管理 |
| design/project_overview/reviews/ | 各评审Agent | 评审报告由对应评审Agent写入 |
| design/project_overview/feedback/ | Team Lead | 反馈文档由Team Lead协调 |

---

## 4. Agent 间协作流程

### 4.1 评审反馈流程

```
前置Agent → 生成文档 → Team Lead → 评审Agent → 评审报告
                                                          ↓
                                               [不通过] ← → [通过]
                                                          ↓
                      前置Agent ← 反馈文档 ← Team Lead ← 反馈处理
                          ↓
                       修改文档
                          ↓
                      重新提交 → ... (最多3次)
```

### 4.2 并行开发流程

```
特性A需求文档 ─┬─→ 特性A任务拆解 ─→ Backend Dev 开发特性A
              │
特性B需求文档 ─┼─→ 特性B任务拆解 ─→ Frontend Dev 开发特性B
              │
特性C需求文档 ─┴─→ 特性C任务拆解 ─→ (其他Agent) 开发特性C
```

---

## 5. 新增Agent 说明

### 5.1 Feature Analyst
- **角色定位**: 专门负责特性需求分析的Agent
- **核心职责**: 将整体需求分解为特性，编写详细的特性需求文档
- **工作流程**:
  1. 从Team Lead接收需求规约文档
  2. 分析需求，识别特性
  3. 为每个特性创建目录结构
  4. 编写特性需求文档
  5. 提交给Team Lead
- **领地**: `design/features/`

### 5.2 Frontend Designer
- **角色定位**: 专门负责前端界面设计的Agent
- **核心职责**: 基于架构和API设计，创建前端设计文档
- **工作流程**:
  1. 从Team Lead接收前端架构、API文档、特性需求
  2. 设计前端界面和交互
  3. 生成前端设计文档
  4. 提交给用户确认
- **领地**: `design/features/{feature-id}/frontend/`
- **技能**: frontend-design

---

## 6. 迭代控制机制

### 6.1 迭代记录存储

使用记忆系统存储迭代信息：

```json
{
  "workflow": "requirements-review",
  "iteration": 1,
  "max_iterations": 3,
  "started_at": "2026-05-10T10:00:00Z",
  "last_updated": "2026-05-10T10:30:00Z",
  "history": [
    {
      "iteration": 1,
      "status": "not-approved",
      "timestamp": "2026-05-10T10:30:00Z",
      "issues": ["Q-001", "Q-002"]
    }
  ]
}
```

### 6.2 迭代处理规则

- **迭代次数 < 3**: 反馈给前置Agent，继续迭代
- **迭代次数 == 3**: 
  - 如果仍不通过，升级到用户决策
  - 用户决定是接受当前状态、继续迭代，还是取消该环节

---

## 7. Skill 调用规范

### 7.1 Skill 输入格式

所有Skill调用统一使用JSON格式：

```json
{
  "skill": "skill-name",
  "params": {
    "param1": "value1",
    "param2": "value2"
  },
  "context": {
    "project_dir": "/path/to/project",
    "feature_id": "feature-001",
    "agent": "team-lead"
  }
}
```

### 7.2 Skill 输出格式

所有Skill返回统一JSON格式：

```json
{
  "status": "success",
  "data": {
    // Skill 特定数据
  },
  "output_files": [
    "/path/to/file1.md",
    "/path/to/file2.json"
  ],
  "message": "操作完成"
}
```

### 7.3 Skill 输出处理

1. Skill 优先生成文件（output_files）
2. 如果Agent需要数据，可以同时返回 data 字段
3. 文件格式遵循本文档定义的标准
