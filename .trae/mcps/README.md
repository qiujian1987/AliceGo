# MCP 配置

## 已配置的 MCP 服务器

| MCP 服务器 | 工具 | 用途 |
|-----------|------|------|
| mcp_Playwright | start_codegen_session, end_codegen_session, get_codegen_session, clear_codegen_session, playwright_navigate, playwright_screenshot, playwright_click, playwright_iframe_click, playwright_iframe_fill, playwright_fill, playwright_select, playwright_hover, playwright_upload_file, playwright_evaluate, playwright_console_logs, playwright_resize, playwright_close, playwright_get, playwright_post, playwright_put, playwright_patch, playwright_delete, playwright_expect_response, playwright_assert_response, playwright_custom_user_agent, playwright_get_visible_text, playwright_get_visible_html, playwright_go_back, playwright_go_forward, playwright_drag, playwright_press_key, playwright_save_as_pdf, playwright_click_and_switch_tab | 前端测试和交互 |
| mcp_Excel | excel_copy_sheet, excel_create_table, excel_describe_sheets, excel_format_range, excel_read_sheet, excel_screen_capture, excel_write_to_sheet | 数据管理和分析 |
| integrated_browser | browser_navigate, browser_navigate_back, browser_tabs, browser_snapshot, browser_take_screenshot, browser_click, browser_hover, browser_type, browser_select_option, browser_press_key, browser_get_attribute, browser_scroll, browser_console_messages, browser_network_requests, browser_wait_for | 浏览器操作和验证 |

## 推荐的 MCP 服务器

### Git MCP
- **用途**：代码版本控制、分支管理、提交历史分析、合并请求处理
- **适用 Agent**：devops, team-lead
- **推荐工具**：git_clone, git_commit, git_push, git_pull, git_branch, git_merge, git_log, git_status

### Database MCP
- **用途**：数据库连接和查询、模式管理、数据迁移、SQL 执行和优化
- **适用 Agent**：dba, backend-dev
- **推荐工具**：db_connect, db_query, db_execute, db_schema, db_migrate, db_optimize

## MCP 与 Agent 配合

### Frontend Dev
- **mcp_Playwright**：前端测试和交互
- **integrated_browser**：实时查看和测试前端实现

### Backend Dev
- **Database MCP**：数据库开发和测试
- **integrated_browser**：API 测试和验证

### DBA
- **mcp_Excel**：数据导出和分析
- **Database MCP**：数据库管理和优化

### QA
- **mcp_Playwright**：端到端测试
- **mcp_Excel**：测试数据和结果管理

### DevOps
- **Git MCP**：版本控制和部署管理
- **mcp_Excel**：部署配置和清单

### Team Lead
- **Git MCP**：项目进度和版本控制
- **integrated_browser**：项目文档和参考资料

### Architect
- **integrated_browser**：技术研究和参考
- **mcp_Excel**：架构设计数据管理

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

### QA 使用 Browser
```javascript
// 验证 API 响应
await run_mcp('integrated_browser', 'browser_navigate', {
  url: 'https://api.example.com/users'
});

// 检查网络请求
const requests = await run_mcp('integrated_browser', 'browser_network_requests', {});
```
