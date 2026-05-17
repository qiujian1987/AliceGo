---
name: "code-generator"
description: "代码生成，生成前后端代码和测试代码。触发场景：'生成服务'、'后端代码'、'前端代码'、'编写代码'、'实现功能'、'代码生成'。输入参数：api_spec(必需)，language(可选)。输出：src/ 下的代码文件和 tests/ 下的测试文件。"
---

# 代码生成 Skill

## 功能描述

根据API设计和测试用例生成完整的代码实现，包括业务代码和测试代码，支持TDD开发流程。

## 调用规范（强制要求）

### 调用链路
```
SOLO Coder → 调用 @backend-dev 或 @frontend-dev Agent → Agent调用此Skill
```

### 约束规则
- **SOLO Coder**：必须先调用开发Agent，禁止直接调用此Skill
- **开发Agent**：负责调用此Skill执行代码生成流程
- **Skill执行者**：@backend-dev 或 @frontend-dev Agent

---

## TDD 流程支持（核心功能）

### TDD 执行步骤
```
1. 读取测试用例文档（design/features/*/test-cases.md）
2. 生成测试代码（tests/**/*.test.ts）
3. 运行测试（初始状态应为失败）
4. 生成业务代码使测试通过
5. 验证测试覆盖率达到95%以上
```

### TDD 输出
| 输出类型 | 路径 | 说明 |
|---------|------|------|
| 测试代码 | tests/unit/*.test.ts | 单元测试 |
| 测试代码 | tests/integration/*.test.ts | 集成测试 |
| 业务代码 | src/server/* 或 src/client/* | 业务实现 |

---

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| service_type | string | 服务/组件类型 | 是 |
| name | string | 服务/组件名称 | 是 |
| endpoints | array | API端点（后端） | 否 |
| test_cases | array | 测试用例列表 | 是 |
| framework | string | 后端/前端框架 | 否 |
| database | string | 数据库类型 | 否 |

---

## 输出格式

```json
{
  "status": "success",
  "data": {
    "code": {
      "controller": "...",
      "service": "...",
      "model": "...",
      "routes": "..."
    },
    "tests": {
      "unit": [
        {
          "name": "...",
          "content": "...",
          "path": "..."
        }
      ],
      "integration": [
        {
          "name": "...",
          "content": "...",
          "path": "..."
        }
      ]
    },
    "files": [
      {
        "name": "...",
        "content": "...",
        "path": "..."
      }
    ],
    "coverage": {
      "target": 95,
      "actual": 96
    }
  },
  "message": "TDD代码生成完成"
}
```

---

## 执行流程（TDD模式）

### Step 1: 分析测试用例
- 读取 `design/features/*/test-cases.md`
- 提取测试场景和验收标准

### Step 2: 生成测试代码
- 根据测试用例生成单元测试
- 根据API设计生成集成测试
- 输出到 `tests/` 目录

### Step 3: 生成业务代码
- 根据API合同生成控制器
- 根据业务逻辑生成服务层
- 根据数据模型生成实体

### Step 4: 验证测试
- 检查测试文件是否生成
- 验证测试覆盖率目标

---

## 使用示例

### 输入（后端TDD开发）
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
  "test_cases": [
    {
      "name": "创建用户成功",
      "type": "unit",
      "input": { "name": "John", "email": "john@example.com" },
      "expected": { "status": 201, "name": "John" }
    },
    {
      "name": "获取用户信息",
      "type": "integration",
      "input": { "id": "1" },
      "expected": { "status": 200, "id": 1 }
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
      "controller": "...",
      "service": "...",
      "model": "...",
      "routes": "...",
      "path": "src/server/"
    },
    "tests": {
      "unit": [
        {
          "name": "UserService.test.ts",
          "content": "import { UserService } from '../services/UserService';\n\ndescribe('UserService', () => {\n  it('should create a user', () => {\n    const service = new UserService();\n    const user = service.create({ name: 'John', email: 'john@example.com' });\n    expect(user.name).toBe('John');\n  });\n});",
          "path": "tests/unit/UserService.test.ts"
        }
      ],
      "integration": [
        {
          "name": "api.test.ts",
          "content": "import request from 'supertest';\nimport app from '../src/app';\n\ndescribe('API Tests', () => {\n  it('should get user by id', async () => {\n    const res = await request(app).get('/api/users/1');\n    expect(res.status).toBe(200);\n  });\n});",
          "path": "tests/integration/api.test.ts"
        }
      ]
    },
    "files": [...],
    "coverage": { "target": 95, "actual": 96 }
  },
  "message": "TDD代码生成完成"
}
```

---

## 最佳实践

- 使用TypeScript类型定义
- 遵循分层架构原则
- 实现适当的错误处理
- **测试代码与业务代码同步生成**
- 确保测试覆盖率达到95%以上

---

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 服务类型不支持 | 提示支持的服务类型列表 |
| 测试用例缺失 | 提示必须提供测试用例 |
| 框架选择错误 | 提示支持的框架列表 |
| 测试覆盖率不足 | 提供优化建议 |

---

*最后更新：2026-05-17*
