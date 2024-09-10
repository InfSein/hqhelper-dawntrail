import { t } from '@/languages'

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

const groupName = {
  bugfix: t('问题修复'),
  feature: t('功能更新'),
  breaking: t('重要变更')
}

export const changelog : PatchNote[] = [
  {
    version: '2.0.1',
    date: '2024-09-11',
    changes: [
      {
        name: groupName.bugfix,
        changes: [
          t('修复了客户端的安装更新按钮在已是最新版本时仍旧可以点击的问题。'),
          t('修正了部分道具的中文译名。')
        ]
      },
      {
        name: groupName.feature,
        changes: [
          t('现在可以在“偏好设置”中自定义点击物品按钮时的行为。'),
          t('重制了移动端“已选部件”弹窗的显示效果。'),
          t('“更新日志”功能现已正式实装。'),
          t('根据国服7.0特设站公布的新消息更新了职业名。'),
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
]