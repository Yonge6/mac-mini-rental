# CalDock · 美国加州独享 Mac

展示页、付款流程、客户/订单/分销界面，以及团队使用的 Decision Studio。正式收款和真实登录供应商是否可用，以服务器配置为准。

## 从这里开始

- **用 Claude 或 Codex 开发**：[开发指南](docs/DEVELOPMENT.md) · [Claude 使用方式与可复制提示词](docs/CLAUDE_WORKFLOW.md)
- **自动读取的项目规则**：[CLAUDE.md](CLAUDE.md) · [AGENTS.md](AGENTS.md)
- **页面与功能说明**：[agent-mac/README.md](agent-mac/README.md)
- **决策工作台**：[Decision Studio](agent-mac/docs/decision-studio/README.md)

当前品牌暂用 **CalDock**。GRIDRUN 改名已暂停；PACE 等名字仍为候选，没有确认的新名字不要替换上线。

## 在线入口与仓库

| 内容 | 地址 |
| --- | --- |
| 展示页 | https://yonge6.github.io/mac-mini-rental/ |
| 正式站与客户界面 | https://craftos.app/caldock/ |
| 团队工作台 | https://craftos.app/decision-studio/ |
| 本仓库：页面、客户 UI、工作台前端 | https://github.com/Yonge6/mac-mini-rental |
| 共享后端：登录、订单、分销、工作台存储 | https://github.com/Yonge6/onelaser-workos-api |

本项目继续使用以上现有仓库。不要另建副本，也不要把共享 Work OS 后端复制进前端仓库。

## 当前价格

| 方案 | 折合月价 | 每期实付 |
| --- | --- | --- |
| 月付 | $199 | $199 / 1 个月 |
| 季付 | $169 | $507 / 3 个月 |
| 年付（主推） | $129 | $1,548 / 12 个月 |

前端定义在 `agent-mac/src/commerce/plans.mjs`，后端独立校验金额。旧订单保留创建时的金额；工作台财务测算不修改商品价格。

## 本地开发

使用 Node.js 22（与 GitHub Pages CI 对齐）：

```bash
cd agent-mac
npm ci
npm run dev -- --host 0.0.0.0 --port 4173
```

前端检查：

```bash
npm run test:commerce
npm run test:studio
npm run test:sites
npm run build
```

源码与运行目录都在 `agent-mac/`；无需在仓库根目录运行 `npm install`。在项目所有者的 Mac 上，工作区、依赖、缓存和构建产物须位于 DevSSD，详见 [AGENTS.md](AGENTS.md)。

合并到 `main` 后 GitHub Actions 会更新 GitHub Pages；**craftos.app 使用后端仓库固定的前端提交，需单独更新和发布**，详见开发指南。修改文档不等于启用登录或真实付款。
