# TRAE Harness 工程全面优化计划 v2.0

## 任务目标

全面审视 AliceGo 项目，结合 TRAE IDE 运行机制和业界 harness 工程最佳实践，识别优化点，实现企业级 B 端系统多 Agent 协同交付。

---

## 第一阶段：信息收集与现状分析 ✅

### 1.1 TRAE IDE 运行机制研究 ✅

#### 关键发现

**1. Skill 按需加载机制**
```
智能体不会在任务开始时一次性读取所有技能的完整内容。
在执行任务前，智能体会先扫描所有技能的简要描述，
仅当判断当前任务与某个技能高度相关时，才会加载该技能的详细内容。
```

**2. Agent = PE + Tools 公式**
```
Agent = Prompt Engineering (上下文、目标、约束) + Tools (执行能力)
```

**3. Rules 全量加载机制**
```
规则采用全量加载机制，一旦开启对话，所有规则都会被注入并持续占用上下文窗口。
建议 Rules 精简但必须要有。
```

**4. SOLO Agent 主控机制**
```
- Plan 模式：适用于中小型功能开发和模块级重构
- Spec 模式：适用于复杂的系统级任务
- 支持调用自定义 Agent
```

**5. 渐进式披露原则**
```
最佳实践：
- Agent 只保留角色定义（≤ 50 行）
- 工作流程封装在 Skills 中
- Rules 精简但必须要有（≤ 1000 字符）
```

### 1.2 业界 Harness 工程最佳实践 ✅

#### 关键发现

**1. Harness Engineering 定义**
```
设计约束、工具、反馈循环、文档和验证系统。
引导 AI Agent 产生可靠、可维护、可扩展的软件输出。
人类定义意图和边界，Agent 在边界内执行。
```

**2. Agent Loop 核心模式**
```
PERCEIVE → REASON → ACT → EVALUATE → REPEAT
```

**3. 多 Agent 协作模式**
```
- 使用 Supervisor Agent 分解任务
- Delegates each sub-task to a worker agent with a specialized prompt
- Aggregates worker outputs into a final response
```

**4. 验证与防护**
```
- 结合确定性工具（linter、type checker、unit test generator）
- AI 驱动的验证（agent reviewing other agents' code）
- 持久化层：Progress files、git checkpoints、session serialization
```

### 1.3 现有项目文件梳理 ✅

#### Agent 文件（13个）
- architect.md, backend-dev.md, code-reviewer.md, dba.md
- design-reviewer.md, devops.md, feature-analyst.md
- frontend-designer.md, frontend-dev.md, qa.md
- req-reviewer.md, team-lead.md, test-reviewer.md

#### Skill 文件（19个）
- api-designer, architecture-planner, code-generator, code-review
- database-designer, dependency-manager, devops-automation, file-operation
- find-skills, frontend-design, project-initialization, project-planner
- requirement-analyzer, sql-optimizer, task-decomposition, test-case-design
- test-executor, test-generator, test-review

#### Rules 文件（3个核心文件）
- 01_security-constraints.md（安全约束）
- 02_standards.md（标准规范）
- 06_workflow.md（流程调度）

#### 文档文件
- README.md ✅
- AGENTS.md ✅
- docs/ (11个文档)

---

## 第二阶段：问题分析与优先级划分

### 2.1 Agent 层问题

#### 问题 1：Agent 职责边界需要更清晰 ⚠️
- **现状**：Architect Agent 既负责后端架构又负责 API 设计，但职责说明可以更明确
- **问题**：可能导致协作时边界模糊
- **影响**：中

#### 问题 2：缺少 HANDOFF 规范 ⚠️
- **现状**：没有 Agent 间交接的标准化格式
- **问题**：协作效率低，容易丢失上下文
- **依据**：业界最佳实践要求使用 HANDOFF TO、CURRENT STATE 等标准化格式
- **影响**：中

#### 问题 3：缺少快速验证机制 ⚠️
- **现状**：没有内置的完整性检查和验证机制
- **问题**：Agent 可能跳过关键检查步骤
- **依据**：Harness Engineering 强调验证与反馈
- **影响**：高

### 2.2 Skill 层问题

#### 问题 4：Skill 结构标准需要统一 ⚠️
- **现状**：部分 Skill 有 scripts/ 目录（如 api-designer、architecture-planner），部分没有
- **问题**：标准不统一，维护困难
- **影响**：中

#### 问题 5：Skill 触发条件描述不够精确 ⚠️
- **现状**：description 字段比较简单
- **问题**：可能导致误触发或无法正确匹配
- **影响**：低

