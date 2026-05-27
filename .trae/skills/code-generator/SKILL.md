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

### TDD 执行步骤（强制执行）
```
1. 读取测试用例文档（design/features/*/test-cases.md）
2. 【强制】生成测试代码（tests/**/*.test.ts）
3. 【强制】运行测试并验证初始状态为失败（RED阶段）
4. 【强制】记录测试失败证据（如输出日志）
5. 【强制】生成业务代码使测试通过
6. 【强制】重新运行测试并验证全部通过（GREEN阶段）
7. 【强制】验证测试覆盖率达到95%以上
8. 【强制】生成TDD执行验证报告
```

### TDD 三阶段（强制流程）

#### RED 阶段（测试失败）
- **目标**：验证测试能正确捕获功能缺失
- **步骤**：
  1. 生成测试代码
  2. 运行测试：`npm test`
  3. 验证测试状态为 `FAILED`
  4. 记录失败证据（如：测试输出截屏或日志）
- **通过条件**：测试运行且失败原因为"功能未实现"

#### GREEN 阶段（测试通过）
- **目标**：验证业务代码实现了功能需求
- **步骤**：
  1. 基于测试要求实现业务代码
  2. 运行测试：`npm test`
  3. 验证测试状态为 `PASSED`
  4. 记录通过证据（如：测试输出截屏或日志）
- **通过条件**：所有测试通过

#### REFACTOR 阶段（代码重构）
- **目标**：优化代码质量，保持功能不变
- **步骤**：
  1. 检查代码质量
  2. 重构代码
  3. 运行测试验证功能未受影响
- **通过条件**：测试仍然全部通过

### TDD 输出
| 输出类型 | 路径 | 说明 | 验证要求 |
|---------|------|------|---------|
| 测试代码 | tests/unit/*.test.ts | 单元测试 | 必须生成 |
| 测试代码 | tests/integration/*.test.ts | 集成测试 | 必须生成 |
| 测试失败证据 | tests/run-results/initial-fail.log | RED阶段证据 | 必须记录 |
| 测试通过证据 | tests/run-results/pass.log | GREEN阶段证据 | 必须记录 |
| 业务代码 | src/server/* 或 src/client/* | 业务实现 | 必须生成 |

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
    "tdd_execution": {
      "red_phase": {
        "test_files_generated": true,
        "test_ran": true,
        "initial_status": "FAILED",
        "evidence_saved": true,
        "evidence_path": "tests/run-results/initial-fail.log"
      },
      "green_phase": {
        "business_code_generated": true,
        "test_ran": true,
        "final_status": "PASSED",
        "evidence_saved": true,
        "evidence_path": "tests/run-results/pass.log"
      }
    },
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
      "actual": 96,
      "meets_requirement": true,
      "evidence_saved": true,
      "evidence_path": "tests/run-results/coverage-report.txt"
    }
  },
  "message": "TDD代码生成完成，所有阶段验证通过"
}
```

---

## 执行流程（TDD模式 - 强制执行）

### Step 1: 分析测试用例（必须）
- 读取 `design/features/*/test-cases.md`
- 提取测试场景和验收标准
- 识别核心业务逻辑测试用例

### Step 2: RED阶段 - 生成测试代码（必须）
- 根据测试用例生成单元测试
- 根据API设计生成集成测试
- 输出到 `tests/unit/` 和 `tests/integration/` 目录
- **【强制】运行测试并验证初始状态为失败**
- **【强制】保存测试失败证据到 `tests/run-results/initial-fail.log`**

### Step 3: GREEN阶段 - 生成业务代码（必须）
- 根据API合同生成控制器
- 根据业务逻辑生成服务层
- 根据数据模型生成实体
- **【强制】运行测试并验证全部通过**
- **【强制】保存测试通过证据到 `tests/run-results/pass.log`**

### Step 4: 验证覆盖率（必须）
- 运行覆盖率检查：`npm run test:coverage`
- **【强制】验证覆盖率≥95%**
- **【强制】记录覆盖率证据**
- 如果覆盖率不足，补充测试用例

### Step 5: 生成TDD执行验证报告（必须）
- 生成TDD流程执行报告
- 汇总RED和GREEN阶段证据
- 输出覆盖率统计

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

### 输出（后端示例）
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

### 输入（前端TDD开发）
```json
{
  "service_type": "component",
  "name": "UserList",
  "test_cases": [
    {
      "name": "渲染用户列表",
      "type": "unit",
      "input": { "users": [{ "id": 1, "name": "John" }] },
      "expected": { "displayed": true, "itemCount": 1 }
    },
    {
      "name": "点击用户跳转详情",
      "type": "integration",
      "input": { "userId": "1" },
      "expected": { "navigated": true, "url": "/users/1" }
    }
  ],
  "framework": "react",
  "ui_library": "antd"
}
```

### 输出（前端示例）
```json
{
  "status": "success",
  "data": {
    "code": {
      "component": "...",
      "hooks": "...",
      "types": "...",
      "path": "src/client/"
    },
    "tests": {
      "unit": [
        {
          "name": "UserList.test.tsx",
          "content": "import { render, screen, fireEvent } from '@testing-library/react';\nimport { UserList } from './UserList';\n\ndescribe('UserList', () => {\n  it('should render user list', () => {\n    render(<UserList users={[{ id: 1, name: 'John' }]} />);\n    expect(screen.getByText('John')).toBeInTheDocument();\n  });\n});",
          "path": "tests/unit/UserList.test.tsx"
        }
      ],
      "integration": [
        {
          "name": "UserList.integration.test.tsx",
          "content": "...",
          "path": "tests/integration/UserList.integration.test.tsx"
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

| 错误类型 | 处理方式 | 严重程度 |
|---------|---------|---------|
| 服务类型不支持 | 提示支持的服务类型列表 | 中 |
| 测试用例缺失 | 提示必须提供测试用例 | 高 |
| 框架选择错误 | 提示支持的框架列表 | 中 |
| 测试覆盖率不足 | 提供优化建议 | 高 |
| **RED阶段测试未失败** | **标记为TDD流程错误，要求重新生成测试** | **严重** |
| **GREEN阶段测试未通过** | **标记为实现错误，要求修改业务代码** | **严重** |
| **未运行测试** | **标记为TDD流程缺失，要求执行测试** | **严重** |
| **未保存测试证据** | **标记为验证缺失，要求补充证据** | **高** |

---

*最后更新：2026-05-17*
