# BlueMilk Pro

保持原版玩法的信息辅助 Mod，配合 BlueMilk Editor / bluemilk 使用。**0.2.0 需要 Editor 0.2.0（SDK 2）。**

## 包含内容

- `information-ui.js`：血量/普通护盾/临时紫盾数值、白色斜杠、技能 CD 和有限回合状态的原生 NGUI 显示、清理与还原。
- `attributes.js`：选中单位的初始/当前属性、净变化和展示格式。
- `main.js`：功能开关、命令与资源生命周期。
- `mod.json`：版本、能力、主页组件、页面表格及间距配置声明。

完整变化来源解释仍待实现，不把净变化当成已经准确归因。不修改 AI、伤害结算或资源消耗，不启动试玩或自定义战斗。

实现代码在本包内，Editor 不再内置这套功能。修改 Pro 显示或页面声明后，只需构建并安装新版 Pro。Editor 仅提供数据/原生调用适配、通用 SDK 和组件渲染。

## 安装与更新

在 Editor 导入、拖入或双击 `.bluemilk` 包，然后开启。离线可以保存启用选择，连接后生效。更新先安装新版，再开启新版；加载器确认旧版清理后切换，旧包保留。

信息显示开关作用于当前 Mod 实例；主页快捷入口的显示偏好由 Editor 保存。间距配置按包版本保存，默认 16；配置修改在重新注册时读取。

CLI 原始快照：

```json
{"id":"read","operation":"mods-command","payload":{"id":"bluemilk.pro","command":"snapshot","payload":{"detailScope":"selected"}}}
```

只读视图与属性：

```json
{"id":"view","operation":"mods-query","payload":{"id":"bluemilk.pro","command":"view","payload":{"features":["information","attributes"]}}}
```

`set-information` 命令接收 `{value:true/false}`；`status` 返回资源状态和清理诊断。

## 构建与验证

```powershell
py -X utf8 ../bluemilk-editor/tools/mod_author.py pack mod ../bluemilk-editor/logs/BlueMilk-Pro-0.2.0.bluemilk
node tests/attributes.cjs
py -X utf8 tests/test_package.py
```

包为压缩 ZIP，不包含游戏图片、模型或二进制。0.2.0 已包含完整显示脚本，压缩后约 10 KiB；不是此前 649 字节的入口包。

原生验证包括：9 个钩子安装/释放、三类血盾显示、敌方原版技能施放后的 CD、状态 (1)/(2) 回合标记，以及同一 SDK 会话只替换 Pro 包后间距 16→32。隔离战斗结束恢复酒馆，未调用战斗服务或消耗次数。

进程内 Mod 是可信代码，非安全沙箱；加载器目前仍有固定游戏版本限制。本项目独立维护，不隶属于 EA。
