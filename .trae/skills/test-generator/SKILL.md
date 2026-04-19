---
name: "test-generator"
description: "测试生成，为项目生成全面的测试用例。触发场景：'生成测试'、'测试用例'。"
---

# 测试生成 Skill

## 功能描述

为项目生成全面的测试用例，包括单元测试、集成测试和端到端测试，支持TDD开发方法，确保项目质量。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| project_path | string | 项目路径 | 是 |
| test_types | array | 测试类型 | 否 |
| coverage_target | number | 覆盖率目标 | 否 |
| framework | string | 测试框架 | 否 |

## 输出格式

```json
{
  "status": "success",
  "data": {
    "tests": {
      "unit": ["..."],
      "integration": ["..."],
      "e2e": ["..."],
      "coverage": "..."
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

1. 分析项目结构和需求
2. 识别测试需求和边界条件
3. 按照TDD方法生成测试用例（先于实现）
4. 配置测试框架和覆盖率目标
5. 生成测试配置文件
6. 提供测试文件路径
7. 指导开发人员按照TDD流程执行测试

## 使用示例

### 输入
```json
{
  "project_path": ".",
  "test_types": ["unit", "integration"],
  "coverage_target": 80,
  "framework": "jest"
}
```

### 输出
```json
{
  "status": "success",
  "data": {
    "tests": {
      "unit": ["UserService.test.ts", "UserController.test.ts"],
      "integration": ["api.test.ts"],
      "e2e": [],
      "coverage": "80% target"
    },
    "files": [
      {
        "name": "jest.config.js",
        "content": "module.exports = {\n  testEnvironment: 'node',\n  coverageDirectory: 'coverage',\n  collectCoverageFrom: [\n    'src/**/*.ts',\n    '!src/**/*.d.ts'\n  ],\n  coverageThreshold: {\n    global: {\n      branches: 80,\n      functions: 80,\n      lines: 80,\n      statements: 80\n    }\n  }\n};\n",
        "path": "jest.config.js"
      },
      {
        "name": "api.test.ts",
        "content": "import request from 'supertest';\nimport app from '../src/app';\n\ndescribe('API Integration Tests', () => {\n  it('should create a user', async () => {\n    const response = await request(app)\n      .post('/api/users')\n      .send({\n        name: 'John Doe',\n        email: 'john@example.com'\n      });\n    expect(response.status).toBe(201);\n    expect(response.body.name).toBe('John Doe');\n  });\n\n  it('should get a user', async () => {\n    const response = await request(app).get('/api/users/1');\n    expect(response.status).toBe(200);\n    expect(response.body.id).toBe(1);\n  });\n});\n",
        "path": "tests/integration/api.test.ts"
      }
    ]
  },
  "message": "测试生成完成"
}
```

## 最佳实践

- 测试覆盖所有核心功能
- 测试边界条件和异常情况
- 使用模拟数据和函数
- 配置合理的覆盖率目标

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 项目路径不存在 | 提示创建项目结构 |
| 测试框架不支持 | 提示支持的测试框架列表 |
| 覆盖率目标不合理 | 提供合理的覆盖率建议 |