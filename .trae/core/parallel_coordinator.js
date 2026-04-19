const fs = require('fs');
const path = require('path');

class ParallelCoordinator {
  constructor() {
    this.agents = [];
    this.tasks = [];
    this.communicationQueue = [];
    this.progress = {};
    this.baseDir = process.cwd();
    this.mailboxDir = path.join(this.baseDir, '.trae', 'mailbox');
  }

  /**
   * 初始化协调器
   */
  initialize() {
    console.log('初始化并行协同协调器...');
    
    // 确保邮箱目录存在
    if (!fs.existsSync(this.mailboxDir)) {
      fs.mkdirSync(this.mailboxDir, { recursive: true });
      console.log('创建邮箱目录:', this.mailboxDir);
    }

    // 加载 Agent 信息
    this.loadAgents();
  }

  /**
   * 加载 Agent 信息
   */
  loadAgents() {
    const agentsDir = path.join(this.baseDir, '.trae', 'agents');
    
    if (fs.existsSync(agentsDir)) {
      const agentFiles = fs.readdirSync(agentsDir).filter(file => file.endsWith('.md'));
      
      agentFiles.forEach(file => {
        const agentName = path.basename(file, '.md');
        this.agents.push(agentName);
      });
      
      console.log('加载的 Agent:', this.agents);
    }
  }

  /**
   * 启动并行任务执行
   * @param {Array} tasks - 任务列表
   */
  startParallelExecution(tasks) {
    this.tasks = tasks;
    this.progress = {};
    
    console.log('开始并行执行任务...');
    
    // 初始化任务进度
    tasks.forEach(task => {
      this.progress[task.id] = {
        status: task.status,
        assignee: task.assignee,
        startTime: null,
        endTime: null,
        progress: 0
      };
    });

    // 执行任务
    this.executeTasks(tasks);
  }

  /**
   * 执行任务
   * @param {Array} tasks - 任务列表
   */
  executeTasks(tasks) {
    tasks.forEach(task => {
      if (task.status === 'pending') {
        // 检查依赖
        const dependenciesMet = task.dependencies.every(depId => {
          return this.progress[depId] && this.progress[depId].status === 'completed';
        });

        if (dependenciesMet) {
          this.startTask(task);
        } else {
          console.log(`任务 ${task.id} 等待依赖完成: ${task.dependencies.join(', ')}`);
        }
      }
    });
  }

  /**
   * 开始执行任务
   * @param {Object} task - 任务对象
   */
  startTask(task) {
    console.log(`开始执行任务: ${task.id} - ${task.title} (${task.assignee})`);
    
    // 更新任务状态
    this.progress[task.id].status = 'in_progress';
    this.progress[task.id].startTime = new Date().toISOString();
    
    // 发送任务到 Agent 的邮箱
    this.sendTaskToAgent(task);
    
    // 模拟任务执行（实际使用时会由 Agent 执行）
    this.simulateTaskExecution(task);
  }

  /**
   * 发送任务到 Agent 的邮箱
   * @param {Object} task - 任务对象
   */
  sendTaskToAgent(task) {
    const mailboxFile = path.join(this.mailboxDir, `to-${task.assignee}.md`);
    
    const message = {
      type: 'task_assignment',
      task: task,
      sentAt: new Date().toISOString(),
      priority: task.priority
    };

    try {
      // 读取现有内容
      let existingContent = '';
      if (fs.existsSync(mailboxFile)) {
        existingContent = fs.readFileSync(mailboxFile, 'utf8');
      }

      // 添加新消息
      const newContent = `${existingContent}\n\n## 任务分配\n\n${JSON.stringify(message, null, 2)}`;
      
      fs.writeFileSync(mailboxFile, newContent);
      console.log(`任务已发送到 ${task.assignee} 的邮箱`);
    } catch (error) {
      console.error('发送任务到邮箱失败:', error);
    }
  }

  /**
   * 模拟任务执行（实际使用时会由 Agent 执行）
   * @param {Object} task - 任务对象
   */
  simulateTaskExecution(task) {
    // 模拟任务执行时间
    const executionTime = task.estimatedHours * 60 * 1000 / 10; // 加速 10 倍
    
    setTimeout(() => {
      this.completeTask(task.id);
    }, executionTime);
  }

  /**
   * 完成任务
   * @param {string} taskId - 任务 ID
   */
  completeTask(taskId) {
    console.log(`任务完成: ${taskId}`);
    
    // 更新任务状态
    this.progress[taskId].status = 'completed';
    this.progress[taskId].endTime = new Date().toISOString();
    this.progress[taskId].progress = 100;
    
    // 检查是否有依赖此任务的任务可以开始
    this.checkDependentTasks(taskId);
    
    // 检查所有任务是否完成
    this.checkAllTasksCompleted();
  }

  /**
   * 检查依赖此任务的任务
   * @param {string} completedTaskId - 已完成的任务 ID
   */
  checkDependentTasks(completedTaskId) {
    this.tasks.forEach(task => {
      if (task.status === 'pending' && task.dependencies.includes(completedTaskId)) {
        const dependenciesMet = task.dependencies.every(depId => {
          return this.progress[depId] && this.progress[depId].status === 'completed';
        });

        if (dependenciesMet) {
          this.startTask(task);
        }
      }
    });
  }

  /**
   * 检查所有任务是否完成
   */
  checkAllTasksCompleted() {
    const allCompleted = Object.values(this.progress).every(p => p.status === 'completed');
    
    if (allCompleted) {
      console.log('🎉 所有任务执行完成！');
      this.generateExecutionReport();
    }
  }

