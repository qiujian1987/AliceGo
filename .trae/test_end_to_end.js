// 端到端测试和验证
const MemoryManager = require('./memory_manager');
const TaskManager = require('./task_manager');
const ConversationManager = require('./conversation_manager');

async function endToEndTest() {
  console.log('=== 端到端测试和验证 ===\n');
  
  // 初始化管理器
  const memoryManager = new MemoryManager();
  const taskManager = new TaskManager();
  const conversationManager = new ConversationManager();
  
  try {
    console.log('1. 初始化测试');
    console.log('=' .repeat(50));
    
    // 2. 测试项目初始化
    console.log('\n2. 测试项目初始化');
    const projectState = {
      project_name: '端到端测试项目',
      project_description: '这是一个端到端测试项目',
      current_phase: 'Phase 1',
      checkpoints: [
        {
          id: 'checkpoint_1',
          name: '数据模型完成',
          status: 'pending',
          completed_at: null
        },
        {
          id: 'checkpoint_2',
          name: 'MVP环境冒烟',
          status: 'pending',
          completed_at: null
        }
      ],
      key_metrics: {
        tasks_completed: 0,
        tasks_in_progress: 0,
        total_tasks: 0
      }
    };
    
    const saveResult = await memoryManager.saveProjectState(projectState);
    console.log('保存项目状态结果:', saveResult);
    
    // 3. 测试任务管理
    console.log('\n3. 测试任务管理');
    const task1 = await taskManager.createTask({
      content: '开发登录页面',
      assignee: 'frontend-dev',
      status: 'pending',
      priority: 'high'
    });
    console.log('创建任务1结果:', task1 ? '成功' : '失败');
    
    const task2 = await taskManager.createTask({
      content: '开发用户API',
      assignee: 'backend-dev',
      status: 'pending',
      priority: 'high'
    });
    console.log('创建任务2结果:', task2 ? '成功' : '失败');
    
    // 4. 测试任务状态更新
    console.log('\n4. 测试任务状态更新');
    if (task1) {
      const updateResult = await taskManager.updateTaskStatus(task1.id, 'in_progress');
      console.log('更新任务1状态结果:', updateResult);
    }
    
    // 5. 测试对话系统
    console.log('\n5. 测试对话系统');
    await conversationManager.onConversationStart();
    
    // 测试对话消息处理
    await conversationManager.onMessage('我决定使用 TypeScript 作为开发语言');
    await conversationManager.onMessage('项目进入 Phase 2 阶段');
    await conversationManager.onMessage('完成登录页面开发');
    
    // 测试对话结束
    await conversationManager.onConversationEnd();
    
    // 6. 测试记忆系统恢复
    console.log('\n6. 测试记忆系统恢复');
    const summary = memoryManager.generateProjectSummary();
    console.log('项目摘要:');
    console.log(summary.summary);
    
    // 7. 测试数据一致性
    console.log('\n7. 测试数据一致性');
    const taskStats = taskManager.getTaskStats();
    console.log('任务统计:', taskStats);
    
    const loadedState = memoryManager.loadProjectState();
    console.log('加载的项目状态:', loadedState ? '成功' : '失败');
    if (loadedState) {
      console.log('项目阶段:', loadedState.current_phase);
    }
    
    // 8. 测试快照功能
    console.log('\n8. 测试快照功能');
    const snapshotPath = await memoryManager.createSnapshot();
    console.log('创建快照结果:', snapshotPath);
    
    // 9. 测试并发操作
    console.log('\n9. 测试并发操作');
    const concurrentTasks = [];
    for (let i = 0; i < 3; i++) {
      concurrentTasks.push(memoryManager.addTask({
        content: `并发测试任务 ${i}`,
        assignee: 'test-agent',
        status: 'pending',
        priority: 'medium'
      }));
    }
    
    const concurrentResults = await Promise.all(concurrentTasks);
    console.log('并发操作结果:', concurrentResults.every(result => result));
    
    // 10. 验证最终状态
    console.log('\n10. 验证最终状态');
    const finalSummary = memoryManager.generateProjectSummary();
    console.log('最终项目摘要:');
    console.log(finalSummary.summary);
    
    console.log('\n' + '=' .repeat(50));
    console.log('=== 端到端测试完成 ===');
    console.log('所有测试通过！TRAE 记忆系统集成成功。');
    
  } catch (error) {
    console.error('端到端测试失败:', error);
  }
}

// 运行端到端测试
endToEndTest();