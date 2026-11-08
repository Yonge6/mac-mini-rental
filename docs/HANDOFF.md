# wodeMac（原 CalDock）交接说明（2026-11-03）

写给接手开发的 Claude Code（项目所有者 Mac 上的本地会话）和人工开发者。开始任何任务前先读本文，再读根目录 `AGENTS.md`、`docs/DEVELOPMENT.md` 和要修改目录里的规则文件。

本文只记录事实和流程，**不含任何密钥**。密钥只存在于 Stripe、Google Cloud、Render 后台。

---

## 1. 一句话现状

wodeMac（原 CalDock，美国加州独享 M6 Mac mini 租用）已在 **https://wodemac.com/** 正式上线，`craftos.app/caldock/` 跳转过去：

- 客户可以用 **Google 登录**，用 **Stripe 正式收款**（`paymentMode: live`），月付、季付、年付都按订阅自动续费。
- 宣传页同时发布在 GitHub Pages：https://yonge6.github.io/mac-mini-rental/ 。
- 隐私政策和服务条款（中英双语）已上线，见第 6 节。

随时可以用这个地址核对线上状态：https://wodemac.com/api/caldock/capabilities
（2026-11-03 读到：`google:true`、`apple:false`、`payments:true`、`paymentMode:"live"`）

**2026-11-04 更新，以此为准：**

- 后端和 Wiki 仓库已转给项目负责人，前端仍在 `Yonge6/mac-mini-rental`。Render 部署后端 `main`，检查通过后自动部署，也可在 Render 手动触发。后文旧的部署分支流程已不适用。
- `wodemac.com` 的 DNS 在 GoDaddy，由负责人管理，改记录要邮箱验证码。
- 套餐：周 $69、月 $199、季 $537、半年 $954、年 $1,668。每天 3 台首期 8 折，周付不参加，北京时间 0 点重置，由后端计数。
- 大字是按 365 天折算的每天价格；库存由后端按已付款订单统计（`CALDOCK_STOCK`：共 10 台，上线前已租出 7 台），页面里的数字只是接口不通时的兜底。

## 2. 账号与权限

| 东西 | 归属 / 位置 | 说明 |
| --- | --- | --- |
| GitHub | 账号 **Yonge6** | 两个仓库：`Yonge6/mac-mini-rental`（前端）、`Yonge6/onelaser-workos-api`（共享后端，同时服务 Work OS）。Claude GitHub App 已授权这两个仓库。 |
| Render | **OneLaser** workspace → “My project” → 服务 **`onelaser-workos-migration`**（Docker），数据库 `onelaser-workos-db` | 公司正式环境，Work OS 和 CalDock 共用。另有个人空 workspace “Elian's workspace”，与正式站无关。 |
| Stripe | 账号 **Kraft Engineering Corp**（老板 KC / Kris Chen 提供，由 Mercury 管理），用户登录邮箱 elian.yuan@1laser.com | 正式模式已激活。 |
| Google Cloud | 账号 **hwu900566@gmail.com**，项目 **CalDock**（ID `caldock-513602`） | 只用于 Google 登录（OAuth），未绑定付款方式。 |
| 运营主体 / 对外联系 | wodeMac Inc（加州，沿用原地址），20472 Crescent Bay Dr, STE 104, Lake Forest, CA 92630；联系邮箱 hustyy986@gmail.com | 写在隐私政策和服务条款里。 |

## 3. 代码在哪里

- **前端** `Yonge6/mac-mini-rental`：`agent-mac/` 是 React 19 + Vite 6 应用。文件地图见 `docs/DEVELOPMENT.md` 第 1 节。
  - 付款跳转：`agent-mac/src/commerce/pages.jsx` 里的 `openPayment`，只允许跳到 `https://checkout.stripe.com`。
  - 法律页面：`agent-mac/public/legal/`（4 个 HTML 加 `legal.css`，不含脚本，因为正式站 CSP 禁止内联脚本）。
- **后端** `Yonge6/onelaser-workos-api`：
  - Stripe 适配：`src/caldock-stripe.ts`（不依赖 SDK，用原生 fetch；webhook 签名用 Node crypto 校验）。
  - 路由：`src/caldock.ts`，包括 `POST /caldock/orders/:id/checkout` 和 `POST /caldock/stripe/webhook`。
  - 只有通过签名校验的 Stripe 事件才会调用 `recordVerifiedCaldockPayment`（`src/caldock-domain.ts`），把订单标为已付款。
  - 数据库新增（只增不改）：`caldock_orders` 加了 3 个 Stripe ID 列，新表 `caldock_stripe_events`（`src/caldock-schema.ts`）。
  - 测试：`test/caldock-stripe.test.ts`（6 项）。完整说明见后端 `docs/caldock/SETUP.md` 的 Stripe 一节。
  - 前端打包白名单：`tools/fetch-caldock.mjs` 只下载 `agent-mac/` 下列出的路径（`src/`、`public/assets/`、`public/decision-studio/`、`public/legal/` 和根配置文件）。**前端在 `public/` 下新加目录时，必须同步改这个白名单**，否则正式站上会 404。

