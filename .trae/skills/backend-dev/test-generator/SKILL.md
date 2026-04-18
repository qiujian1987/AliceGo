---
name: "test-generator"
description: "后端测试生成，为Express服务生成测试用例。触发场景：'生成测试'、'后端测试'。"
---

# 后端测试生成 Skill

## 功能描述

为Express服务和API端点生成单元测试和集成测试用例，确保后端服务的正确性和稳定性。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| service_path | string | 服务文件路径 | 是 |
| service_code | string | 服务代码 | 否 |
| test_type | string | 测试类型 | 否 |
| framework | string | 测试框架 | 否 |

## 输出格式

```json
{
  "status": "success",
  "data": {
    "tests": {
      "unit": "...",
      "integration": "...",
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
  "message": "测试生成完成"
}
```

## 执行流程

1. 分析服务代码
2. 识别服务功能和API端点
3. 生成单元测试用例
4. 生成集成测试用例
5. 提供测试文件路径

## 使用示例

### 输入
```json
{
  "service_path": "src/server/services/UserService.ts",
  "service_code": "import { User } from '../models/User';\n\nexport class UserService {\n  async create(userData: Partial<User>): Promise<User> {\n    // 实现创建用户的业务逻辑\n    // 这里应该调用数据库操作\n    return {\n      id: 1,\n      name: userData.name || '',\n      email: userData.email || '',\n      created_at: new Date(),\n      updated_at: new Date()\n    } as User;\n  }\n\n  async findById(id: string): Promise<User | null> {\n    // 实现根据ID查询用户的业务逻辑\n    // 这里应该调用数据库操作\n    return {\n      id: parseInt(id),\n      name: 'John Doe',\n      email: 'john@example.com',\n      created_at: new Date(),\n      updated_at: new Date()\n    } as User;\n  }\n}\n",
  "test_type": "unit",
  "framework": "jest"
}
```

### 输出
```json
{
  "status": "success",
  "data": {
    "tests": {
      "unit": "import { UserService } from './UserService';\n\ndescribe('UserService', () => {\n  let userService: UserService;\n\n  beforeEach(() => {\n    userService = new UserService();\n  });\n\n  describe('create', () => {\n    it('should create a new user with valid data', async () => {\n      const userData = {\n        name: 'John Doe',\n        email: 'john@example.com'\n      };\n\n      const user = await userService.create(userData);\n\n      expect(user).toBeDefined();\n      expect(user.id).toBe(1);\n      expect(user.name).toBe('John Doe');\n      expect(user.email).toBe('john@example.com');\n      expect(user.created_at).toBeInstanceOf(Date);\n      expect(user.updated_at).toBeInstanceOf(Date);\n    });\n\n    it('should create a user with minimal data', async () => {\n      const userData = {};\n\n      const user = await userService.create(userData);\n\n      expect(user).toBeDefined();\n      expect(user.id).toBe(1);\n      expect(user.name).toBe('');\n      expect(user.email).toBe('');\n    });\n  });\n\n  describe('findById', () => {\n    it('should return a user when given a valid id', async () => {\n      const userId = '1';\n      const user = await userService.findById(userId);\n\n      expect(user).toBeDefined();\n      expect(user).not.toBeNull();\n      if (user) {\n        expect(user.id).toBe(1);\n        expect(user.name).toBe('John Doe');\n        expect(user.email).toBe('john@example.com');\n      }\n    });\n\n    it('should handle string id conversion', async () => {\n      const userId = '42';\n      const user = await userService.findById(userId);\n\n      expect(user).toBeDefined();\n      if (user) {\n        expect(user.id).toBe(42);\n      }\n    });\n  });\n});\n",
      "integration": "",
      "path": "src/server/services/__tests__/UserService.test.ts"
    },
    "files": [
      {
        "name": "UserService.test.ts",
        "content": "import { UserService } from '../UserService';\n\ndescribe('UserService', () => {\n  let userService: UserService;\n\n  beforeEach(() => {\n    userService = new UserService();\n  });\n\n  describe('create', () => {\n    it('should create a new user with valid data', async () => {\n      const userData = {\n        name: 'John Doe',\n        email: 'john@example.com'\n      };\n\n      const user = await userService.create(userData);\n\n      expect(user).toBeDefined();\n      expect(user.id).toBe(1);\n      expect(user.name).toBe('John Doe');\n      expect(user.email).toBe('john@example.com');\n      expect(user.created_at).toBeInstanceOf(Date);\n      expect(user.updated_at).toBeInstanceOf(Date);\n    });\n\n    it('should create a user with minimal data', async () => {\n      const userData = {};\n\n      const user = await userService.create(userData);\n\n      expect(user).toBeDefined();\n      expect(user.id).toBe(1);\n      expect(user.name).toBe('');\n      expect(user.email).toBe('');\n    });\n  });\n\n  describe('findById', () => {\n    it('should return a user when given a valid id', async () => {\n      const userId = '1';\n      const user = await userService.findById(userId);\n\n      expect(user).toBeDefined();\n      expect(user).not.toBeNull();\n      if (user) {\n        expect(user.id).toBe(1);\n        expect(user.name).toBe('John Doe');\n        expect(user.email).toBe('john@example.com');\n      }\n    });\n\n    it('should handle string id conversion', async () => {\n      const userId = '42';\n      const user = await userService.findById(userId);\n\n      expect(user).toBeDefined();\n      if (user) {\n        expect(user.id).toBe(42);\n      }\n    });\n  });\n});\n",
        "path": "src/server/services/__tests__/UserService.test.ts"
      }
    ]
  },
  "message": "测试生成完成"
}
```

## 最佳实践

- 测试覆盖所有服务功能
- 测试边界条件和异常情况
- 使用模拟数据和函数
- 遵循测试框架最佳实践

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 服务代码无法分析 | 提示服务代码格式问题 |
| 测试框架不支持 | 提示支持的测试框架列表 |
| 路径不存在 | 提示创建相应的目录结构 |