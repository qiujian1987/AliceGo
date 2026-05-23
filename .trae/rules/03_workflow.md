# 流程调度规则（L1）

## 1. 流程概述

本规则定义SOLO Coder在项目开发过程中的28步标准流程。SOLO Coder作为主控，协调各专业Agent完成项目开发。

## 1.1 Agent调用规范（强制要求）

**SOLO Coder的职责**：
- **必须**通过调用专业Agent来执行任务
- **禁止**直接调用Skill而不经过专业Agent
- **必须**等待专业Agent完成后再进入下一步

**调用链路**（强制执行）：
```
SOLO Coder → 调用专业Agent（如@team-lead、@qa）→ Agent使用Skill执行任务
```

**违规示例**：
```
❌ SOLO Coder直接调用task-decomposition Skill
✅ SOLO Coder调用@team-lead → @team-lead调用task-decomposition Skill
```

**正确示例**：
```
步骤15（任务拆解）：
1. SOLO Coder识别需要任务拆解
2. SOLO Coder调用@team-lead Agent
3. @team-lead Agent调用task-decomposition Skill
4. @team-lead Agent返回任务拆解结果
5. SOLO Coder验证输出文件
```

---

## 2. 完整流程定义

### 第一阶段：项目初始化与需求分析

**步骤1：项目初始化**
- **执行者**：@devops
- **触发条件**：用户启动新项目
- **输入**：用户需求概述
- **输出**：
  - 项目目录结构
  - `.git` 初始化
  - `mcp_Memory` 初始化项目状态
- **命令**：`/start` 或 `@devops`

---

**步骤2：需求分析**
- **SOLO Coder职责**：调用 @team-lead Agent指导需求分析
- **专业Agent职责**：@team-lead 调用 `requirement-analyzer` Skill 执行需求分析
- **触发条件**：项目初始化完成
- **输入**：用户需求描述
- **输出**：`design/project_overview/requirements_spec.md`
- **文档路径**：`design/project_overview/requirements_spec.md`
- **文件操作要求**：必须通过 `file-operation.createFile()` 创建文档
- **SOLO Coder操作**：
  1. **调用 @team-lead Agent**（必须）
  2. 等待@team-lead Agent完成需求分析
  3. 验证输出文件存在

---

**步骤3：特性需求分析**
- **SOLO Coder职责**：调用 @feature-analyst Agent执行特性需求分析
- **专业Agent职责**：@feature-analyst 调用 `requirement-analyzer` Skill 执行特性需求分析
- **触发条件**：需求分析完成
- **输入**：`design/project_overview/requirements_spec.md`
- **输出**：
  - `design/features/feature-{序号}/requirements.md`（每个特性一个文件，**命名规范强制**）
  - 特性列表：`design/project_overview/features_list.md`
- **命名规范（强制执行）**：
  - 特性ID格式：`feature-{序号}`（序号3位数字，如 feature-001）
  - 目录命名：`design/features/feature-{序号}/`
  - 文件命名：`requirements.md`（固定名称）
- **MECE原则（强制执行）**：
  - **Mutually Exclusive（相互独立）**：每个功能点只属于一个特性，无重叠
  - **Collectively Exhaustive（完全穷尽）**：所有功能点都有归属，无遗漏
  - 必须提交MECE验证报告
- **文档要素规范（强制执行）**：
  - 必须包含9个章节：特性基本信息、用户故事、功能需求、数据需求、界面需求、验收标准、技术约束、依赖关系、风险与假设
  - 功能需求编号：`FR-{feature-id}-{序号}`
  - 验收标准编号：`AC-{feature-id}-{序号}`
- **文件操作要求**：必须通过 `file-operation.createFile()` 创建文档
- **SOLO Coder操作**：
  1. **调用 @feature-analyst Agent**（必须）
  2. 等待@feature-analyst Agent完成特性需求分析
  3. 验证输出文件存在
  4. **验证命名规范**：检查特性ID、目录名、文件名是否符合规范
  5. **验证MECE原则**：检查特性划分是否符合MECE原则
  6. **验证文档要素**：检查是否包含所有必需章节

---

**步骤4：需求评审**
- **SOLO Coder职责**：调用 @req-reviewer Agent执行需求评审
- **专业Agent职责**：@req-reviewer 执行需求评审
- **触发条件**：
  1. 步骤3完成（状态=completed）
  2. 迭代次数<3
