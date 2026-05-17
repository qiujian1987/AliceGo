# MCP Server 配置指南

## 概述

Model Context Protocol (MCP) 是一种开放协议，允许 AI 代理连接到外部数据源和工具。本指南帮助你配置 MCP Server 以扩展 Agent 能力。

---

## 1. MCP 简介

### 1.1 什么是 MCP

MCP（Model Context Protocol）是由 Anthropic 提出的开放协议，基于 JSON-RPC 2.0 构建，实现 AI 代理与外部服务之间的标准化数据通信。

### 1.2 MCP 架构

```
┌─────────────┐      MCP       ┌─────────────┐
│   Host     │ ◄──────────────►│   Server    │
│  (TRAE)    │   JSON-RPC 2.0  │  (外部服务)  │
└─────────────┘                 └─────────────┘
```

### 1.3 MCP 的优势

- **标准化接口**：统一的协议标准，不同服务可互换
- **工具扩展**：为 Agent 提供更多执行能力
- **安全保障**：沙箱环境，降低执行风险
- **易于集成**：轻松连接数据库、API、GitHub 等

---

## 2. 配置位置

### 2.1 全局配置

```
~/.trae/mcp.json
```

### 2.2 项目级配置

```
项目根目录/.trae/mcp.json
```

### 2.3 配置优先级

项目级配置 > 全局配置

---

## 3. 配置示例

### 3.1 Stdio 模式配置

```json
{
  "mcpServers": {
    "mcp_Memory": {
      "command": "node",
      "args": ["path/to/mcp-memory-server.js"]
    },
    "mcp_Playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"]
    }
  }
}
```

### 3.2 SSE 模式配置

```json
{
  "mcpServers": {
    "github_agent": {
      "url": "https://agent.example.com/mcp",
      "type": "sse"
    }
  }
}
```

### 3.3 带认证的配置

```json
{
  "mcpServers": {
    "supabase_local": {
      "command": "supabase",
      "args": ["mcp"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_TOKEN"
      }
    }
  }
}
```

---

## 4. 推荐 MCP Server

### 4.1 内置 MCP Server

| Server | 用途 | 配置难度 |
|--------|------|---------|
| mcp_Memory | 记忆系统，持久化项目状态 | ⭐ 简单 |

### 4.2 常用 MCP Server

| Server | 用途 | 配置难度 |
|--------|------|---------|
| mcp_Playwright | 浏览器自动化测试 | ⭐⭐ 中等 |
| mcp_Excel | Excel 文件操作 | ⭐⭐ 中等 |
| mcp_GitHub | GitHub API 操作 | ⭐⭐ 中等 |
| mcp_FileSystem | 增强的文件系统操作 | ⭐ 简单 |
| mcp_Browser | 网页抓取和交互 | ⭐⭐ 中等 |

### 4.3 企业级 MCP Server

| Server | 用途 | 配置难度 |
|--------|------|---------|
| PostgreSQL | 数据库连接 | ⭐⭐⭐ 复杂 |
| Redis | 缓存服务连接 | ⭐⭐⭐ 复杂 |
| Docker | 容器管理 | ⭐⭐⭐ 复杂 |
| Kubernetes | K8s 集群管理 | ⭐⭐⭐ 复杂 |

---

## 5. AliceGo 项目 MCP 配置

### 5.1 推荐配置

AliceGo 项目推荐以下 MCP Server 配置：

```json
{
  "mcpServers": {
    "mcp_Memory": {
      "command": "node",
      "args": ["path/to/mcp-memory-server.js"]
    },
    "mcp_Excel": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-excel"]
    },
    "mcp_Playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"]
    }
  }
}
```

### 5.2 MCP 工具使用场景

| 场景 | 推荐 MCP | 说明 |
|------|---------|------|
| 项目状态持久化 | mcp_Memory | 保存项目进度、记忆 |
| 数据管理 | mcp_Excel | 管理架构设计数据 |
| 前端测试 | mcp_Playwright | 浏览器自动化测试 |
| 技术研究 | integrated_browser | 查阅技术文档 |

---

