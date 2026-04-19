---
name: "api-designer"
description: "API设计，设计RESTful API接口和文档。触发场景：'API设计'、'接口文档'。"
---

# API 设计 Skill

## 功能描述

根据系统架构和业务需求，设计RESTful API接口，生成API文档和契约，并按模块和功能拆分API文档。

## 执行文件
- 执行文件：`scripts/design.js`

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| modules | array | 系统模块列表 | 是 |
| data_model | object | 数据模型设计 | 否 |
| auth_required | boolean | 是否需要认证 | 否 |

## 输出格式

```json
{
  "status": "success",
  "data": {
    "api_design": {
      "endpoints": [
        {
          "path": "...",
          "method": "...",
          "description": "...",
          "request": {
            "headers": "...",
            "body": "..."
          },
          "response": {
            "200": "...",
            "400": "...",
            "401": "...",
            "404": "..."
          }
        }
      ],
      "authentication": "...",
      "rate_limiting": "...",
      "error_handling": "..."
    },
    "document": "生成的API文档内容"
  },
  "message": "API设计完成"
}
```

## 执行流程

1. 分析系统模块和数据模型
2. 设计RESTful API端点
3. 定义请求和响应格式
4. 设计认证和授权机制
5. 制定错误处理和限流策略
6. 按模块和功能拆分API文档
7. 生成API总文档和拆分的API文件

## 使用示例

### 输入
```json
{
  "modules": [
    {
      "name": "用户模块",
      "description": "用户注册、登录、个人信息管理"
    }
  ],
  "data_model": {
    "users": {
      "id": "integer",
      "name": "string",
      "email": "string",
      "password": "string"
    }
  },
  "auth_required": true
}
```

### 输出
```json
{
  "status": "success",
  "data": {
    "api_design": {
      "endpoints": [
        {
          "path": "/api/users",
          "method": "POST",
          "description": "用户注册",
          "request": {
            "headers": {
              "Content-Type": "application/json"
            },
            "body": {
              "name": "string",
              "email": "string",
              "password": "string"
            }
          },
          "response": {
            "201": {
              "id": "integer",
              "name": "string",
              "email": "string"
            },
            "400": {
              "error": "string"
            }
          }
        },
        {
          "path": "/api/auth/login",
          "method": "POST",
          "description": "用户登录",
          "request": {
            "headers": {
              "Content-Type": "application/json"
            },
            "body": {
              "email": "string",
              "password": "string"
            }
          },
          "response": {
            "200": {
              "token": "string",
              "user": {
                "id": "integer",
                "name": "string",
                "email": "string"
              }
            },
            "401": {
              "error": "Invalid credentials"
            }
          }
        }
      ],
      "authentication": "JWT token",
      "rate_limiting": "100 requests per minute",
      "error_handling": "Standard HTTP status codes"
    },
    "document": "# API文档\n\n## 用户模块\n\n### POST /api/users\n**描述**：用户注册\n\n**请求**：\n```json\n{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "password": "password123"\n}\n```\n\n**响应**：\n- 201 Created\n```json\n{\n  "id": 1,\n  "name": "John Doe",\n  "email": "john@example.com"\n}\n```\n\n### POST /api/auth/login\n**描述**：用户登录\n\n**请求**：\n```json\n{\n  "email": "john@example.com",\n  "password": "password123"\n}\n```\n\n**响应**：\n- 200 OK\n```json\n{\n  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",\n  "user": {\n    "id": 1,\n    "name": "John Doe",\n    "email": "john@example.com"\n  }\n}\n```"
    }
  },
  "message": "API设计完成"
}
```

## 最佳实践

- 遵循RESTful设计原则
- 使用标准HTTP方法和状态码
- 设计清晰的错误处理机制
- 提供完整的API文档

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 数据模型不完整 | 基于现有信息设计，标记需要确认的部分 |
| 模块边界不清晰 | 设计灵活的API，支持未来扩展 |
| 认证需求不明确 | 提供多种认证方案，说明优缺点 |