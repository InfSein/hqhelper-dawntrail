# HqHelper CHANGELOG

## 2.2.8 (2025-07-18)

### 重要变更
1. 重制了项目的国际化结构。
   ① 性能有所优化，现在切换界面语言不再需要刷新页面。
   ② 现可通过Crowdin查阅和参与HqHelper的翻译工作。

### 问题修复
1. 修复了添加/编辑宏后会丢失预设标签和预设属性设置的问题。
2. 修正了7.05/7.1版本点数道具的兑换数据。
3. 一定程度上修复了在偏好设置中将「推荐流程」的「制作物品排序规则」设置为「制作笔记顺序」后，物品顺序仍与游戏内顺序不一致的问题。
   ※ 我们遇到了一些技术难题，暂时无法解决少数同类物品的顺序与游戏内制作笔记不一致的问题。如果您有解决思路，欢迎与我们联系。

### 功能更新
1. 优化了主界面在部分设备上的显示效果。
2. 根据特设站公布的信息，更新了7.3版本的logo与背景图。
   ※ 相关数据仍须等待版本正式上线后才能更新。


## 2.2.7 (2025-07-07)

### 问题修复
1. 修复了以覆写模式将物品加入工作流会清除工作流名称的问题。 (Found by Small-Dianer)
2. 修复了工作流报表的清单悬浮窗中的各组标题文字会被边框覆盖的问题。
3. 修复了移动端的菜单界面会随主页面一起滚动的问题。
4. 修正了宏管理界面输入框在界面语言设置为日语/英语时的显示效果。
5. 预修正了一部分云端同步可能导致的错误。

### 功能更新
1. 优化了推荐流程中非限时采集道具的排序，现在采集位置相近的道具会排在一起。
2. 现在点击报表的空白区域也可以取消选中物品行。
3. 编辑用户宏弹窗中追加了预设标签和预设属性的功能。


## 2.2.6 (2025-06-24)

### 重要变更
1. 国服数据库更新至7.2。
2. 实装全新功能「云端同步」。
    将自己的偏好设置与生产宏、背包库存等数据上传到云端，从而便捷备份和恢复，也可以在多端设备之间保持同步。
    ※ 需要注册和登录方可使用。账号与NBB配方计算器(5p.nbbjack.com)的账号互通。
    ※ 移动端暂未实装云端同步功能，将在后续版本追加。

### 问题修复
1. 修复了主窗口在少数情况下可能因为采集时钟悬浮窗的设置而置顶的问题。

### 功能更新
1. “偏好设置”的“增强”选项卡中追加了设置项“物品悬浮窗中显示水晶素材”。
    开启此项后，对于可制作道具，其物品悬浮窗的制作模块将显示制作它所需的碎晶／水晶／晶簇。
2. 背包库存中追加了反向同步功能的相关设置。
3. 优化了客户端拖拽区域的构建方式，现在有更多的位置支持长按拖拽。

## 2.2.5 (2025-06-12)

### 重要变更
1. 实装全新功能「背包库存」。
    在全新追加的专属弹窗中设置自己的物品库存，并自由选择是否要与弹窗/工作流中的专业报表同步。

### 问题修复
1. 进一步修复github.io页面的自动更新问题。
2. 修复了工作流的“挑选物品”区域表格在物品名称过长时各列会错位的问题。
3. 修正了制作报表弹窗中的推荐流程在物品名称过长时的显示效果。
4. 修正了赞助页面二维码的显示效果。

### 功能更新
1. 生产宏管理追加了导入、导出和删除所有宏功能。
    ※ 伴随这一改动，操作区域的按钮布局进行了调整。
2. 现可将大区本身(陆行鸟/猫小胖等)设置为物品价格服务器。
3. 桌面端菜单的“实用工具”下拉菜单中，可以在新窗口打开的工具将在其右侧展示对应按钮，而非单独占用一个菜单项。
4. 为「推荐流程」中的“隐藏/显示国服未实装物品”按钮增加了点击时提示。
5. 调整了客户端检查更新界面的默认加速服务，并更新了加速服务列表。
6. 调整了「关于本作」中的应用程序logo设计。

## 2.2.4 (2025-05-23)

