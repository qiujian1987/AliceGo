# 分类管理API开发

## 基本信息

- **任务ID**: T020
- **任务名称**: 分类管理API开发
- **所属特性**: feature-002
- **负责人**: @backend-dev
- **优先级**: high
- **预计工时**: 3小时
- **任务状态**: 待执行
- **进度**: 0%

## 任务描述

实现分类管理相关的API端点：

1. **分类列表API**
   - 实现 `GET /api/categories` API端点
   - 实现分类查询Service
   - 实现笔记数量统计

2. **按分类获取笔记API**
   - 实现 `GET /api/categories/:name/notes` API端点
   - 实现按分类筛选Service

## 依赖关系

- **依赖任务**: T002, T014
- **前置条件**: 基础架构和笔记CRUD功能完成

## 验收标准

- [ ] GET /api/categories API正常工作
- [ ] 返回所有分类列表
- [ ] 每个分类包含笔记数量
- [ ] GET /api/categories/:name/notes API正常工作
- [ ] 可以按分类获取笔记列表
- [ ] 支持分页查询
- [ ] 分类不存在时返回空列表

## 相关文档

- `design/features/feature-002/requirements.md`
- `design/features/feature-002/api/api.md`
- `design/project_overview/api_contracts.md`

## API实现

```typescript
// Controller
export const getCategories = async (req: Request, res: Response) => {
  const categories = await categoryService.getAll();
  
  return res.json({
    success: true,
    data: { categories },
    message: '获取成功'
  });
};

export const getNotesByCategory = async (req: Request, res: Response) => {
  const { name } = req.params;
  const { page = 1, limit = 10 } = req.query;
  
  const result = await categoryService.getNotesByCategory(name, {
    page: Number(page),
    limit: Number(limit)
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
