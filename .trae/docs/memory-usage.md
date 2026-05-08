# 记忆系统使用规范

## 概述

本文档定义了mcp_Memory的使用标准、数据存储格式和最佳实践。

## 记忆系统数据类型

### 1. 项目状态 (project_state)

```json
{
  "type": "project_state",
  "name": "项目名称",
  "status": "planning|designing|developing|testing|deploying|completed",
  "current_phase": "需求分析",
  "started_at": "2026-05-10T10:00:00Z",
  "last_updated": "2026-05-10T10:30:00Z",
  "progress": 15,
  "milestones": [
    {
      "name": "需求分析",
      "status": "completed",
      "completed_at": "2026-05-10T10:30:00Z"
    }
  ]
}
```

### 2. 评审迭代 (review_iteration)

```json
{
  "type": "review_iteration",
  "review_type": "requirements|design|test|code",
  "iteration": 1,
  "max_iterations": 3,
  "started_at": "2026-05-10T10:00:00Z",
  "last_updated": "2026-05-10T10:30:00Z",
  "history": [
    {
      "iteration": 1,
      "status": "needs_revision",
      "timestamp": "2026-05-10T10:30:00Z",
      "issues_count": 3,
      "review_report_path": "design/project_overview/reviews/..."
    }
  ]
}
```

### 3. 任务状态 (task_state)

```json
{
  "type": "task_state",
  "task_id": "T001",
  "feature_id": "feature-001",
  "name": "任务名称",
  "assignee": "backend-dev",
  "status": "pending|in_progress|completed|blocked",
  "priority": "high|medium|low",
  "created_at": "2026-05-10T10:00:00Z",
  "started_at": "2026-05-10T10:15:00Z",
  "completed_at": null,
  "dependencies": ["T002"],
  "blockers": [],
  "progress": 50
}
```

### 4. 重要决策 (important_decision)

```json
{
  "type": "important_decision",
  "decision_id": "D001",
  "title": "决策标题",
  "description": "决策详细描述",
  "context": "决策背景",
  "options": ["选项A", "选项B"],
  "selected_option": "选项A",
  "reason": "选择理由",
  "made_by": "team-lead",
  "made_at": "2026-05-10T10:00:00Z",
  "impact": "影响描述"
}
```

### 5. 需求变更 (requirement_change)

```json
{
  "type": "requirement_change",
  "change_id": "C001",
  "feature_id": "feature-001",
  "description": "变更描述",
  "reason": "变更原因",
  "impact": "影响范围",
  "changed_by": "team-lead",
  "changed_at": "2026-05-10T10:00:00Z",
  "approved_by": "用户",
  "approved_at": "2026-05-10T10:30:00Z"
}
```

### 6. 问题记录 (issue_record)

```json
{
  "type": "issue_record",
  "issue_id": "I001",
  "title": "问题标题",
  "description": "问题描述",
  "severity": "high|medium|low",
  "status": "open|in_progress|resolved|closed",
  "reported_by": "qa",
  "reported_at": "2026-05-10T10:00:00Z",
  "assigned_to": "backend-dev",
  "resolved_at": null,
  "resolution": null
}
```

## 记忆系统命名规范

### Key格式

```
{type}:{identifier}
```

示例：
- `project_state:main`
- `review_iteration:requirements`
- `task_state:T001`
- `important_decision:D001`

## 记忆系统使用场景

### 1. Team Lead使用场景

- 记录项目整体状态
- 保存任务分配信息
- 记录重要决策
- 跟踪评审迭代次数
- 保存用户确认信息

### 2. 评审Agent使用场景

- 记录评审迭代次数
- 保存评审历史
- 跟踪问题修复状态

### 3. 开发Agent使用场景

- 记录任务进度
- 保存开发决策
- 记录遇到的问题

### 4. QA使用场景

- 记录测试结果
- 跟踪问题状态
- 保存测试报告

## 记忆系统操作规范

### 1. 读取操作

```javascript
// 读取项目状态
const projectState = await memory.get('project_state:main');

// 读取评审迭代
const reviewIteration = await memory.get('review_iteration:requirements');
```

### 2. 写入操作

```javascript
// 保存项目状态
await memory.set('project_state:main', projectState);

// 保存评审迭代
await memory.set('review_iteration:requirements', reviewIteration);
```

### 3. 查询操作

```javascript
// 查询所有任务状态
const tasks = await memory.query({ type: 'task_state' });

// 查询特定特性的任务
const featureTasks = await memory.query({
  type: 'task_state',
  feature_id: 'feature-001'
});
```

## 记忆系统最佳实践

### 1. 数据完整性

- 每次更新后及时保存到记忆系统
- 包含必要的时间戳
- 记录变更历史

### 2. 数据一致性

- 遵循统一的数据格式
- 相关数据保持同步
- 定期清理过期数据

### 3. 性能考虑

- 避免存储过大的数据
- 大文件应保存在文件系统，记忆系统只保存路径
- 定期归档历史数据

### 4. 容错处理

- 读取失败时有默认值
- 写入失败时有重试机制
- 数据损坏时有恢复策略

## 记忆系统初始化

项目开始时，初始化以下基础数据：

```json
{
  "project_state:main": {
    "type": "project_state",
    "name": "新项目",
    "status": "planning",
    "current_phase": "初始化",
    "started_at": "2026-05-10T10:00:00Z",
    "last_updated": "2026-05-10T10:00:00Z",
    "progress": 0
  }
}
```

## 记忆系统归档

项目完成后，将记忆系统数据归档保存：

```
design/project_overview/memory-archive-{timestamp}.json
```
