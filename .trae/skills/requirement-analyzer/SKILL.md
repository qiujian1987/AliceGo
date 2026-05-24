---
name: "requirement-analyzer"
description: "需求分析，将用户需求转换为明确的规约文档。触发场景：'分析需求'、'需求规约'、'生成需求文档'、'编写需求'。输入参数：user_input(必需)，context(可选)，priority(可选)。输出：design/project_overview/requirements_spec.md 和 design/features/ 目录下的特性需求文档。"
---

# 需求分析 Skill

## 功能描述

将用户的需求描述转换为结构化的需求规约文档，并按照MECE原则分解为独立的业务特性，每个特性创建独立的目录和需求文档。

**核心职责**：
1. 需求规约文档生成
2. 特性识别与分解（遵循MECE原则）
3. 特性目录创建
4. 特性需求文档编写

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| user_input | string | 用户的需求描述 | 是 |
| output_path | string | 输出文件路径，默认为 `design/project_overview/requirements_spec.md` | 否 |
| context | string | 项目背景信息 | 否 |
| priority | string | 优先级（high/medium/low） | 否 |
| mode | string | 模式：`requirements`（仅需求分析）或 `features`（特性分解）或 `all`（两者都做），默认 `all` | 否 |

## 输出格式

### 主要输出：Markdown文档

1. **需求规约文档**：`design/project_overview/requirements_spec.md`
2. **特性需求文档**（每个特性一个）：`design/features/feature-{序号}-{名称}/requirements.md`
3. **特性列表**：`design/project_overview/features_list.md`

### 辅助输出：JSON状态
```json
{
  "status": "success",
  "output_files": [
    "design/project_overview/requirements_spec.md",
    "design/project_overview/features_list.md",
    "design/features/feature-001-user-authentication/requirements.md"
  ],
  "features_count": 3,
  "message": "需求分析完成，文档已保存"
}
```

## 执行流程

### 流程1：需求规约分析
1. 分析用户输入的需求描述
2. 提取业务需求和功能需求
3. 识别非功能需求和约束
4. 明确需求范围和边界
5. 制定验收标准
6. 识别潜在风险
7. 按照标准格式生成需求规约Markdown文档
8. 将文档保存到 `design/project_overview/requirements_spec.md`

### 流程2：特性分解（遵循MECE原则）
1. 从需求规约中提取所有功能点
2. **Mutually Exclusive（相互独立）**：确保每个功能点只属于一个特性
3. **Collectively Exhaustive（完全穷尽）**：确保所有功能点都有归属
4. 为每个特性分配唯一ID和名称
5. 创建特性目录结构
6. 为每个特性编写需求文档
7. 生成特性列表文档

## 命名规范（强制执行）

### 特性ID命名规范
- **格式**：`feature-{序号}`
- **序号**：3位数字，从001开始
- **示例**：`feature-001`, `feature-002`, `feature-003`
- **禁止**：`feature-001-user-authentication`（包含描述性文字）

### 目录结构规范
```
design/
├── project_overview/
│   ├── requirements_spec.md
│   └── features_list.md
└── features/
    ├── feature-001/
    │   └── requirements.md
    ├── feature-002/
    │   └── requirements.md
    └── feature-003/
        └── requirements.md
```

## 文档格式规范

### 需求规约文档格式
```markdown
# 项目需求规约

## 1. 项目概述
- 项目名称：xxx
- 项目目标：xxx
- 目标用户：xxx

## 2. 业务需求
- 需求1：xxx
- 需求2：xxx

## 3. 功能需求
- 功能1：xxx
- 功能2：xxx

## 4. 非功能需求
- 性能：xxx
- 安全：xxx
- 可用性：xxx

## 5. 范围
- 包含：xxx
- 不包含：xxx

## 6. 验收标准
- 标准1：xxx
- 标准2：xxx

## 7. 风险
- 风险1：xxx
- 风险2：xxx

## 8. 假设与约束
- 假设：xxx
- 约束：xxx
```

