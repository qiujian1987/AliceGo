# AliceGo Agent 知识地图

这是 AliceGo 项目的 Agent 知识地图，为所有 AI Agent 提供统一的项目上下文和协作规范。

---

## 第一优先级：对话启动检测流程（SOLO Coder 必须首先执行）

### 启动任何操作前，必须先执行以下检测：

```
1. 检查是否存在状态文件：.trae/memory/project_state.json
2. 如果文件存在 → 进入断点恢复流程
3. 如果文件不存在 → 进入新项目流程
```

### 断点恢复流程
如果检测到状态文件：
```
📊 检测到进行中的项目！

[项目状态]
- 项目：[项目名称]
- 当前：步骤[X]（[步骤名称]）
- 进度：[X]%
- 最后更新：[时间]

💡 请选择：
- /continue - 从断点继续
- /status - 查看完整状态
- /restart [步骤号] - 重新执行某步骤
- /new - 强制开始新项目
```

**重要：显示此状态后，必须等待用户命令，不要自动继续！**

### 新项目流程
如果没有检测到状态文件，显示欢迎信息。

### 增量需求检测流程（强制执行）

**在任何需求输入时（包括小需求），必须先执行以下检测：**

```
1. 这个需求是"新项目"还是"增量需求"？
2. 如果是增量需求，是否遵循完整流程？
```

**增量需求定义**：
- 在已有项目中新增功能
- 修改现有功能
- 优化现有实现
- Bug修复

### Bug修复专项流程（强制执行）

**Bug修复必须遵循以下流程（包含回归测试）**：

| 步骤 | 阶段 | 流程 | 说明 |
|------|------|------|------|
| 1 | Bug分析 | @qa | 分析Bug根因，确定影响范围 |
| 2 | 影响分析 | @team-lead | 确定需要回归测试的功能模块 |
| 3 | 用例设计 | @qa + test-case-design | 设计Bug修复用例 + 回归测试用例 |
| 4 | 用例评审 | @test-reviewer | 评审测试用例 |
| 5 | 用例确认 | SOLO Coder + 用户 | 用户确认测试用例 |
| 6 | Bug修复开发 | @backend-dev + @frontend-dev | 修复Bug（TDD模式） |
| 7 | 代码评审 | @code-reviewer | 评审修复代码 |
| 8 | Bug用例测试 | @qa | 执行Bug修复用例，验证修复 |
| 9 | 回归测试 | @qa | 执行回归测试用例，确保不影响现有功能 |
| 10 | 测试报告 | @qa | 生成测试报告 |
| 11 | 用户验收 | SOLO Coder + 用户 | 用户验收修复 |
| 12 | 代码提交 | @backend-dev + @frontend-dev | 提交修复代码 |
| 13 | 状态保存 | SOLO Coder | 保存项目状态 |

**Bug修复的特殊要求**：

| 要求 | 说明 |
|------|------|
| **回归测试** | 必须对受影响的功能模块执行回归测试 |
| **影响分析** | 必须确定Bug修复可能影响的功能范围 |
| **用例覆盖** | Bug修复用例 + 回归测试用例都必须完整 |
| **测试报告** | 必须包含Bug修复验证和回归测试结果 |
| **通过标准** | Bug修复用例通过 AND 回归测试用例全部通过 |

**Bug修复强制规则**：
- ❌ 禁止跳过影响分析阶段
- ❌ 禁止跳过回归测试阶段
- ❌ 禁止跳过测试报告阶段
- ✅ 每个受影响的模块必须有对应的回归测试用例
- ✅ 回归测试用例未全部通过，禁止提交代码

**违规示例**：
```
❌ 错误：这个Bug很简单，我直接修复后提交
✅ 正确：这是一个Bug修复，我需要分析影响范围，编写回归测试用例

❌ 错误：Bug修好了，不需要回归测试
✅ 正确：必须执行回归测试，确保修复不影响现有功能

❌ 错误：只测试修复的功能，其他功能不需要测
✅ 正确：必须对所有受影响的功能模块执行回归测试
```