### 重要变更
1. 实装全新功能「生产宏管理」。
    ※ 伴随这一改动，“偏好设置”中追加了“生产宏”选项卡。相应的，原有的“导入/导出”选项卡将被撤除，其下的设置项将移动到其他选项卡中。
2. 国服数据库更新至7.15，国际服数据库更新至7.21。

### 问题修复
1. 修正了克扎玛乌卡湿地的地图数据，现在会正常显示水果码头传送点。
2. 修复了「成本/收益分析」和「加入工作流」弹窗中物品信息图标的复制功能没有正常工作的问题。
3. 修复了制作报表内物品名称过长时表格各列会错位的问题。
4. 修复了赞助者名单有时会因缓存而没有及时更新的问题。
5. 修正了管理工作流弹窗中一些内容组件的渲染问题。
    ※ 此项是对2.2.3版本中相应修正的进一步处理。

### 功能更新
1. 向「推荐流程」中追加了“隐藏/显示国服未实装物品”按钮 (仅“服务器”设置为国服时显示)。
    ※ 对制作报表的推荐流程弹窗和工作流的流程标签页均适用，不过按钮位置不同。
2. “偏好设置”的“制作报表”选项卡中追加了设置项“忽略水晶素材”。
3. 在制作报表中左键单击任意物品行后，它和它的制作素材会被高亮展示。
    ※ 如果不需要这一功能，可以在“偏好设置”的“制作报表”选项卡中打开设置项“禁用高亮展示关联素材”。
4. 现在在将物品加入工作流时，可以自由选择加入模式。
    ※ 模式选择为“累加”即与之前版本的逻辑一致。可以在弹窗中查看详细说明。

## 2.2.3 (2025-05-01)

### 重要变更
1. 实装了赞助功能。
    挑选任意的创作者进行赞助，以提升其开发热情、或是降低其开支压力。进行赞助之后可以加入“致谢名单”。
    ※ 赞助行为重在心意，不求数额，但也没有回报。请务必量力而行。
2. 追加了下载客户端的专用页面。


### 问题修复
1. 修正了管理工作流弹窗中一些内容组件的渲染问题。
2. 修复了调整偏好设置中的界面语言设置后，程序的自动刷新不会让设置立即生效的问题。
3. 修复了部分区域的文本未遵循用户界面语言设置的问题。
4. 修正了“偏好设置”->“通用”中“服务器”的自动判断逻辑。
    现在设为自动时会跟随物品语言的设置，而非界面语言。
5. 修正了切换工作流区域在移动端的显示效果。
6. 修正了推荐流程中点数需求过长时流程标题的显示效果。
7. 修正了导出闹钟宏界面在物品语言设为日/英语时的显示效果。

### 功能更新
1. 更新了桌面端顶部菜单项“参考资料”的推荐攻略/工具列表 (仅在界面语言设置为简体中文时显示)。
    ※ 因作者弃坑，“自撰攻略”栏目移除。相应的，各子菜单的文本进行调整。
2. 复制宏时支持调整宏的生成模式，可以以多行方式输出宏。
    ※ 以多行模式输出时，复制的宏需要粘贴在用户宏中执行方可发送。
3. 专业版制作报表中，点数道具因上级制作素材变动而导致已有数量大于总需数量的场合，尚需点数统计不再显示为负数。
4. 优化了职业按钮右键菜单的显示效果。
5. 更新了720HQ/740HQ的推荐配装。
6. 偏好设置中，部分设置项的下拉框选项添加描述文本。
7. 优化了采集时钟页面物品按钮悬浮窗在移动端的显示效果。
8. 优化了部分区域的文本描述。

## 2.2.2 (2025-04-01)

### 问题修复
1. 修订了一部分道具的中文译名/描述。
2. 修复食药计算与工作流的统计中，部分道具会在采集统计和点数兑换统计中重复出现的问题。
3. 修正了工作流报表中子标题的背景色。
4. 修正主界面选择部件区域操作按钮的显示逻辑。

### 功能更新
1. 为工作流管理界面的表格增加了拖拽按钮，拖动即可为已有工作流排序。
2. “偏好设置”的“增强”选项卡中追加了设置项“物品数量按千分号格式化”。
3. 各个功能的默认设置有所调整。
    ※ 仅对第一次使用HqHelper的用户生效。
