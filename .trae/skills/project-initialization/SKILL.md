---
name: "project-initialization"
description: "初始化新项目，包含目录结构创建、依赖安装、Git初始化。触发场景：'初始化项目'、'创建新项目'、'开始新项目'。"
---

# 项目初始化

## 1. 确认项目需求

### 收集信息
- 项目类型：前端/后端/全栈/工具
- 技术栈偏好
- 目标用户/用途
- 特殊需求和约束

### 项目类型选择
| 类型 | 特征 |
|------|------|
| 前端 | React/Vue组件、页面、样式 |
| 后端 | API、数据模型、业务逻辑 |
| 全栈 | 前后端分离 + 共享代码 |
| 工具 | CLI脚本、脚本、命令行工具 |

## 2. 创建 TRAE 项目结构

### 标准 TRAE 项目
```
project-name/
├── .trae/
│   ├── agents/                  # Agent 配置
│   ├── skills/                  # Skills 定义
│   ├── mailbox/                 # 消息队列
│   ├── rules/                  # 规则配置
│   ├── memory/                  # 记忆系统
│   ├── init/                   # 初始化脚本
│   ├── team-config.json         # 团队配置
│   ├── tasks.md                 # 任务看板
│   ├── tech-stack.md            # 技术栈清单
│   └── data-model.md           # 数据模型设计
├── src/
│   ├── client/                  # 前端代码（可选）
│   └── server/                  # 后端代码（可选）
├── database/
│   ├── schema.sql              # 数据库结构
│   ├── migrations/             # 数据库迁移
│   └── seeds/                  # 种子数据
├── infra/                      # 基础设施（可选）
├── tests/                      # 测试代码
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore
```

### 根据项目类型调整

#### 纯前端项目
```
project-name/
├── src/
│   └── client/                  # 前端代码
├── tests/                       # 测试代码
└── ...（省略 .trae/ 和 database/）
```

#### 纯后端项目
```
project-name/
├── src/
│   └── server/                  # 后端代码
├── database/
│   └── ...（保留）
└── ...（省略 client/）
```

## 3. 初始化 TRAE 配置

### 必须文件
- `.trae/team-config.json` - 团队配置
- `.trae/rules/project_rules.md` - 核心规范
- `.trae/rules/code_standards.md` - 代码标准
- `.trae/rules/engineering_standards.md` - 工程标准
- `.trae/agents/*.md` - Agent 配置
- `.trae/tasks.md` - 任务看板
- `.trae/tech-stack.md` - 技术栈清单

### .gitignore 标准内容
```
node_modules/
dist/
build/
*.log
.env
.env.*
.DS_Store
.vscode/
.idea/
```

## 4. 安装依赖

### 基础依赖
```bash
npm install
```

### 前端依赖（可选）
```bash
npm install react react-dom
npm install -D typescript @types/react @types/react-dom eslint prettier
```

### 后端依赖（可选）
```bash
npm install express cors pg
npm install -D typescript @types/express @types/cors @types/pg eslint prettier jest
```

## 5. Git初始化

```bash
git init
git add .
git commit -m "feat: initial project structure"
```

## 6. 验证项目就绪

- 运行构建测试
- 执行初始测试（如有）
- 确认目录结构正确
- 验证依赖安装成功

## 7. 输出报告

```
[项目初始化完成]
- 项目类型：xxx
- 技术栈：xxx
- 目录结构：已创建
- 依赖：已安装
- Git：已初始化
- TRAE配置：已创建
- 下一步：开始开发
```