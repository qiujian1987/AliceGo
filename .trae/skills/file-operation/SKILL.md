---
name: "file-operation"
description: "文件操作工具，提供创建、修改、删除、读取文件和目录的能力。触发场景：需要创建/修改/删除文件时。"
entry: "scripts/operation.js"
---

# 文件操作

## 文件创建

### 创建前检查
1. 检查目标路径是否存在
2. 检查是否已存在同名文件
3. 检查父目录是否存在
4. 验证文件名是否符合规范

### 创建后验证
1. 验证文件创建成功
2. 验证内容完整性
3. 检查是否需要添加到.gitignore
4. 报告创建结果

### 禁止创建
- `*.bak` 文件
- `*_backup.*` 文件
- `.tmp` 文件
- `temp_*` 开头的文件

## 文件修改

### 修改前检查
1. 确认文件当前内容
2. 检查是否有备份（如重要文件）
3. 说明修改内容

### 修改后验证
1. 验证修改完整性
2. 检查语法正确性
3. 运行相关测试（如需要）

## 文件删除

### 删除前必须确认
1. 确认文件是否被其他文件引用
2. 检查是否是唯一备份
3. 检查是否是系统关键文件
4. 列出删除影响范围
5. 提供撤销说明

### 删除确认格式
```
[删除确认]
- 文件：[路径]
- 影响：是否被引用
- 撤销：可通过git恢复
确认删除？ (y/n)
```

### 删除后处理
1. 验证删除成功
2. 检查是否有引用断裂
3. 报告删除结果

## 目录操作

### 目录创建
1. 检查是否已存在
2. 检查是否符合项目结构
3. 验证父目录存在

### 目录删除
1. 检查是否为空
2. 检查是否有重要文件
3. 确认删除影响

## 方法调用说明

### createFile - 创建文件
**参数**：
- `filePath` (string) - 文件路径
- `content` (string) - 文件内容
- `overwrite` (boolean) - 是否覆盖已存在文件，默认false

**返回**：
```json
{
  "status": "success",
  "message": "文件创建成功",
  "data": {
    "filePath": "/path/to/file",
    "size": 1024,
    "createdAt": "2026-05-10T10:00:00Z"
  }
}
```

### modifyFile - 修改文件
**参数**：
- `filePath` (string) - 文件路径
- `oldContent` (string) - 要替换的旧内容（可选）
- `newContent` (string) - 新内容
- `replaceAll` (boolean) - 是否替换所有匹配，默认false

**返回**：
```json
{
  "status": "success",
  "message": "文件修改成功",
  "data": {
    "filePath": "/path/to/file",
    "changes": "部分替换",
    "modifiedAt": "2026-05-10T10:00:00Z"
  }
}
```

### deleteFile - 删除文件
**参数**：
- `filePath` (string) - 文件路径
- `force` (boolean) - 是否强制删除，默认false

**返回**：
```json
{
  "status": "success",
  "message": "文件删除成功",
  "data": {
    "filePath": "/path/to/file",
    "deletedAt": "2026-05-10T10:00:00Z"
  }
}
```

### createDirectory - 创建目录
**参数**：
- `dirPath` (string) - 目录路径

**返回**：
```json
{
  "status": "success",
  "message": "目录创建成功",
  "data": {
    "dirPath": "/path/to/dir",
    "createdAt": "2026-05-10T10:00:00Z"
  }
}
```

### deleteDirectory - 删除目录
**参数**：
- `dirPath` (string) - 目录路径
- `force` (boolean) - 是否强制删除（包括非空目录），默认false

**返回**：
```json
{
  "status": "success",
  "message": "目录删除成功",
  "data": {
    "dirPath": "/path/to/dir",
    "deletedAt": "2026-05-10T10:00:00Z"
  }
}
```

### appendFile - 追加内容
**参数**：
- `filePath` (string) - 文件路径
- `content` (string) - 追加内容

**返回**：
```json
{
  "status": "success",
  "message": "内容追加成功",
  "data": {
    "filePath": "/path/to/file",
    "appendedLength": 100,
    "modifiedAt": "2026-05-10T10:00:00Z"
  }
}
```

### readFile - 读取文件
**参数**：
- `filePath` (string) - 文件路径

**返回**：
```json
{
  "status": "success",
  "message": "文件读取成功",
  "data": {
    "filePath": "/path/to/file",
    "content": "文件内容...",
    "size": 1024
  }
}
```

### listDirectory - 列出目录内容
**参数**：
- `dirPath` (string) - 目录路径

**返回**：
```json
{
  "status": "success",
  "message": "目录内容读取成功",
  "data": {
    "directories": [...],
    "files": [...]
  }
}
```

## 项目结构规范

### 参考目录结构
| 项目类型 | 标准目录 |
|---------|---------|
| 前端 | src/components, src/pages, src/hooks |
| 后端 | src/controllers, src/services, src/models |
| 全栈 | client/, server/, shared/ |

### 目录层级限制
- 最多3层
- 同级目录不超过10个
- 同级文件不超过20个

### 命名规范
- 目录：kebab-case 或 PascalCase
- 文件：kebab-case