4. 偏好设置中，部分设置项修改之后不再需要刷新页面才能生效。
5. 优化了主界面右键职业按钮的展开菜单的显示效果。

## 2.2.1 (2025-03-26)

### 问题修复
1. 修复了数据库版本号文本没有更新的问题。

### 功能更新
1. 追加了7.2版本追加的各个道具名称与描述的中文翻译。
2. 追加和修订了部分物品的笔记 (仅在界面语言设置为简体中文时显示)。

## 2.2.0 (2025-03-26)

### 重要变更
1. 国际服数据库更新至7.2。

### 问题修复
1. 修复了推荐流程(弹窗)中物品信息图标的复制功能没有正常工作的问题。
2. 修正了移动端工作流中“流程”区域的显示效果。

### 功能更新
1. 工作流中的“流程”现在也会自动记忆。折叠流程分组和标记筹备项为已完成后，即使重启页面或是切换到其他工作流，这些更改也将保留。
2. 推荐流程中的兑换道具栏目现在会显示剩余材料所需的点数。
3. 为电脑端工作流的“流程”区域追加了浮动按钮，以便快捷控制各流程的展开折叠或是进入功能设置。
4. 现可设置让成本/收益分析的表格中显示物品详情。

## 2.1.10 (2025-03-11)

### 重要变更
1. 国服数据库更新至7.11，国际服数据库更新至7.18。
    ※ 仅为信息更新，没有实际更改。

### 问题修复
1. 修复了专业版制作报表中物品信息图标的复制功能没有正常工作的问题。
2. 修复了旧版本制作报表中物品按钮的复制功能没有正常工作的问题。

### 功能更新
1. 工作流现已可进行成本/收益分析。
2. 电脑端的工作流现在可以将“挑选物品”面板向左折叠，从而给右侧统计区域腾出更多空间。
3. 根据特设站公布的信息，更新了7.2版本的logo与背景图。
    ※ 相关数据仍须等待版本正式上线后才能更新。
4. 优化了“更新日志”弹窗的显示效果。

## 2.1.9 (2025-02-27)

### 问题修复
1. 修复工作流的报表无法将“已有”数量设置为「总需数量×0.5+1」至「总需数量-1」区间值的问题。 (Found by Contt99)
2. 修正了工作流各区域的高度，以适配不同的显示设备。
3. 修复部分可滚动组件没有展示滚动条的问题。

### 功能更新
1. 向工作流界面追加了“管理已有工作流”的按钮和弹窗，通过此弹窗可以重命名和删除已有的工作流了。
2. 现可在食药计算器页面中将已选的食物/爆发药添加到工作流。
3. 移动端现在也可以使用工作流功能。
4. 向可制作物品的悬浮窗的“制作”模块追加了“模拟制作”按钮，点击即可快速打开BestCraft进行模拟。
5. 为食药计算器、采集时钟和工作流页面添加了返回顶部按钮。
6. 优化了“导出闹钟宏”功能在电脑端的显示效果。

## 2.1.8 (2025-02-18)

### 重要变更
1. 国服数据库更新至7.1。
2. 追加了“工作流”功能。

### 功能更新
1. 现在可以长按标题来拖拽弹窗。
2. 在选择版本模块增加了一个信息图标，提示各个版本的更新规律。
3. 现在电脑端浏览器也可以用新窗口打开采集时钟和食药计算器。
4. 调整了客户端检查更新弹窗的加速服务列表，并且允许查看服务站和自定义加速服务。此外，优化了弹窗内容在深色模式下的显示效果。
5. “偏好设置”的设置项“材料清单格式”现在还可以设置为“现代 (物品名称 x数量)”。

## 2.1.7 (2025-01-22)

### 重要变更
1. 重做了“偏好设置”功能，将原有的“偏好设置”、“功能设置”和“关于本作”整合入同一个窗口。此外，还实装了以下更改：
    * 现在可以点击窗口右上角的按钮来导入/导出设置内容。
    * 现在仅会在修改了特定设置项后才询问或执行页面刷新。需要刷新才能生效的设置项将在右侧标注警告图标。
    * 追加了以下设置选项：[通用]保存设置后自动刷新; [物品价格]在物品悬浮窗中显示、在物品悬浮窗中显示的类型; [推荐流程]合并采集物品。
    * 重做了“关于本作”的界面。 
    ※ 移动端因屏幕尺寸限制，将继续沿用旧版设计。
