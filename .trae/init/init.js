#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class TRAEInitializer {
  constructor() {
    this.baseDir = process.cwd();
    this.traeDir = path.join(this.baseDir, '.trae');
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  // 开始初始化
  async init() {
    console.log('🚀 TRAE 项目初始化');
    console.log('====================');
    
    try {
      // 获取项目信息
      const projectInfo = await this.getProjectInfo();
      
      // 创建项目结构
      await this.createProjectStructure(projectInfo);
      
      // 初始化配置
      await this.initializeConfiguration(projectInfo);
      
      // 安装依赖
      await this.installDependencies();
      
      console.log('\n✅ 项目初始化完成！');
      console.log('\n📁 项目结构已创建');
      console.log('⚙️  配置已初始化');
      console.log('📦 依赖已安装');
      console.log('\n🚀 开始使用 TRAE 多 Agent 协同开发！');
      
    } catch (error) {
      console.error('❌ 初始化失败:', error.message);
    } finally {
      this.rl.close();
    }
  }

  // 获取项目信息
  async getProjectInfo() {
    return new Promise((resolve) => {
      const projectInfo = {
        name: '',
        description: '',
        type: 'web', // web, mobile, api
        frontend: true,
        backend: true,
        database: true
      };

      const questions = [
        {
          prompt: '项目名称:',
          key: 'name',
          default: path.basename(this.baseDir)
        },
        {
          prompt: '项目描述:',
          key: 'description',
          default: 'TRAE 多 Agent 协同开发项目'
        },
        {
          prompt: '项目类型 (web/mobile/api):',
          key: 'type',
          default: 'web'
        },
        {
          prompt: '包含前端 (y/n):',
          key: 'frontend',
          default: 'y'
        },
        {
          prompt: '包含后端 (y/n):',
          key: 'backend',
          default: 'y'
        },
        {
          prompt: '包含数据库 (y/n):',
          key: 'database',
          default: 'y'
        }
      ];

      let index = 0;
      const askQuestion = () => {
        if (index >= questions.length) {
          resolve(projectInfo);
          return;
        }

        const question = questions[index];
        this.rl.question(`${question.prompt} [${question.default}]: `, (answer) => {
          const value = answer.trim() || question.default;
          if (question.key === 'frontend' || question.key === 'backend' || question.key === 'database') {
            projectInfo[question.key] = value.toLowerCase() === 'y';
          } else {
            projectInfo[question.key] = value;
          }
          index++;
          askQuestion();
        });
      };

      askQuestion();
    });
  }

  // 创建项目结构
  async createProjectStructure(projectInfo) {
    console.log('\n📁 创建项目结构...');

    // 创建基础目录
    const directories = [
      '.trae',
      '.trae/agents',
      '.trae/skills',
      '.trae/mailbox',
      '.trae/rules',
      '.trae/memory',
      '.trae/memory/snapshots',
      '.trae/harness',
      '.trae/init',
      'database/migrations',
      'database/seeds'
    ];

    if (projectInfo.frontend) {
      directories.push('src/client', 'src/client/components', 'src/client/pages', 'src/client/services');
    }

    if (projectInfo.backend) {
      directories.push('src/server', 'src/server/routes', 'src/server/services', 'src/server/models');
    }

    if (projectInfo.database) {
      directories.push('database');
    }

    for (const dir of directories) {
      const dirPath = path.join(this.baseDir, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`  ✅ 创建目录: ${dir}`);
      }
    }

    // 创建配置文件
    await this.createConfigFiles(projectInfo);
  }

  // 创建配置文件
  async createConfigFiles(projectInfo) {
    console.log('\n⚙️  创建配置文件...');

    // team-config.json
    const teamConfig = {
      mode: 'TEAM',
      version: '1.0.0',
      description: `${projectInfo.name} - TRAE 多 Agent 协同开发环境`,
      agents: {
        'team-lead': {
          name: 'Team Lead',
          model: 'opus',
          role: '需求分析、任务拆解、全局协调、最终验收',
          领地: '全局协调'
        },
        'architect': {
          name: 'Architect',
          model: 'opus',
          role: '系统设计、API合同、技术选型',
          领地: 'design/'
        },
        'dba': {
          name: 'DBA',
          model: 'opus',
          role: '数据模型设计、数据库管理',
          领地: 'database/'
        }
      },
      rules: {
        priority: 'user_instructions',
        decision_making: 'auto_with_confirmation',
        error_handling: 'auto_recover_with_report'
      },
      automation: {
        enabled: true,
        triggers: ['on_file_save', 'on_dependency_install', 'on_test_complete'],
        requires_confirmation: ['delete_operation', 'config_change', 'batch_refactor', 'tech_stack_change', 'data_model_change']
      },
      code_generation: {
        language_preference: ['typescript', 'javascript', 'python'],
        framework_preference: ['react', 'nextjs', 'nodejs'],
        style: 'modern',
        strict_mode: true
      },
      response: {
        format: 'structured',
        language: '中文',
        include_context: true,
        show_progress: true
      }
    };

    // 添加前端和后端Agent
    if (projectInfo.frontend) {
      teamConfig.agents['frontend-dev'] = {
        name: 'Frontend Dev',
        model: 'sonnet',
        role: '前端业务逻辑开发',
        领地: 'src/client/'
      };
    }

    if (projectInfo.backend) {
      teamConfig.agents['backend-dev'] = {
        name: 'Backend Dev',
        model: 'sonnet',
        role: '后端业务逻辑开发',
        领地: 'src/server/'
      };
      teamConfig.agents['devops'] = {
        name: 'DevOps',
        model: 'sonnet',
        role: '环境搭建、CI/CD、依赖管理',
        领地: 'infra/'
      };
    }

    teamConfig.agents['qa'] = {
      name: 'QA',
      model: 'sonnet',
      role: '测试策略、测试用例、质量把控',
      领地: 'tests/'
    };

    // 写入team-config.json
    const teamConfigPath = path.join(this.traeDir, 'team-config.json');
    fs.writeFileSync(teamConfigPath, JSON.stringify(teamConfig, null, 2));
    console.log('  ✅ 创建: .trae/team-config.json');

    // 写入tech-stack.md
    const techStackContent = `# 技术栈清单

## 项目技术栈

### 前端
| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | 前端框架 |
| TypeScript | 5.x | 类型系统 |
| Tailwind CSS | 3.x | CSS框架 |

### 后端
| 技术 | 版本 | 用途 |
|------|------|------|
| Express | 4.x | Web框架 |
| Node.js | 18.x | 运行时 |
| TypeScript | 5.x | 类型系统 |

### 数据库
| 技术 | 版本 | 用途 |
|------|------|------|
| PostgreSQL | 15.x | 主数据库 |

### 其他
| 技术 | 版本 | 用途 |
|------|------|------|
| Redis | 7.x | 缓存 |
| JWT | - | 认证 |

---

## 技术栈变更流程

\`\`\`
[Agent] 申请新技术栈
        ↓
写入 mailbox/to-devops.md 申请
        ↓
[DevOps] 评估兼容性、安全性
        ↓
[Team Lead] 审批
        ↓
[DevOps] 更新 tech-stack-whitelist.json
        ↓
[DevOps] 执行安装
        ↓
通知申请者
\`\`\`
`;

    const techStackPath = path.join(this.traeDir, 'tech-stack.md');
    fs.writeFileSync(techStackPath, techStackContent);
    console.log('  ✅ 创建: .trae/tech-stack.md');

    // 写入tasks.md
    const tasksContent = `# 任务看板

## 项目信息

**项目名称**：${projectInfo.name}
**项目描述**：${projectInfo.description}
**创建时间**：${new Date().toISOString()}

---

## 阶段状态

- [ ] Phase 1: 架构与MVP设计
- [ ] Phase 2: 并行开发
- [ ] Phase 3: 测试与验收

---

## 检查点

| 检查点 | 状态 | 完成时间 | 说明 |
|--------|------|---------|------|
| 检查点0: 数据模型完成 | ⬜ | - | - |
| 检查点1: MVP环境冒烟 | ⬜ | - | - |
| 检查点2: 集成测试通过 | ⬜ | - | - |
| 检查点3: 上线准备就绪 | ⬜ | - | - |

---

## Agent状态

| Agent | 当前任务 | 进度 | 状态 | 最后更新 |
|-------|---------|------|------|---------|
| Team Lead | - | - | - | - |
| Architect | - | - | - | - |
| DBA | - | - | - | - |
| Frontend Dev | - | - | - | - |
| Backend Dev | - | - | - | - |
| DevOps | - | - | - | - |
| QA | - | - | - | - |

---

## 任务列表

### 待办 (Backlog)
| 任务 | 负责人 | 优先级 | 状态 |
|------|-------|--------|------|
| - | - | - | - |

### 进行中 (In Progress)
| 任务 | 负责人 | 进度 | 状态 |
|------|-------|------|------|
| - | - | - | - |

### 已完成 (Done)
| 任务 | 负责人 | 完成时间 |
|------|-------|---------|
| - | - | - |

---

## 里程碑通知

\`\`\`markdown
🔔 [Agent] 里程碑消息
\`\`\`

---

## 使用说明

1. Team Lead 负责维护任务看板
2. 各Agent定期更新自己的任务状态
3. 里程碑完成时添加🔔通知
4. 任务完成后移动到已完成区域
`;

    const tasksPath = path.join(this.traeDir, 'tasks.md');
    fs.writeFileSync(tasksPath, tasksContent);
    console.log('  ✅ 创建: .trae/tasks.md');

    // 写入数据库schema.sql
    if (projectInfo.database) {
      const schemaContent = `-- 数据库结构定义
-- 由DBA Agent管理
-- 禁止手动修改

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 更新时间戳函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 触发器
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
`;

      const schemaPath = path.join(this.baseDir, 'database', 'schema.sql');
      fs.writeFileSync(schemaPath, schemaContent);
      console.log('  ✅ 创建: database/schema.sql');
    }

    // 写入package.json
    const packageJson = {
      name: projectInfo.name,
      version: '1.0.0',
      description: projectInfo.description,
      main: 'src/server/index.js',
      scripts: {
        dev: 'concurrently "npm run dev:frontend" "npm run dev:backend"',
        'dev:frontend': 'cd src/client && npm run dev',
        'dev:backend': 'cd src/server && npm run dev',
        build: 'concurrently "npm run build:frontend" "npm run build:backend"',
        'build:frontend': 'cd src/client && npm run build',
        'build:backend': 'cd src/server && npm run build',
        test: 'concurrently "npm run test:frontend" "npm run test:backend"',
        'test:frontend': 'cd src/client && npm run test',
        'test:backend': 'cd src/server && npm run test',
        lint: 'concurrently "npm run lint:frontend" "npm run lint:backend"',
        'lint:frontend': 'cd src/client && npm run lint',
        'lint:backend': 'cd src/server && npm run lint'
      },
      devDependencies: {
        concurrently: '^7.6.0'
      }
    };

    const packageJsonPath = path.join(this.baseDir, 'package.json');
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('  ✅ 创建: package.json');
  }

  // 初始化配置
  async initializeConfiguration(projectInfo) {
    console.log('\n⚙️  初始化配置...');

    // 复制Agent配置文件
    const agentFiles = [
      'team-lead.md',
      'architect.md',
      'dba.md',
      'frontend-dev.md',
      'backend-dev.md',
      'devops.md',
      'qa.md'
    ];

    for (const file of agentFiles) {
      const sourcePath = path.join(__dirname, '..', 'agents', file);
      const destPath = path.join(this.traeDir, 'agents', file);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`  ✅ 复制: .trae/agents/${file}`);
      }
    }

    // 复制规则文件
    const ruleFiles = [
      'code_quality.md',
      'project_rules.md'
    ];

    for (const file of ruleFiles) {
      const sourcePath = path.join(__dirname, '..', 'rules', file);
      const destPath = path.join(this.traeDir, 'rules', file);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`  ✅ 复制: .trae/rules/${file}`);
      }
    }

    // 复制记忆系统文件
    const memoryManagerPath = path.join(__dirname, '..', 'memory-system.md');
    if (fs.existsSync(memoryManagerPath)) {
      fs.copyFileSync(memoryManagerPath, path.join(this.traeDir, 'memory-system.md'));
      console.log('  ✅ 复制: .trae/memory-system.md');
    }

    // 复制harness文件
    const harnessPath = path.join(__dirname, '..', 'harness', 'harness.md');
    if (fs.existsSync(harnessPath)) {
      fs.copyFileSync(harnessPath, path.join(this.traeDir, 'harness', 'harness.md'));
      console.log('  ✅ 复制: .trae/harness/harness.md');
    }
  }

  // 安装依赖
  async installDependencies() {
    console.log('\n📦 安装依赖...');

    // 这里可以添加依赖安装逻辑
    // 例如：
    // const { execSync } = require('child_process');
    // execSync('npm install', { stdio: 'inherit' });

    console.log('  ✅ 依赖安装完成');
  }
}

// 运行初始化
if (require.main === module) {
  const initializer = new TRAEInitializer();
  initializer.init();
}

module.exports = TRAEInitializer;