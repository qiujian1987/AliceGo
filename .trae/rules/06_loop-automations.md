# Loop Automations 自动触发规则（L2）

## 1. 概述

本规则定义了AliceGo项目中的Automations自动触发机制，包括文件变更自动触发测试、测试失败自动触发修复流程、评审通过自动进入下一步、预算预警自动通知等规则。

## 2. 目标

- **自动化推进**：减少人工干预，让流程自动推进
- **快速响应**：文件变更后立即触发测试，及时发现问题
- **智能修复**：测试失败后自动触发修复流程
- **成本控制**：预算预警自动通知，及时采取措施

## 3. 触发规则定义

### 3.1 触发规则格式

每个触发规则包含以下要素：

```json
{
  "rule_id": "auto-001",
  "name": "代码文件变更触发测试",
  "trigger": {
    "type": "file_change",
    "path_pattern": "src/**/*.ts",
    "event": "create|modify|delete"
  },
  "condition": {
    "current_step": ["step-20", "step-21", "step-22"],
    "project_status": "in_progress"
  },
  "action": {
    "type": "trigger_step",
    "step_id": "step-23",
    "params": {}
  },
  "delay": 5,
  "enabled": true
}
```

### 3.2 触发类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `file_change` | 文件变更触发 | 代码文件修改后触发测试 |
| `review_pass` | 评审通过触发 | 需求评审通过后自动进入需求确认 |
| `test_fail` | 测试失败触发 | 单元测试失败后触发修复流程 |
| `budget_alert` | 预算预警触发 | 剩余预算低于阈值时通知用户 |
| `step_complete` | 步骤完成触发 | 当前步骤完成后自动进入下一步 |

### 3.3 动作类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `trigger_step` | 触发指定步骤 | 触发测试执行步骤 |
| `notify_user` | 通知用户 | 发送预算预警通知 |
| `create_task` | 创建任务 | 创建Bug修复任务 |
| `update_status` | 更新状态 | 更新项目状态为暂停 |

## 4. 核心触发规则

### 4.1 文件变更触发测试

```json
{
  "rule_id": "auto-001",
  "name": "代码文件变更触发测试",
  "trigger": {
    "type": "file_change",
    "path_pattern": ["src/server/**/*.ts", "src/client/**/*.ts"],
    "event": ["create", "modify"]
  },
  "condition": {
    "current_step": ["step-20", "step-21", "step-22", "step-23"],
    "project_status": "in_progress"
  },
  "action": {
    "type": "trigger_step",
    "step_id": "step-23",
    "params": {
      "test_scope": "changed_files"
    }
  },
  "delay": 10,
  "enabled": true
}
```

**执行流程**：
1. 检测到代码文件变更
2. 等待10秒（合并多次变更）
3. 触发步骤23（测试执行）
4. 仅测试变更的文件

### 4.2 测试失败触发修复

```json
{
  "rule_id": "auto-002",
  "name": "测试失败触发修复流程",
  "trigger": {
    "type": "test_fail",
    "test_type": ["unit", "integration"]
  },
  "condition": {
    "current_step": "step-23",
    "fail_count": "> 0",
    "retry_count": "< 3"
  },
  "action": {
    "type": "create_task",
    "task_type": "bug_fix",
    "params": {
      "fail_reason": "{{test_fail_reason}}",
      "affected_files": "{{affected_files}}",
      "priority": "high"
    }
  },
  "delay": 0,
  "enabled": true
}
```

**执行流程**：
1. 检测到测试失败
2. 创建Bug修复任务
3. 自动分配给对应开发Agent
4. 执行修复流程

### 4.3 评审通过自动进入下一步

```json
{
  "rule_id": "auto-003",
  "name": "评审通过自动进入下一步",
  "trigger": {
    "type": "review_pass",
    "review_type": ["requirements", "design", "test", "code"]
  },
  "condition": {
    "current_step": ["step-4", "step-12", "step-17", "step-21"],
    "retry_count": "< 3"
  },
  "action": {
    "type": "trigger_step",
    "step_id": "{{next_step}}",
    "params": {}
  },
  "delay": 0,
  "enabled": true
}
```

**映射关系**：

| 当前步骤 | 评审类型 | 下一步骤 |
|---------|---------|---------|
| 步骤4（需求评审） | requirements | 步骤5（需求确认） |
| 步骤12（设计评审） | design | 步骤14（设计确认） |
| 步骤17（测试评审） | test | 步骤18（测试确认） |
| 步骤21（代码评审） | code | 步骤23（测试执行） |

### 4.4 预算预警自动通知

```json
{
  "rule_id": "auto-004",
  "name": "预算预警自动通知",
  "trigger": {
    "type": "budget_alert",
    "alert_level": ["warning", "critical"]
  },
  "condition": {
    "project_status": "in_progress"
  },
  "action": {
    "type": "notify_user",
    "params": {
      "message": "{{budget_alert_message}}",
      "alert_level": "{{alert_level}}"
    }
  },
  "delay": 0,
  "enabled": true
}
```

### 4.5 步骤完成自动进入下一步

