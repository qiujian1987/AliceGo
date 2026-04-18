const fs = require('fs');
const path = require('path');
const MemoryManager = require('./memory_manager');

class TaskManager {
  constructor() {
    this.tasksFile = path.join(__dirname, 'tasks.md');
    this.memoryManager = new MemoryManager();
  }

  // 加载任务
  loadTasks() {
    try {
      if (fs.existsSync(this.tasksFile)) {
        const content = fs.readFileSync(this.tasksFile, 'utf8');
        return this.parseTasks(content);
      }
      return [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  // 解析任务
  parseTasks(content) {
    const tasks = [];
    const lines = content.split('\n');
    let currentTask = null;

    lines.forEach(line => {
      line = line.trim();
      
      if (line.startsWith('- [') || line.startsWith('- [')) {
        if (currentTask) {
          tasks.push(currentTask);
        }
        
        const status = line.includes('[x]') ? 'completed' : 'pending';
        const content = line.replace(/^- \[.\]\s*/, '');
        
        currentTask = {
          id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          content: content,
          status: status,
          created_at: new Date().toISOString()
        };
      } else if (currentTask && line) {
        currentTask.content += ' ' + line;
      }
    });

    if (currentTask) {
      tasks.push(currentTask);
    }

    return tasks;
  }

  // 保存任务
  saveTasks(tasks) {
    try {
      let content = '# 任务看板\n\n';
      
      tasks.forEach(task => {
        const status = task.status === 'completed' ? '[x]' : '[ ]';
        content += `- ${status} ${task.content}\n`;
      });
      
      fs.writeFileSync(this.tasksFile, content);
      return true;
    } catch (error) {
      console.error('Error saving tasks:', error);
      return false;
    }
  }

  // 创建任务
  async createTask(task) {
    try {
      // 加载现有任务
      const tasks = this.loadTasks();
      
      // 创建新任务
      const newTask = {
        id: `task_${Date.now()}`,
        content: task.content,
        assignee: task.assignee || 'unassigned',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        created_at: new Date().toISOString()
      };
      
      // 添加到任务列表
      tasks.push(newTask);
      
      // 保存到 tasks.md
      if (!this.saveTasks(tasks)) {
        return false;
      }
      
      // 同步到记忆系统
      await this.memoryManager.addTask(newTask);
      
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  }

  // 更新任务状态
  async updateTaskStatus(taskId, newStatus) {
    try {
      // 加载现有任务
      const tasks = this.loadTasks();
      
      // 找到任务
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        return false;
      }
      
      // 更新状态
      task.status = newStatus;
      if (newStatus === 'completed') {
        task.completed_at = new Date().toISOString();
      }
      
      // 保存到 tasks.md
      if (!this.saveTasks(tasks)) {
        return false;
      }
      
      // 同步到记忆系统
      await this.memoryManager.updateTaskStatus(taskId, newStatus);
      
      return true;
    } catch (error) {
      console.error('Error updating task status:', error);
      return false;
    }
  }

  // 删除任务
  async removeTask(taskId) {
    try {
      // 加载现有任务
      const tasks = this.loadTasks();
      
      // 过滤出要保留的任务
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      
      // 保存到 tasks.md
      if (!this.saveTasks(updatedTasks)) {
        return false;
      }
      
      // 同步到记忆系统
      await this.memoryManager.removeTask(taskId);
      
      return true;
    } catch (error) {
      console.error('Error removing task:', error);
      return false;
    }
  }

  // 同步记忆到任务文件
  async syncFromMemory() {
    try {
      // 从记忆系统加载任务历史
      const taskHistory = await this.memoryManager.loadTaskHistory();
      
      if (taskHistory && taskHistory.tasks) {
        // 保存到 tasks.md
        return this.saveTasks(taskHistory.tasks);
      }
      
      return false;
    } catch (error) {
      console.error('Error syncing from memory:', error);
      return false;
    }
  }

  // 同步任务到记忆
  async syncToMemory() {
    try {
      // 加载任务
      const tasks = this.loadTasks();
      
      // 保存到记忆系统
      await this.memoryManager.saveTaskHistory({ tasks: tasks });
      
      return true;
    } catch (error) {
      console.error('Error syncing to memory:', error);
      return false;
    }
  }

  // 获取任务统计
  getTaskStats() {
    const tasks = this.loadTasks();
    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      pending: tasks.filter(t => t.status === 'pending').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length
    };
    return stats;
  }
}

module.exports = TaskManager;