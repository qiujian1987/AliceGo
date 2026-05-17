# 前端架构设计文档

## 1. 前端架构概述

- **项目名称**：个人笔记应用前端
- **架构风格**：组件化架构（Component-Based Architecture）
- **设计目标**：简洁、易用、响应迅速

## 2. 技术栈

### 2.1 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| **React** | 18.x | UI 框架 |
| **TypeScript** | 5.x | 类型安全 |
| **Vite** | 5.x | 构建工具 |
| **React Router** | 6.x | 路由管理 |

### 2.2 状态管理

| 技术 | 用途 | 说明 |
|------|------|------|
| **React Context** | 全局状态 | 用户偏好设置 |
| **React Query** | 服务端状态 | API 数据缓存和同步 |

### 2.3 UI 组件

| 技术 | 用途 | 说明 |
|------|------|------|
| **Tailwind CSS** | 样式框架 | 原子化 CSS |
| **Lucide React** | 图标库 | 轻量级图标 |
| **React Markdown** | 内容渲染 | 笔记内容渲染 |

### 2.4 工具库

| 技术 | 用途 |
|------|------|
| **axios** | HTTP 客户端 |
| **date-fns** | 日期处理 |
| **dompurify** | XSS 防护 |

## 3. 项目结构

### 3.1 目录结构

```
src/
├── main.tsx                 # 应用入口
├── App.tsx                  # 根组件
├── index.css                # 全局样式
├── api/
│   ├── client.ts           # API 客户端配置
│   ├── notes.ts            # 笔记 API
│   └── categories.ts       # 分类 API
├── components/
│   ├── common/             # 通用组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Loading.tsx
│   ├── notes/              # 笔记相关组件
│   │   ├── NoteList.tsx
│   │   ├── NoteCard.tsx
│   │   ├── NoteEditor.tsx
│   │   ├── NoteDetail.tsx
│   │   └── NoteSearch.tsx
│   └── layout/             # 布局组件
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Layout.tsx
├── pages/
│   ├── HomePage.tsx        # 首页/笔记列表
│   ├── NoteDetailPage.tsx  # 笔记详情
│   ├── NoteEditorPage.tsx  # 笔记编辑
│   ├── SearchPage.tsx      # 搜索结果
│   └── CategoryPage.tsx   # 分类笔记
├── hooks/
│   ├── useNotes.ts         # 笔记数据钩子
│   ├── useCategories.ts   # 分类数据钩子
│   └── useSearch.ts        # 搜索钩子
├── context/
│   └── AppContext.tsx      # 全局状态上下文
├── types/
│   ├── note.ts             # 笔记类型定义
│   ├── category.ts         # 分类类型定义
│   └── api.ts              # API 类型定义
├── utils/
│   ├── formatters.ts       # 格式化工具
│   ├── validators.ts       # 验证工具
│   └── constants.ts        # 常量定义
└── styles/
    └── global.css          # 全局样式
```

### 3.2 文件命名规范

- 组件文件：PascalCase（如 `NoteList.tsx`）
- 工具文件：camelCase（如 `formatters.ts`）
- 类型文件：kebab-case（如 `note-type.ts`）

## 4. 组件设计

### 4.1 组件层次

```
App
└── Layout
    ├── Header
    ├── Sidebar
    └── Main Content
        ├── HomePage
        │   ├── NoteSearch
        │   ├── NoteList
        │   │   └── NoteCard (×n)
        │   └── FAB (新增笔记按钮)
        ├── NoteDetailPage
        │   └── NoteDetail
        ├── NoteEditorPage
        │   └── NoteEditor
        ├── SearchPage
        │   ├── SearchBar
        │   └── NoteList
        └── CategoryPage
            ├── CategoryFilter
            └── NoteList
```

### 4.2 通用组件

| 组件 | 用途 | Props |
|------|------|-------|
| **Button** | 按钮 | variant, size, disabled, onClick |
| **Card** | 卡片容器 | title, content, actions |
| **Input** | 输入框 | type, value, onChange, error |
| **Modal** | 模态框 | isOpen, onClose, children |
| **Loading** | 加载状态 | size, message |

### 4.3 业务组件

