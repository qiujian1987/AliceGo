# Loop Worktrees 并行开发机制规则（L2）

## 1. 概述

本规则定义了AliceGo项目中的Worktrees并行开发机制，包括前后端任务并行分配规则、多特性并行开发规则、Git Worktree隔离机制，以及如何支持多Agent并行处理不同特性。

## 2. 目标

- **并行开发**：支持前后端任务并行执行，提高开发效率
- **多特性并行**：支持多个特性同时开发，缩短项目周期
- **资源隔离**：通过Git Worktree实现代码隔离，避免冲突
- **任务协调**：协调多个Agent并行工作，确保整体进度

## 3. 并行开发模型

### 3.1 并行开发层次

```
┌─────────────────────────────────────────────────────────────┐
│                     项目级并行                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Feature 001 │  │  Feature 002 │  │  Feature 003 │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                 │              │
│         ▼                 ▼                 ▼              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Worktree 1  │  │  Worktree 2  │  │  Worktree 3  │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼─────────────────┼─────────────────┼─────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                     特性级并行                              │
│         ┌───────────────────┐                              │
│         │  Feature 001      │                              │
│         │  ┌─────────┐ ┌────┴────┐ ┌─────────┐            │
│         │  │ Backend │ │  API    │ │ Frontend│            │
│         │  │ Dev     │ │ Design  │ │ Dev     │            │
│         │  └────┬────┘ └────┬────┘ └────┬────┘            │
│         └───────┼───────────┼───────────┼─────────────────┘
                 │           │           │
                 ▼           ▼           ▼
           @backend-dev @architect @frontend-dev
```

### 3.2 并行开发策略

| 策略 | 说明 | 适用场景 |
|------|------|---------|
| **前后端并行** | 后端开发和前端开发同时进行 | API设计完成后 |
| **多特性并行** | 多个特性同时开发 | 需求确认完成后 |
| **设计与开发并行** | 设计阶段和开发阶段部分重叠 | 架构设计完成后 |
| **测试并行** | 多个特性的测试同时执行 | 开发完成后 |

## 4. Git Worktree 隔离机制

### 4.1 Worktree 创建策略

```json
{
  "worktree_config": {
    "base_branch": "main",
    "worktree_prefix": "feature/",
    "worktree_location": "./.trae/worktrees/",
    "max_parallel_worktrees": 5
  }
}
```

### 4.2 Worktree 命名规范

| 类型 | 命名格式 | 示例 |
|------|---------|------|
| 特性开发 | `feature/{feature-id}` | `feature/feature-001` |
| 修复分支 | `fix/{issue-id}` | `fix/PROB-001` |
| 开发分支 | `dev/{feature-id}` | `dev/feature-001` |

### 4.3 Worktree 生命周期

```
创建 → 开发 → 测试 → 合并 → 删除

1. 创建Worktree
   git worktree add .trae/worktrees/feature-001 feature/feature-001

2. 在Worktree中开发
   cd .trae/worktrees/feature-001
   # 执行开发任务

3. 测试通过后合并
   git checkout main
   git merge feature/feature-001

4. 删除Worktree
   git worktree remove .trae/worktrees/feature-001
```

## 5. 任务并行分配规则

### 5.1 前后端任务并行分配

```json
{
  "parallel_rules": {
    "frontend_backend": {
      "enabled": true,
      "trigger_condition": "api_design_completed",
      "frontend_agent": "@frontend-dev",
      "backend_agent": "@backend-dev",
      "dependency": {
        "frontend_depends_on": ["api_contracts"],
        "backend_depends_on": ["api_contracts", "data_model"]
      }
    }
  }
}
```

### 5.2 多特性任务并行分配

```json
{
  "parallel_rules": {
    "multi_feature": {
      "enabled": true,
      "max_parallel_features": 3,
      "feature_priority": ["high", "medium", "low"],
      "allocation_strategy": "round_robin",
      "conflict_detection": {
        "enabled": true,
        "check_interval": 5
      }
    }
  }
}
```

### 5.3 任务分配流程

```
1. 任务拆解完成（步骤15）
2. 识别可并行的任务组
   ├── 前后端任务组：可并行
   ├── 独立特性任务组：可并行
   └── 依赖任务组：需串行
3. 创建Worktree（如需）
4. 并行分配给对应Agent
5. 监控并行进度
6. 协调合并时机
```

## 6. 任务协调机制

### 6.1 进度同步

