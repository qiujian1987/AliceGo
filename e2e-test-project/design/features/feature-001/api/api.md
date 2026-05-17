# 笔记管理 API 文档

## 特性信息

- **特性ID**：feature-001
- **特性名称**：笔记管理
- **所属模块**：个人笔记应用
- **优先级**：高

## API 端点

### 1. 创建笔记

**端点**：`POST /api/notes`

**请求体**：
```json
{
  "title": "string (必填, 最大255字符)",
  "content": "string (必填)",
  "category": "string (可选, 最大50字符)"
}
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
  "message": "创建成功"
}
```

**对应需求**：
- FR-001-001 ✅
- FR-001-002 ✅
- FR-001-003 ✅
- FR-001-004 ✅

---

### 2. 获取笔记列表

**端点**：`GET /api/notes`

**查询参数**：
- `page`: integer (可选, 默认1)
- `limit`: integer (可选, 默认10, 最大100)
- `category`: string (可选, 按分类筛选)

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

**对应需求**：
- FR-001-005 ✅
- FR-001-006 ✅
- FR-001-007 ✅

---

### 3. 获取单条笔记

**端点**：`GET /api/notes/:id`

**路径参数**：
- `id`: integer (笔记ID)

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

**对应需求**：
- FR-001-008 ✅
- FR-001-009 ✅

---

### 4. 更新笔记

**端点**：`PUT /api/notes/:id`

**路径参数**：
- `id`: integer (笔记ID)

**请求体**：
```json
{
  "title": "string (必填, 最大255字符)",
  "content": "string (必填)",
  "category": "string (可选, 最大50字符)"
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

**对应需求**：
- FR-001-010 ✅
- FR-001-011 ✅
- FR-001-012 ✅

---

### 5. 删除笔记

**端点**：`DELETE /api/notes/:id`

**路径参数**：
- `id`: integer (笔记ID)

**响应示例**：
```json
{
  "success": true,
  "data": null,
  "message": "删除成功"
}
```

**对应需求**：
- FR-001-013 ✅
- FR-001-014 ✅
- FR-001-015 ✅

---

## 数据模型

### Note 实体

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PRIMARY KEY | 笔记ID |
| title | TEXT | NOT NULL | 笔记标题 |
| content | TEXT | NOT NULL | 笔记内容 |
| category | TEXT | DEFAULT '' | 分类标签 |
| created_at | DATETIME | AUTO | 创建时间 |
| updated_at | DATETIME | AUTO | 更新时间 |

---

## 错误处理

| HTTP 状态码 | 错误码 | 场景 |
|------------|--------|------|
| 400 | VALIDATION_ERROR | 输入验证失败 |
| 404 | NOT_FOUND | 笔记不存在 |
| 500 | INTERNAL_ERROR | 服务器错误 |

---

**文档生成信息**：
- 生成时间：2026-05-17
- 执行者：@architect Agent
- 状态：已完成
