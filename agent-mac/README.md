# 美国加州 M6 Mac mini 租赁页面

本地前端复刻。保留原站完整介绍、SVG 插画与样式，首屏按用户截图加入月付/年付选择。通过 GitHub Pages 发布页面和付款流程预览。

- 月付：$160，每月支付。
- 年付：$1,440 一次付清，折合 $120/月，7.5 折。
- 两处选择器同步，金额、付款周期、条款一致；点击继续付款直接进入所选周期的 `?view=checkout&interval=month` 或 `?view=checkout&interval=year` 付款预览。
- 如提供 `VITE_CHECKOUT_MONTH_URL` / `VITE_CHECKOUT_YEAR_URL`，选择器直接跳转对应的正式托管支付页，无额外订单确认页面。
- 付款尚未接通；本地付款页不会发起扣款或显示虚假的成功状态。
- 其他导航、软件下载及 PPT 链接仍指向参考站。价格、库存、交付及服务条款是参考内容，正式上线前须由服务方确认。
- 全部资源与字体位于 `public/assets`；未引入原站统计、第三方桥接脚本或账号系统。

## 验证的芯片规格

Apple M6：12 核 CPU、12 核 GPU；保留 16GB 统一内存、256GB SSD 基础配置。
来源：[Apple Mac mini Technical Specifications](https://www.apple.com/mac-mini/specs/)，2026-10-31 查看。

## 本地运行

Node 20.19+ 或 22.12+，`npm install` 后运行 `npm run dev -- --port 4173`。

`npm run build` 输出 `dist/client` 静态文件与保留的 Sites Worker。`npm run test:sites` 检查部署运行时契约。

## GitHub Pages

资源使用相对路径，付款页面使用查询参数路由，支持 GitHub Pages 的仓库子目录和直接刷新。根目录的 `.github/workflows/pages.yml` 在 main 更新时自动构建并发布 `agent-mac/dist/client`。
