---
name: "requirement-analyzer"
description: "需求分析，将用户需求转换为明确的规约文档。触发场景：'分析需求'、'需求规约'、'生成需求文档'、'编写需求'。输入参数：user_input(必需)，context(可选)，priority(可选)。输出：design/project_overview/requirements_spec.md。"
---

# 需求分析 Skill

## 功能描述

将用户的需求描述转换为结构化的需求规约文档，明确需求边界、功能点和验收标准，并将文档保存到 `design/project_overview/requirements_spec.md`。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| user_input | string | 用户的需求描述 | 是 |
| output_path | string | 输出文件路径，默认为 `design/project_overview/requirements_spec.md` | 否 |
| context | string | 项目背景信息 | 否 |
| priority | string | 优先级（high/medium/low） | 否 |

## 输出格式

### 主要输出：Markdown文档
直接将需求规约文档保存到指定路径 `design/project_overview/requirements_spec.md`

### 辅助输出：JSON状态
```json
{
  "status": "success",
  "output_files": ["design/project_overview/requirements_spec.md"],
  "message": "需求分析完成，文档已保存"
}
```

## 执行流程

1. 分析用户输入的需求描述
2. 提取业务需求和功能需求
3. 识别非功能需求和约束
4. 明确需求范围和边界
5. 制定验收标准
6. 识别潜在风险
7. 按照标准格式生成需求规约Markdown文档
8. 将文档保存到 `design/project_overview/requirements_spec.md`
9. 返回成功状态和输出文件路径

## 文档格式规范

生成的Markdown文档应遵循以下格式：

```markdown
# 项目需求规约

## 1. 项目概述
- 项目名称：xxx
- 项目目标：xxx
- 目标用户：xxx

## 2. 业务需求
- 需求1：xxx
- 需求2：xxx

## 3. 功能需求
- 功能1：xxx
- 功能2：xxx

## 4. 非功能需求
- 性能：xxx
- 安全：xxx
- 可用性：xxx

## 5. 范围
- 包含：xxx
- 不包含：xxx

## 6. 验收标准
- 标准1：xxx
- 标准2：xxx

## 7. 风险
- 风险1：xxx
- 风险2：xxx

## 8. 假设与约束
- 假设：xxx
- 约束：xxx
```

## 使用示例

### 输入
```json
{
  "user_input": "我需要一个电商网站，支持用户注册、商品浏览、购物车和支付功能",
  "context": "这是一个新的电商项目，目标用户是年轻人",
  "priority": "high"
}
```

### 输出（Markdown文档内容）
```markdown
# 电商网站需求规约

## 1. 项目概述
- 项目名称：电商网站
- 项目目标：创建电商平台，吸引年轻用户
- 目标用户：年轻人

## 2. 业务需求
- 创建电商平台
- 吸引年轻用户

## 3. 功能需求
- 用户注册登录
- 商品浏览搜索
- 购物车管理
- 在线支付

## 4. 非功能需求
- 响应速度快
- 界面美观
- 移动端适配

## 5. 范围
包含：电商网站的核心功能
不包含：物流管理

## 6. 验收标准
- 用户能成功注册
- 能正常浏览商品
- 购物车功能正常
- 支付流程顺畅

## 7. 风险
- 支付安全
- 用户体验

## 8. 假设与约束
- 假设：目标用户熟悉移动设备操作
- 约束：需要支持主流浏览器
```

## 最佳实践

- 需求描述应尽可能详细
- 提供足够的项目背景信息
- 明确优先级和截止时间
- 定期与用户确认需求理解

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 需求描述过于模糊 | 提示用户提供更多细节 |
| 缺少必要信息 | 自动补充合理默认值 |
| 需求冲突 | 识别并提示冲突点，需要用户确认 |