2. 现在可以在物品悬浮窗中查看和手动刷新价格信息。
    ※ 需要在物品价格设置中启用“在物品悬浮窗中显示”。
    ※ 不可交易的物品不会展示价格模块，没有HQ品质的物品不会展示HQ价格信息。
3. 现在食药计算器也可以使用“成本/收益预估”功能。

### 问题修复
1. 没找到BUG，太棒了

### 功能更新
1. 可采集道具的物品悬浮窗现在还会展示采集点等级和采集所需传承录的信息。
2. “成本/收益预估”弹窗中的表格现在会将未获取到价格的物品价格显示为???，而非0。此外，追加了相应的提示文本。
3. 为部分只展示图标而没有名称的物品追加了Tooltip，以提示其物品名称。
4. 压缩了部分解包数据文件的体积，以降低更新时需要下载的更新包体积、初次访问页面的加载时长和托管服务器的带宽压力。
5. 优化了制作报表中物品制作等级信息在特定场合的显示效果。

## 2.1.6 (2024-12-26)

### 问题修复
1. 修复新用户在特定场景下会遇到页面崩溃的问题。
2. 修复功能设置->制作报表->使用简洁模式展示物品设置项在特定场合无法正确工作的问题。

### 功能更新
1. 功能设置->推荐流程追加了设置项“制作物品排序规则”。
    ※ 设置为“制作笔记顺序”，即可让推荐流程中的可制作道具按照游戏内制作笔记的顺序排布。
2. 现在“采集时钟”的“排序依据”还可以设置为“剩余时间”。
    ※ 剩余时间指：现可采集物品的剩余可采集时间 / 未可采集物品距离变得可采集的剩余时间。

## 2.1.5 (2024-12-23)

### 里程碑
1. 至此，第一代 HqHelper 的所有主要功能均已迁移。

### 重要变更
1. 追加了2.0/3.0/4.0/5.0/6.0野外和各版本主城的地图/传送点数据。
    现在旧版本的采集道具也可以查看地图与推荐传送点。
2. 追加了从已导出 Excel 中导入已选部件的功能。由此，原先的“导出Excel”按钮调整为“导入/导出”。
    现在导出前可以自定义导出文件的名称，并且可以导出成本/收益分析。
3. 追加了功能设置窗口，整合各个页面功能的设置选项。除了可以在顶部菜单统一配置之外，也可以点击部分弹窗右上角的设置按钮来单独配置该弹窗的设置项。
    ※ 伴随这一改动，部分弹窗的快捷操作有所精简。 ※ “偏好设置”中的部分设置项已经迁移至功能设置中。
4. 国际服数据库更新至7.15。
    ※ 仅为信息更新，没有实际更改。

### 问题修复
1. 彻底修复了部分物品悬浮窗内的文本无法框选的问题。

### 功能更新
1. 现在可以将物品价格的缓存有效期设置为1小时。
2. 现在客户端和HqHelper同时有新版本可供更新时只会弹窗提醒一次，而非各提醒一次。
3. 推荐攻略增加了全战职开荒/毕业配装 (仅在界面语言设置为简体中文时显示)。
4. 优化了一部分界面文本的表述。

## 2.1.4 (2024-12-04)

### 重要变更
1. 为“选择职业”区域的各个职业按钮追加了右键菜单功能。
在右键菜单中可以快速增加/减少选定职业的已选部件，打开此职业在配装模拟器中的页面，甚至查看推荐配装。
2. 为食药计算器的“查看统计”实装了下述改动：
* 增加了“其他素材统计”栏目，统计未被其他分组归类的道具；* 将灵砂统计合并入限时采集品统计，并调整了各栏目的排列顺序；* “采集统计不显示半成品需要的素材”选项修改为“只显示直接制作素材”。勾选此项时，除“半成品统计”之外的所有栏目都将不再统计食药半成品所需要的素材。

