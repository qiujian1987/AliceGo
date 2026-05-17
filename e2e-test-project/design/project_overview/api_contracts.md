# API 接口设计文档

## 1. API 设计概述

- **API 风格**：RESTful
- **协议**：HTTP/HTTPS
- **数据格式**：JSON
- **字符编码**：UTF-8

## 2. 基础信息

### 2.1 Base URL

```
开发环境：http://localhost:3000/api
生产环境：https://api.example.com/api
```

### 2.2 通用请求头

```
Content-Type: application/json
Accept: application/json
```

### 2.3 通用响应格式

**成功响应**：
```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

**错误响应**：
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误信息",
    "details": { ... }
  }
}
```

## 3. API 端点

### 3.1 笔记管理

#### 3.1.1 获取笔记列表

**端点**：`GET /api/notes`

**查询参数**：
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | integer | 否 | 1 | 页码 |
| limit | integer | 否 | 10 | 每页数量（最大100） |
| category | string | 否 | - | 按分类筛选 |

**请求示例**：
```bash
GET /api/notes?page=1&limit=10&category=工作
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "notes": [
      {
        "id": 1,
        "title": "会议记录",
        "content": "今天开会讨论了项目进度...",
        "category": "工作",
        "created_at": "2026-05-17T10:00:00Z",
        "updated_at": "2026-05-17T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  },
  "message": "获取成功"
}
```

---

#### 3.1.2 获取单条笔记

**端点**：`GET /api/notes/:id`

**路径参数**：
| 参数 | 类型 | 说明 |
|------|------|------|
| id | integer | 笔记ID |

**请求示例**：
```bash
GET /api/notes/1
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "会议记录",
    "content": "今天开会讨论了项目进度...",
    "category": "工作",
    "created_at": "2026-05-17T10:00:00Z",
    "updated_at": "2026-05-17T10:00:00Z"
  },
  "message": "获取成功"
}
```

---

#### 3.1.3 创建笔记

**端点**：`POST /api/notes`

**请求体**：
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 笔记标题（最大255字符） |
| content | string | 是 | 笔记内容 |
| category | string | 否 | 分类标签（最大50字符） |

**请求示例**：
```bash
POST /api/notes
Content-Type: application/json

{
  "title": "新笔记",
  "content": "这是笔记内容",
  "category": "工作"
}
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "新笔记",
    "content": "这是笔记内容",
    "category": "工作",
    "created_at": "2026-05-17T11:00:00Z",
    "updated_at": "2026-05-17T11:00:00Z"
  },
  "message": "创建成功"
}
```

---

#### 3.1.4 更新笔记

**端点**：`PUT /api/notes/:id`

**路径参数**：
| 参数 | 类型 | 说明 |
|------|------|------|
| id | integer | 笔记ID |

**请求体**：
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 笔记标题（最大255字符） |
| content | string | 是 | 笔记内容 |
| category | string | 否 | 分类标签（最大50字符） |

**请求示例**：
```bash
PUT /api/notes/1
Content-Type: application/json

{
  "title": "更新后的标题",
  "content": "更新后的内容",
  "category": "生活"
}
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "更新后的标题",
    "content": "更新后的内容",
    "category": "生活",
    "created_at": "2026-05-17T10:00:00Z",
    "updated_at": "2026-05-17T12:00:00Z"
  },
  "message": "更新成功"
}
```

---

#### 3.1.5 删除笔记

**端点**：`DELETE /api/notes/:id`

**路径参数**：
| 参数 | 类型 | 说明 |
|------|------|------|
| id | integer | 笔记ID |

**请求示例**：
```bash
DELETE /api/notes/1
```

**响应示例**：
```json
{
  "success": true,
  "data": null,
  "message": "删除成功"
}
```

### 3.2 搜索功能

#### 3.2.1 搜索笔记

**端点**：`GET /api/notes/search`

**查询参数**：
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| q | string | 是 | - | 搜索关键词（最大100字符） |
| limit | integer | 否 | 20 | 返回数量（最大100） |

**请求示例**：
```bash
GET /api/notes/search?q=会议&limit=10
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "notes": [
      {
        "id": 1,
        "title": "会议记录",
        "content": "今天开会讨论了项目进度...",
        "category": "工作",
        "created_at": "2026-05-17T10:00:00Z",
        "updated_at": "2026-05-17T10:00:00Z"
      }
    ],
    "count": 1,
    "query": "会议"
  },
  "message": "搜索完成"
}
```

### 3.3 分类管理

#### 3.3.1 获取分类列表

**端点**：`GET /api/categories`

**请求示例**：
```bash
GET /api/categories
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "name": "工作",
        "note_count": 15
      },
      {
        "name": "生活",
        "note_count": 8
      }
    ]
  },
  "message": "获取成功"
}
```

---

#### 3.3.2 按分类获取笔记

**端点**：`GET /api/categories/:name/notes`

**路径参数**：
| 参数 | 类型 | 说明 |
|------|------|------|
| name | string | 分类名称 |

**查询参数**：
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | integer | 否 | 1 | 页码 |
| limit | integer | 否 | 10 | 每页数量 |

**请求示例**：
```bash
GET /api/categories/工作/notes?page=1&limit=10
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "category": "工作",
    "notes": [
      {
        "id": 1,
        "title": "会议记录",
        "content": "今天开会讨论了项目进度...",
        "created_at": "2026-05-17T10:00:00Z",
        "updated_at": "2026-05-17T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "totalPages": 2
    }
  },
  "message": "获取成功"
}
```

## 4. 错误处理

### 4.1 错误码定义

| HTTP 状态码 | 错误码 | 说明 |
|------------|--------|------|
| 400 | VALIDATION_ERROR | 输入验证失败 |
| 400 | INVALID_PARAMETER | 参数无效 |
| 404 | NOT_FOUND | 资源不存在 |
| 500 | INTERNAL_ERROR | 服务器内部错误 |

### 4.2 错误响应示例

**400 验证错误**：
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

**404 资源不存在**：
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "笔记不存在",
    "details": {
      "resource": "note",
      "id": 999
    }
  }
}
```

## 5. 认证与授权

### 5.1 当前版本

- **认证方式**：无（单用户应用）
- **访问控制**：无限制

### 5.2 未来版本（预留）

- **认证方式**：JWT Token
- **访问控制**：基于用户 ID

## 6. 速率限制

### 6.1 当前版本

- **限制**：无明确限制
- **建议**：避免频繁请求（> 100次/分钟）

### 6.2 未来版本

- **限制**：100 次请求/分钟
- **响应头**：
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1621234567
  ```

## 7. 版本管理

### 7.1 当前版本

- **API 版本**：v1
- **Base URL**：`/api/v1/notes`

### 7.2 版本策略

- 未来版本通过 URL 路径区分：`/api/v2/notes`
- 保持旧版本兼容直到新版本稳定

## 8. API 测试

### 8.1 测试工具

推荐使用以下工具测试 API：
- **Postman**：功能强大的 API 测试工具
- **Insomnia**：轻量级 API 客户端
- **curl**：命令行工具

### 8.2 测试示例

**使用 curl 测试创建笔记**：
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试笔记",
    "content": "这是测试内容",
    "category": "测试"
  }'
```

---

**文档生成信息**：
- 生成时间：2026-05-17
- 执行者：@architect Agent
- 使用Skill：api-designer
- 状态：已完成
- 下一阶段：设计评审（@design-reviewer）