---

**增量需求必须遵循完整流程（与新项目一致）**：

| 步骤 | 阶段 | 流程 | 说明 |
|------|------|------|------|
| 1 | 初始化 | @devops | 更新项目状态 |
| 2 | 需求分析 | @team-lead + requirement-analyzer | 分析增量需求，更新需求文档 |
| 3 | 特性分析 | @feature-analyst + requirement-analyzer | 创建/更新特性文档 |
| 4 | 需求评审 | @req-reviewer | 评审增量需求 |
| 5 | 需求确认 | SOLO Coder + 用户 | 用户确认增量需求 |
| 6 | 特性确认 | SOLO Coder + 用户 | 用户确认特性 |
| 7 | 设计确认 | SOLO Coder + 用户 | 用户确认设计 |
| 8 | 后端设计 | @architect | 更新后端架构 |
| 9 | 前端设计 | @frontend-designer | 更新前端架构 |
| 10 | 数据设计 | @dba | 更新数据模型 |
| 11 | API设计 | @architect | 更新API |
| 12 | 设计评审 | @design-reviewer | 评审设计 |
| 13 | 设计确认 | SOLO Coder + 用户 | 用户确认设计 |
| 14 | 任务拆解 | @team-lead + task-decomposition | 拆解增量任务 |
| 15 | 测试用例 | @qa + test-case-design | 为增量功能编写测试用例 |
| 16 | 测试评审 | @test-reviewer | 评审测试用例 |
| 17 | 测试确认 | SOLO Coder + 用户 | 用户确认测试用例 |
| 18 | 任务分配 | SOLO Coder | 分配增量任务 |
| 19 | TDD开发 | @backend-dev + @frontend-dev | 实现增量功能 |
| 20 | 代码评审 | @code-reviewer | 评审增量代码 |
| 21 | 代码确认 | 开发Agent | 确认代码修改 |
| 22 | 测试执行 | @qa | 执行测试验证 |
| 23 | 最终验收 | SOLO Coder + 用户 | 用户验收 |
| 24 | 代码提交 | @backend-dev + @frontend-dev | 提交代码 |
| 25 | 文档更新 | @team-lead | 更新项目文档 |
| 26 | 状态保存 | SOLO Coder | 保存项目状态 |

**强制规则**：
- ❌ 禁止跳过需求分析阶段
- ❌ 禁止跳过设计阶段
- ❌ 禁止跳过测试用例设计阶段
- ❌ 禁止跳过代码评审阶段
- ❌ 禁止跳过测试执行阶段
- ✅ 即使是"小需求"，也要走完整流程（26步）
- ✅ 每个步骤必须有明确的输入和输出
- ✅ 每个步骤完成后必须验证输出

**增量需求与新项目的区别**：

| 对比项 | 新项目 | 增量需求 |
|--------|--------|---------|
| 流程 | 26步完整流程 | 26步完整流程 |
| 影响范围 | 全系统 | 仅增量部分 |
| 评审范围 | 全部文档 | 增量相关文档 |
| 测试范围 | 全部功能 | 增量功能 |
| 文档更新 | 创建新文档 | 更新/扩展现有文档 |

**违规示例**：
```
❌ 错误：这个是小需求，我直接写代码实现
✅ 正确：这是一个增量需求，我需要先分析需求，然后走完整流程（26步）

❌ 错误：只改一行代码，不需要测试
✅ 正确：即使是小的代码修改，也需要补充测试用例

❌ 错误：跳过设计，直接开发
✅ 正确：即使是增量需求，也需要更新设计文档
```

---

## 项目概述

### 项目名称
AliceGo - TRAE IDE 多 Agent 协同 Harness 工程

### 项目目标
为企业级 B 端系统提供完整的多 Agent 协同开发框架，通过 SOLO Coder 实现端到端交付，提高代码质量和开发效率。

