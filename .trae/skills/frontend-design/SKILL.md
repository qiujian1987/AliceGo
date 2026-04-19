---
name: "frontend-design"
description: "前端设计，创建具有独特性和高品质的前端界面。触发场景：'前端设计'、'UI设计'、'界面美化'。"
---

# 前端设计 Skill

## 功能描述

创建具有独特性和高品质的前端界面，达到生产级别的标准。避免生成千篇一律、缺乏独特风格的 "AI 风格" 界面，而是通过在设计上有意地选择大胆、明确的美学方向，并注重排版、色彩、动效、空间布局等细节，来打造出令人印象深刻、具有艺术感的前端页面。

## 输入参数

| 参数 | 类型 | 描述 | 必需 |
|------|------|------|------|
| project_type | string | 项目类型（landing page、dashboard、e-commerce、portfolio 等） | 是 |
| design_style | string | 设计风格（minimal、retro、futuristic、brutalist 等） | 是 |
| brand_colors | array | 品牌色彩（如 ["#FF6B6B", "#4ECDC4", "#45B7D1"]） | 否 |
| target_audience | string | 目标用户群体 | 否 |
| features | array | 核心功能列表 | 否 |

## 输出格式

```json
{
  "status": "success",
  "data": {
    "design": {
      "style_guide": {
        "color_palette": ["..."],
        "typography": {
          "heading": "...",
          "body": "...",
          "accent": "..."
        },
        "layout": "...",
        "animation": "..."
      },
      "components": [
        {
          "name": "...",
          "description": "...",
          "html": "...",
          "css": "..."
        }
      ],
      "pages": [
        {
          "name": "...",
          "description": "...",
          "structure": "..."
        }
      ]
    },
    "message": "前端设计完成"
  }
}
```

## 执行流程

1. 分析项目类型和设计风格需求
2. 确定色彩方案和排版系统
3. 设计核心组件和布局结构
4. 规划页面结构和用户流程
5. 生成具体的 HTML/CSS 实现
6. 添加动画和交互效果
7. 确保响应式设计和可访问性

## 使用示例

### 输入
```json
{
  "project_type": "landing page",
  "design_style": "minimal",
  "brand_colors": ["#2D3748", "#4299E1", "#F7FAFC"],
  "target_audience": "tech professionals",
  "features": ["hero section", "features section", "pricing", "testimonials", "cta"]
}
```

### 输出
```json
{
  "status": "success",
  "data": {
    "design": {
      "style_guide": {
        "color_palette": ["#2D3748", "#4299E1", "#F7FAFC", "#E2E8F0", "#1A202C"],
        "typography": {
          "heading": "Inter, sans-serif",
          "body": "Inter, sans-serif",
          "accent": "Inter, sans-serif"
        },
        "layout": "Clean, whitespace-focused layout with clear hierarchy",
        "animation": "Subtle hover effects and smooth transitions"
      },
      "components": [
        {
          "name": "Hero Section",
          "description": "Minimal hero section with bold headline and clear CTA",
          "html": "<section class='hero'>...</section>",
          "css": ".hero { ... }"
        }
      ],
      "pages": [
        {
          "name": "Home Page",
          "description": "Minimal landing page with clear sections",
          "structure": "Hero → Features → Pricing → Testimonials → CTA → Footer"
        }
      ]
    },
    "message": "前端设计完成"
  }
}
```

## 设计风格指南

### 极简风格 (Minimal)
- 大量留白
- 简洁的排版
- 有限的色彩方案
- 干净的线条和形状
- 功能性优先

### 复古风格 (Retro)
- 怀旧的色彩
- 复古字体
- 纹理和质感
- 经典的布局
- 温暖的色调

### 未来风格 (Futuristic)
- 明亮的霓虹色彩
- 几何形状
- 流畅的动画
- 未来感字体
- 科技感元素

### 野兽派风格 (Brutalist)
- 大胆的色彩对比
- 原始的形状
- 粗体字体
- 非传统布局
- 强烈的视觉冲击

## 最佳实践

- 确立明确的设计方向和风格
- 注重排版的层次感和可读性
- 精心选择色彩方案，确保品牌一致性
- 设计响应式布局，适配不同设备
- 添加适当的动画和交互效果
- 确保代码结构清晰，易于维护
- 考虑可访问性和用户体验

## 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 设计风格不明确 | 基于项目类型推荐合适的风格 |
| 色彩方案冲突 | 提供和谐的色彩建议 |
| 功能需求过多 | 建议优先级排序，简化设计 |
| 技术限制 | 提供符合技术能力的设计方案 |
