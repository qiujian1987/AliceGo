# TRAE 框架构建进度

## 最后更新
2026-04-18

## 当前状态

### 框架目录结构
```
.trae/
├── agents/          # Agent 定义 (TRAE 平台可导入)
├── core/             # 核心模块 (memory_manager, task_manager, conversation_manager)
├── docs/             # 文档
├── init/             # 初始化脚本
├── mailbox/          # Agent 间通信
├── memory/           # 记忆存储（框架级）
├── rules/            # 代码规范、工程标准、项目规则
├── skills/           # Skill 注册表
└── team-config.json  # 团队模式配置
```

### TRAE 平台 Agent 配置

已按照 TRAE 官方文档更新 Agent 配置文件，添加 frontmatter 元数据：

| Agent | english_name | when_to_call |
|-------|-------------|--------------|
| team-lead | team-lead | 需求分析、任务拆解、全局协调、验收 |
| architect | architect | 架构设计、API合同、技术选型 |
| dba | dba | 数据库设计、表结构、SQL优化 |
| frontend-dev | frontend-dev | 前端开发、UI组件 |
| backend-dev | backend-dev | 后端开发、API实现 |
| devops | devops | 环境配置、CI/CD、依赖管理 |
| qa | qa | 测试用例、质量评估 |

### 已完成的工作
1. ✅ 框架基础结构搭建
2. ✅ Agent 角色定义（team-lead, architect, dba, frontend-dev, backend-dev, devops, qa）
3. ✅ Rules 规范制定（code_standards, engineering_standards, project_rules）
4. ✅ Skills 系统设计
5. ✅ Memory 系统设计（核心模块已实现）
6. ✅ 团队协作配置（team-config.json）
7. ✅ 记忆持久化机制设计
8. ✅ TRAE Agent 配置（支持平台导入）

### 待完善
1. 🔄 Memory 机制与实际项目目录的路径整合
2. 🔄 Skills 与 Agent 的执行触发机制
3. 🔄 实际项目创建流程 (harness)
4. 🔄 Agent 之间的并行调用机制（需 SOLO Coder 支持）

### 关键决策记录
1. 框架与项目文件分离：框架代码放在 `.trae/`，项目代码放在项目根目录
2. Memory 系统设计为框架级，但数据存储路径需指向实际项目目录
3. Skills 采用注册表模式管理
4. Agent 配置符合 TRAE 平台规范，可导入使用

## TRAE Agent 导入指南

### 如何导入 Agent
1. 在 TRAE 中输入 `@` 或点击 `@智能体`
2. 点击底部「创建智能体」按钮
3. 选择「导入」或手动配置
4. 参考 `agents/*.md` 文件中的提示词

### Agent 调用方式
- 在对话中输入 `@agent_name` 来调用特定 Agent
- 目前仅 **SOLO Coder** 支持调用自定义 Agent
- Team Lead 作为主调度 Agent，协调其他专业 Agent

## 会话历史摘要

### 2026-04-18 框架构建会话
- 讨论了多 Agent 协同框架的设计
- 实现了记忆系统（解决 50 轮对话后上下文丢失问题）
- 整理了框架目录结构，移除了项目特定文件
- 将核心 JS 模块移动到 `core/` 目录
- 删除了项目特定配置文件（tech-stack-whitelist.json 等）
- 更新 Agent 配置符合 TRAE 平台规范

### 核心问题
- Memory 机制需要与实际项目目录整合
- 框架与 TRAE 平台的集成方式已明确（Agent 可导入）
- Skills 执行触发机制待明确
- Agent 并行调用需 SOLO Coder 支持
