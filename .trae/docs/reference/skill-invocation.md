# Skill 调用规范

## 概述

本文档定义了Agent调用Skill的标准方式、输入输出格式和结果处理流程。

## Skill 调用方式

### 1. 直接调用（推荐）

Agent在需要执行特定任务时，直接调用对应的Skill。

```
[调用Skill]
- Skill名称: requirement-analyzer
- 参数:
  - user_input: "用户需求描述"
  - output_path: "design/project_overview/requirements_spec.md"
```

### 2. Skill 标准输入格式

所有Skill调用应使用统一的JSON输入格式：

```json
{
  "skill": "skill-name",
  "params": {
    "param1": "value1",
    "param2": "value2"
  },
  "context": {
    "project_dir": "/path/to/project",
    "feature_id": "feature-001",
    "caller_agent": "team-lead"
  }
}
```

### 3. Skill 标准输出格式

所有Skill应返回统一的JSON输出格式：

```json
{
  "status": "success|error",
  "output_files": [
    "/path/to/file1.md",
    "/path/to/file2.json"
  ],
  "data": {
    // Skill特定的返回数据（可选）
  },
  "message": "操作完成的描述信息"
}
```

## Skill 执行流程

1. **Agent发起调用**：Agent按照标准格式调用Skill
2. **Skill执行**：Skill读取输入参数，执行任务
3. **生成输出文件**：Skill优先将结果保存为文件
4. **返回状态**：Skill返回执行状态和输出文件列表
5. **Agent处理结果**：Agent读取输出文件，继续后续工作

## Skill 结果处理

### 1. 成功处理

当Skill返回 `status: "success"` 时：
- Agent读取 `output_files` 中列出的文件
- 继续执行后续流程
- 如果有 `data` 字段，可根据需要使用

### 2. 错误处理

当Skill返回 `status: "error"` 时：
- Agent记录错误信息
- 尝试重试（最多3次）
- 如果重试失败，升级问题给Team Lead

## Skill 脚本实现规范

### 脚本位置

Skill的可执行脚本应放置在：
```
.trae/skills/{skill-name}/scripts/
```

### 脚本命名规范

- 主脚本：`main.js` 或 `{skill-name}.js`
- 工具脚本：`utils.js`、`helpers.js` 等

### 脚本接口规范

每个Skill脚本应提供以下接口：

```javascript
// 入口函数
async function execute(params, context) {
  // 执行Skill逻辑
  // 返回标准格式结果
}

module.exports = { execute };
```

## Skill 目录结构规范

```
.trae/skills/{skill-name}/
├── SKILL.md          # Skill定义文档
├── scripts/
│   ├── main.js       # 主执行脚本
│   └── utils.js      # 工具脚本（可选）
├── references/       # 参考文档（可选）
└── examples/         # 示例文件（可选）
```

## Skill 调用示例

### 示例1：调用 requirement-analyzer

```javascript
// Agent中调用
const result = await skillManager.execute('requirement-analyzer', {
  user_input: '我需要一个电商网站',
  output_path: 'design/project_overview/requirements_spec.md'
});

// 处理结果
if (result.status === 'success') {
  console.log('文档已生成:', result.output_files);
  // 继续后续流程
}
```

### 示例2：调用 project-planner

```javascript
const result = await skillManager.execute('project-planner', {
  requirements_doc: 'design/project_overview/requirements_spec.md',
  features_dir: 'design/features/',
  team_size: 5,
  deadline: '2026-06-30'
});
```

## 常见Skill列表

| Skill名称 | 功能描述 | 主要输出文件 |
|-----------|---------|-------------|
| requirement-analyzer | 需求分析 | design/project_overview/requirements_spec.md |
| project-planner | 项目规划 | design/project_overview/project_plan.md |
| architecture-planner | 架构规划 | design/project_overview/backend_architecture.md |
| database-designer | 数据库设计 | design/project_overview/data_model.md |
| api-designer | API设计 | design/project_overview/api_contracts.md |
| code-generator | 代码生成 | src/server/、src/client/ |
| test-generator | 测试生成 | tests/ |
| code-review | 代码审查 | 评审报告 |