#### 问题 6：缺少 Skill 间协作关系定义 ⚠️
- **现状**：Skills 之间没有明确的调用关系
- **问题**：无法形成 Skills 协作网络
- **影响**：低

### 2.3 Rules 层问题

#### 问题 7：Rules 文件冗余已清理 ✅
- **现状**：已从 8 个 Rules 文件精简为 3 个核心文件
- **状态**：已完成

#### 问题 8：需要添加验证和防护规则 ⚠️
- **现状**：缺少确定性检查规则
- **问题**：无法自动拦截违规行为
- **依据**：Harness Engineering 强调验证与防护
- **影响**：高

### 2.4 文档层问题

#### 问题 9：docs 目录文档需要整理 ⚠️
- **现状**：有 11 个分散的文档
- **问题**：结构混乱，用户难以快速找到需要的信息
- **影响**：中

#### 问题 10：缺少 MCP Server 配置指南 ⚠️
- **现状**：没有 MCP Server 配置指南
- **问题**：用户不知道如何配置 MCP
- **影响**：高

#### 问题 11：缺少示例项目 ⚠️
- **现状**：只有框架，没有实际示例
- **问题**：用户获取后难以快速理解如何使用
- **影响**：高

---

## 第三阶段：优化方案（按优先级）

### 3.1 高优先级优化（核心功能）

#### 优化 1：创建 SOLO Agent 配置指南 ⭐⭐⭐
**目标**：帮助用户快速配置 SOLO Agent

**方案**：创建 `.trae/docs/solo-agent-config.md`
```
内容包括：
1. SOLO Agent 配置步骤截图说明
2. 如何添加自定义 Agent
3. MCP Server 配置指南
4. 常见配置问题解答
```

**预期效果**：
- 用户可以快速完成 SOLO Agent 配置
- 减少配置错误

#### 优化 2：创建示例项目 ⭐⭐⭐
**目标**：提供实际可运行的示例

**方案**：创建 `.trae/examples/` 目录，包含：
```
examples/
├── 01_simple_todo/     # 简单待办事项应用
├── 02_cms_system/      # 内容管理系统
└── README.md           # 示例项目说明
```

**预期效果**：
- 用户可以通过示例快速理解框架使用
- 提供最佳实践参考

#### 优化 3：添加验证和防护规则 ⭐⭐⭐
**目标**：确保关键检查步骤不被跳过

**方案**：在 Rules 中添加：
```
## 验证检查点
- 步骤完成后必须验证输出文件存在
- 评审前必须检查输入文档完整
- 开发前必须验证测试用例存在
```

**预期效果**：
- 减少因跳过检查导致的问题
- 提高输出质量

#### 优化 4：创建 MCP Server 配置指南 ⭐⭐⭐
**目标**：帮助用户配置 MCP Server

**方案**：创建 `.trae/docs/mcp-server-config.md`
```
内容包括：
1. MCP Server 概述
2. 推荐 MCP Server 列表
3. 配置示例
4. 故障排查指南
```

**预期效果**：
- 用户可以快速配置 MCP
- 提升 Agent 能力

### 3.2 中优先级优化（提升效率）

#### 优化 5：重构 Agent HANDOFF 规范 ⭐⭐
**目标**：标准化 Agent 间交接

**方案**：在 Rules 中添加：

```markdown
## Agent 交接规范

当 Agent A 将任务交接给 Agent B 时，必须提供：

HANDOFF TO: [Agent Name/Role]
CONTEXT: [已完成的工作]
CURRENT STATE: [当前状态]
NEXT STEPS: [下一步操作]
RESOURCES: [相关文件和数据]
```

**预期效果**：
- Agent 间协作更顺畅
- 减少上下文丢失

#### 优化 6：统一 Skill 结构标准 ⭐⭐
**目标**：确保所有 Skill 遵循统一结构

**方案**：为所有 Skill 添加：
```
标准结构：
{t skill-name}/
├── SKILL.md          # 必须
├── scripts/
│   └── main.js      # 可选
├── examples/        # 可选
└── references/      # 可选
```

**预期效果**：
- Skill 结构标准化
- 提升可维护性

#### 优化 7：整理 docs 目录 ⭐⭐
**目标**：使文档结构更清晰

**方案**：
```
docs/
├── getting-started/      # 入门指南
│   ├── solo-agent-config.md
│   └── mcp-server-config.md
├── reference/           # 参考文档
│   ├── skill-invocation.md
│   ├── memory-system.md
│   └── team-lead-scheduler.md
└── guides/             # 指南文档
    ├── design-standards.md
    └── review-feedback.md
```