### 特性需求文档格式
```markdown
# 特性需求：{特性名称}

## 1. 特性概述
- 特性ID：feature-{序号}-{名称}
- 所属模块：xxx
- 优先级：high/medium/low

## 2. 业务目标
- 目标1：xxx
- 目标2：xxx

## 3. 功能需求
| 需求ID | 需求描述 | 来源（功能点） |
|--------|---------|---------------|
| FR-{特性ID}-001 | xxx | 需求规约第x条 |
| FR-{特性ID}-002 | xxx | 需求规约第y条 |

## 4. 验收标准
| 验收ID | 验收描述 | 验证方法 |
|--------|---------|---------|
| AC-{特性ID}-001 | xxx | 测试用例 |
| AC-{特性ID}-002 | xxx | 测试用例 |

## 5. 依赖关系
- 依赖特性：feature-xxx（如果有）
- 被依赖特性：feature-yyy（如果有）

## 6. 非功能需求
- 性能要求：xxx
- 安全要求：xxx
```

### 特性列表文档格式
```markdown
# 特性列表

## 特性总览
| 特性ID | 特性名称 | 优先级 | 功能点数 |
|--------|---------|--------|---------|
| feature-001 | 用户认证 | high | 5 |
| feature-002 | 订单管理 | high | 8 |
| feature-003 | 商品目录 | medium | 6 |

## MECE验证
- ✅ 相互独立：所有特性边界清晰，无重叠
- ✅ 完全穷尽：所有功能点都已覆盖
```

## MECE原则验证

### 相互独立检查
1. 检查是否有功能点同时属于多个特性
2. 如果有重叠，重新划分特性边界
3. 确保每个功能点只归属于一个特性

### 完全穷尽检查
1. 提取需求规约中的所有功能点
2. 检查每个功能点是否都有归属特性
3. 如果有遗漏，创建新特性或调整现有特性

### MECE不合格处理
- **重叠问题**：重新划分特性边界
- **遗漏问题**：创建新特性或向现有特性添加功能点
- **边界模糊**：明确特性职责范围

## 使用示例

### 输入（完整模式）
```json
{
  "user_input": "我需要一个电商网站，支持用户注册、商品浏览、购物车和支付功能",
  "context": "这是一个新的电商项目，目标用户是年轻人",
  "priority": "high",
  "mode": "all"
}
```

### 输出（目录结构）
```
design/
├── project_overview/
│   ├── requirements_spec.md
│   └── features_list.md
└── features/
    ├── feature-001-user-authentication/
    │   └── requirements.md
    ├── feature-002-product-browsing/
    │   └── requirements.md
    ├── feature-003-shopping-cart/
    │   └── requirements.md
    └── feature-004-payment/
        └── requirements.md
```

### 输出（JSON状态）
```json
{
  "status": "success",
  "output_files": [
    "design/project_overview/requirements_spec.md",
    "design/project_overview/features_list.md",
    "design/features/feature-001-user-authentication/requirements.md",
    "design/features/feature-002-product-browsing/requirements.md",
    "design/features/feature-003-shopping-cart/requirements.md",
    "design/features/feature-004-payment/requirements.md"
  ],
  "features_count": 4,
  "message": "需求分析完成，文档已保存"
}
```

## 最佳实践

- 需求描述应尽可能详细
- 提供足够的项目背景信息
- 明确优先级和截止时间
- 确保特性划分符合MECE原则
- 特性名称应清晰反映业务功能

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 需求描述过于模糊 | 提示用户提供更多细节 |
| 缺少必要信息 | 自动补充合理默认值 |
| 需求冲突 | 识别并提示冲突点，需要用户确认 |
| MECE不满足 | 返回错误信息，说明具体问题 |
| 特性命名不规范 | 自动修正为规范格式 |

## 版本历史

| 版本 | 变更 | 日期 |
|------|------|------|
| v1.0 | 初始版本 | 2026-05-17 |
| v1.1 | 添加特性分解功能 | 2026-05-24 |
| v1.2 | 添加MECE原则验证 | 2026-05-24 |
| v1.3 | 添加命名规范强制执行 | 2026-05-24 |
