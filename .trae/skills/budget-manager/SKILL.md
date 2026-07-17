---
name: "budget-manager"
description: "预算管理，追踪Token消耗、检查预算预警状态、触发降级策略、生成预算报告。触发场景：'预算检查'、'预算预警'、'预算报告'。"
---

# 预算管理 Skill

## 功能描述

预算管理Skill负责追踪项目的Token消耗，检查预算预警状态，触发降级策略，并生成预算报告。确保项目在预算范围内完成，避免Token过度消耗。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| project_id | string | 项目ID | 是 |
| consumed_tokens | number | 本次消耗的Token数量 | 是 |
| operation_type | string | 操作类型（analysis/design/development/testing/deployment） | 是 |
| phase | string | 当前阶段（requirements/design/development/acceptance） | 否 |
| step | number | 当前步骤编号 | 否 |

## 输出格式

### 主要输出：JSON状态
```json
{
  "status": "success",
  "budget_state": {
    "total_budget": 1000000,
    "consumed_tokens": 350000,
    "remaining_tokens": 650000,
    "consumed_percentage": 35,
    "alert_status": "normal",
    "last_budget_update": "2026-07-18T10:30:00Z",
    "phase_budget": {
      "requirements": { "allocated": 100000, "consumed": 85000 },
      "design": { "allocated": 200000, "consumed": 150000 },
      "development": { "allocated": 400000, "consumed": 115000 },
      "acceptance": { "allocated": 300000, "consumed": 0 }
    }
  },
  "recommendation": "继续正常执行",
  "message": "预算状态正常，已消耗35%，剩余650,000 Token"
}
```

## 执行流程

1. 读取项目预算配置（从mcp_Memory）
2. 更新已消耗Token数量
3. 计算剩余预算和消耗百分比
4. 检查预算预警状态：
   - normal（正常）：消耗 < 70%
   - warning（警告）：70% ≤ 消耗 < 85%
   - critical（严重）：消耗 ≥ 85%
5. 根据预警状态决定是否触发降级策略：
   - normal：继续正常执行
   - warning：发出预警通知，建议优化
   - critical：触发降级策略
6. 更新项目状态到mcp_Memory
7. 返回预算状态和建议

## 预算配置

### 项目级总预算
- 默认总预算：1,000,000 Token

### 阶段级预算分配

| 阶段 | 步骤范围 | 预算分配 | 占比 |
|------|---------|---------|------|
| requirements | 步骤1-5 | 100,000 | 10% |
| design | 步骤6-14 | 200,000 | 20% |
| development | 步骤15-23 | 400,000 | 40% |
| acceptance | 步骤24-26 | 300,000 | 30% |

### 步骤级预算上限

| 步骤 | 步骤名称 | 预算上限（Token） |
|------|---------|-----------------|
| 1 | 项目初始化 | 10,000 |
| 2 | 需求分析 | 25,000 |
| 3 | 特性需求分析 | 30,000 |
| 4 | 需求评审 | 15,000 |
| 5 | 需求确认 | 10,000 |
| 6-14 | 设计阶段 | 200,000（合计） |
| 15-23 | 开发阶段 | 400,000（合计） |
| 24-26 | 验收阶段 | 300,000（合计） |

### 三级预警机制

| 预警级别 | 触发条件 | 响应动作 |
|---------|---------|---------|
| normal | 消耗 < 70% | 正常执行 |
| warning | 70% ≤ 消耗 < 85% | 发出预警通知，建议优化策略 |
| critical | 消耗 ≥ 85% | 触发降级策略 |

### 四级降级策略

| 降级级别 | 触发条件 | 执行策略 |
|---------|---------|---------|
| D1 | warning状态 | 简化设计文档，减少可选特性 |
| D2 | critical状态且剩余 > 50,000 | 跳过非核心测试，简化代码审查 |
| D3 | critical状态且剩余 ≤ 50,000 | 使用模板快速完成，跳过部分评审 |
| D4 | 预算耗尽 | 暂停执行，通知用户决策 |

## 使用示例

### 输入 - 正常状态
```json
{
  "project_id": "proj-001",
  "consumed_tokens": 50000,
  "operation_type": "analysis",
  "phase": "requirements",
  "step": 2
}
```

### 输出 - 正常状态
```json
{
  "status": "success",
  "budget_state": {
    "total_budget": 1000000,
    "consumed_tokens": 50000,
    "remaining_tokens": 950000,
    "consumed_percentage": 5,
    "alert_status": "normal",
    "last_budget_update": "2026-07-18T10:30:00Z",
    "phase_budget": {
      "requirements": { "allocated": 100000, "consumed": 50000 },
      "design": { "allocated": 200000, "consumed": 0 },
      "development": { "allocated": 400000, "consumed": 0 },
      "acceptance": { "allocated": 300000, "consumed": 0 }
    }
  },
  "recommendation": "继续正常执行",
  "message": "预算状态正常，已消耗5%，剩余950,000 Token"
}
```

### 输入 - 警告状态
```json
{
  "project_id": "proj-001",
  "consumed_tokens": 100000,
  "operation_type": "development",
  "phase": "development",
  "step": 20
}
```

### 输出 - 警告状态
```json
{
  "status": "warning",
  "budget_state": {
    "total_budget": 1000000,
    "consumed_tokens": 720000,
    "remaining_tokens": 280000,
    "consumed_percentage": 72,
    "alert_status": "warning",
    "last_budget_update": "2026-07-18T15:00:00Z",
    "phase_budget": {
      "requirements": { "allocated": 100000, "consumed": 100000 },
      "design": { "allocated": 200000, "consumed": 200000 },
      "development": { "allocated": 400000, "consumed": 320000 },
      "acceptance": { "allocated": 300000, "consumed": 100000 }
    }
  },
  "recommendation": "建议优化策略：简化测试用例，减少文档详细程度",
  "message": "预算警告：已消耗72%，剩余280,000 Token"
}
```

### 输入 - 严重状态
```json
{
  "project_id": "proj-001",
  "consumed_tokens": 80000,
  "operation_type": "testing",
  "phase": "acceptance",
  "step": 23
}
```

### 输出 - 严重状态
```json
{
  "status": "critical",
  "budget_state": {
    "total_budget": 1000000,
    "consumed_tokens": 860000,
    "remaining_tokens": 140000,
    "consumed_percentage": 86,
    "alert_status": "critical",
    "last_budget_update": "2026-07-18T16:30:00Z",
    "phase_budget": {
      "requirements": { "allocated": 100000, "consumed": 100000 },
      "design": { "allocated": 200000, "consumed": 200000 },
      "development": { "allocated": 400000, "consumed": 400000 },
      "acceptance": { "allocated": 300000, "consumed": 160000 }
    }
  },
  "recommendation": "触发D2降级策略：跳过非核心测试，简化代码审查",
  "degradation_level": "D2",
  "message": "预算严重不足：已消耗86%，剩余140,000 Token"
}
```

## 最佳实践

- 每次Agent调用后必须调用此Skill更新预算消耗
- 预算消耗估算应基于实际调用情况
- 在warning状态时应主动优化执行策略
- 在critical状态时应严格执行降级策略
- 定期生成预算报告，监控项目预算健康状况

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 项目预算配置不存在 | 使用默认预算配置 |
| Token消耗为负数 | 返回错误状态，提示正数值 |
| 操作类型无效 | 返回错误状态，提示有效的操作类型列表 |
| 预算耗尽 | 返回暂停状态，通知用户决策 |