- **前置检查**：
  1. 查询mcp_Memory确认步骤3状态
  2. 验证输入文档存在
  3. 确认@req-reviewer Agent可用
- **输入**：`design/project_overview/requirements_spec.md` + `design/features/*/requirements.md`
- **评审内容（强制执行）**：
  1. **规范性检查（第一优先级）**：
     - 命名规范：特性ID格式、目录命名、文件命名
     - **MECE原则检查**：
       - 相互独立（Mutually Exclusive）：每个功能点只属于一个特性
       - 完全穷尽（Collectively Exhaustive）：所有功能点都有归属
     - 文档要素完整性：9个必需章节
     - 编号规范：功能需求编号、验收标准编号
     - **规范性检查不通过，直接判定评审不通过**
  2. **内容质量检查（第二优先级）**：
     - 完整性、准确性、可测试性、可行性、依赖关系
- **输出**：
  - 评审报告：`design/project_overview/reviews/requirements-{timestamp}.md`
  - 反馈JSON：`design/project_overview/feedback/req-review-{timestamp}.json`
  - 迭代次数更新（mcp_Memory）
  - 步骤状态更新（mcp_Memory）
- **迭代控制**：最多3次，通过mcp_Memory记录
- **强制规则**：
  1. **必须调用 @req-reviewer Agent**（强制）
  2. SOLO Coder不得自行执行评审
  3. 必须等待@req-reviewer Agent完成评审
  4. **评审报告必须包含规范性检查结果**
- **验证机制**：评审完成后检查`verified_by`字段是否为`@req-reviewer`
- **SOLO Coder操作**：
  1. **调用 @req-reviewer Agent**（必须）
  2. 等待@req-reviewer Agent完成评审
  3. 检查评审结果
  4. 如果不通过且迭代<3次，反馈给前置Agent优化
  5. 如果不通过且迭代=3次，升级给用户决策

---

**步骤5：需求确认**
- **执行者**：SOLO Coder + 用户
- **触发条件**：需求评审通过
- **输入**：评审报告和反馈
- **输出**：用户确认记录（mcp_Memory）

---

### 第二阶段：系统设计

**步骤6：特性规划确认**
- **执行者**：SOLO Coder + 用户
- **触发条件**：需求确认完成
- **输入**：特性列表和划分方案
- **输出**：用户确认记录（mcp_Memory）

---

**步骤7：特性需求文档确认**
- **执行者**：SOLO Coder + 用户
- **触发条件**：特性规划确认完成
- **输入**：所有特性需求文档
- **输出**：用户确认记录（mcp_Memory）

---

**步骤8：后端架构设计**
- **SOLO Coder职责**：调用 @architect Agent执行后端架构设计
- **专业Agent职责**：@architect 调用 `architecture-planner` Skill 执行架构设计
- **触发条件**：特性需求文档确认完成
- **输入**：`design/project_overview/requirements_spec.md` + `design/features/*/requirements.md`
- **输出**：`design/project_overview/backend_architecture.md`
- **文件操作要求**：必须通过 `file-operation.createFile()` 创建文档
- **SOLO Coder操作**：
  1. **调用 @architect Agent**（必须）
  2. 等待@architect Agent完成架构设计
  3. 验证输出文件存在

---

**步骤9：前端架构设计**
- **SOLO Coder职责**：调用 @frontend-designer Agent执行前端架构设计
- **专业Agent职责**：@frontend-designer 调用 `frontend-design` Skill 执行前端架构设计
- **触发条件**：后端架构设计完成
- **输入**：`design/project_overview/requirements_spec.md` + `design/features/*/requirements.md`
- **输出**：`design/project_overview/frontend_architecture.md`
- **文件操作要求**：必须通过 `file-operation.createFile()` 创建文档
- **SOLO Coder操作**：
  1. **调用 @frontend-designer Agent**（必须）
  2. 等待@frontend-designer Agent完成前端架构设计
  3. 验证输出文件存在

---

**步骤10：数据模型设计**
- **SOLO Coder职责**：调用 @dba Agent执行数据模型设计
- **专业Agent职责**：@dba 调用 `database-designer` Skill 执行数据模型设计
- **触发条件**：前端架构设计完成
- **输入**：`design/project_overview/backend_architecture.md` + `design/features/*/requirements.md`
- **输出**：
  - `design/project_overview/data_model.md`
  - `database/schema/schema.sql`
