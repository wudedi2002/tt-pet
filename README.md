# Facemini 改版交互原型 v1.0

一站式多模态 AI 创作平台 — 第一版迭代中高保真原型 Demo。

## 快速预览

**推荐：双击 `打开原型.bat`**，会自动启动本地服务并打开浏览器。

项目路径：

```
C:\Users\tutu\Projects\facemini-prototype
```

浏览器访问（需先启动本地服务）：

- 首页：http://localhost:8765/#home
- 创作中心：http://localhost:8765/#hub
- AI 图片：http://localhost:8765/#image
- AI 视频：http://localhost:8765/#video

手动启动服务：

```bash
# Node.js（推荐）
npx serve -l 8765 .

# Python
python -m http.server 8765
```

也可直接双击 `index.html`，但部分浏览器对 `file://` 协议限制较多，建议用本地服务预览。

## 页面结构

| 页面 | 路由 Hash | 说明 |
|------|-----------|------|
| 品牌首页 | `#home` | 图2 Hero Banner，「开始创作」跳转创作中心 |
| 内容聚合 / 创作中心 | `#hub` | 左侧导航 + 场景入口、最近使用、常用模板 |
| AI 图片 | `#image` | 左侧导航 + 双模式创作、作品仓库 |
| AI 视频 | `#video` | 左侧导航 + 图/文生视频、历史列表 |
| 数字人 | `#avatar` | 左侧导航 + 预览编辑、接收图文 |
| 形象选择 | `#avatar-select` | 左侧导航 + 四大分类形象 |
| 爆款图文 | `#content` | 左侧导航 + 模板库、推送数字人 |

## 交互特性

- 全站固定导航，页面 Hash 路由跳转
- 深色黑紫科技风，统一组件规范
- 生成中动态进度条 + 场景化状态文案
- 四类报错弹窗（AI 图片页可演示）
- 输入区自动草稿保存（localStorage）
- 跨模块联动：爆款图文 → 数字人
- 积分消耗透明展示
- 1920 主设计，自适应移动端

## 文件结构

```
facemini-prototype/
├── index.html          # 全部页面（可交互原型）
├── css/main.css        # 设计系统（色彩/组件落地）
├── js/app.js           # 交互逻辑
├── design/             # 改版设计说明与规范 ← 侧栏查看
│   ├── DESIGN-SPEC.md      # 设计规范
│   ├── IA-ARCHITECTURE.md  # 信息架构
│   ├── ITERATION-LOG.md    # 迭代记录
│   └── references/         # 参考截图（请自行放入）
├── assets/             # 图片素材
├── 打开原型.bat         # 一键预览
└── README.md
```

> **关于设计源文件**：本次交付为 HTML 交互原型，没有 Figma/Sketch 源文件。设计规范见 `design/` 目录；对话中上传的参考图需手动放回 `design/references/`。

## 演示建议

1. 首页点击「开始创作」进入内容聚合页（`#hub`）
2. 在创作中心浏览场景卡片、最近使用、常用模板
3. 通过左侧导航或场景卡片进入四大核心模块
4. 各模块内左侧导航始终保留，可快速切换
