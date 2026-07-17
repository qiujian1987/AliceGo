---
name: "loop-monitor"
description: "回环监控，监控回环状态、收集执行数据、生成状态报告、识别异常模式。触发场景：'状态报告'、'监控回环'、'异常检测'。"
---

# 回环监控 Skill

## 功能描述

回环监控Skill负责监控回环执行状态，收集回环执行数据，生成状态报告，并识别异常模式。提供实时状态监控和优化建议，确保Loop健康运行。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| project_id | string | 项目ID | 是 |
| monitor_scope | string | 监控范围（all/loop/budget/worktree） | 否 |
| report_type | string | 报告类型（summary/detailed/alert） | 否 |

## 输出格式

### 主要输出：JSON状态报告
```json
{
  "status": "success",
  "report_type": "summary",
  "project_state": {
    "project_id": "proj-001",
    "project_name": "电商订单管理系统",
    "workflow_status": "in_progress",
    "current_step": 12,
    "current_step_name": "设计评审",
    "last_updated": "2026-07-18T14:30:00Z"
  },
  "loop_status": {
    "current_loop": "design",
    "loop_iteration": 2,
    "max_loop_iteration": 3,
    "loop_history": [
      { "loop": "requirements", "iterations": 1, "result": "pass" },
      { "loop": "design", "iterations": 2, "result": "pending" }
    ]
  },
  "budget_status": {
    "total_budget": 1000000,
    "consumed_tokens": 350000,
    "remaining_tokens": 650000,
    "alert_status": "normal"
  },
  "worktree_status": {
    "parallel_tasks": 2,
    "completed_tasks": 1,
    "active_tasks": 1,
    "conflicts": 0
  },
  "alerts": [],
  "recommendations": [
    "设计评审第2次迭代，建议重点关注架构文档完整性"
  ],
  "message": "项目运行正常"
}
```

## 执行流程

1. 读取项目状态（从mcp_Memory）
2. 根据监控范围收集数据：
   - all：收集所有状态数据
   - loop：仅收集回环状态数据
   - budget：仅收集预算状态数据
   - worktree：仅收集并行任务状态数据
3. 分析数据，识别异常模式：
   - 回环迭代次数异常
   - 预算消耗异常
   - 并行任务冲突
   - 步骤执行时间异常
4. 生成状态报告：
   - summary：简要报告，包含关键指标
   - detailed：详细报告，包含完整数据
   - alert：仅包含异常和警告
5. 返回状态报告

## 监控指标

### 回环状态指标

| 指标 | 描述 | 正常范围 | 异常阈值 |
|------|------|---------|---------|
| loop_iteration | 当前回环迭代次数 | 1-3 | > 3 |
| loop_duration | 回环执行时间（分钟） | < 60 | > 120 |
| review_pass_rate | 评审通过率 | > 60% | < 40% |

### 预算状态指标

| 指标 | 描述 | 正常范围 | 异常阈值 |
|------|------|---------|---------|
| consumed_percentage | 预算消耗百分比 | < 70% | ≥ 85% |
| phase_over_budget | 阶段预算超支 | 否 | 是 |
| step_over_budget | 步骤预算超支 | 否 | 是 |

### 并行任务指标

| 指标 | 描述 | 正常范围 | 异常阈值 |
|------|------|---------|---------|
| parallel_task_count | 并行任务数 | 1-4 | > 4 |
| conflict_count | 冲突数量 | 0 | > 0 |
| task_completion_rate | 任务完成率 | > 80% | < 50% |

### 异常模式识别

| 异常类型 | 识别条件 | 处理建议 |
|---------|---------|---------|
| 回环死循环 | 同一回环迭代次数 > 3 | 升级给用户决策 |
| 预算超支 | 消耗 ≥ 85% | 触发降级策略 |
| 任务阻塞 | 任务完成率 < 50%且持续 > 2小时 | 检查任务依赖关系 |
| 步骤超时 | 单步骤执行时间 > 2小时 | 检查Agent响应 |

## 使用示例

### 输入 - 完整报告
```json
{
  "project_id": "proj-001",
  "monitor_scope": "all",
  "report_type": "summary"
}
```

### 输出 - 完整报告
```json
{
  "status": "success",
  "report_type": "summary",
  "project_state": {
    "project_id": "proj-001",
    "project_name": "电商订单管理系统",
    "workflow_status": "in_progress",
    "current_step": 12,
    "current_step_name": "设计评审",
    "last_updated": "2026-07-18T14:30:00Z"
  },
  "loop_status": {
    "current_loop": "design",
    "loop_iteration": 2,
    "max_loop_iteration": 3,
    "loop_history": [
      { "loop": "requirements", "iterations": 1, "result": "pass" },
      { "loop": "design", "iterations": 2, "result": "pending" }
    ]
  },
  "budget_status": {
    "total_budget": 1000000,
    "consumed_tokens": 350000,
    "remaining_tokens": 650000,
    "alert_status": "normal"
  },
  "worktree_status": {
    "parallel_tasks": 2,
    "completed_tasks": 1,
    "active_tasks": 1,
    "conflicts": 0
  },
  "alerts": [],
  "recommendations": [
    "设计评审第2次迭代，建议重点关注架构文档完整性"
  ],
  "message": "项目运行正常"
}
```

### 输入 - 异常报告
```json
{
  "project_id": "proj-001",
  "monitor_scope": "all",
  "report_type": "alert"
}
```

### 输出 - 异常报告
```json
{
  "status": "success",
  "report_type": "alert",
  "project_state": {
    "project_id": "proj-001",
    "project_name": "电商订单管理系统",
    "workflow_status": "in_progress",
    "current_step": 4,
    "current_step_name": "需求评审",
    "last_updated": "2026-07-18T10:00:00Z"
  },
  "loop_status": {
    "current_loop": "requirements",
    "loop_iteration": 3,
    "max_loop_iteration": 3,
    "loop_history": [
      { "loop": "requirements", "iterations": 3, "result": "fail" }
    ]
  },
  "budget_status": {
    "total_budget": 1000000,
    "consumed_tokens": 880000,
    "remaining_tokens": 120000,
    "alert_status": "critical"
  },
  "worktree_status": {
    "parallel_tasks": 1,
    "completed_tasks": 0,
    "active_tasks": 1,
    "conflicts": 0
  },
  "alerts": [
    {
      "type": "loop_max_iteration",
      "severity": "critical",
      "message": "需求评审迭代次数已达上限（3/3）",
      "suggestion": "请用户决策下一步"
    },
    {
      "type": "budget_critical",
      "severity": "critical",
      "message": "预算消耗已达88%",
      "suggestion": "触发降级策略"
    }
  ],
  "recommendations": [
    "需求评审连续失败3次，建议用户参与决策",
    "预算严重不足，建议执行D2降级策略"
  ],
  "message": "检测到2个严重异常"
}
```

## 最佳实践

- 定期调用此Skill生成状态报告
- 在关键节点（评审前、评审后）调用此Skill检查状态
- 将异常报告集成到通知系统
- 根据建议主动优化执行策略

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 项目状态不存在 | 返回错误状态，提示项目未初始化 |
| 监控范围无效 | 返回错误状态，提示有效的监控范围列表 |
| 报告类型无效 | 返回错误状态，提示有效的报告类型列表 |