- **文件操作要求**：必须通过 `file-operation.createFile()` 创建文档
- **SOLO Coder操作**：
  1. **调用 @dba Agent**（必须）
  2. 等待@dba Agent完成数据模型设计
  3. 验证输出文件存在

---

**步骤11：API设计**
- **SOLO Coder职责**：调用 @architect Agent执行API设计
- **专业Agent职责**：@architect 调用 `api-designer` Skill 执行API设计
- **触发条件**：数据模型设计完成
- **输入**：`design/project_overview/backend_architecture.md` + `design/project_overview/data_model.md` + `design/features/*/requirements.md`
- **输出**：`design/project_overview/api_contracts.md` + `design/features/*/api.md` + `design/project_overview/api_checklist.md`
- **文件操作要求**：必须通过 `file-operation.createFile()` 创建文档
- **API完整性检查清单（必须完成）**：
  1. **CRUD操作完整性**：每个主要实体必须有Create/Read/Update/Delete端点
  2. **数据模型覆盖**：所有数据模型表必须有对应的API
  3. **特性需求覆盖**：每个特性需求必须有对应的API实现
  4. **输入验证**：所有API必须有输入参数验证规则
  5. **错误处理**：所有API必须有错误响应格式定义
  6. **认证授权**：所有API必须有认证/授权说明
  7. **分页机制**：列表类API必须有分页说明
  8. **速率限制**：所有API必须有速率限制说明
  9. **文档完整性**：每个API必须有示例请求和响应
  10. **版本管理**：API版本策略必须明确
- **完整性验证文件**：生成 `design/project_overview/api_checklist.md`，记录每个检查项的完成状态
- **验证机制**：
  - API设计完成后，必须检查所有特性都有对应的API
  - 必须检查所有数据模型都有对应的CRUD操作
  - 完整性检查结果记录到mcp_Memory
  - 只有完整性检查通过后才能进入设计评审
- **SOLO Coder操作**：
  1. **调用 @architect Agent**（必须）
  2. 等待@architect Agent完成API设计
  3. 验证API完整性检查通过
  4. 确认所有检查项都已完成

---

**步骤12：设计评审**
- **SOLO Coder职责**：调用 @design-reviewer Agent执行设计评审
- **专业Agent职责**：@design-reviewer 执行设计评审
- **触发条件**：
  1. 步骤8完成（状态=completed）
  2. 步骤9完成（状态=completed）
  3. 步骤10完成（状态=completed）
  4. 步骤11完成（状态=completed，且API完整性检查通过）
  5. 迭代次数<3
- **前置检查**：
  1. 查询mcp_Memory确认步骤8、9、10、11状态
  2. 验证所有输入文档存在
  3. 验证API完整性检查通过
  4. 确认@design-reviewer Agent可用
- **输入**：
  - `design/project_overview/backend_architecture.md`
  - `design/project_overview/frontend_architecture.md`
  - `design/project_overview/data_model.md`
  - `design/project_overview/api_contracts.md`
  - `design/project_overview/api_checklist.md`
- **评审范围**：
  - 后端架构设计（技术选型、模块划分、数据流）
  - 前端架构设计（组件设计、交互流程、页面结构）
  - 数据模型设计（表结构、关系设计、索引设计）
  - API设计（接口定义、CRUD完整性、文档完整性）
- **输出**：
  - 评审报告：`design/project_overview/reviews/design-{timestamp}.md`
  - 反馈JSON：`design/project_overview/feedback/design-review-{timestamp}.json`
  - 步骤状态更新（mcp_Memory）
- **迭代控制**：最多3次，通过mcp_Memory记录
- **强制规则**：
  1. **必须调用 @design-reviewer Agent**（强制）
  2. SOLO Coder不得自行执行评审
  3. 必须等待@design-reviewer Agent完成评审
- **验证机制**：评审完成后检查`verified_by`字段是否为`@design-reviewer`
- **SOLO Coder操作**：
  1. **调用 @design-reviewer Agent**（必须）
  2. 等待@design-reviewer Agent完成评审
  3. 检查评审结果
  4. 如果不通过且迭代<3次，反馈给相关设计Agent优化
  5. 如果不通过且迭代=3次，升级给用户决策

---

