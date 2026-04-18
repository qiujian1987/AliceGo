# 技术栈清单

## 项目技术栈

### 前端
| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | 前端框架 |
| TypeScript | 5.x | 类型系统 |
| Tailwind CSS | 3.x | CSS框架 |

### 后端
| 技术 | 版本 | 用途 |
|------|------|------|
| Express | 4.x | Web框架 |
| Node.js | 18.x | 运行时 |
| TypeScript | 5.x | 类型系统 |

### 数据库
| 技术 | 版本 | 用途 |
|------|------|------|
| PostgreSQL | 15.x | 主数据库 |

### 其他
| 技术 | 版本 | 用途 |
|------|------|------|
| Redis | 7.x | 缓存 |
| JWT | - | 认证 |

---

## 技术栈变更流程

```
[Agent] 申请新技术栈
        ↓
写入 mailbox/to-devops.md 申请
        ↓
[DevOps] 评估兼容性、安全性
        ↓
[Team Lead] 审批
        ↓
[DevOps] 更新 tech-stack-whitelist.json
        ↓
[DevOps] 执行安装
        ↓
通知申请者
```

---

## 禁止使用

- jQuery (过时)
- Moment.js (已被替代)
- Lodash (大部分功能已内置)
- 任何未在 tech-stack-whitelist.json 中批准的依赖

---

## 参考文档

- 详细白名单：tech-stack-whitelist.json
- 使用指南：agents/ 目录下各Agent配置