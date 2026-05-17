# Skill 结构规范

## 概述

本文档定义了 AliceGo 项目中所有 Skill 的标准目录结构，确保 Skill 的可维护性和一致性。

---

## 1. 标准目录结构

每个 Skill 必须遵循以下目录结构：

```
.trae/skills/{skill-name}/
├── SKILL.md          # 必须：Skill 定义文档
├── scripts/          # 可选：可执行脚本目录
│   └── main.js      # 可选：主执行脚本
├── examples/         # 可选：使用示例目录
│   └── example-1.md # 可选：示例文件
└── references/       # 可选：参考文档目录
    └── ref-1.md     # 可选：参考文档
```

---

## 2. 必需文件

### 2.1 SKILL.md

SKILL.md 是每个 Skill 的核心定义文件，必须包含：

```markdown
---
name: "skill-name"
description: "Skill 功能描述。触发场景：'触发词1'、'触发词2'。"
---

# Skill 名称

## 功能描述

简要描述 Skill 的功能。

## WHEN

描述何时调用此 Skill。

## Workflow

描述 Skill 的执行流程。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| param1 | string | 参数1描述 | 是 |
| param2 | number | 参数2描述 | 否 |

## 输出

描述 Skill 的输出。
```

### 2.2 文件头格式

SKILL.md 必须包含 YAML front matter：

```yaml
---
name: "skill-name"
description: "简短描述。触发场景：'关键词1'、'关键词2'。"
---
```

---

## 3. 可选目录

### 3.1 scripts/ 目录

用于存放可执行脚本：

```
scripts/
├── main.js          # 主执行脚本
├── utils.js         # 工具脚本（可选）
└── helpers.js       # 辅助脚本（可选）
```

**脚本接口规范**：

```javascript
// 入口函数
async function execute(params, context) {
  // 执行 Skill 逻辑
  // 返回标准格式结果
  return {
    status: 'success',
    data: {},
    message: '操作完成'
  };
}

module.exports = { execute };
```

### 3.2 examples/ 目录

用于存放使用示例：

```
examples/
├── example-1.md     # 示例1
└── example-2.md     # 示例2
```

**示例格式**：

```markdown
# 示例1：基本使用

## 输入

```json
{
  "param1": "value1"
}
```

## 输出

```json
{
  "status": "success",
  "data": {}
}
```
```

### 3.3 references/ 目录

用于存放参考文档：

```
references/
├── ref-1.md        # 参考文档1
└── ref-2.md        # 参考文档2
```

---

## 4. 现有 Skill 适配

### 4.1 已符合标准的 Skill

以下 Skill 已符合标准结构：

| Skill | SKILL.md | scripts/ | examples/ | references/ |
|-------|----------|----------|-----------|-------------|
| api-designer | ✅ | ✅ | ❌ | ❌ |
| architecture-planner | ✅ | ✅ | ❌ | ❌ |
| database-designer | ✅ | ✅ | ❌ | ❌ |
| file-operation | ✅ | ✅ | ❌ | ❌ |
| project-planner | ✅ | ✅ | ❌ | ❌ |
| requirement-analyzer | ✅ | ✅ | ❌ | ❌ |
| task-decomposition | ✅ | ❌ | ❌ | ❌ |
| test-case-design | ✅ | ❌ | ❌ | ❌ |

### 4.2 需要适配的 Skill

以下 Skill 需要添加缺失的目录：

| Skill | 建议添加 |
|-------|---------|
| code-generator | scripts/main.js |
| code-review | scripts/main.js |
| dependency-manager | scripts/main.js |
| devops-automation | scripts/main.js |
| frontend-design | scripts/main.js |
| project-initialization | scripts/main.js |
| sql-optimizer | scripts/main.js |
| test-executor | scripts/main.js |
| test-generator | scripts/main.js |
| test-review | scripts/main.js |

---

## 5. 命名规范

### 5.1 Skill 名称

- 使用 kebab-case（小写字母，连字符分隔）
- 示例：`test-case-design`、`api-designer`

### 5.2 脚本名称

- 使用 kebab-case
- 主脚本：`main.js`
- 工具脚本：`{功能名}-utils.js`

### 5.3 示例名称

- 使用 kebab-case
- 格式：`{场景描述}.md`
- 示例：`basic-usage.md`、`advanced-usage.md`

---

## 6. 验证检查清单

创建新的 Skill 时，必须检查：

- [ ] SKILL.md 文件存在
- [ ] SKILL.md 包含 YAML front matter
- [ ] name 字段正确
- [ ] description 字段包含触发场景
- [ ] Workflow 流程清晰
- [ ] 输入输出参数定义完整
- [ ] scripts/ 目录存在（如果需要）
- [ ] examples/ 目录存在（如果需要）
- [ ] references/ 目录存在（如果需要）

---

## 7. 最佳实践

### 7.1 SKILL.md 编写建议

1. **简洁性**：description 不要超过 100 字
2. **清晰性**：Workflow 步骤使用编号
3. **完整性**：包含所有输入输出参数
4. **示例性**：提供使用示例

### 7.2 目录结构建议

1. **最小化**：只创建必要的目录
2. **模块化**：脚本按功能分离
3. **文档化**：添加 README 或 INDEX 文件

### 7.3 版本控制

建议在 SKILL.md 中添加版本信息：

```markdown
---
name: "skill-name"
description: "..."
version: "1.0.0"
last_updated: "2026-05-17"
---
```

---

## 8. 下一步

创建新的 Skill 时，请参考本文档的结构规范。

详细调用规范请参考：[../docs/reference/skill-invocation.md](../docs/reference/skill-invocation.md)

---

*最后更新：2026-05-17*
