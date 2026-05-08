---
name: "project-planner"
description: "项目规划，将需求拆解为具体的任务和里程碑。触发场景：'规划项目'、'任务拆解'。"
---

# 项目规划 Skill

## 功能描述

根据需求规约，将项目拆解为具体的任务和里程碑，制定合理的项目计划，并生成项目计划文档和各特性的任务文档。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| requirements_doc | string | 需求规约文档路径，默认为 `design/project_overview/requirements_spec.md` | 否 |
| features_dir | string | 特性目录路径，默认为 `design/features/` | 否 |
| team_size | number | 团队规模 | 否 |
| deadline | string | 截止日期 | 否 |

## 输出格式

### 主要输出：Markdown文档
- 项目计划文档：`design/project_overview/project_plan.md`
- 特性任务文档：为每个特性在 `design/features/{feature}/tasks/` 目录下生成任务文档

### 辅助输出：JSON状态
```json
{
  "status": "success",
  "output_files": [
    "design/project_overview/project_plan.md",
    "design/features/feature1/tasks/task1.md",
    "design/features/feature1/tasks/task2.md"
  ],
  "message": "项目规划完成，文档已保存"
}
```

## 执行流程

1. 读取需求规约文档和特性需求文档
2. 识别关键功能模块
3. 拆解为具体任务
4. 确定任务依赖关系
5. 分配任务给合适的Agent
6. 制定里程碑和时间线
7. 生成项目计划文档 `design/project_overview/project_plan.md`
8. 为每个特性在 `design/features/{feature}/tasks/` 目录下生成任务文档
9. 返回成功状态和输出文件路径

## 文档格式规范

### 项目计划文档格式 (`design/project_overview/project_plan.md`)
```markdown
# 项目计划

## 1. 里程碑
| 里程碑 | 时间 | 交付物 |
|--------|------|--------|
| M1: 设计完成 | 2026-05-15 | 设计文档 |
| M2: 开发完成 | 2026-06-15 | 代码 |
| M3: 上线 | 2026-06-30 | 上线 |

## 2. 任务清单
- T1: 需求分析 (Team Lead)
- T2: 架构设计 (Architect)
- ...

## 3. 依赖关系
- T2 依赖 T1
- T3 依赖 T2

## 4. 资源分配
- Team Lead: 1人
- Architect: 1人
- ...
```

### 特性任务文档格式 (`design/features/{feature}/tasks/{task}.md`)
```markdown
# 任务：{任务名称}

## 1. 基本信息
- 任务ID：{task-id}
- 所属特性：{feature-id}
- 优先级：高/中/低
- 预估工时：x小时
- 负责人：{Agent名称}

## 2. 任务描述
- 详细描述：xxx
- 验收标准：xxx

## 3. 依赖关系
- 前置任务：xxx
- 后置任务：xxx

## 4. 输入文档
- 文档1：xxx
- 文档2：xxx

## 5. 输出文档
- 文档1：xxx
- 文档2：xxx
```

## 使用示例

### 输入
```json
{
  "requirements_doc": "design/project_overview/requirements_spec.md",
  "features_dir": "design/features/",
  "team_size": 5,
  "deadline": "2026-06-30"
}
```

### 输出（项目计划文档内容）
```markdown
# 电商网站项目计划

## 1. 里程碑
| 里程碑 | 时间 | 交付物 |
|--------|------|--------|
| M1: 需求分析与设计 | 2026-05-15 | 设计文档 |
| M2: 核心功能开发 | 2026-06-15 | 代码 |
| M3: 测试与上线 | 2026-06-30 | 上线 |

## 2. 任务清单
- T001: 需求分析 (Team Lead)
- T002: 架构设计 (Architect)
- T003: 数据模型设计 (DBA)
- T004: API设计 (Architect)

## 3. 依赖关系
- T002 依赖 T001
- T003 依赖 T002
- T004 依赖 T003

## 4. 资源分配
- Team Lead: 1人
- Architect: 1人
- DBA: 1人
- Backend Dev: 2人
- Frontend Dev: 2人
- QA: 1人
- DevOps: 1人
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