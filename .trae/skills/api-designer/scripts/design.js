const fs = require('fs');
const path = require('path');

class ApiDesigner {
  constructor() {
    this.skillsDir = path.dirname(__dirname);
  }

  /**
   * 运行API设计
   * @param {Object} params - 输入参数
   * @param {Object} params.architecture - 架构设计
   * @param {Object} params.data_model - 数据模型
   * @returns {Promise<Object>} 设计结果
   */
  async run(params) {
    try {
      const { architecture, data_model } = params;

      if (!architecture) {
        return {
          status: 'error',
          message: '架构设计不能为空'
        };
      }

      // 生成API合同
      const apiContracts = this.generateApiContracts(architecture, data_model);

      // 生成API文档
      const document = this.generateDocument(apiContracts);

      // 保存API合同文档到文件
      this.saveDocument(document, 'api_contracts.md');

      return {
        status: 'success',
        data: {
          api_contracts: apiContracts,
          document
        },
        message: 'API设计完成'
      };
    } catch (error) {
      console.error('API设计失败:', error);
      return {
        status: 'error',
        message: `API设计失败: ${error.message}`
      };
    }
  }

  /**
   * 生成API合同
   * @param {Object} architecture - 架构设计
   * @param {Object} data_model - 数据模型
   * @returns {Array} API合同列表
   */
  generateApiContracts(architecture, data_model) {
    const contracts = [];

    // 数据采集模块API
    contracts.push({
      endpoint: '/api/data/convertible-bonds',
      method: 'GET',
      description: '获取可转债数据',
      request: {
        query: {
          page: 'number',
          limit: 'number',
          sort: 'string'
        }
      },
      response: {
        200: {
          data: 'array',
          total: 'number',
          page: 'number',
          limit: 'number'
        },
        400: {
          error: 'string'
        }
      }
    });

    // 策略分析模块API
    contracts.push({
      endpoint: '/api/strategy/analyze',
      method: 'POST',
      description: '分析可转债套利机会',
      request: {
        body: {
          bonds: 'array',
          strategy: 'string'
        }
      },
      response: {
        200: {
          opportunities: 'array',
          analysis: 'object'
        },
        400: {
          error: 'string'
        }
      }
    });

    // 监控预警模块API
    contracts.push({
      endpoint: '/api/monitor/alerts',
      method: 'GET',
      description: '获取监控预警信息',
      request: {
        query: {
          status: 'string',
          limit: 'number'
        }
      },
      response: {
        200: {
          alerts: 'array',
          total: 'number'
        },
        400: {
          error: 'string'
        }
      }
    });

    // 自动交易模块API
    contracts.push({
      endpoint: '/api/trading/execute',
      method: 'POST',
      description: '执行自动交易',
      request: {
        body: {
          opportunity_id: 'string',
          amount: 'number',
          type: 'string'
        }
      },
      response: {
        200: {
          transaction_id: 'string',
          status: 'string',
          details: 'object'
        },
        400: {
          error: 'string'
        }
      }
    });

    // 交易历史API
    contracts.push({
      endpoint: '/api/trading/history',
      method: 'GET',
      description: '获取交易历史',
      request: {
        query: {
          start_date: 'string',
          end_date: 'string',
          page: 'number',
          limit: 'number'
        }
      },
      response: {
        200: {
          transactions: 'array',
          total: 'number',
          page: 'number',
          limit: 'number'
        },
        400: {
          error: 'string'
        }
      }
    });

    return contracts;
  }

  /**
   * 生成API文档
   * @param {Array} apiContracts - API合同列表
   * @returns {string} API文档
   */
  generateDocument(apiContracts) {
    let document = `# API合同文档\n\n`;

    document += `## 1. 基础信息\n`;
    document += `- 版本：1.0.0\n`;
    document += `- 基础路径：/api\n`;
    document += `- 认证方式：JWT\n\n`;

    document += `## 2. API列表\n`;
    apiContracts.forEach((contract, index) => {
      document += `### ${index + 1}. ${contract.method} ${contract.endpoint}\n`;
      document += `- 描述：${contract.description}\n\n`;

      document += `#### 请求参数\n`;
      if (contract.request.query) {
        document += `##### 查询参数\n`;
        Object.entries(contract.request.query).forEach(([key, type]) => {
          document += `- ${key} (${type})\n`;
        });
        document += `\n`;
      }

      if (contract.request.body) {
        document += `##### 请求体\n`;
        document += `\`\`\`json\n`;
        document += JSON.stringify(contract.request.body, null, 2);
        document += `\`\`\`\n\n`;
      }

      document += `#### 响应\n`;
      Object.entries(contract.response).forEach(([status, schema]) => {
        document += `##### ${status}\n`;
        document += `\`\`\`json\n`;
        document += JSON.stringify(schema, null, 2);
        document += `\`\`\`\n`;
      });
      document += `\n`;
    });

    document += `## 3. 错误处理\n`;
    document += `| 状态码 | 描述 |\n`;
    document += `|--------|------|\n`;
    document += `| 400 | 请求参数错误 |\n`;
    document += `| 401 | 未授权 |\n`;
    document += `| 403 | 禁止访问 |\n`;
    document += `| 404 | 资源不存在 |\n`;
    document += `| 500 | 服务器内部错误 |\n`;

    return document;
  }

  /**
   * 保存API合同文档到文件
   * @param {string} document - API合同文档内容
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
      console.log(`API合同文档已保存到: ${filePath}`);
    } catch (error) {
      console.error('保存API合同文档失败:', error);
    }
  }
}

// 导出技能
module.exports = new ApiDesigner();
