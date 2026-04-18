# TRAE 记忆系统设计

## 问题背景

TRAE在50轮对话后会建议新建对话，导致上下文丢失，大模型无法记住之前的任务和项目状态。这严重影响了项目的连续性和开发效率。

## 设计目标

1. **持久化记忆**：将项目关键信息持久化存储
2. **断点恢复**：在新对话中能够快速恢复项目状态
3. **智能检索**：根据需要检索和使用历史信息
4. **低开销**：不显著增加系统负担

## 核心架构

### 1. 存储结构

```
.trae/
├── memory/
│   ├── project_state.json    # 项目状态
│   ├── task_history.json     # 任务历史
│   ├── decisions.json        # 重要决策
│   ├── agent_states.json     # Agent状态
│   └── snapshots/            # 状态快照
│       ├── snapshot_2026-04-18_12-00.json
│       └── ...
└── memory_manager.js         # 记忆管理模块
```

### 2. 数据模型

#### project_state.json
```json
{
  "project_name": "",
  "project_description": "",
  "created_at": "2026-04-18T10:00:00Z",
  "last_updated": "2026-04-18T12:00:00Z",
  "current_phase": "Phase 1",
  "checkpoints": [
    {
      "id": "checkpoint_1",
      "name": "MVP环境冒烟",
      "status": "pending",
      "completed_at": null
    }
  ],
  "key_metrics": {
    "tasks_completed": 0,
    "tasks_in_progress": 0,
    "total_tasks": 0
  }
}
```

#### task_history.json
```json
{
  "tasks": [
    {
      "id": "task_1",
      "content": "分析需求",
      "assignee": "team-lead",
      "status": "completed",
      "priority": "high",
      "created_at": "2026-04-18T10:00:00Z",
      "completed_at": "2026-04-18T10:30:00Z",
      "comments": [
        "需求分析完成，明确了核心功能"
      ]
    }
  ]
}
```

#### decisions.json
```json
{
  "decisions": [
    {
      "id": "decision_1",
      "topic": "技术栈选择",
      "decision": "使用React + TypeScript + Express + PostgreSQL",
      "reasoning": "基于项目需求和团队技术栈",
      "made_by": "architect",
      "timestamp": "2026-04-18T11:00:00Z"
    }
  ]
}
```

#### agent_states.json
```json
{
  "agents": {
    "team-lead": {
      "current_task": "任务分配",
      "status": "active",
      "last_activity": "2026-04-18T12:00:00Z"
    },
    "architect": {
      "current_task": "系统设计",
      "status": "active",
      "last_activity": "2026-04-18T11:30:00Z"
    }
  }
}
```

### 3. 记忆管理模块

#### memory_manager.js
```javascript
const fs = require('fs');
const path = require('path');

class MemoryManager {
  constructor() {
    this.memoryDir = path.join(__dirname, 'memory');
    this.ensureMemoryDir();
  }

  // 确保记忆目录存在
  ensureMemoryDir() {
    if (!fs.existsSync(this.memoryDir)) {
      fs.mkdirSync(this.memoryDir, { recursive: true });
    }
    const snapshotsDir = path.join(this.memoryDir, 'snapshots');
    if (!fs.existsSync(snapshotsDir)) {
      fs.mkdirSync(snapshotsDir, { recursive: true });
    }
  }

  // 保存项目状态
  saveProjectState(state) {
    const filePath = path.join(this.memoryDir, 'project_state.json');
    const data = {
      ...state,
      last_updated: new Date().toISOString()
    };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  // 加载项目状态
  loadProjectState() {
    const filePath = path.join(this.memoryDir, 'project_state.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return null;
  }

  // 记录任务
  addTask(task) {
    const filePath = path.join(this.memoryDir, 'task_history.json');
    let history = { tasks: [] };
    if (fs.existsSync(filePath)) {
      history = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    history.tasks.push({
      ...task,
      id: `task_${Date.now()}`,
      created_at: new Date().toISOString()
    });
    fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
  }

  // 记录决策
  addDecision(decision) {
    const filePath = path.join(this.memoryDir, 'decisions.json');
    let decisions = { decisions: [] };
    if (fs.existsSync(filePath)) {
      decisions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    decisions.decisions.push({
      ...decision,
      id: `decision_${Date.now()}`,
      timestamp: new Date().toISOString()
    });
    fs.writeFileSync(filePath, JSON.stringify(decisions, null, 2));
  }

  // 更新Agent状态
  updateAgentState(agentName, state) {
    const filePath = path.join(this.memoryDir, 'agent_states.json');
    let agentStates = { agents: {} };
    if (fs.existsSync(filePath)) {
      agentStates = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    agentStates.agents[agentName] = {
      ...state,
      last_activity: new Date().toISOString()
    };
    fs.writeFileSync(filePath, JSON.stringify(agentStates, null, 2));
  }

  // 创建状态快照
  createSnapshot() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const snapshotPath = path.join(this.memoryDir, 'snapshots', `snapshot_${timestamp}.json`);
    
    const snapshot = {
      timestamp: new Date().toISOString(),
      project_state: this.loadProjectState(),
      task_history: this.loadTaskHistory(),
      decisions: this.loadDecisions(),
      agent_states: this.loadAgentStates()
    };
    
    fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));
    return snapshotPath;
  }

  // 加载任务历史
  loadTaskHistory() {
    const filePath = path.join(this.memoryDir, 'task_history.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return { tasks: [] };
  }

  // 加载决策历史
  loadDecisions() {
    const filePath = path.join(this.memoryDir, 'decisions.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return { decisions: [] };
  }

  // 加载Agent状态
  loadAgentStates() {
    const filePath = path.join(this.memoryDir, 'agent_states.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return { agents: {} };
  }

  // 生成项目摘要
  generateProjectSummary() {
    const projectState = this.loadProjectState();
    const taskHistory = this.loadTaskHistory();
    const decisions = this.loadDecisions();
    const agentStates = this.loadAgentStates();

    return {
      project: projectState,
      recent_tasks: taskHistory.tasks.slice(-5),
      key_decisions: decisions.decisions.slice(-3),
      agent_status: agentStates.agents
    };
  }
}

module.exports = MemoryManager;
```

