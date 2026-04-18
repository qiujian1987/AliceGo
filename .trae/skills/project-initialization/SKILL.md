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

## 2. 创建目录结构

### 前端项目
```
project-name/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── utils/
│   ├── types/
│   └── App.tsx
├── public/
├── tests/
├── docs/
└── package.json
```

### 后端项目
```
project-name/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── config/
│   └── index.ts
├── tests/
├── docs/
└── package.json
```

### 全栈项目
```
project-name/
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
├── server/
│   ├── src/
│   └── package.json
├── shared/
├── docs/
└── README.md
```

## 3. 初始化配置

### 必须文件
- `package.json` - 项目配置
- `tsconfig.json` - TypeScript配置
- `eslint.config.js` - ESLint配置
- `.gitignore` - Git忽略规则
- `README.md` - 项目说明

### .gitignore 标准内容
```
node_modules/
dist/
build/
*.log
.env
.DS_Store
```

## 4. 安装依赖

### 前端基础依赖
```bash
npm install react react-dom
npm install -D typescript @types/react @types/react-dom
npm install -D eslint prettier
```

### 后端基础依赖
```bash
npm install express cors
npm install -D typescript @types/express @types/cors
npm install -D eslint prettier
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
- 下一步：开始开发
```