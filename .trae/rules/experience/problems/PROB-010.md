# PROB-010: 前端开发缺少依赖

## 基本信息
- **问题ID**: PROB-010
- **记录时间**: 2026-05-30
- **项目名称**: AliceGo
- **问题类型**: 技术问题

## 问题描述

### 现象
前端Agent在开发代码过程中，连续3次出现缺少依赖的错误：
- 代码中import了某个第三方库
- 但package.json中没有添加该依赖
- 导致代码无法运行或测试失败

具体案例：
1. 使用了 `react-router-dom` 但未添加依赖
2. 使用了 `axios` 但未添加依赖
3. 使用了 `@mui/material` 但未添加依赖

### 影响范围
- 前端开发效率低下
- 需要反复返工
- 打断开发流程
- 影响TDD测试执行

### 严重程度
**高** - 严重影响开发效率

## 原因分析

### 根本原因
1. **前端Agent职责缺失**：Agent只负责生成代码，不负责识别和报告依赖
2. **缺少依赖检查机制**：代码生成后没有自动检查依赖是否完整
3. **DevOps与开发Agent协作不畅**：开发Agent不知道应该通知DevOps安装依赖
4. **禁止直接修改package.json**：开发Agent被禁止直接修改package.json，但没有替代方案

### 触发条件
- 前端Agent生成使用第三方库的代码
- 代码中import了未在package.json中声明的库
- 没有自动检查和通知机制

## 解决方案

### 最终方案
建立完整的依赖管理闭环流程：

**1. 创建 dependency-checker Skill**：
- 扫描代码中的import语句
- 识别第三方库依赖
- 对比package.json中的已有依赖
- 识别缺失的依赖和版本建议
- 生成依赖检查报告

**2. 更新前端/后端Agent**：
- 代码生成完成后，强制调用 dependency-checker Skill
- 生成依赖检查报告
- 通知 @devops 安装缺失的依赖
- 等待 @devops 完成后再继续

**3. 更新DevOps Agent**：
- 接收来自开发Agent的依赖安装请求
- 检查依赖是否与现有依赖冲突
- 执行 npm install 或 yarn add
- 通知开发Agent安装完成

**4. 明确禁止行为**：
- 开发Agent禁止直接修改package.json
- 开发Agent禁止直接执行npm install
- 所有依赖安装必须通过DevOps Agent

### 实施步骤
1. 创建 `dependency-checker/SKILL.md`，定义依赖检查流程
2. 更新 `frontend-dev.md`，添加依赖检查和报告流程
3. 更新 `backend-dev.md`，添加依赖检查和报告流程
4. 更新 `devops.md`，添加依赖安装接收和处理流程
5. 验证完整流程是否能正确识别和安装依赖

## 预防措施

### 技术手段
- 在 code-generator Skill 中，生成代码时同时生成依赖清单
- 在 dependency-checker Skill 中，自动扫描和识别依赖
- 在Agent执行流程中，强制添加依赖检查步骤

### 流程改进
- 前端/后端Agent执行流程：生成代码 → 检查依赖 → 报告DevOps → 等待安装 → 继续执行
- DevOpsAgent执行流程：接收依赖请求 → 检查冲突 → 安装依赖 → 通知完成
- 所有依赖变更必须经过DevOps Agent

### 检查点
- [ ] 代码生成后，必须调用dependency-checker
- [ ] 依赖检查报告必须包含：缺失依赖、建议版本
- [ ] 必须通知@devops安装依赖
- [ ] 必须等待依赖安装完成后再继续

## 关联信息

### 相关文档
- [dependency-checker/SKILL.md](file:///c:/Users/12345678/Documents/trae_projects/AliceGo/.trae/skills/dependency-checker/SKILL.md)
- [frontend-dev.md](file:///c:/Users/12345678/Documents/trae_projects/AliceGo/.trae/agents/frontend-dev.md)
- [backend-dev.md](file:///c:/Users/12345678/Documents/trae_projects/AliceGo/.trae/agents/backend-dev.md)
- [devops.md](file:///c:/Users/12345678/Documents/trae_projects/AliceGo/.trae/agents/devops.md)

### 类似问题
无 - 但容易重复发生，需要特别注意

### 责任人
- 问题发现：用户
- 问题处理：SOLO Coder

---

*最后更新：2026-05-31*
