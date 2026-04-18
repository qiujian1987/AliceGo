---
name: "code-generator"
description: "前端代码生成，生成React组件和前端代码。触发场景：'生成组件'、'前端代码'。"
---

# 前端代码生成 Skill

## 功能描述

根据需求生成React组件、页面和相关前端代码，支持TypeScript和现代前端框架。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| component_type | string | 组件类型 | 是 |
| name | string | 组件名称 | 是 |
| props | object | 组件属性 | 否 |
| framework | string | 前端框架 | 否 |
| features | array | 功能特性 | 否 |

## 输出格式

```json
{
  "status": "success",
  "data": {
    "code": {
      "component": "...",
      "styles": "...",
      "tests": "...",
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
  "message": "代码生成完成"
}
```

## 执行流程

1. 分析组件类型和需求
2. 生成组件代码
3. 生成样式文件
4. 生成测试文件
5. 提供文件路径建议

## 使用示例

### 输入
```json
{
  "component_type": "button",
  "name": "PrimaryButton",
  "props": {
    "title": "string",
    "onClick": "function",
    "variant": "string"
  },
  "framework": "react",
  "features": ["disabled", "loading"]
}
```

### 输出
```json
{
  "status": "success",
  "data": {
    "code": {
      "component": "import React from 'react';\n\ninterface PrimaryButtonProps {\n  title: string;\n  onClick: () => void;\n  variant?: 'primary' | 'secondary';\n  disabled?: boolean;\n  loading?: boolean;\n}\n\nexport const PrimaryButton: React.FC<PrimaryButtonProps> = ({\n  title,\n  onClick,\n  variant = 'primary',\n  disabled = false,\n  loading = false\n}) => {\n  return (\n    <button\n      onClick={onClick}\n      disabled={disabled || loading}\n      className={`primary-button ${variant} ${disabled ? 'disabled' : ''} ${loading ? 'loading' : ''}`}\n    >\n      {loading ? 'Loading...' : title}\n    </button>\n  );\n};\n",
      "styles": ".primary-button {\n  padding: 8px 16px;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  font-weight: 500;\n}\n\n.primary-button.primary {\n  background-color: #007bff;\n  color: white;\n}\n\n.primary-button.secondary {\n  background-color: #6c757d;\n  color: white;\n}\n\n.primary-button.disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n\n.primary-button.loading {\n  position: relative;\n}\n",
      "tests": "import React from 'react';\nimport { render, screen, fireEvent } from '@testing-library/react';\nimport { PrimaryButton } from './PrimaryButton';\n\ndescribe('PrimaryButton', () => {\n  it('renders correctly', () => {\n    render(<PrimaryButton title="Click Me" onClick={() => {}} />);\n    expect(screen.getByText('Click Me')).toBeInTheDocument();\n  });\n\n  it('calls onClick when clicked', () => {\n    const handleClick = jest.fn();\n    render(<PrimaryButton title="Click Me" onClick={handleClick} />);\n    fireEvent.click(screen.getByText('Click Me'));\n    expect(handleClick).toHaveBeenCalledTimes(1);\n  });\n\n  it('shows loading state', () => {\n    render(<PrimaryButton title="Click Me" onClick={() => {}} loading />);\n    expect(screen.getByText('Loading...')).toBeInTheDocument();\n  });\n\n  it('is disabled when disabled prop is true', () => {\n    const handleClick = jest.fn();\n    render(<PrimaryButton title="Click Me" onClick={handleClick} disabled />);\n    const button = screen.getByText('Click Me');\n    expect(button).toBeDisabled();\n    fireEvent.click(button);\n    expect(handleClick).not.toHaveBeenCalled();\n  });\n});\n",
      "path": "src/components/PrimaryButton/"
    },
    "files": [
      {
        "name": "PrimaryButton.tsx",
        "content": "import React from 'react';\n\ninterface PrimaryButtonProps {\n  title: string;\n  onClick: () => void;\n  variant?: 'primary' | 'secondary';\n  disabled?: boolean;\n  loading?: boolean;\n}\n\nexport const PrimaryButton: React.FC<PrimaryButtonProps> = ({\n  title,\n  onClick,\n  variant = 'primary',\n  disabled = false,\n  loading = false\n}) => {\n  return (\n    <button\n      onClick={onClick}\n      disabled={disabled || loading}\n      className={`primary-button ${variant} ${disabled ? 'disabled' : ''} ${loading ? 'loading' : ''}`}\n    >\n      {loading ? 'Loading...' : title}\n    </button>\n  );\n};\n",
        "path": "src/components/PrimaryButton/PrimaryButton.tsx"
      },
      {
        "name": "PrimaryButton.module.css",
        "content": ".primary-button {\n  padding: 8px 16px;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  font-weight: 500;\n}\n\n.primary-button.primary {\n  background-color: #007bff;\n  color: white;\n}\n\n.primary-button.secondary {\n  background-color: #6c757d;\n  color: white;\n}\n\n.primary-button.disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n\n.primary-button.loading {\n  position: relative;\n}\n",
        "path": "src/components/PrimaryButton/PrimaryButton.module.css"
      },
      {
        "name": "PrimaryButton.test.tsx",
        "content": "import React from 'react';\nimport { render, screen, fireEvent } from '@testing-library/react';\nimport { PrimaryButton } from './PrimaryButton';\n\ndescribe('PrimaryButton', () => {\n  it('renders correctly', () => {\n    render(<PrimaryButton title="Click Me" onClick={() => {}} />);\n    expect(screen.getByText('Click Me')).toBeInTheDocument();\n  });\n\n  it('calls onClick when clicked', () => {\n    const handleClick = jest.fn();\n    render(<PrimaryButton title="Click Me" onClick={handleClick} />);\n    fireEvent.click(screen.getByText('Click Me'));\n    expect(handleClick).toHaveBeenCalledTimes(1);\n  });\n\n  it('shows loading state', () => {\n    render(<PrimaryButton title="Click Me" onClick={() => {}} loading />);\n    expect(screen.getByText('Loading...')).toBeInTheDocument();\n  });\n\n  it('is disabled when disabled prop is true', () => {\n    const handleClick = jest.fn();\n    render(<PrimaryButton title="Click Me" onClick={handleClick} disabled />);\n    const button = screen.getByText('Click Me');\n    expect(button).toBeDisabled();\n    fireEvent.click(button);\n    expect(handleClick).not.toHaveBeenCalled();\n  });\n});\n",
        "path": "src/components/PrimaryButton/PrimaryButton.test.tsx"
      }
    ]
  },
  "message": "代码生成完成"
}
```

## 最佳实践

- 使用TypeScript类型定义
- 组件设计遵循单一职责原则
- 生成完整的测试文件
- 提供清晰的文件结构

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 组件类型不支持 | 提示支持的组件类型列表 |
| 属性定义不清晰 | 提供属性定义的最佳实践 |
| 框架选择错误 | 提示支持的框架列表 |