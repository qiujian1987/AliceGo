# 笔记创建功能

## 基本信息

- **任务ID**: T010
- **任务名称**: 笔记创建功能（API+UI）
- **所属特性**: feature-001
- **负责人**: @backend-dev / @frontend-dev
- **优先级**: high
- **预计工时**: 4小时
- **任务状态**: 待执行
- **进度**: 0%

## 任务描述

实现笔记创建功能，包括：

1. **后端实现**
   - 实现 `POST /api/notes` API端点
   - 实现笔记创建Service
   - 实现笔记创建Model
   - 实现输入验证
   - 实现错误处理

2. **前端实现**
   - 实现笔记创建表单组件
   - 实现笔记创建API调用
   - 实现表单验证
   - 实现提交反馈

## 依赖关系

- **依赖任务**: T002, T003
- **前置条件**: 基础架构搭建完成

## 验收标准

- [ ] POST /api/notes API正常工作
- [ ] 可以创建包含标题和内容的笔记
- [ ] 创建成功返回笔记ID和完整数据
- [ ] 标题为空时返回400错误
- [ ] 内容为空时返回400错误
- [ ] 前端表单可以提交创建请求
- [ ] 创建成功显示成功提示
- [ ] 创建失败显示错误提示

## 相关文档

- `design/features/feature-001/requirements.md`
- `design/features/feature-001/api/api.md`
- `design/project_overview/api_contracts.md`

## API实现

```typescript
// Controller
export const createNote = async (req: Request, res: Response) => {
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
  
  const note = await notesService.create({ title, content, category });
  
  return res.status(201).json({
    success: true,
    data: note,
    message: '创建成功'
  });
};
```

## 变更记录

| 日期 | 变更内容 | 变更人 |
|------|----------|--------|
| 2026-05-17 | 任务创建 | System |
