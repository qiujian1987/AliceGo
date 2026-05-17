# 笔记编辑功能

## 基本信息

- **任务ID**: T013
- **任务名称**: 笔记编辑功能（API+UI）
- **所属特性**: feature-001
- **负责人**: @backend-dev / @frontend-dev
- **优先级**: high
- **预计工时**: 3小时
- **任务状态**: 待执行
- **进度**: 0%

## 任务描述

实现笔记编辑功能，包括：

1. **后端实现**
   - 实现 `PUT /api/notes/:id` API端点
   - 实现笔记更新Service
   - 实现更新时间戳逻辑
   - 实现笔记不存在错误处理
   - 实现输入验证

2. **前端实现**
   - 实现笔记编辑表单
   - 实现表单预填充
   - 实现保存功能
   - 实现取消功能

## 依赖关系

- **依赖任务**: T012
- **前置条件**: 笔记详情功能完成

## 验收标准

- [ ] PUT /api/notes/:id API正常工作
- [ ] 可以更新笔记的标题和内容
- [ ] 更新成功自动更新updated_at时间戳
- [ ] 笔记不存在时返回404错误
- [ ] 标题为空时返回400错误
- [ ] 内容为空时返回400错误
- [ ] 前端编辑表单可以正常编辑
- [ ] 保存成功返回编辑后的数据
- [ ] 取消编辑可以返回详情页

## 相关文档

- `design/features/feature-001/requirements.md`
- `design/features/feature-001/api/api.md`
- `design/project_overview/api_contracts.md`

## API实现

```typescript
// Controller
export const updateNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, category } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: '标题和内容不能为空'
      }
    });
  }
  
  const note = await notesService.update(Number(id), { title, content, category });
  
  if (!note) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: '笔记不存在'
      }
    });
  }
  
  return res.json({
    success: true,
    data: note,
    message: '更新成功'
  });
};
```

## 变更记录

| 日期 | 变更内容 | 变更人 |
|------|----------|--------|
| 2026-05-17 | 任务创建 | System |
