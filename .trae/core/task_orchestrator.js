const fs = require('fs');
const path = require('path');

class TaskOrchestrator {
  constructor() {
    this.tasks = [];
    this.agents = [];
    this.taskHistory = [];
    this.baseDir = process.cwd();
  }

  /**
   * 分析需求并拆解任务
   * @param {string} requirement - 用户需求
   * @returns {Array} 拆解后的任务列表
   */
  analyzeAndDecompose(requirement) {
    console.log('正在分析需求:', requirement);
    
    // 需求对齐阶段
    const alignedRequirement = this.alignRequirement(requirement);
    
    // 需求分类
    const categories = this.categorizeRequirement(alignedRequirement);
    
    // 任务拆解
    const decomposedTasks = this.decomposeTasks(categories, alignedRequirement);
    
    // 任务优先级排序
    const prioritizedTasks = this.prioritizeTasks(decomposedTasks);
    
    // 分配任务
    const assignedTasks = this.assignTasks(prioritizedTasks);
    
    // 保存任务历史
    this.saveTasks(assignedTasks);
    
    return assignedTasks;
  }

  /**
   * 需求对齐阶段
   * @param {string} requirement - 用户需求
   * @returns {string} 对齐后的需求
   */
  alignRequirement(requirement) {
    console.log('=== 需求对齐阶段 ===');
    
    // 1. 需求收集
    console.log('1. 需求收集');
    console.log('原始需求:', requirement);
    
    // 2. 需求分析
    console.log('\n2. 需求分析');
    const categories = this.categorizeRequirement(requirement);
    console.log('需求分类:', categories);
    
    // 3. 需求确认
    console.log('\n3. 需求确认');
    console.log('请确认以下需求是否完整:');
    console.log('- 功能需求: 请确认所有功能点是否已明确');
    console.log('- 非功能需求: 请确认性能、安全、可扩展性等要求');
    console.log('- 验收标准: 请确认项目的验收标准');
    
    // 4. 需求文档化
    console.log('\n4. 需求文档化');
    const requirementDoc = this.generateRequirementDoc(requirement, categories);
    console.log('需求文档已生成:', requirementDoc);
    
    // 模拟用户确认
    console.log('\n5. 用户确认');
    console.log('假设用户已确认需求文档');
    
    return requirement;
  }

  /**
   * 生成需求文档
   * @param {string} requirement - 用户需求
   * @param {Object} categories - 需求分类
   * @returns {Object} 需求文档
   */
  generateRequirementDoc(requirement, categories) {
    const doc = {
      id: `REQ-${Date.now()}`,
      title: '需求文档',
      originalRequirement: requirement,
      categories: categories,
      functionalRequirements: [],
      nonFunctionalRequirements: [],
      acceptanceCriteria: [],
      generatedAt: new Date().toISOString(),
      confirmed: false
    };
    
    // 简单的需求分析
    if (categories.frontend) {
      doc.functionalRequirements.push('前端界面实现');
      doc.nonFunctionalRequirements.push('前端性能优化');
    }
    
    if (categories.backend) {
      doc.functionalRequirements.push('后端API实现');
      doc.nonFunctionalRequirements.push('后端性能优化');
    }
    
    if (categories.database) {
      doc.functionalRequirements.push('数据库设计');
      doc.nonFunctionalRequirements.push('数据库性能优化');
    }
    
    // 生成验收标准
    doc.acceptanceCriteria.push('所有功能需求已实现');
    doc.acceptanceCriteria.push('系统运行稳定');
    doc.acceptanceCriteria.push('性能满足要求');
    
    // 保存需求文档
    const reqDocPath = path.join(this.baseDir, '.trae', 'memory', 'requirement_doc.json');
    try {
      fs.writeFileSync(reqDocPath, JSON.stringify(doc, null, 2));
      console.log('需求文档已保存到:', reqDocPath);
    } catch (error) {
      console.error('保存需求文档失败:', error);
    }
    
    return doc;
  }

