---
name: "test-generator"
description: "前端测试生成，为React组件生成测试用例。触发场景：'生成测试'、'前端测试'。"
---

# 前端测试生成 Skill

## 功能描述

为React组件生成单元测试和集成测试用例，确保组件功能的正确性和稳定性。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| component_path | string | 组件文件路径 | 是 |
| component_code | string | 组件代码 | 否 |
| test_type | string | 测试类型 | 否 |
| framework | string | 测试框架 | 否 |

## 输出格式

```json
{
  "status": "success",
  "data": {
    "tests": {
      "unit": "...",
      "integration": "...",
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
  "message": "测试生成完成"
}
```

## 执行流程

1. 分析组件代码
2. 识别组件功能和属性
3. 生成单元测试用例
4. 生成集成测试用例
5. 提供测试文件路径

## 使用示例

### 输入
```json
{
  "component_path": "src/components/PrimaryButton/PrimaryButton.tsx",
  "component_code": "import React from 'react';\n\ninterface PrimaryButtonProps {\n  title: string;\n  onClick: () => void;\n  variant?: 'primary' | 'secondary';\n  disabled?: boolean;\n  loading?: boolean;\n}\n\nexport const PrimaryButton: React.FC<PrimaryButtonProps> = ({\n  title,\n  onClick,\n  variant = 'primary',\n  disabled = false,\n  loading = false\n}) => {\n  return (\n    <button\n      onClick={onClick}\n      disabled={disabled || loading}\n      className={`primary-button ${variant} ${disabled ? 'disabled' : ''} ${loading ? 'loading' : ''}`}\n    >\n      {loading ? 'Loading...' : title}\n    </button>\n  );\n};\n",
  "test_type": "unit",
  "framework": "jest"
}
```

### 输出
```json
{
  "status": "success",
  "data": {
    "tests": {
      "unit": "import React from 'react';\nimport { render, screen, fireEvent } from '@testing-library/react';\nimport { PrimaryButton } from './PrimaryButton';\n\ndescribe('PrimaryButton', () => {\n  it('renders correctly with default props', () => {\n    render(<PrimaryButton title="Click Me" onClick={() => {}} />);\n    expect(screen.getByText('Click Me')).toBeInTheDocument();\n    const button = screen.getByText('Click Me');\n    expect(button).not.toBeDisabled();\n  });\n\n  it('renders with secondary variant', () => {\n    render(<PrimaryButton title="Click Me" onClick={() => {}} variant="secondary" />);\n    expect(screen.getByText('Click Me')).toBeInTheDocument();\n  });\n\n  it('calls onClick handler when clicked', () => {\n    const handleClick = jest.fn();\n    render(<PrimaryButton title="Click Me" onClick={handleClick} />);\n    fireEvent.click(screen.getByText('Click Me'));\n    expect(handleClick).toHaveBeenCalledTimes(1);\n  });\n\n  it('shows loading state', () => {\n    render(<PrimaryButton title="Click Me" onClick={() => {}} loading />);\n    expect(screen.getByText('Loading...')).toBeInTheDocument();\n    const button = screen.getByText('Loading...');\n    expect(button).toBeDisabled();\n  });\n\n  it('is disabled when disabled prop is true', () => {\n    const handleClick = jest.fn();\n    render(<PrimaryButton title="Click Me" onClick={handleClick} disabled />);\n    const button = screen.getByText('Click Me');\n    expect(button).toBeDisabled();\n    fireEvent.click(button);\n    expect(handleClick).not.toHaveBeenCalled();\n  });\n\n  it('is disabled when loading is true', () => {\n    const handleClick = jest.fn();\n    render(<PrimaryButton title="Click Me" onClick={handleClick} loading />);\n    const button = screen.getByText('Loading...');\n    expect(button).toBeDisabled();\n    fireEvent.click(button);\n    expect(handleClick).not.toHaveBeenCalled();\n  });\n});\n",
      "integration": "",
      "path": "src/components/PrimaryButton/PrimaryButton.test.tsx"
    },
    "files": [
      {
        "name": "PrimaryButton.test.tsx",
        "content": "import React from 'react';\nimport { render, screen, fireEvent } from '@testing-library/react';\nimport { PrimaryButton } from './PrimaryButton';\n\ndescribe('PrimaryButton', () => {\n  it('renders correctly with default props', () => {\n    render(<PrimaryButton title="Click Me" onClick={() => {}} />);\n    expect(screen.getByText('Click Me')).toBeInTheDocument();\n    const button = screen.getByText('Click Me');\n    expect(button).not.toBeDisabled();\n  });\n\n  it('renders with secondary variant', () => {\n    render(<PrimaryButton title="Click Me" onClick={() => {}} variant="secondary" />);\n    expect(screen.getByText('Click Me')).toBeInTheDocument();\n  });\n\n  it('calls onClick handler when clicked', () => {\n    const handleClick = jest.fn();\n    render(<PrimaryButton title="Click Me" onClick={handleClick} />);\n    fireEvent.click(screen.getByText('Click Me'));\n    expect(handleClick).toHaveBeenCalledTimes(1);\n  });\n\n  it('shows loading state', () => {\n    render(<PrimaryButton title="Click Me" onClick={() => {}} loading />);\n    expect(screen.getByText('Loading...')).toBeInTheDocument();\n    const button = screen.getByText('Loading...');\n    expect(button).toBeDisabled();\n  });\n\n  it('is disabled when disabled prop is true', () => {\n    const handleClick = jest.fn();\n    render(<PrimaryButton title="Click Me" onClick={handleClick} disabled />);\n    const button = screen.getByText('Click Me');\n    expect(button).toBeDisabled();\n    fireEvent.click(button);\n    expect(handleClick).not.toHaveBeenCalled();\n  });\n\n  it('is disabled when loading is true', () => {\n    const handleClick = jest.fn();\n    render(<PrimaryButton title="Click Me" onClick={handleClick} loading />);\n    const button = screen.getByText('Loading...');\n    expect(button).toBeDisabled();\n    fireEvent.click(button);\n    expect(handleClick).not.toHaveBeenCalled();\n  });\n});\n",
        "path": "src/components/PrimaryButton/PrimaryButton.test.tsx"
      }
    ]
  },
  "message": "测试生成完成"
}
```

## 最佳实践

- 测试覆盖所有组件功能
- 测试边界条件和异常情况
- 使用模拟数据和函数
- 遵循测试框架最佳实践

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 组件代码无法分析 | 提示组件代码格式问题 |
| 测试框架不支持 | 提示支持的测试框架列表 |
| 路径不存在 | 提示创建相应的目录结构 |