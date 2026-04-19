const fs = require('fs');
const path = require('path');

class ArchitecturePlanner {
  constructor() {
    this.skillsDir = path.dirname(__dirname);
  }

  /**
   * 运行架构设计
   * @param {Object} params - 输入参数
   * @param {Object} params.requirements - 需求规约文档
   * @param {Object} params.constraints - 技术约束
   * @param {boolean} params.existing_system - 是否有现有系统
   * @returns {Promise<Object>} 设计结果
   */
  async run(params) {
    try {
      const { requirements, constraints = {}, existing_system = false } = params;

      if (!requirements) {
        return {
          status: 'error',
          message: '需求规约文档不能为空'
        };
      }

      // 分析需求和技术约束
      const analysis = this.analyzeRequirements(requirements, constraints);

      // 生成架构设计
      const architecture = this.generateArchitecture(analysis, existing_system);

      // 生成架构设计文档
      const document = this.generateDocument(architecture);

      // 保存架构设计文档到文件
      this.saveDocument(document, 'architecture.md');

      return {
        status: 'success',
        data: {
          architecture,
          document
        },
        message: '架构设计完成'
      };
    } catch (error) {
      console.error('架构设计失败:', error);
      return {
        status: 'error',
        message: `架构设计失败: ${error.message}`
      };
    }
  }

  /**
   * 分析需求和技术约束
   * @param {Object} requirements - 需求规约文档
   * @param {Object} constraints - 技术约束
   * @returns {Object} 分析结果
   */
  analyzeRequirements(requirements, constraints) {
    // 提取功能需求
    const functionalRequirements = requirements.functional_requirements || [];

    // 提取非功能需求
    const nonFunctionalRequirements = requirements.non_functional_requirements || [];

    // 分析技术约束
    const techConstraints = {
      budget: constraints.budget || 'medium',
      team_skill: constraints.team_skill || [],
      existing_tech: constraints.existing_tech || []
    };

    return {
      functionalRequirements,
      nonFunctionalRequirements,
      techConstraints
    };
  }

  /**
   * 生成架构设计
   * @param {Object} analysis - 分析结果
   * @param {boolean} existing_system - 是否有现有系统
   * @returns {Object} 架构设计
   */
  generateArchitecture(analysis, existing_system) {
    const { functionalRequirements, nonFunctionalRequirements, techConstraints } = analysis;

    // 技术栈选择
    const techStack = this.selectTechStack(functionalRequirements, nonFunctionalRequirements, techConstraints);

    // 模块划分
    const modules = this.generateModules(functionalRequirements);

    // 数据流设计
    const dataFlow = this.generateDataFlow(modules);

    // 可扩展性设计
    const scalability = this.generateScalability();

    // 安全性设计
    const security = this.generateSecurity();

    return {
      tech_stack: techStack,
      modules,
      data_flow: dataFlow,
      scalability,
      security
    };
  }

  /**
   * 选择技术栈
   * @param {Array} functionalRequirements - 功能需求
   * @param {Array} nonFunctionalRequirements - 非功能需求
   * @param {Object} techConstraints - 技术约束
   * @returns {Object} 技术栈
   */
  selectTechStack(functionalRequirements, nonFunctionalRequirements, techConstraints) {
    // 检查是否有Python技术栈需求
    const usePython = nonFunctionalRequirements.some(req => req.includes('Python'));

    return {
      frontend: 'React + TypeScript + Tailwind',
      backend: usePython ? 'Python + FastAPI' : 'Node.js + Express + TypeScript',
      database: 'PostgreSQL',
      cloud: 'AWS'
    };
  }

