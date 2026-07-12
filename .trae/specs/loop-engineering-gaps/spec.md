# AliceGo Loop Engineering 差距分析与改进 PRD

## Overview
- **Summary**: 分析当前AliceGo作为Loop Engineering脚手架的差距，将线性流水线改造为真正的Loop系统，具备回环机制、并行工作树、预算控制和自动化触发器。
- **Purpose**: 将AliceGo从「线性流程引擎」升级为「真正的Loop系统」，使其符合Loop Engineering的核心原则，实现Agent自主循环完成全生命周期开发。
- **Target Users**: AliceGo用户、TRAE IDE用户、企业级软件交付团队

## Goals
- 将26步线性流程改造为具备回环机制的Loop拓扑（评审失败→回退修复→重试）
- 实现Worktrees并行开发机制，支持多Agent并行处理不同特性
- 建立Budget预算控制体系（token/时间/迭代次数）
- 实现Automations自动触发器（文件变更触发、CI失败触发等）
- 完善State持久化机制，支持跨会话记忆和断点续传

## Non-Goals (Out of Scope)
- 不涉及多Loop协同（Factory Model）- 未来方向
- 不涉及外部CI/CD系统集成 - 当前仅使用TRAE原生机制
- 不涉及多租户支持 - 单项目聚焦

## Background & Context

### 当前状态分析

AliceGo当前实现本质上是一个**线性流水线**（步骤1→2→...→26），而非真正的Loop系统。核心差距集中在以下四个方面：

### Loop原语差距矩阵

| 原语 | 定义 | AliceGo现状 | 差距描述 | 改进方案 | 优先级 |
|------|------|------------|---------|---------|--------|
| **Automations** | 定时发现与分诊 | 完全依赖SOLO Coder手动推进每一步 | 无自动触发器（文件变更触发、CI失败触发） | 设计自动触发规则：文件变更→触发测试；测试失败→触发修复；评审通过→自动进入下一步 | **P0** |
| **Worktrees** | 并行隔离 | 14个Agent只能串行工作 | 无并行开发机制，前后端任务无法同时进行 | 实现Git Worktree隔离，支持多Agent并行开发不同特性分支 | **P0** |
| **Skills** | 固化项目知识 | 35个专业Skill，封装最佳实践 | ✅ 基本完善 | 补充Loop相关Skill（loop-executor、loop-monitor） | **P2** |
| **Connectors** | 连接外部工具 | MCP Server（Memory、Playwright、Excel） | ✅ 基本完善 | 增加Git Connector、CI Connector | **P2** |
| **Sub-agents** | 制作与审查分离 | 14个专业Agent，职责清晰 | ✅ 基本完善 | 增加Loop协作者（Loop Coordinator、Loop Monitor） | **P3** |
| **State** | 跨会话记忆 | mcp_Memory + 四层记忆架构 | ⚠️ 部分完善 | 增加Loop状态机、回退状态记录、预算状态追踪 | **P1** |
| **Budget** | Token预算控制 | 仅有限迭代次数（最多3次） | 无token预算、无时间预算、无项目级总预算 | 定义每步token预算、单任务最大迭代次数、项目级总预算阈值 | **P0** |

### 当前流程的核心问题

1. **单向链式流程**：步骤4→5→6→...→26，失败后没有回环机制
2. **失败回退路径缺失**：代码评审失败后，没有显式定义「回退到代码生成步骤」的retry loop
3. **并行能力缺失**：前后端任务必须串行执行，无法利用多Agent并行
4. **资源无约束**：Agent可能无限重试或过度消耗token资源
5. **手动推进**：每一步都需要SOLO Coder手动确认，无法自动流转

## Functional Requirements

### FR-1: Loop拓扑设计
- 为每个评审步骤（步骤4/12/17/21）定义失败回退路径
- 定义最大重试次数（Stopping Rule）
- 定义成功跳转路径

### FR-2: Worktrees并行机制
- 支持前后端任务并行开发
- 支持多特性并行开发
- 实现Git Worktree隔离机制

### FR-3: Budget预算控制
- 定义每步token预算上限
- 定义单任务最大迭代次数
- 定义项目级总预算阈值
- 预算耗尽时自动降级或终止

### FR-4: Automations自动触发
- 文件变更自动触发测试
- 测试失败自动触发修复流程
- 评审通过自动进入下一步
- 预算预警自动通知

### FR-5: State状态管理增强
- Loop状态机持久化（当前Loop阶段、当前步骤、回退次数）
- 回退状态记录（上次成功状态、失败原因）
- 预算状态追踪（已消耗token、剩余预算、预警状态）

## Non-Functional Requirements

### NFR-1: 可观测性
- Loop执行过程可追踪、可监控
- 每步执行时间、token消耗可记录
- 失败原因和回退路径可追溯

### NFR-2: 可配置性
- Loop拓扑可配置（不同项目可定制流程）
- 预算参数可配置（不同项目可调整阈值）
- 触发规则可配置（可开启/关闭自动触发）

### NFR-3: 可靠性
- 断点续传支持回退状态恢复
- 失败后自动清理临时文件
- 状态持久化保证数据一致性

## Constraints

### Technical
- 必须基于TRAE现有机制（mcp_Memory、文件系统、规则自动加载）
- 不引入新的外部依赖
- 兼容现有26步流程结构

### Business
- 保持与现有项目的向后兼容性
- 不影响当前开发流程

### Dependencies
- 依赖mcp_Memory进行状态持久化
- 依赖TRAE IDE的文件系统访问能力

## Assumptions

- TRAE IDE支持Git Worktree操作
- TRAE IDE支持文件变更监听
- mcp_Memory支持复杂状态结构存储

## Acceptance Criteria

### AC-1: Loop拓扑定义完整
- **Given**: 03_workflow.md已更新
- **When**: 查看步骤4/12/17/21的定义
- **Then**: 每个步骤包含「失败回退路径」、「最大重试次数」、「成功跳转路径」定义
- **Verification**: `human-judgment`

### AC-2: Worktrees并行机制可用
- **Given**: 项目已初始化且存在多个特性
- **When**: 执行任务拆解和分配
- **Then**: 前后端任务可以并行分配给不同Agent执行
- **Verification**: `programmatic`

### AC-3: Budget预算控制生效
- **Given**: 已定义预算规则
- **When**: 某步骤消耗超过预算阈值
- **Then**: 系统自动触发预警或终止流程
- **Verification**: `programmatic`

### AC-4: Automations自动触发工作
- **Given**: 已配置自动触发规则
- **When**: 文件变更或测试失败
- **Then**: 系统自动触发相应流程（测试或修复）
- **Verification**: `programmatic`

### AC-5: State状态管理增强
- **Given**: Loop执行过程中发生回退
- **When**: 系统恢复断点
- **Then**: 能够正确恢复到上次成功状态，并显示回退原因和次数
- **Verification**: `programmatic`

## Open Questions

- [ ] TRAE IDE是否支持Git Worktree操作？（影响Worktrees实现方案）
- [ ] TRAE IDE是否支持文件变更监听？（影响Automations实现方案）
- [ ] mcp_Memory的存储容量限制是多少？（影响State存储方案）
- [ ] 是否需要新增Agent角色（Loop Coordinator、Loop Monitor）？
