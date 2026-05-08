# 文件所有权规范

## 概述

本文档定义了各个Agent的领地（工作目录）和文件所有权，避免文件冲突。

## Agent 领地定义

### 1. Team Lead
- **主领地**：`design/project_overview/`
- **职责**：
  - 全局需求文档
  - 项目计划文档
  - 协调文档
- **可读写文件**：
  - `design/project_overview/requirements_spec.md`
  - `design/project_overview/project_plan.md`
  - `design/project_overview/reviews/` （读取评审报告）
  - `design/project_overview/feedback/` （读取和写入反馈）
  - `design/features/` （目录结构管理）

### 2. Feature Analyst
- **主领地**：`design/features/`
- **职责**：
  - 特性需求分析
  - 特性需求文档编写
- **可读写文件**：
  - `design/features/{feature-id}/requirements.md`
  - `design/features/{feature-id}/` （目录管理）

### 3. Architect
- **主领地**：`design/project_overview/`
- **职责**：
  - 后端架构设计
  - 前端架构设计
  - API设计
- **可读写文件**：
  - `design/project_overview/backend_architecture.md`
  - `design/project_overview/frontend_architecture.md`
  - `design/project_overview/api_contracts.md`
  - `design/features/{feature-id}/api.md`

### 4. DBA
- **主领地**：`database/`
- **职责**：
  - 数据模型设计
  - 数据库Schema
- **可读写文件**：
  - `design/project_overview/data_model.md`
  - `database/schema/schema.sql`
  - `database/migrations/`
  - `database/`

### 5. Frontend Designer
- **主领地**：`design/features/{feature-id}/frontend/`
- **职责**：
  - 前端界面设计
  - 交互设计
- **可读写文件**：
  - `design/project_overview/frontend_design.md`
  - `design/features/{feature-id}/frontend/`

### 6. QA
- **主领地**：`tests/`
- **职责**：
  - 测试用例设计
  - 测试执行
  - 测试报告
- **可读写文件**：
  - `design/features/{feature-id}/test-cases.md`
  - `tests/`
  - `design/project_overview/test-report.md`

### 7. Backend Dev
- **主领地**：`src/server/`
- **职责**：
  - 后端业务逻辑开发
  - 单元测试
- **可读写文件**：
  - `src/server/`
  - `tests/unit/server/`
  - `tests/integration/`

### 8. Frontend Dev
- **主领地**：`src/client/`
- **职责**：
  - 前端界面开发
  - 单元测试
- **可读写文件**：
  - `src/client/`
  - `tests/unit/client/`

### 9. DevOps
- **主领地**：`infra/`
- **职责**：
  - 环境配置
  - CI/CD配置
  - 部署
- **可读写文件**：
  - `infra/`
  - `.trae/init/`
  - 配置文件

### 10. 评审Agent
- **领地**：`design/project_overview/reviews/` 和 `design/project_overview/feedback/`
- **职责**：
  - 生成评审报告
  - 生成反馈文件
- **可读写文件**：
  - `design/project_overview/reviews/` （写入评审报告）
  - `design/project_overview/feedback/` （写入反馈JSON）
  - 其他目录（只读，用于评审）

## 文件所有权矩阵

| 文件/目录 | 所有者 | 可读 | 可写 | 备注 |
|----------|--------|------|------|------|
| `design/project_overview/requirements_spec.md` | Team Lead | 全部 | Team Lead | |
| `design/project_overview/backend_architecture.md` | Architect | 全部 | Architect | |
| `design/project_overview/frontend_architecture.md` | Architect | 全部 | Architect | |
| `design/project_overview/data_model.md` | DBA | 全部 | DBA | |
| `design/project_overview/api_contracts.md` | Architect | 全部 | Architect | |
| `design/project_overview/frontend_design.md` | Frontend Designer | 全部 | Frontend Designer | |
| `design/project_overview/project_plan.md` | Team Lead | 全部 | Team Lead | |
| `design/features/{feature}/requirements.md` | Feature Analyst | 全部 | Feature Analyst | |
| `design/features/{feature}/api.md` | Architect | 全部 | Architect | |
| `design/features/{feature}/test-cases.md` | QA | 全部 | QA | |
| `design/features/{feature}/tasks/` | Team Lead | 全部 | Team Lead | |
| `design/features/{feature}/frontend/` | Frontend Designer | 全部 | Frontend Designer | |
| `design/project_overview/reviews/` | 评审Agent | 全部 | 评审Agent | |
| `design/project_overview/feedback/` | Team Lead | 全部 | Team Lead, 评审Agent | |
| `database/` | DBA | 全部 | DBA | |
| `src/server/` | Backend Dev | 全部 | Backend Dev | |
| `src/client/` | Frontend Dev | 全部 | Frontend Dev | |
| `tests/` | QA | 全部 | QA, Backend Dev, Frontend Dev | Dev可写自己的单元测试 |
| `infra/` | DevOps | 全部 | DevOps | |
| `.trae/agents/` | DevOps | 全部 | DevOps | |
| `.trae/skills/` | DevOps | 全部 | DevOps | |
| `.trae/docs/` | DevOps | 全部 | DevOps | |
| `.trae/rules/` | DevOps | 全部 | DevOps | |

## 文件访问规则

### 1. 读取规则

- **所有Agent**可以读取任何设计文档
- **所有Agent**可以读取自己需要的输入文档
- **所有Agent**可以读取评审报告和反馈

### 2. 写入规则

- **只有所有者**可以修改自己负责的文件
- **其他Agent**如果需要修改，必须通过所有者
- **评审Agent**只能写入评审报告和反馈文件

### 3. 文件创建规则

- **在自己领地内**创建文件不需要审批
- **在其他领地内**创建文件需要通知所有者
- **全局文件**创建需要Team Lead审批

## 冲突解决流程

### 1. 检测到冲突

当两个Agent尝试修改同一文件时：

1. 记忆系统记录冲突
2. 通知Team Lead
3. 暂停相关操作

### 2. 解决冲突

1. Team Lead介入协调
2. 确认文件的真正所有者
3. 确定修改优先级
4. 一方回退或合并修改

### 3. 预防冲突

- 严格遵循所有权规范
- 修改前检查文件状态
- 使用记忆系统记录文件锁定状态
- 小批量、频繁提交，避免大规模冲突

## 文件锁定机制

可选的文件锁定机制（建议但不强制）：

```javascript
// 锁定文件
await memory.set(`file_lock:${filePath}`, {
  locked_by: 'agent-name',
  locked_at: '2026-05-10T10:00:00Z',
  reason: '正在修改'
});

// 检查锁定
const lock = await memory.get(`file_lock:${filePath}`);

// 释放锁定
await memory.delete(`file_lock:${filePath}`);
```

## 目录结构标准

完整的项目目录结构：

```
project-root/
├── .trae/
│   ├── agents/
│   ├── skills/
│   ├── docs/
│   ├── rules/
│   └── init/
├── design/
│   ├── project_overview/
│   │   ├── requirements_spec.md
│   │   ├── backend_architecture.md
│   │   ├── frontend_architecture.md
│   │   ├── data_model.md
│   │   ├── api_contracts.md
│   │   ├── frontend_design.md
│   │   ├── project_plan.md
│   │   ├── reviews/
│   │   └── feedback/
│   └── features/
│       ├── feature1/
│       │   ├── requirements.md
│       │   ├── api.md
│       │   ├── test-cases.md
│       │   ├── tasks/
│       │   └── frontend/
│       └── feature2/
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
