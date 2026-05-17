# 笔记删除功能

## 基本信息

- **任务ID**: T014
- **任务名称**: 笔记删除功能（API+UI）
- **所属特性**: feature-001
- **负责人**: @backend-dev / @frontend-dev
- **优先级**: high
- **预计工时**: 2小时
- **任务状态**: 待执行
- **进度**: 0%

## 任务描述

实现笔记删除功能，包括：

1. **后端实现**
   - 实现 `DELETE /api/notes/:id` API端点
   - 实现笔记删除Service
   - 实现笔记不存在错误处理

2. **前端实现**
   - 实现删除确认对话框
   - 实现删除API调用
   - 实现删除后列表刷新

## 依赖关系

- **依赖任务**: T013
- **前置条件**: 笔记编辑功能完成

## 验收标准

- [ ] DELETE /api/notes/:id API正常工作
- [ ] 可以删除指定ID的笔记
- [ ] 删除成功返回成功状态
- [ ] 笔记不存在时返回404错误
- [ ] 前端显示删除确认对话框
- [ ] 确认删除后调用API
- [ ] 删除成功后刷新列表

## 相关文档

- `design/features/feature-001/requirements.md`
- `design/features/feature-001/api/api.md`
- `design/project_overview/api_contracts.md`

## API实现

```typescript
// Controller
export const deleteNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const success = await notesService.delete(Number(id));
  
  if (!success) {
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
    data: null,
    message: '删除成功'
  });
};
```

## 变更记录

| 日期 | 变更内容 | 变更人 |
|------|----------|--------|
| 2026-05-17 | 任务创建 | System |
