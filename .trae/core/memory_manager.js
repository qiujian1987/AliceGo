const fs = require('fs');
const path = require('path');

class MemoryManager {
  constructor() {
    this.memoryDir = path.join(__dirname, 'memory');
    this.ensureMemoryDir();
    this.operationQueue = [];
    this.isProcessing = false;
  }

  // 确保记忆目录存在
  ensureMemoryDir() {
    try {
      if (!fs.existsSync(this.memoryDir)) {
        fs.mkdirSync(this.memoryDir, { recursive: true });
      }
      const snapshotsDir = path.join(this.memoryDir, 'snapshots');
      if (!fs.existsSync(snapshotsDir)) {
        fs.mkdirSync(snapshotsDir, { recursive: true });
      }
    } catch (error) {
      console.error('Error creating memory directory:', error);
    }
  }

  // 保存项目状态
  saveProjectState(state) {
    return this.queueOperation(() => {
      const filePath = path.join(this.memoryDir, 'project_state.json');
      try {
        const data = {
          ...state,
          last_updated: new Date().toISOString()
        };
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
      } catch (error) {
        console.error('Error saving project state:', error);
        return false;
      }
    });
  }

  // 加载项目状态
  loadProjectState() {
    const filePath = path.join(this.memoryDir, 'project_state.json');
    try {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
      return null;
    } catch (error) {
      console.error('Error loading project state:', error);
      return null;
    }
  }

  // 记录任务
  addTask(task) {
    return this.queueOperation(() => {
      const filePath = path.join(this.memoryDir, 'task_history.json');
      try {
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
        return true;
      } catch (error) {
        console.error('Error adding task:', error);
        return false;
      }
    });
  }

