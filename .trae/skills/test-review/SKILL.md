---
name: "test-review"
description: "测试评审Skill，审查测试用例文档的质量。触发场景：'测试评审'、'评审测试用例'、需要验证测试用例完整性时。"
---

# 测试评审 Skill

## 功能描述

审查测试用例文档的质量，评估测试覆盖率，生成规范的评审报告，支持最多3次评审迭代。

## 调用规范（强制要求）

### 调用链路
```
SOLO Coder → 调用 @test-reviewer Agent → @test-reviewer Agent调用此Skill
```

### 约束规则
- **SOLO Coder**：必须先调用@test-reviewer Agent，**禁止**直接调用此Skill
- **@test-reviewer Agent**：负责调用此Skill执行测试评审流程
- **Skill执行者**：@test-reviewer Agent

### 错误示例
```
❌ SOLO Coder直接调用test-review Skill
✅ SOLO Coder调用@test-reviewer Agent → @test-reviewer Agent调用test-review Skill
```

## WHEN

当需要进行测试评审时，SOLO Coder必须先调用@test-reviewer Agent，再由@test-reviewer Agent调用此Skill。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| iteration | number | 当前迭代次数（1-3） | 是 |

## Workflow

按照以下步骤执行：

### Step 1: 完整性检查（必须先做）

- **列出所有特性**：使用 `file-operation.listDirectory()` 读取 `design/features/` 目录
- **检查测试用例文件**：对每个特性，使用 `file-operation.readFile()` 检查是否存在 `design/features/{feature-id}/test-cases.md`
- **生成完整性清单**：创建表格记录哪些特性有测试用例，哪些没有

| 特性ID | 特性名称 | 需求文档 | 测试用例文件 | 状态 |
|--------|----------|----------|--------------|------|
| feature-001 | {名称} | ✅ | ✅ | 通过 |
| feature-002 | {名称} | ✅ | ❌ | **缺少** |
| feature-003 | {名称} | ✅ | ✅ | 通过 |

- **完整性检查结果**：
  - 总特性数：{n}
  - 有测试用例：{n}
  - 缺少测试用例：{n}
  - **完整性状态**：✅ 通过 / ❌ 不通过

- **如果有任何特性缺少测试用例**：
  - 这是**高优先级问题**
  - 必须标记为"不通过"
  - 将此问题列为评审报告问题清单的第一项

### Step 2: 获取参考文档

- 使用 `file-operation.readFile()` 读取：
  - `design/project_overview/requirements_spec.md`
  - 所有特性需求文档 `design/features/*/requirements.md`
  - API合同文档 `design/project_overview/api_contracts.md`
  - `design/project_overview/test-coverage-checklist.md`（如果存在）

### Step 3: 逐项审查测试

按照评审通过标准逐项检查：

#### 3.1 测试用例审查
- [ ] 测试用例覆盖所有功能需求，无遗漏
- [ ] 测试用例覆盖边界条件和异常情况
- [ ] 测试用例覆盖成功场景和失败场景
- [ ] 无重复或冗余的测试用例
- [ ] 每个测试用例都有明确的预期结果
- [ ] 测试用例独立，不依赖其他测试用例的执行结果

#### 3.2 测试覆盖率审查
- [ ] 代码覆盖率达标（≥95%）
- [ ] 覆盖了关键业务路径
- [ ] 覆盖了错误处理和异常情况
- [ ] 覆盖了边界条件和极端值
- [ ] 考虑了集成测试和端到端测试

#### 3.3 测试数据审查
- [ ] 测试数据合理、真实，符合业务场景
- [ ] 考虑了各种数据类型和边界值
- [ ] 有数据隐私和安全考虑
- [ ] 测试数据易于准备和清理
- [ ] 考虑了边界值、正常值、异常值等

#### 3.4 测试策略审查
- [ ] 有合理的测试分层（单元测试、集成测试、端到端测试）
- [ ] 考虑了测试环境和数据隔离
- [ ] 有自动化测试计划
- [ ] 有回归测试策略
- [ ] 有性能测试和安全测试考虑（如适用）
- [ ] 测试用例可自动化执行

### Step 4: 生成评审报告

严格按照以下格式编写报告：

```markdown
## 评审结果

### 1. 测试用例完整性检查（**此部分必须在最前面**）

| 特性ID | 特性名称 | 需求文档 | 测试用例文件 | 状态 |
|--------|----------|----------|--------------|------|
| feature-001 | {名称} | ✅ | ✅ | 通过 |
| feature-002 | {名称} | ✅ | ❌ | **缺少** |
| feature-003 | {名称} | ✅ | ✅ | 通过 |

**完整性检查结果**：
- 总特性数：{n}
- 有测试用例：{n}
- 缺少测试用例：{n}
- **完整性状态**：✅ 通过 / ❌ 不通过

### 2. 评审状态
- 状态：通过 / 需修改 / 不通过
- **如果有特性缺少测试用例，状态必须为"不通过"**

### 3. 测试覆盖率
- 单元测试覆盖率：{n}%
- 集成测试覆盖率：{n}%
- 端到端测试覆盖率：{n}%

### 4. 通过标准检查清单
- [ ] 测试用例覆盖所有功能需求
- [ ] 测试用例覆盖边界条件和异常情况
- [ ] 测试用例覆盖成功场景和失败场景
- ...（按上述清单填写）

### 5. 问题清单
| 序号 | 问题描述 | 严重程度 | 位置 | 改进建议 |
|------|----------|----------|------|----------|
| 1 | **缺少 feature-002 的测试用例** | 高 | design/features/feature-002/ | 立即为 feature-002 生成完整的测试用例 |
| 2 | ... | ... | ... | ... |

### 6. 下一步行动
- 如果通过：进入下一流程步骤
- 如果不通过：反馈给测试设计进行优化
- **如果有特性缺少测试用例：必须先生成缺失的测试用例**
```

### Step 5: 保存评审报告

- **使用 `file-operation.createDirectory()`** 确保目录存在：`design/project_overview/reviews/`
- **使用 `file-operation.createFile()`** 保存报告：
  - 文件名：`design/project_overview/reviews/test-{timestamp}.md`
  - 格式：UTF-8
- **使用 `file-operation.createFile()`** 保存反馈JSON：
  - 文件名：`design/project_overview/feedback/test-review-{timestamp}.json`

### Step 6: 更新记忆系统

使用 `mcp_Memory` 记录：
- 评审状态（通过/需修改/不通过）
- 问题数量
- 迭代次数
- 评审时间戳

### Step 7: 完成

返回评审结果给 SOLO Coder：
- 明确告知评审状态
- 说明主要问题和建议
- 提供评审报告文件路径

## 输出

**Files created/modified:**
- `design/project_overview/reviews/test-{timestamp}.md` - 评审报告
- `design/project_overview/feedback/test-review-{timestamp}.json` - 反馈JSON

**Status communication:**
- `SUCCESS`: 评审完成，通过
- `WARN`: 评审完成，需修改
- `ERROR`: 评审失败或发现严重问题

## 重要规则

### 完整性优先
- **必须首先检查完整性**
- 如果有特性缺少测试用例，必须标记为"不通过"
- 缺少测试用例是高优先级问题，必须列为第一个问题

### 客观公正
- 评审报告要基于事实，避免主观臆断
- 不仅指出问题，还要提供改进建议

### 文件操作要求
- **必须使用 `file-operation` Skill** 保存评审报告
- **禁止**使用文字描述"假装"保存文件
