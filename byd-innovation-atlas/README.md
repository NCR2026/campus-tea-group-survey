# byd-innovation-atlas · 比亚迪公司创新管理案例分析

18 页完整网站汇报，含 6 个可交互三维场景。原生 HTML / CSS / JavaScript + Three.js 0.180.0，
依赖全部随包内置，不访问 CDN，不需要任何密钥或 AI 接口。

## 运行

在**本目录**内启动任意静态服务器：

```bash
python -m http.server 8000
# 打开 http://localhost:8000/
```

也可以直接双击上一级目录的「比亚迪创新管理汇报-离线单文件.html」（全部资源已内嵌）。

## 目录

```
index.html                 18 页结构与文案
assets/css/site.css        视觉系统（工程编辑风格）
assets/js/content.js       逐页数据与讲稿（由 work/content.json 生成）
assets/js/atlas.js         三维场景引擎（6 个场景，多实例）
assets/js/deck.js          翻页、导航、讲稿、目录、全屏、场景挂载
vendor/three.module.js     Three.js（MIT，见 vendor/LICENSE.txt）
vendor/three.core.min.js
img/                       7 张概念插图 + 1 张官方照片
```

## 操作

- `←` `→` / 空格翻页，`Home` / `End` 首末页，`F` 全屏，`N` 讲稿，`O` 目录，`Esc` 关闭面板
- 三维：拖动旋转、滚轮缩放、点击部件；方向键分步、空格播放、`R` 重置
- 深链接：`#/7` 直达第 7 页；`?notes=1` 打开讲稿；`?toc=1` 打开目录
- 静态截帧参数：`?shot=battery&mode=inside&explode=80&view=iso`（用于导出 PPT 素材）

## 部署

把本目录整体放到仓库 `NCR2026/campus-tea-group-survey` 根目录下的 `byd-innovation-atlas/`，
GitHub Pages 会自动发布到
`https://ncr2026.github.io/campus-tea-group-survey/byd-innovation-atlas/`。
不要改动同仓库的 `milk-tea-presentation/` 或其他项目。

## 内容口径

财务与研发数据采用比亚迪集团 2023—2025 完整年度口径；技术案例聚焦新能源汽车。
三维模型为课堂几何示意，不是制造商 CAD。资料核查日期 2026-10-25，来源见页面第 18 页与配套说明文档。

Three.js 以 MIT 许可证随包分发，保留 `vendor/LICENSE.txt`。
