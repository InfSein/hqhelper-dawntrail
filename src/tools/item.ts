export interface CalculatedItem {
  /** 物品ID */
  id: number
  /** 需要的数量 */
  need: number
  /** 物品图标ID */
  icon: number
  /** 物品名称组，长度必定为3，分别为日语-英文-中文；中文可能是空字符串 */
  name: string[]
  /** 物品描述组，长度必定为3，分别为日语-英文-中文；中文可能是空字符串 */
  desc: string[]
  /** 物品的UI组 */
  uc: number
  // * 还有一些暂时不知道什么作用的
  pc: number
  mkc: number
  rid: string[]
}
const phItem = {
  id: 0,
  need: 0,
  icon: -1,
  name: ['','',''],
  lang: ['','',''], // ? 物品表中的物品名字段叫lang，而计算出来的结构体叫name
  desc: ['','',''],
  uc: -1,
  pc: -1,
  mkc: -1,
  rid: []
}

import XivItems from '@/assets/data/unpacks/item.json'
import XivItemTypes from '@/assets/data/xiv-item-types.json'
import XivItemNameZHTemp from '@/assets/data/translations/xiv-item-names.json'
import XivItemDescZHTemp from '@/assets/data/translations/xiv-item-descriptions.json'
import { deepCopy } from '.'

export interface ItemInfo {
  id: number
  amount: number
  patch: string
  nameJA: string
  nameEN: string
  nameZH: string
  // * icon: 道具图标。需要注意hqIcon指向的文件可能不存在
  iconUrl: string
  hqIconUrl: string
  // * desc: 游戏内的道具描述文本
  descJA: string
  descEN: string
  descZH: string
  // * uiType: 游戏内道具描述弹窗的类型，如`触媒`/`灵魂水晶`/`腿部防具`等
  uiTypeNameJA: string
  uiTypeNameEN: string
  uiTypeNameZH: string
  uiTypeIconUrl: string
  /** 是否使用了中文暂译 */
  usedZHTemp?: boolean
}

/**
 * 获取道具信息
 * @param item 物品ID或是`nbb-cal`传入的物品信息
 * @returns 处理后的道具信息
 */
export const getItemInfo = (item: number | CalculatedItem) => {
  // * 尝试从items表中获取物品完整信息
  let itemID = 0, itemAmount = 0
  if (typeof item === 'number') {
    itemID = item
  } else {
    itemID = item.id
    itemAmount = item.need
  }

  let _item : any
  if (!itemID) {
    _item = deepCopy(phItem)
  } else {
    const itemsMap = XivItems as any
    if (!itemsMap?.[itemID]) {
      console.log('[开发提示] 此物品在items表中缺失:', item)
    }
    _item = deepCopy(itemsMap?.[itemID] || phItem)
    _item.id = itemID
  }

  // * 组装ItemInfo的基本参数
  const itemInfo = {
    id: _item.id,
    amount: itemAmount
  } as ItemInfo
  if (_item.lang.length !== 3 || _item.desc.length !== 3) {
    console.error('[getItemInfo] 数据不符合规范:', _item)
    return itemInfo
  }
  itemInfo.nameJA = _item.lang[0]
  itemInfo.nameEN = _item.lang[1]
  itemInfo.nameZH = _item.lang[2]
  itemInfo.descJA = _item.desc[0]
  itemInfo.descEN = _item.desc[1]
  itemInfo.descZH = _item.desc[2]
  itemInfo.patch = _item.p

  // * 针对还没有中文名/中文描述的道具，尝试从暂译表中获取暂译
  if (!itemInfo.nameZH) {
    const tempZhMap = XivItemNameZHTemp as any
    if (tempZhMap?.[itemInfo.id]) {
      itemInfo.nameZH = tempZhMap[itemInfo.id]
      itemInfo.usedZHTemp = true
    } else {
      console.log('[开发提示] 此物品需要填写中文暂译:', itemInfo)
    }
  }
  if (!itemInfo.descZH) {
    const tempZhMap = XivItemDescZHTemp as any
    if (tempZhMap?.[itemInfo.id]) {
      itemInfo.descZH = tempZhMap[itemInfo.id]
      itemInfo.usedZHTemp = true
    } else {
      // 物品描述暂译目前还不是必要的
      // console.log('[开发提示] 此物品需要填写中文暂译:', itemInfo)
    }
  }
  
  // * 组装物品图标URL
  itemInfo.iconUrl = getImgCdnUrl(_item.icon)
  itemInfo.hqIconUrl = getImgCdnUrl(_item.icon, true)

  // * 尝试根据道具的UI类型ID获取类型名称和图标URL
  const typeMap = XivItemTypes as any
  if (typeMap?.[_item.uc]) {
    itemInfo.uiTypeNameJA = typeMap[_item.uc].lang[0]
    itemInfo.uiTypeNameEN = typeMap[_item.uc].lang[1]
    itemInfo.uiTypeNameZH = typeMap[_item.uc].lang[2]
    itemInfo.uiTypeIconUrl = getImgCdnUrl(typeMap[_item.uc].icon)
  }

  // * 组装完毕，返回结果
  return itemInfo

  function getImgCdnUrl(iconID: number, isHq = false) {
    const CDN_ICON = 'https://icon.nbbjack.com/'
    const hq = isHq ? 'hq/' : ''
    const icon = iconID.toString().padStart(6, '0')
    return `${CDN_ICON}${icon.substring(0, 3)}000/${hq}${icon}.png`
  }
}