  /**
   * 需求分类
   * @param {string} requirement - 用户需求
   * @returns {Object} 需求分类结果
   */
  categorizeRequirement(requirement) {
    const categories = {
      frontend: false,
      backend: false,
      database: false,
      devops: false,
      design: false,
      testing: false
    };

    // 简单的关键词匹配
    const keywords = {
      frontend: ['前端', 'UI', '界面', '用户界面', 'React', 'Vue', 'Angular', '网站', '网页', '电商'],
      backend: ['后端', 'API', '服务器', 'Node.js', 'Java', 'Python', '网站', '系统', '电商'],
      database: ['数据库', 'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', '存储', '数据'],
      devops: ['部署', 'CI/CD', '环境', '服务器'],
      design: ['设计', '架构', '系统设计', '技术方案', '网站', '系统'],
      testing: ['测试', 'QA', '质量', '自动化测试']
    };

    Object.keys(keywords).forEach(category => {
      keywords[category].forEach(keyword => {
        if (requirement.includes(keyword)) {
          categories[category] = true;
        }
      });
    });

    // 默认逻辑：如果没有匹配到任何关键词，默认包含基本类别
    if (!Object.values(categories).some(Boolean)) {
      categories.frontend = true;
      categories.backend = true;
      categories.database = true;
      categories.design = true;
      categories.testing = true;
    }

    return categories;
  }

  /**
   * 任务拆解
   * @param {Object} categories - 需求分类
   * @param {string} requirement - 用户需求
   * @returns {Array} 拆解后的任务
   */
  decomposeTasks(categories, requirement) {
    const tasks = [];
    let taskId = 1;

    // 需求对齐任务
    tasks.push({
      id: `TASK-${taskId++}`,
      title: '需求对齐',
      description: '与用户沟通确认需求，生成需求文档',
      type: 'design',
      priority: 'high',
      status: 'pending',
      estimatedHours: 4,
      dependencies: []
    });

    // 设计任务 - 整体架构设计
    if (categories.design) {
      tasks.push({
        id: `TASK-${taskId++}`,
        title: '整体架构设计',
        description: '设计系统的整体架构，包括模块划分、技术选型等',
        type: 'design',
        priority: 'high',
        status: 'pending',
        estimatedHours: 8,
        dependencies: ['TASK-1']
      });
    }

    // 数据库任务 - 数据模型设计
    if (categories.database) {
      tasks.push({
        id: `TASK-${taskId++}`,
        title: '数据模型设计',
        description: '设计数据库表结构、索引策略等',
        type: 'database',
        priority: 'high',
        status: 'pending',
        estimatedHours: 6,
        dependencies: categories.design ? ['TASK-2'] : ['TASK-1']
      });
    }

    // API 设计任务 - 基于数据模型设计
    if (categories.backend) {
      tasks.push({
        id: `TASK-${taskId++}`,
        title: 'API 设计',
        description: '基于数据模型设计 RESTful API 接口规范',
        type: 'backend',
        priority: 'high',
        status: 'pending',
        estimatedHours: 4,
        dependencies: categories.database ? ['TASK-3'] : categories.design ? ['TASK-2'] : ['TASK-1']
      });
    }

    // SQL 编写任务 - 基于数据模型设计
    if (categories.database) {
      tasks.push({
        id: `TASK-${taskId++}`,
        title: 'SQL 编写',
        description: '基于数据模型编写 SQL 语句',
        type: 'database',
        priority: 'high',
        status: 'pending',
        estimatedHours: 4,
        dependencies: ['TASK-3']
      });
    }

    // 测试用例设计任务 - TDD 方法
    if (categories.testing || categories.frontend || categories.backend) {
      tasks.push({
        id: `TASK-${taskId++}`,
        title: '测试用例设计',
        description: '设计和编写测试用例，采用 TDD 方法',
        type: 'testing',
        priority: 'high',
        status: 'pending',
        estimatedHours: 6,
        dependencies: categories.backend ? ['TASK-4'] : categories.database ? ['TASK-3'] : ['TASK-2']
      });
    }

    // 后端开发任务
    if (categories.backend) {
      tasks.push({
        id: `TASK-${taskId++}`,
        title: '后端开发',
        description: '实现后端业务逻辑和 API，采用 TDD 方法',
        type: 'backend',
        priority: 'high',
        status: 'pending',
        estimatedHours: 16,
        dependencies: categories.testing ? ['TASK-6'] : categories.database ? ['TASK-3', 'TASK-4'] : ['TASK-4']
      });
    }

    // 前端开发任务
    if (categories.frontend) {
      tasks.push({
        id: `TASK-${taskId++}`,
        title: '前端开发',
        description: '实现前端界面和交互逻辑，采用 TDD 方法',
        type: 'frontend',
        priority: 'high',
        status: 'pending',
        estimatedHours: 16,
        dependencies: categories.testing ? ['TASK-6'] : categories.backend ? ['TASK-4'] : ['TASK-2']
      });
    }

    // 执行测试任务
    if (categories.testing || categories.frontend || categories.backend) {
      tasks.push({
        id: `TASK-${taskId++}`,
        title: '执行测试',
        description: '执行测试并生成测试报告',
        type: 'testing',
        priority: 'medium',
        status: 'pending',
        estimatedHours: 8,
        dependencies: categories.frontend && categories.backend ? ['TASK-7', 'TASK-8'] : 
                      categories.frontend ? ['TASK-8'] : ['TASK-7']
      });
    }

    // 部署任务
    if (categories.devops || (categories.frontend && categories.backend)) {
      tasks.push({
        id: `TASK-${taskId++}`,
        title: '环境配置',
        description: '配置开发、测试和生产环境',
        type: 'devops',
        priority: 'medium',
        status: 'pending',
        estimatedHours: 4,
        dependencies: []
      });

      tasks.push({
        id: `TASK-${taskId++}`,
        title: '部署上线',
        description: '部署应用到生产环境',
        type: 'devops',
        priority: 'medium',
        status: 'pending',
        estimatedHours: 4,
        dependencies: categories.testing ? ['TASK-9'] : 
                      categories.frontend && categories.backend ? ['TASK-7', 'TASK-8'] : 
                      categories.frontend ? ['TASK-8'] : ['TASK-7']
      });
    }

    return tasks;
  }

