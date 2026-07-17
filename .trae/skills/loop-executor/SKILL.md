---
name: "loop-executor"
description: "回环执行引擎，管理回环状态转换、执行回退路径、管理迭代次数、触发成功跳转。触发场景：'执行回环'、'回退步骤'、'重试评审'。"
---

# 回环执行引擎 Skill

## 功能描述

Loop执行引擎是AliceGo的核心执行组件，负责管理回环状态转换、执行回退路径、管理迭代次数，并在评审通过时触发成功跳转。确保Loop能够正确处理评审失败的情况，实现自动回退和重试。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| project_id | string | 项目ID | 是 |
| current_loop | string | 当前回环名称（requirements/design/test/code） | 是 |
| loop_iteration | number | 当前迭代次数 | 是 |
| max_iteration | number | 最大迭代次数，默认3 | 否 |
| review_result | string | 评审结果（pass/fail） | 是 |
| fallback_path | array | 回退路径，包含步骤编号列表 | 否 |
| success_path | array | 成功路径，包含步骤编号列表 | 否 |

## 输出格式

### 主要输出：JSON状态
```json
{
  "status": "success",
  "action": "fallback",
  "next_step": 3,
  "loop_state": {
    "current_loop": "requirements",
    "loop_iteration": 2,
    "max_loop_iteration": 3,
    "fallback_path": [3],
    "success_path": [5],
    "last_review_result": "fail",
    "next_review_step": 4
  },
  "message": "评审失败，回退到步骤3，迭代次数2/3"
}
```

## 执行流程

1. 读取当前回环状态
2. 根据评审结果判断执行路径：
   - 评审通过（pass）：执行成功路径，跳转到success_path指定的下一步
   - 评审失败（fail）：执行回退路径，跳转到fallback_path指定的步骤
3. 更新迭代次数
4. 检查迭代次数是否达到上限：
   - 未达到上限：继续回环，返回下一步步骤指示
   - 达到上限：升级给用户决策，返回升级通知
5. 更新项目状态到mcp_Memory
6. 返回执行结果

## 回环定义

### 需求评审回环（requirements）
- 评审步骤：步骤4
- 回退路径：[3]（特性需求分析）
- 成功路径：[5]（需求确认）
- 最大迭代次数：3

### 设计评审回环（design）
- 评审步骤：步骤12
- 回退路径：[8, 9, 10, 11]（架构设计、API设计、数据模型设计、前端设计）
- 成功路径：[13]（设计修改）
- 最大迭代次数：3

### 测试评审回环（test）
- 评审步骤：步骤17
- 回退路径：[16]（测试用例设计）
- 成功路径：[18]（测试确认）
- 最大迭代次数：3

### 代码评审回环（code）
- 评审步骤：步骤21
- 回退路径：[22]（代码修改）
- 成功路径：[23]（测试执行）
- 最大迭代次数：3

## 使用示例

### 输入 - 评审失败
```json
{
  "project_id": "proj-001",
  "current_loop": "requirements",
  "loop_iteration": 1,
  "max_iteration": 3,
  "review_result": "fail",
  "fallback_path": [3],
  "success_path": [5]
}
```

### 输出 - 回退执行
```json
{
  "status": "success",
  "action": "fallback",
  "next_step": 3,
  "loop_state": {
    "current_loop": "requirements",
    "loop_iteration": 2,
    "max_loop_iteration": 3,
    "fallback_path": [3],
    "success_path": [5],
    "last_review_result": "fail",
    "next_review_step": 4
  },
  "message": "需求评审失败，回退到步骤3（特性需求分析），迭代次数2/3"
}
```

### 输入 - 评审通过
```json
{
  "project_id": "proj-001",
  "current_loop": "requirements",
  "loop_iteration": 1,
  "max_iteration": 3,
  "review_result": "pass",
  "fallback_path": [3],
  "success_path": [5]
}
```

### 输出 - 成功跳转
```json
{
  "status": "success",
  "action": "success",
  "next_step": 5,
  "loop_state": {
    "current_loop": "requirements",
    "loop_iteration": 1,
    "max_loop_iteration": 3,
    "fallback_path": [3],
    "success_path": [5],
    "last_review_result": "pass",
    "next_review_step": null
  },
  "message": "需求评审通过，跳转到步骤5（需求确认）"
}
```

### 输入 - 达到迭代上限
```json
{
  "project_id": "proj-001",
  "current_loop": "requirements",
  "loop_iteration": 3,
  "max_iteration": 3,
  "review_result": "fail",
  "fallback_path": [3],
  "success_path": [5]
}
```

### 输出 - 升级通知
```json
{
  "status": "escalation",
  "action": "escalate",
  "next_step": null,
  "loop_state": {
    "current_loop": "requirements",
    "loop_iteration": 3,
    "max_loop_iteration": 3,
    "fallback_path": [3],
    "success_path": [5],
    "last_review_result": "fail",
    "next_review_step": 4
  },
  "message": "需求评审迭代次数已达上限（3/3），请用户决策"
}
```

## 最佳实践

- 每次评审后必须调用此Skill更新回环状态
- 严格遵守最大迭代次数限制，避免无限循环
- 回退路径应选择能够修复问题的最小步骤集
- 升级通知应包含完整的回环历史信息

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 无效的回环名称 | 返回错误状态，提示有效的回环名称列表 |
| 迭代次数超过上限 | 返回升级状态，提示用户决策 |
| 回退路径为空 | 使用默认回退路径 |
| 成功路径为空 | 使用默认成功路径 |