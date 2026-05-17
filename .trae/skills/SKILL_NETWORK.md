# Skill 协作网络

## 概述

本文档定义了 AliceGo 项目中各 Skill 之间的调用关系和协作模式，形成完整的 Skill 协作网络。

---

## 1. Skill 调用关系图

```
用户需求
   ↓
requirement-analyzer
   ↓
feature-analyst (可选)
   ↓
architecture-planner ←→ database-designer
   ↓
api-designer
   ↓
task-decomposition
   ↓
test-case-design
   ↓
code-generator ←→ code-review
   ↓
test-executor
   ↓
devops-automation
```

---

## 2. Skill 调用序列

### 2.1 完整项目流程

| 阶段 | Skill | 调用者 | 被调用 Skill | 说明 |
|------|-------|-------|-------------|------|
| 需求分析 | requirement-analyzer | Agent | 无 | 分析用户需求 |
| 特性分析 | feature-analyst | SOLO Coder | requirement-analyzer | 拆分为特性 |
| 后端架构 | architecture-planner | Agent | requirement-analyzer | 设计后端架构 |
| 数据模型 | database-designer | Agent | architecture-planner | 设计数据库 |
| API 设计 | api-designer | Agent | architecture-planner, database-designer | 设计 API |
| 任务拆解 | task-decomposition | SOLO Coder | api-designer | 拆解任务 |
| 测试用例 | test-case-design | Agent | task-decomposition | 设计测试 |
| 代码生成 | code-generator | Agent | test-case-design | 生成代码 |
| 代码评审 | code-review | Agent | code-generator | 评审代码 |
| 测试执行 | test-executor | Agent | test-case-design | 执行测试 |
| 部署 | devops-automation | Agent | 无 | 部署上线 |

### 2.2 详细调用关系

#### requirement-analyzer
```
被调用者：无
调用者：feature-analyst, architecture-planner
调用时机：分析用户需求时
输入：用户需求描述
输出：requirements_spec.md
```

#### feature-analyst
```
被调用者：requirement-analyzer
调用者：SOLO Coder
调用时机：需要拆分特性时
输入：requirements_spec.md
输出：features/*/requirements.md
```

#### architecture-planner
```
被调用者：requirement-analyzer, feature-analyst
调用者：database-designer, api-designer
调用时机：需要设计架构时
输入：requirements_spec.md
输出：backend_architecture.md
```

#### database-designer
```
被调用者：architecture-planner
调用者：api-designer
调用时机：需要设计数据库时
输入：backend_architecture.md
输出：data_model.md, schema.sql
```

#### api-designer
```
被调用者：architecture-planner, database-designer
调用者：task-decomposition
调用时机：需要设计 API 时
输入：backend_architecture.md, data_model.md
输出：api_contracts.md, features/*/api.md
```

#### task-decomposition
```
被调用者：api-designer
调用者：test-case-design, SOLO Coder
调用时机：需要拆解任务时
输入：features/*/requirements.md, features/*/api.md
输出：project_plan.md, features/*/tasks/*.md
```

#### test-case-design
```
被调用者：task-decomposition
调用者：code-generator, test-executor
调用时机：需要设计测试时
输入：features/*/requirements.md, features/*/api.md
输出：features/*/test-cases.md
```

#### code-generator
```
被调用者：test-case-design
调用者：code-review
调用时机：需要生成代码时
输入：features/*/tasks/*.md, features/*/test-cases.md
输出：src/server/*.ts, src/client/*.tsx
```

#### code-review
```
被调用者：code-generator
调用者：SOLO Coder
调用时机：需要评审代码时
输入：src/server/*.ts, src/client/*.tsx
输出：reviews/code-review-*.md
```

#### test-executor
```
被调用者：test-case-design
调用者：SOLO Coder
调用时机：需要执行测试时
输入：features/*/test-cases.md, src/server/*.ts
输出：reports/test-report-*.md
```

#### devops-automation
```
被调用者：无
调用者：SOLO Coder
调用时机：需要部署时
输入：src/server/*.ts, infra/*.yaml
输出：部署配置和记录
```

---

## 3. Skill 协作模式

### 3.1 线性协作模式

适用于顺序依赖的场景：

