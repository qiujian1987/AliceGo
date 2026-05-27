---
name: "dependency-checker"
description: "依赖检查器，在代码生成后自动识别缺失的依赖，生成依赖报告并通知DevOps进行依赖安装。"
---

# 依赖检查 Skill

## 功能描述

在代码生成后自动检查和识别缺失的依赖，生成依赖报告，并协调DevOps完成依赖安装。

## 调用规范

### 调用链路
```
Frontend Dev → 调用此Skill检查依赖 → 生成报告 → 通知DevOps安装依赖
```

### 约束规则
- **Frontend Dev**：在代码生成后必须调用此Skill检查依赖
- **DevOps**：收到依赖报告后执行依赖安装
- **Skill执行者**：@frontend-dev Agent

## 检查维度

### 1. 前端框架依赖
- [ ] React/Vue/Angular核心库
- [ ] 状态管理库（Redux/Zustand/Vuex/Pinia）
- [ ] 路由库（React Router/Vue Router）
- [ ] UI组件库（Ant Design/Material UI/Element）

### 2. 工具库依赖
- [ ] HTTP客户端（Axios/Fetch）
- [ ] 表单处理（React Hook Form/Formik）
- [ ] 数据可视化（ECharts/Chart.js/Recharts）
- [ ] 工具函数（Day.js/Moment/Lodash）
- [ ] 样式处理（Tailwind CSS/Styled Components）

### 3. 开发工具依赖
- [ ] 测试框架（Jest/Vitest/Testing Library）
- [ ] 构建工具（Webpack/Vite/Parcel）
- [ ] 代码规范（ESLint/Prettier）
- [ ] TypeScript类型定义（@types/*）

### 4. 版本兼容性
- [ ] 检查Node版本要求
- [ ] 检查浏览器兼容性
- [ ] 检查依赖版本冲突

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| project_path | string | 项目路径 | 是 |
| generated_code | array | 生成的代码文件列表 | 是 |
| existing_dependencies | object | 现有依赖（从package.json读取） | 是 |

## 输出格式

```json
{
  "status": "success",
  "data": {
    "dependency_report": {
      "missing_dependencies": [
        {
          "name": "axios",
          "version": "^1.6.0",
          "reason": "HTTP客户端",
          "usage_files": ["src/api/user.ts", "src/api/order.ts"],
          "priority": "high"
        },
        {
          "name": "@ant-design/icons",
          "version": "^5.2.0",
          "reason": "UI图标库",
          "usage_files": ["src/components/UserForm.tsx"],
          "priority": "medium"
        }
      ],
      "existing_dependencies": {
        "react": "^18.2.0",
        "antd": "^5.0.0"
      },
      "version_conflicts": [],
      "recommendations": [
        "建议安装 @types/react 以获得更好的TypeScript支持"
      ]
    },
    "devops_request": {
      "requested_by": "@frontend-dev",
      "action": "install_dependencies",
      "dependencies": ["axios@^1.6.0", "@ant-design/icons@^5.2.0"],
      "priority": "high",
      "reason": "代码生成后发现缺失依赖"
    }
  },
  "message": "依赖检查完成，发现2个缺失依赖，已通知DevOps"
}
```

## 执行流程

### Step 1: 读取现有依赖
- 读取 `package.json` 中的 dependencies 和 devDependencies
- 记录已有的依赖列表

### Step 2: 分析生成代码
- 扫描 `src/client/` 目录下的所有代码文件
- 识别import语句中的第三方库
- 识别package.json中已声明的依赖

### Step 3: 对比分析
- 对比import的库和已有依赖
- 识别缺失的依赖
- 检查版本兼容性

### Step 4: 生成报告
- 生成缺失依赖清单
- 标注优先级（high/medium/low）
- 提供安装建议

### Step 5: 通知DevOps
- 调用DevOps执行依赖安装
- 提供完整的依赖列表和优先级

## 依赖优先级定义

| 优先级 | 说明 | 场景 |
|--------|------|------|
| high | 核心依赖，代码无法运行 | React, UI库, HTTP客户端 |
| medium | 重要依赖，增强功能 | 图标库, 表单库 |
| low | 可选依赖，功能增强 | 动画库, 分析工具 |

## 输出文件

- `design/project_overview/reports/dependency-check-{timestamp}.md` - 依赖检查报告
- `design/project_overview/reports/dependency-devops-request-{timestamp}.json` - DevOps请求文件

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| package.json不存在 | 提示项目结构问题，报告给SOLO Coder |
| import分析失败 | 标记为高优先级问题，人工介入 |
| 版本冲突 | 提示冲突依赖，建议具体版本 |
| 循环依赖 | 标记为严重问题，暂停开发流程 |

## 注意事项

1. **必须执行**：每次代码生成后必须执行依赖检查
2. **完整扫描**：必须扫描所有生成的文件
3. **及时报告**：发现缺失依赖必须立即通知DevOps
4. **禁止跳过**：不允许在依赖检查未完成前提交代码
5. **证据保存**：必须保存依赖检查报告作为证据
