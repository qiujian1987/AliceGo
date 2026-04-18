# Skill 注册表

## 概述

本文档建立 Rules 规范到 Skills 的映射关系，确保工程标准能够被自动化执行。

## Agent 与 Skills 映射

| Agent | Skills | 说明 |
|-------|--------|------|
| team-lead | requirement-analyzer, project-planner | 需求分析和项目规划 |
| architect | architecture-planner, api-designer | 架构设计和 API 设计 |
| dba | database-designer, sql-optimizer | 数据库设计和 SQL 优化 |
| frontend-dev | code-generator, test-generator | 代码生成和测试 |
| backend-dev | code-generator, test-generator | 代码生成和测试 |
| devops | dependency-manager, devops-automation | 依赖管理和 CI/CD |
| qa | test-generator, test-executor | 测试生成和执行 |

## 全局 Skills

| Skill | 说明 | 使用场景 |
|-------|------|---------|
| code-review | 代码审查 | 代码提交前、代码重构后 |
| file-operation | 文件操作规范 | 创建/修改/删除文件时 |

## 规范到 Skills 映射

| 规范来源 | 相关 Skills | 执行者 |
|---------|------------|-------|
| code_standards.md | code-review | 所有 Dev Agent |
| engineering_standards.md | code-generator, test-generator | Frontend/Backend Dev |
| engineering_standards.md | test-executor | QA |
| engineering_standards.md | dependency-manager | DevOps |
| engineering_standards.md | devops-automation | DevOps |
| project_rules.md | requirement-analyzer | Team Lead |
| project_rules.md | project-planner | Team Lead |

## 技能调用规则

### 触发条件

当执行以下任务时，自动使用对应的 Skill：

| 任务类型 | Skill | Agent |
|---------|-------|-------|
| 需求分析 | requirement-analyzer | Team Lead |
| 项目规划 | project-planner | Team Lead |
| 架构设计 | architecture-planner | Architect |
| API 设计 | api-designer | Architect |
| 数据库设计 | database-designer | DBA |
| SQL 优化 | sql-optimizer | DBA |
| 代码生成 | code-generator | Frontend/Backend Dev |
| 测试生成 | test-generator | QA, Frontend/Backend Dev |
| 测试执行 | test-executor | QA |
| CI/CD 配置 | devops-automation | DevOps |
| 依赖管理 | dependency-manager | DevOps |
| 代码审查 | code-review | 所有 Dev Agent |
| 文件操作 | file-operation | 所有 Agent |

### 记忆系统集成

| 事件 | 记忆操作 | 触发时机 | 执行者 |
|------|---------|----------|--------|
| 项目初始化 | saveProjectState | 项目创建时 | Team Lead |
| 任务分配 | addTask | 任务创建时 | Team Lead |
| 任务状态变更 | updateTaskStatus | 状态变更时 | 所有 Agent |
| 任务完成 | updateTaskStatus | 任务完成时 | 所有 Agent |
| 重要决策 | addDecision | 决策产生时 | 所有 Agent |
| Agent 状态变更 | updateAgentState | 状态变更时 | 所有 Agent |
| 阶段完成 | createSnapshot | 阶段完成时 | Team Lead |
| 新对话开始 | generateProjectSummary | 对话开始时 | 系统 |
| 对话结束 | createSnapshot | 对话结束时 | 系统 |

## Skill 位置

| Skill | 路径 |
|-------|------|
| requirement-analyzer | skills/team-lead/requirement-analyzer/ |
| project-planner | skills/team-lead/project-planner/ |
| architecture-planner | skills/architect/architecture-planner/ |
| api-designer | skills/architect/api-designer/ |
| database-designer | skills/dba/database-designer/ |
| sql-optimizer | skills/dba/sql-optimizer/ |
| code-generator | skills/frontend-dev/code-generator/, skills/backend-dev/code-generator/ |
| test-generator | skills/frontend-dev/test-generator/, skills/backend-dev/test-generator/, skills/qa/test-generator/ |
| test-executor | skills/qa/test-executor/ |
| devops-automation | skills/devops/devops-automation/ |
| dependency-manager | skills/devops/dependency-manager/ |
| code-review | skills/code-review/ |
| file-operation | skills/file-operation/ |
| project-initialization | skills/project-initialization/ |