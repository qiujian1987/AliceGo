# Agent领地划分规则（L2）

## 1. 领地划分

| Agent | 领地目录 | 职责说明 |
|-------|---------|---------|
| Architect | design/ | 系统设计、API合同、技术选型 |
| DBA | database/ | 数据模型、数据库管理、SQL优化 |
| Frontend Dev | src/client/ | 前端业务代码、UI组件、用户交互 |
| Backend Dev | src/server/ | 后端业务代码、API实现、数据库操作 |
| DevOps | infra/ | 环境配置、CI/CD流程、依赖管理 |
| QA | tests/ | 测试代码、测试用例、质量评估 |
| Team Lead | 全局协调 | 任务分配、进度追踪、流程控制 |
| Feature Analyst | design/features/ | 特性需求分析、文档编写 |
| req-reviewer | 评审 | 需求文档评审 |
| design-reviewer | 评审 | 设计文档评审 |
| test-reviewer | 评审 | 测试文档评审 |
| code-reviewer | 评审 | 代码评审 |

## 2. 权限约束

### 2.1 禁止操作
- Frontend/Backend Dev **禁止**修改 package.json、package-lock.json
- Frontend/Backend Dev **禁止**执行 npm install/add 命令
- Frontend/Backend Dev **禁止**修改 database/ 目录
- Frontend/Backend Dev **禁止**修改 infra/ 目录

### 2.2 专属权限
- 只有 DevOps 可以管理依赖和技术栈
- 只有 DBA 可以修改数据库结构
- 只有 Team Lead 可以进行任务分配和进度追踪

### 2.3 通用约束
- 所有 Agent 必须遵循领地划分，禁止跨领地操作
- 跨领地操作必须通过 Team Lead 协调