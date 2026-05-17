# 笔记列表功能

## 基本信息

- **任务ID**: T011
- **任务名称**: 笔记列表功能（API+UI）
- **所属特性**: feature-001
- **负责人**: @backend-dev / @frontend-dev
- **优先级**: high
- **预计工时**: 3小时
- **任务状态**: 待执行
- **进度**: 0%

## 任务描述

实现笔记列表功能，包括：

1. **后端实现**
   - 实现 `GET /api/notes` API端点
   - 实现笔记列表查询Service
   - 实现分页功能
   - 实现按分类筛选功能
   - 实现按创建时间排序

2. **前端实现**
   - 实现笔记列表页面
   - 实现笔记卡片组件
   - 实现分页组件
   - 实现笔记摘要显示

## 依赖关系

- **依赖任务**: T010
- **前置条件**: 笔记创建功能完成

## 验收标准

- [ ] GET /api/notes API正常工作
- [ ] 返回笔记列表（按创建时间倒序）
- [ ] 支持分页查询
- [ ] 支持按分类筛选
- [ ] 列表返回笔记标题、摘要、创建时间
- [ ] 前端页面正常显示笔记列表
- [ ] 分页功能正常工作
- [ ] 点击笔记可以跳转详情页

## 相关文档

- `design/features/feature-001/requirements.md`
- `design/features/feature-001/api/api.md`
- `design/project_overview/api_contracts.md`

## API实现

```typescript
// Controller
export const getNotes = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, category } = req.query;
  
  const result = await notesService.getList({
    page: Number(page),
    limit: Number(limit),
    category: category as string
  });
  
  return res.json({
    success: true,
    data: result,
    message: '获取成功'
  });
};
```

## 变更记录

| 日期 | 变更内容 | 变更人 |
|------|----------|--------|
| 2026-05-17 | 任务创建 | System |
