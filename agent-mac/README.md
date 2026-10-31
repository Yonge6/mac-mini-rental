# 美国加州 M6 Mac mini 租赁页面

本地前端复刻。保留原站完整介绍、SVG 插画与样式，首屏还原参考网站，月付/年付选择放在下方价格区。通过 GitHub Pages 发布页面和付款流程预览。

- 月付：$199，每月支付。
- 年付：$1,799 一次付清，折合约 $149.92/月，约7.5折。
- 下方价格区选择器同步金额、付款周期和条款；点击继续付款直接进入所选周期的 `?view=checkout&interval=month` 或 `?view=checkout&interval=year` 付款预览。
- 如提供 `VITE_CHECKOUT_MONTH_URL` / `VITE_CHECKOUT_YEAR_URL`，选择器直接跳转对应的正式托管支付页，无额外订单确认页面。
- 付款尚未接通；本地付款页不会发起扣款或显示虚假的成功状态。
- 顶部只保留 CalDock、页内定位和中英切换；原站下载栏、目录页脚及合规徽章已删除。“写给老板的演示”推广区及其链接也已删除。价格由用户确认；库存、交付及服务条款仍是页面预览内容。
- 全部资源与字体位于 `public/assets`；未引入原站统计、第三方桥接脚本或账号系统。

## 验证的芯片规格

Apple M6：12 核 CPU、12 核 GPU；保留 16GB 统一内存、256GB SSD 基础配置。
来源：[Apple Mac mini Technical Specifications](https://www.apple.com/mac-mini/specs/)，2026-10-31 查看。

## 本地运行

Node 20.19+ 或 22.12+，`npm install` 后运行 `npm run dev -- --port 4173`。

`npm run build` 输出 `dist/client` 静态文件与保留的 Sites Worker。`npm run test:sites` 检查部署运行时契约。

## GitHub Pages

资源使用相对路径，付款页面使用查询参数路由，支持 GitHub Pages 的仓库子目录和直接刷新。根目录的 `.github/workflows/pages.yml` 在 main 更新时自动构建并发布 `agent-mac/dist/client`。