**预期效果**：
- 文档结构清晰
- 用户易于查找

### 3.3 低优先级优化（锦上添花）

#### 优化 8：优化 Skill 触发条件 ⭐
**目标**：提高 Skill 匹配精度

**方案**：为每个 Skill 的 description 添加：
- 触发关键词
- 使用场景
- 输入参数说明

#### 优化 9：创建 Skill 协作网络 ⭐
**目标**：建立 Skill 间调用关系

**方案**：在 SKILL.md 中添加：
- 依赖的其他 Skills
- 可调用的其他 Skills

---

## 第四阶段：实施计划

### Phase 1：核心功能优化（第 1 周）

| 序号 | 任务 | 产出文件 | 负责人 |
|------|------|---------|--------|
| 1.1 | 创建 SOLO Agent 配置指南 | solo-agent-config.md | - |
| 1.2 | 创建 MCP Server 配置指南 | mcp-server-config.md | - |
| 1.3 | 添加验证和防护规则 | 更新 02_standards.md | - |

### Phase 2：文档整理（第 2 周）

| 序号 | 任务 | 产出文件 | 负责人 |
|------|------|---------|--------|
| 2.1 | 重构 docs 目录结构 | 目录重组 | - |
| 2.2 | 创建 Agent HANDOFF 规范 | 更新 02_standards.md | - |
| 2.3 | 统一 Skill 结构标准 | 更新 SKILL.md | - |

### Phase 3：示例项目（第 3 周）

| 序号 | 任务 | 产出文件 | 负责人 |
|------|------|---------|--------|
| 3.1 | 创建简单待办事项示例 | examples/01_simple_todo/ | - |
| 3.2 | 创建内容管理系统示例 | examples/02_cms_system/ | - |
| 3.3 | 创建示例项目使用指南 | examples/README.md | - |

### Phase 4：细节优化（第 4 周）

| 序号 | 任务 | 产出文件 | 负责人 |
|------|------|---------|--------|
| 4.1 | 优化 Skill 触发条件 | 更新 SKILL.md | - |
| 4.2 | 创建 Skill 协作网络 | Skill 关联图 | - |
| 4.3 | 更新 README.md | 更新 README.md | - |

---

## 执行状态

### ✅ 第一阶段：信息收集
- [x] TRAE IDE 运行机制研究
- [x] 业界 Harness 最佳实践
- [x] 现有项目文件梳理

### ✅ 第二阶段：问题分析
- [x] Agent 层问题（3 个）
- [x] Skill 层问题（3 个）
- [x] Rules 层问题（2 个）
- [x] 文档层问题（3 个）

### ⏳ 第三阶段：优化方案
- [ ] 高优先级优化（4 个）
- [ ] 中优先级优化（3 个）
- [ ] 低优先级优化（2 个）

### ⏳ 第四阶段：实施计划
- [ ] Phase 1：核心功能优化
- [ ] Phase 2：文档整理
- [ ] Phase 3：示例项目
- [ ] Phase 4：细节优化

---

## 附录：TRAE IDE 关键特性

### A.1 Skill 按需加载机制
```
智能体不会在任务开始时一次性读取所有技能的完整内容。
在执行任务前，智能体会先扫描所有技能的简要描述，
仅当判断当前任务与某个技能高度相关时，才会加载该技能的详细内容。
```

### A.2 Agent = PE + Tools
```
Agent = Prompt Engineering (上下文、目标、约束) + Tools (执行能力)
```

### A.3 Rules 全量加载
```
规则采用全量加载机制，一旦开启对话，所有规则都会被注入并持续占用上下文窗口。
建议 Rules 精简但必须要有。
```

### A.4 SOLO Agent 模式
```
- Plan 模式：适用于中小型功能开发和模块级重构
- Spec 模式：适用于复杂的系统级任务（生成 spec.md、tasks.md、checklist.md）
- 支持调用自定义 Agent
```

### A.5 Progressive Disclosure（渐进式披露）
```
最佳实践：
- Agent 只保留角色定义（≤ 50 行）
- 工作流程封装在 Skills 中
- Rules 精简但必须要有（≤ 1000 字符）
```

### A.6 Human-in-the-loop（人在回路）
```
核心原则：
- AI 先规划，人类确认后再执行
- 实时可视化监控
- 随时可干预和纠正
```

---

## 版本历史

| 版本 | 日期 | 修改内容 | 作者 |
|------|------|---------|------|
| v1.0 | 2026-05-09 | 初始版本 | System |
| v2.0 | 2026-05-17 | 全面优化，增加具体实施计划 | System |

---

*最后更新：2026-05-17*