## 4. 发布流程（重要，和旧文档不同）

### 4.1 GitHub Pages
前端合并到 `main` → 工作流 `Deploy GitHub Pages` 自动构建并发布。这也是检验正式 Vite 构建的地方。

### 4.2 craftos.app（正式站）
正式站**不会**因为合并前端或后端的 `main` 自动更新。实际流程：

1. **确定要上线的前端提交**。目前正式站固定在发布分支 **`claude/caldock-prod-sync`**（`3746768`），它 = 前端 `main` + 还没合并的 PR #7（Codex 的工作台钉钉入口）。原因：之前正式站已经在跑 #7，直接用 `main` 会把这个功能丢掉。
   - 发新前端时：把前端 `main` 合并进 `claude/caldock-prod-sync`（普通 merge，不改写历史），推送，用新提交的完整 SHA。
   - 如果 PR #7 已经合进 `main`，就不再需要这个发布分支，直接用 `main` 的 SHA。
2. **后端开 PR**：只改 `deploy/caldock-revision.txt` 为 40 位 SHA，等 CI（类型检查、embedded 和真实 PostgreSQL 测试、Docker、Caddy、容器检查）通过后合并。
3. **同步部署分支**：Render 服务部署的分支是 **`codex/company-migration-live-20261102`**，不是 `main`。合并后，把这个分支快进到新的 `main`：
   ```bash
   git push origin <main 的完整 SHA>:refs/heads/codex/company-migration-live-20261102
   ```
   这是普通推送，不加 `--force`。先确认部署分支没有 `main` 以外的提交（`gh api repos/Yonge6/onelaser-workos-api/compare/main...codex/company-migration-live-20261102`，应为 ahead=0）。如果有分叉，先停下来问 Codex 或用户。
4. **在 Render 手动部署**：服务页右上角 **Manual Deploy → Deploy latest commit**。Docker 构建约 8 到 10 分钟。这个服务每次都是手动部署（Codex 那边用 cxw2020@gmail.com 触发）。
5. **回读确认**：`https://craftos.app/caldock/build-info.json` 的 `caldockCommit` 应为新 SHA，再在浏览器检查页面。

注意：Codex 经常往后端 `main` 和部署分支推送 Work OS 改动。2026-11-03 部署分支落后 `main` 3 个提交（Codex 的 Work OS 改动，还没部署）。你一部署，这些改动会一起上线。

## 5. 线上配置（只记变量名，不记值）

Render 服务 `onelaser-workos-migration` 的 Environment 里和 CalDock 有关的变量：

| 变量 | 作用 |
| --- | --- |
| `CALDOCK_STRIPE_SECRET_KEY` | Stripe 正式密钥（`sk_live_…`） |
| `CALDOCK_STRIPE_WEBHOOK_SECRET` | 正式 webhook 的签名密钥（`whsec_…`） |
| `CALDOCK_STRIPE_ALLOW_LIVE` | `true`。正式密钥必须配合这个开关才生效；缺了或格式不对，只会关闭 CalDock 付款，Work OS 照常运行 |
| `CALDOCK_GOOGLE_CLIENT_ID` / `CALDOCK_GOOGLE_CLIENT_SECRET` | Google 登录 |

Render 的环境变量页面里是 Work OS 的全部生产配置。**编辑时只动这几行**。曾经因为页面元素引用失效误点到别的变量的删除按钮，好在保存前取消了。操作时每一步先截图确认位置，不要用旧的元素引用。

**Stripe**（Kraft Engineering Corp）：
- 正式 webhook：`caldock-craftos-live` → `https://craftos.app/api/caldock/stripe/webhook`
- 测试 webhook：`caldock-craftos`（Sandbox，同一个地址），留着以后测试用。
- 两个 webhook 都是 API 版本 2025-01-27.acacia，Snapshot 格式，7 个事件：`checkout.session.completed`、`checkout.session.async_payment_succeeded`、`invoice.paid`、`invoice.payment_failed`、`customer.subscription.updated`、`customer.subscription.deleted`、`charge.refunded`。
- 不需要在 Stripe 建产品或价格：金额由服务器按订单生成（周付 6900、月付 19900、季付 53700、半年付 95400 每 3 个月、年付 166800 每年，单位美分）。

