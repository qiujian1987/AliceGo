# 经验知识管理规则（L2）

## 1. 概述

本规则定义了项目中的经验知识管理体系，包括历史问题记录、用户习惯偏好、项目经验总结，以及如何在上下文中自动运用这些经验。

## 2. 目标

- **知识积累**：记录项目过程中遇到的问题和解决方案
- **习惯记录**：记录用户的工作习惯和偏好
- **经验复用**：在后续项目中自动应用已有的经验
- **持续改进**：基于历史经验不断优化开发流程

## 3. 经验知识分类

### 3.1 历史问题经验库
记录过去遇到的问题、原因分析、解决方案、预防措施。

### 3.2 用户习惯偏好
记录用户的工作习惯、沟通方式、偏好设置。

### 3.3 项目经验总结
每个项目完成后的经验教训、成功因素、改进建议。

## 4. 经验记录规范

### 4.1 历史问题记录格式

```markdown
## 问题记录

### 基本信息
- **问题ID**: PROB-001
- **记录时间**: 2026-05-31
- **项目名称**: AliceGo
- **问题类型**: 技术问题 / 流程问题 / 沟通问题 / 其他

### 问题描述
- **现象**: 详细描述问题现象
- **影响范围**: 问题影响的模块或功能
- **严重程度**: 高 / 中 / 低

### 原因分析
- **根本原因**: 问题的根本原因
- **触发条件**: 问题发生的触发条件

### 解决方案
- **临时方案**: 快速解决问题的方法
- **最终方案**: 彻底解决问题的方案
- **实施步骤**: 详细的解决步骤

### 预防措施
- **技术手段**: 如何通过技术手段预防
- **流程改进**: 如何通过流程改进预防
- **检查点**: 需要增加的检查环节

### 关联信息
- **相关文档**: 关联的设计文档、代码文件
- **类似问题**: 之前是否遇到过类似问题
- **责任人**: 问题处理的负责人
```

### 4.2 用户习惯偏好记录格式

```markdown
## 用户习惯偏好记录

### 用户基本信息
- **用户ID**: USER-001
- **记录时间**: 2026-05-31
- **最后更新**: 2026-05-31

### 工作习惯
- **沟通方式**: 喜欢详细说明 / 简洁直接
- **反馈频率**: 希望频繁同步 / 阶段性汇报
- **决策风格**: 快速决策 / 深思熟虑
- **时间偏好**: 上午工作 / 下午工作 / 夜间工作

### 技术偏好
- **编程语言**: TypeScript / Python / Go
- **框架偏好**: React / Vue / Angular
- **代码风格**: 简洁 / 详细注释
- **测试偏好**: 单元测试优先 / 集成测试优先

### 项目管理偏好
- **文档详细度**: 精简 / 详细
- **评审深度**: 全面评审 / 快速评审
- **迭代周期**: 短迭代 / 长迭代
- **变更管理**: 严格控制 / 灵活调整

### 特殊要求
- **命名规范**: 特定的命名要求
- **文档格式**: 特定的文档格式要求
- **其他偏好**: 其他需要注意的习惯
```

### 4.3 项目经验总结格式

```markdown
## 项目经验总结

### 项目基本信息
- **项目ID**: PROJ-001
- **项目名称**: AliceGo
- **开始时间**: 2026-01-01
- **结束时间**: 2026-05-31
- **项目规模**: 小型 / 中型 / 大型

### 成功经验
- **做得好的地方**: 项目中做得好的方面
- **关键成功因素**: 项目成功的关键因素
- **最佳实践**: 可以复用的最佳实践

### 问题与教训
- **遇到的问题**: 项目中遇到的主要问题
- **经验教训**: 从问题中学到的教训
- **改进建议**: 对未来项目的改进建议

### 效率分析
- **时间管理**: 时间使用情况分析
- **资源利用**: 资源利用情况分析
- **瓶颈识别**: 项目中的主要瓶颈
- **优化建议**: 提高效率的建议

### 团队协作
- **沟通效果**: 团队沟通情况
- **协作模式**: 团队协作模式
- **改进空间**: 团队协作的改进空间

### 技术栈评估
- **技术选型**: 技术选型的评估
- **工具使用**: 工具使用情况
- **学习曲线**: 新技术的学习成本
- **推荐指数**: 是否推荐继续使用

### 可复用资产
- **代码模块**: 可以复用的代码模块
- **设计模式**: 可以复用的设计模式
- **文档模板**: 可以复用的文档模板
- **工具配置**: 可以复用的工具配置
```

