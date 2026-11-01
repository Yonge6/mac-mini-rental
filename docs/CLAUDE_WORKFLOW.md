# 用 Claude 继续开发

仓库继续用 <https://github.com/Yonge6/mac-mini-rental>，同一个 GitHub 账号即可协作，不需要新建项目仓库或邀请协作者。

## Claude Code 网页版

1. 打开 <https://claude.ai/code>，选择现有 `Yonge6/mac-mini-rental` 仓库和最新 `main`。
2. 描述这次要改的内容。仓库根目录已有 `CLAUDE.md`，其中导入共用项目规则；应用和工作台目录也有对应入口。
3. 让 Claude 在自己的任务分支修改、运行相关检查并提交 PR。
4. 查看 PR 和检查结果后合并。接下来的 Claude/Codex 任务都从更新后的 `main` 开始；不让两个工具同时改同一分支。

这指的是 **Claude Code** 的代码任务，不是把 GitHub 链接贴进普通聊天后仅获取建议。如果 Claude Code 的仓库列表尚未显示这个仓库，在它的 GitHub 连接中选取现有仓库即可，不另给任何人新增协作者权限。

## 可以直接复制的任务提示词

```text
继续开发 https://github.com/Yonge6/mac-mini-rental。
先读取 CLAUDE.md、AGENTS.md、docs/DEVELOPMENT.md，以及修改目录内的规则。
从最新 main 创建独立任务分支，先检查现有实现，再完成下面的需求：

【在这里填写要改的内容】

保持现有价格、双语、动效、账号/订单数据和其他已完成的功能。
当前品牌暂用 CalDock，不恢复已经暂停的 GRIDRUN 改名。
运行与改动相关的检查；UI 改动需浏览器验证桌面和手机。
完成后提交 PR，说明修改内容、验证结果，以及是否还需要单独同步 craftos.app。
本次先提交可审查结果，不自动合并或发布，除非我在需求中明确要求上线。
```

若要改真实登录、订单、佣金或数据库，选择后端仓库 <https://github.com/Yonge6/onelaser-workos-api>；提示词改为先读 `docs/caldock/SETUP.md`，并把本仓库开发指南作为项目上下文。不要把后端业务做进前端演示数据。

## 本机 Claude Code

在同一现有仓库的干净分支/工作树运行 `claude` 即可。开始前用 `git status` 检查未提交内容；遇到别人的未完成合并，不重置或覆盖，改用干净工作树。所有本机开发文件遵守 DevSSD 规则。

## 官方说明

- [Claude Code 云端任务](https://support.claude.com/en/articles/12618689-use-claude-code-in-the-cloud)：选择 GitHub 仓库、描述任务、查看变更与 PR。
- [CLAUDE.md 与 AGENTS.md](https://code.claude.com/docs/en/memory)：项目规则和 `@AGENTS.md` 导入方式。
