# 开发指南

这是同一项目在 Claude、Codex 和人工开发之间共用的日常开发说明，不需要搬仓库或另开账号。以 GitHub 当前 `main` 为共同基线，任务用独立分支和 PR 合并。

## 1. 按任务找到文件

| 要改什么 | 主要文件 |
| --- | --- |
| 介绍文案、FAQ、团队、视频、导航 | `agent-mac/src/source.html`、`source.en.html`（两种语言一起维护） |
| 页面/首屏样式与动效 | `agent-mac/src/styles.css`、`afterglow.css` |
| 三档价格卡样式 | `agent-mac/src/pricing.css` |
| 选套餐、付款摘要、页面组装 | `agent-mac/src/App.jsx` |
| 价格与计费周期定义 | `agent-mac/src/commerce/plans.mjs` |
| 账号/订单/分销/管理员界面 | `agent-mac/src/commerce/pages.jsx`、`commerce.css` |
| API 会话、请求、登录跳转 | `agent-mac/src/commerce/context.jsx`、`core.mjs` |
| 明确标识的本地虚构演示 | `agent-mac/src/commerce/demo.mjs` |
| Logo、照片、字体等静态素材 | `agent-mac/public/assets/` |
| 工作台 UI/财务模型/增长手册 | `agent-mac/public/decision-studio/`；先读该目录规则 |
| CI 和 GitHub Pages | `.github/workflows/pages.yml` |

`source*.html` 是真实参与构建的原始页面片段，不是废弃导出物。`App.jsx` 在其上安装交互与 React 界面；不要为了改一段文案重建整站。`src/main.jsx` 中的样式导入顺序影响覆盖结果。

## 2. 开发与检查

推荐 Node.js 22。使用锁文件安装：

```bash
cd agent-mac
npm ci
npm run dev -- --host 0.0.0.0 --port 4173
```

若端口被其他开发者使用，另选空闲端口，不停止别人的服务。构建目录是 `agent-mac/dist/`，不要把依赖和构建产物作为源文件提交。

```bash
npm run test:commerce
npm run test:studio
npm run test:sites
npm run build
```

UI 改动还要在浏览器检查桌面/手机、中文/英文、选套餐到付款的跳转和控制台错误。只改文档时检查链接、命令与 `git diff --check` 即可。

本地虚构演示可用：
- `?view=account&demo=1&role=customer`
- `?view=admin&demo=1&role=admin`

它们只使用浏览器虚构数据。不要用演示状态证明真实登录、付款、订单或分销已启用。

## 3. 后端在另一个现有仓库

地址：<https://github.com/Yonge6/onelaser-workos-api>。这是共享 Work OS/Fastify/PostgreSQL 服务；CalDock 使用独立的表、会话、角色与审计。

| 任务 | 后端文件 |
| --- | --- |
| 路由、OAuth、客户、管理、订单接口 | `src/caldock.ts` |
| 价格、订单与可信支付事件业务 | `src/caldock-domain.ts` |
| 数据结构与迁移 | `src/caldock-schema.ts` |
| 登录 token/身份校验 | `src/caldock-oidc.ts` |
| 共享工作台 | `src/caldock-studio.ts`、`src/caldock-studio-seed.ts` |
| 生产与供应商配置说明 | `docs/caldock/SETUP.md` |
| 固定前端版本与服务策略 | `deploy/caldock-revision.txt`、`deploy/Caddyfile`、`Dockerfile` |
| 测试 | `test/caldock*.test.ts` |

需要改真实登录、订单状态、佣金、数据库或共享写权限时，Claude 应在这个后端仓库另开任务/PR。纯页面修改留在本仓库。不把共享后端复制到前端，不让浏览器直接决定 paid 状态。

后端用其 `package.json` 的 `npm run typecheck`、`npm test`、`npm run build` 和 GitHub Actions 的 PostgreSQL、Caddy、容器检查。不能完成的依赖验证明确写出，不以跳过测试代替成功。私有部署配置按现有服务管理，不提交密钥。

## 4. 两个网站的发布不同

### GitHub Pages

本仓库合并 `main` 后，`Deploy GitHub Pages` 工作流构建 `agent-mac/dist/client` 并发布到 <https://yonge6.github.io/mac-mini-rental/>。检查 Actions 成功后，还需打开公开网址回读。

### craftos.app

正式站、登录、客户中心和付款页在 <https://craftos.app/caldock/>。后端的 `deploy/caldock-revision.txt` 固定本仓库的 **40 位提交 SHA**，Docker 在构建时取该提交并构建前端。

要把已验证前端同步到正式站：
1. 前端提交先存在 GitHub，且相关检查通过。
2. 在后端独立 PR 中把 `deploy/caldock-revision.txt` 更新为该提交的完整 SHA；保留 Work OS、Wiki 的其他版本 pin 和配置。
3. 按后端现有 CI/Render 发布流程部署对应后端提交；不要为了本次任务擅自修改自动发布设置。
4. 回读 `https://craftos.app/caldock/build-info.json` 的 `caldockCommit`，并在浏览器验证相应页面。不能仅凭 GitHub Pages 更新就说正式站也已更新。

仅修改本仓库文档，不需要改后端 pin 或重新部署正式服务。

## 5. 当前确认与未启用部分

确认价格：月付 $199、季付 $507、年付 $1,548；首屏 $129/月起注明年付总额。旧年费 $1,799 已失效。

品牌仍为 CalDock；用户已暂停 GRIDRUN 改名。没有新确认前，不启用 GRIDRUN、PACE 或其他候选名，也不合并本地暂停的改名分支。

2026-11-01 读到的生产 `capabilities`：Google/Apple 为 false、payments 为 false、自动打款为 false。后续以 <https://craftos.app/api/caldock/capabilities> 和实际供应商流程复核为准；页面存在不代表供应商已配置。

修改必须保持：美国加州定位、现有暖黑/金色风格、原有动效、真实 OneLaser 团队素材、两种语言、首期从交付开始计费，以及公开查看/授权编辑工作台的边界。工作台财务模型是独立测算，不能改写实际报价或默默覆盖团队已保存内容。
