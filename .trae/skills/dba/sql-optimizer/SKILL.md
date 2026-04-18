---
name: "sql-optimizer"
description: "SQL优化，分析和优化SQL查询性能。触发场景：'SQL优化'、'查询性能'。"
---

# SQL 优化 Skill

## 功能描述

分析SQL查询语句，识别性能瓶颈，提供优化建议和改进方案。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| sql | string | SQL查询语句 | 是 |
| table_schema | object | 表结构信息 | 否 |
| execution_plan | string | 执行计划 | 否 |

## 输出格式

```json
{
  "status": "success",
  "data": {
    "optimization": {
      "original_sql": "...",
      "optimized_sql": "...",
      "issues": [
        {
          "type": "...",
          "description": "...",
          "severity": "..."
        }
      ],
      "recommendations": [
        {
          "type": "...",
          "description": "...",
          "implementation": "..."
        }
      ],
      "expected_improvement": "..."
    }
  },
  "message": "SQL优化完成"
}
```

## 执行流程

1. 分析SQL查询语句
2. 识别性能瓶颈
3. 分析表结构和索引
4. 生成优化建议
5. 提供优化后的SQL语句
6. 估算性能改进

## 使用示例

### 输入
```json
{
  "sql": "SELECT * FROM users WHERE email LIKE '%example%' AND created_at > '2026-01-01'",
  "table_schema": {
    "users": {
      "columns": [
        {"name": "id", "type": "SERIAL", "index": "PRIMARY KEY"},
        {"name": "name", "type": "VARCHAR(255)"},
        {"name": "email", "type": "VARCHAR(255)"},
        {"name": "created_at", "type": "TIMESTAMP"}
      ]
    }
  }
}
```

### 输出
```json
{
  "status": "success",
  "data": {
    "optimization": {
      "original_sql": "SELECT * FROM users WHERE email LIKE '%example%' AND created_at > '2026-01-01'",
      "optimized_sql": "SELECT id, name, email FROM users WHERE created_at > '2026-01-01' AND email LIKE '%example%'",
      "issues": [
        {
          "type": "Full table scan",
          "description": "LIKE '%example%' 会导致全表扫描",
          "severity": "high"
        },
        {
          "type": "Select *",
          "description": "使用 SELECT * 会获取不必要的列",
          "severity": "medium"
        }
      ],
      "recommendations": [
        {
          "type": "Add index",
          "description": "在 created_at 列上添加索引",
          "implementation": "CREATE INDEX idx_users_created_at ON users(created_at)"
        },
        {
          "type": "Rewrite query",
          "description": "先过滤 created_at，再过滤 email",
          "implementation": "SELECT id, name, email FROM users WHERE created_at > '2026-01-01' AND email LIKE '%example%'"
        },
        {
          "type": "Limit columns",
          "description": "只选择需要的列",
          "implementation": "SELECT id, name, email FROM users"
        }
      ],
      "expected_improvement": "50-70% 性能提升"
    }
  },
  "message": "SQL优化完成"
}
```

## 最佳实践

- 避免使用 SELECT *
- 合理使用索引
- 优化 WHERE 子句顺序
- 避免复杂的 JOIN 操作
- 考虑使用分页

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| SQL语法错误 | 提示语法错误位置和修复建议 |
| 表结构信息缺失 | 基于SQL语句分析，提供通用建议 |
| 优化空间有限 | 说明当前查询已接近最优，提供微调建议 |