# BlueMilk Pro

把战斗里看不清的信息，直接显示出来。

BlueMilk Pro 是 [BlueMilk Editor](https://github.com/LukeSONG2000/bluemilk-editor) 的官方信息辅助 Mod。在熟悉的游戏界面里补充数值与状态，保留 SWGoH 原版的战斗规则。

[下载 Mod 包](https://github.com/LukeSONG2000/bluemilk-pro/releases/latest) · [获取 Editor](https://github.com/LukeSONG2000/bluemilk-editor/releases/latest) · [问题反馈](https://github.com/LukeSONG2000/bluemilk-pro/issues)

## 看清每一场战斗

| 功能 | 带来的变化 |
| --- | --- |
| 信息拓展 | 在战斗目标组件与效果详情中显示生命、护盾和临时护盾的绝对值、技能 CD 与有限回合状态的持续时间。 |
| 实时属性 | 对照进入战斗时与当前的属性面板，以绿色／红色呈现增减；长按查看的角色优先于当前选中目标。 |
| 属性悬浮窗 | 独立置顶窗口，可缩放并记忆大小，也可收起成可拖动的蓝奶图标。 |
| 商店购买失败修复 | 修复EA服务器连接超时，导致商店购买失败需要重新启动的问题。开启固定延长预检等待至 15 秒，关闭恢复原值。 |

属性变化显示数值差额；尚不提供完整的变化来源归因。商店修复针对购买前联网预检超时，EA 平台认证或真实服务故障仍需正常恢复。

## 独立安装，按需开启

下载 `BlueMilk-Pro-1.0.0.bluemilk`，在 **BlueMilk Editor 1.0.0 或更新版本**中导入或拖入，然后开启 Pro。Editor 不自带 Pro，也不会自动安装任何 Mod。

信息拓展和购买修复可独立开关，主页快捷入口可按喜好隐藏。已安装的离线包保留 GitHub 来源，可在 Mod 管理中检查新版。

## 原版体验，多一点信息

Pro 不修改敌方 AI、技能伤害、战斗规则或资源消耗。客户端与独立 `bluemilk` CLI 可使用同一份 Mod；图标沿用 Editor 的蓝奶标识，表示 BlueMilk 官方扩展。

支持 Windows 上与 Editor 游戏适配器兼容的 SWGoH PC 客户端。包内包含扩展代码与自有图标，不分发游戏模型、图片或字体。

[开发与验证](docs/DEVELOPMENT.md) · [MIT License](LICENSE)

BlueMilk 是独立项目，与 EA、Capital Games 或 Lucasfilm 无隶属关系。游戏资源归其权利人所有。