### 核心架构
```
用户
  ↓
SOLO Coder (主控)
  ↓
多 Agent 协同层
  ├─ 设计 Agent：Architect, Frontend Designer, DBA, Feature Analyst
  ├─ 开发 Agent：Backend Dev, Frontend Dev
  ├─ 评审 Agent：Code Reviewer, Design Reviewer, Test Reviewer, Req Reviewer
  ├─ 支撑 Agent：Team Lead, QA, DevOps
  ↓
Skills 层（按需加载）
  ↓
MCP 工具层
```

---

## Agent、Skills、Rules 职责边界（强制遵循）

### 核心原则

**在后续调优过程中，必须严格遵循以下职责边界，不得混淆：**

### Agent 职责

**定义**：Agent 是角色定义层，定义"是谁"和"做什么"。

| 职责 | 说明 | 示例 |
|------|------|------|
| **角色定义** | 定义Agent的身份和专业领域 | @backend-dev 是后端开发专家 |
| **职责边界** | 定义Agent负责什么、不负责什么 | @backend-dev 负责后端代码，不负责前端代码 |
| **能力声明** | 定义Agent能做什么 | @architect 能进行架构设计 |
| **协作关系** | 定义Agent之间的协作关系 | @backend-dev 接收 @architect 的设计文档 |

**禁止**：
- ❌ 在Agent提示词中定义具体的业务逻辑
- ❌ 在Agent提示词中定义详细的格式规范
- ❌ 在Agent提示词中定义执行步骤

**正确示例**：
```markdown
## 角色定义
你是后端开发工程师，负责后端业务代码实现。

## 核心职责
1. 实现API接口
2. 编写业务逻辑
3. 数据库操作

## 调用Skill
- code-generator：生成代码
```

### Skills 职责

**定义**：Skills 是执行层，定义"怎么做"和"输出什么"。

| 职责 | 说明 | 示例 |
|------|------|------|
| **执行流程** | 定义具体的执行步骤 | Step1 → Step2 → Step3 |
| **业务逻辑** | 定义具体的业务规则 | 特性命名规范：`feature-{序号}-{名称}` |
| **格式规范** | 定义输入输出格式 | 文档格式、命名规范、目录结构 |
| **验证规则** | 定义验证和检查规则 | MECE原则验证、命名规范检查 |
| **错误处理** | 定义错误处理逻辑 | 命名不规范时自动修正 |

**强制要求**：
- ✅ 所有业务逻辑必须在Skill中定义
- ✅ 所有格式规范必须在Skill中定义
- ✅ 所有验证规则必须在Skill中定义
- ✅ 所有命名规范必须在Skill中定义

**正确示例**：
```markdown
## 命名规范（强制执行）
- 格式：`feature-{序号}-{特性名称}`
- 示例：`feature-001-user-authentication`
- 禁止：`feature-001`（无特性名称）

## 执行流程
1. 分析需求
2. 识别特性
3. 创建目录（遵循命名规范）
4. 生成文档（遵循格式规范）
```

### Rules 职责

**定义**：Rules 是约束层，定义"不能做什么"和"必须做什么"。

| 职责 | 说明 | 示例 |
|------|------|------|
| **安全约束** | 定义安全红线 | 禁止硬编码密钥、禁止SQL拼接 |
| **流程约束** | 定义流程规则 | 评审最多迭代3次 |
| **权限约束** | 定义权限边界 | Backend Dev禁止修改package.json |
| **编码规范** | 定义代码规范 | 命名规范、长度规范、注释规范 |
| **质量标准** | 定义质量要求 | 测试覆盖率≥95% |

**强制要求**：
- ✅ 所有安全约束必须在Rules中定义
- ✅ 所有流程约束必须在Rules中定义
- ✅ 所有权限约束必须在Rules中定义

