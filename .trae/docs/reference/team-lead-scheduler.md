# Team Lead 调度器

## 功能
作为 TRAE 主 Agent，负责任务分解和多 Agent 调度。

## 调度流程

```
[用户需求]
    ↓
Team Lead 分析需求
    ↓
拆解任务
    ↓
写入 mailbox/{agent}.md
    ↓
轮询等待完成
    ↓
汇总结果
```

## 使用方式

当用户提出需要协同的需求时，Team Lead 会：

1. **分析需求** - 理解用户想要什么
2. **拆解任务** - 将任务分配给专业 Agent
3. **并行调度** - 同时向多个 Agent 发送任务
4. **收集结果** - 轮询 mailbox 收集各 Agent 产出
5. **汇总交付** - 整合所有结果返回给用户

## Agent 职责

| Agent | 职责 | Mailbox |
|-------|------|---------|
| team-lead | 需求分析、任务拆解、结果汇总 | - |
| architect | 系统设计、API 合同 | mailbox/to-architect.md |
| dba | 数据模型、数据库 | mailbox/to-dba.md |
| frontend-dev | 前端开发 | mailbox/to-frontend.md |
| backend-dev | 后端开发 | mailbox/to-backend.md |
| devops | 环境、CI/CD | mailbox/to-devops.md |
| qa | 测试、质量 | mailbox/to-qa.md |

## 调度命令

在对话中输入：
```
[TEAM LEAD] 开始任务：{需求描述}
```

Team Lead 将自动分解并调度任务。
