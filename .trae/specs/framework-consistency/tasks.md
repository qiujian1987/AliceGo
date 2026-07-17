# AliceGo 框架一致性完善 - 实施计划

## Phase 1: 文档一致性修复（P0-P2）

## [x] Task 1: 更新规则文件索引（00_index.md）
- **Priority**: high
- **Depends On**: None
- **Description**: 
  - 更新规则文件清单，包含7个规则文件（01-07）
  - 修正流程步骤数为26步
  - 更新描述以反映Loop拓扑特性
  - 更新最新更新日期为2026-07-12
  - 添加05_loop-budget.md、06_loop-automations.md、07_loop-worktrees.md的描述
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `human-judgment` TR-1.1: 规则文件清单包含7个规则文件
  - `human-judgment` TR-1.2: 流程步骤数为26步
  - `human-judgment` TR-1.3: 更新日期为2026-07-12
- **Notes**: 保持与03_workflow.md中定义的26步流程一致

## [x] Task 2: 更新Agent领地划分（02_standards.md）
- **Priority**: high
- **Depends On**: None
- **Description**: 
  - 修正Agent数量描述为14个
  - 在领地划分表中添加frontend-designer和ui-ux-reviewer
  - 更新权限约束描述
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `human-judgment` TR-2.1: Agent领地划分表包含14个Agent
  - `human-judgment` TR-2.2: frontend-designer和ui-ux-reviewer有明确的领地和职责
- **Notes**: 参考.trae/agents/目录下的实际Agent文件

## [x] Task 3: 更新框架进度文档（framework-progress.md）
- **Priority**: high
- **Depends On**: None
- **Description**: 
  - 移除不存在的目录引用（core/、init/、mailbox/）
  - 更新已完成工作列表，包含Loop Engineering改进内容
  - 更新待完善项状态，移除已完成的项
  - 更新最后更新日期为2026-07-12
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `human-judgment` TR-3.1: 目录结构与实际项目结构一致
  - `human-judgment` TR-3.2: 已完成工作列表准确反映当前状态
  - `human-judgment` TR-3.3: 更新日期为2026-07-12
- **Notes**: 参考.trae/目录的实际结构

## [x] Task 4: 新建memory-system.md文档
- **Priority**: high
- **Depends On**: None
- **Description**: 
  - 创建完整的记忆系统设计文档
  - 包含四层记忆架构说明（L1-L4）
  - 包含mcp_Memory与文件系统的交互策略
  - 包含状态持久化机制说明
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `human-judgment` TR-4.1: 文档包含四层记忆架构说明
  - `human-judgment` TR-4.2: 文档包含mcp_Memory交互策略
  - `human-judgment` TR-4.3: 文档结构清晰，易于理解
- **Notes**: 基于04_experience-knowledge.md中的记忆架构内容

## [x] Task 5: 更新状态管理文档（state-management.md）
- **Priority**: medium
- **Depends On**: Task 1
- **Description**: 
  - 更新project_state.json结构示例，添加回退状态字段（fallback_state）
  - 添加预算状态字段（budget）
  - 更新状态验证规则，包含回退状态验证
  - 更新最后更新日期为2026-07-12
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `human-judgment` TR-5.1: project_state.json结构包含回退状态字段
  - `human-judgment` TR-5.2: project_state.json结构包含预算状态字段
  - `human-judgment` TR-5.3: 更新日期为2026-07-12
- **Notes**: 保持与04_experience-knowledge.md中的状态定义一致

## [x] Task 6: 更新记忆使用规范（memory-usage.md）
- **Priority**: medium
- **Depends On**: Task 1
- **Description**: 
  - 更新项目状态结构示例，添加回退状态字段（fallback_state）
  - 添加预算状态字段（budget）
  - 更新记忆系统命名规范，包含新字段
  - 更新最后更新日期为2026-07-12
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `human-judgment` TR-6.1: 项目状态结构包含回退状态字段
  - `human-judgment` TR-6.2: 项目状态结构包含预算状态字段
  - `human-judgment` TR-6.3: 更新日期为2026-07-12
- **Notes**: 保持与04_experience-knowledge.md和05_loop-budget.md中的状态定义一致

## Phase 2: Loop相关组件评估与实现（P3）

## [x] Task 7: Loop相关Skill评估
- **Priority**: medium
- **Depends On**: Phase 1完成
- **Description**: 
  - 评估现有Skill（team-lead、task-decomposition等）能否覆盖Loop执行能力
  - 生成评估报告，明确哪些Loop能力可通过扩展现有Skill实现
  - 明确哪些需要新建Skill
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `human-judgment` TR-7.1: 评估报告包含现有Skill能力分析
  - `human-judgment` TR-7.2: 评估报告明确扩展方案或新建方案
- **Notes**: 评估后再决定是否新建Skill

## [x] Task 8: Loop协作者Agent评估
- **Priority**: medium
- **Depends On**: Phase 1完成
- **Description**: 
  - 评估现有Agent（team-lead、devops等）能否覆盖Loop协调能力
  - 生成评估报告，明确哪些Loop能力可通过扩展现有Agent实现
  - 明确哪些需要新建Agent
- **Acceptance Criteria Addressed**: AC-8
- **Test Requirements**:
  - `human-judgment` TR-8.1: 评估报告包含现有Agent能力分析
  - `human-judgment` TR-8.2: 评估报告明确扩展方案或新建方案
- **Notes**: 评估后再决定是否新建Agent

## Phase 3: 未来规划（P4）

## [x] Task 9: MCP服务器实现规划
- **Priority**: low
- **Depends On**: Phase 1完成
- **Description**: 
  - 规划Git MCP和Database MCP的实现优先级和时间表
  - 输出规划文档，包含技术方案和资源需求
- **Acceptance Criteria Addressed**: N/A
- **Test Requirements**:
  - `human-judgment` TR-9.1: 规划文档包含实现优先级和时间表
  - `human-judgment` TR-9.2: 规划文档包含技术方案概述
- **Notes**: P4内容，不纳入本次实施范围

## 任务依赖关系图

```
Phase 1: 文档一致性修复
├── Task 1 (更新规则文件索引) ─────────────┐
├── Task 2 (更新Agent领地划分) ────────────┼──→ Task 5 (更新状态管理文档)
├── Task 3 (更新框架进度文档) ─────────────┤
├── Task 4 (新建memory-system.md) ────────┘
└── Task 6 (更新记忆使用规范)

Phase 2: Loop相关组件评估
├── Task 7 (Loop相关Skill评估)
└── Task 8 (Loop协作者Agent评估)

Phase 3: 未来规划
└── Task 9 (MCP服务器实现规划)
```
