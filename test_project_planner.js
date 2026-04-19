const planner = require('./.trae/skills/project-planner/scripts/plan.js');

async function testProjectPlanner() {
  try {
    const requirements = {
      business_needs: ['实现可转债套利', '获取市场数据'],
      functional_requirements: ['数据抓取', '策略分析', '自动交易', '监控预警'],
      non_functional_requirements: ['MVP模式', 'Python技术栈'],
      scope: '可转债套利系统，先完成核心功能，后续迭代完善',
      acceptance_criteria: [
        '数据采集功能正常，能获取准确的可转债数据',
        '策略分析准确，能识别套利机会',
        '自动交易功能正常执行',
        '监控预警有效及时'
      ],
      risks: [
        '市场风险：市场波动可能影响套利效果',
        '技术风险：数据采集失败、API调用限制等',
        'API限制：券商API可能有调用频率限制'
      ]
    };

    const result = await planner.run({
      requirements: requirements,
      team_size: 3,
      deadline: '2026-06-30'
    });
    console.log('项目规划结果:', result);
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testProjectPlanner();
