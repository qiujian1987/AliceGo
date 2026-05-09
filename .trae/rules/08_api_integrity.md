# API文档完整性规范（L2）

## 1. 概述

本规范定义API文档完整性要求，确保所有功能点都有对应的API实现。

---

## 2. API完整性检查清单

### 2.1 检查清单文件格式

**文件路径**：`design/project_overview/api_checklist.md`

**格式示例**：
```markdown
# API完整性检查清单

## 项目信息
- 项目名称：[项目名]
- 检查日期：[日期]
- 检查人：@architect

## 检查项状态

| 检查项 | 状态 | 说明 |
|--------|------|------|
| 1. CRUD操作完整性 | ✅/❌ | [说明] |
| 2. 数据模型覆盖 | ✅/❌ | [说明] |
| 3. 特性需求覆盖 | ✅/❌ | [说明] |
| 4. 输入验证 | ✅/❌ | [说明] |
| 5. 错误处理 | ✅/❌ | [说明] |
| 6. 认证授权 | ✅/❌ | [说明] |
| 7. 分页机制 | ✅/❌ | [说明] |
| 8. 速率限制 | ✅/❌ | [说明] |
| 9. 文档完整性 | ✅/❌ | [说明] |
| 10. 版本管理 | ✅/❌ | [说明] |

## 数据模型覆盖详情

| 数据模型 | API端点 | 状态 |
|---------|--------|------|
| 用户 | GET /api/users, POST /api/users | ✅ |
| 订单 | GET /api/orders, POST /api/orders | ✅ |
| 产品 | GET /api/products, POST /api/products | ✅ |

## 特性需求覆盖详情

| 特性ID | API端点 | 状态 |
|-------|--------|------|
| feature-001 | POST /api/login, GET /api/profile | ✅ |
| feature-002 | POST /api/checkout, GET /api/orders | ✅ |

## 验证结果

- 总体状态：✅ 通过 / ❌ 未通过
- 备注：[补充说明]
```

---

## 3. 检查项详细要求

### 3.1 CRUD操作完整性

**检查标准**：
- 每个主要数据实体必须有Create（创建）API
- 每个主要数据实体必须有Read（读取）API
- 每个主要数据实体必须有Update（更新）API
- 每个主要数据实体必须有Delete（删除）API

**示例端点**：
```
POST   /api/users        # 创建用户
GET    /api/users/{id}   # 读取用户
PUT    /api/users/{id}   # 更新用户
DELETE /api/users/{id}   # 删除用户
```

### 3.2 数据模型覆盖

**检查标准**：
- 所有在 `data_model.md` 中定义的表都必须有对应的API
- 每个表的核心字段都必须在API请求/响应中体现
- 表之间的关系必须有对应的API支持

### 3.3 特性需求覆盖

**检查标准**：
- 每个特性需求（`features/*/requirements.md`）都必须有对应的API实现
- 用户故事中的每个功能点都必须有API支持
- 验收标准中的每个检查点都必须有对应的API覆盖

### 3.4 输入验证

**检查标准**：
- 所有API参数必须有验证规则
- 必填字段必须明确标记
- 数据类型必须明确
- 长度限制必须明确
- 格式要求必须明确（如邮箱、手机号等）

### 3.5 错误处理

**检查标准**：
- 所有API必须定义错误响应格式
- 必须定义常见错误码（400, 401, 403, 404, 500等）
- 错误信息必须清晰可读

### 3.6 认证授权

**检查标准**：
- 所有API必须说明认证方式
- 权限级别必须明确（公开/用户/管理员）
- 认证失败的处理方式必须定义

### 3.7 分页机制

**检查标准**：
- 列表类API（GET /api/xxx）必须有分页支持
- 必须定义分页参数（page, size等）
- 必须定义分页响应格式

### 3.8 速率限制

**检查标准**：
- 必须定义速率限制策略
- 必须定义超出限制的响应
- 必须说明如何查看剩余请求数

### 3.9 文档完整性

**检查标准**：
- 每个API必须有清晰的功能描述
- 每个API必须有示例请求
- 每个API必须有示例响应（成功和失败）
- 每个API必须有完整的参数说明

### 3.10 版本管理

**检查标准**：
- 必须定义API版本策略
- 必须说明版本号格式（如 v1, v2）
- 必须说明版本变更处理方式

---

## 4. 记忆系统记录

**路径**：`project/{project_id}/api_integrity`

**格式**：
```json
{
  "check_date": "2026-05-09",
  "checked_by": "@architect",
  "overall_status": "passed",
  "checklist": {
    "crud_complete": true,
    "model_coverage": true,
    "feature_coverage": true,
    "input_validation": true,
    "error_handling": true,
    "auth": true,
    "pagination": true,
    "rate_limiting": true,
    "documentation": true,
    "versioning": true
  },
  "model_coverage": {
    "User": true,
    "Order": true,
    "Product": true
  },
  "feature_coverage": {
    "feature-001": true,
    "feature-002": true
  }
}
```

---

## 5. 验证流程

**步骤1**：@architect 完成API设计
**步骤2**：@architect 生成 `api_checklist.md`
**步骤3**：SOLO Coder 验证清单完整性
**步骤4**：所有检查项通过后，才能进入步骤16（API确认）
**步骤5**：向用户展示API覆盖情况

---

## 6. 不完整处理

当发现API不完整时：
1. 输出警告信息
2. 列出缺失的API清单
3. 要求补充设计
4. 重新执行完整性检查

---

## 7. 完整性检查示例

**示例检查输出**：
```
[API完整性检查]

✅ 检查通过项：
- CRUD操作完整性：用户、订单、产品都有完整CRUD
- 数据模型覆盖：User、Order、Product都有API
- 特性需求覆盖：feature-001和feature-002都有对应API

❌ 缺失项：
- 分页机制：订单列表API缺少分页
- 文档完整性：用户创建API缺少示例响应

建议：补充缺失的API设计
```
