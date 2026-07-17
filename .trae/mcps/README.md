# MCP 配置

## 已配置的 MCP 服务器

| MCP 服务器 | 工具 | 用途 |
|-----------|------|------|
| mcp_Playwright | start_codegen_session, end_codegen_session, get_codegen_session, clear_codegen_session, playwright_navigate, playwright_screenshot, playwright_click, playwright_iframe_click, playwright_iframe_fill, playwright_fill, playwright_select, playwright_hover, playwright_upload_file, playwright_evaluate, playwright_console_logs, playwright_resize, playwright_close, playwright_get, playwright_post, playwright_put, playwright_patch, playwright_delete, playwright_expect_response, playwright_assert_response, playwright_custom_user_agent, playwright_get_visible_text, playwright_get_visible_html, playwright_go_back, playwright_go_forward, playwright_drag, playwright_press_key, playwright_save_as_pdf, playwright_click_and_switch_tab | 前端测试和交互 |
| mcp_Excel | excel_copy_sheet, excel_create_table, excel_describe_sheets, excel_format_range, excel_read_sheet, excel_screen_capture, excel_write_to_sheet | 数据管理和分析 |
| integrated_browser | browser_navigate, browser_navigate_back, browser_tabs, browser_snapshot, browser_take_screenshot, browser_click, browser_hover, browser_type, browser_select_option, browser_press_key, browser_get_attribute, browser_scroll, browser_console_messages, browser_network_requests, browser_wait_for | 浏览器操作和验证 |
| **mcp_Memory** | create_entities, create_relations, add_observations, delete_entities, delete_observations, delete_relations, read_graph, search_nodes, open_nodes | 记忆持久化和上下文管理 |
| **git-mcp** | git_create_branch, git_checkout_branch, git_list_branches, git_commit, git_push, git_pull, git_merge, git_check_conflict, git_log, git_status | Git版本控制和分支管理 |
| **database-mcp** | db_connect, db_disconnect, db_execute_query, db_execute, db_insert, db_update, db_delete, db_get_schema, db_list_tables, db_optimize_query, db_ping, db_get_connection_info | 数据库操作和查询 |

### Git MCP 详细工具列表

| 工具 | 描述 | 参数 |
|------|------|------|
| git_create_branch | 创建新分支 | branch_name (必需), base_branch (可选) |
| git_checkout_branch | 切换分支 | branch_name (必需) |
| git_list_branches | 列出所有分支 | 无 |
| git_commit | 提交代码 | message (必需), files (可选) |
| git_push | 推送分支 | branch (可选) |
| git_pull | 拉取代码 | branch (可选) |
| git_merge | 合并分支 | source_branch (必需), target_branch (可选) |
| git_check_conflict | 检查合并冲突 | source_branch (必需), target_branch (可选) |
| git_log | 查看提交历史 | limit (可选, 默认10) |
| git_status | 查看工作区状态 | 无 |

### Database MCP 详细工具列表

| 工具 | 描述 | 参数 |
|------|------|------|
| db_connect | 连接到数据库 | database_url (必需), connection_name (可选) |
| db_disconnect | 断开数据库连接 | connection_name (可选) |
| db_execute_query | 执行SQL查询（只读） | query (必需), params (可选), connection_name (可选) |
| db_execute | 执行SQL命令（写操作） | command (必需), params (可选), connection_name (可选) |
| db_insert | 插入数据 | table (必需), data (必需), connection_name (可选) |
| db_update | 更新数据 | table (必需), data (必需), where (必需), connection_name (可选) |
| db_delete | 删除数据 | table (必需), where (必需), connection_name (可选) |
| db_get_schema | 获取表schema信息 | table (可选), connection_name (可选) |
| db_list_tables | 列出所有表 | connection_name (可选) |
| db_optimize_query | 分析和优化SQL查询 | query (必需), connection_name (可选) |
| db_ping | 检查数据库连接状态 | connection_name (可选) |
| db_get_connection_info | 获取连接信息 | connection_name (可选) |

## MCP 与 Agent 配合

### Frontend Dev
- **mcp_Playwright**：前端测试和交互
- **integrated_browser**：实时查看和测试前端实现
- **mcp_Memory**：上下文记忆和历史记录

### Backend Dev
- **Database MCP**：数据库开发和测试
- **integrated_browser**：API 测试和验证
- **mcp_Memory**：上下文记忆和历史记录

### DBA
- **mcp_Excel**：数据导出和分析
- **Database MCP**：数据库管理和优化
- **mcp_Memory**：上下文记忆和历史记录

### QA
- **mcp_Playwright**：端到端测试
- **mcp_Excel**：测试数据和结果管理
- **integrated_browser**：验证 API 响应
- **mcp_Memory**：上下文记忆和历史记录

### DevOps
- **Git MCP**：版本控制和部署管理
- **mcp_Excel**：部署配置和清单
- **mcp_Memory**：上下文记忆和历史记录

### Team Lead
- **Git MCP**：项目进度和版本控制
- **integrated_browser**：项目文档和参考资料
- **mcp_Memory**：需求管理和决策记录

### Architect
- **integrated_browser**：技术研究和参考
- **mcp_Excel**：架构设计数据管理
- **mcp_Memory**：设计决策和历史记录

## Memory MCP 集成

### 核心功能
- **实体管理**：创建和管理记忆实体
- **关系管理**：建立实体间的关系
- **观察管理**：添加和管理观察数据
- **图查询**：通过图结构查询记忆
- **节点搜索**：基于语义搜索记忆节点

### 使用场景
- **需求管理**：存储和检索需求历史
- **设计决策**：记录和查询设计决策
- **任务跟踪**：管理任务历史和状态
- **上下文保持**：跨会话保持上下文

### 集成策略
1. **本地与远程结合**：本地 memory/ 目录作为缓存，Memory MCP 作为持久化存储
2. **增量同步**：定期将本地记忆同步到 Memory MCP
3. **按需加载**：根据需要从 Memory MCP 加载相关记忆
4. **冲突解决**：处理记忆同步中的冲突

## 使用示例

### Frontend Dev 使用 Playwright
```javascript
// 测试前端页面
await run_mcp('mcp_Playwright', 'playwright_navigate', {
  url: 'http://localhost:3000'
});

// 截图验证
await run_mcp('mcp_Playwright', 'playwright_screenshot', {
  path: 'screenshot.png'
});
```

### DBA 使用 Excel
```javascript
// 导出测试数据
await run_mcp('mcp_Excel', 'excel_write_to_sheet', {
  file_path: 'test_data.xlsx',
  sheet_name: 'Users',
  data: [['id', 'name', 'email'], [1, 'John', 'john@example.com']]
});
```

### Team Lead 使用 Memory MCP
```javascript
// 保存需求分析
await run_mcp('mcp_Memory', 'create_entities', {
  entities: [{
    type: 'Requirement',
    properties: {
      id: 'REQ-001',
      title: '用户认证系统',
      description: '实现用户注册、登录和权限管理',
      status: 'approved'
    }
  }]
});

// 建立关系
await run_mcp('mcp_Memory', 'create_relations', {
  relations: [{
    type: 'HAS_TASK',
    source: 'REQ-001',
    target: 'TASK-001'
  }]
});
```
