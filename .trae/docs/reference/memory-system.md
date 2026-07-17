# AliceGo 记忆系统设计

## 概述

AliceGo的记忆系统基于**四层记忆架构**设计，完全利用TRAE IDE的原生机制，实现从上下文感知到代码库理解的完整记忆能力。

## 四层记忆架构

### 架构总览

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         四层记忆架构                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  L4: 代码库结构化记忆 (Structured Memory)                               │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  IDE代码索引 + Git历史 + 文件系统                               │    │
│  │  → 代码语义理解、版本历史、模块依赖                              │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              ↑                                          │
│  L3: 项目情景记忆 (Episodic Memory)                                     │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  mcp_Memory索引 + 文件系统(.md文档)                             │    │
│  │  → 历史问题库、用户习惯偏好、项目经验总结                        │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              ↑                                          │
│  L2: 任务驱动工作记忆 (Working Memory)                                   │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  mcp_Memory KV存储                                              │    │
│  │  → project_state、task_state、loop_state、预算状态              │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              ↑                                          │
│  L1: 上下文感知热记忆 (Hot Memory)                                      │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  System Prompt注入 + 对话历史                                   │    │
│  │  → 零延迟访问、时刻感知当前状态                                  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 各层详细说明

#### L1: 上下文感知热记忆（Hot Memory）

**基于TRAE机制**：System Prompt注入 + 上下文窗口

**设计目标**：始终注入上下文窗口，零延迟访问，确保Agent时刻知道"我在哪、我是谁、该做什么"。

**实现方式**：

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

**动态注入触发点**：
- 打开新文件时
- 切换任务类型时
- 项目阶段变更时（通过 mcp_Memory 监听 project_state 变化）
- 用户明确要求时

---

#### L2: 任务驱动工作记忆（Working Memory）

**基于TRAE机制**：`mcp_Memory` + `.trae/memory/` 目录

**设计目标**：以任务为中心的状态机，支持断点续传，区别于通用场景的"最近N轮对话"。

**数据结构**：

```json
{
  "project_state": {
    "project_id": "proj-001",
    "status": "in_progress",
    "current_phase": "design",
    "progress_percent": 35,
    "milestones": {
      "requirement": "completed",
      "design": "in_progress",
      "development": "pending",
      "delivery": "pending"
    },
    "fallback_state": {
      "last_success_step": "step-11",
      "fail_reason": "API完整性检查未通过",
      "retry_count": 1,
      "max_retry_count": 3
    },
    "budget": {
      "total_budget": 1000000,
      "consumed_tokens": 350000,
      "remaining_tokens": 650000,
      "alert_status": "normal"
    }
  },
  "task_state": {
    "task_id": "task-001",
    "description": "设计用户认证API",
    "owner": "architect",
    "status": "in_progress",
    "dependencies": ["task-002"],
    "progress_percent": 60,
    "outputs": ["design/features/feature-001/api.md"]
  },
  "loop_state": {
    "current_loop": "design",
    "loop_iteration": 1,
    "max_loop_iteration": 3,
    "fallback_path": ["step-8", "step-9", "step-10", "step-11"],
    "success_path": ["step-12"]
  },
  "review_iteration": {
    "review_type": "design",
    "current_iteration": 1,
    "max_iteration": 3,
    "history": ["2026-07-10: 评审不通过 - API完整性问题"]
  }
}
```

**生命周期管理**：
- **创建**: 任务开始时，调用 `mcp_Memory.create_entities()` 创建 task_state
- **更新**: 每完成一个步骤，调用 `mcp_Memory.add_observations()` 更新状态
- **读取**: 需要时调用 `mcp_Memory.read_graph()` 获取状态
- **删除**: 任务完成后，保留记录用于复盘

---

#### L3: 项目情景记忆（Episodic Memory）

**基于TRAE机制**：`mcp_Memory`索引 + 文件系统（.md文档）

**设计目标**：记录项目过程中的经验知识，包括历史问题、用户习惯、项目总结，实现知识积累与复用。

**目录结构**：

```
.trae/rules/experience/
├── problems/           # 历史问题记录
│   ├── PROB-001.md
│   ├── PROB-002.md
│   └── ...
├── preferences/        # 用户习惯偏好
│   ├── USER-001.md
│   └── ...
└── projects/           # 项目经验总结
    ├── PROJ-001.md
    └── ...
```

