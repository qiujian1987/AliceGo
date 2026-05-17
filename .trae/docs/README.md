# 文档目录

本文档目录包含 AliceGo 项目的所有使用文档和参考指南。

---

## 目录结构

```
docs/
├── getting-started/      # 入门指南
├── reference/           # 参考文档
├── guides/             # 指南文档
└── README.md           # 本文档
```

---

## 快速导航

### 🟢 入门指南（Getting Started）

适合初次使用 AliceGo 的用户：

| 文档 | 说明 | 适合人群 |
|------|------|---------|
| [solo-agent-config.md](./getting-started/solo-agent-config.md) | SOLO Agent 配置指南 | 所有人 |
| [mcp-server-config.md](./getting-started/mcp-server-config.md) | MCP Server 配置指南 | 高级用户 |

### 📖 参考文档（Reference）

技术参考文档：

| 文档 | 说明 |
|------|------|
| [skill-invocation.md](./reference/skill-invocation.md) | Skill 调用规范 |
| [memory-system.md](./reference/memory-system.md) | 记忆系统设计 |
| [team-lead-scheduler.md](./reference/team-lead-scheduler.md) | 团队调度器 |

### 📚 指南文档（Guides）

最佳实践指南：

| 文档 | 说明 |
|------|------|
| [design-standards.md](./guides/design-standards.md) | 设计标准 |
| [review-feedback.md](./guides/review-feedback.md) | 评审反馈流程 |

---

## 其他文档

以下文档位于项目根目录的 `.trae/` 目录下：

| 文档 | 说明 |
|------|------|
| [../AGENTS.md](../AGENTS.md) | Agent 知识地图 |
| [../README.md](../README.md) | 项目主文档 |
| [../rules/](../rules/) | Rules 规则文件 |
| [../skills/](../skills/) | Skill 技能包 |

---

## 文档贡献指南

### 添加新文档

1. 根据文档类型选择合适的位置：
   - 入门指南 → `docs/getting-started/`
   - 参考文档 → `docs/reference/`
   - 指南文档 → `docs/guides/`

2. 遵循命名规范：
   - 使用 kebab-case（小写字母，连字符分隔）
   - 示例：`skill-invocation.md`

3. 添加到本文档的对应表格中

### 文档格式要求

- 使用 Markdown 格式
- 包含清晰的标题和结构
- 添加文档创建日期
- 定期更新文档内容

---

## 版本历史

| 版本 | 日期 | 修改内容 |
|------|------|---------|
| v1.0 | 2026-05-17 | 初始版本，目录重组 |

---

*最后更新：2026-05-17*