### 问题修复
1. 修复了采集时钟的提醒方式设置为“提示音”时，程序会在没有订阅道具可采集的时间响铃的问题。
2. 修复了将物品语言设定为中文/日文时，钓鱼采集道具悬浮窗中的“在饥饿的猫中打开”组装出的外部链接可能无法查询到指定道具的问题。
3. 修复了框选物品悬浮窗中的食物/装备属性复制时，复制内容中属性名称与数额间会有多余换行的问题。
4. 修复了物品右键菜单可以被部分不可操作的物品按钮激活的问题。
5. 修正了特定场景下物品悬浮窗中食物/装备属性的显示效果。
6. 修正了点数按钮在显示多种点数时的显示效果。

### 功能更新
1. 优化了物品按钮的右键菜单中关于复制道具名的排布逻辑，点击“复制道具名”选项会直接复制当前偏好设置下的物品语言，其他语言的物品名则放置在二级菜单。此外，现在还可以复制道具检索宏。
2. “偏好设置”的设置项“材料清单格式”现在还可以设置为“紧凑 (物品名称x数量)”。
3. 优化了页面滚动条的显示效果。
4. 追加了部分鱼类的雇员探险笔记 (仅在界面语言设置为简体中文时显示)。

## 2.1.2 (2024-11-27)

### 重要变更
1. 国际服数据库更新至7.11。
    ※ 仅为信息更新，没有实际更改。
2. 实装了“食药计算(新窗口)”功能。
    ※ 仅限v5及更高版本的客户端。

### 问题修复
1. 修复了直接框选物品悬浮窗和推荐流程等区域的部分内容并复制时，复制内容中物品名称与数量间会有多余换行的问题。
    ※ 伴随这一改动，子物品名称过长的场合，悬浮窗的显示效果有所变化。
2. 修复了导出闹钟宏生成的宏内容在国服客户端无法执行的问题。
3. 修复了导出闹钟宏在通过点击复制按钮复制宏时，在游戏内粘贴无法粘贴全部内容的问题。
4. 修复了部分提示会在不正确的场合展示的问题。

### 功能更新
1. 优化了采集时钟中的快速操作选项在移动端的显示效果。
2. 追加了爆发药适用职业的笔记 (仅在界面语言设置为简体中文时显示)。
3. 网页版/PWA应用/客户端的主页面标题从“7.0 HQ Helper”变更为“7.x HQ Helper”。

## 2.1.1 (2024-11-20)

### 重要变更
1. 向采集时钟追加了“导出闹钟宏”功能。
2. 向专业版制作报表追加了“清单”功能。

### 问题修复
1. 修复了统计区域的限时采集品未计入7.1新增道具的问题。
2. 修正了点数按钮在内容过长时的显示效果。
3. 修正了一部分地图数据。
4. 修订了一部分道具译名。

### 功能更新
1. 更新了桌面端顶部菜单项“参考资料”的推荐攻略/工具列表 (仅在界面语言设置为简体中文时显示)。
2. 在推荐流程中，被标记为已完成的物品将自动隐藏采集详情。
3. 现在因切换版本等情况导致所选职业在当前版本没有可以添加的装备时，程序会在选择职业区域给出提示。

## 2.1.0 (2024-11-16)

### 重要变更
1. 国际服数据库更新至7.1。

### 问题修复
1. 修复了部分国服7.05已经实装的道具仍会显示物品名为暂译的问题。
2. 修复了“选择职业”区域按钮的部分区域不会触发点击事件的问题。

### 功能更新
1. 在“推荐流程”中的各个物品前增加了复选框，将其勾选可以临时将物品标记为已完成。
    当某一组物品全部被标记为已完成时，这一组会自动折叠。
    ※ 推荐流程中的标记不会影响制作报表中记录的已有数量。关闭推荐流程时会自动重置完成状态。
2. 调整了竖向使用客户端时，顶部菜单栏的显示效果。

## 2.0.13 (2024-11-11)

### 重要变更
1. 国服数据库更新至7.05。
2. 采集时钟现在还可以将“提醒方式”设置为“提示音”。
    ※ 初次设置时会播放一次。
    (C) SQUARE ENIX Fan Kit

### 功能更新
1. 向桌面端顶部菜单项“关于”的下属选项中追加了“常见问题” (仅在界面语言设置为简体中文时显示)。
2. 现在可制作物品的悬浮窗内还会展示配方的耐久/难度/品质信息。
    伴随这一改动，悬浮窗内的配方信息顺序有所调整。