  /**
   * 生成执行报告
   */
  generateExecutionReport() {
    const report = {
      tasks: this.tasks.map(task => ({
        ...task,
        ...this.progress[task.id]
      })),
      summary: {
        totalTasks: this.tasks.length,
        completedTasks: Object.values(this.progress).filter(p => p.status === 'completed').length,
        totalEstimatedHours: this.tasks.reduce((sum, task) => sum + task.estimatedHours, 0),
        actualDuration: this.calculateActualDuration(),
        completionTime: new Date().toISOString()
      }
    };

    console.log('\n=== 执行报告 ===');
    console.log(JSON.stringify(report, null, 2));

    // 保存报告
    const reportPath = path.join(this.baseDir, '.trae', 'memory', 'execution_report.json');
    try {
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log('执行报告已保存到:', reportPath);
    } catch (error) {
      console.error('保存执行报告失败:', error);
    }
  }

  /**
   * 计算实际执行时间
   * @returns {number} 实际执行时间（分钟）
   */
  calculateActualDuration() {
    const startTimes = Object.values(this.progress).map(p => p.startTime).filter(Boolean);
    const endTimes = Object.values(this.progress).map(p => p.endTime).filter(Boolean);

    if (startTimes.length === 0 || endTimes.length === 0) {
      return 0;
    }

    const earliestStart = new Date(Math.min(...startTimes.map(t => new Date(t))));
    const latestEnd = new Date(Math.max(...endTimes.map(t => new Date(t))));

    return (latestEnd - earliestStart) / (1000 * 60);
  }

  /**
   * 发送消息给 Agent
   * @param {string} agentName - Agent 名称
   * @param {string} messageType - 消息类型
   * @param {Object} content - 消息内容
   */
  sendMessageToAgent(agentName, messageType, content) {
    const mailboxFile = path.join(this.mailboxDir, `to-${agentName}.md`);
    
    const message = {
      type: messageType,
      content: content,
      sentAt: new Date().toISOString(),
      sender: 'coordinator'
    };

    try {
      // 读取现有内容
      let existingContent = '';
      if (fs.existsSync(mailboxFile)) {
        existingContent = fs.readFileSync(mailboxFile, 'utf8');
      }

      // 添加新消息
      const newContent = `${existingContent}\n\n## 消息\n\n${JSON.stringify(message, null, 2)}`;
      
      fs.writeFileSync(mailboxFile, newContent);
      console.log(`消息已发送到 ${agentName}`);
    } catch (error) {
      console.error('发送消息失败:', error);
    }
  }

  /**
   * 解决冲突
   * @param {Object} conflict - 冲突信息
   */
  resolveConflict(conflict) {
    console.log('解决冲突:', conflict);
    
    // 冲突解决策略
    // 1. 优先级高的任务优先
    // 2. 先到先得
    // 3. 手动干预

    const resolution = {
      conflict: conflict,
      resolution: 'resolved',
      strategy: 'priority-based',
      resolvedAt: new Date().toISOString()
    };

    console.log('冲突已解决:', resolution);
    return resolution;
  }

  /**
   * 获取当前进度
   * @returns {Object} 进度信息
   */
  getCurrentProgress() {
    return {
      progress: this.progress,
      tasks: this.tasks,
      agents: this.agents,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 暂停执行
   */
  pauseExecution() {
    console.log('暂停执行');
    // 实际实现时需要暂停所有正在执行的任务
  }

  /**
   * 恢复执行
   */
  resumeExecution() {
    console.log('恢复执行');
    // 实际实现时需要恢复所有暂停的任务
  }

  /**
   * 取消执行
   */
  cancelExecution() {
    console.log('取消执行');
    // 实际实现时需要取消所有正在执行的任务
  }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ParallelCoordinator;
}

// 测试代码
if (require.main === module) {
  const coordinator = new ParallelCoordinator();
  coordinator.initialize();
  
  // 测试任务
  const testTasks = [
    {
      id: 'TASK-1',
      title: '系统架构设计',
      type: 'design',
      priority: 'high',
      status: 'pending',
      assignee: 'architect',
      estimatedHours: 8,
      dependencies: []
    },
    {
      id: 'TASK-2',
      title: '数据库设计',
      type: 'database',
      priority: 'high',
      status: 'pending',
      assignee: 'dba',
      estimatedHours: 6,
      dependencies: ['TASK-1']
    },
    {
      id: 'TASK-3',
      title: 'API 设计',
      type: 'backend',
      priority: 'high',
      status: 'pending',
      assignee: 'backend-dev',
      estimatedHours: 4,
      dependencies: ['TASK-1']
    },
    {
      id: 'TASK-4',
      title: '后端开发',
      type: 'backend',
      priority: 'high',
      status: 'pending',
      assignee: 'backend-dev',
      estimatedHours: 16,
      dependencies: ['TASK-2', 'TASK-3']
    },
    {
      id: 'TASK-5',
      title: '前端开发',
      type: 'frontend',
      priority: 'high',
      status: 'pending',
      assignee: 'frontend-dev',
      estimatedHours: 16,
      dependencies: ['TASK-3']
    }
  ];
  
  coordinator.startParallelExecution(testTasks);
  
  // 定时打印进度
  setInterval(() => {
    console.log('\n=== 当前进度 ===');
    console.log(JSON.stringify(coordinator.getCurrentProgress(), null, 2));
  }, 5000);
}