| 时机 | 同步内容 | 同步方式 |
|------|---------|---------|
| 任务开始 | 任务描述、依赖关系 | mcp_Memory更新 |
| 任务完成 | 完成状态、产出物 | mcp_Memory更新 |
| 任务阻塞 | 阻塞原因、依赖任务 | mcp_Memory更新 + 通知 |
| 定时同步 | 当前进度、剩余工作量 | 每30分钟 |

### 6.2 冲突检测与解决

```json
{
  "conflict_rules": {
    "file_conflict": {
      "detection": "git merge --no-commit",
      "resolution": "manual",
      "escalation": "@team-lead"
    },
    "api_conflict": {
      "detection": "api_checklist comparison",
      "resolution": "api_review",
      "escalation": "@architect"
    },
    "data_conflict": {
      "detection": "schema comparison",
      "resolution": "data_model_review",
      "escalation": "@dba"
    }
  }
}
```

### 6.3 并行任务协调流程

```
1. 检测任务依赖关系
2. 识别冲突风险
3. 设置冲突检测触发器
4. 定期检查冲突
5. 发现冲突时：
   ├─ 自动解决（如果可能）
   └─ 人工介入（如果需要）
6. 冲突解决后继续并行开发
```

## 7. 并行开发状态追踪

### 7.1 状态字段

```json
{
  "parallel_state": {
    "active_worktrees": [
      {
        "worktree_id": "worktree-001",
        "feature_id": "feature-001",
        "branch_name": "feature/feature-001",
        "location": "./.trae/worktrees/feature-001",
        "status": "in_progress",
        "assigned_agents": ["@backend-dev", "@frontend-dev"],
        "tasks": ["T001", "T002"]
      }
    ],
    "completed_worktrees": [],
    "blocked_worktrees": [],
    "conflicts": []
  }
}
```

### 7.2 状态更新时机

| 时机 | 更新内容 |
|------|---------|
| Worktree创建 | 添加到active_worktrees |
| 任务分配 | 更新assigned_agents |
| 任务完成 | 更新status |
| Worktree合并 | 移动到completed_worktrees |
| 冲突检测 | 更新conflicts |

## 8. 并行开发验证机制

### 8.1 并行验证检查

每步执行前必须检查：

1. 任务之间是否存在冲突
2. Worktree隔离是否生效
3. 并行任务进度是否同步
4. 是否需要协调合并

### 8.2 验证失败处理

| 失败类型 | 处理方式 |
|---------|---------|
| 任务冲突 | 暂停冲突任务，通知协调Agent |
| Worktree隔离失效 | 重新创建Worktree |
| 进度不同步 | 等待落后任务 |
| 合并冲突 | 人工介入解决 |

## 9. 与其他Loop原语的集成

### 9.1 Worktrees与Budget的交互

```
并行开发增加预算消耗 → 预算预警机制触发
→ 根据预警级别调整并行度：
  - 正常：保持最大并行度
  - 预警：减少并行度到50%
  - 临界：暂停非核心特性的并行开发
```

### 9.2 Worktrees与Automations的交互

```
Worktree中文件变更 → auto-001触发测试
测试失败 → auto-002触发修复
修复完成 → 继续并行开发
```

### 9.3 Worktrees与State的交互

```
并行状态存储在mcp_Memory.parallel_state
进度同步通过mcp_Memory.add_observations()实现
冲突信息存储在mcp_Memory.conflict_records
```

## 10. 配置说明

### 10.1 配置文件位置

Worktrees参数可通过以下方式配置：

1. **默认配置**：本规则文件中定义的默认值
2. **项目配置**：`design/project_overview/worktree_config.json`
3. **运行时配置**：通过自然语言输入覆盖

### 10.2 自定义配置示例

```json
{
  "worktree_overrides": {
    "max_parallel_worktrees": 5,
    "worktree_prefix": "feature/",
    "worktree_location": "./.trae/worktrees/"
  },
  "parallel_rules_overrides": {
    "frontend_backend": {
      "enabled": true
    },
    "multi_feature": {
      "enabled": true,
      "max_parallel_features": 3
    }
  }
}
```

## 11. 最佳实践

### 11.1 并行开发要点

1. **明确依赖关系**：在任务拆解时明确任务之间的依赖
2. **合理控制并行度**：根据资源情况调整并行任务数量
3. **定期同步进度**：避免进度差距过大
4. **及时解决冲突**：发现冲突立即处理，避免堆积
5. **保持代码质量**：并行开发不降低代码质量标准

### 11.2 避免的问题

1. **过度并行**：并行任务过多导致资源竞争
2. **依赖不清**：任务依赖关系不明确导致冲突
3. **进度失控**：缺乏进度监控导致进度落后
4. **合并困难**：冲突积累导致合并困难
