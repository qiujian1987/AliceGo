# 后端架构设计文档

## 1. 项目概述

- **项目名称**：个人笔记应用
- **项目类型**：前后端分离的Web应用
- **架构风格**：分层架构（Layered Architecture）
- **设计目标**：简单、易用、高性能

## 2. 技术栈

### 2.1 后端技术栈

| 技术 | 选择 | 说明 |
|------|------|------|
| **运行环境** | Node.js 18+ | 稳定 LTS 版本 |
| **框架** | Express.js | 轻量级 Web 框架 |
| **语言** | TypeScript | 类型安全，提高代码质量 |
| **数据库** | SQLite | 轻量级，适合个人使用 |
| **ORM** | better-sqlite3 | 高性能 SQLite 驱动 |
| **验证** | express-validator | 输入验证 |
| **日志** | winston | 结构化日志 |

### 2.2 前端技术栈

| 技术 | 选择 | 说明 |
|------|------|------|
| **框架** | React 18 | 组件化 UI 框架 |
| **语言** | TypeScript | 类型安全 |
| **状态管理** | React Context | 轻量级状态管理 |
| **HTTP 客户端** | axios | API 调用 |
| **样式** | Tailwind CSS | 原子化 CSS |

### 2.3 开发工具

| 工具 | 用途 |
|------|------|
| **构建工具** | Vite | 快速开发构建 |
| **代码规范** | ESLint + Prettier | 代码风格统一 |
| **类型检查** | TypeScript | 静态类型检查 |
| **测试** | Jest + Supertest | 单元测试和 API 测试 |

## 3. 系统架构

### 3.1 架构分层

```
┌─────────────────────────────────────────┐
│           前端层 (React)                │
│  - 用户界面                              │
│  - 组件化开发                            │
│  - 状态管理                              │
└────────────────┬────────────────────────┘
                 │ HTTP/REST API
┌────────────────▼────────────────────────┐
│           API 层 (Express)              │
│  - 路由定义                              │
│  - 请求验证                              │
│  - 响应格式化                            │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│           服务层 (Services)              │
│  - 业务逻辑                              │
│  - 数据处理                              │
│  - 事务管理                              │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│           数据层 (SQLite)                │
│  - 数据持久化                            │
│  - 索引优化                              │
│  - 数据一致性                            │
└─────────────────────────────────────────┘
```

### 3.2 目录结构

```
src/
├── server/
│   ├── index.ts                 # 应用入口
│   ├── app.ts                   # Express 应用配置
│   ├── config/
│   │   └── database.ts          # 数据库配置
│   ├── routes/
│   │   └── notes.ts            # 笔记路由
│   ├── controllers/
│   │   └── notesController.ts  # 笔记控制器
│   ├── services/
│   │   └── notesService.ts     # 笔记服务
│   ├── models/
│   │   └── notesModel.ts       # 笔记数据模型
│   ├── middleware/
│   │   ├── errorHandler.ts     # 错误处理
│   │   └── validator.ts        # 验证中间件
│   ├── utils/
│   │   └── logger.ts          # 日志工具
│   └── types/
│       └── index.ts           # 类型定义
├── client/
│   └── (前端代码)
└── shared/
    └── types/                  # 共享类型定义
```

## 4. 模块划分

### 4.1 模块列表

| 模块 | 职责 | 依赖关系 |
|------|------|---------|
| **笔记管理模块** | 笔记的 CRUD 操作 | 无 |
| **分类管理模块** | 笔记分类和标签管理 | 笔记管理模块 |
| **搜索模块** | 笔记搜索和过滤 | 笔记管理模块 |

### 4.2 笔记管理模块

**职责**：
- 创建笔记（标题、内容、分类）
- 查询笔记列表（支持分页、排序）
- 查询单条笔记详情
- 更新笔记内容
- 删除笔记

**核心类**：
- `NotesController`：处理 HTTP 请求和响应
- `NotesService`：封装业务逻辑
- `NotesModel`：数据库操作

### 4.3 分类管理模块

**职责**：
- 管理笔记分类标签
- 按分类筛选笔记
- 统计分类下的笔记数量

**核心类**：
- `CategoryController`：分类相关请求
- `CategoryService`：分类业务逻辑
- `CategoryModel`：分类数据操作

### 4.4 搜索模块

**职责**：
- 关键词全文搜索
- 搜索结果高亮
- 搜索性能优化

**核心类**：
- `SearchController`：搜索请求处理
- `SearchService`：搜索业务逻辑
- `SearchModel`：搜索数据库操作

## 5. 数据流设计

### 5.1 典型业务流程

**创建笔记流程**：
```
用户输入 → 前端验证 → HTTP POST → API 路由 → 控制器验证 
→ 服务层处理 → 数据模型操作 → SQLite 存储 → 响应返回 
→ 前端更新显示
```