**Google Cloud**（项目 `caldock-513602`）：
- OAuth 客户端 “CalDock craftos.app”（Web 类型），回调地址 `https://craftos.app/api/caldock/auth/google/callback`。
- 应用状态 **In production**，用户类型 External，只申请基本信息，不需要 Google 审核。
- 品牌页链接：首页 `https://craftos.app/caldock/`，隐私政策 `…/caldock/legal/privacy.en.html`，服务条款 `…/caldock/legal/terms.en.html`，授权域名 `craftos.app`。

## 6. 产品规则（未经用户确认不要改）

- 品牌 **wodeMac**（2026-11-03 由 CalDock 改名，由负责人决定）。计划域名 `wodemac.com`，切换前网站仍在 `craftos.app/caldock/`；接口和代码里的 `caldock` 标识不变。
- 价格：周付 $69；月付 $199；季付 $537（折合 $179/月）；半年付 $954（折合 $159/月）；年付 $1,668（折合 $139/月）。首屏写“$139/月起”并注明年付总额。
- 新订单计费从**付款当天**开始，标记“已交付”不再推迟 Stripe 的下一次扣款。此前的订单仍按交付当天计费。
- 3 个工作日内没交付，全额退款。月付和季付可随时关闭续订；年付一年内不能取消或退款。续费失败保留 7 天。服务结束 3 天后抹除数据。
- 一单可买多台，年付 5 台及以上首年再减 2.5%。不出现积分、钱包、充值之类的说法。
- 保留暖黑配香槟金的风格、原有动效、中英双语、手机适配。

## 7. 待办和已知问题

1. **第一笔真实付款还没发生**。正式 webhook 密钥是否正确，要等第一笔真实订单：付款后几秒内订单变成“待开通”就是正确的。建议用户自己下一单月付 $199，确认后在 Stripe 全额退款，顺便测退款流程（手续费约 $6 不退）。
2. **测试订单**：2026-11-02 用测试模式付过一笔，系统里显示“待开通”，但没有真实付款，**不要交付**。
3. **法律文件审阅**：隐私政策和服务条款是 Claude 按网站规则起草的，不是律师意见。请 KC 审阅，重点看责任上限（最多赔 3 个月租金）和 Orange County 管辖条款。
4. **续费佣金**：续费成功会延长服务期，但推广佣金还不会自动计入续费订单，需要用户决定规则。
5. **Apple 登录**：2026-11-05 配好。Apple 开发者账号是个人身份（YONG YUAN，Team ID `L855ZVM679`，hustyy986@gmail.com），Service ID `com.wodemac.web.signin`，Key ID `NQ7AQK4AU8`；私钥只存在 Render 的 `CALDOCK_APPLE_PRIVATE_KEY` 和用户自己的备份里。Apple 登录界面可能显示个人开发者名字，不是 Kraft；要换成公司名得升级为组织账号。隐藏邮箱的客户要收到邮件，需在 Apple 后台登记发信域名。Apple 开发者协议须在 2026-11-13 前由账号本人接受。
6. **PR #7**（`codex/caldock-dingtalk-team`）还没合并，所以需要发布分支（见 4.2）。建议 Codex 合并后取消发布分支。
7. `docs/DEVELOPMENT.md` 第 4 节已按本文更新。

## 8. 在项目所有者的 Mac 上开发

- 遵守 `AGENTS.md` 的 **DevSSD** 规则：源码、worktree、依赖、缓存、构建产物都放在 `/Volumes/DevSSD`（卷 UUID 见 `AGENTS.md`）。动手前先确认这个卷已挂载，没挂载就停下，不要在内置磁盘上建替代目录。npm 缓存用 `npm_config_cache=/Volumes/DevSSD/Caches/npm`。
- 从 `main` 开新分支（`claude/…`），走 PR，不强推，不覆盖 Codex 的分支，也不合并已暂停的改名分支。
- 前端检查（在 `agent-mac/` 下运行）：`npm run test:commerce`、`npm run test:studio`、`npm run test:sites`、`npm run build`。界面改动还要在浏览器里检查电脑和手机、中文和英文，以及控制台报错。
- 后端检查：`npm run typecheck`、`npm test`、`npm run build`，再看 GitHub Actions 的结果。
- 本地页面要连后端，可以用 `?demo=1` 演示模式；演示数据不代表真实登录或付款。

## 9. 安全底线

- 不提交、不在聊天里粘贴任何密钥（Stripe、Google、Render 环境变量、数据库地址）。
- 只有通过签名校验的 Stripe 事件才能把订单标为已付款，浏览器或前端说的“付款成功”一律不算。
- 正式收款的开关（`CALDOCK_STRIPE_ALLOW_LIVE`）、Stripe 和 Google 的后台设置、Render 的环境变量，都要用户本人确认后才动。复制和粘贴密钥由用户亲自做。
