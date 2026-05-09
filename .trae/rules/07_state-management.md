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

---

## 6. 阶段检测规则

### 6.1 步骤完成验证机制

每个步骤完成后**必须**记录到mcp_Memory，**不依赖文件存在性判断**：

```json
{
  "step_id": 4,
  "step_name": "需求评审",
  "status": "completed",
  "completed_at": "2026-05-09T10:00:00Z",
  "output_files": [
    "design/project_overview/reviews/requirements-20260509.md"
  ],
  "verified_by": "@req-reviewer"
}
```

### 6.2 阶段检测流程

**步骤1：读取项目状态**
```bash
mcp_memory_read path="project/{project_id}/state"
```

**步骤2：验证前置步骤**
对于任何步骤N，必须验证步骤1到N-1的状态都是`completed`或`approved`

**步骤3：确定当前阶段**
```
阶段一（1-7）：项目初始化与需求分析
阶段二（8-18）：系统设计
阶段三（19-25）：任务规划与开发
阶段四（26-29）：验收与交付
```

### 6.3 阶段检测输出格式

```json
{
  "current_phase": "需求分析",
  "current_step": 4,
  "current_step_name": "需求评审",
  "step_status": "pending",
  "completed_steps": [1, 2, 3],
  "pending_steps": [4, 5, 6, ...],
  "recommendation": "调用 @req-reviewer 进行需求评审"
}
```

### 6.4 状态优先原则

| 判断依据 | 优先级 | 说明 |
|---------|--------|------|
| mcp_Memory记录 | 高 | 权威来源 |
| 文件存在性 | 低 | 仅作为参考 |
| 用户指示 | 最高 | 覆盖所有规则 |

### 6.5 检测失败处理

当检测到状态不一致时：
1. 输出警告信息
2. 显示当前状态和建议操作
3. 询问用户确认后继续

---

## 7. 评审Agent调用强制规则

### 7.1 必须调用Agent的步骤

| 步骤 | Agent | 说明 |
|------|-------|------|
| 步骤4 | @req-reviewer | 需求评审 |
| 步骤12 | @design-reviewer | 设计评审 |
| 步骤21 | @test-reviewer | 测试评审 |
| 步骤24 | @code-reviewer | 代码评审 |

### 7.2 调用验证机制

**前置检查**：
1. 确认Agent存在
2. 确认当前步骤需要调用Agent
3. 确认没有跳过标记

**调用格式**：
```
@agent-name [操作指令]
```

**示例**：
```
@req-reviewer 请对需求文档进行评审
```

**验证失败处理**：
1. 如果未调用Agent而直接完成评审，标记步骤状态为`invalid`
2. 输出错误信息
3. 要求重新执行并正确调用Agent
