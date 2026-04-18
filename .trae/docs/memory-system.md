# TRAE 记忆系统设计

## 问题背景

TRAE在50轮对话后会建议新建对话，导致上下文丢失，大模型无法记住之前的任务和项目状态。这严重影响了项目的连续性和开发效率。

## 设计目标

1. **持久化记忆**：将项目关键信息持久化存储
2. **断点恢复**：在新对话中能够快速恢复项目状态
3. **智能检索**：根据需要检索和使用历史信息
4. **低开销**：不显著增加系统负担

## 核心架构

### 存储结构

```
.trae/
├── memory/
│   ├── project_state.json    # 项目状态
│   ├── task_history.json     # 任务历史
│   ├── decisions.json        # 重要决策
│   ├── agent_states.json     # Agent状态
│   └── snapshots/            # 状态快照
└── memory_manager.js         # 记忆管理模块
```

## 数据模型

详见各 JSON 文件结构。

## 核心模块

### memory_manager.js

核心功能：
- `saveProjectState` - 保存项目状态
- `loadProjectState` - 加载项目状态
- `addTask` - 添加任务
- `updateTaskStatus` - 更新任务状态
- `addDecision` - 添加决策
- `updateAgentState` - 更新Agent状态
- `createSnapshot` - 创建状态快照
- `generateProjectSummary` - 生成项目摘要

## 断点恢复机制

1. **启动检测**：TRAE启动时检查是否存在记忆文件
2. **状态加载**：如果存在记忆文件，加载最新的项目状态
3. **摘要生成**：生成项目摘要，包括当前状态、最近任务、关键决策
4. **上下文注入**：将项目摘要注入到对话上下文
5. **状态同步**：同步Agent状态和任务状态

## 优势

1. **持续性**：项目状态持久化，不受对话轮次限制
2. **一致性**：所有Agent共享同一记忆系统，保持信息一致
3. **可追溯性**：完整记录项目历史，便于追溯决策过程
4. **灵活性**：支持从任意断点恢复项目