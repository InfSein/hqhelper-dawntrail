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
          group_name: t('日语'),
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
        }
      ]
    }
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