```json
{
  "rule_id": "auto-005",
  "name": "步骤完成自动进入下一步",
  "trigger": {
    "type": "step_complete",
    "step_id": ["step-1", "step-2", "step-3", "step-5", "step-6", "step-7", "step-8", "step-9", "step-10", "step-11", "step-13", "step-14", "step-15", "step-16", "step-18", "step-19", "step-20", "step-22", "step-23", "step-24", "step-25"]
  },
  "condition": {
    "project_status": "in_progress",
    "step_status": "completed"
  },
  "action": {
    "type": "trigger_step",
    "step_id": "{{next_step}}",
    "params": {}
  },
  "delay": 3,
  "enabled": true
}
```

**排除步骤**：

| 步骤 | 排除原因 |
|------|---------|
| 步骤4（需求评审） | 需要等待用户确认 |
| 步骤12（设计评审） | 需要等待用户确认 |
| 步骤17（测试评审） | 需要等待用户确认 |
| 步骤21（代码评审） | 需要等待用户确认 |
| 步骤26（项目总结） | 流程结束 |

## 5. 触发规则优先级

| 优先级 | 规则类型 | 说明 |
|--------|---------|------|
| **P0** | `budget_alert` | 预算预警最高优先级 |
| **P1** | `test_fail` | 测试失败需要立即处理 |
| **P2** | `review_pass` | 评审通过自动推进 |
| **P3** | `step_complete` | 步骤完成自动推进 |
| **P4** | `file_change` | 文件变更触发（低优先级） |

## 6. 触发规则管理

### 6.1 规则配置

规则可通过以下方式配置：

1. **默认规则**：本规则文件中定义的规则
2. **项目配置**：`design/project_overview/automation_config.json`
3. **运行时配置**：通过自然语言输入覆盖

### 6.2 自定义配置示例

```json
{
  "rule_overrides": {
    "auto-001": {
      "enabled": false
    },
    "auto-003": {
      "delay": 5
    }
  },
  "custom_rules": [
    {
      "rule_id": "auto-custom-001",
      "name": "API文档变更触发前端更新",
      "trigger": {
        "type": "file_change",
        "path_pattern": "design/features/*/api.md",
        "event": ["create", "modify"]
      },
      "condition": {
        "current_step": ["step-20"],
        "project_status": "in_progress"
      },
      "action": {
        "type": "trigger_step",
        "step_id": "step-20",
        "params": {
          "scope": "frontend",
          "trigger_reason": "api_changed"
        }
      },
      "delay": 15,
      "enabled": true
    }
  ]
}
```

### 6.3 规则启用/禁用

| 操作 | 方式 | 示例 |
|------|------|------|
| 启用规则 | 设置`enabled: true` | `"auto-001": {"enabled": true}` |
| 禁用规则 | 设置`enabled: false` | `"auto-001": {"enabled": false}` |
| 临时禁用 | 在运行时通过命令 | `/disable-auto auto-001` |
| 临时启用 | 在运行时通过命令 | `/enable-auto auto-001` |

## 7. 触发执行流程

```
1. 检测触发事件
   ↓
2. 匹配触发规则
   ↓
3. 检查条件是否满足
   ├─ 不满足 → 忽略
   └─ 满足 → 继续
   ↓
4. 等待延迟时间（如果有）
   ↓
5. 执行动作
   ↓
6. 记录执行日志
   ↓
7. 更新规则状态
```

## 8. 触发日志

### 8.1 日志记录

每次触发执行必须记录：

```json
{
  "timestamp": "2026-07-11T10:00:00Z",
  "rule_id": "auto-001",
  "rule_name": "代码文件变更触发测试",
  "trigger_type": "file_change",
  "trigger_details": {
    "file_path": "src/server/users/user.service.ts",
    "event": "modify"
  },
  "condition_result": "passed",
  "action_type": "trigger_step",
  "action_details": {
    "step_id": "step-23",
    "params": {
      "test_scope": "changed_files"
    }
  },
  "status": "success",
  "delay_ms": 10000
}
```

### 8.2 日志位置

日志文件：`design/project_overview/logs/automation-{timestamp}.log`

## 9. 验证机制

### 9.1 触发验证检查

每次触发前必须检查：

1. 规则是否启用
2. 条件是否满足
3. 当前项目状态是否允许触发
4. 是否有更高优先级的规则正在执行

### 9.2 验证失败处理

| 失败类型 | 处理方式 |
|---------|---------|
| 规则未启用 | 跳过触发 |
| 条件不满足 | 跳过触发，记录日志 |
| 项目状态不允许 | 跳过触发，记录日志 |
| 高优先级规则执行中 | 等待高优先级规则完成 |

## 10. 与Loop拓扑的集成

### 10.1 自动触发与回环机制

当自动触发规则执行时，必须考虑Loop拓扑中的回环机制：

```
评审通过 → 自动进入下一步（auto-003）
评审失败 → 回退到指定步骤（03_workflow.md中定义的回环）
测试失败 → 自动触发修复流程（auto-002）
修复完成 → 自动重新执行测试（auto-001）
```

### 10.2 触发规则与Budget的交互

当预算达到预警或临界状态时：

1. 触发`budget_alert`规则（auto-004）
2. 通知用户
3. 执行降级策略（05_loop-budget.md中定义）
4. 根据降级策略调整自动触发行为
