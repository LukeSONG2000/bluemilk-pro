# BlueMilk Pro

保持原版玩法的信息辅助与连接修复 Mod，配合 BlueMilk Editor / bluemilk 使用。**0.2.5 需要 Editor 0.2.6（SDK 2）。** 使用与 Editor 相同的双杯图标，作为 BlueMilk 官方 Mod 的视觉标识；本项目不隶属于 EA。

首版范围为信息拓展、实时属性与悬浮窗、商店购买失败修复。原版游戏操作及其 AI 原生 CLI 封装仍归 Pro，留到后续版本，首版不开发、不验收；改变玩法的敌方控制、试玩和自定义战斗归 Ultra。

## 包含内容

- `information-ui.js`：血量/普通护盾/临时紫盾数值、白色斜杠、技能 CD 和有限回合状态的原生 NGUI 显示、清理与还原。
- `attributes.js`：选中单位的初始/当前属性、净变化和展示格式。
- `ea-connectivity.js`：PC 购买流程的可选官网预检修复与还原。
- `main.js`：功能开关、命令与资源生命周期。
- `mod.json`：版本、能力、主页组件、页面表格及间距配置声明。

完整变化来源解释仍待实现，不把净变化当成已经准确归因。不修改 AI、伤害结算或资源消耗，不启动试玩或自定义战斗。

实现代码在本包内，Editor 不再内置这套功能。修改 Pro 显示或页面声明后，只需构建并安装新版 Pro。Editor 仅提供数据/原生调用适配、通用 SDK 和组件渲染。

## 安装与更新

在 Editor 导入、拖入或双击 `.bluemilk` 包，然后开启。离线可以保存启用选择，连接后生效。更新先安装新版，再开启新版；加载器确认旧版清理后切换，旧包保留。

信息显示与商店修复开关作用于当前 Mod 实例；主页快捷入口偏好由 Editor 保存。默认间距为 16，商店购买失败修复默认开启，开启固定延长至 15 秒，关闭恢复原值。

## 实时属性

游戏内长按打开的状态详情角色优先于目标选择器。主页、Mod 页和置顶悬浮窗共享同一份数据；表格仅显示初始、当前 (变化)，增量绿色、减量红色，无变化不附加数字。窗口按钮手动打开，关闭或停用 Mod 后收起。

悬浮窗采用 8 DIP 小圆角与细描边，中心 RGBA 为 `(25,41,64,237)`，与游戏效果详情面板相同。中文字体资源名为 `MYingHei_18030_C-Medium`，显示族名为 `MYingHei_18030_C`；Editor 从游戏只读提取并校验本地文件，经 Win2D 直接绘制，无需系统字体安装、注册或重启，也不分发原游戏字体。普通页面保留原生文字控件。MiniExpand 打开窗口，BackToWindow 收起为可拖动的应用图标；图标右键关闭。

## 商店购买失败修复

PC 每日免费宝箱实测失败位于 `PurchaseController.PingURLCheck`：官网请求在 2.0012 秒仍未完成，原版 2 秒预检将其判断为断网，尚未进入真实购买。

开启时固定将官网购买前置联网检查延长至 15 秒，关闭时恢复原值。本版移除跳过预检模式。功能描述：修复EA服务器连接超时，导致商店购买失败需要重新启动的问题。

0.2.2 修复了登录后配置被替换时仍写旧对象的问题：每次原版预检协程开始都采用其购买控制器实际持有的配置；持有原生 GC 引用，停用时按原值还原并释放。状态接口读取真实当前值，不再从模式推算 15 秒。首次登录配置未绑定时延迟至预检入口应用，不阻断启用。已真实验证免费青铜卡一次、延长模式盟友点青铜卡一次、跳过模式盟友点青铜卡一次，后两次各消耗 250 盟友点。

停用会撤销本模块的改动。真实服务器/认证异常仍须正常处理。当前网络为 Mihomo fake-IP，多个指定 DNS 返回同一个 fake IP，不能据此排序优选 DNS；本功能不修改系统 DNS/代理。

CLI 原始快照：

```json
{"id":"read","operation":"mods-command","payload":{"id":"bluemilk.pro","command":"snapshot","payload":{"detailScope":"selected"}}}
```

只读视图与属性：

```json
{"id":"view","operation":"mods-query","payload":{"id":"bluemilk.pro","command":"view","payload":{"features":["information","attributes"]}}}
```

`set-information` 命令接收 `{value:true/false}`；`set-connectivity` 接收 `{value:true/false}`；`view` 的 features 可含 `connectivity`。`status` 返回资源状态和清理诊断。

## 构建与验证

```powershell
py -X utf8 ../bluemilk-editor/tools/mod_author.py pack mod ../bluemilk-editor/logs/BlueMilk-Pro-0.2.5.bluemilk
node tests/attributes.cjs
node tests/connectivity.cjs
py -X utf8 tests/test_package.py
```

包为压缩 ZIP，约 52 KiB，包含完整显示、格式化、连接修复脚本与自有蓝奶图标；不包含原游戏图片、模型、字体或二进制。

原生验证包括：信息显示 9 个钩子安装/释放、三类血盾显示、敌方原版技能施放后的 CD、状态 (1)/(2) 回合标记，以及同一 SDK 会话只替换 Pro 包后间距 16→32。隔离战斗结束恢复酒馆，未调用战斗服务或消耗次数。

进程内 Mod 是可信代码，非安全沙箱；加载器目前仍有固定游戏版本限制。本项目独立维护，不隶属于 EA。

## 0.2.4 对齐修正

右上角生命、普通盾、临时紫盾使用独立原生标签，对齐原版色条的可见中心；通过原版 UILabel 的彩色字形网格测量，排除黑色投影和字体行框造成的视觉偏移。紫盾与普通盾按实际文字宽度排布，保留白色斜杠，紫盾为 0、普通盾上限为 0 时继续隐藏。隔离原引擎战斗中由帕德梅实际释放技能产生紫盾，三类数字与色条中心误差小于 0.001 原生 UI 单位，停用并退出后恢复酒馆。此隔离验证不等于最新安装组合的真实竞技场最终验收。

## 仓库来源与更新

离线包声明 `repository` 和 GitHub `updates.asset`，导入后可通过 Mod 管理的更新按钮检查正式 Release。作者为 LukeSONG2000；未正式发布时不填写 `publishedAt`，详情显示未发布。发布时使用 `v0.2.5` 标签及 `BlueMilk-Pro-0.2.5.bluemilk` 资产名，填写实际发布时间后重新封包。