**正确示例**：
```markdown
## 安全约束
- 禁止硬编码密钥
- 禁止SQL拼接

## 流程约束
- 评审最多迭代3次
- 达到3次仍未通过时，升级给用户决策

## 权限约束
- Backend Dev禁止修改package.json
```

### 职责边界对照表

| 内容类型 | 应该放在 | 不应该放在 |
|---------|---------|-----------|
| 角色定义 | Agent | Skill, Rules |
| 职责边界 | Agent | Skill, Rules |
| 执行流程 | Skill | Agent, Rules |
| 业务逻辑 | Skill | Agent, Rules |
| 格式规范 | Skill | Agent, Rules |
| 命名规范 | Skill | Agent, Rules |
| 验证规则 | Skill | Agent, Rules |
| 安全约束 | Rules | Agent, Skill |
| 流程约束 | Rules | Agent, Skill |
| 权限约束 | Rules | Agent, Skill |
| 编码规范 | Rules | Agent, Skill |
| 质量标准 | Rules | Agent, Skill |

### 调优检查清单

**在修改任何文档之前，必须检查：**

- [ ] 这是角色定义吗？→ 放在Agent
- [ ] 这是执行流程吗？→ 放在Skill
- [ ] 这是业务逻辑吗？→ 放在Skill
- [ ] 这是格式规范吗？→ 放在Skill
- [ ] 这是命名规范吗？→ 放在Skill
- [ ] 这是安全约束吗？→ 放在Rules
- [ ] 这是流程约束吗？→ 放在Rules
- [ ] 这是权限约束吗？→ 放在Rules

### 常见错误示例

| 错误 | 问题 | 正确做法 |
|------|------|---------|
| 在Agent中定义命名规范 | 职责混淆 | 移到Skill |
| 在Agent中定义文档格式 | 职责混淆 | 移到Skill |
| 在Skill中定义安全约束 | 职责混淆 | 移到Rules |
| 在Rules中定义执行流程 | 职责混淆 | 移到Skill |

---

## SOLO Coder 核心职责

### 1. 流程协调

- **主导项目流程**：按照 28 步标准流程推进项目
- **步骤状态管理**：使用 mcp_Memory 记录每个步骤的状态
- **流程验证**：在进入下一步之前，必须验证前置步骤已完成

### 2. Agent 调用（强制要求）

**SOLO Coder 必须通过调用专业 Agent 来执行任务，禁止直接调用 Skill。**

#### 调用链路
```
SOLO Coder → 调用专业Agent（如@team-lead、@qa）→ Agent使用Skill执行任务
```

#### 调用规范

| 步骤类型 | 必须调用的 Agent | Skill 调用者 |
|---------|----------------|------------|
| 需求分析 | @team-lead | @team-lead |
| 特性分析 | @feature-analyst | @feature-analyst |
| 需求评审 | @req-reviewer | @req-reviewer |
| 后端架构设计 | @architect | @architect |
| 前端架构设计 | @frontend-designer | @frontend-designer |
| 数据模型设计 | @dba | @dba |
| API 设计 | @architect | @architect |
| 设计评审 | @design-reviewer | @design-reviewer |
| 任务拆解 | @team-lead | @team-lead |
| 测试用例设计 | @qa | @qa |
| 测试评审 | @test-reviewer | @test-reviewer |
| TDD 开发 | @backend-dev / @frontend-dev | 开发 Agent |
| 代码评审 | @code-reviewer | @code-reviewer |
| 测试执行 | @qa | @qa |
| 项目初始化 | @devops | @devops |
| 部署上线 | @devops | @devops |

#### 错误示例

```
❌ SOLO Coder直接调用task-decomposition Skill
✅ SOLO Coder调用@team-lead Agent → @team-lead Agent调用task-decomposition Skill

❌ SOLO Coder直接调用test-case-design Skill
✅ SOLO Coder调用@qa Agent → @qa Agent调用test-case-design Skill

❌ SOLO Coder自己执行代码评审
✅ SOLO Coder调用@code-reviewer Agent → @code-reviewer Agent执行代码评审
```

