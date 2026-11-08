# 中文搜索与资料维护

2026-11-07 起，官网构建会提供可直接读取的首页 HTML，以及中英文租赁与开发指南。同日第二轮把重点放在 Claude Code 与 Codex 相关搜索：新增 Codex、Claude Code 与 Codex 对比、7×24 持续运行、iOS 开发 4 篇中文指南，3 篇英文指南（`/guides/en.html` 目录），首页标题和描述写明预装 Claude Code 与 Codex，并新增 `llms-full.txt`。2026-11-08 第三轮再加 7 篇中文（Claude Code 安装、Codex 安装、Remote Control、多任务并行、Mac mini 与 Linux VPS 对比、16GB 够不够、名词解释）和 4 篇英文指南，共 22 篇；首页新增「预装了哪些 AI 编程工具？」问答和工具区的指南链接；`robots.txt` 明确允许主要 AI 爬虫。指南里的安装命令、套餐和 Remote Control 说明均核对自当日的 Claude Code 与 Codex 官方文档，日后以官方为准更新。它们与现有 React 应用共用源码和价格定义，不提供新的登录、付款或数据库入口。

## 维护位置

- 首页正文：`agent-mac/src/source.html`、`source.en.html`。原有 React 挂载与交互保持，构建后初始 HTML 也包含同一份正文。
- 中文指南源：`agent-mac/scripts/seo-content.mjs`。`generate-seo.mjs` 生成 `public/guides/*.html`（指南条目带 `lang: 'en'` 时生成英文页）、`guides/en.html`、`sitemap.xml`（含 lastmod）、`llms.txt`、`llms-full.txt`；每篇指南的 `sources` 选择 `sourceSets` 中的来源组，`pair` 指向另一语种的对应页并生成 hreflang，`about` 列出页面涉及的软件（写入 Article 的 about），`published` 为首次发布日期（`verifiedDate` 为最近核验日）；「继续了解」只列同语种、`about` 最相近的 4 篇；生成页也纳入版本控制，更新内容后运行构建并一并提交。
- 指南样式：`agent-mac/public/guides/guides.css`。使用系统字体，不依赖 Google Fonts。
- 首页预渲染：`agent-mac/scripts/prerender-home.mjs`。四种基础方案来自 `src/commerce/plans.mjs`，不是另一套手工价格；静态付款链接保留 `view`、`interval` 和 `lang` 参数。React 启动后接管现有页面，静态方案不会与交互方案重复显示。
- 英文静态首页：构建产物 `/en.html`。`public/seo-locale.js` 在模块加载前把旧 `?lang=en` 首页导航到英文 HTML，保留其他查询参数与锚点；`view` 与付款路径不参与该导航。英文页面直接访问时补齐现有应用要求的 `lang=en`。

不要往这些页面填入真实客户记录、未授权案例、虚构评分或库存。首页加载前显示库存待查询，只有现有 stock API 返回后才展示数值。失败时保持未知，不恢复旧硬编码首发台数。

## 内容与结构化资料

各指南应先回答问题，再写准备、费用边界、验收和来源。机器服务用途为软件开发与测试；第三方账号、模型订阅与地区／年龄资格需单独核实。具体产品配置与法律条款由各自拥有者维护。批量折扣或其他页面口径冲突未解决前，不在新页扩散测算数字。

JSON-LD 是页面中可见事实与 FAQ 的机器可读表达，不包含虚构评分、库存、案例或效果。现有 CSP 不因本轮而放宽；JSON-LD 为非执行数据，语种引导使用同源外链脚本。部署后需继续用浏览器检查实际 CSP 与页面。

`llms.txt` 仅为可维护的资料目录；它不保证搜索抓取、收录、排名或任何 AI 产品引用。提交搜索引擎、抓取、收录与引用应分别记录，有真实回执才计为完成。

## 验证

```bash
cd agent-mac
npm run build
npm run test:seo
npm run test:sites
npm run test:commerce
npm run test:studio
npm run preview -- --host 127.0.0.1 --port 4197
```

`test:seo` 检查构建产物中的真实中英正文、语种和 canonical、FAQ 与可见答案、内部链接、价格与付款参数、旧英文 URL 的参数保持及账号路径隔离。GitHub Pages 构建也运行该检查。还需浏览器验证桌面／手机、JS 接管、语言切换与选方案，不能用构建通过代替可视化验收。

正式站仍需后端固定前端提交并发布，GitHub Pages 成功不等于 `wodemac.com` 更新。下游源码包白名单须包含本轮三个 SEO 脚本、`public/guides/`、`public/llms.txt`、`public/seo-locale.js`、`public/seo-shell.css`；由发布任务核对 pin 与公开内容。
