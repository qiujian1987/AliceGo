# 示例项目 01：简单待办事项应用

## 项目概述

这是一个基于 AliceGo 框架开发的简单待办事项应用示例，用于演示多 Agent 协同开发的完整流程。

---

## 项目信息

| 项目属性 | 值 |
|---------|-----|
| 项目名称 | Simple Todo |
| 项目类型 | Web 应用 |
| 技术栈 | React + Node.js + PostgreSQL |
| 复杂度 | 简单 |
| 功能数量 | 4 个特性 |

---

## 目录结构

```
01_simple_todo/
├── README.md                    # 本文档
├── requirements_spec.md          # 需求规约
├── backend_architecture.md       # 后端架构设计
├── frontend_architecture.md      # 前端架构设计
├── data_model.md                # 数据模型设计
├── api_contracts.md              # API 合同
├── features/                     # 特性目录
│   ├── feature-001_user_auth/  # 用户认证特性
│   │   ├── requirements.md
│   │   ├── api.md
│   │   ├── test-cases.md
│   │   └── tasks/
│   ├── feature-002_task_crud/   # 任务管理特性
│   │   ├── requirements.md
│   │   ├── api.md
│   │   ├── test-cases.md
│   │   └── tasks/
│   ├── feature-003_categories/  # 分类管理特性
│   │   ├── requirements.md
│   │   ├── api.md
│   │   ├── test-cases.md
│   │   └── tasks/
│   └── feature-004_export/      # 数据导出特性
│       ├── requirements.md
│       ├── api.md
│       ├── test-cases.md
│       └── tasks/
└── project_plan.md               # 项目计划
```

---

## 特性列表

| 特性ID | 特性名称 | 优先级 | 负责人 |
|--------|---------|--------|--------|
| feature-001 | 用户认证 | 高 | @backend-dev |
| feature-002 | 任务管理 | 高 | @backend-dev |
| feature-003 | 分类管理 | 中 | @backend-dev |
| feature-004 | 数据导出 | 低 | @frontend-dev |

---

## 开发流程

### Phase 1：项目初始化与需求分析

1. ✅ 需求规约已完成 → `requirements_spec.md`
2. ✅ 特性需求分析已完成 → `features/*/requirements.md`

### Phase 2：系统设计

3. ✅ 后端架构设计已完成 → `backend_architecture.md`
4. ✅ 前端架构设计已完成 → `frontend_architecture.md`
5. ✅ 数据模型设计已完成 → `data_model.md`
6. ✅ API 设计已完成 → `api_contracts.md`

### Phase 3：任务规划与开发

7. ⏳ 任务拆解 → `project_plan.md`
8. ⏳ 测试用例设计 → `features/*/test-cases.md`
9. ⏳ TDD 开发执行
10. ⏳ 代码评审

### Phase 4：验收与交付

11. ⏳ 测试执行
12. ⏳ 最终验收
13. ⏳ 部署上线

---

## 如何使用此示例

### 1. 学习流程

此示例展示了完整的开发流程：

1. **需求分析**：学习如何将用户需求转化为结构化文档
2. **架构设计**：学习如何设计系统架构
3. **任务拆解**：学习如何将大型项目拆分为可执行任务
4. **TDD 开发**：学习测试驱动开发方法

### 2. 参考文档

每个阶段都提供了详细的输出文档，可以作为开发参考：

- **需求文档**：`requirements_spec.md`
- **架构文档**：`backend_architecture.md`、`frontend_architecture.md`
- **数据模型**：`data_model.md`
- **API 合同**：`api_contracts.md`

### 3. 实际应用

将 AliceGo 应用到实际项目时，可以：

1. 参考此示例的结构组织项目
2. 使用类似的文档模板
3. 遵循相同的命名规范
4. 参考特性划分方式

---

## 技术细节

### 后端技术栈

- **运行时**：Node.js 18+
- **框架**：Express.js
- **数据库**：PostgreSQL 14+
- **ORM**：Prisma
- **认证**：JWT

### 前端技术栈

- **框架**：React 18+
- **构建工具**：Vite
- **样式**：Tailwind CSS
- **状态管理**：Zustand
- **HTTP 客户端**：Axios

---

## 扩展此示例

### 添加新特性

1. 在 `features/` 目录下创建新特性文件夹
2. 编写 `requirements.md`、`api.md`、`test-cases.md`
3. 在 `project_plan.md` 中添加任务
4. 使用 TDD 方法实现功能

### 修改现有特性

1. 更新 `requirements.md`
2. 更新 `api.md`
3. 更新 `test-cases.md`
4. 重构代码并通过测试

---

## 相关资源

- [AliceGo 主文档](../README.md)
- [Agent 知识地图](../AGENTS.md)
- [Skill 调用规范](../docs/reference/skill-invocation.md)
- [TDD 开发规范](../README.md#tdd-开发规范)

---

## 版本历史

| 版本 | 日期 | 修改内容 |
|------|------|---------|
| v1.0 | 2026-05-17 | 初始版本，包含完整文档结构 |

---

*最后更新：2026-05-17*
