# 评审反馈机制规范

## 概述

本文档定义了评审Agent的工作流程、反馈机制和迭代控制（最大3次）。

## 评审类型

### 1. 需求评审 (req-reviewer)
- 评审对象：`design/project_overview/requirements_spec.md`
- 评审对象：`design/features/{feature}/requirements.md`
- 输出：`design/project_overview/reviews/requirement-review-{timestamp}.md`

### 2. 设计评审 (design-reviewer)
- 评审对象：`design/project_overview/backend_architecture.md`
- 评审对象：`design/project_overview/frontend_architecture.md`
- 输出：`design/project_overview/reviews/design-review-{timestamp}.md`

### 3. 测试评审 (test-reviewer)
- 评审对象：`design/features/{feature}/test-cases.md`
- 输出：`design/project_overview/reviews/test-review-{timestamp}.md`

### 4. 代码评审 (code-reviewer)
- 评审对象：`src/server/`、`src/client/` 目录下的代码
- 输出：`design/project_overview/reviews/code-review-{timestamp}.md`

## 评审报告统一格式

所有评审报告必须遵循以下格式：

```markdown
# {评审类型} 报告

## 1. 基本信息
- 评审类型：需求评审|设计评审|测试评审|代码评审
- 评审对象：{文档/代码路径}
- 评审时间：{YYYY-MM-DD HH:mm:ss}
- 评审人：{Agent名称}
- 迭代次数：{n}/3

## 2. 评审内容
- 内容项1：{检查内容描述}
- 内容项2：{检查内容描述}
- ...

## 3. 评审结果
- **总体结论**：通过|不通过
- **是否需要迭代**：是|否

## 4. 问题列表
| 问题ID | 严重程度 | 问题描述 | 建议修复 | 状态 |
|--------|----------|----------|----------|------|
| Q-001 | 高| xxx| xxx| 待修复 |
| Q-002 | 中| xxx| xxx| 待修复 |
| Q-003 | 低| xxx| xxx| 待修复 |

## 5. 具体反馈
### 5.1 问题1 (Q-001)
- **问题描述**：详细描述问题
- **位置**：{文件路径}:{行号}
- **严重程度**：高|中|低
- **建议**：具体的修复建议
- **期望**：修复后的期望状态

### 5.2 问题2 (Q-002)
...

## 6. 评审结论
- **是否通过**：是|否
- **原因**：详细说明通过或不通过的原因
- **下一步**：
  - 如果通过：继续下一环节
  - 如果不通过：反馈给{前置Agent}进行修改
- **备注**：其他需要说明的事项
```

## 反馈流程

### 1. 评审Agent工作流程

```
1. 接收评审任务
   ↓
2. 读取待评审文档
   ↓
3. 从记忆系统读取当前迭代次数
   ↓
4. 执行评审
   ↓
5. 生成评审报告（遵循统一格式）
   ↓
6. 保存评审报告
   ↓
7. 生成反馈JSON
   ↓
8. 保存反馈JSON
   ↓
9. 更新记忆系统中的迭代次数
   ↓
10. 通知Team Lead评审完成
```

### 2. 反馈JSON格式

评审Agent必须生成反馈JSON文件：

```json
{
  "timestamp": "2026-05-10T10:30:00Z",
  "review_type": "requirements|design|test|code",
  "reviewer": "req-reviewer|design-reviewer|test-reviewer|code-reviewer",
  "target_agent": "team-lead|feature-analyst|architect|backend-dev|frontend-dev|qa",
  "status": "approved|needs_revision|rejected",
  "iteration": 1,
  "max_iterations": 3,
  "review_report_path": "design/project_overview/reviews/review-xxx.md",
  "issues": [
    {
      "id": "Q-001",
      "severity": "high|medium|low",
      "description": "问题描述",
      "location": "文件路径:行号",
      "suggestion": "修复建议"
    }
  ],
  "next_steps": "下一步行动说明",
  "escalation_required": false
}
```

### 3. 反馈JSON保存位置

```
design/project_overview/feedback/{review-type}-{timestamp}.json
```

## 迭代控制机制（最大3次）

### 1. 迭代次数记录

使用记忆系统（mcp_Memory）记录迭代次数：

```javascript
// 记忆系统存储格式
{
  "type": "review_iteration",
  "review_type": "requirements",
  "iteration": 1,
  "max_iterations": 3,
  "started_at": "2026-05-10T10:00:00Z",
  "history": [
    {
      "iteration": 1,
      "status": "needs_revision",
      "timestamp": "2026-05-10T10:30:00Z",
      "issues_count": 3
    }
  ]
}
```

### 2. 迭代流程

```
迭代1:
  评审 → 不通过 → 反馈 → 修改 → 重新评审
  ↓ (如果通过)
继续下一环节

迭代2:
  评审 → 不通过 → 反馈 → 修改 → 重新评审
  ↓ (如果通过)
继续下一环节

迭代3:
  评审 → 不通过 → 升级到用户决策
  ↓ (如果通过)
继续下一环节
```

### 3. 达到最大迭代次数的处理

当迭代次数达到3次但仍未通过时：

1. 评审Agent在反馈JSON中设置 `escalation_required: true`
2. Team Lead收到通知
3. Team Lead将问题升级给用户
4. 用户选择：
   - 选项A：接受当前状态，继续
   - 选项B：继续迭代（超过3次限制）
   - 选项C：取消该环节，调整方案
5. 根据用户决策继续

### 4. 迭代次数重置

当评审通过后，重置该类型评审的迭代次数记录。

## Team Lead处理反馈流程

```
1. 收到评审完成通知
   ↓
2. 读取评审报告和反馈JSON
   ↓
3. 检查评审状态
   ↓
4. 如果通过:
   - 重置迭代次数
   - 继续下一环节
   ↓
5. 如果不通过:
   - 检查迭代次数
   - 如果 < 3:
     - 将反馈转发给前置Agent
     - 前置Agent根据反馈修改
     - 重新提交评审
   - 如果 == 3:
     - 生成升级报告
     - 提交给用户决策
     - 根据用户决策执行
```

## 评审触发时机

### 1. 需求评审
- 触发：需求规约文档生成完成后
- 前置Agent：Team Lead
- 后续：需求确认

### 2. 设计评审
- 触发：后端架构和前端架构文档生成完成后
- 前置Agent：Architect
- 后续：数据模型设计

### 3. 测试评审
- 触发：测试用例文档生成完成后
- 前置Agent：QA
- 后续：任务分配

### 4. 代码评审
- 触发：单个任务开发完成后（按任务评审）
- 前置Agent：Backend Dev / Frontend Dev
- 后续：测试执行

## 评审检查清单

### 需求评审检查项
- [ ] 需求描述清晰明确
- [ ] 业务价值明确
- [ ] 验收标准可衡量
- [ ] 范围边界清晰
- [ ] 风险已识别
- [ ] 特性需求文档符合规范

### 设计评审检查项
- [ ] 技术选型合理
- [ ] 架构设计可扩展
- [ ] 模块划分合理
- [ ] 数据流清晰
- [ ] 性能考虑充分
- [ ] 安全考虑充分

### 测试评审检查项
- [ ] 测试覆盖完整
- [ ] 测试用例可执行
- [ ] 验收标准对应
- [ ] 边界情况已覆盖
- [ ] 异常情况已考虑

### 代码评审检查项
- [ ] 代码符合规范
- [ ] 测试已编写且通过
- [ ] 无明显bug
- [ ] 安全考虑充分
- [ ] 性能考虑充分
- [ ] 文档完整
