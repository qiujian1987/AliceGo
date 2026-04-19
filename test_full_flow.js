const analyzer = require('./.trae/skills/requirement-analyzer/scripts/analyze.js');
const planner = require('./.trae/skills/project-planner/scripts/plan.js');
const architecturePlanner = require('./.trae/skills/architecture-planner/scripts/plan.js');
const databaseDesigner = require('./.trae/skills/database-designer/scripts/design.js');
const apiDesigner = require('./.trae/skills/api-designer/scripts/design.js');

async function testFullFlow() {
  try {
    console.log('=== 开始测试完整流程 ===\n');

    // 1. 需求分析
    console.log('1. 执行需求分析...');
    const requirementResult = await analyzer.run({
      user_input: '开发一个可转债套利项目，需要实现数据抓取、策略分析、监控预警和自动交易功能，采用MVP模式，使用Python技术栈',
      context: '这是一个新的投资工具项目，目标是帮助用户实现可转债的自动化套利',
      priority: 'high'
    });
    console.log('需求分析完成：', requirementResult.message);
    console.log('生成的需求文档：design/requirements_spec.md\n');

    // 2. 任务拆解
    console.log('2. 执行任务拆解...');
    const projectPlanResult = await planner.run({
      requirements: requirementResult.data.requirements,
      team_size: 3,
      deadline: '2026-06-30'
    });
    console.log('任务拆解完成：', projectPlanResult.message);
    console.log('生成的项目计划：design/project_plan.md');
    console.log('生成的任务文件：design/tasks/ 目录\n');

    // 3. 架构设计
    console.log('3. 执行架构设计...');
    const architectureResult = await architecturePlanner.run({
      requirements: requirementResult.data.requirements,
      constraints: {
        budget: 'medium',
        team_skill: ['Python', 'React']
      },
      existing_system: false
    });
    console.log('架构设计完成：', architectureResult.message);
    console.log('生成的架构设计文档：design/architecture.md\n');

    // 4. 数据模型设计
    console.log('4. 执行数据模型设计...');
    const dataModelResult = await databaseDesigner.run({
      architecture: architectureResult.data.architecture,
      requirements: requirementResult.data.requirements
    });
    console.log('数据模型设计完成：', dataModelResult.message);
    console.log('生成的数据模型文档：design/data_model.md');
    console.log('生成的数据库schema：database/schema/schema.sql\n');

    // 5. API设计
    console.log('5. 执行API设计...');
    const apiResult = await apiDesigner.run({
      architecture: architectureResult.data.architecture,
      data_model: dataModelResult.data.data_model
    });
    console.log('API设计完成：', apiResult.message);
    console.log('生成的API合同文档：design/api_contracts.md\n');

    console.log('=== 测试完成 ===');
    console.log('所有流程已成功执行，生成了完整的设计文档。');
    console.log('\n生成的文件：');
    console.log('- design/requirements_spec.md - 需求规约文档');
    console.log('- design/project_plan.md - 项目计划');
    console.log('- design/tasks/ - 任务文件目录');
    console.log('- design/architecture.md - 架构设计文档');
    console.log('- design/data_model.md - 数据模型文档');
    console.log('- design/api_contracts.md - API合同文档');
    console.log('- database/schema/schema.sql - 数据库schema文件');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testFullFlow();