## 5. 四层记忆架构（基于TRAE IDE原生机制）

本架构**完全基于TRAE IDE现有记忆机制**设计，充分利用TRAE的原生能力，不做重复发明。

### TRAE IDE 原生记忆机制

| 原生机制 | 位置/实现 | 用途 | 我们如何利用 |
|---------|----------|------|------------|
| **上下文窗口** | System Prompt + 对话历史 | 零延迟访问 | ✅ L1热记忆：静态+动态注入 |
| **mcp_Memory** | MCP记忆服务器，KV存储 | 结构化数据持久化 | ✅ L2工作记忆：task_state, project_state |
| **文件系统** | `.trae/rules/` + `.md`文件 | 文档化知识 | ✅ L3情景记忆：经验知识库 |
| **代码索引** | IDE内置代码导航 | 代码结构理解 | ✅ L4结构化记忆：代码语义索引 |

---

### 5.1 L1: 上下文感知热记忆（Hot Memory）

**基于TRAE机制**：System Prompt 注入 + 上下文窗口

#### 5.1.1 设计目标
始终注入上下文窗口，零延迟访问，确保Agent时刻知道"我在哪、我是谁、该做什么"。

#### 5.1.2 实现方式（TRAE原生）

```
[L1 热记忆 = System Prompt 注入]
├── 静态注入（始终加载，TRAE自动读取 rules/ 目录）
│   ├── 01_security-constraints.md  # 安全红线
│   ├── 02_standards.md             # 编码规范、Agent领地
│   ├── 03_workflow.md              # 流程标准
│   └── experience/preferences/     # 用户习惯偏好（自动加载）
│
└── 动态注入（Agent主动管理）
    ├── 文件类型感知: 打开.ts注入TypeScript规范，打开.py注入Python规范
    ├── 任务类型感知: 开发任务/评审任务/测试任务
    ├── 项目阶段感知: 从mcp_Memory读取project_state.current_phase
    └── 当前模块感知: 正在修改的模块/组件相关规范
```

#### 5.1.3 动态注入触发点（Agent行为规范）
- 打开新文件时
- 切换任务类型时
- 项目阶段变更时（通过 mcp_Memory 监听 project_state 变化）
- 用户明确要求时

---

### 5.2 L2: 任务驱动工作记忆（Working Memory）

**基于TRAE机制**：`mcp_Memory` + `.trae/memory/` 目录

#### 5.2.1 设计目标
以任务为中心的状态机，支持断点续传，区别于通用场景的"最近N轮对话"。

#### 5.2.2 实现方式（TRAE原生）

