# 数据模型设计

## 实体关系图

[ER图占位 - 由DBA Agent生成]

## 表结构

### users表
| 字段 | 类型 | 约束 | 描述 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 用户ID |
| name | VARCHAR(255) | NOT NULL | 用户名 |
| email | VARCHAR(255) | UNIQUE NOT NULL | 邮箱 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

### orders表
| 字段 | 类型 | 约束 | 描述 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 订单ID |
| user_id | INTEGER | REFERENCES users(id) | 用户ID |
| amount | DECIMAL(10,2) | NOT NULL | 金额 |
| status | VARCHAR(50) | NOT NULL | 状态 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

---

## 数据字典

### users表
```
表名：users
描述：用户表

字段说明：
- id: 主键，自增
- name: 用户名，必填
- email: 邮箱，唯一
- created_at: 创建时间
- updated_at: 更新时间
```

### orders表
```
表名：orders
描述：订单表

字段说明：
- id: 主键，自增
- user_id: 外键，关联users表
- amount: 订单金额，必填
- status: 订单状态，必填
- created_at: 创建时间
- updated_at: 更新时间
```

---

## 索引设计

| 表名 | 字段 | 索引类型 | 说明 |
|------|------|---------|------|
| users | email | UNIQUE | 邮箱唯一索引 |
| orders | user_id | INDEX | 用户ID索引 |
| orders | status | INDEX | 状态索引 |

---

## 变更记录

| 日期 | 版本 | 变更内容 | 审批人 |
|------|------|---------|--------|
| - | - | - | - |

---

## 设计原则

1. **范式化**：遵循数据库范式，减少数据冗余
2. **扩展性**：预留扩展字段，考虑未来需求
3. **性能**：合理设计索引，优化查询
4. **完整性**：使用外键约束，确保数据完整性

---

## 使用说明

- 所有数据模型变更必须由DBA Agent执行
- 变更前需写入 mailbox/to-dba.md 申请
- 重大变更需 Team Lead 审批
- 详细schema见 database/schema.sql