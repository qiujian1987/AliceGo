# 笔记详情功能

## 基本信息

- **任务ID**: T012
- **任务名称**: 笔记详情功能（API+UI）
- **所属特性**: feature-001
- **负责人**: @backend-dev / @frontend-dev
- **优先级**: high
- **预计工时**: 2小时
- **任务状态**: 待执行
- **进度**: 0%

## 任务描述

实现笔记详情查看功能，包括：

1. **后端实现**
   - 实现 `GET /api/notes/:id` API端点
   - 实现单条笔记查询Service
   - 实现笔记不存在错误处理

2. **前端实现**
   - 实现笔记详情页面
   - 显示笔记完整内容
   - 显示笔记创建和更新时间
   - 实现返回按钮

## 依赖关系

- **依赖任务**: T011
- **前置条件**: 笔记列表功能完成

## 验收标准

- [ ] GET /api/notes/:id API正常工作
- [ ] 可以获取单条笔记的完整内容
- [ ] 笔记不存在时返回404错误
- [ ] 返回数据包含标题、内容、创建时间、更新时间
- [ ] 前端详情页面正常显示
- [ ] 点击返回可以回到列表页

## 相关文档

- `design/features/feature-001/requirements.md`
- `design/features/feature-001/api/api.md`
- `design/project_overview/api_contracts.md`

## API实现

```typescript
// Controller
export const getNoteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const note = await notesService.getById(Number(id));
  
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
    message: '获取成功'
  });
};
```

## 变更记录

| 日期 | 变更内容 | 变更人 |
|------|----------|--------|
| 2026-05-17 | 任务创建 | System |