  // 更新任务状态
  updateTaskStatus(taskId, newStatus) {
    return this.queueOperation(() => {
      const filePath = path.join(this.memoryDir, 'task_history.json');
      try {
        let history = { tasks: [] };
        if (fs.existsSync(filePath)) {
          history = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
        
        const task = history.tasks.find(t => t.id === taskId);
        if (task) {
          task.status = newStatus;
          if (newStatus === 'completed') {
            task.completed_at = new Date().toISOString();
          }
          fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error updating task status:', error);
        return false;
      }
    });
  }

  // 保存任务历史
  saveTaskHistory(history) {
    return this.queueOperation(() => {
      const filePath = path.join(this.memoryDir, 'task_history.json');
      try {
        fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
        return true;
      } catch (error) {
        console.error('Error saving task history:', error);
        return false;
      }
    });
  }

  // 删除任务
  removeTask(taskId) {
    return this.queueOperation(() => {
      const filePath = path.join(this.memoryDir, 'task_history.json');
      try {
        let history = { tasks: [] };
        if (fs.existsSync(filePath)) {
          history = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
        
        history.tasks = history.tasks.filter(t => t.id !== taskId);
        fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
        return true;
      } catch (error) {
        console.error('Error removing task:', error);
        return false;
      }
    });
  }

  // 记录决策
  addDecision(decision) {
    return this.queueOperation(() => {
      const filePath = path.join(this.memoryDir, 'decisions.json');
      try {
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
        return true;
      } catch (error) {
        console.error('Error adding decision:', error);
        return false;
      }
    });
  }

  // 保存决策历史
  saveDecisions(decisions) {
    return this.queueOperation(() => {
      const filePath = path.join(this.memoryDir, 'decisions.json');
      try {
        fs.writeFileSync(filePath, JSON.stringify(decisions, null, 2));
        return true;
      } catch (error) {
        console.error('Error saving decisions:', error);
        return false;
      }
    });
  }

  // 更新Agent状态
  updateAgentState(agentName, state) {
    return this.queueOperation(() => {
      const filePath = path.join(this.memoryDir, 'agent_states.json');
      try {
        let agentStates = { agents: {} };
        if (fs.existsSync(filePath)) {
          agentStates = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
        agentStates.agents[agentName] = {
          ...state,
          last_activity: new Date().toISOString()
        };
        fs.writeFileSync(filePath, JSON.stringify(agentStates, null, 2));
        return true;
      } catch (error) {
        console.error('Error updating agent state:', error);
        return false;
      }
    });
  }

  // 保存Agent状态
  saveAgentStates(agentStates) {
    return this.queueOperation(() => {
      const filePath = path.join(this.memoryDir, 'agent_states.json');
      try {
        fs.writeFileSync(filePath, JSON.stringify(agentStates, null, 2));
        return true;
      } catch (error) {
        console.error('Error saving agent states:', error);
        return false;
      }
    });
  }

  // 创建状态快照
  createSnapshot() {
    return this.queueOperation(() => {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const snapshotPath = path.join(this.memoryDir, 'snapshots', `snapshot_${timestamp}.json`);
      
      try {
        const snapshot = {
          timestamp: new Date().toISOString(),
          project_state: this.loadProjectState(),
          task_history: this.loadTaskHistory(),
          decisions: this.loadDecisions(),
          agent_states: this.loadAgentStates()
        };
        
        fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));
        return snapshotPath;
      } catch (error) {
        console.error('Error creating snapshot:', error);
        return null;
      }
    });
  }

  // 加载任务历史
  loadTaskHistory() {
    const filePath = path.join(this.memoryDir, 'task_history.json');
    try {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
      return { tasks: [] };
    } catch (error) {
      console.error('Error loading task history:', error);
      return { tasks: [] };
    }
  }

  // 加载决策历史
  loadDecisions() {
    const filePath = path.join(this.memoryDir, 'decisions.json');
    try {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
      return { decisions: [] };
    } catch (error) {
      console.error('Error loading decisions:', error);
      return { decisions: [] };
    }
  }

  // 加载Agent状态
  loadAgentStates() {
    const filePath = path.join(this.memoryDir, 'agent_states.json');
    try {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
      return { agents: {} };
    } catch (error) {
      console.error('Error loading agent states:', error);
      return { agents: {} };
    }
  }

  // 生成项目摘要
  generateProjectSummary() {
    try {
      const projectState = this.loadProjectState();
      const taskHistory = this.loadTaskHistory();
      const decisions = this.loadDecisions();
      const agentStates = this.loadAgentStates();

      return {
        project: projectState,
        recent_tasks: taskHistory.tasks.slice(-5),
        key_decisions: decisions.decisions.slice(-3),
        agent_status: agentStates.agents,
        summary: this.generateSummaryText(projectState, taskHistory, decisions)
      };
    } catch (error) {
      console.error('Error generating project summary:', error);
      return {
        project: null,
        recent_tasks: [],
        key_decisions: [],
        agent_status: {},
        summary: '无法加载项目状态'
      };
    }
  }

  // 生成摘要文本
  generateSummaryText(projectState, taskHistory, decisions) {
    let summary = '';
    if (projectState) {
      summary += `项目: ${projectState.project_name}\n`;
      summary += `当前阶段: ${projectState.current_phase}\n`;
    }
    if (taskHistory.tasks.length > 0) {
      summary += `最近任务: ${taskHistory.tasks.slice(-3).map(t => t.content).join(', ')}\n`;
    }
    if (decisions.decisions.length > 0) {
      summary += `关键决策: ${decisions.decisions.slice(-2).map(d => d.topic).join(', ')}\n`;
    }
    return summary;
  }

  // 队列操作，处理并发
  queueOperation(operation) {
    return new Promise((resolve) => {
      this.operationQueue.push({ operation, resolve });
      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  // 处理操作队列
  async processQueue() {
    if (this.isProcessing || this.operationQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.operationQueue.length > 0) {
      const { operation, resolve } = this.operationQueue.shift();
      try {
        const result = operation();
        resolve(result);
      } catch (error) {
        console.error('Error processing queue operation:', error);
        resolve(false);
      }
      // 短暂延迟，避免文件系统过载
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    this.isProcessing = false;
  }
}

module.exports = MemoryManager;