3. 现在右键有制作配方的物品按钮时，可以在菜单中选择“在BestCraft中模拟制作”和“在TeamCraft中模拟制作”。

## 2.0.12 (2024-11-01)

### 重要变更
1. 向采集时钟追加了订阅/提醒功能。
    现在可以订阅采集品，被订阅的采集品将在“已订阅”中集中显示。此外，在“配置时钟”区域将“提醒方式”设置为“系统通知”后，程序会在采集品可以采集时发送系统级提示。
    ※ 可能无法在部分浏览器/设备上正常工作。程序会在您调整“提醒方式”时检查权限并弹窗提醒。
    ※ HqHelper处于后台时，可能会被浏览器限制性能，导致您收到通知的时间比订阅道具的采集开始时间稍晚。
    ※ 游戏全屏运行时可能会自动进入勿扰模式、屏蔽所有通知。如果希望在游玩游戏时正常接收到通知，则需要关闭自动勿扰模式或是赋予HqHelper白名单权限。
    遇到问题时，请先尝试在常见问题文档中寻找解决方案。
2. 进一步细化了推荐流程的采集品分组、优化了组内排序逻辑，并可以显示采集详情。
    现在会进一步区分限时与非限时的采集品。同一分组内，非限时采集品会按照采集的地图排序，限时采集品会按照开始时间排序。
    此外还增加了“显示采集详情”选项，启用后会显示采集品的额外信息，包括限时信息和采集位置信息。

### 问题修复
1. 修复了移动端无法在偏好设置中启用“使用旧版本制作报表”的问题。

### 功能更新
1. “采集时钟”实装了下述更改：
    ① 进一步优化了采集时钟选项卡区域的辨识度；
    ② 现在物品采集位置的坐标统一精确到1位小数；
    ③ 优化了一部分UI细节。
2. 现在专业版制作报表的数量输入框可以在其值为0时点击减号来将这个道具直接标记为已筹备完成(类似游戏中数量输入框的逻辑)。
3. “偏好设置”的“增强”选项卡中追加了设置项“材料清单格式”。
    现在还可以选择以Teamcraft格式(如："3x 黄金灵砂")展示材料清单。 (by etnAtker)
4. 追加了货币类道具和7.05能工巧匠秘籍的笔记。可以在对应道具的物品按钮悬浮窗中查看 (仅在界面语言设置为简体中文时显示)。
5. 桌面端左上返回按钮的逻辑有所变更：现在总是会返回首页，而非上一个访问的页面。
6. 更新了桌面端顶部菜单项“参考资料”的推荐攻略/工具列表 (仅在界面语言设置为简体中文时显示)。
7. 优化了客户端内置更新功能的逻辑。

## 2.0.11 (2024-10-27)

### 重要变更
1. 向专业版制作报表追加了“推荐流程”功能。
    推荐流程会自动根据报表中填写的已有素材计算仍需准备的素材，并按采集/制作职业、类型等归类，最终总结出素材→半成品→成品的有序步骤。

### 问题修复
1. 修复了专业版制作报表在特定场合会将不再需要筹备的道具数量标记为NaN的问题。
2. 修复了部分实际上无法通过捕鱼人采集获取的道具会在物品按钮悬浮窗中显示采集提示的问题。

### 功能更新
1. 优化了专业版制作报表中物品信息的显示逻辑。
2. 新增了设置项“点击物品信息图标时的行为”。
3. 优化了应用标题栏和各个素材统计区域标题/提示图标的显示效果。

## 2.0.10 (2024-10-24)

### 重要变更
1. 实装了专业版的“制作报表”。
    专业版制作报表为每个物品提供更详细的信息，包括制作职业、配方等级、采集职业、来源、兑换总价等。
    不仅如此，专业版制作报表还允许你填写已经准备的素材数量，并根据输入值动态计算还需要筹备的素材。点击主界面或食药计算器的“查看报表”按钮，即可查看专业版制作报表。
    ※ 如果还是更喜欢旧版本的制作报表，可以在“偏好设置”的“增强”选项卡中勾选“使用旧版本制作报表”。

### 问题修复
1. 修复了采集时钟会将采集时间刚好结束的采集品判断为现可采集的问题。
2. 修正了部分国际化翻译。

