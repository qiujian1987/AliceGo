---
name: "task-decomposition"
description: "任务拆解Skill，将项目需求拆解为可执行的任务。触发场景：'任务拆解'、'分解任务'、'生成项目计划'、'规划任务'。输入参数：features(必需)，team_size(可选)。输出：design/project_overview/project_plan.md 和 design/features/*/tasks/*.md。"
---

# 任务拆解 Skill

## 功能描述

将项目需求拆解为可执行的任务，包括项目级任务和特性级任务，支持多Agent并行开发。

## 调用规范（强制要求）

### 调用链路
```
SOLO Coder → 调用 @team-lead Agent → @team-lead Agent调用此Skill
```

### 约束规则
- **SOLO Coder**：必须先调用@team-lead Agent，**禁止**直接调用此Skill
- **@team-lead Agent**：负责调用此Skill执行任务拆解流程
- **Skill执行者**：@team-lead Agent

### 错误示例
```
❌ SOLO Coder直接调用task-decomposition Skill
✅ SOLO Coder调用@team-lead Agent → @team-lead Agent调用task-decomposition Skill
```

## WHEN

当需要进行任务拆解时，SOLO Coder必须先调用@team-lead Agent，再由@team-lead Agent调用此Skill。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| features | array | 特性ID列表 | 是 |
| team_size | number | 团队规模（默认3） | 否 |

## Workflow

按照以下步骤执行：

### Step 1: 收集信息

- **列出所有特性**：使用 `file-operation.listDirectory()` 读取 `design/features/` 目录
- **读取需求文档**：
  - `design/project_overview/requirements_spec.md`
  - 所有特性需求文档 `design/features/*/requirements.md`
- **读取架构文档**：
  - `design/project_overview/backend_architecture.md`
  - `design/project_overview/data_model.md`
  - `design/project_overview/api_contracts.md`

### Step 2: 生成项目级任务

基于架构文档和需求文档，生成公共任务（不属于特定特性的任务）：

```markdown
# 任务详情

## 基本信息
- 任务ID: T{编号}
- 任务名称: {名称}
- 所属特性: 公共任务
- 负责人: {Agent类型}
- 优先级: {high/medium/low}
- 预计工时: {n} 小时
- 任务状态: 待执行
- 进度: 0%

## 任务描述
{描述}

## 依赖关系
- 依赖任务: {如有}
- 依赖任务详情: {如有}

## 验收标准
- 标准1: ...
- 标准2: ...

## 相关文档
- 文档1: ...

## 变更记录
| 日期 | 变更内容 | 变更人 |
|------|----------|--------|
| {日期} | 任务创建 | System |
```

### Step 3: 生成特性级任务

对每个特性执行以下操作：

#### 3.1 读取特性文档
- 使用 `file-operation.readFile()` 读取：
  - `design/features/{feature-id}/requirements.md`
  - `design/features/{feature-id}/api.md`（如果存在）

#### 3.2 创建特性任务目录
- **使用 `file-operation.createDirectory()`** 创建：
  - `design/features/{feature-id}/tasks/`

#### 3.3 生成特性任务
基于特性需求，生成该特性的开发任务：

```markdown
# 任务详情

## 基本信息
- 任务ID: T{编号}
- 任务名称: {名称}
- 所属特性: {feature-id}
- 负责人: {Agent类型}
- 优先级: {high/medium/low}
- 预计工时: {n} 小时
- 任务状态: 待执行
- 进度: 0%

## 任务描述
{描述}

## 依赖关系
- 依赖任务: {如有}
- 依赖任务详情: {如有}

## 验收标准
- 标准1: ...
- 标准2: ...

## 相关文档
- 需求文档: design/features/{feature-id}/requirements.md
- API文档: design/features/{feature-id}/api.md

## 变更记录
| 日期 | 变更内容 | 变更人 |
|------|----------|--------|
| {日期} | 任务创建 | System |
```

#### 3.4 保存特性任务
- **使用 `file-operation.createFile()`** 保存任务文件
- 文件路径：`design/features/{feature-id}/tasks/{task-id}_{task-name}.md`

### Step 4: 生成项目计划总览

创建 `design/project_overview/project_plan.md`：

```markdown
# 项目计划

## 时间线
{开始日期} 至 {截止日期}

## 里程碑
### 1. {里程碑名称}
- 日期: {日期}
- 任务: {任务列表}

## 任务列表
### 项目级任务
| 任务ID | 任务名称 | 负责人 | 优先级 | 预计工时 |
|--------|----------|--------|--------|----------|
| T001 | {名称} | {Agent} | {优先级} | {工时} |
...

### 特性级任务
| 任务ID | 所属特性 | 任务名称 | 负责人 | 优先级 |
|--------|----------|----------|--------|--------|
| T010 | feature-001 | {名称} | Backend Dev | high |
...

## 任务依赖关系
{T001} → {T002} → {T003}
```

### Step 5: 完整性验证

- **检查项目级任务目录**：确认 `design/project_overview/tasks/` 存在且包含任务文件
- **检查特性级任务目录**：
  - 确认**每个特性目录下都存在** `tasks/` 子目录
  - 确认**每个特性的 `tasks/` 目录下至少有一个任务文件**
- **更新检查清单**：

| 检查项 | 状态 |
|--------|------|
| project_plan.md 存在且内容不为空 | ✅ |
| design/project_overview/tasks/ 目录存在且包含任务文件 | ✅ |
| 每个特性目录下都存在 tasks/ 子目录 | ✅ |
| 每个特性的 tasks/ 目录下至少有一个任务文件 | ✅ |

### Step 6: 保存项目计划

- **使用 `file-operation.createFile()`** 保存：
  - `design/project_overview/project_plan.md`
  - `design/project_overview/tasks/{task-id}_{task-name}.md`（每个项目级任务）
  - `design/features/{feature-id}/tasks/{task-id}_{task-name}.md`（每个特性级任务）

### Step 7: 更新记忆系统

使用 `mcp_Memory` 记录：
- 任务总数
- 项目级任务数量
- 特性级任务数量（按特性分组）
- 任务分配情况

### Step 8: 完成

返回完成报告：

```
[任务拆解完成]
完成时间：{timestamp}
特性数量：{n}
任务总数：{n}
- 项目级任务：{n}
- 特性级任务：{n}
文档列表：
- design/project_overview/project_plan.md
- design/project_overview/tasks/
- design/features/{feature-001}/tasks/
- design/features/{feature-002}/tasks/
下一步：进入测试用例设计阶段
```

## 输出

**Files created/modified:**
- `design/project_overview/project_plan.md` - 项目总体计划
- `design/project_overview/tasks/{task-id}_{task-name}.md` - 项目级任务文件
- `design/features/{feature-id}/tasks/{task-id}_{task-name}.md` - 特性级任务文件

**Status communication:**
- `SUCCESS`: 所有任务生成完成
- `WARN`: 部分检查项未通过
- `ERROR`: 发生错误

## 重要规则

### 文件操作要求
- **必须使用 `file-operation` Skill** 创建所有任务文件
- **禁止**使用文字描述"假装"创建文件
- 每次创建文件后，必须验证文件是否存在且内容完整

### 完整性要求
- **必须为每个特性都生成任务**
- **必须确保每个特性目录下都有 tasks/ 子目录**
- 完成报告必须包含完整性检查结果

### 任务分配原则
- 设计阶段任务 → Architect / Frontend Designer / DBA
- 开发阶段任务 → Backend Dev / Frontend Dev
- 测试阶段任务 → QA
- 部署阶段任务 → DevOps