## 6. 安全配置

### 6.1 环境变量管理

```json
{
  "mcpServers": {
    "example": {
      "command": "node",
      "args": ["server.js"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

### 6.2 敏感信息处理

**禁止**：
- 在配置文件中硬编码密钥
- 提交包含敏感信息的配置到版本控制

**推荐**：
- 使用环境变量
- 使用 .env 文件（添加到 .gitignore）
- 使用密钥管理服务

### 6.3 权限控制

```json
{
  "mcpServers": {
    "restricted": {
      "command": "node",
      "args": ["server.js"],
      "permissions": {
        "allow": ["read", "write"],
        "deny": ["delete"]
      }
    }
  }
}
```

---

## 7. 故障排查

### 7.1 常见问题

#### 问题 1：MCP Server 无法启动

**可能原因**：
1. Node.js 未安装
2. 命令路径错误
3. 依赖未安装

**解决方案**：
```bash
# 检查 Node.js
node --version

# 安装依赖
npm install

# 测试 MCP Server
npx your-mcp-server
```

#### 问题 2：连接超时

**可能原因**：
1. 网络问题
2. 服务器未启动
3. 端口冲突

**解决方案**：
```bash
# 检查端口占用
netstat -an | grep 8080

# 查看日志
tail -f mcp-server.log

# 重启服务
pkill -f mcp-server
node server.js
```

#### 问题 3：权限不足

**可能原因**：
1. 文件权限问题
2. 执行权限缺失

**解决方案**：
```bash
# 添加执行权限
chmod +x server.js

# 修复文件权限
chmod 644 config.json
```

### 7.2 日志查看

MCP Server 日志通常在：
- 标准输出/错误流
- 指定日志文件
- 系统日志

### 7.3 调试技巧

1. **启用详细日志**：
```json
{
  "mcpServers": {
    "debug": {
      "command": "node",
      "args": ["server.js", "--debug"],
      "env": {
        "DEBUG": "true"
      }
    }
  }
}
```

2. **测试连接**：
```bash
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | nc localhost 8080
```

---

## 8. 性能优化

### 8.1 连接池配置

```json
{
  "mcpServers": {
    "example": {
      "command": "node",
      "args": ["server.js"],
      "options": {
        "maxConnections": 10,
        "timeout": 30000
      }
    }
  }
}
```

### 8.2 缓存策略

启用缓存以提高性能：
```json
{
  "mcpServers": {
    "example": {
      "command": "node",
      "args": ["server.js"],
      "cache": {
        "enabled": true,
        "ttl": 3600
      }
    }
  }
}
```

### 8.3 资源限制

```json
{
  "mcpServers": {
    "example": {
      "command": "node",
      "args": ["server.js"],
      "limits": {
        "maxMemory": "512MB",
        "maxCPU": "50%"
      }
    }
  }
}
```

---

## 9. 最佳实践

### 9.1 配置管理

1. **分离配置**：开发、测试、生产环境配置分离
2. **版本控制**：使用 git 管理配置（排除敏感信息）
3. **文档记录**：记录配置变更历史

### 9.2 安全建议

1. **最小权限**：只启用必要的 MCP Server
2. **定期更新**：保持 MCP Server 版本最新
3. **监控日志**：定期检查 MCP Server 日志
4. **备份配置**：定期备份配置文件

### 9.3 性能建议

1. **按需启用**：不要启用所有 MCP Server
2. **资源监控**：监控 CPU、内存使用
3. **定期维护**：清理日志、缓存

---

## 10. 下一步

配置完成 MCP Server 后，你可以：

1. [配置 SOLO Agent](./solo-agent-config.md)
2. [开始第一个项目](../README.md#快速开始)
3. [查看 Skill 配置](../skills/)
4. [学习 Agent 协作](../AGENTS.md)

---

## 参考资源

- [MCP 官方文档](https://modelcontextprotocol.io/)
- [TRAE IDE 文档](https://docs.trae.ai/)
- [MCP Server 列表](https://github.com/modelcontextprotocol/servers)

---

*最后更新：2026-05-17*