### 功能更新
1. 追加了灵砂鱼的采集信息。
    相关资料来自7.0灵砂鱼和工票鱼信息整理和钓法 by plas_g ※ 仅限在“界面语言”设置为简体中文时可以查看。
2. 新增了设置项“手动控制二级悬浮窗”。
3. 根据特设站公布的信息，更新了7.1版本的logo与背景图。
    ※ 相关数据仍须等待版本正式上线后才能更新。
4. 优化了选择版本区域按钮文字的显示效果。

## 2.0.9 (2024-10-22)

### 重要变更
1. 国服数据库更新至7.01。

### 功能更新
1. 现在可以在“偏好设置”的“外观”选项卡中调整程序/网站使用的字体及字体大小。
2. 现在“采集时钟”还会在当前可采集道具的采集卡片中显示现实世界的剩余时间。

## 2.0.8 (2024-10-18)

### 重要变更
1. 实装了7.0的采集地图。
    现在物品按钮悬浮窗和采集时钟等区域的采集位置右侧将显示地图按钮。
    将光标悬停在地图按钮上，即可查看采集位置的示意图和距离采集位置最近的以太之光传送点名称。
    出于页面和更新包大小的考虑，地图文件经过较为严重的压缩。如果希望查看更高清的地图，可以在地图按钮悬浮窗中点击“在FFCAFE互动地图中打开”来跳转到FFCAFE提供的互动地图页面。 
    ※ 仅实装了7.0的六张野外地图，因此旧版本的可采集道具不会适用上述更改。

### 问题修复
1. 修复了网页端“成本/收益预估”中物品信息图标右键菜单的复制功能没有正确工作的问题。
2. 修正了部分国际化翻译。

### 功能更新
1. “采集时钟”实装了下述更改：
    ① 道具分组逻辑有所变更。现在7.0灵砂精选道具会和7.0传承录星级采集品区分开；
    ② 采集品卡片中增加了地图按钮和推荐传送点(距离采集位置最近的以太之光名称)；
    ③ 现在时钟的配置区域可以折叠；
    ④ 增加了“展示采集地图”配置项，开启后可以在采集品卡片中直接展示地图；
    ⑤ 增加了“快速操作”配置项，可以快速批量收藏或取消收藏整个分组的采集品；
    ⑥ “收藏”选项卡更名为“已收藏”；
    ⑦ 调整了部分界面元素，提升了选项卡区域的辨识度。
2. “成本/收益预估”的“物品价格类型”现在还可以设置为“近期成交价格”、“当前寄售最低价”或“当前寄售平均价”。
    可以在 “偏好设置”→“特殊”→“物品价格类型” 设置和查看详细说明。 ※ 由于进行了数据类型调整，旧版本获取到的物品价格缓存在更新后需要重新获取。
3. 现在物品按钮悬浮窗的精选栏目除了会展示“可以通过什么道具精选出此物品”还会显示“精选此物品有可能获得什么道具(限灵砂)”。
    ※ 为了避免物品按钮悬浮窗的无限跳转，后者不会展示可以打开悬浮窗的信息图标。

## 2.0.7 (2024-10-14)

### 重要变更
1. 实装了“成本/收益预估”功能。
    ※ 需要在“偏好设置”的“特殊”选项卡中进行设置。

### 问题修复
1. 修复了右键物品按钮时，弹出菜单对应的物品不正确的问题。
2. 修复了“食药计算器”的输入框在特定尺寸显示器上可能溢出容器的问题
3. 修正了部分物品按钮悬浮窗在移动端的显示效果。

### 功能更新
1. 为“采集时钟”添加了排序、将现可采集的物品置顶和禁用物品按钮悬浮窗的功能。
2. 现在点数统计的兑换道具顺序与兑换商店的顺序保持一致。
3. 根据国服目前的文本更新了部分7.05版本道具的中文暂译。
4. 现在“导出Excel”还会同时导出灵砂统计。
5. 优化了“食药计算器”中“挑选食药”的显示效果。
6. 优化了部分国际化翻译。

## 2.0.6 (2024-10-09)

### 重要变更
1. 实装了“导出Excel”功能。
    在主界面选定装备之后，点击“查看统计”右侧的“导出Excel”按钮，即可将统计导出成Excel文件。

