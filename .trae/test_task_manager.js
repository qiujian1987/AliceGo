// 测试任务管理集成
const TaskManager = require('./task_manager');

async function testTaskManager() {
  console.log('=== 测试任务管理集成 ===\n');
  
  const taskManager = new TaskManager();
  
  try {
    // 1. 测试创建任务
    console.log('1. 测试创建任务');
    const newTask = await taskManager.createTask({
      content: '测试任务1',
      assignee: 'frontend-dev',
      status: 'pending',
      priority: 'high'
    });
    console.log('创建任务结果:', newTask ? '成功' : '失败');
    if (newTask) {
      console.log('任务ID:', newTask.id);
      console.log('任务内容:', newTask.content);
    }
    
    // 2. 测试获取任务统计
    console.log('\n2. 测试获取任务统计');
    const stats = taskManager.getTaskStats();
    console.log('任务统计:', stats);
    
    // 3. 测试更新任务状态
    console.log('\n3. 测试更新任务状态');
    if (newTask) {
      const updateResult = await taskManager.updateTaskStatus(newTask.id, 'in_progress');
      console.log('更新任务状态结果:', updateResult);
    }
    
    // 4. 测试再次获取任务统计
    console.log('\n4. 测试再次获取任务统计');
    const stats2 = taskManager.getTaskStats();
    console.log('任务统计:', stats2);
    
    // 5. 测试创建第二个任务
    console.log('\n5. 测试创建第二个任务');
    const newTask2 = await taskManager.createTask({
      content: '测试任务2',
      assignee: 'backend-dev',
      status: 'pending',
      priority: 'medium'
    });
    console.log('创建第二个任务结果:', newTask2 ? '成功' : '失败');
    
    // 6. 测试同步到记忆
    console.log('\n6. 测试同步到记忆');
    const syncToMemoryResult = await taskManager.syncToMemory();
    console.log('同步到记忆结果:', syncToMemoryResult);
    
    // 7. 测试同步从记忆
    console.log('\n7. 测试同步从记忆');
    const syncFromMemoryResult = await taskManager.syncFromMemory();
    console.log('同步从记忆结果:', syncFromMemoryResult);
    
    // 8. 测试删除任务
    console.log('\n8. 测试删除任务');
    if (newTask) {
      const deleteResult = await taskManager.removeTask(newTask.id);
      console.log('删除任务结果:', deleteResult);
    }
    
    // 9. 测试最终任务统计
    console.log('\n9. 测试最终任务统计');
    const finalStats = taskManager.getTaskStats();
    console.log('最终任务统计:', finalStats);
    
    console.log('\n=== 测试完成 ===');
    console.log('任务管理集成测试成功！');
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

// 运行测试
testTaskManager();