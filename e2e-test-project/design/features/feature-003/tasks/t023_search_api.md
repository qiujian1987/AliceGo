# 搜索API开发

## 基本信息

- **任务ID**: T023
- **任务名称**: 搜索API开发（FULLTEXT）
- **所属特性**: feature-003
- **负责人**: @backend-dev
- **优先级**: high
- **预计工时**: 3小时
- **任务状态**: 待执行
- **进度**: 0%

## 任务描述

实现笔记搜索功能的后端API：

1. **搜索API**
   - 实现 `GET /api/notes/search` API端点
   - 实现FULLTEXT全文搜索Service
   - 实现搜索结果高亮
   - 实现搜索结果分页

2. **性能优化**
   - 配置FTS5虚拟表
   - 优化搜索查询性能
   - 添加搜索索引

## 依赖关系

- **依赖任务**: T002, T014
- **前置条件**: 基础架构和笔记CRUD功能完成

## 验收标准

- [ ] GET /api/notes/search API正常工作
- [ ] 可以根据关键词搜索笔记
- [ ] 搜索标题和内容
- [ ] 支持分页查询
- [ ] 搜索关键词最多100字符
- [ ] 关键词为空时返回错误
- [ ] FTS5索引配置正确
- [ ] 搜索性能满足要求（<500ms）

## 相关文档

- `design/features/feature-003/requirements.md`
- `design/features/feature-003/api/api.md`
- `design/project_overview/api_contracts.md`

## API实现

```typescript
// Controller
export const searchNotes = async (req: Request, res: Response) => {
  const { q, limit = 20 } = req.query;
  
  if (!q || typeof q !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: '搜索关键词不能为空'
      }
    });
  }
  
  const result = await searchService.search(q, {
    limit: Number(limit)
  });
  
  return res.json({
    success: true,
    data: result,
    message: '搜索完成'
  });
};
```

## 数据库配置

```sql
-- 创建FTS5虚拟表
CREATE VIRTUAL TABLE notes_fts USING fts5(
  title,
  content,
  content='notes',
  content_rowid='id'
);

-- 创建触发器同步数据
CREATE TRIGGER notes_ai AFTER INSERT ON notes BEGIN
  INSERT INTO notes_fts(rowid, title, content) VALUES (new.id, new.title, new.content);
END;

CREATE TRIGGER notes_ad AFTER DELETE ON notes BEGIN
  INSERT INTO notes_fts(notes_fts, rowid, title, content) VALUES('delete', old.id, old.title, old.content);
END;

CREATE TRIGGER notes_au AFTER UPDATE ON notes BEGIN
  INSERT INTO notes_fts(notes_fts, rowid, title, content) VALUES('delete', old.id, old.title, old.content);
  INSERT INTO notes_fts(rowid, title, content) VALUES (new.id, new.title, new.content);
END;
```

## 变更记录

| 日期 | 变更内容 | 变更人 |
|------|----------|--------|
| 2026-05-17 | 任务创建 | System |
