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

---

## 4. 状态查询操作

### 4.1 查询当前步骤
```bash
mcp_memory_read path="project/{project_id}/state"
```

### 4.2 查询步骤详情
```bash
mcp_memory_read path="project/{project_id}/steps/{step_id}"
```

### 4.3 查询任务列表
```bash
mcp_memory_read path="project/{project_id}/tasks"
```

---

## 5. 断点续传机制

### 5.1 保存断点
当项目被中断时，自动保存：
1. 当前步骤编号
2. 所有步骤的当前状态
3. 进行中文档的路径
4. 迭代次数记录

### 5.2 恢复断点
当项目恢复时：
1. 读取 `project/{project_id}/state`
2. 确定当前步骤
3. 检查前置步骤是否完成
4. 从当前步骤继续
