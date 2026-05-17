# 数据模型设计文档

## 1. 数据模型概述

- **数据库类型**：SQLite
- **数据库版本**：3.x
- **设计目标**：简单、高效、易维护
- **设计原则**：第三范式（3NF）

## 2. 实体定义

### 2.1 笔记实体（Note）

| 字段名 | 数据类型 | 约束 | 说明 |
|--------|---------|------|------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | 笔记ID |
| title | TEXT | NOT NULL | 笔记标题 |
| content | TEXT | NOT NULL | 笔记内容 |
| category | TEXT | DEFAULT '' | 分类标签 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

**字段说明**：
- `id`：自增主键，用于唯一标识笔记
- `title`：笔记标题，必填字段，最大255字符
- `content`：笔记内容，支持任意长度文本
- `category`：分类标签，可选字段，用于关联分类
- `created_at`：自动记录创建时间
- `updated_at`：自动记录更新时间，修改时自动更新

### 2.2 实体关系图

```
┌─────────────────────┐
│       Note          │
├─────────────────────┤
│ - id (PK)           │
│ - title             │
│ - content           │
│ - category          │
│ - created_at        │
│ - updated_at        │
└─────────────────────┘
```

## 3. 索引设计

### 3.1 索引列表

| 索引名称 | 表名 | 字段 | 类型 | 用途 |
|---------|------|------|------|------|
| idx_notes_category | notes | category | 普通索引 | 按分类筛选 |
| idx_notes_created_at | notes | created_at | 普通索引 | 按时间排序 |
| fts_notes | notes | title, content | FULLTEXT | 全文搜索 |

### 3.2 索引策略

**选择索引字段的原则**：
1. **WHERE 子句中常用的字段**：category（分类筛选）
2. **ORDER BY 子句中常用的字段**：created_at（时间排序）
3. **全文搜索字段**：title + content（关键词搜索）

**FULLTEXT 索引说明**：
- SQLite 使用 FTS5 虚拟表实现全文搜索
- 支持布尔模式搜索
- 支持模糊匹配
- 自动维护索引同步

## 4. 数据完整性约束

### 4.1 必填约束

- `title`：NOT NULL，确保每条笔记都有标题
- `content`：NOT NULL，确保每条笔记都有内容

### 4.2 默认值约束

- `category`：DEFAULT ''，默认空字符串
- `created_at`：DEFAULT CURRENT_TIMESTAMP，自动设置为当前时间
- `updated_at`：DEFAULT CURRENT_TIMESTAMP，自动设置为当前时间

### 4.3 触发器约束

**更新时间触发器**：
```sql
CREATE TRIGGER update_note_timestamp 
AFTER UPDATE ON notes
BEGIN
    UPDATE notes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
```

## 5. 数据关系

### 5.1 笔记与分类关系

- **关系类型**：多对一关系（Many-to-One）
- **说明**：多条笔记可以属于同一个分类
- **实现方式**：通过 category 字段关联

**示例**：
```sql
-- 查询某个分类的所有笔记
SELECT * FROM notes WHERE category = '工作';

-- 统计每个分类的笔记数量
SELECT category, COUNT(*) as count FROM notes GROUP BY category;
```

## 6. 查询设计

### 6.1 常用查询

**查询1：获取所有笔记（分页）**
```sql
SELECT * FROM notes 
ORDER BY created_at DESC 
LIMIT 10 OFFSET 0;
```

**查询2：按分类筛选笔记**
```sql
SELECT * FROM notes 
WHERE category = '工作' 
ORDER BY created_at DESC;
```

**查询3：搜索笔记（全文搜索）**
```sql
SELECT * FROM notes 
WHERE notes MATCH '关键词';
```

**查询4：获取笔记详情**
```sql
SELECT * FROM notes WHERE id = ?;
```

**查询5：更新笔记**
```sql
UPDATE notes 
SET title = ?, content = ?, category = ?, updated_at = CURRENT_TIMESTAMP 
WHERE id = ?;
```

**查询6：删除笔记**
```sql
DELETE FROM notes WHERE id = ?;
```

### 6.2 性能优化查询

**查询7：获取分类统计**
```sql
SELECT 
    category,
    COUNT(*) as note_count
FROM notes
WHERE category != ''
GROUP BY category
ORDER BY note_count DESC;
```

**查询8：获取最近的笔记**
```sql
SELECT * FROM notes 
ORDER BY updated_at DESC 
LIMIT 5;
```

## 7. 数据类型选择

### 7.1 SQLite 数据类型

| 业务类型 | SQLite 类型 | 存储大小 | 说明 |
|---------|------------|---------|------|
| 整数ID | INTEGER | 1-8字节 | 自动递增主键 |
| 标题 | TEXT | 变长 | UTF-8 编码 |
| 内容 | TEXT | 变长 | 支持长文本 |
| 分类 | TEXT | 变长 | 字符串存储 |
| 时间 | DATETIME | 变长 | ISO 8601 格式 |

### 7.2 存储空间估算

**单条笔记存储大小**：
- id：8字节
- title：平均50字节（UTF-8）
- content：平均500字节
- category：平均10字节
- created_at：20字节
- updated_at：20字节
- 总计：约600字节/条

**1000条笔记存储空间**：约 600KB

## 8. 数据迁移策略

### 8.1 版本管理

- 数据库版本号存储在 `schema_version` 表
- 每次数据库变更都记录迁移脚本
- 支持向上和向下迁移

### 8.2 迁移脚本命名规范

```
V{版本号}__{描述}.sql
```

示例：
- `V1__initial_schema.sql`
- `V2__add_fulltext_index.sql`

## 9. 备份与恢复

### 9.1 备份策略

- **自动备份**：每日凌晨2点自动备份
- **手动备份**：用户可手动触发备份
- **备份保留**：保留最近7天的备份
- **备份格式**：SQLite 数据库文件（.db）

### 9.2 恢复策略

1. 停止应用服务
2. 备份当前数据库
3. 复制备份文件到数据库目录
4. 重启应用服务
5. 验证数据完整性

## 10. 安全考虑

### 10.1 SQL 注入防护

- 使用参数化查询
- 禁止字符串拼接 SQL
- 严格验证用户输入

### 10.2 数据加密

- 当前版本不加密（个人使用场景）
- 未来可考虑 SQLCipher 加密

### 10.3 访问控制

- 当前版本无访问控制（单用户）
- 未来版本可添加用户认证

## 11. 性能基准

### 11.1 查询性能目标

| 操作 | 响应时间目标 | 说明 |
|------|------------|------|
| 查询笔记列表 | < 100ms | 分页查询 |
| 查询单条笔记 | < 50ms | 主键查询 |
| 搜索笔记 | < 500ms | FULLTEXT 搜索 |
| 创建笔记 | < 100ms | 插入操作 |
| 更新笔记 | < 100ms | 更新操作 |
| 删除笔记 | < 100ms | 删除操作 |

### 11.2 数据量基准

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 支持笔记数量 | 10,000+ | 正常性能 |
| 支持搜索响应 | < 1s | 10000条数据 |
| 启动时间 | < 2s | 数据库初始化 |

---

**文档生成信息**：
- 生成时间：2026-05-17
- 执行者：@dba Agent
- 使用Skill：database-designer
- 状态：已完成
- 下一阶段：API设计（@architect + api-designer）
