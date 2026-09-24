# 汴京入梦 · 2026 天津—开封国庆自驾计划

基于当前自驾规划制作的响应式旅行网页，视觉与交互参考同目录外的赴日旅行项目，并针对开封行程重新设计为宋韵朱红与夜游墨绿风格。

## 页面内容

- 2026 年 10 月 2 日出发倒计时
- 基于 OpenStreetMap 的往返交互地图与 8 个停留节点
- 天津至开封约 640 公里去程路线与四次休息安排
- 开封—衡水—天津两段返程方案
- 6 天行程标签切换
- 万岁山 2 个整日加 1 个下午/夜间的深度安排
- 住宿、停车、施工避让与 P+R 提示
- 两人一车预算构成
- 支持本地保存状态的出发前检查清单
- 桌面端与移动端响应式布局

## 本地运行

```bash
npm install
npm run dev
```

生产构建与代码检查：

```bash
npm run build
npm run lint
```

构建产物位于 `dist/`。

## GitHub Pages 部署

仓库：`calslave/wansuishan`，部署分支：`master`。

首次部署前，在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。如果账户套餐不支持私有仓库 Pages，需要先确认托管方案；不要直接把仓库改为公开。

推送到 `master` 后，`.github/workflows/deploy.yml` 会自动安装依赖、构建并发布 `dist/`。也可在 **Actions → Deploy GitHub Pages → Run workflow** 手动触发；首次运行因 Pages 未开启而失败时，开启后重新运行即可。

发布成功后的地址：<https://calslave.github.io/wansuishan/>。

Vite 的 `base` 已设为 `/wansuishan/`，本地调试也使用这个路径，例如 `http://localhost:4173/wansuishan/`（实际端口以启动输出为准）。

地图与字体依赖外部网络服务；出发清单状态保存在访问者自己的浏览器中。

## 信息更新提示

页面按 2026 年 9 月 18 日的规划状态制作。出发前仍需复核开封国庆免费换乘停车场、万岁山多日票与演出预约规则、开封博物馆开放安排、G45/G1811 实时路况以及逐小时天气。
