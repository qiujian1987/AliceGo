# MCP服务器实现规划

## 概述

本文档规划Git MCP和Database MCP的实现优先级和时间表，为后续开发提供技术方案和资源需求。

## 背景

当前AliceGo已集成以下MCP服务器：
- mcp_Memory：状态存储
- mcp_Playwright：浏览器自动化
- mcp_Excel：数据处理

根据Loop Engineering需求，还需要以下MCP服务器：
- Git MCP：版本控制和分支管理
- Database MCP：数据库操作和查询

## 实现优先级

| 优先级 | MCP名称 | 理由 | 依赖条件 |
|--------|--------|------|---------|
| **P4** | Git MCP | 支持Worktrees并行开发、分支管理、冲突检测 | TRAE平台支持自定义MCP |
| **P4** | Database MCP | 支持数据库操作、SQL查询优化、数据迁移 | TRAE平台支持自定义MCP |

## 技术方案

### Git MCP

**核心功能**：
1. 分支管理：创建、切换、删除分支
2. Worktree管理：创建、删除、同步Worktree
3. 代码提交：提交代码、推送分支
4. 冲突检测：检测合并冲突、提供解决建议
5. 版本历史：查看提交记录、分支历史

**技术选型**：
- 语言：Python（FastMCP框架）
- 依赖：gitpython
- 接口：RESTful API

**API设计**：

```json
{
  "name": "git-mcp",
  "description": "Git版本控制MCP服务器",
  "tools": [
    {
      "name": "git_create_branch",
      "description": "创建新分支",
      "parameters": {
        "branch_name": {"type": "string", "required": true},
        "base_branch": {"type": "string", "required": false}
      }
    },
    {
      "name": "git_create_worktree",
      "description": "创建Worktree",
      "parameters": {
        "path": {"type": "string", "required": true},
        "branch": {"type": "string", "required": true}
      }
    },
    {
      "name": "git_commit",
      "description": "提交代码",
      "parameters": {
        "message": {"type": "string", "required": true},
        "files": {"type": "array", "required": false}
      }
    },
    {
      "name": "git_push",
      "description": "推送分支",
      "parameters": {
        "branch": {"type": "string", "required": true}
      }
    },
    {
      "name": "git_merge",
      "description": "合并分支",
      "parameters": {
        "source_branch": {"type": "string", "required": true},
        "target_branch": {"type": "string", "required": true}
      }
    },
    {
      "name": "git_check_conflict",
      "description": "检查合并冲突",
      "parameters": {
        "source_branch": {"type": "string", "required": true},
        "target_branch": {"type": "string", "required": true}
      }
    }
  ]
}
```

### Database MCP

**核心功能**：
1. 查询执行：执行SQL查询
2. 数据操作：插入、更新、删除数据
3. 事务管理：开始、提交、回滚事务
4. 连接管理：管理数据库连接池
5. 查询优化：分析和优化SQL查询

**技术选型**：
- 语言：Python（FastMCP框架）
- 依赖：SQLAlchemy
- 支持数据库：PostgreSQL、MySQL、SQLite

**API设计**：

```json
{
  "name": "database-mcp",
  "description": "数据库操作MCP服务器",
  "tools": [
    {
      "name": "db_execute_query",
      "description": "执行SQL查询",
      "parameters": {
        "query": {"type": "string", "required": true},
        "params": {"type": "object", "required": false}
      }
    },
    {
      "name": "db_insert",
      "description": "插入数据",
      "parameters": {
        "table": {"type": "string", "required": true},
        "data": {"type": "object", "required": true}
      }
    },
    {
      "name": "db_update",
      "description": "更新数据",
      "parameters": {
        "table": {"type": "string", "required": true},
        "data": {"type": "object", "required": true},
        "where": {"type": "string", "required": true}
      }
    },
    {
      "name": "db_delete",
      "description": "删除数据",
      "parameters": {
        "table": {"type": "string", "required": true},
        "where": {"type": "string", "required": true}
      }
    },
    {
      "name": "db_begin_transaction",
      "description": "开始事务",
      "parameters": {}
    },
    {
      "name": "db_commit",
      "description": "提交事务",
      "parameters": {}
    },
    {
      "name": "db_rollback",
      "description": "回滚事务",
      "parameters": {}
    },
    {
      "name": "db_optimize_query",
      "description": "优化SQL查询",
      "parameters": {
        "query": {"type": "string", "required": true}
      }
    }
  ]
}
```

## 实施时间表

| 阶段 | 时间 | 任务 | 负责人 |
|------|------|------|--------|
| 规划阶段 | 2026-Q3 | 技术方案设计、API设计 | Architect |
| 开发阶段 | 2026-Q4 | Git MCP开发、Database MCP开发 | DevOps |
| 测试阶段 | 2026-Q4 | 单元测试、集成测试 | QA |
| 集成阶段 | 2027-Q1 | 与AliceGo框架集成 | DevOps |
| 验收阶段 | 2027-Q1 | 用户验收测试 | Team Lead |

## 资源需求

| 资源类型 | 数量 | 说明 |
|---------|------|------|
| 开发人员 | 1人 | Python开发经验、MCP框架经验 |
| 测试人员 | 0.5人 | 数据库测试经验 |
| 时间 | 6周 | Git MCP 3周 + Database MCP 3周 |

## 风险评估

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| TRAE平台不支持自定义MCP | 低 | 高 | 提前验证TRAE平台能力 |
| 数据库连接安全问题 | 中 | 高 | 使用参数化查询、加密连接 |
| Git操作权限问题 | 中 | 中 | 使用SSH密钥认证 |
| 性能瓶颈 | 低 | 中 | 实现连接池、缓存机制 |

## 与现有系统集成

### Git MCP集成点

1. Worktrees管理：与07_loop-worktrees.md规则集成
2. 分支管理：与task-decomposition Skill集成
3. 冲突检测：与loop-coordinator Agent集成

### Database MCP集成点

1. 数据操作：与dba Agent集成
2. 查询优化：与sql-optimizer Skill集成
3. 事务管理：与backend-dev Agent集成

## 里程碑

| 里程碑 | 完成标准 |
|--------|---------|
| Git MCP开发完成 | 所有API接口实现并通过测试 |
| Database MCP开发完成 | 所有API接口实现并通过测试 |
| 集成完成 | MCP服务器成功集成到AliceGo框架 |
| 验收通过 | 用户验收测试通过 |

---

*规划日期：2026-07-18*