| 组件 | 用途 | 依赖 API |
|------|------|---------|
| **NoteList** | 笔记列表 | GET /api/notes |
| **NoteCard** | 笔记卡片 | - |
| **NoteEditor** | 笔记编辑器 | POST/PUT /api/notes |
| **NoteDetail** | 笔记详情 | GET /api/notes/:id |
| **NoteSearch** | 搜索组件 | GET /api/notes/search |
| **CategoryFilter** | 分类筛选 | GET /api/categories |

## 5. 页面设计

### 5.1 页面列表

| 页面 | 路由 | 描述 |
|------|------|------|
| 首页 | `/` | 笔记列表页面 |
| 笔记详情 | `/notes/:id` | 查看单条笔记 |
| 编辑笔记 | `/notes/:id/edit` | 编辑已有笔记 |
| 新建笔记 | `/notes/new` | 创建新笔记 |
| 搜索结果 | `/search?q=keyword` | 搜索结果页面 |
| 分类笔记 | `/category/:name` | 特定分类的笔记 |

### 5.2 首页（笔记列表）

**布局结构**：
```
┌──────────────────────────────────┐
│ Header                           │
│ [Logo] [Search Bar] [Actions]    │
├──────────────────────────────────┤
│ Sidebar (可选)                    │
│ [分类列表] [笔记统计]             │
├──────────────────────────────────┤
│ Main Content                     │
│ ┌────────────────────────────┐   │
│ │ NoteCard                   │   │
│ │ - 标题                     │   │
│ │ - 摘要                     │   │
│ │ - 分类标签 | 创建时间       │   │
│ └────────────────────────────┘   │
│ ┌────────────────────────────┐   │
│ │ NoteCard                   │   │
│ └────────────────────────────┘   │
│ ...                              │
│ [加载更多]                        │
├──────────────────────────────────┤
│ FAB                              │
│ [+ 新增笔记] (右下角悬浮按钮)     │
└──────────────────────────────────┘
```

### 5.3 笔记详情页

**布局结构**：
```
┌──────────────────────────────────┐
│ Header                           │
│ [← 返回] [编辑] [删除]           │
├──────────────────────────────────┤
│ Main Content                     │
│ ┌────────────────────────────┐   │
│ │ 标题                       │   │
│ │ 分类标签                   │   │
│ │ 创建时间 | 更新时间        │   │
│ ├────────────────────────────┤   │
│ │ 笔记内容                   │   │
│ │ (Markdown 渲染)            │   │
│ └────────────────────────────┘   │
└──────────────────────────────────┘
```

### 5.4 笔记编辑器

**布局结构**：
```
┌──────────────────────────────────┐
│ Header                           │
│ [← 取消] [保存]                  │
├──────────────────────────────────┤
│ Form                             │
│ ┌────────────────────────────┐   │
│ │ 标题输入框                 │   │
│ └────────────────────────────┘   │
│ ┌────────────────────────────┐   │
│ │ 分类选择器                 │   │
│ └────────────────────────────┘   │
│ ┌────────────────────────────┐   │
│ │ 内容编辑器                 │   │
│ │ (Markdown 或富文本)        │   │
│ └────────────────────────────┘   │
└──────────────────────────────────┘
```

## 6. 路由设计

### 6.1 路由配置

```typescript
const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/notes/new',
    element: <NoteEditorPage mode="create" />,
  },
  {
    path: '/notes/:id',
    element: <NoteDetailPage />,
  },
  {
    path: '/notes/:id/edit',
    element: <NoteEditorPage mode="edit" />,
  },
  {
    path: '/search',
    element: <SearchPage />,
  },
  {
    path: '/category/:categoryName',
    element: <CategoryPage />,
  },
];
```

### 6.2 路由守卫

- 无需认证（当前版本）
- 未来版本可添加路由守卫用于权限控制

## 7. 状态管理

### 7.1 状态类型

| 状态 | 类型 | 管理方式 | 说明 |
|------|------|---------|------|
| **笔记列表** | 服务端状态 | React Query | API 数据缓存 |
| **当前笔记** | 服务端状态 | React Query | 单条笔记数据 |
| **搜索结果** | 服务端状态 | React Query | 搜索缓存 |
| **分类列表** | 服务端状态 | React Query | 分类缓存 |
| **UI 状态** | 本地状态 | useState | 弹窗、加载等 |
| **用户偏好** | 全局状态 | Context | 主题、语言等 |

### 7.2 React Query 配置

