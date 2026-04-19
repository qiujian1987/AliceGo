const fs = require('fs');
const path = require('path');

class DatabaseDesigner {
  constructor() {
    this.skillsDir = path.dirname(__dirname);
  }

  /**
   * 运行数据库设计
   * @param {Object} params - 输入参数
   * @param {Object} params.architecture - 架构设计
   * @param {Object} params.requirements - 需求规约
   * @returns {Promise<Object>} 设计结果
   */
  async run(params) {
    try {
      const { architecture, requirements } = params;

      if (!architecture) {
        return {
          status: 'error',
          message: '架构设计不能为空'
        };
      }

      // 生成数据模型
      const dataModel = this.generateDataModel(architecture, requirements);

      // 生成数据模型文档
      const document = this.generateDocument(dataModel);

      // 保存数据模型文档到文件
      this.saveDocument(document, 'data_model.md');

      // 创建数据库schema文件
      this.createSchemaFiles(dataModel);

      return {
        status: 'success',
        data: {
          data_model: dataModel,
          document
        },
        message: '数据库设计完成'
      };
    } catch (error) {
      console.error('数据库设计失败:', error);
      return {
        status: 'error',
        message: `数据库设计失败: ${error.message}`
      };
    }
  }

  /**
   * 生成数据模型
   * @param {Object} architecture - 架构设计
   * @param {Object} requirements - 需求规约
   * @returns {Object} 数据模型
   */
  generateDataModel(architecture, requirements) {
    const tables = [];

    // 可转债表
    tables.push({
      name: 'convertible_bonds',
      description: '可转债基本信息',
      fields: [
        {
          name: 'id',
          type: 'SERIAL',
          primary_key: true,
          description: '主键ID'
        },
        {
          name: 'code',
          type: 'VARCHAR(20)',
          unique: true,
          description: '转债代码'
        },
        {
          name: 'name',
          type: 'VARCHAR(100)',
          description: '转债名称'
        },
        {
          name: 'stock_code',
          type: 'VARCHAR(20)',
          description: '正股代码'
        },
        {
          name: 'stock_name',
          type: 'VARCHAR(100)',
          description: '正股名称'
        },
        {
          name: 'current_price',
          type: 'DECIMAL(10,2)',
          description: '当前价格'
        },
        {
          name: 'stock_price',
          type: 'DECIMAL(10,2)',
          description: '正股价格'
        },
        {
          name: 'conversion_price',
          type: 'DECIMAL(10,2)',
          description: '转股价格'
        },
        {
          name: 'conversion_value',
          type: 'DECIMAL(10,2)',
          description: '转股价值'
        },
        {
          name: 'premium_rate',
          type: 'DECIMAL(10,2)',
          description: '溢价率'
        },
        {
          name: 'volume',
          type: 'BIGINT',
          description: '成交量'
        },
        {
          name: 'market_cap',
          type: 'BIGINT',
          description: '市值'
        },
        {
          name: 'maturity_date',
          type: 'DATE',
          description: '到期日期'
        },
        {
          name: 'created_at',
          type: 'TIMESTAMP',
          default: 'NOW()',
          description: '创建时间'
        },
        {
          name: 'updated_at',
          type: 'TIMESTAMP',
          default: 'NOW()',
          description: '更新时间'
        }
      ],
      indexes: [
        {
          name: 'idx_convertible_bonds_code',
          columns: ['code'],
          unique: true
        },
        {
          name: 'idx_convertible_bonds_premium_rate',
          columns: ['premium_rate']
        }
      ]
    });

    // 套利机会表
    tables.push({
      name: 'arbitrage_opportunities',
      description: '套利机会信息',
      fields: [
        {
          name: 'id',
          type: 'SERIAL',
          primary_key: true,
          description: '主键ID'
        },
        {
          name: 'bond_id',
          type: 'INTEGER',
          foreign_key: {
            table: 'convertible_bonds',
            column: 'id'
          },
          description: '转债ID'
        },
        {
          name: 'strategy',
          type: 'VARCHAR(50)',
          description: '套利策略'
        },
        {
          name: 'profit_rate',
          type: 'DECIMAL(10,2)',
          description: '预期收益率'
        },
        {
          name: 'risk_level',
          type: 'VARCHAR(20)',
          description: '风险等级'
        },
        {
          name: 'status',
          type: 'VARCHAR(20)',
          description: '状态（active, executed, expired）'
        },
        {
          name: 'created_at',
          type: 'TIMESTAMP',
          default: 'NOW()',
          description: '创建时间'
        },
        {
          name: 'expired_at',
          type: 'TIMESTAMP',
          description: '过期时间'
        }
      ],
      indexes: [
        {
          name: 'idx_arbitrage_opportunities_bond_id',
          columns: ['bond_id']
        },
        {
          name: 'idx_arbitrage_opportunities_status',
          columns: ['status']
        }
      ]
    });

    // 交易表
    tables.push({
      name: 'transactions',
      description: '交易记录',
      fields: [
        {
          name: 'id',
          type: 'SERIAL',
          primary_key: true,
          description: '主键ID'
        },
        {
          name: 'opportunity_id',
          type: 'INTEGER',
          foreign_key: {
            table: 'arbitrage_opportunities',
            column: 'id'
          },
          description: '套利机会ID'
        },
        {
          name: 'bond_id',
          type: 'INTEGER',
          foreign_key: {
            table: 'convertible_bonds',
            column: 'id'
          },
          description: '转债ID'
        },
        {
          name: 'type',
          type: 'VARCHAR(20)',
          description: '交易类型（buy, sell）'
        },
        {
          name: 'amount',
          type: 'INTEGER',
          description: '交易数量'
        },
        {
          name: 'price',
          type: 'DECIMAL(10,2)',
          description: '交易价格'
        },
        {
          name: 'total_value',
          type: 'DECIMAL(10,2)',
          description: '交易总价值'
        },
        {
          name: 'status',
          type: 'VARCHAR(20)',
          description: '交易状态（pending, executed, failed）'
        },
        {
          name: 'created_at',
          type: 'TIMESTAMP',
          default: 'NOW()',
          description: '创建时间'
        },
        {
          name: 'executed_at',
          type: 'TIMESTAMP',
          description: '执行时间'
        }
      ],
      indexes: [
        {
          name: 'idx_transactions_opportunity_id',
          columns: ['opportunity_id']
        },
        {
          name: 'idx_transactions_status',
          columns: ['status']
        }
      ]
    });

    // 监控预警表
    tables.push({
      name: 'alerts',
      description: '监控预警信息',
      fields: [
        {
          name: 'id',
          type: 'SERIAL',
          primary_key: true,
          description: '主键ID'
        },
        {
          name: 'bond_id',
          type: 'INTEGER',
          foreign_key: {
            table: 'convertible_bonds',
            column: 'id'
          },
          description: '转债ID'
        },
        {
          name: 'type',
          type: 'VARCHAR(50)',
          description: '预警类型'
        },
        {
          name: 'message',
          type: 'TEXT',
          description: '预警消息'
        },
        {
          name: 'severity',
          type: 'VARCHAR(20)',
          description: '严重程度（low, medium, high）'
        },
        {
          name: 'status',
          type: 'VARCHAR(20)',
          description: '状态（active, resolved）'
        },
        {
          name: 'created_at',
          type: 'TIMESTAMP',
          default: 'NOW()',
          description: '创建时间'
        },
        {
          name: 'resolved_at',
          type: 'TIMESTAMP',
          description: '解决时间'
        }
      ],
      indexes: [
        {
          name: 'idx_alerts_bond_id',
          columns: ['bond_id']
        },
        {
          name: 'idx_alerts_severity',
          columns: ['severity']
        },
        {
          name: 'idx_alerts_status',
          columns: ['status']
        }
      ]
    });

    return {
      tables,
      relationships: [
        {
          name: 'bond_opportunity_relationship',
          from: 'arbitrage_opportunities.bond_id',
          to: 'convertible_bonds.id',
          type: 'many-to-one'
        },
        {
          name: 'opportunity_transaction_relationship',
          from: 'transactions.opportunity_id',
          to: 'arbitrage_opportunities.id',
          type: 'many-to-one'
        },
        {
          name: 'bond_transaction_relationship',
          from: 'transactions.bond_id',
          to: 'convertible_bonds.id',
          type: 'many-to-one'
        },
        {
          name: 'bond_alert_relationship',
          from: 'alerts.bond_id',
          to: 'convertible_bonds.id',
          type: 'many-to-one'
        }
      ]
    };
  }

