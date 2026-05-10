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

      // 获取现有特性列表
      const features = this.getExistingFeatures();

      // 生成项目计划
      const projectPlan = this.generateProjectPlan(requirements, team_size, deadline, features);

      // 保存项目计划到文件
      const outputFiles = this.saveProjectPlan(projectPlan, features);

      return {
        status: 'success',
        data: {
          project_plan: projectPlan,
          output_files: outputFiles
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
   * 获取现有特性列表
   * @returns {Array} 特性列表
   */
  getExistingFeatures() {
    const featuresDir = path.join(process.cwd(), 'design', 'features');
    const features = [];

    if (fs.existsSync(featuresDir)) {
      const items = fs.readdirSync(featuresDir, { withFileTypes: true });
      items.forEach(item => {
        if (item.isDirectory()) {
          features.push(item.name);
        }
      });
    }

    // 如果没有现有特性，创建默认特性
    if (features.length === 0) {
      features.push('feature-001');
      features.push('feature-002');
      features.push('feature-003');
    }

    return features;
  }

  /**
   * 生成项目计划
   * @param {Object} requirements - 需求规约文档
   * @param {number} team_size - 团队规模
   * @param {string} deadline - 截止日期
   * @param {Array} features - 特性列表
   * @returns {Object} 项目计划
   */
  generateProjectPlan(requirements, team_size, deadline, features) {
    // 生成里程碑
    const milestones = this.generateMilestones(deadline);

    // 生成任务（按特性分组）
    const tasks = this.generateTasksByFeature(features, milestones);

    // 生成时间线
    const timeline = `${new Date().toISOString().split('T')[0]} 至 ${deadline}`;

    return {
      milestones,
      tasks,
      timeline,
      features
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
        tasks: ['需求分析', '架构设计', '数据模型设计', 'API设计']
      },
      {
        name: '核心功能开发',
        date: '2026-05-30',
        tasks: ['特性1开发', '特性2开发', '特性3开发']
      },
      {
        name: '测试与集成',
        date: '2026-06-15',
        tasks: ['单元测试', '集成测试', '性能测试']
      },
      {
        name: '部署上线',
        date: deadline,
        tasks: ['部署准备', '上线部署', '验收确认']
      }
    ];

    return milestones;
  }

  /**
   * 按特性生成任务
   * @param {Array} features - 特性列表
   * @param {Array} milestones - 里程碑列表
   * @returns {Array} 任务列表
   */
  generateTasksByFeature(features, milestones) {
    const tasks = [];
    let taskId = 1;

    // 设计阶段任务
    const designTasks = [
      { name: '需求分析', assignee: 'Team Lead', priority: 'high', estimated_hours: 8, milestone: '需求分析与设计', feature: null },
      { name: '后端架构设计', assignee: 'Architect', priority: 'high', estimated_hours: 16, milestone: '需求分析与设计', feature: null },
      { name: '前端架构设计', assignee: 'Frontend Designer', priority: 'high', estimated_hours: 12, milestone: '需求分析与设计', feature: null },
      { name: '数据模型设计', assignee: 'DBA', priority: 'high', estimated_hours: 12, milestone: '需求分析与设计', feature: null },
      { name: 'API设计', assignee: 'Architect', priority: 'high', estimated_hours: 10, milestone: '需求分析与设计', feature: null }
    ];

    designTasks.forEach((task, index) => {
      tasks.push({
        id: `T${String(taskId++).padStart(3, '0')}`,
        ...task,
        dependencies: index > 0 ? [`T${String(taskId - 2).padStart(3, '0')}`] : []
      });
    });

    // 特性开发任务
    features.forEach((feature, featureIndex) => {
      const featureTasks = [
        { name: `${feature} - 后端开发`, assignee: 'Backend Dev', priority: 'high', estimated_hours: 24, milestone: '核心功能开发', feature },
        { name: `${feature} - 前端开发`, assignee: 'Frontend Dev', priority: 'high', estimated_hours: 20, milestone: '核心功能开发', feature },
        { name: `${feature} - 单元测试`, assignee: 'QA', priority: 'medium', estimated_hours: 8, milestone: '测试与集成', feature }
      ];

      featureTasks.forEach(task => {
        const dependsOn = featureIndex === 0 ? ['T005'] : [`T${String(taskId - 3).padStart(3, '0')}`];
        tasks.push({
          id: `T${String(taskId++).padStart(3, '0')}`,
          ...task,
          dependencies: dependsOn
        });
      });
    });

    // 测试和部署任务
    const finalTasks = [
      { name: '集成测试', assignee: 'QA', priority: 'high', estimated_hours: 16, milestone: '测试与集成', feature: null },
      { name: '性能测试', assignee: 'QA', priority: 'medium', estimated_hours: 12, milestone: '测试与集成', feature: null },
      { name: '部署准备', assignee: 'DevOps', priority: 'high', estimated_hours: 8, milestone: '部署上线', feature: null },
      { name: '上线部署', assignee: 'DevOps', priority: 'high', estimated_hours: 4, milestone: '部署上线', feature: null },
      { name: '验收确认', assignee: 'Team Lead', priority: 'high', estimated_hours: 4, milestone: '部署上线', feature: null }
    ];

    finalTasks.forEach(task => {
      tasks.push({
        id: `T${String(taskId++).padStart(3, '0')}`,
        ...task,
        dependencies: [`T${String(taskId - 2).padStart(3, '0')}`]
      });
    });

    return tasks;
  }

  /**
   * 保存项目计划到文件
   * @param {Object} projectPlan - 项目计划
   * @param {Array} features - 特性列表
   * @returns {Array} 输出文件列表
   */
  saveProjectPlan(projectPlan, features) {
    const outputFiles = [];

    try {
      const outputDir = path.join(process.cwd(), 'design', 'project_overview');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // 创建特性目录（如果不存在）
      const featuresDir = path.join(process.cwd(), 'design', 'features');
      if (!fs.existsSync(featuresDir)) {
        fs.mkdirSync(featuresDir, { recursive: true });
      }

      const { milestones, tasks, timeline } = projectPlan;

      // 生成总项目计划文件
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
        document += `- 所属特性: ${task.feature || '公共任务'}\n`;
        document += `- 依赖: ${task.dependencies.length > 0 ? task.dependencies.join(', ') : '无'}\n`;
        // 添加依赖任务的详细信息
        if (task.dependencies.length > 0) {
          document += `- 依赖任务详情:\n`;
          task.dependencies.forEach(depId => {
            const depTask = tasks.find(t => t.id === depId);
            if (depTask) {
              document += `  - ${depId}. ${depTask.name} (负责人: ${depTask.assignee})\n`;
            }
          });
        }
        document += `\n`;
      });

      // 保存总项目计划文件
      const projectPlanPath = path.join(outputDir, 'project_plan.md');
      fs.writeFileSync(projectPlanPath, document, 'utf-8');
      console.log(`项目计划已保存到: ${projectPlanPath}`);
      outputFiles.push(projectPlanPath);

      // 为每个特性创建任务目录和任务文件
      features.forEach(feature => {
        const featureDir = path.join(featuresDir, feature);
        if (!fs.existsSync(featureDir)) {
          fs.mkdirSync(featureDir, { recursive: true });
        }

        const tasksDir = path.join(featureDir, 'tasks');
        if (!fs.existsSync(tasksDir)) {
          fs.mkdirSync(tasksDir, { recursive: true });
        }

        // 筛选该特性的任务
        const featureTasks = tasks.filter(t => t.feature === feature);

        featureTasks.forEach(task => {
          const taskFilename = `${task.id}_${task.name.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_')}.md`;
          const taskFilePath = path.join(tasksDir, taskFilename);

          let taskDocument = `# 任务详情\n\n`;
          taskDocument += `## 基本信息\n`;
          taskDocument += `- 任务ID: ${task.id}\n`;
          taskDocument += `- 任务名称: ${task.name}\n`;
          taskDocument += `- 所属特性: ${task.feature}\n`;
          taskDocument += `- 负责人: ${task.assignee}\n`;
          taskDocument += `- 优先级: ${task.priority}\n`;
          taskDocument += `- 预计工时: ${task.estimated_hours} 小时\n`;
          taskDocument += `- 任务状态: 待执行\n`;
          taskDocument += `- 进度: 0%\n\n`;

          taskDocument += `## 任务描述\n详细描述任务内容和目标...\n\n`;

          taskDocument += `## 依赖关系\n`;
          if (task.dependencies.length > 0) {
            taskDocument += `- 依赖任务: ${task.dependencies.join(', ')}\n`;
            taskDocument += `- 依赖任务详情:\n`;
            task.dependencies.forEach(depId => {
              const depTask = tasks.find(t => t.id === depId);
              if (depTask) {
                taskDocument += `  - ${depId}. ${depTask.name} (负责人: ${depTask.assignee})\n`;
              }
            });
          } else {
            taskDocument += `- 依赖任务: 无\n`;
          }
          taskDocument += `\n`;

          taskDocument += `## 验收标准\n- 标准1: ...\n- 标准2: ...\n\n`;

          taskDocument += `## 相关文档\n- 文档1: ...\n- 文档2: ...\n\n`;

          taskDocument += `## 变更记录\n| 日期 | 变更内容 | 变更人 |\n|------|----------|--------|\n| ${new Date().toISOString().split('T')[0]} | 任务创建 | System |\n`;

          fs.writeFileSync(taskFilePath, taskDocument, 'utf-8');
          console.log(`任务文件已保存到: ${taskFilePath}`);
          outputFiles.push(taskFilePath);
        });
      });

      // 为公共任务（不属于任何特性）创建任务文件
      const projectTasksDir = path.join(outputDir, 'tasks');
      if (!fs.existsSync(projectTasksDir)) {
        fs.mkdirSync(projectTasksDir, { recursive: true });
      }

      const commonTasks = tasks.filter(t => !t.feature);
      commonTasks.forEach(task => {
        const taskFilename = `${task.id}_${task.name.toLowerCase().replace(/\s+/g, '_')}.md`;
        const taskFilePath = path.join(projectTasksDir, taskFilename);

        let taskDocument = `# 任务详情\n\n`;
        taskDocument += `## 基本信息\n`;
        taskDocument += `- 任务ID: ${task.id}\n`;
        taskDocument += `- 任务名称: ${task.name}\n`;
        taskDocument += `- 所属特性: 公共任务\n`;
        taskDocument += `- 负责人: ${task.assignee}\n`;
        taskDocument += `- 优先级: ${task.priority}\n`;
        taskDocument += `- 预计工时: ${task.estimated_hours} 小时\n`;
        taskDocument += `- 任务状态: 待执行\n`;
        taskDocument += `- 进度: 0%\n\n`;

        taskDocument += `## 任务描述\n详细描述任务内容和目标...\n\n`;

        taskDocument += `## 依赖关系\n`;
        if (task.dependencies.length > 0) {
          taskDocument += `- 依赖任务: ${task.dependencies.join(', ')}\n`;
          taskDocument += `- 依赖任务详情:\n`;
          task.dependencies.forEach(depId => {
            const depTask = tasks.find(t => t.id === depId);
            if (depTask) {
              taskDocument += `  - ${depId}. ${depTask.name} (负责人: ${depTask.assignee})\n`;
            }
          });
        } else {
          taskDocument += `- 依赖任务: 无\n`;
        }
        taskDocument += `\n`;

        taskDocument += `## 验收标准\n- 标准1: ...\n- 标准2: ...\n\n`;

        taskDocument += `## 相关文档\n- 文档1: ...\n- 文档2: ...\n\n`;

        taskDocument += `## 变更记录\n| 日期 | 变更内容 | 变更人 |\n|------|----------|--------|\n| ${new Date().toISOString().split('T')[0]} | 任务创建 | System |\n`;

        fs.writeFileSync(taskFilePath, taskDocument, 'utf-8');
        console.log(`公共任务文件已保存到: ${taskFilePath}`);
        outputFiles.push(taskFilePath);
      });

    } catch (error) {
      console.error('保存项目计划失败:', error);
    }

    return outputFiles;
  }
}

// 导出技能
module.exports = new ProjectPlanner();
