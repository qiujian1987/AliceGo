---
name: "project-planner"
description: "项目规划，将需求拆解为具体的任务和里程碑。触发场景：'规划项目'、'任务拆解'。"
---

# 项目规划 Skill

## 功能描述

根据需求规约，将项目拆解为具体的任务和里程碑，制定合理的项目计划。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| requirements | object | 需求规约文档 | 是 |
| team_size | number | 团队规模 | 否 |
| deadline | string | 截止日期 | 否 |

## 输出格式

```json
{
  "status": "success",
  "data": {
    "project_plan": {
      "milestones": [
        {
          "name": "...",
          "date": "...",
          "tasks": ["..."]
        }
      ],
      "tasks": [
        {
          "id": "...",
          "name": "...",
          "assignee": "...",
          "priority": "...",
          "estimated_hours": "...",
          "dependencies": ["..."]
        }
      ],
      "timeline": "..."
    }
  },
  "message": "项目规划完成"
}
```

## 执行流程

1. 分析需求规约文档
2. 识别关键功能模块
3. 拆解为具体任务
4. 确定任务依赖关系
5. 分配任务给合适的Agent
6. 制定里程碑和时间线
7. 生成项目计划文档

## 使用示例

### 输入
```json
{
  "requirements": {
    "business_needs": ["创建电商平台"],
    "functional_requirements": ["用户注册登录", "商品浏览搜索", "购物车管理", "在线支付"]
  },
  "team_size": 5,
  "deadline": "2026-06-30"
}
```

### 输出
```json
{
  "status": "success",
  "data": {
    "project_plan": {
      "milestones": [
        {
          "name": "需求分析与设计",
          "date": "2026-05-15",
          "tasks": ["需求分析", "架构设计", "数据模型设计"]
        },
        {
          "name": "核心功能开发",
          "date": "2026-06-15",
          "tasks": ["用户系统", "商品系统", "购物车", "支付系统"]
        },
        {
          "name": "测试与上线",
          "date": "2026-06-30",
          "tasks": ["集成测试", "性能测试", "部署上线"]
        }
      ],
      "tasks": [
        {
          "id": "T001",
          "name": "需求分析",
          "assignee": "Team Lead",
          "priority": "high",
          "estimated_hours": "8",
          "dependencies": []
        },
        {
          "id": "T002",
          "name": "架构设计",
          "assignee": "Architect",
          "priority": "high",
          "estimated_hours": "16",
          "dependencies": ["T001"]
        }
      ],
      "timeline": "2026-05-01 至 2026-06-30"
    }
  },
  "message": "项目规划完成"
}
```

## 最佳实践

- 任务拆解应尽量细致
- 合理估算任务时间
- 考虑任务之间的依赖关系
- 为关键路径留出缓冲时间

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 需求不完整 | 基于现有信息制定计划，标记需要确认的部分 |
| 时间过紧 | 识别关键路径，建议优先级排序 |
| 资源不足 | 调整任务分配，建议增加资源 |