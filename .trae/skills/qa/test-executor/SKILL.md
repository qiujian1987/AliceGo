---
name: "test-executor"
description: "测试执行，执行测试用例并生成测试报告。触发场景：'执行测试'、'测试报告'。"
---

# 测试执行 Skill

## 功能描述

执行项目的测试用例，生成详细的测试报告和覆盖率报告，评估项目质量。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| project_path | string | 项目路径 | 是 |
| test_type | string | 测试类型 | 否 |
| coverage | boolean | 覆盖率报告 | 否 |
| output_format | string | 输出格式 | 否 |

## 输出格式

```json
{
  "status": "success",
  "data": {
    "test_results": {
      "total": 10,
      "passed": 8,
      "failed": 2,
      "skipped": 0,
      "coverage": "85%",
      "report": "..."
    },
    "issues": [
      {
        "test": "...",
        "error": "...",
        "location": "..."
      }
    ],
    "recommendations": ["..."]
  },
  "message": "测试执行完成"
}
```

## 执行流程

1. 分析项目结构和测试配置
2. 执行测试用例
3. 生成测试报告
4. 生成覆盖率报告
5. 分析测试结果
6. 提供改进建议

## 使用示例

### 输入
```json
{
  "project_path": ".",
  "test_type": "all",
  "coverage": true,
  "output_format": "json"
}
```

### 输出
```json
{
  "status": "success",
  "data": {
    "test_results": {
      "total": 10,
      "passed": 8,
      "failed": 2,
      "skipped": 0,
      "coverage": "85%",
      "report": "Tests completed in 2.5 seconds.\nCoverage: 85% (branches: 80%, functions: 90%, lines: 85%)"
    },
    "issues": [
      {
        "test": "UserService.create should handle invalid email",
        "error": "Expected error but none was thrown",
        "location": "src/services/UserService.test.ts:42"
      },
      {
        "test": "UserController.getUserById should return 404 for non-existent user",
        "error": "Expected 404 but got 500",
        "location": "src/controllers/UserController.test.ts:78"
      }
    ],
    "recommendations": [
      "Add error handling for invalid email in UserService.create",
      "Fix 404 response in UserController.getUserById",
      "Increase test coverage for error handling scenarios"
    ]
  },
  "message": "测试执行完成"
}
```

## 最佳实践

- 定期执行测试
- 分析测试结果和覆盖率
- 及时修复测试失败
- 持续改进测试质量

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 项目路径不存在 | 提示创建项目结构 |
| 测试执行失败 | 分析失败原因，提供解决方案 |
| 覆盖率不足 | 提供覆盖率提升建议 |