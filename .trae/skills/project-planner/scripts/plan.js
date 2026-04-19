const fs = require('fs');
const path = require('path');

class ProjectPlanner {
  constructor() {
    this.skillsDir = path.dirname(__dirname);
  }

  /**
   * 运行项目规划
   * @param {Object} params - 输入参数
   * @param {Object} params.requirements - 需求规约文档
   * @param {number} params.team_size - 团队规模
   * @param {string} params.deadline - 截止日期
   * @returns {Promise<Object>} 规划结果
   */
  async run(params) {
    try {
      const { requirements, team_size = 3, deadline = '2026-06-30' } = params;

      if (!requirements) {
        return {
          status: 'error',
          message: '需求规约文档不能为空'
        };
      }

      // 生成项目计划
      const projectPlan = this.generateProjectPlan(requirements, team_size, deadline);

      // 保存项目计划到文件
      this.saveProjectPlan(projectPlan, 'project_plan.md');

      return {
        status: 'success',
        data: {
          project_plan: projectPlan
        },
        message: '项目规划完成'
      };
    } catch (error) {
      console.error('项目规划失败:', error);
      return {
        status: 'error',
        message: `项目规划失败: ${error.message}`
      };
    }
  }

  /**
   * 生成项目计划
   * @param {Object} requirements - 需求规约文档
   * @param {number} team_size - 团队规模
   * @param {string} deadline - 截止日期
   * @returns {Object} 项目计划
   */
  generateProjectPlan(requirements, team_size, deadline) {
    // 生成里程碑
    const milestones = this.generateMilestones(deadline);

    // 生成任务
    const tasks = this.generateTasks(requirements, milestones);

    // 生成时间线
    const timeline = `${new Date().toISOString().split('T')[0]} 至 ${deadline}`;

    return {
      milestones,
      tasks,
      timeline
    };
  }

  /**
   * 生成里程碑
   * @param {string} deadline - 截止日期
   * @returns {Array} 里程碑列表
   */
  generateMilestones(deadline) {
    const milestones = [
      {
        name: '需求分析与设计',
        date: '2026-04-30',
        tasks: ['需求分析', '架构设计', '数据模型设计']
      },
      {
        name: '核心功能开发',
        date: '2026-05-30',
        tasks: ['数据采集模块', '策略分析模块', '监控预警模块']
      },
      {
        name: '高级功能开发',
        date: '2026-06-15',
        tasks: ['自动交易模块', '前端界面开发']
      },
      {
        name: '测试与部署',
        date: deadline,
        tasks: ['集成测试', '性能测试', '部署上线']
      }
    ];

    return milestones;
  }

  /**
   * 生成任务
   * @param {Object} requirements - 需求规约文档
   * @param {Array} milestones - 里程碑列表
   * @returns {Array} 任务列表
   */
  generateTasks(requirements, milestones) {
    const tasks = [
      {
        id: 'T001',
        name: '需求分析',
        assignee: 'Team Lead',
        priority: 'high',
        estimated_hours: 8,
        dependencies: []
      },
      {
        id: 'T002',
        name: '架构设计',
        assignee: 'Architect',
        priority: 'high',
        estimated_hours: 16,
        dependencies: ['T001']
      },
      {
        id: 'T003',
        name: '数据模型设计',
        assignee: 'DBA',
        priority: 'high',
        estimated_hours: 12,
        dependencies: ['T002']
      },
      {
        id: 'T004',
        name: '数据采集模块开发',
        assignee: 'Backend Dev',
        priority: 'high',
        estimated_hours: 24,
        dependencies: ['T003']
      },
      {
        id: 'T005',
        name: '策略分析模块开发',
        assignee: 'Backend Dev',
        priority: 'high',
        estimated_hours: 32,
        dependencies: ['T004']
      },
      {
        id: 'T006',
        name: '监控预警模块开发',
        assignee: 'Backend Dev',
        priority: 'medium',
        estimated_hours: 20,
        dependencies: ['T005']
      },
      {
        id: 'T007',
        name: '自动交易模块开发',
        assignee: 'Backend Dev',
        priority: 'medium',
        estimated_hours: 28,
        dependencies: ['T006']
      },
      {
        id: 'T008',
        name: '前端界面开发',
        assignee: 'Frontend Dev',
        priority: 'medium',
        estimated_hours: 32,
        dependencies: ['T004']
      },
      {
        id: 'T009',
        name: '集成测试',
        assignee: 'QA',
        priority: 'high',
        estimated_hours: 16,
        dependencies: ['T007', 'T008']
      },
      {
        id: 'T010',
        name: '性能测试',
        assignee: 'QA',
        priority: 'medium',
        estimated_hours: 12,
        dependencies: ['T009']
      },
      {
        id: 'T011',
        name: '部署上线',
        assignee: 'DevOps',
        priority: 'high',
        estimated_hours: 8,
        dependencies: ['T010']
      }
    ];

    return tasks;
  }

  /**
   * 保存项目计划到文件
   * @param {Object} projectPlan - 项目计划
   * @param {string} filename - 文件名
   */
  saveProjectPlan(projectPlan, filename) {
    try {
      const outputDir = path.join(process.cwd(), 'design');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const { milestones, tasks, timeline } = projectPlan;

      let document = `# 项目计划\n\n`;

      document += `## 时间线\n${timeline}\n\n`;

      document += `## 里程碑\n`;
      milestones.forEach((milestone, index) => {
        document += `### ${index + 1}. ${milestone.name}\n`;
        document += `- 日期: ${milestone.date}\n`;
        document += `- 任务: ${milestone.tasks.join(', ')}\n\n`;
      });

      document += `## 任务列表\n`;
      tasks.forEach(task => {
        document += `### ${task.id}. ${task.name}\n`;
        document += `- 负责人: ${task.assignee}\n`;
        document += `- 优先级: ${task.priority}\n`;
        document += `- 预计工时: ${task.estimated_hours} 小时\n`;
        document += `- 依赖: ${task.dependencies.length > 0 ? task.dependencies.join(', ') : '无'}\n\n`;
      });

      const filePath = path.join(outputDir, filename);
      fs.writeFileSync(filePath, document, 'utf-8');
      console.log(`项目计划已保存到: ${filePath}`);
    } catch (error) {
      console.error('保存项目计划失败:', error);
    }
  }
}

// 导出技能
module.exports = new ProjectPlanner();
