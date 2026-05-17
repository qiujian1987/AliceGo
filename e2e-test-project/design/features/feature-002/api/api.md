# 分类管理 API 文档

## 特性信息

- **特性ID**：feature-002
- **特性名称**：分类管理
- **所属模块**：个人笔记应用
- **优先级**：高

## API 端点

### 1. 获取分类列表

**端点**：`GET /api/categories`

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

**对应需求**：
- FR-002-008 ✅
- FR-002-009 ✅

---

### 2. 按分类获取笔记

**端点**：`GET /api/categories/:name/notes`

**路径参数**：
- `name`: string (分类名称)

**查询参数**：
- `page`: integer (可选, 默认1)
- `limit`: integer (可选, 默认10, 最大100)

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

**对应需求**：
- FR-002-005 ✅
- FR-002-006 ✅
- FR-002-007 ✅
- FR-002-010 ✅

---

### 3. 创建笔记（包含分类）

**端点**：`POST /api/notes`

**请求体**：
```json
{
  "title": "string (必填)",
  "content": "string (必填)",
  "category": "string (可选)"
}
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "新笔记",
    "content": "这是笔记内容",
    "category": "工作",
    "created_at": "2026-05-17T11:00:00Z",
    "updated_at": "2026-05-17T11:00:00Z"
  },
  "message": "创建成功"
}
```

**对应需求**：
- FR-002-001 ✅
- FR-002-003 ✅
- FR-002-004 ✅

---

### 4. 更新笔记（包含分类）

**端点**：`PUT /api/notes/:id`

**请求体**：
```json
{
  "title": "string (必填)",
  "content": "string (必填)",
  "category": "string (可选)"
}
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "更新后的笔记",
    "content": "这是更新后的内容",
    "category": "生活",
    "created_at": "2026-05-17T10:00:00Z",
    "updated_at": "2026-05-17T12:00:00Z"
  },
  "message": "更新成功"
}
```

**对应需求**：
- FR-002-002 ✅

---

## 分类数据格式

### Category 实体

| 字段 | 类型 | 说明 |
|------|------|------|
| name | TEXT | 分类名称 |
| note_count | INTEGER | 笔记数量 |

### 分类规则

- 分类名称不区分大小写（"Work" 和 "work" 视为同一分类）
- 分类名称最大50字符
- 空字符串表示无分类

---

## 错误处理

| HTTP 状态码 | 错误码 | 场景 |
|------------|--------|------|
| 400 | VALIDATION_ERROR | 分类名称过长 |
| 404 | NOT_FOUND | 分类不存在 |
| 500 | INTERNAL_ERROR | 服务器错误 |

---

**文档生成信息**：
- 生成时间：2026-05-17
- 执行者：@architect Agent
- 状态：已完成
