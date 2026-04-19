---
name: "devops-automation"
description: "DevOps自动化，配置CI/CD流程和部署。触发场景：'配置CI/CD'、'自动化部署'。"
---

# DevOps 自动化 Skill

## 功能描述

配置CI/CD流程，实现自动化构建、测试和部署，提升开发和部署效率。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| project_type | string | 项目类型 | 是 |
| ci_provider | string | CI服务提供商 | 否 |
| deployment_target | string | 部署目标 | 否 |
| environment | string | 环境配置 | 否 |

## 输出格式

```json
{
  "status": "success",
  "data": {
    "ci_cd": {
      "configuration": "...",
      "workflow": "...",
      "deployment": "...",
      "path": "..."
    },
    "files": [
      {
        "name": "...",
        "content": "...",
        "path": "..."
      }
    ]
  },
  "message": "CI/CD配置完成"
}
```

## 执行流程

1. 分析项目类型和需求
2. 选择合适的CI服务提供商
3. 配置CI/CD流程
4. 配置部署目标
5. 生成配置文件
6. 提供文件路径建议

## 使用示例

### 输入
```json
{
  "project_type": "nodejs",
  "ci_provider": "github-actions",
  "deployment_target": "aws",
  "environment": "production"
}
```

### 输出
```json
{
  "status": "success",
  "data": {
    "ci_cd": {
      "configuration": "GitHub Actions workflow for Node.js project",
      "workflow": "Build → Test → Deploy",
      "deployment": "AWS EC2",
      "path": ".github/workflows/"
    },
    "files": [
      {
        "name": "ci-cd.yml",
        "content": "name: CI/CD\n\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v2\n      - name: Use Node.js\n        uses: actions/setup-node@v2\n        with:\n          node-version: '18.x'\n      - name: Install dependencies\n        run: npm ci\n      - name: Run tests\n        run: npm test\n\n  deploy:\n    needs: test\n    runs-on: ubuntu-latest\n    if: github.ref == 'refs/heads/main'\n    steps:\n      - uses: actions/checkout@v2\n      - name: Deploy to AWS\n        run: |\n          # Deployment script\n          echo "Deploying to AWS EC2"\n",
        "path": ".github/workflows/ci-cd.yml"
      },
      {
        "name": "deploy.sh",
        "content": "#!/bin/bash\n\necho "Starting deployment..."\n\n# SSH into EC2 instance\nssh -i "${PRIVATE_KEY}" ubuntu@${EC2_INSTANCE} << 'EOF'\n  cd /app\n  git pull origin main\n  npm install\n  npm run build\n  pm2 restart app\nEOF\n\necho "Deployment completed!"\n",
        "path": "scripts/deploy.sh"
      }
    ]
  },
  "message": "CI/CD配置完成"
}
```

## 最佳实践

- 自动化所有构建和测试流程
- 实现环境隔离
- 配置适当的权限和安全设置
- 提供详细的部署脚本

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 项目类型不支持 | 提示支持的项目类型列表 |
| CI提供商不支持 | 提示支持的CI提供商列表 |
| 部署目标不支持 | 提示支持的部署目标列表 |