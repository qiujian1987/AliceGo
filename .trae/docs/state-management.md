# 状态管理与断点续传规范

本文档定义SOLO Coder的状态持久化、断点检测和自动恢复机制。

---

## 1. 核心原则

### 1.1 自动保存
- **每个步骤执行后**：自动保存当前状态
- **Agent调用前**：保存状态快照
- **关键操作后**：立即持久化

### 1.2 自动检测
- **新对话启动时**：自动检测是否有进行中的项目
- **状态优先**：优先从持久化状态恢复，而非从头开始
- **用户确认**：检测到状态后，先询问用户是否继续

### 1.3 完整性保证
- **状态校验**：恢复时验证状态完整性
- **前置检查**：确保前置步骤已完成
- **回滚机制**：状态损坏时提供回滚选项

---

## 2. 状态持久化结构

### 2.1 存储位置
```
[项目根目录]/
├── .trae/
│   └── memory/
│       ├── project_state.json      # 项目核心状态（必需）
│       ├── step_history.json       # 步骤执行历史
│       └── snapshots/              # 状态快照目录
│           ├── snapshot_step_4.json
│           └── snapshot_step_8.json
```

### 2.2 project_state.json 结构
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

### 2.3 step_history.json 结构
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
    }
  ]
}
```

---

## 3. 启动检测流程

### 3.1 检测顺序
```
1. 检查是否存在 .trae/memory/project_state.json
2. 如果存在 → 进入恢复流程
3. 如果不存在 → 进入新项目流程
```

### 3.2 状态验证
恢复状态前必须验证：
- ✅ JSON格式正确
- ✅ 当前步骤编号在1-26范围内
- ✅ 前置步骤状态为completed
- ✅ 关键输出文件存在

### 3.3 项目恢复提示
```
[检测到进行中的项目]

📊 项目：电商网站
📍 当前：步骤4（需求评审）
⏱️ 进度：14%
🔄 迭代：1/3
📁 最后更新：2026-05-17 14:30

💡 请选择：
- /continue - 从步骤4继续
- /status - 查看完整状态
- /restart - 重新开始项目
- /cancel - 取消项目
```

---

## 4. 状态保存时机

### 4.1 必须保存的时机
| 时机 | 说明 |
|------|------|
| 步骤开始前 | 记录即将执行的步骤 |
| Agent调用前 | 保存调用前状态 |
| 步骤完成后 | 标记步骤为completed |
| 评审提交后 | 保存评审状态和迭代次数 |
| 用户中断时 | 标记状态为paused |

### 4.2 保存内容
每次保存必须包含：
1. 当前步骤编号和名称
2. 各步骤的完成状态
3. 输出文件列表
4. 时间戳
5. 当前迭代次数（如适用）

---

## 5. 断点恢复流程

### 5.1 标准恢复
```
用户输入：/continue
↓
加载 project_state.json
↓
验证状态完整性
↓
显示当前状态摘要
↓
确认是否继续
↓
从当前步骤继续执行
```

### 5.2 状态修复
如果状态损坏：
```
检测到状态损坏
↓
尝试从最近快照恢复
↓
如果快照不存在
↓
询问用户：
- 从头开始
- 尝试从已知文件推断状态
- 取消
```

### 5.3 从步骤重启
```
用户输入：/restart 4
↓
确认要重新执行步骤4
↓
将步骤4及后续步骤重置为pending
↓
保存状态
↓
开始执行步骤4
```

---

## 6. 关键命令汇总

| 命令 | 功能 |
|------|------|
| `/continue` | 从当前断点继续 |
| `/status` | 查看完整项目状态 |
| `/restart [步骤号]` | 重新执行指定步骤 |
| `/step [步骤号]` | 跳转到指定步骤 |
| `/new` | 强制开始新项目 |

---

## 7. SOLO Coder 自动行为规范

### 7.1 对话开始时（必须执行）
1. **立即检查**是否存在 .trae/memory/project_state.json
2. **如果存在**：
   - 加载状态
   - 显示项目恢复提示
   - **不要**直接开始，等待用户命令
3. **如果不存在**：
   - 显示欢迎信息
   - 等待用户命令

### 7.2 状态丢失处理
如果发现状态丢失但文件存在：
1. **询问用户**是否根据现有文件推断状态
2. 或者提供重新开始选项

---

## 8. 状态与实际文件一致性检查

每次恢复时必须检查：
```
对于每个标记为completed的步骤：
  检查输出文件是否存在
  如果不存在 → 标记为pending，需要重新执行
```

---

*最后更新：2026-05-17*