  /**
   * 生成数据模型文档
   * @param {Object} dataModel - 数据模型
   * @returns {string} 数据模型文档
   */
  generateDocument(dataModel) {
    const { tables, relationships } = dataModel;

    let document = `# 数据模型设计文档\n\n`;

    document += `## 1. 表结构\n`;
    tables.forEach((table, index) => {
      document += `### ${index + 1}. ${table.name}\n`;
      document += `- 描述：${table.description}\n\n`;

      document += `#### 字段\n`;
      document += `| 字段名 | 数据类型 | 约束 | 描述 |\n`;
      document += `|--------|---------|------|------|\n`;
      table.fields.forEach(field => {
        let constraints = [];
        if (field.primary_key) constraints.push('主键');
        if (field.unique) constraints.push('唯一');
        if (field.foreign_key) constraints.push(`外键(${field.foreign_key.table}.${field.foreign_key.column})`);
        if (field.default) constraints.push(`默认: ${field.default}`);
        
        document += `| ${field.name} | ${field.type} | ${constraints.join(', ')} | ${field.description} |\n`;
      });
      document += `\n`;

      if (table.indexes && table.indexes.length > 0) {
        document += `#### 索引\n`;
        table.indexes.forEach(index => {
          document += `- ${index.name}: ${index.columns.join(', ')}${index.unique ? ' (唯一)' : ''}\n`;
        });
        document += `\n`;
      }
    });

    document += `## 2. 关系\n`;
    relationships.forEach((relationship, index) => {
      document += `### ${index + 1}. ${relationship.name}\n`;
      document += `- 从：${relationship.from}\n`;
      document += `- 到：${relationship.to}\n`;
      document += `- 类型：${relationship.type}\n\n`;
    });

    document += `## 3. 数据字典\n`;
    document += `| 表名 | 描述 |\n`;
    document += `|------|------|\n`;
    tables.forEach(table => {
      document += `| ${table.name} | ${table.description} |\n`;
    });

    return document;
  }

