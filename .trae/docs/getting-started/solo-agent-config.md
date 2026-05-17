# SOLO Agent 配置指南

## 概述

本指南帮助用户在 TRAE IDE 中配置 SOLO Agent，包括添加自定义 Agent、配置 MCP Server 和设置验证机制。

---

## 1. SOLO Agent 配置步骤

### 1.1 切换到 SOLO 模式

1. 在 TRAE IDE 界面左上角，找到模式切换开关
2. 将模式从 **IDE** 切换到 **SOLO**
3. 界面会切换到 SOLO 开发界面

### 1.2 打开 SOLO Agent 配置

1. 在 SOLO 对话框底部，找到 `@` 符号
2. 点击 `@` 符号，打开 Agent 选择面板
3. 选择 **SOLO Agent**
4. 鼠标悬停在 SOLO Agent 右侧的配置图标上
5. 点击弹出面板中的 **Edit Tools** 按钮

### 1.3 配置 SOLO Agent

在 SOLO Agent 配置面板中，你可以：

| 配置项 | 说明 |
|-------|------|
| MCP Server | 添加 MCP Server 以扩展 Agent 能力 |
| 内置工具 | 配置 Agent 可使用的内置工具 |
| 自定义 Agent | 添加项目中定义的自定义 Agent |

---

## 2. 添加自定义 Agent

### 2.1 打开 Agent 添加界面

1. 在 SOLO Agent 配置面板中
2. 找到 **Callable Agents** 或 **自定义 Agent** 配置区
3. 点击 **添加** 或 **Add** 按钮

### 2.2 添加 AliceGo 自定义 Agent

根据项目需求，添加以下 Agent：

| Agent 名称 | 英文标识名 | 职责 |
|-----------|-----------|------|
| 架构师 | architect | 后端架构设计、API 设计 |
| 后端开发 | backend-dev | 后端业务代码实现 |
| 前端开发 | frontend-dev | 前端业务代码实现 |
| 前端设计师 | frontend-designer | 前端架构设计 |
| 数据库管理员 | dba | 数据库设计 |
| 需求分析师 | feature-analyst | 特性需求分析 |
| 测试工程师 | qa | 测试用例设计、执行 |
| 代码评审 | code-reviewer | 代码质量评审 |
| 设计评审 | design-reviewer | 架构设计评审 |
| 测试评审 | test-reviewer | 测试用例评审 |
| 需求评审 | req-reviewer | 需求文档评审 |
| 团队负责人 | team-lead | 流程指导、质量把关 |
| 运维工程师 | devops | 环境配置、CI/CD |

### 2.3 配置 Agent 参数

添加 Agent 时，需要配置以下参数：

| 参数 | 说明 | 示例 |
|------|------|------|
| 名称 | Agent 的中文名称 | 架构师 |
| 英文标识名 | Agent 的唯一标识 | architect |
| 何时调用 | 调用时机描述 | "需要进行后端架构设计时" |

---

## 3. MCP Server 配置

### 3.1 添加 MCP Server

1. 在 SOLO Agent 配置面板中
2. 找到 **MCP Server** 配置区
3. 点击 **添加** 或 **Add** 按钮
4. 选择或输入 MCP Server 配置

### 3.2 推荐 MCP Server

| MCP Server | 用途 | 配置方式 |
|------------|------|---------|
| mcp_Memory | 记忆系统，持久化项目状态 | 内置 |
| mcp_Playwright | 浏览器自动化测试 | 需安装 |
| mcp_Excel | Excel 文件操作 | 需安装 |

### 3.3 MCP Server 配置示例

```json
{
  "mcpServers": {
    "mcp_Memory": {
      "command": "node",
      "args": ["path/to/mcp-memory-server.js"]
    }
  }
}
```

详细配置请参考：[MCP Server 配置指南](./mcp-server-config.md)

---

## 4. 验证机制配置

### 4.1 为什么需要验证机制

验证机制确保：
- Agent 不会跳过关键检查步骤
- 输出质量符合预期
- 项目状态始终保持一致

### 4.2 内置验证规则

AliceGo 项目已内置以下验证规则：

```
## 验证检查点
- 步骤完成后必须验证输出文件存在
- 评审前必须检查输入文档完整
- 开发前必须验证测试用例存在
```

### 4.3 自定义验证

在 Rules 文件中可以添加自定义验证规则：

```markdown
## 自定义验证
- [ ] 文件创建后验证存在
- [ ] 评审前检查完整性
- [ ] 代码提交前验证测试通过
```

---

## 5. 常见问题

### Q1: 为什么看不到自定义 Agent？

**可能原因**：
1. Agent 文件未放在正确位置
2. Agent 文件格式不正确

**解决方案**：
1. 确认 Agent 文件在 `.trae/agents/` 目录下
2. 确认 Agent 文件格式正确（Markdown 格式）
3. 重启 TRAE IDE

### Q2: MCP Server 无法连接？

**可能原因**：
1. MCP Server 未正确安装
2. 配置错误

**解决方案**：
1. 检查 MCP Server 是否已安装
2. 检查配置文件是否正确
3. 参考 [MCP Server 故障排查](./mcp-server-config.md#故障排查)

### Q3: 如何验证配置是否成功？

**验证步骤**：
1. 在 SOLO 对话框中输入 `@architect`
2. 如果能看到架构师 Agent 的响应，说明配置成功
3. 尝试调用一个任务，检查 Agent 是否正常工作

---

## 6. 最佳实践

### 6.1 Agent 配置建议

1. **按需添加**：只添加项目需要的 Agent
2. **明确职责**：确保每个 Agent 的职责清晰
3. **合理调用**：避免频繁切换 Agent

### 6.2 MCP Server 建议

1. **必要 MCP**：优先配置必要的 MCP Server
2. **按需添加**：根据项目需要添加可选 MCP
3. **定期更新**：保持 MCP Server 版本最新

### 6.3 验证机制建议

1. **保持简洁**：验证规则不要过于复杂
2. **及时更新**：项目需求变化时更新验证规则
3. **定期检查**：定期检查验证机制是否有效

---

## 7. 下一步

配置完成后，你可以：

1. [创建第一个项目](../README.md#快速开始)
2. [了解 Agent 职责](../AGENTS.md)
3. [配置 MCP Server](./mcp-server-config.md)
4. [查看示例项目](../examples/README.md)

---

*最后更新：2026-05-17*