**完全使用 mcp_Memory 的数据类型**（详见 [memory-usage.md](file:///c:/Users/12345678/Documents/trae_projects/AliceGo/.trae/docs/memory-usage.md)）：

```
[L2 工作记忆 = mcp_Memory KV存储]
├── project_state:main
│   ├── 项目整体状态
│   ├── 当前阶段
│   ├── 进度百分比
│   ├── 里程碑状态
│   ├── **回退状态记录**（新增）
│   │   ├── last_success_step: 上次成功步骤
│   │   ├── fail_reason: 失败原因
│   │   ├── retry_count: 当前重试次数
│   │   └── max_retry_count: 最大重试次数
│   └── **预算状态追踪**（新增）
│       ├── total_budget: 总预算
│       ├── consumed_tokens: 已消耗token
│       ├── remaining_tokens: 剩余token
│       └── alert_status: 预警状态(normal/warning/critical)
│
├── task_state:{task_id}
│   ├── 任务ID和描述
│   ├── 负责人Agent
│   ├── 状态：pending/in_progress/completed
│   ├── 依赖关系
│   ├── 进度百分比
│   └── 产出物列表
│
├── review_iteration:{review_type}
│   ├── 评审类型
│   ├── 当前迭代次数
│   ├── 最大迭代次数
│   └── 评审历史
│
├── loop_state:main （新增）
│   ├── current_loop: 当前回环名称(requirements/design/test/code)
│   ├── loop_iteration: 当前回环迭代次数
│   ├── max_loop_iteration: 最大回环迭代次数
│   ├── fallback_path: 回退路径定义
│   └── success_path: 成功跳转路径
│
└── important_decision:{decision_id}
    ├── 决策标题
    ├── 决策内容
    ├── 选择理由
    └── 影响范围
```

#### 5.2.3 生命周期管理（TRAE原生支持）
- **创建**: 任务开始时，调用 `mcp_Memory.create_entities()` 创建 task_state
- **更新**: 每完成一个步骤，调用 `mcp_Memory.add_observations()` 更新状态
- **归档**: 任务完成后，将状态标记为 completed，生成 .md 摘要存入 L3
- **恢复**: 新对话启动时，TRAE自动从 `.trae/memory/` 恢复状态

#### 5.2.4 断点续传机制（TRAE原生支持）
参考 [state-management.md](file:///c:/Users/12345678/Documents/trae_projects/AliceGo/.trae/docs/state-management.md)：
- 状态持久化到 `.trae/memory/project_state.json`
- 新对话启动时自动检测并提示恢复
- 支持 `/continue`、`/restart [step]` 等命令
- 状态快照保存在 `.trae/memory/snapshots/`
- **回退状态恢复**（新增）：支持从回退状态恢复，显示回退原因和重试次数

**回退状态恢复流程**：
```
1. 检测到项目状态文件存在
2. 检查是否存在回退状态（last_success_step、fail_reason、retry_count）
3. 如果存在回退状态：
   - 显示回退信息："检测到回退，上次失败原因：{fail_reason}，已重试{retry_count}次"
   - 提示用户选择：继续重试 / 跳过当前步骤 / 回退到指定步骤
4. 如果不存在回退状态：
   - 正常恢复流程
```

**使用示例**：
```javascript
// 保存任务状态
await memory.set('task_state:T001', {
  type: 'task_state',
  task_id: 'T001',
  name: '用户认证模块开发',
  status: 'in_progress',
  progress: 50,
  output_files: ['src/auth/login.ts']
});

// 保存回退状态（评审失败时）
await memory.set('project_state:main', {
  type: 'project_state',
  current_step: 'step-4',
  current_phase: 'requirements',
  progress: 20,
  fallback_state: {
    last_success_step: 'step-3',
    fail_reason: '需求文档不完整，缺少验收标准',
    retry_count: 1,
    max_retry_count: 3
  },
  budget: {
    total: 1000000,
    consumed: 150000,
    remaining: 850000,
    alert_status: 'normal'
  }
});

// 读取项目状态
const projectState = await memory.get('project_state:main');

// 读取Loop状态
const loopState = await memory.get('loop_state:main');
```

---

### 5.3 L3: 项目情景记忆（Episodic Memory）

**基于TRAE机制**：`mcp_Memory`（结构化索引） + 文件系统 `.md` 文件（详细内容）

#### 5.3.1 设计目标
按项目/模块组织的结构化经验，区别于通用场景的"扁平对话历史"。

#### 5.3.2 实现方式（混合架构）

**双层存储策略**：
1. **结构化索引层**：使用 mcp_Memory 存储元数据，支持快速检索
2. **详细内容层**：使用文件系统 `.md` 文件存储详细内容

```
[L3 情景记忆 = mcp_Memory索引 + 文件系统存储]
├── 结构化索引（mcp_Memory）
│   ├── issue_record:{issue_id}      # 问题记录索引
│   ├── important_decision:{dec_id}  # 决策记录索引
│   └── experience_tag:{tag}         # 分类标签
│
└── 详细内容（文件系统 .md）
    ├── experience/projects/          # 按项目组织
    │   ├── PROJ-001-AliceGo/
    │   │   ├── problems/             # 该项目遇到的问题
    │   │   ├── decisions/            # 该项目的架构决策
    │   │   └── lessons/              # 该项目的经验教训
    │   └── index.md
    │
    ├── experience/modules/           # 按模块组织（跨项目复用）
    └── experience/cross-project/     # 跨项目可复用经验
```

#### 5.3.3 检索策略（TRAE原生查询能力）

利用 mcp_Memory 的查询功能：
```javascript
// 查询当前项目的所有问题
const projectIssues = await memory.query({
  type: 'issue_record',
  project_id: 'PROJ-001',
  status: 'resolved'
});

// 查询特定模块的决策记录
const moduleDecisions = await memory.query({
  type: 'important_decision',
  module: 'authentication'
});
```

#### 5.3.4 衰减策略（按项目阶段）

区别于通用场景的"按时间衰减"，项目开发场景按**项目阶段和相关性**衰减：

```python
# 记忆显著性计算（检索时动态计算）
def salience(memory, current_project, current_module, current_phase):
    base_score = memory.importance
    
    # 项目匹配权重（mcp_Memory字段：project_id）
    if memory.project_id == current_project:
        base_score *= 3.0  # 当前项目，权重最高
    
    # 模块匹配权重（mcp_Memory字段：module）
    if memory.module == current_module:
        base_score *= 2.0  # 当前模块，权重加倍
    
    # 项目阶段权重（mcp_Memory字段：phase）
    if memory.phase == current_phase:
        base_score *= 1.5  # 同阶段，权重增加
    
    # 时间衰减（相对较弱）
    time_decay = math.exp(-0.005 * days_since)
    base_score *= time_decay
    
    return base_score
```

---

### 5.4 L4: 代码库结构化记忆（External Memory）

**基于TRAE机制**：IDE内置代码索引 + Git历史 + 架构文档

#### 5.4.1 设计目标
代码库级的结构化知识，支持深度代码理解和架构决策。

#### 5.4.2 实现方式（TRAE/IDE原生能力）

```
[L4 结构化记忆 = IDE原生能力 + 文档化]
├── IDE内置代码索引
│   ├── 函数/类定义导航
│   ├── 引用关系查找
│   ├── 符号搜索
│   └── 调用层级
│
├── Git历史（原生）
│   ├── git log + 语义标签
│   ├── git blame 变更追溯
│   └── git diff 变更对比
│
├── 架构知识图谱（文档化）
│   ├── design/project_overview/backend_architecture.md
│   ├── design/project_overview/data_model.md
│   ├── design/project_overview/api_contracts.md
│   └── 模块依赖关系图
│
└── 领域知识库
    ├── 业务规则文档
    ├── 领域术语表
    └── 设计模式库
```

#### 5.4.3 访问方式
- 代码索引：IDE 原生 Go to Definition / Find References
- Git历史：直接调用 `git` 命令
- 架构文档：通过文件路径读取 `.md` 文件

## 6. 经验运用机制（基于TRAE原生能力）

### 6.1 记忆检索触发点

**必须主动检索记忆的场景**（通过 mcp_Memory.query() 实现）：

| 触发场景 | 检索内容 | 记忆层级 | TRAE实现方式 |
|---------|---------|---------|------------|
| 打开新文件时 | 该文件/模块的历史修改记录、常见问题 | L3 | mcp_Memory.query({type: 'issue_record', module}) |
| 开始新任务时 | 类似任务的历史经验、最佳实践 | L3、L4 | mcp_Memory.query({type: 'task_state'}) + 文档检索 |
| 遇到错误时 | 类似错误的解决方案、预防措施 | L3 | mcp_Memory.query({type: 'issue_record', status: 'resolved'}) |
| 代码评审前 | 该模块的历史评审意见、评审标准 | L3、L4 | mcp_Memory.query({type: 'review_iteration'}) + 文档检索 |
| 架构决策时 | 类似决策的历史记录、技术选型评估 | L4 | mcp_Memory.query({type: 'important_decision'}) + 架构文档 |
| 项目开始时 | 类似项目的经验总结、技术栈评估 | L3、L4 | experience/projects/ 目录检索 |

### 6.2 问题预防检查（基于mcp_Memory）

在执行关键任务前，通过 mcp_Memory 检查历史问题记录：

```javascript
// 代码开发前：检查该模块的常见代码错误
const moduleIssues = await memory.query({
  type: 'issue_record',
  module: currentModule,
  severity: 'high'
});
```

检查内容：
- **代码开发前**: 检查该模块的常见代码错误（issue_record）
- **设计评审前**: 检查历史设计问题和决策背景（important_decision）
- **部署前**: 检查历史部署问题和检查清单（issue_record）
- **测试前**: 检查历史测试问题和测试策略（issue_record）

### 6.3 用户习惯应用（基于rules目录自动加载）

TRAE IDE 自动加载 `rules/` 目录下的所有规则文件，包括用户习惯偏好。Agent在与用户交互时，应自动应用：

- **沟通方式**: 根据 USER-XXX.md 中的偏好调整沟通风格
- **输出格式**: 根据 USER-XXX.md 中的偏好调整输出格式
- **详细程度**: 根据 USER-XXX.md 中的偏好调整详细程度
- **决策方式**: 根据 USER-XXX.md 中的偏好调整建议方式

### 6.4 经验提醒机制（主动式）

在适当时机，根据 mcp_Memory 检索结果，主动提醒相关经验：

```
[经验提醒]
⚠️ 历史提醒: 类似问题在 PROB-003 中出现过
📝 建议方案: 可以参考当时的解决方案
🔍 预防措施: 建议增加 XXX 检查环节
📁 相关文件: path/to/file.ts
🔗 记忆ID: issue_record:I007
```

### 6.5 上下文自动加载（TRAE原生）

TRAE IDE 在每次对话开始时自动执行以下操作：

```
[TRAE自动加载流程]
1. 检查 .trae/memory/project_state.json
2. 如果存在 → 加载 L2 工作记忆（project_state, task_state）
3. 自动注入 L1 热记忆（rules/ 目录下的所有规则）
4. 根据当前项目/模块，预检索 L3 情景记忆（最近问题）
```

**实现方式**：TRAE IDE 原生支持，无需额外开发。

## 7. 知识更新流程

### 7.1 问题记录触发点

- 遇到Bug时
- 评审发现问题时
- 部署失败时
- 任何需要复盘的问题

### 7.2 习惯更新触发点

- 用户明确提出偏好时
- 观察到用户的固定行为模式时
- 用户反馈沟通方式需要调整时

### 7.3 经验总结触发点

- 项目完成时
- 里程碑完成时
- 重大问题解决后

### 7.4 记忆压缩提炼（经验压缩谱系）

基于"经验压缩谱系"理论，定期将原始经验提炼为更高层次的知识：

```
原始经验 → 情景记忆 → 程序性技能 → 声明性规则
   │         │          │           │
   ▼         ▼          ▼           ▼
  1:1      5-20x     50-500x    1000x+  （压缩倍率）
```

**压缩提炼流程**：
1. 积累3-5个同类问题记录
2. 提炼为可复用的Skill/流程
3. 更新为Rules中的约束条件
4. 定期回顾和优化

## 8. 知识检索方法

### 8.1 关键词检索

可以通过以下关键词检索经验：

- **问题类型**: 技术问题、流程问题、沟通问题
- **技术领域**: 前端、后端、数据库、部署
- **严重程度**: 高、中、低
- **时间范围**: 最近1个月、最近3个月、全部

### 8.2 相似度匹配

遇到新问题时，自动匹配历史相似问题：

- 计算问题描述的相似度
- 找出相似度最高的3个历史问题
- 提供参考解决方案
- 提醒可能的风险

### 8.3 项目/模块过滤

检索时优先过滤：
- 当前项目
- 当前模块
- 当前项目阶段

## 9. 目录结构（基于TRAE原生约定）

### 9.1 整体架构

```
[TRAE IDE 记忆系统整体架构]
.trae/
├── memory/                     # L2 工作记忆（TRAE原生，KV持久化）
│   ├── project_state.json      # project_state:main
│   ├── task_history.json       # 任务历史
│   ├── agent_states.json       # Agent状态
│   └── snapshots/              # 状态快照
│
├── rules/                      # L1 热记忆（TRAE自动加载）
│   ├── 00_index.md
│   ├── 01_security-constraints.md
│   ├── 02_standards.md
│   ├── 03_workflow.md
│   ├── 04_experience-knowledge.md  # 本文件
│   └── experience/             # L3 情景记忆（文档化）
│       ├── projects/           # 按项目组织
│       │   ├── PROJ-001-AliceGo/
│       │   │   ├── problems/   # 该项目遇到的问题
│       │   │   ├── decisions/  # 该项目的架构决策
│       │   │   ├── lessons/    # 该项目的经验教训
│       │   │   └── summary.md
│       │   └── index.md
│       ├── modules/            # 按模块组织（跨项目复用）
│       ├── cross-project/      # 跨项目可复用经验
│       └── preferences/        # 用户习惯偏好
│
└── docs/
    ├── reference/memory-system.md  # TRAE原生记忆系统文档
    └── memory-usage.md         # mcp_Memory使用规范
```

### 9.2 L3 情景记忆目录（文档化经验）

```
.trae/rules/experience/
├── projects/                   # 按项目组织
│   ├── PROJ-001-AliceGo/
│   │   ├── problems/           # 该项目遇到的问题（对应mcp_Memory.issue_record）
│   │   │   ├── PROB-001.md     # 问题详细文档
│   │   │   ├── PROB-002.md
│   │   │   └── index.md
│   │   ├── decisions/          # 该项目的架构决策（对应mcp_Memory.important_decision）
│   │   │   ├── DEC-001.md      # 决策详细文档
│   │   │   └── index.md
│   │   ├── lessons/            # 该项目的经验教训
│   │   │   ├── LESSON-001.md
│   │   │   └── index.md
│   │   └── summary.md          # 项目总结
│   └── index.md
│
├── modules/                    # 按模块组织（跨项目复用）
│   ├── authentication/
│   ├── database/
│   ├── deployment/
│   └── frontend/
│
├── cross-project/              # 跨项目可复用经验
│   ├── patterns/               # 设计模式
│   ├── pitfalls/               # 常见坑
│   └── best-practices/         # 最佳实践
│
└── preferences/                # 用户习惯偏好（L1热记忆的一部分）
    ├── USER-001.md
    └── index.md
```

### 9.3 关键说明

| 目录 | 记忆层级 | TRAE机制 | 持久化方式 |
|------|---------|----------|-----------|
| `.trae/memory/` | L2 工作记忆 | mcp_Memory | JSON文件 |
| `.trae/rules/*.md` | L1 热记忆 | System Prompt | 自动加载 |
| `.trae/rules/experience/` | L3 情景记忆 | 文档检索 | Markdown文件 |
| IDE代码索引 | L4 结构化记忆 | IDE原生 | 内存索引 |
| Git历史 | L4 结构化记忆 | Git命令 | 文件系统 |

## 10. 注意事项（基于TRAE机制的特殊要求）

### 10.1 记忆操作规范

1. **L2工作记忆（mcp_Memory）操作规范**：
   - ❌ 禁止直接修改 `.trae/memory/` 下的JSON文件
   - ✅ 必须通过 mcp_Memory API 进行操作（create_entities, add_observations等）
   - ✅ 遵循 memory-usage.md 中的数据格式规范
   - ✅ 使用标准的Key格式：`{type}:{identifier}`

2. **L1热记忆（rules目录）操作规范**：
   - ✅ 可以直接修改 `.md` 文件
   - ✅ TRAE IDE 会自动重新加载 rules 目录下的文件
   - ✅ 文件修改后，下一轮对话立即生效

3. **L3情景记忆（experience目录）操作规范**：
   - ✅ 可以直接修改 `.md` 文件
   - ✅ 建议与 mcp_Memory 中的索引保持同步
   - ✅ 文档路径应在 mcp_Memory 中记录

### 10.2 数据一致性保证

1. **双层存储同步**：
   - L3情景记忆采用"mcp_Memory索引 + 文件系统详情"的双层存储
   - 创建问题记录时，同时写入 mcp_Memory.issue_record 和 experience/projects/.../PROB-XXX.md
   - 更新时保持两者同步

2. **状态验证**：
   - 从断点恢复时，必须验证 `.trae/memory/project_state.json` 与实际文件的一致性
   - 状态不一致时，以文件系统为准
   - 参考 state-management.md 中的一致性检查流程

### 10.3 最佳实践

1. **及时记录**: 遇到问题后尽快记录，避免遗忘细节
2. **真实客观**: 记录要真实客观，不回避问题
3. **分类清晰**: 按照分类规范记录，便于检索
4. **定期回顾**: 定期回顾经验库，提取可复用的知识
5. **隐私保护**: 用户习惯记录注意保护隐私
6. **持续更新**: 经验知识需要持续更新和完善

### 10.4 避免重复发明轮子

- ✅ 优先使用 TRAE IDE 原生能力（mcp_Memory、代码索引、Git历史）
- ✅ 不要自己实现状态管理、断点续传等已有功能
- ✅ 查阅 `docs/` 目录下的原生文档后再做设计

---

*最后更新：2026-05-31*
