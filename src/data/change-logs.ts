export interface PatchNote {
  /**
   * 版本号
   */
  version: string;
  /**
   * 发布日期
   */
  date: string;
  /**
   * 改动内容
   * * `key`: 改动类型
   * * `value`: 改动内容
   */
  changes: PatchChangeGroup[];
  /**
   * 是否为重要更新
   */
  important?: boolean;
}
export interface PatchChangeGroup {
  name: string;
  changes: string[];
}

/*
    {
      version: '2.1.7',
      date: '2025-01-24',
      changes: [
        {
          name: groupName.breaking,
          changes: [
          ]
        },
        {
          name: groupName.bugfix,
          changes: [
          ]
        },
        {
          name: groupName.feature,
          changes: [
          ]
        }
      ]
    },
 */

import { t } from '@/languages'
const emBlock = '<span style="display:inline-block;width:1em;"></span>'
const tipper = '<br>' +  emBlock + ' ※ '
// const refer = (text: string) => `<span class="font-small" style="font-style: italic;">${text}</span>`
export const getChangelogs = (
  ui_lang: 'zh' | 'ja' | 'en'
) => {
  const groupName = {
    bugfix: t('问题修复'),
    feature: t('功能更新'),
    breaking: t('重要变更'),
    milestone: t('里程碑')
  }
  const isZh = ui_lang === 'zh'
  return [
    {
      version: '2.1.9',
      date: '2025-02-26',
      changes: [
        {
          name: groupName.bugfix,
          changes: [
            t('修复工作流的报表无法将“已有”数量设置为「总需数量×0.5+1」至「总需数量-1」区间值的问题。') + ' <i>(Found by Contt99)</i>',
            t('修正了工作流各区域的高度，以适配不同的显示设备。'),
            t('修复部分可滚动组件没有展示滚动条的问题。'),
          ]
        },
        {
          name: groupName.feature,
          changes: [
            t('向工作流界面追加了“管理已有工作流”的按钮和弹窗，通过此弹窗可以重命名和删除已有的工作流了。'),
            t('现可在食药计算器页面中将已选的食物/爆发药添加到工作流。'),
            t('移动端现在也可以使用工作流功能。'),
            t('向可制作物品的悬浮窗的“制作”模块追加了“模拟制作”按钮，点击即可快速打开BestCraft进行模拟。'),
            t('为食药计算器、采集时钟和工作流页面添加了返回顶部按钮。'),
            t('优化了”{f}”功能在电脑端的显示效果。', t('导出闹钟宏')),
          ]
        }
      ]
    },
    {
      version: '2.1.8',
      date: '2025-02-18',
      changes: [
        {
          name: groupName.breaking,
          changes: [
            t('国服数据库更新至{ver}。', {
              ver: '7.1'
            }),
            t('追加了“{f}”功能。', t('工作流'))
          ]
        },
        {
          name: groupName.feature,
          changes: [
            t('现在可以长按标题来拖拽弹窗。'),
            t('在选择版本模块增加了一个信息图标，提示各个版本的更新规律。'),
            t('现在电脑端浏览器也可以用新窗口打开采集时钟和食药计算器。'),
            t('调整了客户端检查更新弹窗的加速服务列表，并且允许查看服务站和自定义加速服务。此外，优化了弹窗内容在深色模式下的显示效果。'),
            t('“{f1}”的设置项“{f2}”现在还可以设置为“{f3}”。', {
              f1: t('偏好设置'),
              f2: t('材料清单格式'),
              f3: t('现代 (物品名称 x数量)')
            }),
          ]
        }
      ]
    },
    {
      version: '2.1.7',
      date: '2025-01-22',
      changes: [
        {
          name: groupName.breaking,
          changes: [
            t('重做了“{f1}”功能，将原有的“{f1}”、“{f2}”和“{f3}”整合入同一个窗口。此外，还实装了以下更改：', {
              f1: t('偏好设置'), f2: t('功能设置'), f3: t('关于本作')
            })
              + '<br>' + emBlock + '* ' + t('现在可以点击窗口右上角的按钮来导入/导出设置内容。')
              + '<br>' + emBlock + '* ' + t('现在仅会在修改了特定设置项后才询问或执行页面刷新。需要刷新才能生效的设置项将在右侧标注警告图标。')
              + '<br>' + emBlock + '* ' + t('追加了以下设置选项：[通用]{f1}; [物品价格]{f2}、{f3}; [推荐流程]{f4}。', {
                f1: t('保存设置后自动刷新'), f2: t('在物品悬浮窗中显示'), f3: t('在物品悬浮窗中显示的类型'), f4: t('合并采集物品')
              })
              + '<br>' + emBlock + '* ' + t('重做了“{f}”的界面。', t('关于本作'))
              + '<br> ※ ' + t('移动端因屏幕尺寸限制，将继续沿用旧版设计。')
            ,
            t('现在可以在物品悬浮窗中查看和手动刷新价格信息。')
              + tipper + t('需要在物品价格设置中启用“{option}”。', t('在物品悬浮窗中显示'))
              + tipper + t('不可交易的物品不会展示价格模块，没有HQ品质的物品不会展示HQ价格信息。'),
            t('现在食药计算器也可以使用“{f}”功能。', {
              f: t('成本/收益预估')
            })
          ]
        },
        {
          name: groupName.bugfix,
          changes: [
            t('没找到BUG，太棒了')
          ]
        },
        {
          name: groupName.feature,
          changes: [
            t('可采集道具的物品悬浮窗现在还会展示采集点等级和采集所需传承录的信息。'),
            t('“{f}”弹窗中的表格现在会将未获取到价格的物品价格显示为???，而非0。此外，追加了相应的提示文本。', t('成本/收益预估')),
            t('为部分只展示图标而没有名称的物品追加了Tooltip，以提示其物品名称。'),
            t('压缩了部分解包数据文件的体积，以降低更新时需要下载的更新包体积、初次访问页面的加载时长和托管服务器的带宽压力。'),
            t('优化了制作报表中物品制作等级信息在特定场合的显示效果。')
          ]
        }
      ]
    },
    {
      version: '2.1.6',
      date: '2024-12-26',
      changes: [
        {
          name: groupName.bugfix,
          changes: [
            t('修复新用户在特定场景下会遇到页面崩溃的问题。'),
            t('修复功能设置->制作报表->使用简洁模式展示物品设置项在特定场合无法正确工作的问题。'),
          ]
        },
        {
          name: groupName.feature,
          changes: [
            t('功能设置->推荐流程追加了设置项“制作物品排序规则”。')
              + tipper + t('设置为“制作笔记顺序”，即可让推荐流程中的可制作道具按照游戏内制作笔记的顺序排布。'),
            t('现在“采集时钟”的“排序依据”还可以设置为“剩余时间”。')
              + tipper + t('剩余时间指：现可采集物品的剩余可采集时间 / 未可采集物品距离变得可采集的剩余时间。')
          ]
        }
      ]
    },
    {
      version: '2.1.5',
      date: '2024-12-23',
      changes: [
        {
          name: groupName.milestone,
          changes: [
            t('至此，第一代 HqHelper 的所有主要功能均已迁移。')
          ]
        },
        {
          name: groupName.breaking,
          changes: [
            t('追加了2.0/3.0/4.0/5.0/6.0野外和各版本主城的地图/传送点数据。')
              + '<br>' + t('现在旧版本的采集道具也可以查看地图与推荐传送点。'),
            t('追加了从已导出 Excel 中导入已选部件的功能。由此，原先的“导出Excel”按钮调整为“导入/导出”。')
              + '<br>' + t('现在导出前可以自定义导出文件的名称，并且可以导出成本/收益分析。'),
            t('追加了功能设置窗口，整合各个页面功能的设置选项。除了可以在顶部菜单统一配置之外，也可以点击部分弹窗右上角的设置按钮来单独配置该弹窗的设置项。')
              + '<br> ※ ' + t('伴随这一改动，部分弹窗的快捷操作有所精简。')
              + '<br> ※ ' + t('“偏好设置”中的部分设置项已经迁移至功能设置中。'),
            t('国际服数据库更新至{ver}。', {
              ver: '7.15'
            })
              + '<br> ※ ' + t('仅为信息更新，没有实际更改。'),
          ]
        },
        {
          name: groupName.bugfix,
          changes: [
            t('彻底修复了部分物品悬浮窗内的文本无法框选的问题。')
          ]
        },
        {
          name: groupName.feature,
          changes: [
            t('现在可以将物品价格的缓存有效期设置为1小时。'),
            t('现在客户端和HqHelper同时有新版本可供更新时只会弹窗提醒一次，而非各提醒一次。'),
            isZh ? '推荐攻略增加了全战职开荒/毕业配装 (仅在界面语言设置为简体中文时显示)。' : '',
            t('优化了一部分界面文本的表述。')
          ]
        }
      ]
    },
    {
      version: '2.1.4',
      date: '2024-12-04',
      changes: [
        {
          name: groupName.breaking,
          changes: [
            t('为“选择职业”区域的各个职业按钮追加了右键菜单功能。')
              + '<br>' + t('在右键菜单中可以快速增加/减少选定职业的已选部件，打开此职业在配装模拟器中的页面，甚至查看推荐配装。'),
            t('为食药计算器的“查看统计”实装了下述改动：')
              + '<br>' + emBlock + '* ' + t('增加了“{f}”栏目，统计未被其他分组归类的道具；', {
                f: t('其他素材统计')
              })
              + '<br>' + emBlock + '* ' + t('将灵砂统计合并入限时采集品统计，并调整了各栏目的排列顺序；')
              + '<br>' + emBlock + '* ' + t('“{f1}”选项修改为“{f2}”。勾选此项时，除“{f3}”之外的所有栏目都将不再统计食药半成品所需要的素材。', {
                f1: t('采集统计不显示半成品需要的素材'),
                f2: t('只显示直接制作素材'),
                f3: t('半成品统计')
              })
          ]
        },
        {
          name: groupName.bugfix,
          changes: [
            t('修复了采集时钟的提醒方式设置为“提示音”时，程序会在没有订阅道具可采集的时间响铃的问题。'),
            t('修复了将物品语言设定为中文/日文时，钓鱼采集道具悬浮窗中的“{f}”组装出的外部链接可能无法查询到指定道具的问题。', {
              f: t('在饥饿的猫中打开')
            }),
            t('修复了框选物品悬浮窗中的食物/装备属性复制时，复制内容中属性名称与数额间会有多余换行的问题。'),
            t('修复了物品右键菜单可以被部分不可操作的物品按钮激活的问题。'),
            t('修正了特定场景下物品悬浮窗中食物/装备属性的显示效果。'),
            t('修正了点数按钮在显示多种点数时的显示效果。')
          ]
        },
        {
          name: groupName.feature,
          changes: [
            t('优化了物品按钮的右键菜单中关于复制道具名的排布逻辑，点击“复制道具名”选项会直接复制当前偏好设置下的物品语言，其他语言的物品名则放置在二级菜单。此外，现在还可以复制道具检索宏。'),
            t('“{f1}”的设置项“{f2}”现在还可以设置为“{f3}”。', {
              f1: t('偏好设置'),
              f2: t('材料清单格式'),
              f3: t('紧凑 (物品名称x数量)')
            }),
            t('优化了页面滚动条的显示效果。'),
            isZh ? '追加了部分鱼类的雇员探险笔记 (仅在界面语言设置为简体中文时显示)。' : ''
          ]
        }
      ]
    },
    {
      version: '2.1.2',
      date: '2024-11-27',
      changes: [
        {
          name: groupName.breaking,
          changes: [
            t('国际服数据库更新至{ver}。', {
              ver: '7.11'
            })
              + '<br> ※ ' + t('仅为信息更新，没有实际更改。'),
            t('实装了“{f}”功能。', {
              f: t('食药计算(新窗口)')
            })
              + '<br> ※ ' + t('仅限{ver}及更高版本的客户端。', {
                ver: 'v5'
              })
          ]
        },
        {
          name: groupName.bugfix,
          changes: [
            t('修复了直接框选物品悬浮窗和推荐流程等区域的部分内容并复制时，复制内容中物品名称与数量间会有多余换行的问题。')
              + '<br> ※ ' + t('伴随这一改动，子物品名称过长的场合，悬浮窗的显示效果有所变化。'),
            t('修复了导出闹钟宏生成的宏内容在国服客户端无法执行的问题。'),
            t('修复了导出闹钟宏在通过点击复制按钮复制宏时，在游戏内粘贴无法粘贴全部内容的问题。'),
            t('修复了部分提示会在不正确的场合展示的问题。')
          ]
        },
        {
          name: groupName.feature,
          changes: [
            t('优化了{f1}中的{f2}选项在移动端的显示效果。', {
              f1: t('采集时钟'), f2: t('快速操作')
            }),
            isZh ? '追加了爆发药适用职业的笔记 (仅在界面语言设置为简体中文时显示)。' : '',
            t('网页版/PWA应用/客户端的主页面标题从“7.0 HQ Helper”变更为“7.x HQ Helper”。')
          ]
        }
      ]
    },
    {
      version: '2.1.1',
      date: '2024-11-20',
      changes: [
        {
          name: groupName.breaking,
          changes: [
            t('向采集时钟追加了“{f}”功能。', t('导出闹钟宏')),
            t('向专业版制作报表追加了“{f}”功能。', t('清单'))
          ]
        },
        {
          name: groupName.bugfix,
          changes: [
            t('修复了统计区域的限时采集品未计入7.1新增道具的问题。'),
            t('修正了点数按钮在内容过长时的显示效果。'),
            t('修正了一部分地图数据。'),
            isZh ? '修订了一部分道具译名。' : ''
          ]
        },
        {
          name: groupName.feature,
          changes: [
            isZh ? '更新了桌面端顶部菜单项“参考资料”的推荐攻略/工具列表 (仅在界面语言设置为简体中文时显示)。' : '',
            t('在推荐流程中，被标记为已完成的物品将自动隐藏采集详情。'),
            t('现在因切换版本等情况导致所选职业在当前版本没有可以添加的装备时，程序会在选择职业区域给出提示。'),
          ]
        }
      ]
    },
    {
      version: '2.1.0',
      date: '2024-11-16',
      changes: [
        {
          name: groupName.breaking,
          changes: [
            t('国际服数据库更新至{ver}。', {
              ver: '7.1'
            }),
          ]
        },
        {
          name: groupName.bugfix,
          changes: [
            isZh ? '修复了部分国服7.05已经实装的道具仍会显示物品名为暂译的问题。' : '',
            t('修复了“{f}”区域按钮的部分区域不会触发点击事件的问题。', {
              f: t('选择职业')
            })
          ]
        },
        {
          name: groupName.feature,
          changes: [
            t('在“{f}”中的各个物品前增加了复选框，将其勾选可以临时将物品标记为已完成。', t('推荐流程'))
              + '<br>' + t('当某一组物品全部被标记为已完成时，这一组会自动折叠。')
              + '<br> ※ ' + t('{f}中的标记不会影响制作报表中记录的已有数量。关闭{f}时会自动重置完成状态。', {f:t('推荐流程')}),
            t('调整了竖向使用客户端时，顶部菜单栏的显示效果。')
          ]
        }
      ]
    },
    {
      version: '2.0.13',
      date: '2024-11-11',
      changes: [
        {
          name: groupName.breaking,
          changes: [
            t('国服数据库更新至{ver}。', {
              ver: '7.05'
            }),
            t('采集时钟现在还可以将“{f1}”设置为“{f2}”。', {
              f1: t('提醒方式'),
              f2: t('提示音')
            })
              + `<br>${emBlock} ※ ` + t('初次设置时会播放一次。') + `<span style="font-size:12px;">(C) SQUARE ENIX <a target="_blank" href="https://jp.finalfantasyxiv.com/lodestone/special/fankit/smartphone_ringtone/">Fan Kit</a></span>`
          ]
        },
        {
          name: groupName.feature,
          changes: [
            isZh ? '向桌面端顶部菜单项“关于”的下属选项中追加了“常见问题” (仅在界面语言设置为简体中文时显示)。' : '',
            t('现在可制作物品的悬浮窗内还会展示配方的耐久/难度/品质信息。')
              + '<br>' + t('伴随这一改动，悬浮窗内的配方信息顺序有所调整。'),
            t('现在右键有制作配方的物品按钮时，可以在菜单中选择“{f1}”和“{f2}”。', {
              f1: t('在BestCraft中模拟制作'),
              f2: t('在TeamCraft中模拟制作')
            })
          ]
        }
      ]
    },
    {
      version: '2.0.12',
      date: '2024-11-01',
      changes: [
        {
          name: groupName.breaking,
          changes: [
            t('向采集时钟追加了订阅/提醒功能。')
              + '<br>'
              + t('现在可以订阅采集品，被订阅的采集品将在“{f1}”中集中显示。此外，在“{f2}”区域将“{f3}”设置为“{f4}”后，程序会在采集品可以采集时发送系统级提示。', {
                f1: t('已订阅'),
                f2: t('配置时钟'),
                f3: t('提醒方式'),
                f4: t('系统通知')
              })
              + `<br>${emBlock} ※ `
              + t('可能无法在部分浏览器/设备上正常工作。程序会在您调整“{f}”时检查权限并弹窗提醒。', t('提醒方式'))
              + `<br>${emBlock} ※ `
              + t('HqHelper处于后台时，可能会被浏览器限制性能，导致您收到通知的时间比订阅道具的采集开始时间稍晚。')
              + `<br>${emBlock} ※ `
              + t('游戏全屏运行时可能会自动进入勿扰模式、屏蔽所有通知。如果希望在游玩游戏时正常接收到通知，则需要关闭自动勿扰模式或是赋予HqHelper白名单权限。')
              + (isZh ? '<br> 遇到问题时，请先尝试在<a target="_blank" href="https://docs.qq.com/doc/DY3pPZmRGRHpubEFi">常见问题文档</a>中寻找解决方案。' : ''),
            t('进一步细化了推荐流程的采集品分组、优化了组内排序逻辑，并可以显示采集详情。')
              + '<br>'
              + t('现在会进一步区分限时与非限时的采集品。同一分组内，非限时采集品会按照采集的地图排序，限时采集品会按照开始时间排序。')
              + '<br>'
              + t('此外还增加了“{f}”选项，启用后会显示采集品的额外信息，包括限时信息和采集位置信息。', t('显示采集详情')),
          ]
        },
        {
          name: groupName.bugfix,
          changes: [
            t('修复了移动端无法在偏好设置中启用“{f}”的问题。', t('使用旧版本制作报表'))
          ]
        },
        {
          name: groupName.feature,
          changes: [
            t('“{f}”实装了下述更改：', {
              f: t('采集时钟')
            })
              + '<br>' + emBlock
              + t('① 进一步优化了采集时钟选项卡区域的辨识度；')
              + '<br>' + emBlock
              + t('② 现在物品采集位置的坐标统一精确到1位小数；')
              + '<br>' + emBlock
              + t('③ 优化了一部分UI细节。'),
            t('现在专业版制作报表的数量输入框可以在其值为0时点击减号来将这个道具直接标记为已筹备完成(类似游戏中数量输入框的逻辑)。'),
            t('“{f1}”的“{f2}”选项卡中追加了设置项“{f3}”。', {
              f1: t('偏好设置'),
              f2: t('增强'),
              f3: t('材料清单格式')
            })
              + '<br>' + t('现在还可以选择以Teamcraft格式(如："3x 黄金灵砂")展示材料清单。') + ' <i>(by etnAtker)</i>',
            isZh ? '追加了货币类道具和7.05能工巧匠秘籍的笔记。可以在对应道具的物品按钮悬浮窗中查看 (仅在界面语言设置为简体中文时显示)。' : '',
            t('桌面端左上返回按钮的逻辑有所变更：现在总是会返回首页，而非上一个访问的页面。'),
            isZh ? '更新了桌面端顶部菜单项“参考资料”的推荐攻略/工具列表 (仅在界面语言设置为简体中文时显示)。' : '',
            t('优化了客户端内置更新功能的逻辑。'),
          ]
        }
      ]
    },
    {
      version: '2.0.11',
      date: '2024-10-27',
      changes: [
        {
          name: groupName.breaking,
          changes: [
            t('向专业版制作报表追加了“{f}”功能。', {
              f: t('推荐流程')
            })
              + '<br>'
              + t('推荐流程会自动根据报表中填写的已有素材计算仍需准备的素材，并按采集/制作职业、类型等归类，最终总结出素材→半成品→成品的有序步骤。')
          ]
        },
        {
          name: groupName.bugfix,
          changes: [
            t('修复了专业版制作报表在特定场合会将不再需要筹备的道具数量标记为NaN的问题。'),
            t('修复了部分实际上无法通过捕鱼人采集获取的道具会在物品按钮悬浮窗中显示采集提示的问题。'),
          ]
        },
        {
          name: groupName.feature,
          changes: [
            t('优化了专业版制作报表中物品信息的显示逻辑。'),
            t('新增了设置项“{f}”。', t('点击物品信息图标时的行为')),
            t('优化了应用标题栏和各个素材统计区域标题/提示图标的显示效果。')
          ]
        }
      ]
    },
    {
      version: '2.0.10',
      date: '2024-10-24',
      changes: [
        {
          name: groupName.breaking,
          changes: [
            t('实装了专业版的“{f}”。', {
              f: t('制作报表')
            })
              + '<br>'
              + t('专业版制作报表为每个物品提供更详细的信息，包括制作职业、配方等级、采集职业、来源、兑换总价等。')
              + '<br>'
              + t('不仅如此，专业版制作报表还允许你填写已经准备的素材数量，并根据输入值动态计算还需要筹备的素材。')
              + '<br>'
              + t('点击主界面或食药计算器的“{f}”按钮，即可查看专业版制作报表。', t('查看报表'))
              + '<br> ※ '
              + t('如果还是更喜欢旧版本的制作报表，可以在“{f1}”的“{f2}”选项卡中勾选“{f3}”。', {
                f1: t('偏好设置'),
                f2: t('增强'),
                f3: t('使用旧版本制作报表')
              })
          ]
        },
        {
          name: groupName.bugfix,
          changes: [
            t('修复了采集时钟会将采集时间刚好结束的采集品判断为现可采集的问题。'),
            t('修正了部分国际化翻译。')
          ]
        },
        {
          name: groupName.feature,
          changes: [
            isZh
              ? '追加了灵砂鱼的采集信息。<br>相关资料来自<a target="_blank" href="https://bbs.nga.cn/read.php?tid=41277468">7.0灵砂鱼和工票鱼信息整理和钓法 by plas_g</a><br> ※ 仅限在“界面语言”设置为简体中文时可以查看。'
              : '',
            t('新增了设置项“{f}”。', t('手动控制二级悬浮窗')),
            t('根据特设站公布的信息，更新了{v}版本的logo与背景图。', '7.1')
              + '<br> ※ '
              + t('相关数据仍须等待版本正式上线后才能更新。'),
            t('优化了选择版本区域按钮文字的显示效果。')
          ]
        }
      ]
    },
    {
      version: '2.0.9',
      date: '2024-10-22',
      changes: [
        {
          name: groupName.breaking,
          changes: [
            t('国服数据库更新至{ver}。', {
              ver: '7.01'
            })
          ]
        },
        {
          name: groupName.feature,
          changes: [
            t('现在可以在“{f1}”的“{f2}”选项卡中调整程序/网站使用的字体及字体大小。', {
              f1: t('偏好设置'),
              f2: t('外观')
            }),
            t('现在“{f}”还会在当前可采集道具的采集卡片中显示现实世界的剩余时间。', {
              f: t('采集时钟')
            })
          ]
        }
      ]
    },
    {
      version: '2.0.8',
      date: '2024-10-18',
      changes: [
        {
          name: groupName.breaking,
          changes: [
            t('实装了7.0的采集地图。')
              + '<br>'
              + t('现在物品按钮悬浮窗和采集时钟等区域的采集位置右侧将显示地图按钮。将光标悬停在地图按钮上，即可查看采集位置的示意图和距离采集位置最近的以太之光传送点名称。')
              + '<br>'
              + t('出于页面和更新包大小的考虑，地图文件经过较为严重的压缩。如果希望查看更高清的地图，可以在地图按钮悬浮窗中点击“{f}”来跳转到FFCAFE提供的互动地图页面。', {
                f: t('在FFCAFE互动地图中打开')
              })
              + '<br> ※ '
              + t('仅实装了7.0的六张野外地图，因此旧版本的可采集道具不会适用上述更改。')
          ]
        },
        {
          name: groupName.bugfix,
          changes: [
            t('修复了网页端“{f}”中物品信息图标右键菜单的复制功能没有正确工作的问题。', {
              f: t('成本/收益预估')
            }),
            t('修正了部分国际化翻译。')
          ]
        },
        {
          name: groupName.feature,
          changes: [
            t('“{f}”实装了下述更改：', {
              f: t('采集时钟')
            })
              + '<br>' + emBlock
              + t('① 道具分组逻辑有所变更。现在7.0灵砂精选道具会和7.0传承录星级采集品区分开；')
              + '<br>' + emBlock
              + t('② 采集品卡片中增加了地图按钮和推荐传送点(距离采集位置最近的以太之光名称)；')
              + '<br>' + emBlock
              + t('③ 现在时钟的配置区域可以折叠；')
              + '<br>' + emBlock
              + t('④ 增加了“{f}”配置项，开启后可以在采集品卡片中直接展示地图；', t('展示采集地图'))
              + '<br>' + emBlock
              + t('⑤ 增加了“{f}”配置项，可以快速批量收藏或取消收藏整个分组的采集品；', t('快速操作'))
              + '<br>' + emBlock
              + t('⑥ “收藏”选项卡更名为“已收藏”；')
              + '<br>' + emBlock
              + t('⑦ 调整了部分界面元素，提升了选项卡区域的辨识度。')
            ,
            t('“{f1}”的“{f2}”现在还可以设置为“{o1}”、“{o2}”或“{o3}”。', {
              f1: t('成本/收益预估'),
              f2: t('物品价格类型'),
              o1: t('近期成交价格'),
              o2: t('当前寄售最低价'),
              o3: t('当前寄售平均价')
            })
              + '<br>'
              + t('可以在 “{f1}”→“{f2}”→“{f3}” 设置和查看详细说明。', {
                f1: t('偏好设置'),
                f2: t('特殊'),
                f3: t('物品价格类型')
              })
              + '<br> ※ '
              + t('由于进行了数据类型调整，旧版本获取到的物品价格缓存在更新后需要重新获取。')
            ,
            t('现在物品按钮悬浮窗的精选栏目除了会展示“可以通过什么道具精选出此物品”还会显示“精选此物品有可能获得什么道具(限灵砂)”。')
              + '<br> ※ '
              + t('为了避免物品按钮悬浮窗的无限跳转，后者不会展示可以打开悬浮窗的信息图标。')
          ]
        }
      ]
    },
    {
      version: '2.0.7',
      date: '2024-10-14',
      changes: [
        {
          name: groupName.breaking,
          changes: [
            t('实装了“{f}”功能。', {
              f: t('成本/收益预估')
            })
              + '<br>※ '
              + t('需要在“{f1}”的“{f2}”选项卡中进行设置。', {
                f1: t('偏好设置'),
                f2: t('特殊')
              })
          ]
        },
        {
          name: groupName.bugfix,
          changes: [
            t('修复了右键物品按钮时，弹出菜单对应的物品不正确的问题。'),
            t('修复了“{f}”的输入框在特定尺寸显示器上可能溢出容器的问题', {
              f: t('食药计算器')
            }),
            t('修正了部分物品按钮悬浮窗在移动端的显示效果。')
          ]
        },
        {
          name: groupName.feature,
          changes: [
            t('为“{f}”添加了排序、{f1}和{f2}的功能。', {
              f: t('采集时钟'),
              f1: t('将现可采集的物品置顶'),
              f2: t('禁用物品按钮悬浮窗')
            }),
            t('现在点数统计的兑换道具顺序与兑换商店的顺序保持一致。'),
            isZh ? '根据国服目前的文本更新了部分7.05版本道具的中文暂译。' : '',
            t('现在“{f}”还会同时导出灵砂统计。', {
              f: t('导出Excel')
            }),
            t('优化了“{f1}”中“{f2}”的显示效果。', {
              f1: t('食药计算器'),
              f2: t('挑选食药')
            }),
            t('优化了部分国际化翻译。')
          ]
        }
      ]
    },
    {
      version: '2.0.6',
      date: '2024-10-09',
      changes: [
        {
          name: groupName.breaking,
          changes: [
            t('实装了“{f}”功能。', {
              f: t('导出Excel')
            })
              + '<br>'
              + t('在主界面选定装备之后，点击“{f1}”右侧的“{f2}”按钮，即可将统计导出成Excel文件。', {
                f1: t('查看统计'),
                f2: t('导出Excel')
              })
          ]
        },
        {
          name: groupName.bugfix,
          changes: [
            t('修复了网页端“{f}”中物品按钮的复制功能没有正确工作的问题。', {
              f: t('查看报表')
            }),
            t('修复了初次打开页面时“{f}”会意外消失的问题。', {
              f: t('选择部件')
            }),
            t('修复了{lang}设置为日语/英语时，更新日志的部分更新项会对只有一条的更新组显示序号的问题。', {
              lang: t('界面语言')
            })
          ]
        },
        {
          name: groupName.feature,
          changes: [
            t('符合条件的物品按钮现在会在物品名前显示对应的生产/采集职业图标。')
              + '<br>※ '
              + t('伴随这一改动，“{f}”的“{f1}”选项卡增加了“{f2}”设置项。', {
                f: t('偏好设置'),
                f1: t('外观'),
                f2: t('隐藏物品按钮的职业图标')
              }),
            t('现在主界面的点数统计还能统计双色宝石兑换物。可以在点数按钮的悬浮窗内控制开关。'),
            t('现在食药计算器也可以使用“{f}”功能。', {
              f: t('查看报表')
            }),
            t('现在物品按钮悬浮窗中的子物品也可以通过右键蓝色信息图标的方式展开操作菜单。')
              + '<br>※ '
              + t('此功能暂不支持移动端。'),
            t('调整了各个素材统计区域的标题文本，并添加了提示图标和提示语。'),
            t('优化了“{f1}”中“{f2}”的显示效果。', {
              f1: t('查看统计'),
              f2: t('灵砂统计')
            }),
            t('物品按钮的右键菜单现在还可以选择“{f}”。', {
              f: t('在GamerEscape中打开')
            }),
            t('现在移动端顶部菜单会在特定场合显示“{f}”按钮。', {
              f: t('返回首页')
            }),
            t('优化了部分国际化翻译。')
          ]
        }
      ]
    },
    {
      version: '2.0.5',
      date: '2024-09-29',
      changes: [
        {
          name: groupName.bugfix,
          changes: [
            isZh ? '修正地名与物品类型的中文文本未更新7.0国服译名的问题。' : '',
            t('修复客户端在更新HqHelper版本后可能无法通过拖拽顶部区域移动窗口位置的问题。')
          ]
        },
        {
          name: groupName.feature,
          changes: [
            t('现在“{f}”区域的部件图标悬浮窗还会显示已选职业在此部件上对应的装备道具信息。', {
              f: t('选择部件')
            })
          ]
        }
      ]
    },
    {
      version: '2.0.4',
      date: '2024-09-26',
      changes: [
        {
          name: groupName.breaking,
          changes: [
            t('国服数据库更新至{ver}。', {
              ver: '7.0'
            }),
            t('压缩了部分内置图片的尺寸，清理了一部分无用代码，从而大幅度地降低更新时需要下载的更新包体积、初次访问页面的加载时长和托管服务器的带宽压力。'),
          ]
        },
        {
          name: groupName.bugfix,
          changes: [
            t('修复了{lang}设置为日语/英语时，部分应当没有内容的区域可能出现无意义数字的问题。', {
              lang: t('界面语言')
            })
          ]
        },
        {
          name: groupName.feature,
          changes: [
            isZh ? '增加了“参考资料”菜单项 (仅在界面语言设置为简体中文的电脑上会显示)。' : '',
            t('物品按钮悬浮窗现在还会显示装备类道具的属性。'),
            t('优化了“{f}”界面物品按钮悬浮窗的显示效果。', {
              f1: t('制作报表')
            }),
            t('客户端现在在下载HqHelper更新时会显示下载进度和速度 (仅限v3及更高版本的客户端)。'),
            t('调整了客户端在检查更新时可以选择的加速服务列表。'),
            t('优化了部分国际化翻译。')
          ]
        }
      ]
    },
    {
      version: '2.0.3',
      date: '2024-09-17',
      changes: [
        {
          name: groupName.bugfix,
          changes: [
            t('修复了“{f1}”中，“{f2}”按钮在移动端的高度不正常的问题。', {
              f1: t('采集时钟'), f2: t('收藏')
            }),
            t('修复了“{f}”中部分文本未正确适配国际化翻译的问题。', {
              f: t('更新日志')
            }),
            t('修复了{lang}设置为日语/英语时，“{f}”中的更新项序号可能不连贯的问题。', {
              lang: t('界面语言'),
              f: t('更新日志')
            })
          ]
        },
        {
          name: groupName.feature,
          changes: [
            t('调整了移动端顶部菜单按钮的顺序。'),
            t('现在“{f1}”中的“{f2}”按钮在移动端不再会弹出提示悬浮窗。', {
              f1: t('采集时钟'), f2: t('收藏')
            }),
            t('优化了部分国际化翻译。')
          ]
        }
      ]
    },
    {
      version: '2.0.2',
      date: '2024-09-11',
      changes: [
        {
          name: groupName.breaking,
          changes: [
            t('实装了“{f}”功能。', {
              f: t('采集时钟')
            }),
            t('实装了“{f}”功能。', {
              f: t('更新日志')
            }),
          ]
        },
        {
          name: groupName.bugfix,
          changes: [
            t('修复了自动更新提示不会展示最新版本版本号的问题。'),
            t('修复了客户端的安装更新按钮在已是最新版本时仍旧可以点击的问题。'),
            t('修复了启用“禁用工作状态记忆”后，食药计算器的工作状态缓存不会被清除的问题。'),
            t('修复了移动端点击空白区域关闭{}的悬浮窗后，无法正常再次打开该悬浮窗的问题。', t('“选择部件”栏目中当前[主副手/防具/首饰]')),
            isZh ? '修正了部分道具的中文译名。' : ''
          ]
        },
        {
          name: groupName.feature,
          changes: [
            t('现在可以在“偏好设置”中自定义点击物品按钮时的行为。'),
            t('重制了移动端“已选部件”弹窗的显示效果。'),
            isZh ? '根据国服7.0特设站公布的新消息更新了职业名。' : '',
            t('优化了部分场景下物品按钮悬浮窗的显示效果。'),
            t('更新了“关于本作”中创作者的信息。')
          ]
        }
      ]
    },
    {
      version: '2.0.0',
      date: '2024-09-01',
      important: true,
      changes: [
        {
          name: groupName.milestone,
          changes: [
            t('HqHelper正式发布。')
          ]
        }
      ]
    }
  ] as PatchNote[]
}