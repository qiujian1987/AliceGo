const fs = require('fs');
const path = require('path');

class RequirementAnalyzer {
  constructor() {
    this.skillsDir = path.dirname(__dirname);
  }

  /**
   * 运行需求分析
   * @param {Object} params - 输入参数
   * @param {string} params.user_input - 用户的需求描述
   * @param {string} params.context - 项目背景信息
   * @param {string} params.priority - 优先级（high/medium/low）
   * @returns {Promise<Object>} 分析结果
   */
  async run(params) {
    try {
      const { user_input, context = '', priority = 'medium' } = params;

      if (!user_input) {
        return {
          status: 'error',
          message: '用户需求描述不能为空'
        };
      }

      // 分析需求
      const requirements = this.analyzeRequirements(user_input, context);

      // 生成需求规约文档
      const document = this.generateDocument(requirements);

      // 保存需求文档到文件
      this.saveDocument(document, 'requirements_spec.md');

      return {
        status: 'success',
        data: {
          requirements,
          document
        },
        message: '需求分析完成'
      };
    } catch (error) {
      console.error('需求分析失败:', error);
      return {
        status: 'error',
        message: `需求分析失败: ${error.message}`
      };
    }
  }

  /**
   * 分析需求
   * @param {string} userInput - 用户输入
   * @param {string} context - 上下文信息
   * @returns {Object} 分析结果
   */
  analyzeRequirements(userInput, context) {
    // 提取业务需求
    const businessNeeds = this.extractBusinessNeeds(userInput);

    // 提取功能需求
    const functionalRequirements = this.extractFunctionalRequirements(userInput);

    // 提取非功能需求
    const nonFunctionalRequirements = this.extractNonFunctionalRequirements(userInput);

    // 确定范围
    const scope = this.determineScope(userInput);

    // 制定验收标准
    const acceptanceCriteria = this.generateAcceptanceCriteria(functionalRequirements);

    // 识别风险
    const risks = this.identifyRisks(userInput);

    return {
      business_needs: businessNeeds,
      functional_requirements: functionalRequirements,
      non_functional_requirements: nonFunctionalRequirements,
      scope,
      acceptance_criteria: acceptanceCriteria,
      risks
    };
  }

  /**
   * 提取业务需求
   * @param {string} userInput - 用户输入
   * @returns {Array} 业务需求列表
   */
  extractBusinessNeeds(userInput) {
    const businessNeeds = [];

    if (userInput.includes('套利')) {
      businessNeeds.push('实现可转债套利');
    }
    if (userInput.includes('自动化')) {
      businessNeeds.push('实现自动化交易');
    }
    if (userInput.includes('收益')) {
      businessNeeds.push('最大化收益');
    }
    if (userInput.includes('数据')) {
      businessNeeds.push('获取市场数据');
    }

    if (businessNeeds.length === 0) {
      businessNeeds.push('开发可转债套利系统');
    }

    return businessNeeds;
  }

  /**
   * 提取功能需求
   * @param {string} userInput - 用户输入
   * @returns {Array} 功能需求列表
   */
  extractFunctionalRequirements(userInput) {
    const functionalRequirements = [];

    if (userInput.includes('数据')) {
      functionalRequirements.push('数据抓取');
    }
    if (userInput.includes('策略')) {
      functionalRequirements.push('策略分析');
    }
    if (userInput.includes('交易')) {
      functionalRequirements.push('自动交易');
    }
    if (userInput.includes('监控')) {
      functionalRequirements.push('监控预警');
    }
    if (userInput.includes('界面')) {
      functionalRequirements.push('前端界面');
    }

    return functionalRequirements;
  }

