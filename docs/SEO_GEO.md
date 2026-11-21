# 中文搜索与资料维护

2026-11-07 起，官网构建会提供可直接读取的首页 HTML，以及中英文租赁与开发指南。

**2026-11-21 定位调整（负责人决定）**：网站改为「美国加州独享云端 Mac」定位，主打 iOS/macOS 开发与云端构建、出海团队的美国云端工作站、教育与团队统一环境。公开页面不再出现任何 AI 相关内容：首页文案、使用场景、预装软件区、FAQ、品牌短片区（已下线）、指南、法律页示例、`robots.txt` 的 AI 爬虫段落、`llms.txt` 与 `llms-full.txt`（已删除）都已调整。原 30 篇指南全部改写为云端 Mac 主题（17 篇中文、13 篇英文），带 claude/codex/ai 字样的旧网址已删除、不做跳转。`test:seo` 中的 `public pages ... carry no AI references` 用例会阻止 AI 词汇重新出现在公开页面里。

## 维护位置

- 首页正文：`agent-mac/src/source.html`、`source.en.html`。原有 React 挂载与交互保持，构建后初始 HTML 也包含同一份正文。
- 中文指南源：`agent-mac/scripts/seo-content.mjs`。`generate-seo.mjs` 生成 `public/guides/*.html`（指南条目带 `lang: 'en'` 时生成英文页）、`guides/en.html`、`sitemap.xml`（含 lastmod）；每篇指南的 `sources` 选择 `sourceSets` 中的来源组，`pair` 指向另一语种的对应页并生成 hreflang，`about` 列出页面涉及的软件（写入 Article 的 about），`published` 为首次发布日期（`verifiedDate` 为最近核验日）；「继续了解」只列同语种、`about` 最相近的 4 篇；生成页也纳入版本控制，更新内容后运行构建并一并提交。
- 指南样式：`agent-mac/public/guides/guides.css`。使用系统字体，不依赖 Google Fonts。
- 首页预渲染：`agent-mac/scripts/prerender-home.mjs`。四种基础方案来自 `src/commerce/plans.mjs`，不是另一套手工价格；静态付款链接保留 `view`、`interval` 和 `lang` 参数。React 启动后接管现有页面，静态方案不会与交互方案重复显示。
- 英文静态首页：构建产物 `/en.html`。`public/seo-locale.js` 在模块加载前把旧 `?lang=en` 首页导航到英文 HTML，保留其他查询参数与锚点；`view` 与付款路径不参与该导航。英文页面直接访问时补齐现有应用要求的 `lang=en`。

不要往这些页面填入真实客户记录、未授权案例、虚构评分或库存。首页加载前显示库存待查询，只有现有 stock API 返回后才展示数值。失败时保持未知，不恢复旧硬编码首发台数。

公开语言入口直接指向 `/` 和 `/en.html`。站内点击语言时保留所选周期和有效的推广参数。四个法律页面各自提供 canonical 和互相指向的 hreflang。旧语言参数仍可访问，结账、登录等功能地址继续使用原参数。

## 内容与结构化资料

各指南应先回答问题，再写准备、费用边界、验收和来源。机器服务用途为软件开发与测试（按 Apple macOS 许可）；第三方账号、订阅与地区／年龄资格需单独核实。不要写 AI 工具、模型或智能体相关内容。具体产品配置与法律条款由各自拥有者维护。批量折扣或其他页面口径冲突未解决前，不在新页扩散测算数字。

首页价格摘要、租赁 Offer 和指南价格表中的基础报价都从现行套餐定义生成。Offer 标明租赁周期及整期美元价格，库存由实时 API 提供。指南文本保留表格行列、命令换行和各页核验日期。现有 CSP 不因本轮而放宽；JSON-LD 为非执行数据，语种引导使用同源外链脚本。部署后需继续用浏览器检查实际 CSP 与页面。

提交搜索引擎、抓取与收录应分别记录，有真实回执才计为完成。

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

正式站仍需后端固定前端提交并发布，GitHub Pages 成功不等于 `wodemac.com` 更新。下游源码包白名单须包含三个 SEO 脚本、`public/guides/`、`public/seo-locale.js`、`public/seo-shell.css`。**2026-11-21 起 `public/llms.txt` 已删除，发布前须从后端白名单（`tools/fetch-caldock.mjs`）里去掉它**，否则下载可能失败；品牌短片文件仍在 `media.wodemac.com/films/`，网站不再引用，是否删除由负责人决定。由发布任务核对 pin 与公开内容。