  /**
   * 任务优先级排序
   * @param {Array} tasks - 任务列表
   * @returns {Array} 排序后的任务
   */
  prioritizeTasks(tasks) {
    const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
    
    return tasks.sort((a, b) => {
      // 先按优先级排序
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      // 再按依赖数量排序
      return a.dependencies.length - b.dependencies.length;
    });
  }

  /**
   * 分配任务给合适的 Agent
   * @param {Array} tasks - 任务列表
   * @returns {Array} 分配后的任务
   */
  assignTasks(tasks) {
    const agentMapping = {
      design: 'architect',
      database: 'dba',
      backend: 'backend-dev',
      frontend: 'frontend-dev',
      testing: 'qa',
      devops: 'devops'
    };

    const skillMapping = {
      '需求对齐': 'requirement-analyzer',
      '整体架构设计': 'architecture-planner',
      '数据模型设计': 'database-designer',
      'API 设计': 'api-designer',
      'SQL 编写': 'database-designer',
      '测试用例设计': 'test-generator',
      '后端开发': 'code-generator',
      '前端开发': 'code-generator',
      '执行测试': 'test-generator',
      '环境配置': 'devops-automation',
      '部署上线': 'devops-automation'
    };

    return tasks.map(task => {
      return {
        ...task,
        assignee: agentMapping[task.type],
        skill: skillMapping[task.title] || null,
        assignedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });
  }

  /**
   * 保存任务到文件
   * @param {Array} tasks - 任务列表
   */
  saveTasks(tasks) {
    this.tasks = tasks;
    
    // 保存到本地文件
    const tasksPath = path.join(this.baseDir, '.trae', 'memory', 'task_history.json');
    const taskHistory = {
      tasks: tasks,
      generatedAt: new Date().toISOString(),
      totalTasks: tasks.length,
      highPriority: tasks.filter(task => task.priority === 'high').length,
      mediumPriority: tasks.filter(task => task.priority === 'medium').length,
      lowPriority: tasks.filter(task => task.priority === 'low').length
    };

    try {
      fs.writeFileSync(tasksPath, JSON.stringify(taskHistory, null, 2));
      console.log('任务已保存到:', tasksPath);
    } catch (error) {
      console.error('保存任务失败:', error);
    }

    // 同时使用 Memory MCP 存储
    this.saveToMemoryMCP(taskHistory);
  }

  /**
   * 使用 Memory MCP 存储任务
   * @param {Object} taskHistory - 任务历史
   */
  saveToMemoryMCP(taskHistory) {
    try {
      // 这里是模拟调用，实际使用时需要通过 run_mcp 调用
      console.log('正在保存任务到 Memory MCP...');
      
      // 示例调用（实际使用时取消注释）
      /*
      run_mcp('mcp_Memory', 'create_entities', {
        entities: taskHistory.tasks.map(task => ({
          type: 'Task',
          properties: {
            id: task.id,
            title: task.title,
            description: task.description,
            type: task.type,
            priority: task.priority,
            status: task.status,
            assignee: task.assignee,
            skill: task.skill,
            estimatedHours: task.estimatedHours,
            dependencies: task.dependencies.join(','),
            assignedAt: task.assignedAt
          }
        }))
      });
      */
    } catch (error) {
      console.error('保存到 Memory MCP 失败:', error);
    }
  }

  /**
   * 监控任务进度
   * @returns {Object} 任务进度报告
   */
  monitorProgress() {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = this.tasks.filter(task => task.status === 'in_progress').length;
    const pendingTasks = this.tasks.filter(task => task.status === 'pending').length;

    const progress = {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      pending: pendingTasks,
      percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      status: totalTasks === completedTasks ? 'completed' : 
              pendingTasks === totalTasks ? 'pending' : 'in_progress'
    };

    return progress;
  }

  /**
   * 更新任务状态
   * @param {string} taskId - 任务 ID
   * @param {string} status - 新状态
   * @returns {boolean} 更新是否成功
   */
  updateTaskStatus(taskId, status) {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      console.error('任务不存在:', taskId);
      return false;
    }

    this.tasks[taskIndex].status = status;
    this.tasks[taskIndex].updatedAt = new Date().toISOString();
    
    // 保存更新
    this.saveTasks(this.tasks);
    
    console.log(`任务 ${taskId} 状态已更新为: ${status}`);
    return true;
  }

