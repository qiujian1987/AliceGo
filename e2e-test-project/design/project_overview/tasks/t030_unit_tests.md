# 单元测试

## 基本信息

- **任务ID**: T030
- **任务名称**: 单元测试
- **所属特性**: 公共任务
- **负责人**: @qa
- **优先级**: high
- **预计工时**: 8小时
- **任务状态**: 待执行
- **进度**: 0%

## 任务描述

为所有核心业务逻辑编写单元测试，覆盖率目标≥80%：

1. **后端单元测试**
   - Service层业务逻辑测试
   - Model层数据操作测试
   - 中间件测试
   - 工具函数测试

2. **前端单元测试**
   - 组件测试（使用React Testing Library）
   - Hook测试
   - 工具函数测试

## 依赖关系

- **依赖任务**: T002, T003, T010-014, T020-024
- **前置条件**: 所有开发和功能测试通过

## 验收标准

- [ ] Service层测试覆盖率≥80%
- [ ] Model层测试覆盖率≥80%
- [ ] 关键工具函数测试覆盖率100%
- [ ] 组件测试通过率100%
- [ ] Hook测试通过率100%
- [ ] 总覆盖率≥80%

## 相关文档

- `design/project_overview/backend_architecture.md`
- `design/project_overview/frontend_architecture.md`

## 测试框架

### 后端测试

```javascript
// 使用Jest + Supertest
describe('NotesService', () => {
  test('should create a new note', async () => {
    // 测试代码
  });
});
```

### 前端测试

```javascript
// 使用Jest + React Testing Library
describe('NoteForm', () => {
  test('should render form fields', () => {
    // 测试代码
  });
});
```

## 变更记录

| 日期 | 变更内容 | 变更人 |
|------|----------|--------|
| 2026-05-17 | 任务创建 | System |
