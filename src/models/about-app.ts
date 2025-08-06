import { computed } from "vue"

export interface StaffMember {
  name: string
  avatar_url: string
  desc: string
  introductions: string[]
  pages: {
    name: string
    url: string
  }[]
  donate_info?: DonateInfo
}
interface DonateInfo {
  self?: boolean
  donate_desc: string
  donate_ways: DonateWay[]
}
interface DonateWay {
  type: "qq" | "afd"
  data_type: "url" | "qrcode"
  data: string
}

export const createStaffMember = (
  name: string,
  avatar_url: string,
  desc: string,
  introductions: string[],
  pages: { name: string; url: string }[],
  donate_info?: DonateInfo,
) : StaffMember => {
  return {
    name,
    avatar_url,
    desc,
    introductions,
    pages,
    donate_info,
  }
}

export const getStaffMebers = (
  t: (message: string, args?: any) => string
) => {
  const members = computed(() => {
    return {
      infsein: createStaffMember(
        "InfSein",
        "./image/staff/all-infsein.jpg",
        t('about_app.staff.jobs.infsein'),
        ["我问遍了整个猫区，他们都说我是最帅的肥"],
        [{ name: "Github", url: "https://github.com/InfSein" }],
        {
          self: true,
          donate_desc: t('donate_us.final_confirm.desc.desc_3'),
          donate_ways: [
            { type: 'qq', data_type: 'qrcode', data: 'https://i.qianbao.qq.com/wallet/sqrcode.htm?m=tenpay&f=wallet&a=1&ac=CAEQlJC58QoYw9aqoAZCIDNmNDlkNDI3ZmI2ZjY2Yjg2ZGJmNGQ2YTk2MjA5ZDFl_xxx_sign&u=2922268692&n=float' },
            { type: 'afd', data_type: 'url', data: 'https://afdian.com/a/infseins' },
          ]
        },
      ),
      nbb: createStaffMember(
        "N.B.B",
        "https://avatars.githubusercontent.com/u/7787811?v=4",
        t('about_app.staff.jobs.nbb'),
        ["画饼砖家"],
        [{ name: "nbbjack.com", url: "https://nbbjack.com/" }],
        {
          donate_desc: t('donate_us.final_confirm.desc.desc_4'),
          donate_ways: [
            { type: 'afd', data_type: 'url', data: 'https://afdian.com/a/nbb-box' },
          ]
        },
      ),
      yakita: createStaffMember(
        "夜北Yakita",
        "./image/staff/lt-yakita.jpg",
        t('about_app.staff.jobs.yakita'),
        ["简直是世间精品库啵"],
        [
          { name: "BiliLive", url: "https://b23.tv/IwuuPBI" },
          { name: "Weibo", url: "https://weibo.com/n/%E5%A4%9C%E5%8C%97yakita" }
        ]
      ),
      kimuchi: createStaffMember(
        "Kim",
        "https://avatars.githubusercontent.com/u/44747407?v=4",
        t('about_app.staff.jobs.kim'),
        [],
        [{ name: "Github", url: "https://github.com/kimuchidev" }]
      ),
      wcy: createStaffMember(
        "joj",
        "./image/staff/client-wcy.jpg",
        t('about_app.staff.jobs.wcy'),
        ["在线求职"],
        [{ name: "Github", url: "https://github.com/wanchenyang521" }]
      ),
      etnatker: createStaffMember(
        "etnAtker",
        "https://avatars.githubusercontent.com/u/20952240?v=4",
        t('about_app.staff.jobs.etnatker'),
        [],
        [{ name: "Github", url: "https://github.com/etnAtker" }]
      ),
    }
  })
  return members
}