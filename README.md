# BlueMilk Pro

保持原版玩法的信息与操作辅助 Mod，配合 **BlueMilk Editor** / `bluemilk` 使用。
本项目独立维护，不隶属于 EA。

首个验收包 0.1.0 包含原信息 UI 适配和只读 `snapshot` 命令。
不修改敌方 AI、伤害结算、资源消耗，不启动试玩或自定义战斗。
初始面板／当前面板沿原始数据读取；完整变化来源解释仍待实现与验收，
不能把差值当成已经准确归因。原版操作辅助将在后续版本接入。

在 Editor 的 Mod 管理中导入 `.bluemilk` 离线包，按需载入和启用；
可在启动设置中选择该版本。与历史 `bluemilk.information` 包互斥，
先停用旧包；不会自动删除旧包或其配置。停用与卸载使用加载器常规入口。
Editor 不捆绑、不自动安装本 Mod。仓库地址安装界面尚待实现。

CLI 启用后可通过 `mods-command` 调用：

```json
{"id":"attributes-1","operation":"mods-command","payload":{"id":"bluemilk.pro","command":"snapshot","payload":{"detailScope":"selected"}}}
```

使用 Editor 公开打包工具构建（不含游戏资源）：

```powershell
py ../bluemilk-editor/tools/mod_author.py pack mod ../bluemilk-editor/logs/BlueMilk-Pro-0.1.0.bluemilk
```

当前依赖 SDK v1，加载器当前仍有已知游戏版本限制；动态适配是后续独立验收项。
进程内 Mod 是受信任代码，并非安全沙箱。
