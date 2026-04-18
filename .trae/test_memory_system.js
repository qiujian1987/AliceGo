// 测试记忆系统功能
const MemoryManager = require('./memory_manager');

async function testMemorySystem() {
  console.log('=== 测试记忆系统 ===\n');
  
  const memoryManager = new MemoryManager();
  
  try {
    // 1. 测试保存项目状态
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
    
    const saveResult = await memoryManager.saveProjectState(projectState);
    console.log('保存项目状态结果:', saveResult);
    
    // 2. 测试加载项目状态
    console.log('\n2. 测试加载项目状态');
    const loadedState = memoryManager.loadProjectState();
    console.log('加载项目状态结果:', loadedState ? '成功' : '失败');
    if (loadedState) {
      console.log('项目名称:', loadedState.project_name);
    }
    
    // 3. 测试添加任务
    console.log('\n3. 测试添加任务');
    const taskResult = await memoryManager.addTask({
      content: '测试任务',
      assignee: 'test-agent',
      status: 'in_progress',
      priority: 'high'
    });
    console.log('添加任务结果:', taskResult);
    
    // 4. 测试加载任务历史
    console.log('\n4. 测试加载任务历史');
    const taskHistory = memoryManager.loadTaskHistory();
    console.log('任务数量:', taskHistory.tasks.length);
    if (taskHistory.tasks.length > 0) {
      console.log('最近任务:', taskHistory.tasks[taskHistory.tasks.length - 1].content);
    }
    
    // 5. 测试更新任务状态
    console.log('\n5. 测试更新任务状态');
    if (taskHistory.tasks.length > 0) {
      const taskId = taskHistory.tasks[0].id;
      const updateResult = await memoryManager.updateTaskStatus(taskId, 'completed');
      console.log('更新任务状态结果:', updateResult);
    }
    
    // 6. 测试添加决策
    console.log('\n6. 测试添加决策');
    const decisionResult = await memoryManager.addDecision({
      topic: '测试决策',
      decision: '选择测试方案',
      reasoning: '基于测试需求',
      made_by: 'test-user'
    });
    console.log('添加决策结果:', decisionResult);
    
    // 7. 测试加载决策历史
    console.log('\n7. 测试加载决策历史');
    const decisions = memoryManager.loadDecisions();
    console.log('决策数量:', decisions.decisions.length);
    if (decisions.decisions.length > 0) {
      console.log('最近决策:', decisions.decisions[decisions.decisions.length - 1].topic);
    }
    
    // 8. 测试更新Agent状态
    console.log('\n8. 测试更新Agent状态');
    const agentUpdateResult = await memoryManager.updateAgentState('test-agent', {
      current_task: '测试任务',
      status: 'active'
    });
    console.log('更新Agent状态结果:', agentUpdateResult);
    
    // 9. 测试加载Agent状态
    console.log('\n9. 测试加载Agent状态');
    const agentStates = memoryManager.loadAgentStates();
    console.log('Agent数量:', Object.keys(agentStates.agents).length);
    if (agentStates.agents['test-agent']) {
      console.log('Test Agent状态:', agentStates.agents['test-agent'].status);
    }
    
    // 10. 测试生成项目摘要
    console.log('\n10. 测试生成项目摘要');
    const summary = memoryManager.generateProjectSummary();
    console.log('生成摘要结果:');
    console.log(summary.summary);
    
    // 11. 测试创建快照
    console.log('\n11. 测试创建快照');
    const snapshotPath = await memoryManager.createSnapshot();
    console.log('创建快照结果:', snapshotPath);
    
    // 12. 测试并发操作
    console.log('\n12. 测试并发操作');
    const concurrentTasks = [];
    for (let i = 0; i < 5; i++) {
      concurrentTasks.push(memoryManager.addTask({
        content: `并发测试任务 ${i}`,
        assignee: 'test-agent',
        status: 'pending',
        priority: 'medium'
      }));
    }
    
    const concurrentResults = await Promise.all(concurrentTasks);
    console.log('并发操作结果:', concurrentResults.every(result => result));
    
    // 13. 测试错误处理
    console.log('\n13. 测试错误处理');
    // 这里可以测试文件权限等错误情况
    
    console.log('\n=== 测试完成 ===');
    console.log('记忆系统功能测试成功！');
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

// 运行测试
testMemorySystem();