  /**
   * 生成项目摘要
   * @returns {Object} 项目摘要
   */
  generateProjectSummary() {
    const progress = this.monitorProgress();
    const taskStats = {
      byType: {},
      byPriority: {},
      byAgent: {}
    };

    this.tasks.forEach(task => {
      // 按类型统计
      taskStats.byType[task.type] = (taskStats.byType[task.type] || 0) + 1;
      
      // 按优先级统计
      taskStats.byPriority[task.priority] = (taskStats.byPriority[task.priority] || 0) + 1;
      
      // 按 Agent 统计
      taskStats.byAgent[task.assignee] = (taskStats.byAgent[task.assignee] || 0) + 1;
    });

    return {
      progress,
      taskStats,
      generatedAt: new Date().toISOString()
    };
  }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TaskOrchestrator;
}

// 测试代码
if (require.main === module) {
  const orchestrator = new TaskOrchestrator();
  
  const requirement = '开发一个用户认证系统，包括前端登录界面和后端API，使用PostgreSQL数据库存储用户信息';
  const tasks = orchestrator.analyzeAndDecompose(requirement);
  
  console.log('\n=== 任务拆解结果 ===');
  tasks.forEach(task => {
    console.log(`\n任务: ${task.id} - ${task.title}`);
    console.log(`类型: ${task.type}`);
    console.log(`优先级: ${task.priority}`);
    console.log(`负责人: ${task.assignee}`);
    console.log(`依赖: ${task.dependencies.length > 0 ? task.dependencies.join(', ') : '无'}`);
    console.log(`描述: ${task.description}`);
  });
  
  console.log('\n=== 项目摘要 ===');
  console.log(JSON.stringify(orchestrator.generateProjectSummary(), null, 2));
}