```
requirement-analyzer → architecture-planner → database-designer → api-designer
```

### 3.2 并行协作模式

适用于独立可并行的场景：

```
                    → code-generator (backend-dev)
code-generator ────
                    → code-generator (frontend-dev)
```

### 3.3 循环协作模式

适用于需要迭代优化的场景：

```
code-generator → code-review → code-generator (修复)
```

### 3.4 星形协作模式

适用于中心协调的场景：

```
SOLO Coder (中心)
    ↓
requirement-analyzer
    ↓
feature-analyst
    ↓
architecture-planner ──── → database-designer
    ↓
api-designer ──── → task-decomposition
    ↓
test-case-design ──── → code-generator ──── → code-review
    ↓
test-executor
```

---

## 4. Skill 依赖关系

### 4.1 强依赖关系

必须按顺序执行：

```
requirement-analyzer → feature-analyst
requirement-analyzer → architecture-planner
architecture-planner → database-designer
database-designer → api-designer
api-designer → task-decomposition
task-decomposition → test-case-design
test-case-design → code-generator
code-generator → code-review
```

### 4.2 弱依赖关系

可以并行或可选：

```
architecture-planner ← → frontend-design (可并行)
test-case-design ← → code-generator (可并行)
code-review ← → test-executor (可并行)
```

---

## 5. Skill 协作示例

### 5.1 简单项目

**场景**：开发一个简单的待办事项应用

**Skill 调用序列**：
```
requirement-analyzer (1h)
  ↓
architecture-planner (1h)
  ↓
database-designer (0.5h)
  ↓
api-designer (1h)
  ↓
task-decomposition (1h)
  ↓
test-case-design + code-generator (3h, 并行)
  ↓
code-review (1h)
  ↓
test-executor (1h)
```

**总时间**：约 9.5 小时

### 5.2 中等复杂度项目

**场景**：开发一个电商系统

**Skill 调用序列**：
```
requirement-analyzer (2h)
  ↓
feature-analyst (2h)  [用户模块、商品模块、订单模块]
  ↓
architecture-planner (2h)
  ↓
database-designer (2h)
  ↓
api-designer (3h)  [多个模块并行设计]
  ↓
task-decomposition (2h)
  ↓
test-case-design (4h)  [多个特性并行]
  ↓
code-generator (16h)  [多个开发者并行]
  ↓
code-review (4h)  [多个模块并行评审]
  ↓
test-executor (4h)  [多个模块并行测试]
```

**总时间**：约 41 小时

---

## 6. 优化协作效率

### 6.1 并行化策略

1. **识别独立任务**：找出可以并行执行的任务
2. **分配给多个 Agent**：将独立任务分配给不同的 Agent
3. **协调依赖关系**：通过 HANDOFF 规范传递上下文

### 6.2 缓存策略

1. **文档复用**：已完成的文档可以被多个 Skill 复用
2. **中间结果缓存**：缓存中间计算结果避免重复计算

### 6.3 错误恢复

1. **检查点机制**：在关键步骤保存检查点
2. **回滚策略**：失败时回滚到上一个检查点
3. **重试机制**：自动重试失败的任务

---

## 7. 常见问题

### Q1: Skill 之间如何传递上下文？

**答**：通过标准的 HANDOFF 格式，传递已完成的文档路径和状态。

### Q2: 如何避免 Skill 调用冲突？

**答**：遵循 Skill 调用序列，确保依赖关系正确。

### Q3: 某个 Skill 失败怎么办？

**答**：
1. 检查输入文档是否完整
2. 尝试重试（最多 3 次）
3. 如果仍失败，回滚到上一个检查点
4. 升级问题给 Team Lead

### Q4: 如何优化 Skill 调用效率？

**答**：
1. 识别可并行的任务
2. 使用并行协作模式
3. 减少不必要的依赖
4. 优化文档格式

---

## 8. 下一步

了解 Skill 协作网络后，你可以：

1. [查看 Skill 列表](../skills/)
2. [学习 Skill 调用规范](../docs/reference/skill-invocation.md)
3. [参考示例项目](../examples/)
4. [配置 SOLO Agent](../docs/getting-started/solo-agent-config.md)

---

*最后更新：2026-05-17*
