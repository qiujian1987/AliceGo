# 状态保存与加载指南

本文档定义 SOLO Coder 如何保存和加载项目状态。

---

## 状态文件模板

### project_state.json 示例

```json
{
  "version": "1.0",
  "project_name": "电商网站",
  "workflow_status": "in_progress",
  "current_step": 4,
  "current_step_name": "需求评审",
  "last_updated": "2026-05-17T14:30:00Z",
  "steps": {
    "1": {
      "status": "completed",
      "name": "项目初始化",
      "completed_at": "2026-05-17T10:00:00Z"
    },
    "2": {
      "status": "completed",
      "name": "需求分析",
      "completed_at": "2026-05-17T11:00:00Z",
      "output_file": "design/project_overview/requirements_spec.md"
    },
    "3": {
      "status": "completed",
      "name": "特性需求分析",
      "completed_at": "2026-05-17T12:00:00Z",
      "output_files": [
        "design/features/feature-001/requirements.md",
        "design/features/feature-002/requirements.md"
      ]
    },
    "4": {
      "status": "in_progress",
      "name": "需求评审",
      "started_at": "2026-05-17T14:00:00Z",
      "iteration": 1,
      "max_iterations": 3
    }
  },
  "context": {
    "last_agent_called": "@req-reviewer",
    "in_progress_file": null,
    "pending_user_confirmation": false
  }
}
```

### step_history.json 示例

```json
{
  "version": "1.0",
  "history": [
    {
      "step": 1,
      "timestamp": "2026-05-17T10:00:00Z",
      "action": "completed",
      "agent": "@devops",
      "output_files": []
    },
    {
      "step": 2,
      "timestamp": "2026-05-17T11:00:00Z",
      "action": "completed",
      "agent": "@team-lead",
      "skill": "requirement-analyzer",
      "output_files": ["design/project_overview/requirements_spec.md"]
    },
    {
      "step": 3,
      "timestamp": "2026-05-17T12:00:00Z",
      "action": "completed",
      "agent": "@feature-analyst",
      "skill": "requirement-analyzer",
      "output_files": [
        "design/features/feature-001/requirements.md",
        "design/features/feature-002/requirements.md"
      ]
    },
    {
      "step": 4,
      "timestamp": "2026-05-17T14:00:00Z",
      "action": "started",
      "agent": "@req-reviewer"
    }
  ]
}
```

---

## 保存状态的步骤

### 1. 确保目录存在
```
检查 .trae/memory 目录是否存在
如果不存在 → 创建该目录
```

### 2. 准备状态数据
```
收集以下信息：
- 当前步骤编号和名称
- 各步骤的完成状态
- 输出文件列表
- 时间戳
- 迭代次数（如适用）
```

### 3. 写入 JSON 文件
```
使用 file-operation.createFile() 保存
位置：.trae/memory/project_state.json
```

---

## 加载状态的步骤

### 1. 检查文件是否存在
```
检查 .trae/memory/project_state.json 是否存在
```

### 2. 读取并解析
```
使用 file-operation.readFile() 读取
解析为 JSON 对象
```

### 3. 验证完整性
```
检查：
- current_step 是否在 1-26 范围内
- 前置步骤是否标记为 completed
- 关键输出文件是否存在
```

---

## 各步骤的状态更新

### 步骤开始时
```
steps[X].status = "in_progress"
steps[X].started_at = [当前时间]
```

### 步骤完成时
```
steps[X].status = "completed"
steps[X].completed_at = [当前时间]
steps[X].output_files = [输出文件列表]
current_step = X + 1
```

### 评审提交时
```
steps[X].iteration = [当前迭代数]
```

---

## 命令对应操作

| 用户命令 | SOLO Coder 操作 |
|---------|----------------|
| `/continue` | 从 current_step 继续 |
| `/status` | 显示完整状态信息 |
| `/restart 4` | 将步骤4及后续步骤设为pending，从步骤4重新开始 |
| `/new` | 清除状态文件，开始新项目 |
| `/step 8` | 跳转到步骤8，验证前置步骤完成 |

---

*最后更新：2026-05-17*
