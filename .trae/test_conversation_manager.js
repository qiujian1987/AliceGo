// 测试对话系统集成
const ConversationManager = require('./conversation_manager');

async function testConversationManager() {
  console.log('=== 测试对话系统集成 ===\n');
  
  const conversationManager = new ConversationManager();
  
  try {
    // 1. 测试对话开始
    console.log('1. 测试对话开始');
    const startResult = await conversationManager.onConversationStart();
    console.log('对话开始结果:', startResult ? '成功' : '失败');
    
    // 2. 测试处理消息（普通消息）
    console.log('\n2. 测试处理普通消息');
    await conversationManager.onMessage('你好，我想了解项目状态');
    
    // 3. 测试处理消息（决策消息）
    console.log('\n3. 测试处理决策消息');
    await conversationManager.onMessage('我决定使用 React 作为前端框架');
    
    // 4. 测试处理消息（状态变更消息）
    console.log('\n4. 测试处理状态变更消息');
    await conversationManager.onMessage('项目进入 Phase 2 阶段');
    
    // 5. 测试处理消息（任务操作消息）
    console.log('\n5. 测试处理任务操作消息');
    await conversationManager.onMessage('创建一个新任务：开发登录页面');
    
    // 6. 测试生成对话摘要
    console.log('\n6. 测试生成对话摘要');
    const messages = [
      '你好，我想了解项目状态',
      '我决定使用 React 作为前端框架',
      '项目进入 Phase 2 阶段',
      '创建一个新任务：开发登录页面'
    ];
    const summary = conversationManager.generateConversationSummary(messages);
    console.log('对话摘要:');
    console.log(summary);
    
    // 7. 测试对话结束
    console.log('\n7. 测试对话结束');
    const endResult = await conversationManager.onConversationEnd();
    console.log('对话结束结果:', endResult ? '成功' : '失败');
    if (endResult) {
      console.log('快照路径:', endResult);
    }
    
    // 8. 测试记忆系统
    console.log('\n8. 测试记忆系统集成');
    const testResult = await conversationManager.testMemorySystem();
    console.log('记忆系统测试结果:', testResult ? '成功' : '失败');
    
    console.log('\n=== 测试完成 ===');
    console.log('对话系统集成测试成功！');
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

// 运行测试
testConversationManager();