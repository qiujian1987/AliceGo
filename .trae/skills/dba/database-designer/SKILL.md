---
name: "database-designer"
description: "数据库设计，设计数据库表结构和关系。触发场景：'数据库设计'、'表结构设计'。"
---

# 数据库设计 Skill

## 功能描述

根据业务需求和数据模型，设计数据库表结构、关系和索引，生成SQL建表语句。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| entities | array | 业务实体列表 | 是 |
| relationships | array | 实体关系列表 | 否 |
| constraints | object | 设计约束 | 否 |

## 输出格式

```json
{
  "status": "success",
  "data": {
    "database_design": {
      "tables": [
        {
          "name": "...",
          "columns": [
            {
              "name": "...",
              "type": "...",
              "constraints": "...",
              "description": "..."
            }
          ],
          "primary_key": "...",
          "foreign_keys": ["..."]
        }
      ],
      "relationships": [
        {
          "from": "...",
          "to": "...",
          "type": "..."
        }
      ],
      "indexes": [
        {
          "table": "...",
          "columns": ["..."],
          "type": "..."
        }
      ],
      "sql": "生成的SQL建表语句"
    }
  },
  "message": "数据库设计完成"
}
```

## 执行流程

1. 分析业务实体和关系
2. 设计表结构和字段
3. 定义主键和外键
4. 设计索引策略
5. 生成SQL建表语句
6. 验证设计的合理性

## 使用示例

### 输入
```json
{
  "entities": [
    {
      "name": "User",
      "fields": ["id", "name", "email", "password"]
    },
    {
      "name": "Order",
      "fields": ["id", "user_id", "amount", "status"]
    }
  ],
  "relationships": [
    {
      "from": "Order",
      "to": "User",
      "type": "many-to-one"
    }
  ]
}
```

### 输出
```json
{
  "status": "success",
  "data": {
    "database_design": {
      "tables": [
        {
          "name": "users",
          "columns": [
            {
              "name": "id",
              "type": "SERIAL",
              "constraints": "PRIMARY KEY",
              "description": "用户ID"
            },
            {
              "name": "name",
              "type": "VARCHAR(255)",
              "constraints": "NOT NULL",
              "description": "用户名"
            },
            {
              "name": "email",
              "type": "VARCHAR(255)",
              "constraints": "UNIQUE NOT NULL",
              "description": "邮箱"
            },
            {
              "name": "password",
              "type": "VARCHAR(255)",
              "constraints": "NOT NULL",
              "description": "密码"
            },
            {
              "name": "created_at",
              "type": "TIMESTAMP",
              "constraints": "DEFAULT CURRENT_TIMESTAMP",
              "description": "创建时间"
            }
          ],
          "primary_key": "id",
          "foreign_keys": []
        },
        {
          "name": "orders",
          "columns": [
            {
              "name": "id",
              "type": "SERIAL",
              "constraints": "PRIMARY KEY",
              "description": "订单ID"
            },
            {
              "name": "user_id",
              "type": "INTEGER",
              "constraints": "REFERENCES users(id)",
              "description": "用户ID"
            },
            {
              "name": "amount",
              "type": "DECIMAL(10,2)",
              "constraints": "NOT NULL",
              "description": "订单金额"
            },
            {
              "name": "status",
              "type": "VARCHAR(50)",
              "constraints": "NOT NULL",
              "description": "订单状态"
            },
            {
              "name": "created_at",
              "type": "TIMESTAMP",
              "constraints": "DEFAULT CURRENT_TIMESTAMP",
              "description": "创建时间"
            }
          ],
          "primary_key": "id",
          "foreign_keys": ["user_id REFERENCES users(id)"]
        }
      ],
      "relationships": [
        {
          "from": "orders",
          "to": "users",
          "type": "many-to-one"
        }
      ],
      "indexes": [
        {
          "table": "users",
          "columns": ["email"],
          "type": "UNIQUE"
        },
        {
          "table": "orders",
          "columns": ["user_id"],
          "type": "INDEX"
        }
      ],
      "sql": "CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  email VARCHAR(255) UNIQUE NOT NULL,\n  password VARCHAR(255) NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE orders (\n  id SERIAL PRIMARY KEY,\n  user_id INTEGER REFERENCES users(id),\n  amount DECIMAL(10,2) NOT NULL,\n  status VARCHAR(50) NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE UNIQUE INDEX idx_users_email ON users(email);\nCREATE INDEX idx_orders_user_id ON orders(user_id);"
    }
  },
  "message": "数据库设计完成"
}
```

## 最佳实践

- 遵循数据库设计范式
- 合理设计表结构和字段类型
- 正确定义主键和外键
- 设计适当的索引
- 考虑性能和可扩展性

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 实体关系不明确 | 基于现有信息设计，标记需要确认的部分 |
| 字段类型选择困难 | 提供多个方案，分析对比 |
| 性能要求不明确 | 设计平衡性能和空间的方案 |