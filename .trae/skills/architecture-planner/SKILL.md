---
name: "architecture-planner"
description: "架构设计，制定系统的整体架构和技术选型。触发场景：'架构设计'、'技术选型'。"
---

# 架构设计 Skill

## 功能描述

根据需求和技术约束，设计系统的整体架构，包括技术栈选择、模块划分和数据流设计。

## 执行文件
- 执行文件：`scripts/plan.js`

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| requirements | object | 需求规约文档 | 是 |
| constraints | object | 技术约束 | 否 |
| existing_system | boolean | 是否有现有系统 | 否 |

## 输出格式

```json
{
  "status": "success",
  "data": {
    "architecture": {
      "tech_stack": {
        "frontend": "...",
        "backend": "...",
        "database": "...",
        "cloud": "..."
      },
      "modules": [
        {
          "name": "...",
          "description": "...",
          "dependencies": ["..."]
        }
      ],
      "data_flow": "...",
      "scalability": "...",
      "security": "..."
    },
    "document": "生成的架构设计文档内容"
  },
  "message": "架构设计完成"
}
```

## 执行流程

1. 分析需求和技术约束
2. 选择合适的技术栈
3. 设计系统整体架构和模块划分
4. 规划数据流和交互
5. 考虑可扩展性和安全性
6. 生成整体架构设计文档
7. 指导后续的数据模型设计和API设计

## 使用示例

### 输入
```json
{
  "requirements": {
    "functional_requirements": ["用户注册登录", "商品浏览搜索", "购物车管理", "在线支付"]
  },
  "constraints": {
    "budget": "medium",
    "team_skill": ["React", "Node.js"]
  }
}
```

### 输出
```json
{
  "status": "success",
  "data": {
    "architecture": {
      "tech_stack": {
        "frontend": "React + TypeScript + Tailwind",
        "backend": "Node.js + Express + TypeScript",
        "database": "PostgreSQL",
        "cloud": "AWS"
      },
      "modules": [
        {
          "name": "用户模块",
          "description": "用户注册、登录、个人信息管理",
          "dependencies": []
        },
        {
          "name": "商品模块",
          "description": "商品管理、搜索、推荐",
          "dependencies": []
        },
        {
          "name": "购物车模块",
          "description": "购物车管理、结算",
          "dependencies": ["用户模块", "商品模块"]
        },
        {
          "name": "支付模块",
          "description": "支付处理、订单管理",
          "dependencies": ["用户模块", "购物车模块"]
        }
      ],
      "data_flow": "用户请求 → API Gateway → 微服务 → 数据库 → 响应",
      "scalability": "水平扩展，服务化架构",
      "security": "JWT认证，HTTPS，输入验证"
    },
    "document": "# 电商系统架构设计\n\n## 1. 技术栈\n- 前端：React + TypeScript + Tailwind\n- 后端：Node.js + Express + TypeScript\n- 数据库：PostgreSQL\n- 云服务：AWS\n\n## 2. 系统模块\n- 用户模块\n- 商品模块\n- 购物车模块\n- 支付模块\n\n## 3. 数据流\n用户请求 → API Gateway → 微服务 → 数据库 → 响应\n\n## 4. 可扩展性\n水平扩展，服务化架构\n\n## 5. 安全性\nJWT认证，HTTPS，输入验证"
    }
  },
  "message": "架构设计完成"
}
```

## 最佳实践

- 考虑系统的可扩展性
- 选择团队熟悉的技术栈
- 合理划分模块边界
- 重视安全性和性能

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 技术约束冲突 | 提出多个方案，说明优缺点 |
| 需求不明确 | 基于现有信息设计，标记需要确认的部分 |
| 技术栈选择困难 | 提供多个技术栈方案，分析对比 |