**数据结构**：

```json
{
  "knowledge_index": {
    "problems": {
      "PROB-001": {
        "title": "Git提交命令错误",
        "type": "技术问题",
        "severity": "中",
        "solution": "使用单行提交信息，避免Here-String语法",
        "file_path": ".trae/rules/experience/problems/PROB-001.md"
      }
    },
    "preferences": {
      "USER-001": {
        "name": "用户A",
        "communication_style": "详细说明",
        "code_style": "简洁",
        "file_path": ".trae/rules/experience/preferences/USER-001.md"
      }
    },
    "projects": {
      "PROJ-001": {
        "name": "AliceGo",
        "status": "completed",
        "key_success_factors": ["Loop拓扑设计", "四层记忆架构"],
        "file_path": ".trae/rules/experience/projects/PROJ-001.md"
      }
    }
  }
}
```

**使用策略**：
- **自动加载**：每次对话开始时，自动加载最近10个相关历史问题和用户习惯偏好
- **主动检索**：遇到问题时，检查是否有类似历史问题
- **持续更新**：项目完成后及时总结经验教训

---

#### L4: 代码库结构化记忆（Structured Memory）

**基于TRAE机制**：IDE原生代码索引 + Git版本控制

**设计目标**：理解代码库的结构、语义和历史，支持代码导航、理解和重构。

**实现方式**：

```
[L4 结构化记忆]
├── IDE代码索引（TRAE原生）
│   ├── 符号索引: 类、函数、变量定义位置
│   ├── 依赖分析: 模块间依赖关系
│   ├── 代码导航: 跳转到定义、查找引用
│   └── 类型推断: TypeScript类型信息
│
└── Git版本控制（TRAE原生支持）
    ├── 版本历史: 提交记录、分支管理
    ├── 变更追踪: 代码变更历史
    ├── 代码对比: 分支差异、提交差异
    └── Worktree: 并行开发隔离
```

**使用策略**：
- **代码理解**：通过IDE索引理解代码结构和依赖关系
- **历史追溯**：通过Git查看代码变更历史
- **并行开发**：通过Git Worktree实现多特性并行开发

## mcp_Memory与文件系统的交互策略

### 数据同步机制

```
┌──────────────┐      索引写入      ┌──────────────┐
│ 文件系统      │ ────────────────→ │ mcp_Memory   │
│ (.md文档)    │ ←─────────────── │ (KV存储)     │
└──────────────┘      读取查询      └──────────────┘
```

**同步策略**：
1. **索引写入**：当新的经验知识文档创建或更新时，同步更新mcp_Memory中的索引
2. **读取查询**：查询经验知识时，先从mcp_Memory获取索引，再读取对应文档内容
3. **缓存策略**：常用知识缓存到mcp_Memory，减少文件系统访问

### 文件系统操作规范

**写入操作**：
1. 创建/更新经验知识文档
2. 更新mcp_Memory中的索引记录
3. 验证文档存在性和内容完整性

**读取操作**：
1. 从mcp_Memory获取文档索引
2. 根据索引读取文件系统中的文档
3. 验证文档内容与索引一致

## 状态持久化机制

### 持久化策略