**搜索笔记流程**：
```
用户输入关键词 → 前端防抖(300ms) → HTTP GET → API 路由 
→ 控制器处理 → 服务层搜索 → FULLTEXT 索引查询 → 结果返回 
→ 前端高亮显示
```

### 5.2 数据交互格式

**请求格式**：
```json
// 创建笔记
{
  "title": "笔记标题",
  "content": "笔记内容",
  "category": "工作"
}

// 更新笔记
{
  "title": "更新后的标题",
  "content": "更新后的内容",
  "category": "生活"
}
```

**响应格式**：
```json
// 成功响应
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "标题不能为空"
  }
}
```

## 6. API 设计

### 6.1 API 端点

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/notes | 获取笔记列表 | 否 |
| GET | /api/notes/:id | 获取单条笔记 | 否 |
| POST | /api/notes | 创建笔记 | 否 |
| PUT | /api/notes/:id | 更新笔记 | 否 |
| DELETE | /api/notes/:id | 删除笔记 | 否 |
| GET | /api/notes/search | 搜索笔记 | 否 |
| GET | /api/categories | 获取分类列表 | 否 |
| GET | /api/categories/:name/notes | 按分类获取笔记 | 否 |

### 6.2 请求和响应示例

**GET /api/notes**
```json
// Request
GET /api/notes?page=1&limit=10&category=工作

// Response
{
  "success": true,
  "data": {
    "notes": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

**GET /api/notes/search?q=关键词**
```json
// Request
GET /api/notes/search?q=会议&limit=20

// Response
{
  "success": true,
  "data": {
    "notes": [...],
    "count": 5,
    "query": "会议"
  }
}
```

## 7. 数据库设计

### 7.1 数据表

**notes 表**：
```sql
CREATE TABLE notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- FULLTEXT 索引用于搜索
CREATE VIRTUAL TABLE notes_fts USING fts5(title, content, content='notes', content_rowid='id');
```

### 7.2 索引设计

| 索引类型 | 字段 | 用途 |
|---------|------|------|
| 主键索引 | id | 唯一标识 |
| 普通索引 | category | 分类筛选 |
| 普通索引 | created_at | 排序 |
| FULLTEXT 索引 | title, content | 全文搜索 |

## 8. 安全性设计

### 8.1 输入验证

- **标题**：必填，最大 255 字符
- **内容**：必填，最大长度无限制
- **分类**：可选，最大 50 字符

### 8.2 SQL 注入防护

- 使用参数化查询
- 禁止 SQL 拼接
- 严格的输入验证

### 8.3 XSS 防护

- 对用户输入进行 HTML 转义
- 使用 React 的自动转义特性
- 搜索结果转义显示

## 9. 性能优化

### 9.1 数据库优化

- 使用 FULLTEXT 索引加速搜索
- 合理设计索引
- 分页查询限制返回数量

### 9.2 API 优化

- 支持分页查询
- 搜索防抖（300ms）
- 响应压缩

### 9.3 前端优化

- 组件懒加载
- 数据缓存
- 乐观更新

## 10. 错误处理

### 10.1 错误码定义

| 错误码 | HTTP 状态码 | 说明 |
|--------|------------|------|
| VALIDATION_ERROR | 400 | 输入验证失败 |
| NOT_FOUND | 404 | 资源不存在 |
| INTERNAL_ERROR | 500 | 服务器内部错误 |

### 10.2 错误响应格式

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "标题不能为空",
    "details": {
      "field": "title",
      "reason": "必填字段"
    }
  }
}
```

## 11. 部署架构

### 11.1 开发环境

- Node.js 18+
- SQLite（开发环境）
- Vite（前端热重载）

### 11.2 生产环境

- Node.js 18+ (生产环境)
- SQLite（文件数据库）
- PM2（进程管理）
- Nginx（反向代理，可选）

### 11.3 部署流程

1. 构建前端：`npm run build`
2. 打包后端：`npm run build:server`
3. 配置环境变量
4. 启动服务：`pm2 start`
5. 配置 Nginx（可选）

## 12. 监控与日志

### 12.1 日志系统

- 访问日志：记录所有 API 请求
- 错误日志：记录异常和错误
- 调试日志：开发环境详细日志

### 12.2 日志格式

```json
{
  "timestamp": "2026-05-17T10:00:00Z",
  "level": "info",
  "message": "笔记创建成功",
  "meta": {
    "method": "POST",
    "path": "/api/notes",
    "duration": "45ms",
    "noteId": 1
  }
}
```

---

**文档生成信息**：
- 生成时间：2026-05-17
- 执行者：@architect Agent
- 使用Skill：architecture-planner
- 状态：已完成
- 下一阶段：前端架构设计（@frontend-designer）
