# BlueMilk Pro

保持原版玩法的信息辅助与连接修复 Mod，配合 BlueMilk Editor / bluemilk 使用。**0.2.3 需要 Editor 0.2.3（SDK 2）。** 使用与 Editor 相同的双杯图标，作为 BlueMilk 官方 Mod 的视觉标识；本项目不隶属于 EA。

首版范围为信息拓展、实时属性与悬浮窗、EA 连接修复。原版游戏操作及其 AI 原生 CLI 封装仍归 Pro，留到后续版本，首版不开发、不验收；改变玩法的敌方控制、试玩和自定义战斗归 Ultra。

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

信息显示开关与 EA 模式选择作用于当前 Mod 实例；主页快捷入口的显示偏好由 Editor 保存。间距和默认 EA 模式按包版本保存，在重新注册时读取，默认分别为 16 和延长至 15 秒。

## 实时属性

游戏内长按打开的状态详情角色优先于目标选择器。主页、Mod 页和置顶悬浮窗共享同一份数据；表格仅显示初始、当前 (变化)，增量绿色、减量红色，无变化不附加数字。窗口按钮手动打开，关闭或停用 Mod 后收起。

悬浮窗直接读取原版 `effects_details_bg` 完整九宫格（边距 30/32/30/38），保留描边、切角和 Alpha 通道；中心 RGBA 为 `(25,41,64,237)`。Windows 帧已去除，黑白底实测 Alpha 为 237/255；中文字体为本地资源中的 `MYingHei_18030_C-Medium`。Editor 从游戏只读提取并缓存，临时注册当前用户字体，正常退出撤销；字体和面板图片不放入 Mod 或安装包。面板图像按游戏版本隔离缓存，首次读取需要原版战斗 UI 已加载。

## EA 连接修复

PC 每日免费宝箱实测失败位于 `PurchaseController.PingURLCheck`：官网请求在 2.0012 秒仍未完成，原版 2 秒预检将其判断为断网，尚未进入真实购买。

- 原版（2 秒）：恢复原始预检。
- 延长至 15 秒（默认）：只延长该官网预检时限。已真实领取成功，奖励为 5 个微型衰减器、1 个欧米伽；该次请求 0.94 秒完成，不将此当成所有慢网络都已解决的证明。
- 跳过官网预检：只调用该预检的原版继续回调，不伪造购买、EA 平台认证、票据或奖励。已用原版 Unity 协程验证回调一次。

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

`set-information` 命令接收 `{value:true/false}`；`set-connectivity` 接收 `{value:"original"|"extended"|"skip"}`；`view` 的 features 可含 `connectivity`。`status` 返回资源状态和清理诊断。

## 构建与验证

```powershell
py -X utf8 ../bluemilk-editor/tools/mod_author.py pack mod ../bluemilk-editor/logs/BlueMilk-Pro-0.2.3.bluemilk
node tests/attributes.cjs
node tests/connectivity.cjs
py -X utf8 tests/test_package.py
```

包为压缩 ZIP，约 51 KiB，包含完整显示、格式化、连接修复脚本与自有蓝奶图标；不包含原游戏图片、模型、字体或二进制。

原生验证包括：9 个钩子安装/释放、三类血盾显示、敌方原版技能施放后的 CD、状态 (1)/(2) 回合标记，以及同一 SDK 会话只替换 Pro 包后间距 16→32。隔离战斗结束恢复酒馆，未调用战斗服务或消耗次数。

进程内 Mod 是可信代码，非安全沙箱；加载器目前仍有固定游戏版本限制。本项目独立维护，不隶属于 EA。