### 4. 断点恢复机制

#### 恢复流程

1. **启动检测**：TRAE启动时检查是否存在记忆文件
2. **状态加载**：如果存在记忆文件，加载最新的项目状态
3. **摘要生成**：生成项目摘要，包括当前状态、最近任务、关键决策
4. **上下文注入**：将项目摘要注入到对话上下文
5. **状态同步**：同步Agent状态和任务状态

#### 集成点

- **Team Lead**：负责初始化和管理记忆系统
- **Agent通信**：所有Agent操作都会记录到记忆系统
- **任务更新**：任务状态变更时自动更新记忆
- **决策记录**：重要决策自动记录到记忆系统

### 5. 使用方式

#### 项目初始化

```javascript
const MemoryManager = require('./memory_manager');

// 初始化记忆管理器
const memoryManager = new MemoryManager();

// 保存项目初始化状态
memoryManager.saveProjectState({
  project_name: "示例项目",
  project_description: "这是一个示例项目",
  created_at: new Date().toISOString(),
  current_phase: "Phase 1",
  checkpoints: [
    {
      id: "checkpoint_0",
      name: "数据模型完成",
      status: "pending",
      completed_at: null
    }
  ],
  key_metrics: {
    tasks_completed: 0,
    tasks_in_progress: 0,
    total_tasks: 0
  }
});
```

#### 任务记录

```javascript
// 记录任务
memoryManager.addTask({
  content: "分析需求",
  assignee: "team-lead",
  status: "in_progress",
  priority: "high"
});

// 更新任务状态
const taskHistory = memoryManager.loadTaskHistory();
const task = taskHistory.tasks.find(t => t.content === "分析需求");
if (task) {
  task.status = "completed";
  task.completed_at = new Date().toISOString();
  memoryManager.saveTaskHistory(taskHistory);
}
```

#### 对话恢复

```javascript
// 生成项目摘要
const summary = memoryManager.generateProjectSummary();

// 在新对话开始时注入摘要
console.log("\n=== 项目状态摘要 ===");
console.log(`项目: ${summary.project.project_name}`);
console.log(`当前阶段: ${summary.project.current_phase}`);
console.log(`最近任务: ${summary.recent_tasks.map(t => t.content).join(', ')}`);
console.log(`关键决策: ${summary.key_decisions.map(d => d.topic).join(', ')}`);
console.log("=================\n");
```

## 优势

1. **持续性**：项目状态持久化，不受对话轮次限制
2. **一致性**：所有Agent共享同一记忆系统，保持信息一致
3. **可追溯性**：完整记录项目历史，便于追溯决策过程
4. **灵活性**：支持从任意断点恢复项目
5. **可扩展性**：记忆系统可根据需要扩展存储容量和功能

## 实施计划

1. **阶段1**：实现基础记忆存储结构
2. **阶段2**：集成到现有TRAE流程
3. **阶段3**：测试断点恢复功能
4. **阶段4**：优化记忆管理策略

## 总结

TRAE记忆系统通过持久化存储项目状态、任务历史、决策记录和Agent状态，解决了对话轮次限制导致的上下文丢失问题。系统设计灵活可扩展，能够支持TRAE在长期项目开发中的断点恢复需求，确保项目的连续性和开发效率。