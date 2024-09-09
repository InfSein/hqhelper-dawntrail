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
    date: '???',
    changes: [
      {
        name: groupName.bugfix,
        changes: []
      }
    ]
  }
]