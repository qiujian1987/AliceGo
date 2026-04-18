const MemoryManager = require('./memory_manager');

class ConversationManager {
  constructor() {
    this.memoryManager = new MemoryManager();
  }

  // 对话开始
  async onConversationStart() {
    try {
      console.log('\n=== 对话开始 ===');
      
      // 生成项目摘要
      const summary = await this.memoryManager.generateProjectSummary();
      
      // 输出项目状态摘要
      if (summary.summary) {
        console.log('=== 项目状态摘要 ===');
        console.log(summary.summary);
        console.log('=================\n');
      } else {
        console.log('项目状态：新对话，无历史记录\n');
      }
      
      return summary;
    } catch (error) {
      console.error('Error on conversation start:', error);
      return { summary: '无法加载项目状态' };
    }
  }

  // 处理对话消息
  async onMessage(message) {
    try {
      // 检测重要决策
      if (this.containsDecision(message)) {
        const decision = this.extractDecision(message);
        if (decision) {
          await this.memoryManager.addDecision({
            topic: decision.topic,
            decision: decision.content,
            reasoning: decision.reasoning || '用户决策',
            made_by: 'user'
          });
          console.log('决策已记录到记忆系统');
        }
      }
      
      // 检测项目状态变更
      if (this.containsStateChange(message)) {
        const newState = this.extractState(message);
        if (newState) {
          const currentState = await this.memoryManager.loadProjectState();
          await this.memoryManager.saveProjectState({
            ...currentState,
            ...newState
          });
          console.log('项目状态已更新');
        }
      }
      
      // 检测任务操作
      if (this.containsTaskOperation(message)) {
        const taskOperation = this.extractTaskOperation(message);
        if (taskOperation) {
          console.log('任务操作：', taskOperation);
          // 这里可以集成 task_manager.js
        }
      }
      
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  // 对话结束
  async onConversationEnd() {
    try {
      console.log('\n=== 对话结束 ===');
      
      // 创建状态快照
      const snapshotPath = await this.memoryManager.createSnapshot();
      
      if (snapshotPath) {
        console.log(`状态快照已创建：${snapshotPath}`);
      } else {
        console.log('状态快照创建失败');
      }
      
      console.log('对话历史已保存');
      console.log('=================\n');
      
      return snapshotPath;
    } catch (error) {
      console.error('Error on conversation end:', error);
      return null;
    }
  }

  // 检测是否包含决策
  containsDecision(message) {
    const decisionKeywords = [
      '决定', '决策', '选择', '确定', '选用', '使用',
      'decide', 'decision', 'choose', 'select', 'use'
    ];
    
    return decisionKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // 提取决策
  extractDecision(message) {
    const text = message.toLowerCase();
    
    // 简单的决策提取逻辑
    // 实际应用中可以使用更复杂的 NLP 方法
    let topic = '决策';
    let content = message;
    let reasoning = '';
    
    // 尝试提取主题
    if (text.includes('技术栈') || text.includes('tech stack')) {
      topic = '技术栈选择';
    } else if (text.includes('架构') || text.includes('architecture')) {
      topic = '架构设计';
    } else if (text.includes('数据库') || text.includes('database')) {
      topic = '数据库选择';
    } else if (text.includes('框架') || text.includes('framework')) {
      topic = '框架选择';
    }
    
    return { topic, content, reasoning };
  }

  // 检测是否包含状态变更
  containsStateChange(message) {
    const stateKeywords = [
      '阶段', '状态', '进度', '完成', '开始',
      'phase', 'state', 'progress', 'complete', 'start'
    ];
    
    return stateKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // 提取状态变更
  extractState(message) {
    const text = message.toLowerCase();
    let state = {};
    
    // 简单的状态提取逻辑
    if (text.includes('phase 1') || text.includes('第一阶段')) {
      state.current_phase = 'Phase 1';
    } else if (text.includes('phase 2') || text.includes('第二阶段')) {
      state.current_phase = 'Phase 2';
    } else if (text.includes('phase 3') || text.includes('第三阶段')) {
      state.current_phase = 'Phase 3';
    }
    
    if (text.includes('完成') || text.includes('completed')) {
      state.status = 'completed';
    } else if (text.includes('进行中') || text.includes('in progress')) {
      state.status = 'in_progress';
    } else if (text.includes('待开始') || text.includes('pending')) {
      state.status = 'pending';
    }
    
    return Object.keys(state).length > 0 ? state : null;
  }

  // 检测是否包含任务操作
  containsTaskOperation(message) {
    const taskKeywords = [
      '任务', 'todo', '完成', '分配', '创建',
      'task', 'assign', 'create', 'complete', 'add'
    ];
    
    return taskKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // 提取任务操作
  extractTaskOperation(message) {
    const text = message.toLowerCase();
    let operation = null;
    
    if (text.includes('创建任务') || text.includes('add task')) {
      operation = 'create';
    } else if (text.includes('完成任务') || text.includes('complete task')) {
      operation = 'complete';
    } else if (text.includes('分配任务') || text.includes('assign task')) {
      operation = 'assign';
    } else if (text.includes('删除任务') || text.includes('delete task')) {
      operation = 'delete';
    }
    
    return operation;
  }

  // 生成对话摘要
  generateConversationSummary(messages) {
    try {
      if (!messages || messages.length === 0) {
        return '无对话内容';
      }
      
      let summary = '对话摘要：\n';
      
      // 提取关键信息
      const keyMessages = messages.filter(msg => 
        this.containsDecision(msg) || 
        this.containsStateChange(msg) || 
        this.containsTaskOperation(msg)
      );
      
      if (keyMessages.length > 0) {
        keyMessages.forEach((msg, index) => {
          summary += `${index + 1}. ${msg}\n`;
        });
      } else {
        // 如果没有关键信息，取最后几条消息
        const recentMessages = messages.slice(-3);
        recentMessages.forEach((msg, index) => {
          summary += `${index + 1}. ${msg}\n`;
        });
      }
      
      return summary;
    } catch (error) {
      console.error('Error generating conversation summary:', error);
      return '无法生成对话摘要';
    }
  }

  // 测试记忆系统
  async testMemorySystem() {
    try {
      console.log('=== 测试记忆系统 ===');
      
      // 测试保存项目状态
      console.log('1. 测试保存项目状态');
      const projectState = {
        project_name: '测试项目',
        project_description: '这是一个测试项目',
        current_phase: 'Phase 1',
        key_metrics: {
          tasks_completed: 0,
          tasks_in_progress: 1,
          total_tasks: 3
        }
      };
      
      const saveResult = await this.memoryManager.saveProjectState(projectState);
      console.log('保存项目状态结果:', saveResult);
      
      // 测试添加任务
      console.log('\n2. 测试添加任务');
      const taskResult = await this.memoryManager.addTask({
        content: '测试任务',
        assignee: 'test-agent',
        status: 'in_progress',
        priority: 'high'
      });
      console.log('添加任务结果:', taskResult);
      
      // 测试添加决策
      console.log('\n3. 测试添加决策');
      const decisionResult = await this.memoryManager.addDecision({
        topic: '测试决策',
        decision: '选择测试方案',
        reasoning: '基于测试需求',
        made_by: 'test-user'
      });
      console.log('添加决策结果:', decisionResult);
      
      // 测试生成摘要
      console.log('\n4. 测试生成摘要');
      const summary = await this.memoryManager.generateProjectSummary();
      console.log('生成摘要结果:', summary.summary);
      
      // 测试创建快照
      console.log('\n5. 测试创建快照');
      const snapshotPath = await this.memoryManager.createSnapshot();
      console.log('创建快照结果:', snapshotPath);
      
      console.log('\n=== 测试完成 ===');
      return true;
    } catch (error) {
      console.error('Error testing memory system:', error);
      return false;
    }
  }
}

module.exports = ConversationManager;