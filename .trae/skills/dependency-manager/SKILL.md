---
name: "dependency-manager"
description: "依赖管理，管理项目依赖和版本控制。触发场景：'依赖管理'、'版本控制'。"
---

# 依赖管理 Skill

## 功能描述

管理项目依赖，包括依赖安装、版本控制、安全检查和更新，确保依赖的安全性和稳定性。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| project_path | string | 项目路径 | 是 |
| action | string | 操作类型 | 是 |
| dependencies | array | 依赖列表 | 否 |
| security_check | boolean | 安全检查 | 否 |

## 输出格式

```json
{
  "status": "success",
  "data": {
    "dependencies": {
      "installed": ["..."],
      "updated": ["..."],
      "security_issues": ["..."],
      "recommendations": ["..."]
    },
    "message": "依赖管理完成"
  },
  "message": "依赖管理完成"
}
```

## 执行流程

1. 分析项目结构和依赖配置
2. 执行指定的依赖操作
3. 进行安全检查
4. 生成依赖管理报告
5. 提供改进建议

## 使用示例

### 输入
```json
{
  "project_path": ".",
  "action": "install",
  "dependencies": ["express", "pg"],
  "security_check": true
}
```

### 输出
```json
{
  "status": "success",
  "data": {
    "dependencies": {
      "installed": ["express@4.18.2", "pg@8.11.3"],
      "updated": [],
      "security_issues": [],
      "recommendations": ["Consider adding @types/express for TypeScript support"]
    }
  },
  "message": "依赖管理完成"
}
```

## 最佳实践

- 定期更新依赖
- 进行安全检查
- 使用锁定文件
- 保持依赖版本的一致性

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 项目路径不存在 | 提示创建项目结构 |
| 依赖安装失败 | 分析错误原因，提供解决方案 |
| 安全问题 | 提供安全更新建议 |