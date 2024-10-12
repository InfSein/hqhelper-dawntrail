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
import XivRecipes from '@/assets/data/unpacks/recipe.json'
import XivGatheringItems from '@/assets/data/unpacks/gathering-item.json'
import XivGatherTerrory from '@/assets/data/unpacks/territory.json'
import XivPlaceNames from '@/assets/data/unpacks/place-name.json'
import XivPlaceZHTemp from '@/assets/data/translations/xiv-places.json'
import { deepCopy } from '.'
import { useNbbCal } from './use-nbb-cal'

const { getTradeMap, getReduceMap } = useNbbCal()
const tradeMap = getTradeMap()
const reduceMap = getReduceMap()
const gatherMap = XivGatheringItems as Record<number, any>
const territoryMap = XivGatherTerrory as Record<number, number[]>
const placeMap = XivPlaceNames as Record<number, string[]>

export interface ItemInfo {
  id: number
  amount: number
  patch: string
  /** 物品品级 */
  itemLevel: number
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
  uiTypeId: number
  uiTypeNameJA: string
  uiTypeNameEN: string
  uiTypeNameZH: string
  uiTypeIconUrl: string
  /** 是否使用了中文暂译 */
  usedZHTemp?: boolean
  /**
   * 物品特殊属性，常见于成品装备。
   * 
   * 内部数组长度一般为3，分别代表
   * * (index)`0`: 提供的属性的id，可在`src\assets\data\xiv-attributes.json`中检索
   * * (index)`1`: NQ道具提供的属性
   * * (index)`2`: HQ道具提供的属性，如果道具没有HQ这里会是0
   */
  attrsProvided: number[][]
  /**
   * 物品使用后会提供的临时属性，常见于食物爆发药。
   * 
   * 内部数组长度一般为6，分别代表：
   * * (index)`0`: 提供的属性的id，可在`src\assets\data\xiv-attributes.json`中检索
   * * (index)`1`: 是否有NQ/HQ的区分
   * * (index)`2`: NQ道具提供的属性的百分比
   * * (index)`3`: NQ道具提供的属性的最大值
   * * (index)`4`: HQ道具提供的属性的百分比
   * * (index)`5`: HQ道具提供的属性的最大值
   */
  tempAttrsProvided: number[][]
  /** 可以从哪些道具中精选来获得 (如果数组为空则代表此道具不能精选获得) */
  canReduceFrom: number[],
  /** 制作此道具需要的直接道具 (从道具的第一个关联配方中解析) */
  craftRequires: {
    id: number, count: number
  }[],
  craftInfo: {
    /** 制作职业 */
    jobId: number,
    /** 制作等级 */
    craftLevel: number,
    /** 产量 (一次制作可以获得几个成品) */
    yields: number,
    /** 配方星级 (0~5) */
    starCount: number,
    /** 配方品级 */
    rLv: number,
    /** 可否简易制作 (Quick Synthesis) */
    qsable: boolean,
    /** 可否搓出HQ */
    hqable: boolean,
    /** 制作门槛 */
    thresholds: {
      /** 作业精度 */
      craftsmanship: number,
      /** 加工精度 */
      control: number,
    },
    /** 简易制作门槛 */
    qsThresholds: {
      /** 作业精度 */
      craftsmanship: number,
      /** 加工精度 */
      control: number,
    },
    /** 秘籍书的物品ID，有这个属性表明制作该物品需要习得秘籍 */
    masterRecipeId: number
  },
  gatherInfo: {
    jobId: number,
    placeNameZH: string,
    placeNameJA: string,
    placeNameEN: string,
    posX: string,
    posY: string,
    timeLimitInfo: {
      start: string,
      end: string
    }[]
  },
  isFishingItem: boolean,
  tradeInfo: ItemTradeInfo | undefined
}
export interface ItemTradeInfo {
  receiveCount: number,
  costGlobal: {
    costId: number,
    costCount: number
  },
  costCHS: {
    costId: number,
    costCount: number
  }
}

/**
 * 获取道具信息
 * @param item 物品ID或是`nbb-cal`传入的物品信息
 * @returns 处理后的道具信息
 */