### 问题修复
1. 修复了网页端“查看报表”中物品按钮的复制功能没有正确工作的问题。
2. 修复了初次打开页面时“选择部件”会意外消失的问题。
3. 修复了界面语言设置为日语/英语时，更新日志的部分更新项会对只有一条的更新组显示序号的问题。

### 功能更新
1. 符合条件的物品按钮现在会在物品名前显示对应的生产/采集职业图标。
    ※ 伴随这一改动，“偏好设置”的“外观”选项卡增加了“隐藏物品按钮的职业图标”设置项。
2. 现在主界面的点数统计还能统计双色宝石兑换物。可以在点数按钮的悬浮窗内控制开关。
3. 现在食药计算器也可以使用“查看报表”功能。
4. 现在物品按钮悬浮窗中的子物品也可以通过右键蓝色信息图标的方式展开操作菜单。
    ※ 此功能暂不支持移动端。
5. 调整了各个素材统计区域的标题文本，并添加了提示图标和提示语。
6. 优化了“查看统计”中“灵砂统计”的显示效果。
7. 物品按钮的右键菜单现在还可以选择“在GamerEscape中打开”。
8. 现在移动端顶部菜单会在特定场合显示“返回首页”按钮。
9. 优化了部分国际化翻译。

## 2.0.5 (2024-09-29)

### 问题修复
1. 修正地名与物品类型的中文文本未更新7.0国服译名的问题。
2. 修复客户端在更新HqHelper版本后可能无法通过拖拽顶部区域移动窗口位置的问题。

### 功能更新
1. 现在“选择部件”区域的部件图标悬浮窗还会显示已选职业在此部件上对应的装备道具信息。

## 2.0.4 (2024-09-26)

### 重要变更
1. 国服数据库更新至7.0。
2. 压缩了部分内置图片的尺寸，清理了一部分无用代码，从而大幅度地降低更新时需要下载的更新包体积、初次访问页面的加载时长和托管服务器的带宽压力。

### 问题修复
1. 修复了界面语言设置为日语/英语时，部分应当没有内容的区域可能出现无意义数字的问题。

### 功能更新
1. 增加了“参考资料”菜单项 (仅在界面语言设置为简体中文的电脑上会显示)。
2. 物品按钮悬浮窗现在还会显示装备类道具的属性。
3. 优化了“”界面物品按钮悬浮窗的显示效果。
4. 客户端现在在下载HqHelper更新时会显示下载进度和速度 (仅限v3及更高版本的客户端)。
5. 调整了客户端在检查更新时可以选择的加速服务列表。
6. 优化了部分国际化翻译。

## 2.0.3 (2024-09-17)

### 问题修复
1. 修复了“采集时钟”中，“收藏”按钮在移动端的高度不正常的问题。
2. 修复了“更新日志”中部分文本未正确适配国际化翻译的问题。
3. 修复了界面语言设置为日语/英语时，“更新日志”中的更新项序号可能不连贯的问题。

### 功能更新
1. 调整了移动端顶部菜单按钮的顺序。
2. 现在“采集时钟”中的“收藏”按钮在移动端不再会弹出提示悬浮窗。
3. 优化了部分国际化翻译。

## 2.0.2 (2024-09-11)

### 重要变更
1. 实装了“采集时钟”功能。
2. 实装了“更新日志”功能。

### 问题修复
1. 修复了自动更新提示不会展示最新版本版本号的问题。
2. 修复了客户端的安装更新按钮在已是最新版本时仍旧可以点击的问题。
3. 修复了启用“禁用工作状态记忆”后，食药计算器的工作状态缓存不会被清除的问题。
4. 修复了移动端点击空白区域关闭“选择部件”栏目中当前[主副手/防具/首饰]的悬浮窗后，无法正常再次打开该悬浮窗的问题。
5. 修正了部分道具的中文译名。

### 功能更新
1. 现在可以在“偏好设置”中自定义点击物品按钮时的行为。
2. 重制了移动端“已选部件”弹窗的显示效果。
3. 根据国服7.0特设站公布的新消息更新了职业名。
4. 优化了部分场景下物品按钮悬浮窗的显示效果。
5. 更新了“关于本作”中创作者的信息。

## 2.0.0 (2024-09-01)

### 里程碑
1. HqHelper正式发布。