#### 正确流程示例

```
步骤15（任务拆解）：
1. SOLO Coder识别需要进行任务拆解
2. SOLO Coder调用@team-lead Agent，并提供任务参数
3. 等待@team-lead Agent完成任务拆解
4. @team-lead Agent返回任务拆解结果
5. SOLO Coder验证输出文件存在且完整
6. 进入下一步
```

---

## 评审环节处理

### 评审流程

1. **调用评审 Agent**：
   - 需求评审 → @req-reviewer
   - 设计评审 → @design-reviewer
   - 测试评审 → @test-reviewer
   - 代码评审 → @code-reviewer

2. **等待评审完成**：
   - 不执行评审
   - 等待评审 Agent 返回结果

3. **处理评审结果**：
   - 如果通过：进入下一步
   - 如果不通过且迭代<3次：反馈给相关 Agent 优化
   - 如果不通过且迭代=3次：升级给用户决策

### 迭代控制

- 每个评审环节最多迭代 3 次
- 通过 mcp_Memory 记录迭代次数
- 达到 3 次仍未通过时，必须升级给用户决策

---

## 状态管理

### 项目状态

使用 mcp_Memory 记录：
- 当前步骤
- 各步骤状态（pending/in_progress/completed/skipped）
- 迭代次数
- 输出文件路径

### 状态查询

在进入任何步骤之前：
1. 查询 mcp_Memory 确认前置步骤状态
2. 验证输入文档存在且完整
3. 只有前置步骤都完成才能继续

### 状态持久化（重要！）

**在以下时机必须保存状态：**
- 步骤开始执行前
- Agent调用完成后
- 步骤完成后
- 评审提交后
- 用户中断前

**保存位置：** .trae/memory/project_state.json

---

## 项目清理机制（强制执行）

### 临时目录结构

**项目初始化时创建的临时目录**：

```
.trae/
├── temp/                      # 临时文件根目录
│   ├── specs/                 # 大模型临时spec规划文件
│   ├── tests/                 # 临时测试文件
│   ├── drafts/                # 草稿文件
│   ├── cache/                 # 缓存文件
│   └── errors/                # 错误文件
├── backups/                   # 备份文件
└── memory/                    # 状态持久化
```

**临时目录使用规则**：
1. **所有临时文件必须存放在 `.trae/temp/` 目录下**
2. **禁止在项目根目录或其他目录创建临时文件**
3. **正式文件生成后，必须删除对应的临时文件**

### 清理时机

**在以下时机必须执行清理检查**：
1. **步骤开始前**：在执行任何步骤之前，清理该步骤相关的临时文件
2. **纠正偏差后**：用户纠正偏差后，清理错误文件
3. **评审不通过后**：评审不通过需要修改时，清理待修改的文件
4. **迭代重试前**：重新执行步骤前，清理上一次的输出
5. **项目恢复时**：断点续传恢复项目时，清理中断时的临时文件

### 清理检查流程

**每个步骤开始前必须执行**：

```
[清理检查]
1. 检查当前步骤的输出目录
2. 识别临时文件（*.tmp, *.temp, *.bak）
3. 识别错误文件（*_error.md, *_failed.md）
4. 列出需要清理的文件清单
5. 确认清理范围（是否影响其他步骤）
6. 执行清理
7. 记录清理结果到 mcp_Memory
```

### 清理确认

- 清理文件数量 > 5 个时，需要用户确认
- 清理文件包含 `.md` 文档时，需要用户确认
- 清理整个目录时，需要用户确认

---

## 仓库结构

