const analyzer = require('./.trae/skills/requirement-analyzer/scripts/analyze.js');

async function testRequirementAnalyzer() {
  try {
    const result = await analyzer.run({
      user_input: '开发一个可转债套利项目，需要实现数据抓取、策略分析、监控预警和自动交易功能，采用MVP模式，使用Python技术栈',
      context: '这是一个新的投资工具项目，目标是帮助用户实现可转债的自动化套利',
      priority: 'high'
    });
    console.log('需求分析结果:', result);
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testRequirementAnalyzer();