```
┌─────────────────────────────────────────────────────────────────┐
│                        状态持久化流程                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  运行时状态                                                        │
│       │                                                          │
│       ↓ 定期保存 (每10分钟 / 关键步骤完成)                          │
│  ┌─────────────────┐                                             │
│  │ mcp_Memory KV   │ ← 主要持久化存储                              │
│  └────────┬────────┘                                             │
│           │                                                       │
│           ↓ 备份 (每小时)                                         │
│  ┌─────────────────┐                                             │
│  │ .trae/memory/   │ ← 文件系统备份                               │
│  │ project_state.json │                                          │
│  └────────┬────────┘                                             │
│           │                                                       │
│           ↓ 恢复                                                  │
│       断点续传                                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 持久化格式

**mcp_Memory存储**：
- 使用KV结构，支持复杂嵌套JSON
- 支持实体关系图（Graph）存储
- 支持观察记录（Observations）追加

**文件系统备份**：
```json
{
  "project_id": "proj-001",
  "snapshot_time": "2026-07-12T10:30:00Z",
  "project_state": { ... },
  "task_states": { ... },
  "loop_state": { ... },
  "budget_state": { ... }
}
```

### 断点续传机制

**断点保存**：
1. 项目中断时，自动保存当前步骤编号
2. 保存所有步骤的当前状态
3. 保存进行中文档的路径
4. 保存迭代次数记录

**断点恢复**：
1. 读取 `.trae/memory/project_state.json`
2. 确定当前步骤
3. 检查前置步骤是否完成
4. 从当前步骤继续执行

## 记忆系统命名规范

### 实体命名

| 类型 | 命名格式 | 示例 |
|------|---------|------|
| 项目状态 | `project_state:{project_id}` | `project_state:main` |
| 任务状态 | `task_state:{task_id}` | `task_state:task-001` |
| Loop状态 | `loop_state:{loop_id}` | `loop_state:main` |
| 评审迭代 | `review_iteration:{review_type}` | `review_iteration:design` |
| 重要决策 | `important_decision:{decision_id}` | `important_decision:decision-001` |
| 知识索引 | `knowledge_index` | `knowledge_index` |

### 问题记录命名

| 类型 | 命名格式 | 示例 |
|------|---------|------|
| 历史问题 | `PROB-{序号}` | `PROB-001` |
| 用户偏好 | `USER-{序号}` | `USER-001` |
| 项目总结 | `PROJ-{序号}` | `PROJ-001` |

## 安全与隐私

### 敏感信息处理

- **禁止存储**：明文密码、密钥、API密钥
- **加密存储**：敏感配置使用环境变量或加密存储
- **访问控制**：经验知识文档按项目隔离

### 数据清理

- **临时文件**：定期清理 `.trae/temp/` 目录
- **过期数据**：超过90天的历史问题标记为归档
- **项目归档**：项目完成后归档到 `.trae/rules/experience/projects/`

## 性能优化

### 缓存策略

- **L1热记忆**：始终在上下文窗口中，零延迟访问
- **L2工作记忆**：mcp_Memory内存存储，快速访问
- **L3情景记忆**：常用知识缓存到mcp_Memory索引
- **L4结构化记忆**：IDE索引缓存，快速代码导航

### 访问优化

- **批量读取**：减少mcp_Memory调用次数
- **索引优化**：知识索引按类型分组，便于快速查找
- **异步写入**：非关键操作异步写入，不阻塞主流程

## 扩展能力

### 支持的扩展方式

1. **新的记忆层**：在现有四层架构基础上添加新层
2. **新的知识类型**：扩展knowledge_index支持新的知识类型
3. **新的存储后端**：支持替换mcp_Memory为其他存储后端
4. **新的检索策略**：支持自定义知识检索算法

### 扩展接口

```json
{
  "memory_layer": {
    "name": "custom-layer",
    "type": "episodic",
    "storage_backend": "mcp_Memory",
    "retrieval_strategy": "keyword_search"
  }
}
```

## 与其他系统的集成

### TRAE IDE集成

- **规则文件自动加载**：TRAE IDE启动时自动加载 `.trae/rules/` 目录
- **mcp_Memory集成**：通过MCP协议与记忆服务器通信
- **代码索引集成**：利用IDE原生代码导航能力

### 项目生命周期集成

- **项目初始化**：创建记忆存储结构
- **项目进行中**：实时更新状态和经验知识
- **项目完成**：归档经验知识，总结项目经验

## 验证与测试

### 验证检查点

- [ ] L1热记忆：规则文件正确注入上下文
- [ ] L2工作记忆：状态正确持久化和恢复
- [ ] L3情景记忆：经验知识正确索引和检索
- [ ] L4结构化记忆：代码索引正确理解

### 测试用例

1. **状态持久化测试**：中断项目后恢复到正确步骤
2. **经验知识检索测试**：搜索历史问题返回正确结果
3. **断点续传测试**：从中间步骤继续执行
4. **并发访问测试**：多Agent同时访问记忆系统

## 向后兼容性

### 版本策略

- **向后兼容**：新增字段为可选，不影响现有状态文件格式
- **迁移工具**：提供状态文件格式迁移工具
- **版本标记**：状态文件包含版本号，支持版本检测

### 兼容性保证

- 现有状态文件格式保持不变
- 新增字段不会导致旧版本Agent出错
- 迁移过程不丢失数据