export const getItemInfo = (item: number | CalculatedItem) => {
  // * 尝试从items表中获取物品完整信息
  let itemID = 0, itemAmount = 0
  if (typeof item === 'number' || typeof item === 'string') {
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
  itemInfo.itemLevel = _item.ilv
  itemInfo.nameJA = _item.lang[0]
  itemInfo.nameEN = _item.lang[1]
  itemInfo.nameZH = _item.lang[2]
  itemInfo.descJA = _item.desc[0]
  itemInfo.descEN = _item.desc[1]
  itemInfo.descZH = _item.desc[2]
  itemInfo.patch = _item.p || '7.05'

  // * 针对还没有中文名/中文描述的道具，尝试从暂译表中获取暂译
  if (!itemInfo.nameZH) {
    const tempZhMap = XivItemNameZHTemp as any
    if (tempZhMap?.[itemInfo.id]) {
      itemInfo.nameZH = tempZhMap[itemInfo.id]
      itemInfo.usedZHTemp = true
    } else if (itemInfo.nameJA) {
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
  const itemType : number = _item.uc
  if (typeMap?.[itemType]) {
    itemInfo.uiTypeId = itemType
    itemInfo.uiTypeNameJA = typeMap[itemType].lang[0]
    itemInfo.uiTypeNameEN = typeMap[itemType].lang[1]
    itemInfo.uiTypeNameZH = typeMap[itemType].lang[2]
    itemInfo.uiTypeIconUrl = getImgCdnUrl(typeMap[itemType].icon)
  }

  // * 组装物品特殊属性
  itemInfo.attrsProvided = []
  if (_item.spm?.length) {
    const spm = _item.spm as number[][]
    spm.forEach(sp => {
      const attr = []
      attr.push(sp[0])
      attr.push(sp[1])
      const hqAttr = (sp.length > 2 && sp[2]) ? sp[1] + sp[2] : 0
      attr.push(hqAttr)
      itemInfo.attrsProvided.push(attr)
    })
  }
  itemInfo.tempAttrsProvided = _item.actParm

  // * 组装物品精选信息
  itemInfo.canReduceFrom = []
  if (reduceMap[itemID]) {
    itemInfo.canReduceFrom = reduceMap[itemID]
  }

  // * 组装物品采集信息
  const gatherData = gatherMap[itemID]
  if (gatherData) {
    const gatherPointType = gatherData.type
    const gatherJob = gatherPointType <= 1 ? 16 : 17 // * type 0123 分别是割草，伐木，采矿，碎石 (注：好像反了)
    const territoryID = gatherData.territory
    const territoryData = territoryMap[territoryID]
    if (territoryData) {
      const placeID = territoryData[2]
      const gatherPlaceData = placeMap[placeID]
      if (gatherPlaceData) {
        let placeNameZH = gatherPlaceData[2]
        if (!placeNameZH) {
          const tempZhMap = XivPlaceZHTemp as Record<number, string>
          placeNameZH = tempZhMap[placeID] || '未翻译的地点'
        }
        itemInfo.gatherInfo = {
          jobId: gatherJob,
          placeNameZH: placeNameZH,
          placeNameJA: gatherPlaceData[0],
          placeNameEN: gatherPlaceData[1],
          posX: gatherData.coords.x,
          posY: gatherData.coords.y,
          timeLimitInfo: []
        };
        [1,2,3].forEach(i => {
          if (gatherData?.popTime) {
            const start = gatherData.popTime?.['start' + i]
            let end = gatherData.popTime?.['end' + i]
            if (end === '00:00') end = '24:00'
            if (start && end && start !== '--:--' && end !== '--:--') {
              itemInfo.gatherInfo.timeLimitInfo.push({ start, end })
            }
          }
        });
      }
    }
  }

  // * 处理物品是钓鱼采集品的场合
  // 目前也没有数据，给个标识让人去饿猫鱼糕找吧！
  itemInfo.isFishingItem = itemType === 47

  // * 组装物品配方
  itemInfo.craftRequires = []
  if (_item.rids?.length) {
    const recipeID = _item.rids[0]
    const recipe = (XivRecipes as any)[recipeID]
    if (recipe) {
      // console.log('item:', _item, '\nrecipe:', recipe, '\n')
      const items = recipe.m as number[]
      if (items?.length % 2 === 0) {
        for (let ptr = 0; ptr < items.length; ptr += 2) {
          const requiredItemID = items[ptr]
          const requiredItemCount = items[ptr + 1]
          itemInfo.craftRequires.push({
            id: requiredItemID, count: requiredItemCount
          })
        }
      }

      itemInfo.craftInfo = {
        jobId: recipe.job + 8, // 解包配方的jobId是从0开始
        craftLevel: recipe.bp?.[2],
        yields: recipe.bp?.[1],
        starCount: recipe.bp?.[3],
        rLv: recipe.rlv,
        qsable: recipe.qs,
        hqable: recipe.hq,
        thresholds: {
          craftsmanship: recipe.sp2?.[0],
          control: recipe.sp2?.[1]
        },
        qsThresholds: {
          craftsmanship: recipe.sp2?.[2],
          control: recipe.sp2?.[3]
        },
        masterRecipeId: recipe.srb
      }
    }
  }

  // * 组装物品兑换信息
  itemInfo.tradeInfo = tradeMap?.[itemInfo.id]

  // * 组装完毕，返回结果
  return itemInfo

  function getImgCdnUrl(iconID: number, isHq = false) {
    const CDN_ICON = 'https://icon.nbbjack.com/'
    const hq = isHq ? 'hq/' : ''
    const icon = iconID.toString().padStart(6, '0')
    return `${CDN_ICON}${icon.substring(0, 3)}000/${hq}${icon}.png`
  }
}

/**
 * 获取 `查看报表` 需要的数据
 * @param statistics 通过 `nbb-cal` 计算获得的统计数据
 */
export const getStatementData = (statistics: any) => {
  const craftTargets : ItemInfo[] = []
  const materialsLv1 : ItemInfo[] = []
  const materialsLv2 : ItemInfo[] = []
  const materialsLv3 : ItemInfo[] = []
  const materialsLv4 : ItemInfo[] = []
  const materialsLv5 : ItemInfo[] = []
  const materialsLvBase : ItemInfo[] = []
  
  processStatistics(statistics.ls, craftTargets)
  processStatistics(statistics.lv1, materialsLv1)
  processStatistics(statistics.lv2, materialsLv2)
  processStatistics(statistics.lv3, materialsLv3)
  processStatistics(statistics.lv4, materialsLv4)
  processStatistics(statistics.lv5, materialsLv5)
  processStatistics(statistics.lvBase, materialsLvBase)

  return { craftTargets, materialsLv1, materialsLv2, materialsLv3, materialsLv4, materialsLv5, materialsLvBase }

  function processStatistics(_in: any, out: any[]) {
    for (const id in _in) {
      const item = _in[id]
      out.push(getItemInfo(item))
    }
  }
}

import {
  FileCopyOutlined,
  LanguageOutlined,
  OpenInNewFilled
} from '@vicons/material'
import { h, type Component } from 'vue'
import { NIcon } from 'naive-ui'
export const getItemContexts = (
  itemInfo: ItemInfo,
  t: (text: string, ...args: any[]) => string,
  handleCopy: (content: string, successMessage?: string) => Promise<void>
) => {
  const options = [
    {
      label: t('复制道具名'),
      key: 'copy-item-name',
      icon: renderIcon(FileCopyOutlined),
      children: [
        {
          label: t('中文名'),
          key: 'copy-zh',
          icon: renderIcon(LanguageOutlined)
        },
        {
          label: t('日文名'),
          key: 'copy-ja',
          icon: renderIcon(LanguageOutlined)
        },
        {
          label: t('英文名'),
          key: 'copy-en',
          icon: renderIcon(LanguageOutlined)
        }
      ]
    },
    {
      type: 'divider',
      key: 'd1'
    },
    {
      label: t('在灰机维基中打开'),
      key: 'open-in-hjwiki',
      icon: renderIcon(OpenInNewFilled),
      click: () => {
        window.open(`https://ff14.huijiwiki.com/wiki/物品:${itemInfo.nameZH}`)
      }
    },
    {
      label: t('在花环数据库中打开'),
      key: 'open-in-garland',
      icon: renderIcon(OpenInNewFilled),
      click: () => {
        window.open(`https://www.garlandtools.org/db/#item/${itemInfo.id}`)
      }
    },
    {
      label: t('在GamerEscape中打开'),
      key: 'open-in-gamerescape',
      icon: renderIcon(OpenInNewFilled),
      click: () => {
        window.open(`https://ffxiv.gamerescape.com/wiki/${itemInfo.nameEN.replace(' ', '_')}`)
      }
    },
    {
      label: t('在Universalis中打开'),
      key: 'open-in-universalis',
      icon: renderIcon(OpenInNewFilled),
      click: () => {
        window.open(`https://universalis.app/market/${itemInfo.id}`)
      }
    },
  ]
  function renderIcon(icon: Component) {
    return () => {
      return h(NIcon, null, {
        default: () => h(icon)
      })
    }
  }

  const handleKeyEvent = async (key: string | number, option: any) => {
    switch (key) {
      case 'copy-zh':
        await handleCopy(itemInfo.nameZH); break
      case 'copy-ja':
        await handleCopy(itemInfo.nameJA); break
      case 'copy-en':
        await handleCopy(itemInfo.nameEN); break
      default:
        console.log('[开发提示] 未分配点击事件', key, option)
    }
  }

  return { options, handleKeyEvent }
}
