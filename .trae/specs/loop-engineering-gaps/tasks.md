# AliceGo Loop Engineering 差距分析与改进 - 实施计划

## [x] Task 1: 设计Loop拓扑回环机制
- **Priority**: high
- **Depends On**: None
- **Description**: 
  - 在03_workflow.md中为每个评审步骤（步骤4/12/17/21）增加失败回退路径定义
  - 定义最大重试次数（Stopping Rule）
  - 定义成功跳转路径
  - 将单向链式流程改造为具备回环的Loop拓扑
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `human-judgment` TR-1.1: 步骤4/12/17/21的定义中包含「失败回退路径」、「最大重试次数」、「成功跳转路径」
  - `human-judgment` TR-1.2: Loop拓扑图清晰展示回环机制，无死循环
- **Notes**: 需要修改03_workflow.md，保持向后兼容性

## [x] Task 2: 实现Budget预算控制规则
- **Priority**: high
- **Depends On**: None
- **Description**: 
  - 创建新规则文件05_loop-budget.md
  - 定义每步token预算上限
  - 定义单任务最大迭代次数
  - 定义项目级总预算阈值
  - 定义预算耗尽时的自动降级或终止策略
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic` TR-2.1: 05_loop-budget.md文件存在且包含完整的预算规则定义
  - `human-judgment` TR-2.2: 预算规则合理，包含预警机制和降级策略
- **Notes**: 预算参数需要可配置，支持不同项目自定义

## [x] Task 3: 设计Automations自动触发规则
- **Priority**: high
- **Depends On**: Task 1
- **Description**: 
  - 创建新规则文件06_loop-automations.md
  - 定义文件变更自动触发测试规则
  - 定义测试失败自动触发修复流程规则
  - 定义评审通过自动进入下一步规则
  - 定义预算预警自动通知规则
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic` TR-3.1: 06_loop-automations.md文件存在且包含完整的自动触发规则
  - `human-judgment` TR-3.2: 触发规则逻辑合理，包含条件判断和执行动作
- **Notes**: 需要确认TRAE IDE是否支持文件变更监听

## [x] Task 4: 增强State状态管理机制
- **Priority**: medium
- **Depends On**: Task 1, Task 2
- **Description**: 
  - 更新04_experience-knowledge.md，增加Loop状态机定义
  - 扩展project_state.json结构，增加回退状态记录
  - 增加预算状态追踪字段（已消耗token、剩余预算、预警状态）
  - 更新断点续传流程，支持回退状态恢复
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `programmatic` TR-4.1: project_state.json包含回退状态字段（last_success_step、fail_reason、retry_count）
  - `programmatic` TR-4.2: 断点续传时能够正确恢复到上次成功状态
  - `human-judgment` TR-4.3: 状态管理逻辑清晰，无数据丢失风险
- **Notes**: 需要保持与现有状态结构的向后兼容性

## [x] Task 5: 设计Worktrees并行开发机制
- **Priority**: medium
- **Depends On**: Task 1
- **Description**: 
  - 创建新规则文件07_loop-worktrees.md
  - 定义前后端任务并行分配规则
  - 定义多特性并行开发规则
  - 设计Git Worktree隔离机制
  - 更新task-decomposition Skill，支持并行任务生成
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic` TR-5.1: 07_loop-worktrees.md文件存在且包含完整的并行机制定义
  - `human-judgment` TR-5.2: 并行机制合理，包含资源隔离和冲突解决策略
- **Notes**: 需要确认TRAE IDE是否支持Git Worktree操作

## [x] Task 6: 更新README文档
- **Priority**: low
- **Depends On**: Task 1, Task 2, Task 3, Task 4, Task 5
- **Description**: 
  - 更新README.md，反映Loop Engineering改进内容
  - 增加Loop拓扑图
  - 增加Budget、Automations、Worktrees的说明
  - 更新核心特性描述，突出Loop原语完整性
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5
- **Test Requirements**:
  - `human-judgment` TR-6.1: README准确反映当前Loop Engineering能力
  - `human-judgment` TR-6.2: 文档结构清晰，易于理解
- **Notes**: 文档更新应在所有功能实现完成后进行

## [x] Task 7: 集成测试验证
- **Priority**: medium
- **Depends On**: Task 1, Task 2, Task 3, Task 4, Task 5
- **Description**: 
  - 运行完整的26步流程测试
  - 验证回环机制（评审失败→回退修复→重试）
  - 验证预算控制（超过预算阈值时触发预警）
  - 验证自动触发（文件变更触发测试）
  - 验证状态管理（断点续传支持回退状态恢复）
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5
- **Test Requirements**:
  - `programmatic` TR-7.1: 完整流程测试通过，无死循环
  - `programmatic` TR-7.2: 回环机制正确执行（评审失败后回退到指定步骤）
  - `programmatic` TR-7.3: 预算控制生效（超过阈值时触发预警或终止）
  - `programmatic` TR-7.4: 自动触发机制工作（文件变更触发测试）
  - `programmatic` TR-7.5: 状态管理正确（断点续传恢复回退状态）
- **Notes**: 需要编写集成测试用例

## 任务依赖关系图

```
Task 1 (Loop拓扑设计) ──────────────────────┐
         │                                   │
         ▼                                   │
Task 2 (Budget预算控制) ───────┐             │
         │                     │             │
         ▼                     ▼             ▼
Task 3 (Automations自动触发) ──┴──┐     Task 5 (Worktrees并行)
         │                        │            │
         ▼                        ▼            ▼
Task 4 (State状态管理) ───────────┴───────────┴──┐
                                                  │
                                                  ▼
                                         Task 6 (更新README)
                                                  │
                                                  ▼
                                         Task 7 (集成测试)
```
