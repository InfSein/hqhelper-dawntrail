import { t } from '@/languages'

export const DataAboutApp : DataAboutApp = {
  staffs: [
    {
      group_name: t('制作人'),
      sub_groups: [
        {
          group_name: t('主要程序开发'),
          members: [
            {
              name: 'InfSein',
              avatar_url: 'https://avatars.githubusercontent.com/u/54071139?v=4',
              introductions: [],
              pages: [
                { name: 'Github', url: 'https://github.com/InfSein' }
              ]
            }
          ]
        },
        {
          group_name: t('核心算法支持'),
          members: [
            {
              name: 'NbbJack',
              avatar_url: 'https://avatars.githubusercontent.com/u/7787811?v=4',
              introductions: [],
              pages: [
                { name: 'Github', url: 'https://github.com/nbbjack' }
              ]
            }
          ]
        }
      ]
    },
    {
      group_name: t('本地化翻译'),
      sub_groups: [
        {
          group_name: t('中文(国际服物品)'),
          members: [
            {
              name: '夜北Yakita',
              avatar_url: './image/staff/lt-yakita.jpg',
              introductions: [],
              pages: [
                { name: 'Weibo', url: 'https://weibo.com/n/%E5%A4%9C%E5%8C%97yakita' }
              ]
            }
          ]
        },
        {
          group_name: t('日语(UI)'),
          members: [
            {
              name: 'Kim',
              avatar_url: 'https://avatars.githubusercontent.com/u/44747407?v=4',
              introductions: [],
              pages: [
                { name: 'Github', url: 'https://github.com/kimuchidev' }
              ]
            },
            {
              name: '夜北Yakita',
              avatar_url: './image/staff/lt-yakita.jpg',
              introductions: [],
              pages: [
                { name: 'Weibo', url: 'https://weibo.com/n/%E5%A4%9C%E5%8C%97yakita' }
              ]
            }
          ]
        }
      ]
    }
  ],
  copyrights: [
    t('本作程序源代码遵循MIT协议开源。'),
    t('本站所引用的《最终幻想XIV》相关资料与图像，其版权均归于SQUARE ENIX所有。'),
    t('本作仅供学习交流使用，不得以任何方式用于商业用途。'),
    t('转载、搬运须注明作者及出处。'),
  ],
  /*a_providers: [
    { name: 'FF-CAFE', page: 'https://www.ffcafe.cn' },
    { name: 'XIVAPI', page: 'https://xivapi.com/' },
    { name: 'universalis API', page: 'https://universalis.app/' }
  ],*/
  sponsors_gen1: [
    '小密峰','宁无恨','四期重建用的翻车鱼','·无言·','漫才',
    'Sui','被joker偷心了','临渊羡鱼','聪明','江月渔火',
    '湿宝'
  ],
  sponsors_gen2: []
}

export interface DataAboutApp {
  staffs: Staff[];
  copyrights: string[];
  sponsors_gen1: string[];
  sponsors_gen2: string[];
}
export interface Staff {
  group_name: string;
  sub_groups: StaffGroup[];
}
export interface StaffGroup {
  group_name: string;
  members: GroupMember[];
}
export interface GroupMember {
  name: string;
  avatar_url: string;
  introductions: string[];
  pages: MemberPage[];
}
export interface MemberPage {
  name: string;
  url: string;
}