  /**
   * 保存数据模型文档到文件
   * @param {string} document - 数据模型文档内容
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
      console.log(`数据模型文档已保存到: ${filePath}`);
    } catch (error) {
      console.error('保存数据模型文档失败:', error);
    }
  }

  /**
   * 创建数据库schema文件
   * @param {Object} dataModel - 数据模型
   */
  createSchemaFiles(dataModel) {
    try {
      const outputDir = path.join(process.cwd(), 'database', 'schema');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // 生成SQL schema文件
      let sql = `-- 数据库schema\n\n`;
      
      // 创建表
      dataModel.tables.forEach(table => {
        sql += `-- ${table.description}\n`;
        sql += `CREATE TABLE IF NOT EXISTS ${table.name} (\n`;
        
        const fieldDefinitions = table.fields.map(field => {
          let definition = `  ${field.name} ${field.type}`;
          if (field.primary_key) definition += ` PRIMARY KEY`;
          if (field.unique) definition += ` UNIQUE`;
          if (field.default) definition += ` DEFAULT ${field.default}`;
          return definition;
        });
        
        sql += fieldDefinitions.join(',\n');
        sql += `\n);\n\n`;
        
        // 创建索引
        if (table.indexes && table.indexes.length > 0) {
          table.indexes.forEach(index => {
            sql += `CREATE ${index.unique ? 'UNIQUE ' : ''}INDEX IF NOT EXISTS ${index.name} ON ${table.name} (${index.columns.join(', ')});\n`;
          });
          sql += `\n`;
        }
      });
      
      // 添加外键约束
      dataModel.relationships.forEach(relationship => {
        const [fromTable, fromColumn] = relationship.from.split('.');
        const [toTable, toColumn] = relationship.to.split('.');
        
        sql += `ALTER TABLE ${fromTable} ADD CONSTRAINT fk_${fromTable}_${toTable} FOREIGN KEY (${fromColumn}) REFERENCES ${toTable} (${toColumn});\n`;
      });
      
      const filePath = path.join(outputDir, 'schema.sql');
      fs.writeFileSync(filePath, sql, 'utf-8');
      console.log(`数据库schema文件已保存到: ${filePath}`);
    } catch (error) {
      console.error('创建数据库schema文件失败:', error);
    }
  }
}

// 导出技能
module.exports = new DatabaseDesigner();
