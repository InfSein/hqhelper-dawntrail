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

export const getChangelogs = (
  t: (message: string, ...args: any[]) => string,
  ui_lang: 'zh' | 'ja' | 'en'
) => {
  const groupName = {
    bugfix: t('问题修复'),
    feature: t('功能更新'),
    breaking: t('重要变更')
  }
  const isZh = ui_lang === 'zh'
  return [
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
            t('修复了初次打开页面时“{f}”会意外消失的问题', {
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
              + t('伴随这一改动，“偏好设置”的“{f1}”选项卡增加了“{f2}”设置项。', {
                f1: t('外观'),
                f2: t('隐藏物品按钮的职业图标')
              }),
            t('现在主界面的点数统计还能统计双色宝石兑换物。可以在点数按钮的悬浮窗内控制开关。'),
            t('现在食药计算器也可以使用“{f}”功能', {
              f: t('查看报表')
            }),
            t('现在物品按钮悬浮窗中的子物品也可以通过右键蓝色信息图标的方式展开操作菜单。')
              + '<br>※ '
              + t('此功能暂不支持移动端。'),
            t('调整了各个素材统计区域的标题文本，并添加了提示图标和提示语。'),
            t('优化了“{f1}”中“{f2}”的显示效果', {
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
          name: groupName.breaking,
          changes: [
            t('HqHelper正式发布。')
          ]
        }
      ]
    }
  ] as PatchNote[]
}