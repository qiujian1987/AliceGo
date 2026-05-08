# 项目初始化规范

## 概述

本文档定义了项目初始化的流程、时机和具体内容。

## 初始化时机

项目初始化在以下时机执行：

1. **用户提出需求后**：用户明确提出新项目需求后立即执行
2. **新建对话开始时**：在新对话中开始项目时执行
3. **明确开始项目后**：用户确认"开始项目"后执行

## 初始化执行者

**DevOps Agent**负责项目初始化。

## 初始化流程

```
1. 接收初始化请求
   ↓
2. 创建项目目录结构
   ↓
3. 初始化Git仓库
   ↓
4. 创建基础配置文件
   ↓
5. 初始化记忆系统
   ↓
6. 执行初始化脚本
   ↓
7. 通知Team Lead初始化完成
```

## 初始化内容

### 1. 目录结构创建

创建以下完整目录结构：

```
project-root/
├── .trae/
│   ├── agents/
│   ├── skills/
│   ├── docs/
│   ├── rules/
│   ├── init/
│   └── mcps/
├── design/
│   ├── project_overview/
│   │   ├── reviews/
│   │   └── feedback/
│   └── features/
├── src/
│   ├── server/
│   └── client/
├── tests/
│   ├── unit/
│   │   ├── server/
│   │   └── client/
│   ├── integration/
│   └── e2e/
├── database/
│   ├── schema/
│   └── migrations/
└── infra/
```

### 2. Git仓库初始化

```bash
git init
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore
echo "dist/" >> .gitignore
echo "build/" >> .gitignore
git add .
git commit -m "Initial commit - Project setup"
```

### 3. 基础配置文件

创建以下配置文件：

#### .gitignore
```
node_modules/
.env
dist/
build/
coverage/
*.log
.DS_Store
```

#### README.md (初始版本)
```markdown
# 项目名称

## 概述
项目描述待补充

## 目录结构
- design/: 设计文档
- src/: 源代码
- tests/: 测试代码
- database/: 数据库相关
- infra/: 基础设施配置

## 开始
初始化中...
```

#### package.json (基础版)
```json
{
  "name": "project-name",
  "version": "0.1.0",
  "description": "项目描述",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### 4. 记忆系统初始化

在记忆系统中保存初始项目状态：

```json
{
  "project_state:main": {
    "type": "project_state",
    "name": "新项目",
    "status": "planning",
    "current_phase": "初始化完成",
    "started_at": "2026-05-10T10:00:00Z",
    "last_updated": "2026-05-10T10:00:00Z",
    "progress": 0,
    "milestones": []
  },
  "review_iteration:requirements": {
    "type": "review_iteration",
    "review_type": "requirements",
    "iteration": 0,
    "max_iterations": 3,
    "started_at": "2026-05-10T10:00:00Z",
    "last_updated": "2026-05-10T10:00:00Z",
    "history": []
  },
  "review_iteration:design": {
    "type": "review_iteration",
    "review_type": "design",
    "iteration": 0,
    "max_iterations": 3,
    "started_at": "2026-05-10T10:00:00Z",
    "last_updated": "2026-05-10T10:00:00Z",
    "history": []
  },
  "review_iteration:test": {
    "type": "review_iteration",
    "review_type": "test",
    "iteration": 0,
    "max_iterations": 3,
    "started_at": "2026-05-10T10:00:00Z",
    "last_updated": "2026-05-10T10:00:00Z",
    "history": []
  },
  "review_iteration:code": {
    "type": "review_iteration",
    "review_type": "code",
    "iteration": 0,
    "max_iterations": 3,
    "started_at": "2026-05-10T10:00:00Z",
    "last_updated": "2026-05-10T10:00:00Z",
    "history": []
  }
}
```

### 5. 初始化脚本执行

执行 `.trae/init/init.js` 脚本进行额外初始化。

## 初始化检查清单

初始化完成后，检查以下项目：

- [ ] 目录结构创建完整
- [ ] Git仓库初始化成功
- [ ] .gitignore文件存在
- [ ] README.md文件存在
- [ ] package.json文件存在
- [ ] 记忆系统初始化完成
- [ ] Team Lead已收到通知

## 初始化完成通知

DevOps Agent完成初始化后，通知Team Lead：

```
[项目初始化完成]
- 状态：成功
- 时间：{timestamp}
- 目录结构：已创建
- Git仓库：已初始化
- 记忆系统：已初始化
- 下一步：开始需求分析
```

## 重新初始化

如果需要重新初始化项目：

1. 确认需要重新初始化
2. 备份现有数据（如果有）
3. 清理项目目录
4. 重新执行初始化流程

**注意**：重新初始化会删除所有现有数据，请谨慎操作！
