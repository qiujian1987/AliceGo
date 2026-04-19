---
name: "code-generator"
description: "后端代码生成，生成Express服务和API实现。触发场景：'生成服务'、'后端代码'。"
---

# 后端代码生成 Skill

## 功能描述

根据API设计生成Express服务、控制器、服务层和数据访问层代码，支持TypeScript和现代后端框架。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| service_type | string | 服务类型 | 是 |
| name | string | 服务名称 | 是 |
| endpoints | array | API端点 | 是 |
| framework | string | 后端框架 | 否 |
| database | string | 数据库类型 | 否 |

## 输出格式

```json
{
  "status": "success",
  "data": {
    "code": {
      "controller": "...",
      "service": "...",
      "model": "...",
      "routes": "...",
      "path": "..."
    },
    "files": [
      {
        "name": "...",
        "content": "...",
        "path": "..."
      }
    ]
  },
  "message": "代码生成完成"
}
```

## 执行流程

1. 分析服务类型和API端点
2. 生成控制器代码
3. 生成服务层代码
4. 生成数据模型代码
5. 生成路由配置
6. 提供文件路径建议

## 使用示例

### 输入
```json
{
  "service_type": "user",
  "name": "UserService",
  "endpoints": [
    {
      "path": "/api/users",
      "method": "POST",
      "description": "创建用户"
    },
    {
      "path": "/api/users/:id",
      "method": "GET",
      "description": "获取用户信息"
    }
  ],
  "framework": "express",
  "database": "postgresql"
}
```

### 输出
```json
{
  "status": "success",
  "data": {
    "code": {
      "controller": "import { Request, Response } from 'express';\nimport { UserService } from '../services/UserService';\n\nexport class UserController {\n  private userService: UserService;\n\n  constructor() {\n    this.userService = new UserService();\n  }\n\n  async createUser(req: Request, res: Response): Promise<void> {\n    try {\n      const userData = req.body;\n      const user = await this.userService.create(userData);\n      res.status(201).json(user);\n    } catch (error) {\n      res.status(400).json({ error: (error as Error).message });\n    }\n  }\n\n  async getUserById(req: Request, res: Response): Promise<void> {\n    try {\n      const { id } = req.params;\n      const user = await this.userService.findById(id);\n      if (!user) {\n        res.status(404).json({ error: 'User not found' });\n        return;\n      }\n      res.json(user);\n    } catch (error) {\n      res.status(500).json({ error: 'Internal server error' });\n    }\n  }\n}\n",
      "service": "import { User } from '../models/User';\n\nexport class UserService {\n  async create(userData: Partial<User>): Promise<User> {\n    // 实现创建用户的业务逻辑\n    // 这里应该调用数据库操作\n    return {\n      id: 1,\n      name: userData.name || '',\n      email: userData.email || '',\n      created_at: new Date(),\n      updated_at: new Date()\n    } as User;\n  }\n\n  async findById(id: string): Promise<User | null> {\n    // 实现根据ID查询用户的业务逻辑\n    // 这里应该调用数据库操作\n    return {\n      id: parseInt(id),\n      name: 'John Doe',\n      email: 'john@example.com',\n      created_at: new Date(),\n      updated_at: new Date()\n    } as User;\n  }\n}\n",
      "model": "export interface User {\n  id: number;\n  name: string;\n  email: string;\n  created_at: Date;\n  updated_at: Date;\n}\n",
      "routes": "import { Router } from 'express';\nimport { UserController } from '../controllers/UserController';\n\nconst router = Router();\nconst userController = new UserController();\n\nrouter.post('/api/users', userController.createUser.bind(userController));\nrouter.get('/api/users/:id', userController.getUserById.bind(userController));\n\nexport default router;\n",
      "path": "src/server/"
    },
    "files": [
      {
        "name": "UserController.ts",
        "content": "import { Request, Response } from 'express';\nimport { UserService } from '../services/UserService';\n\nexport class UserController {\n  private userService: UserService;\n\n  constructor() {\n    this.userService = new UserService();\n  }\n\n  async createUser(req: Request, res: Response): Promise<void> {\n    try {\n      const userData = req.body;\n      const user = await this.userService.create(userData);\n      res.status(201).json(user);\n    } catch (error) {\n      res.status(400).json({ error: (error as Error).message });\n    }\n  }\n\n  async getUserById(req: Request, res: Response): Promise<void> {\n    try {\n      const { id } = req.params;\n      const user = await this.userService.findById(id);\n      if (!user) {\n        res.status(404).json({ error: 'User not found' });\n        return;\n      }\n      res.json(user);\n    } catch (error) {\n      res.status(500).json({ error: 'Internal server error' });\n    }\n  }\n}\n",
        "path": "src/server/controllers/UserController.ts"
      },
      {
        "name": "UserService.ts",
        "content": "import { User } from '../models/User';\n\nexport class UserService {\n  async create(userData: Partial<User>): Promise<User> {\n    // 实现创建用户的业务逻辑\n    // 这里应该调用数据库操作\n    return {\n      id: 1,\n      name: userData.name || '',\n      email: userData.email || '',\n      created_at: new Date(),\n      updated_at: new Date()\n    } as User;\n  }\n\n  async findById(id: string): Promise<User | null> {\n    // 实现根据ID查询用户的业务逻辑\n    // 这里应该调用数据库操作\n    return {\n      id: parseInt(id),\n      name: 'John Doe',\n      email: 'john@example.com',\n      created_at: new Date(),\n      updated_at: new Date()\n    } as User;\n  }\n}\n",
        "path": "src/server/services/UserService.ts"
      },
      {
        "name": "User.ts",
        "content": "export interface User {\n  id: number;\n  name: string;\n  email: string;\n  created_at: Date;\n  updated_at: Date;\n}\n",
        "path": "src/server/models/User.ts"
      },
      {
        "name": "userRoutes.ts",
        "content": "import { Router } from 'express';\nimport { UserController } from '../controllers/UserController';\n\nconst router = Router();\nconst userController = new UserController();\n\nrouter.post('/api/users', userController.createUser.bind(userController));\nrouter.get('/api/users/:id', userController.getUserById.bind(userController));\n\nexport default router;\n",
        "path": "src/server/routes/userRoutes.ts"
      }
    ]
  },
  "message": "代码生成完成"
}
```

## 最佳实践

- 使用TypeScript类型定义
- 遵循分层架构原则
- 实现适当的错误处理
- 生成完整的代码结构

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 服务类型不支持 | 提示支持的服务类型列表 |
| 端点定义不清晰 | 提供端点定义的最佳实践 |
| 框架选择错误 | 提示支持的框架列表 |