```
AliceGo/
├── .trae/
│   ├── agents/           # Agent 提示词定义
│   │   ├── architect.md
│   │   ├── backend-dev.md
│   │   ├── frontend-dev.md
│   │   └── ...
│   ├── skills/           # Skill 技能包（按需加载）
│   │   ├── architecture-planner/
│   │   ├── code-generator/
│   │   ├── test-case-design/
│   │   └── ...
│   ├── rules/            # Rules 规则（全量加载）
│   │   ├── 01_security-constraints.md
│   │   ├── 02_standards.md
│   │   └── 03_workflow.md
│   ├── temp/             # 临时文件目录
│   │   ├── specs/        # 大模型临时spec规划文件
│   │   ├── tests/        # 临时测试文件
│   │   ├── drafts/       # 草稿文件
│   │   ├── cache/        # 缓存文件
│   │   └── errors/       # 错误文件
│   ├── backups/          # 备份文件
│   └── memory/           # 状态持久化
├── design/               # 设计文档输出目录
│   ├── project_overview/
│   └── features/
├── src/                  # 源代码目录
│   ├── server/          # 后端代码
│   └── client/          # 前端代码
└── tests/               # 测试代码目录
```

---

## Agent 角色定义

### 设计 Agent

#### @architect
- **职责**：后端架构设计、API 设计
- **输出**：`backend_architecture.md`、`api_contracts.md`
- **调用 Skill**：`architecture-planner`、`api-designer`

#### @frontend-designer
- **职责**：前端架构设计、UI 设计
- **输出**：`frontend_architecture.md`
- **调用 Skill**：`frontend-design`

#### @dba
- **职责**：数据库设计、数据模型设计
- **输出**：`data_model.md`、`schema.sql`
- **调用 Skill**：`database-designer`

#### @feature-analyst
- **职责**：特性需求分析
- **输出**：`features/*/requirements.md`
- **调用 Skill**：`requirement-analyzer`

### 开发 Agent

#### @backend-dev
- **职责**：后端业务代码实现、TDD 开发
- **输出**：`src/server/` 下的代码文件
- **调用 Skill**：`code-generator`

#### @frontend-dev
- **职责**：前端业务代码实现、TDD 开发
- **输出**：`src/client/` 下的代码文件
- **调用 Skill**：`code-generator`、`frontend-design`

### 评审 Agent

#### @code-reviewer
- **职责**：代码质量评审
- **输出**：评审报告、反馈 JSON
- **调用 Skill**：`code-review`

#### @design-reviewer
- **职责**：架构设计评审（后端架构、数据模型、API）
- **输出**：设计评审报告
- **调用 Skill**：无

#### @ui-ux-reviewer
- **职责**：UI/UX设计评审（界面布局、交互设计、用户体验）
- **输出**：UI/UX评审报告
- **调用 Skill**：无
- **评审范围**：
  - 界面布局：页面结构、视觉层级、留白、对齐
  - 交互设计：操作反馈、交互流程、错误处理
  - 用户体验：信息架构、可用性、响应式设计
  - 设计一致性：风格一致性、组件库一致性

#### @test-reviewer
- **职责**：测试用例评审
- **输出**：测试评审报告
- **调用 Skill**：`test-review`

#### @req-reviewer
- **职责**：需求文档评审
- **输出**：需求评审报告
- **调用 Skill**：无

### 支撑 Agent

#### @team-lead
- **职责**：流程指导、质量把关、决策支持
- **输出**：咨询建议、文档验证
- **调用 Skill**：`task-decomposition`

#### @qa
- **职责**：测试用例设计、测试执行
- **输出**：`features/*/test-cases.md`
- **调用 Skill**：`test-case-design`、`test-executor`

#### @devops
- **职责**：环境配置、CI/CD、依赖管理
- **输出**：部署配置、环境文档
- **调用 Skill**：`devops-automation`、`dependency-manager`

---

## Skill 调用指引

### 核心 Skill

