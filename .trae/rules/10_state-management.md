# 状态管理规范（L2）

## 1. 概述

本规范定义如何在mcp_Memory中管理项目流程状态，确保SOLO Coder能够追踪进度、支持中断续传、管理迭代次数。

---

## 2. 状态类型定义

### 2.1 流程状态（workflow_status）

| 状态值 | 说明 | 转换时机 |
|--------|------|----------|
| `initialized` | 已初始化 | 项目创建时 |
| `in_progress` | 进行中 | 开始第一步时 |
| `paused` | 已暂停 | 用户中断时 |
| `completed` | 已完成 | 所有步骤完成 |
| `cancelled` | 已取消 | 用户取消时 |

### 2.2 步骤状态（step_status）

| 状态值 | 说明 | 转换时机 |
|--------|------|----------|
| `pending` | 未开始 | 步骤创建时 |
| `in_progress` | 进行中 | 步骤开始执行 |
| `waiting_review` | 等待评审 | 提交评审时 |
| `approved` | 已通过 | 评审通过 |
| `rejected` | 未通过 | 评审不通过 |
| `completed` | 已完成 | 步骤完成 |
| `skipped` | 已跳过 | 用户跳过 |

### 2.3 任务状态（task_status）

| 状态值 | 说明 |
|--------|------|
| `pending` | 未开始 |
| `in_progress` | 开发中 |
| `code_review` | 代码评审中 |
| `test_execution` | 测试执行中 |
| `done` | 已完成 |

---

## 3. 记忆系统数据结构

### 3.1 项目状态（project_state）

存储在mcp_Memory的 `project/{project_id}/state` 路径：

```json
{
  "project_id": "project-001",
  "project_name": "电商网站",
  "workflow_status": "in_progress",
  "current_step": 4,
  "created_at": "2026-05-08T10:00:00Z",
  "updated_at": "2026-05-08T14:30:00Z",
  "created_by": "SOLO Coder"
}
```

### 3.2 步骤状态（step_states）

存储在mcp_Memory的 `project/{project_id}/steps/{step_id}` 路径：

```json
{
  "step_id": 4,
  "step_name": "需求评审",
  "status": "approved",
  "iteration": 1,
  "max_iterations": 3,
  "started_at": "2026-05-08T14:00:00Z",
  "completed_at": "2026-05-08T14:30:00Z",
  "review_report": "design/project_overview/reviews/requirements-20260508.md",
  "feedback_json": "design/project_overview/feedback/req-review-20260508.json"
}
```

### 3.3 迭代记录（iteration_records）

存储在mcp_Memory的 `project/{project_id}/iterations/{step_id}` 路径：

```json
{
  "step_id": 4,
  "iterations": [
    {
      "iteration": 1,
      "status": "rejected",
      "timestamp": "2026-05-08T14:10:00Z",
      "issues": ["文档格式不规范", "缺少风险评估"],
      "feedback": "请补充缺失内容"
    },
    {
      "iteration": 2,
      "status": "approved",
      "timestamp": "2026-05-08T14:30:00Z",
      "issues": []
    }
  ]
}
```

### 3.4 任务状态（task_states）

存储在mcp_Memory的 `project/{project_id}/tasks/{task_id}` 路径：

```json
{
  "task_id": "feature-001-task-001",
  "task_name": "用户模块开发",
  "status": "done",
  "assignee": "@backend-dev",
  "feature_id": "feature-001",
  "started_at": "2026-05-08T15:00:00Z",
  "completed_at": "2026-05-08T17:00:00Z",
  "code_review_iteration": 1,
  "code_review_status": "approved"
}
```

---

## 4. 状态转换规则

### 4.1 步骤状态转换

```
pending → in_progress → waiting_review
                              ↓
                    approved ← rejected
                         ↓         ↓
                    completed   in_progress（修改后重新提交）
```

### 4.2 迭代次数规则

- 每个评审步骤最多迭代3次
- 每次提交评审时，迭代次数+1
- 达到3次且仍不通过时，状态升级为 `escalation_required`

### 4.3 升级机制

当迭代次数达到上限时，在记忆系统中设置：

```json
{
  "step_id": 4,
  "escalation_required": true,
  "escalation_reason": "达到最大迭代次数（3次），仍有问题未解决",
  "pending_issues": [
    {
      "issue_id": "Q-001",
      "description": "需求描述不够清晰",
      "severity": "high"
    }
  ],
  "user_options": [
    "接受当前状态，继续下一环节",
    "继续迭代（超出3次限制）",
    "取消该环节，调整方案"
  ]
}
```

---

## 5. 状态查询操作

### 5.1 查询当前步骤
```bash
# 查询项目当前步骤
mcp_memory_read path="project/{project_id}/state"
```

### 5.2 查询步骤详情
```bash
# 查询特定步骤的状态
mcp_memory_read path="project/{project_id}/steps/{step_id}"
```

### 5.3 查询任务列表
```bash
# 查询所有任务状态
mcp_memory_read path="project/{project_id}/tasks"
```

### 5.4 查询迭代历史
```bash
# 查询评审迭代历史
mcp_memory_read path="project/{project_id}/iterations/{step_id}"
```

---

## 6. 状态更新操作

### 6.1 更新项目状态
```bash
mcp_memory_update
{
  "path": "project/{project_id}/state",
  "data": {
    "workflow_status": "in_progress",
    "current_step": 5,
    "updated_at": "2026-05-08T15:00:00Z"
  }
}
```

### 6.2 创建步骤状态
```bash
mcp_memory_create_entities
{
  "entities": [
    {
      "entityType": "StepState",
      "name": "project/{project_id}/steps/5",
      "observations": [
        "step_id: 5",
        "step_name: 需求确认",
        "status: pending"
      ]
    }
  ]
}
```

### 6.3 更新迭代记录
```bash
mcp_memory_create_relations
{
  "relations": [
    {
      "from": "project/{project_id}/steps/4",
      "relationType": "has_iteration",
      "to": "project/{project_id}/iterations/4/iteration-1"
    }
  ]
}
```

---

## 7. 断点续传机制

### 7.1 保存断点
当项目被中断时，自动保存：
1. 当前步骤编号
2. 所有步骤的当前状态
3. 进行中文档的路径
4. 迭代次数记录

### 7.2 恢复断点
当项目恢复时：
1. 读取 `project/{project_id}/state`
2. 确定当前步骤
3. 检查前置步骤是否完成
4. 从当前步骤继续

### 7.3 断点数据示例
```json
{
  "checkpoint": {
    "project_id": "project-001",
    "step": 7,
    "saved_at": "2026-05-08T18:00:00Z",
    "pending_inputs": [
      "design/features/feature-001/requirements.md"
    ],
    "pending_outputs": [
      "design/project_overview/frontend_architecture.md"
    ]
  }
}
```

---

## 8. SOLO Coder状态管理规范

### 8.1 启动项目时
1. 检查mcp_Memory中是否存在项目状态
2. 如存在，读取当前进度
3. 如不存在，创建新项目状态

### 8.2 每个步骤开始前
1. 检查前置步骤是否完成
2. 验证输入文档是否存在
3. 更新当前步骤状态为 `in_progress`

### 8.3 每个步骤完成后
1. 更新步骤状态为 `completed`
2. 记录完成时间
3. 更新项目当前步骤
4. 检查是否可以进入下一步

### 8.4 评审提交时
1. 检查当前迭代次数
2. 如<3次，允许提交
3. 如≥3次且不通过，触发升级机制
