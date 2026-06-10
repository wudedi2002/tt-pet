# Facemini 改版设计交付物

本目录存放改版原型的**设计说明与规范**，供汇报、评审和开发对齐使用。

> 说明：本次改版采用「可交互 HTML 原型」交付，设计规范直接落地在 `css/main.css` 与 `index.html` 中，**没有单独的 Figma / Sketch 源文件**。若你需要 Figma 稿，可基于本目录规范重新导出。

## 目录结构

```
design/
├── README.md              ← 本文件（交付物索引）
├── DESIGN-SPEC.md         ← 设计系统规范（色彩、字体、组件、交互）
├── IA-ARCHITECTURE.md     ← 信息架构与页面路由
├── ITERATION-LOG.md       ← 改版迭代记录
└── references/            ← 参考图与素材（请把截图放这里）
    └── README.md
```

## 与代码的对应关系

| 设计规范 | 代码实现 |
|----------|----------|
| 色彩 / 圆角 / 字体 | `css/main.css` → `:root` 变量 |
| 页面结构 / 组件 | `index.html` |
| 路由 / 交互 / 状态 | `js/app.js` |
| Logo | `assets/logo.svg` |
| 灵感库预览图 | `assets/inspire/`（待补充） |

## 参考图恢复

对话中上传的 Liblib、原站 Facemini 等参考截图，曾保存在 Cursor 临时目录，**未同步进本项目**，现已无法自动找回。

请将手头的设计参考图放入 `design/references/`，建议命名：

- `ref-01-home-hero.png` — 首页 Hero
- `ref-02-hub-layout.png` — 创作中心布局
- `ref-03-liblib-topbar.png` — Liblib 顶栏参考
- `ref-04-facemini-sidebar.png` — 原站侧栏参考
- `ref-05-image-module.png` — 图片模块
- `ref-06-video-module.png` — 视频模块