**步骤13：设计修改与确认**
- **执行者**：相关设计Agent（@architect、@frontend-designer、@dba）
- **触发条件**：设计评审不通过（需要修改）
- **输入**：评审反馈JSON
- **输出**：更新后的设计文档
- **修改范围**：根据评审反馈更新以下文档（如需要）：
  - `design/project_overview/backend_architecture.md`
  - `design/project_overview/frontend_architecture.md`
  - `design/project_overview/data_model.md`
  - `design/project_overview/api_contracts.md`
- **SOLO Coder操作**：根据反馈分配修改任务给对应Agent

---

**步骤14：设计确认**
- **执行者**：SOLO Coder + 用户
- **触发条件**：设计评审通过
- **输入**：所有设计文档和评审报告
- **输出**：用户确认记录（mcp_Memory）

---

**步骤15：任务拆解**
- **SOLO Coder职责**：调用 @team-lead Agent执行任务拆解
- **专业Agent职责**：@team-lead 调用 `task-decomposition` Skill 执行具体任务拆解流程
- **触发条件**：设计确认完成
- **前置检查**：
  1. 查询mcp_Memory确认步骤14状态为completed
  2. 验证 `design/features/` 目录存在且包含特性文档
  3. 统计特性数量，确定任务拆解范围
- **输入**：所有设计文档（架构、数据模型、API、特性需求）
- **输出**（必须全部完成才算步骤完成）：
  1. `design/project_overview/project_plan.md` - 项目总体计划
  2. `design/project_overview/tasks/{task-id}.md` - 每个任务一个文件（项目级任务）
  3. `design/features/{feature-id}/tasks/{task-id}.md` - **每个特性下的任务文件**（特性级任务）
- **Skill调用**：`task-decomposition` - 任务拆解Skill，**由@team-lead Agent调用**
- **文件操作要求**：必须通过 `file-operation.createFile()` 创建文档，通过 `file-operation.createDirectory()` 创建目录
- **完整性检查（必须全部通过）**：
  1. ✅ `project_plan.md` 存在且内容不为空
  2. ✅ `design/project_overview/tasks/` 目录存在且包含任务文件
  3. ✅ **每个特性目录下都存在 `tasks/` 子目录**
  4. ✅ **每个特性的 `tasks/` 目录下至少有一个任务文件**
  5. ✅ 任务数量与特性需求相匹配
- **SOLO Coder操作**：
  1. **调用 @team-lead Agent**（必须）
  2. 等待@team-lead Agent完成任务拆解
  3. 验证输出文件存在
  4. 验证任务完整性

---

**步骤16：测试用例设计**
- **SOLO Coder职责**：调用 @qa Agent执行测试用例设计
- **专业Agent职责**：@qa 调用 `test-case-design` Skill 执行具体测试用例生成流程
- **触发条件**：任务拆解完成
- **输入**：`design/project_overview/project_plan.md` + `design/features/*/requirements.md`
- **输出**：
  - `design/features/*/test-cases.md`（**每个特性的测试用例，缺一不可**）
  - `design/project_overview/test-coverage-checklist.md`（测试用例完整性检查清单）
- **Skill调用**：`test-case-design` - 测试用例设计Skill，**由@qa Agent调用**
- **文件操作要求**：必须通过 `file-operation.createFile()` 创建所有文档
- **完整性验证要求**：
  1. QA Agent 必须先列出所有特性
  2. 为**每个特性**都生成测试用例
  3. 生成完整性检查清单并保存
  4. **SOLO Coder必须验证**所有特性都有对应的 `test-cases.md` 文件
- **SOLO Coder操作**：
  1. **调用 @qa Agent**（必须）
  2. 等待@qa Agent完成测试用例设计
  3. 读取 `test-coverage-checklist.md` 验证完整性
  4. 如果有特性缺少测试用例，**再次调用@qa Agent补充生成**
  5. 确认所有测试用例文件都存在后，再进入下一步

---

**步骤17：测试评审**
- **SOLO Coder职责**：调用 @test-reviewer Agent执行测试评审
- **专业Agent职责**：@test-reviewer 调用 `test-review` Skill 执行测试评审
- **触发条件**：
  1. 步骤16完成（状态=completed）
  2. 迭代次数<3
- **前置检查**：
  1. 查询mcp_Memory确认步骤16状态
  2. 验证所有特性的 `test-cases.md` 文件都存在
  3. 验证 `test-coverage-checklist.md` 文件存在
  4. 确认@test-reviewer Agent可用