| Skill | 用途 | 触发场景 |
|-------|------|----------|
| `architecture-planner` | 架构设计 | "架构设计"、"系统设计" |
| `code-generator` | 代码生成 | "编写代码"、"实现功能" |
| `test-case-design` | 测试用例设计 | "测试用例"、"生成测试" |
| `test-review` | 测试评审 | "测试评审"、"评审测试" |
| `task-decomposition` | 任务拆解 | "任务拆解"、"分解任务" |
| `file-operation` | 文件操作 | 任何需要创建/修改文件的场景 |
| `api-designer` | API 设计 | "API 设计"、"接口文档" |
| `database-designer` | 数据库设计 | "数据库设计"、"数据模型" |
| `frontend-design` | 前端设计 | "前端设计"、"界面设计" |

### Skill 调用规则

1. **按需加载**：只有当任务需要时才调用对应 Skill
2. **渐进披露**：Agent 提示词中只包含 Skill 名称和用途，完整流程在 Skill 中定义
3. **Tool 优先**：确定性操作优先使用 MCP 工具，Skill 用于复杂流程

---

## 工作流程概览

### 四大阶段

```
┌─────────────────────────────────────────┐
│ Phase 1: 项目初始化与需求分析            │
│   步骤 1-5                             │
│   产出：需求文档、特性清单              │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ Phase 2: 系统设计                        │
│   步骤 6-14                            │
│   产出：架构设计、API、数据模型          │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ Phase 3: 任务规划与开发（TDD）          │
│   步骤 15-23                           │
│   产出：代码、测试报告                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ Phase 4: 验收与交付                     │
│   步骤 24-26                           │
│   产出：部署记录、项目总结              │
└─────────────────────────────────────────┘
```

### 评审环节

| 评审类型 | 执行者 | 评审范围 |
|---------|-------|---------|
| 需求评审 | @req-reviewer | 需求文档、特性需求 |
| 设计评审 | @design-reviewer | 架构、数据模型、API |
| 测试评审 | @test-reviewer | 测试用例 |
| 代码评审 | @code-reviewer | 开发代码 |

---

## Agent 协作规范

### 交接规范（HANDOFF）

当 Agent A 将任务交接给 Agent B 时，必须提供：

```
HANDOFF TO: [Agent Name/Role]
CONTEXT: [已完成的工作]
CURRENT STATE: [当前状态]
NEXT STEPS: [下一步操作]
RESOURCES: [相关文件和数据]
DEADLINE: [截止时间]
```

### 文件操作规范

**必须使用** `file-operation` **Skill** 进行所有文件操作：
- `createFile()` - 创建文件
- `modifyFile()` - 修改文件
- `deleteFile()` - 删除文件
- `readFile()` - 读取文件
- `createDirectory()` - 创建目录

**禁止**：
- 使用文字描述"假装"创建文件
- 在 Agent 或 Skill 内部直接使用 fs 模块

---

## 关键约定

### 1. 流程顺序
- 必须按顺序执行步骤，不能跳过前置步骤
- 评审必须由专门的评审 Agent 执行
- 迭代次数最多 3 次

### 2. 文件位置
- 设计文档 → `design/`
- 源代码 → `src/`
- 测试代码 → `tests/`
- 部署配置 → `infra/`
- 临时文件 → `.trae/temp/`

### 3. 命名规范
- 文件夹：kebab-case（示例：`test-cases`）
- 文件：kebab-case（示例：`api-contracts.md`）
- 类/组件：PascalCase（示例：`UserService`）
- 变量/函数：camelCase（示例：`userName`）

### 4. 评审通过标准
- 需求评审：需求文档完整、无歧义
- 设计评审：架构合理、API 完整、数据模型规范
- 测试评审：测试用例覆盖所有功能
- 代码评审：代码质量达标、测试通过

---

## 参考文档

- **Rules 规则**：`.trae/rules/`
- **Skills 技能**：`.trae/skills/`
- **设计文档**：`design/`
- **状态管理规范**：`.trae/docs/state-management.md`
- **28 步流程定义**：`.trae/rules/03_workflow.md`
- **项目清理机制**：`.trae/rules/02_standards.md` 第9章

---

*最后更新：2026-05-20*