```typescript
// 查询配置
const noteQueries = {
  staleTime: 5 * 60 * 1000, // 5分钟
  cacheTime: 30 * 60 * 1000, // 30分钟
  retry: 1,
};

// 缓存键
const queryKeys = {
  notes: ['notes'],
  note: (id) => ['notes', id],
  search: (query) => ['notes', 'search', query],
  categories: ['categories'],
};
```

## 8. API 集成

### 8.1 API 客户端

```typescript
// axios 实例配置
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 拦截器
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 错误处理
    return Promise.reject(error);
  }
);
```

### 8.2 数据流

```
用户操作 → Hook → API Client → 后端 API
                                    ↓
UI 更新 ← 状态更新 ← React Query ← 响应数据
```

### 8.3 错误处理

| 错误类型 | 处理方式 | 用户提示 |
|---------|---------|---------|
| **网络错误** | 重试 | "网络连接失败，请重试" |
| **404** | 跳转404页面 | "笔记不存在" |
| **400** | 显示验证错误 | 具体字段错误信息 |
| **500** | 提示服务器错误 | "服务器繁忙，请稍后再试" |

## 9. 响应式设计

### 9.1 断点定义

| 断点 | 屏幕宽度 | 布局 |
|------|---------|------|
| **mobile** | < 640px | 单列布局 |
| **tablet** | 640px - 1024px | 双列布局 |
| **desktop** | > 1024px | 多列布局 + 侧边栏 |

### 9.2 响应式策略

- **移动优先**：从最小屏幕开始设计
- **渐进增强**：根据屏幕大小添加功能
- **容器查询**：组件级响应式设计

## 10. 性能优化

### 10.1 组件优化

- 使用 `React.memo` 避免不必要的重渲染
- 使用 `useMemo` 和 `useCallback` 缓存计算结果
- 组件懒加载：`React.lazy()`

### 10.2 数据加载优化

- 分页加载：每次加载 10-20 条
- 虚拟滚动：大列表使用虚拟化
- 骨架屏：加载时显示占位

### 10.3 资源优化

- 图片懒加载
- 代码分割
- Tree shaking

## 11. 用户体验

### 11.1 加载状态

- 列表加载：骨架屏占位
- 详情加载：内容区骨架屏
- 提交操作：按钮 loading 状态
- 全局加载：顶部进度条

### 11.2 空状态

- 无笔记：引导创建第一个笔记
- 搜索无结果：友好提示 + 建议
- 分类无笔记：提示 + 建议

### 11.3 错误处理

- 表单验证：实时反馈
- API 错误：Toast 提示
- 404：友好的 404 页面

### 11.4 交互动效

- 页面切换：淡入淡出
- 列表项：交错动画
- 按钮反馈：缩放 + 颜色
- 删除确认：滑动删除

## 12. 样式规范

### 12.1 颜色系统

```css
:root {
  /* 主色 */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  
  /* 辅助色 */
  --color-secondary: #64748b;
  
  /* 背景色 */
  --color-bg: #ffffff;
  --color-bg-secondary: #f8fafc;
  
  /* 文字色 */
  --color-text: #1e293b;
  --color-text-secondary: #64748b;
  
  /* 状态色 */
  --color-success: #22c55e;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
}
```

### 12.2 间距系统

```css
:root {
  --space-xs: 0.25rem;  /* 4px */
  --space-sm: 0.5rem;   /* 8px */
  --space-md: 1rem;     /* 16px */
  --space-lg: 1.5rem;   /* 24px */
  --space-xl: 2rem;      /* 32px */
}
```

### 12.3 字体系统

```css
:root {
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-mono: ui-monospace, monospace;
  
  --text-xs: 0.75rem;   /* 12px */
  --text-sm: 0.875rem;  /* 14px */
  --text-base: 1rem;    /* 16px */
  --text-lg: 1.125rem;  /* 18px */
  --text-xl: 1.25rem;   /* 20px */
  --text-2xl: 1.5rem;   /* 24px */
}
```

## 13. 可访问性

### 13.1 键盘支持

- Tab 键导航
- Enter 键确认
- Escape 键取消
- 方向键列表导航

### 13.2 ARIA 属性

- 语义化 HTML
- ARIA 标签
- ARIA 角色
- ARIA 状态

### 13.3 屏幕阅读器

- 友好的 alt 文本
- 动态内容提示
- 表单标签关联

---

**文档生成信息**：
- 生成时间：2026-05-17
- 执行者：@frontend-designer Agent
- 状态：已完成
- 下一步：数据模型设计（@dba + database-designer）