- **输入**：
  - `design/features/*/test-cases.md`（所有特性的测试用例）
  - `design/project_overview/test-coverage-checklist.md`
- **输出**：
  - 评审报告：`design/project_overview/reviews/test-{timestamp}.md`
  - 反馈JSON：`design/project_overview/feedback/test-review-{timestamp}.json`
  - 步骤状态更新（mcp_Memory）
- **Skill调用**：`test-review` - 测试评审Skill，**由@test-reviewer Agent调用**
- **迭代控制**：最多3次，通过mcp_Memory记录
- **强制规则**：
  1. **必须调用 @test-reviewer Agent**（强制）
  2. SOLO Coder不得自行执行评审
  3. 必须等待@test-reviewer Agent完成评审
  4. @test-reviewer 必须**首先检查完整性**，如果有特性缺少测试用例，必须标记为"不通过"
- **验证机制**：
  1. 评审完成后检查`verified_by`字段是否为`@test-reviewer`
  2. 检查评审报告第一部分是否包含完整性检查结果
- **SOLO Coder操作**：
  1. **调用 @test-reviewer Agent**（必须）
  2. 等待@test-reviewer Agent完成测试评审
  3. 检查评审结果
  4. 如果不通过且迭代<3次，反馈给@qa Agent优化
  5. 如果不通过且迭代=3次，升级给用户决策

---

**步骤18：测试确认**
- **执行者**：SOLO Coder + 用户
- **触发条件**：测试评审通过
- **输入**：测试用例文档和评审报告
- **输出**：用户确认记录（mcp_Memory）

---

**步骤19：任务分配**
- **执行者**：SOLO Coder
- **触发条件**：测试确认完成
- **输入**：`design/project_overview/project_plan.md`
- **输出**：任务分配记录（mcp_Memory）
- **分配策略**：根据任务类型分配给对应Agent

---

**步骤20：TDD开发执行（按任务）**
- **SOLO Coder职责**：调用开发Agent（@backend-dev 或 @frontend-dev）执行TDD开发
- **专业Agent职责**：开发Agent调用 `code-generator` Skill 执行TDD开发
- **触发条件**：任务分配完成
- **前置检查**（强制）：
  1. 查询任务文档，确认是否有前端任务被遗漏
  2. **每个特性必须至少有1个前端任务和1个后端任务**
  3. 如果缺少前端任务，返回步骤15重新拆解
- **输入**：
  - 任务文档：`design/project_overview/tasks/{task-id}.md`
  - 任务文档：`design/features/{feature-id}/tasks/{task-id}.md`
  - 测试用例：`design/features/*/test-cases.md`
  - API文档：`design/features/*/api.md`
  - 前端架构：`design/project_overview/frontend_architecture.md`
- **输出**：
  - 后端代码文件：`src/server/*`
  - 前端代码文件：`src/client/*`
  - 测试结果：`tests/*`
- **TDD流程**：
  1. 读取测试用例
  2. 编写测试代码（初始状态为失败）
  3. 实现业务代码使测试通过
  4. 验证测试覆盖率达到95%以上
- **Skill调用**：`code-generator` - 代码生成Skill，**由开发Agent调用**
- **SOLO Coder操作**（详细流程）：
  1. **任务分组**：按负责人将任务分为后端任务组和前端任务组
  2. **后端任务执行**：
     - 调用 @backend-dev Agent
     - 等待完成后验证 `src/server/` 目录下的文件
     - 进入步骤21代码评审
  3. **前端任务执行**：
     - 调用 @frontend-dev Agent
     - 等待完成后验证 `src/client/` 目录下的文件
     - 进入步骤21代码评审
  4. **完整性验证**：
     - 确认所有后端任务都有对应的代码
     - 确认所有前端任务都有对应的代码
     - 确认没有遗漏的特性

---

**步骤21：代码评审（按任务）**
- **SOLO Coder职责**：调用 @code-reviewer Agent执行代码评审
- **专业Agent职责**：@code-reviewer 调用 `code-review` Skill 执行代码评审
- **触发条件**：
  1. 单个任务开发完成（状态=done）
  2. 迭代次数<3
- **前置检查**：
  1. 查询mcp_Memory确认任务状态
  2. 验证代码文件存在
  3. 确认@code-reviewer Agent可用
