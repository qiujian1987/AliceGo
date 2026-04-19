---
name: "find-skills"
description: "查找和安装技能，从开放的 Agent Skills 生态中搜索、安装与管理各类模块化技能包。触发场景：'查找技能'、'安装技能'、'管理技能'。"
---

# Find Skills Skill

## 功能描述

依托名为 skills 的命令行工具（CLI），从开放的 Agent Skills 生态中搜索、安装与管理各类模块化技能包。帮助用户快速发现和集成优质的技能到项目中。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| action | string | 操作类型（search、install、list、remove） | 是 |
| query | string | 搜索关键词或技能名称 | 否 |
| version | string | 技能版本（仅 install 操作） | 否 |

## 输出格式

```json
{
  "status": "success",
  "data": {
    "action": "...",
    "result": {
      "skills": [
        {
          "name": "...",
          "description": "...",
          "author": "...",
          "url": "...",
          "version": "..."
        }
      ],
      "message": "..."
    }
  },
  "message": "操作完成"
}
```

## 执行流程

1. 分析用户请求的操作类型
2. 调用 skills CLI 工具执行相应操作
3. 处理和格式化返回结果
4. 展示搜索结果或安装状态
5. 提供后续操作建议

## 使用示例

### 搜索技能
```json
{
  "action": "search",
  "query": "frontend"
}
```

### 安装技能
```json
{
  "action": "install",
  "query": "frontend-design",
  "version": "1.0.0"
}
```

### 列出已安装技能
```json
{
  "action": "list"
}
```

### 移除技能
```json
{
  "action": "remove",
  "query": "old-skill"
}
```

## 技能生态

### 官方技能源
- Vercel Skills Registry
- Anthropic Skills Collection
- LangChain Skills Hub

### 社区技能源
- GitHub Skills Repositories
- Skill Marketplaces
- Open Source Communities

## 最佳实践

- 定期搜索和更新技能，保持技能库的新鲜度
- 优先选择官方或社区推荐的技能
- 查看技能的评分和使用情况
- 注意技能的版本兼容性
- 定期清理不再使用的技能

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 技能未找到 | 提供相似技能建议 |
| 安装失败 | 检查网络连接和权限 |
| 版本冲突 | 提供版本选择建议 |
| CLI 工具未安装 | 提供安装指南 |