  /**
   * 提取非功能需求
   * @param {string} userInput - 用户输入
   * @returns {Array} 非功能需求列表
   */
  extractNonFunctionalRequirements(userInput) {
    const nonFunctionalRequirements = [];

    if (userInput.includes('MVP')) {
      nonFunctionalRequirements.push('MVP模式');
    }
    if (userInput.includes('Agent')) {
      nonFunctionalRequirements.push('Agent-first架构');
    }
    if (userInput.includes('Python')) {
      nonFunctionalRequirements.push('Python技术栈');
    }
    if (userInput.includes('数据库')) {
      nonFunctionalRequirements.push('数据库存储');
    }
    if (userInput.includes('API')) {
      nonFunctionalRequirements.push('API集成');
    }

    return nonFunctionalRequirements;
  }

  /**
   * 确定范围
   * @param {string} userInput - 用户输入
   * @returns {string} 范围描述
   */
  determineScope(userInput) {
    if (userInput.includes('MVP')) {
      return '可转债套利系统，先完成核心功能，后续迭代完善';
    }
    return '可转债套利系统的完整功能';
  }

  /**
   * 生成验收标准
   * @param {Array} functionalRequirements - 功能需求列表
   * @returns {Array} 验收标准列表
   */
  generateAcceptanceCriteria(functionalRequirements) {
    const acceptanceCriteria = [];

    if (functionalRequirements.includes('数据抓取')) {
      acceptanceCriteria.push('数据采集功能正常，能获取准确的可转债数据');
    }
    if (functionalRequirements.includes('策略分析')) {
      acceptanceCriteria.push('策略分析准确，能识别套利机会');
    }
    if (functionalRequirements.includes('自动交易')) {
      acceptanceCriteria.push('自动交易功能正常执行');
    }
    if (functionalRequirements.includes('监控预警')) {
      acceptanceCriteria.push('监控预警有效及时');
    }
    if (functionalRequirements.includes('前端界面')) {
      acceptanceCriteria.push('前端界面展示正常，用户体验良好');
    }

    return acceptanceCriteria;
  }

  /**
   * 识别风险
   * @param {string} userInput - 用户输入
   * @returns {Array} 风险列表
   */
  identifyRisks(userInput) {
    const risks = [
      '市场风险：市场波动可能影响套利效果',
      '技术风险：数据采集失败、API调用限制等',
      'API限制：券商API可能有调用频率限制'
    ];

    return risks;
  }

  /**
   * 生成需求规约文档
   * @param {Object} requirements - 需求分析结果
   * @returns {string} 需求规约文档
   */
  generateDocument(requirements) {
    const {
      business_needs,
      functional_requirements,
      non_functional_requirements,
      scope,
      acceptance_criteria,
      risks
    } = requirements;

    let document = `# 需求规约文档\n\n`;

    document += `## 1. 业务需求\n`;
    business_needs.forEach(need => {
      document += `- ${need}\n`;
    });

    document += `\n## 2. 功能需求\n`;
    functional_requirements.forEach(req => {
      document += `- ${req}\n`;
    });

    document += `\n## 3. 非功能需求\n`;
    non_functional_requirements.forEach(req => {
      document += `- ${req}\n`;
    });

    document += `\n## 4. 范围\n${scope}\n`;

    document += `\n## 5. 验收标准\n`;
    acceptance_criteria.forEach(criteria => {
      document += `- ${criteria}\n`;
    });

    document += `\n## 6. 风险\n`;
    risks.forEach(risk => {
      document += `- ${risk}\n`;
    });

    return document;
  }

  /**
   * 保存需求文档到文件
   * @param {string} document - 需求文档内容
   * @param {string} filename - 文件名
   */
  saveDocument(document, filename) {
    try {
      const outputDir = path.join(process.cwd(), 'design');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const filePath = path.join(outputDir, filename);
      fs.writeFileSync(filePath, document, 'utf-8');
      console.log(`需求文档已保存到: ${filePath}`);
    } catch (error) {
      console.error('保存需求文档失败:', error);
    }
  }
}

// 导出技能
module.exports = new RequirementAnalyzer();
