# AliceGo 框架一致性完善 PRD

## Overview
- **Summary**: 完善AliceGo框架的文档一致性和组件完整性，修复规则文件索引、标准规范、框架进度等文档中的过期内容和不一致问题，评估并实现必要的Loop相关Skill和Agent组件。
- **Purpose**: 确保AliceGo框架文档与实际实现保持一致，消除技术债务，为Loop Engineering能力提供完整的支撑体系。
- **Target Users**: AliceGo用户、TRAE IDE用户、框架维护者

## Goals
- Phase 1：修复所有文档一致性问题（P0-P2）
- Phase 2：评估并实现必要的Loop相关组件（P3）
- Phase 3：规划未来MCP服务器实现（P4）

## Non-Goals (Out of Scope)
- 不涉及多Loop协同（Factory Model）- 未来方向
- 不涉及外部CI/CD系统集成 - 当前仅使用TRAE原生机制
- 不涉及Git MCP和Database MCP的实际实现（P4，未来方向）

## Background & Context

### 当前问题分析

经过全面审查，发现以下9个不完善之处：

| 优先级 | 问题类型 | 问题描述 | 影响范围 |
|--------|---------|---------|---------|
| **P0** | 文档不一致 | 00_index.md未更新，仍显示4个规则文件、28步流程 | 规则文件索引 |
| **P0** | 文档不一致 | 02_standards.md中Agent数量为13个，实际为14个 | Agent领地划分 |
| **P1** | 文档不一致 | framework-progress.md过期，引用不存在的目录（core/、init/、mailbox/） | 框架进度追踪 |
| **P1** | 文件缺失 | memory-system.md文件不存在，但被多处引用 | 文档完整性 |
| **P2** | 文档不一致 | state-management.md缺少回退状态、预算状态字段定义 | 状态管理 |
| **P2** | 文档不一致 | memory-usage.md缺少回退状态、预算状态字段定义 | 记忆系统 |
| **P3** | 组件缺失 | 缺少Loop相关Skill（loop-executor、loop-monitor、loop-coordinator） | Loop执行 |
| **P3** | 组件缺失 | 缺少Loop协作者Agent（loop-coordinator、loop-monitor） | Loop协调 |
| **P4** | MCP缺失 | 推荐的Git MCP和Database MCP未实现 | 外部工具连接 |

### 关键决策

1. **Phase 1优先**：先修复文档一致性问题，确保框架基础文档准确
2. **P3评估先行**：新建Skill/Agent前，先评估能否通过扩展现有组件覆盖
3. **P4延后**：Git MCP和Database MCP属于未来方向，不纳入本次范围

## Functional Requirements

### FR-1: 规则文件索引更新
- 更新00_index.md，包含所有7个规则文件
- 修正流程步骤数为26步
- 更新描述以反映Loop拓扑特性
- 更新最新更新日期

### FR-2: Agent领地划分更新
- 更新02_standards.md，修正Agent数量为14个
- 添加frontend-designer和ui-ux-reviewer到领地划分表

### FR-3: 框架进度文档更新
- 更新framework-progress.md，移除不存在的目录引用
- 更新已完成工作列表
- 更新待完善项状态

### FR-4: 新建memory-system.md文档
- 创建完整的记忆系统设计文档
- 包含四层记忆架构说明
- 包含mcp_Memory与文件系统的交互策略

### FR-5: 状态管理文档更新
- 更新state-management.md，添加回退状态字段定义
- 添加预算状态字段定义
- 更新project_state.json结构示例

### FR-6: 记忆使用规范更新
- 更新memory-usage.md，添加回退状态字段定义
- 添加预算状态字段定义
- 更新项目状态结构示例

### FR-7: Loop相关Skill评估与实现
- 评估现有Skill能否覆盖Loop执行能力
- 如需要，创建必要的Loop Skill

### FR-8: Loop协作者Agent评估与实现
- 评估现有Agent能否覆盖Loop协调能力
- 如需要，创建必要的Loop Agent

## Non-Functional Requirements

### NFR-1: 文档一致性
- 所有文档引用的文件必须存在
- 所有文档中的数字（步骤数、Agent数、Skill数）必须准确
- 所有文档的更新日期必须最新

### NFR-2: 向后兼容性
- 文档更新不应改变现有流程行为
- 新增字段应为可选，不影响现有状态文件格式

### NFR-3: 可维护性
- 文档结构清晰，易于理解和更新
- 新增组件遵循现有命名规范和结构

## Constraints

### Technical
- 必须基于TRAE现有机制
- 不引入新的外部依赖
- 遵循现有文件命名规范

### Business
- 保持与现有项目的向后兼容性
- 不影响当前开发流程

### Dependencies
- 依赖mcp_Memory进行状态持久化

## Assumptions
- TRAE IDE支持mcp_Memory的复杂状态结构存储
- 现有Skill和Agent可以通过扩展覆盖部分Loop功能

## Acceptance Criteria

### AC-1: 规则文件索引完整准确
- **Given**: 00_index.md已更新
- **When**: 查看规则文件清单
- **Then**: 包含7个规则文件，描述准确，日期最新
- **Verification**: `human-judgment`

### AC-2: Agent领地划分完整准确
- **Given**: 02_standards.md已更新
- **When**: 查看Agent领地划分表
- **Then**: 包含14个Agent，领地和职责描述准确
- **Verification**: `human-judgment`

### AC-3: 框架进度文档更新
- **Given**: framework-progress.md已更新
- **When**: 查看文档内容
- **Then**: 移除不存在的目录引用，已完成工作列表准确
- **Verification**: `human-judgment`

### AC-4: memory-system.md存在且完整
- **Given**: memory-system.md已创建
- **When**: 查看文档内容
- **Then**: 包含四层记忆架构说明和mcp_Memory交互策略
- **Verification**: `human-judgment`

### AC-5: 状态管理文档更新
- **Given**: state-management.md已更新
- **When**: 查看project_state.json结构示例
- **Then**: 包含回退状态和预算状态字段
- **Verification**: `human-judgment`

### AC-6: 记忆使用规范更新
- **Given**: memory-usage.md已更新
- **When**: 查看项目状态结构示例
- **Then**: 包含回退状态和预算状态字段
- **Verification**: `human-judgment`

### AC-7: Loop相关Skill评估完成
- **Given**: 评估报告已生成
- **When**: 查看评估结果
- **Then**: 明确哪些Loop能力可通过扩展现有Skill实现，哪些需要新建
- **Verification**: `human-judgment`

### AC-8: Loop协作者Agent评估完成
- **Given**: 评估报告已生成
- **When**: 查看评估结果
- **Then**: 明确哪些Loop能力可通过扩展现有Agent实现，哪些需要新建
- **Verification**: `human-judgment`

## Open Questions
- [ ] Loop相关Skill（loop-executor等）是否可以通过扩展现有Skill实现？
- [ ] Loop协作者Agent是否可以通过扩展现有Agent实现？
- [ ] Git MCP和Database MCP的实现优先级和时间表？