  /**
   * 生成模块划分
   * @param {Array} functionalRequirements - 功能需求
   * @returns {Array} 模块列表
   */
  generateModules(functionalRequirements) {
    const modules = [];

    // 基础模块
    modules.push({
      name: '数据采集模块',
      description: '负责从市场获取可转债数据',
      dependencies: []
    });

    modules.push({
      name: '策略分析模块',
      description: '分析可转债数据，识别套利机会',
      dependencies: ['数据采集模块']
    });

    modules.push({
      name: '监控预警模块',
      description: '监控市场变化，提供套利机会预警',
      dependencies: ['策略分析模块']
    });

    modules.push({
      name: '自动交易模块',
      description: '根据策略自动执行交易',
      dependencies: ['监控预警模块']
    });

    modules.push({
      name: '前端界面模块',
      description: '提供用户交互界面',
      dependencies: ['数据采集模块', '策略分析模块', '监控预警模块']
    });

    return modules;
  }

  /**
   * 生成数据流设计
   * @param {Array} modules - 模块列表
   * @returns {string} 数据流描述
   */
  generateDataFlow(modules) {
    return '数据采集 → 策略分析 → 监控预警 → 自动交易 → 前端展示';
  }

  /**
   * 生成可扩展性设计
   * @returns {string} 可扩展性描述
   */
  generateScalability() {
    return '采用微服务架构，支持水平扩展，模块间通过API通信';
  }

  /**
   * 生成安全性设计
   * @returns {string} 安全性描述
   */
  generateSecurity() {
    return '使用JWT认证，HTTPS加密传输，输入验证，权限控制';
  }

  /**
   * 生成架构设计文档
   * @param {Object} architecture - 架构设计
   * @returns {string} 架构设计文档
   */
  generateDocument(architecture) {
    const { tech_stack, modules, data_flow, scalability, security } = architecture;

    let document = `# 架构设计文档\n\n`;

    document += `## 1. 技术栈\n`;
    document += `- 前端：${tech_stack.frontend}\n`;
    document += `- 后端：${tech_stack.backend}\n`;
    document += `- 数据库：${tech_stack.database}\n`;
    document += `- 云服务：${tech_stack.cloud}\n\n`;

    document += `## 2. 系统架构\n`;
    document += `### 系统分层\n`;
    document += `- 前端层：用户界面\n`;
    document += `- API层：接口调用\n`;
    document += `- 服务层：业务逻辑\n`;
    document += `- 数据层：数据存储\n\n`;

    document += `### 模块划分\n`;
    modules.forEach((module, index) => {
      document += `#### ${index + 1}. ${module.name}\n`;
      document += `- 描述：${module.description}\n`;
      document += `- 依赖：${module.dependencies.length > 0 ? module.dependencies.join(', ') : '无'}\n\n`;
    });

    document += `## 3. 核心流程\n`;
    document += `${data_flow}\n\n`;

    document += `## 4. 数据流\n`;
    document += `1. 数据采集模块从市场获取可转债数据\n`;
    document += `2. 策略分析模块分析数据，识别套利机会\n`;
    document += `3. 监控预警模块监控市场变化，提供预警\n`;
    document += `4. 自动交易模块执行交易操作\n`;
    document += `5. 前端界面模块展示数据和结果\n\n`;

    document += `## 5. 可扩展性\n`;
    document += `${scalability}\n\n`;

    document += `## 6. 安全性\n`;
    document += `${security}\n\n`;

    document += `## 7. 部署架构\n`;
    document += `- 使用容器化部署\n`;
    document += `- 采用CI/CD流程\n`;
    document += `- 多环境部署（开发、测试、生产）\n`;

    return document;
  }

  /**
   * 保存架构设计文档到文件
   * @param {string} document - 架构设计文档内容
   * @param {string} filename - 文件名
   */
  saveDocument(document, filename) {
    try {
      const outputDir = path.join(process.cwd(), 'design', 'project_overview');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const filePath = path.join(outputDir, filename);
      fs.writeFileSync(filePath, document, 'utf-8');
      console.log(`架构设计文档已保存到: ${filePath}`);
    } catch (error) {
      console.error('保存架构设计文档失败:', error);
    }
  }
}

// 导出技能
module.exports = new ArchitecturePlanner();