- **输入**：`src/server/` 或 `src/client/` 中的相关代码
- **输出**：
  - 评审报告：`design/project_overview/reviews/code-{task-id}-{timestamp}.md`
  - 反馈JSON：`design/project_overview/feedback/code-review-{task-id}-{timestamp}.json`
  - 步骤状态更新（mcp_Memory）
- **Skill调用**：`code-review` - 代码评审Skill，**由@code-reviewer Agent调用**
- **迭代控制**：最多3次，通过mcp_Memory记录
- **通过条件**：所有测试通过，代码符合规范
- **强制规则**：
  1. **必须调用 @code-reviewer Agent**（强制）
  2. SOLO Coder不得自行执行评审
  3. 必须等待@code-reviewer Agent完成评审
- **验证机制**：评审完成后检查`verified_by`字段是否为`@code-reviewer`
- **SOLO Coder操作**：
  1. **调用 @code-reviewer Agent**（必须）
  2. 等待@code-reviewer Agent完成代码评审
  3. 检查评审结果
  4. 如果不通过且迭代<3次，反馈给开发Agent修改
  5. 如果不通过且迭代=3次，升级给用户决策

---

**步骤22：代码修改与验证**
- **执行者**：@backend-dev 或 @frontend-dev
- **触发条件**：代码评审不通过（需要修改）
- **输入**：代码评审反馈JSON
- **输出**：修改后的代码文件
- **SOLO Coder操作**：根据反馈分配修改任务给对应开发Agent

---

**步骤23：测试执行**
- **执行者**：@qa
- **触发条件**：所有代码评审通过
- **输入**：测试用例和代码文件
- **输出**：
  - 测试报告：`design/project_overview/reports/test-report-{timestamp}.md`
  - 测试结果记录（mcp_Memory）
- **SOLO Coder操作**：调用 @qa 执行测试

---

### 第四阶段：验收与交付

**步骤24：最终验收**
- **执行者**：SOLO Coder + 用户
- **触发条件**：测试执行通过
- **输入**：
  - 所有项目文档
  - 测试报告
  - 代码文件
- **输出**：用户验收记录（mcp_Memory）

---

**步骤25：部署上线**
- **执行者**：@devops
- **触发条件**：最终验收通过
- **输入**：代码文件和部署配置
- **输出**：部署记录（mcp_Memory）
- **SOLO Coder操作**：调用 @devops 进行部署

---

**步骤26：项目总结**
- **执行者**：@team-lead
- **触发条件**：部署上线完成
- **输入**：所有项目文档和记录
- **输出**：`design/project_overview/project_summary.md`
- **SOLO Coder操作**：调用 @team-lead

---

## 3. 阶段汇总

| 阶段 | 步骤范围 | 说明 |
|------|---------|------|
| 第一阶段 | 1-5 | 项目初始化与需求分析 |
| 第二阶段 | 6-14 | 系统设计（架构、数据模型、API） |
| 第三阶段 | 15-23 | 任务规划与开发（TDD） |
| 第四阶段 | 24-26 | 验收与交付 |

---

## 4. 评审环节汇总

| 评审类型 | 步骤 | Agent | 评审范围 |
|---------|------|-------|---------|
| 需求评审 | 4 | @req-reviewer | 需求文档、特性需求 |
| 设计评审 | 12 | @design-reviewer | 架构、数据模型、API |
| 测试评审 | 17 | @test-reviewer | 测试用例 |
| 代码评审 | 21 | @code-reviewer | 开发代码 |

---

## 5. 关键依赖关系

```
步骤8: 后端架构设计
    ↓
步骤9: 前端架构设计
    ↓
步骤10: 数据模型设计
    ↓
步骤11: API设计（依赖数据模型）
    ↓
步骤12: 设计评审（覆盖架构+数据模型+API）
    ↓
步骤15: 任务拆解（依赖所有设计文档）
    ↓
步骤16: 测试用例设计（依赖任务文档）
    ↓
步骤20: TDD开发（依赖测试用例）
```

---

## 6. 状态检查要求

在进入任何步骤之前，必须：
1. 查询mcp_Memory确认前置步骤状态
2. 验证输入文档存在且完整
3. 只有前置步骤都完成才能继续

---

## 7. 迭代控制

所有评审环节（步骤4、12、17、21）：
- 最多迭代3次
- 通过mcp_Memory记录迭代次数
- 达到3次仍未通过时，升级给用户决策
