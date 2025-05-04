import { XivJobs } from '@/assets/data'
import { getItemInfo, type ItemInfo } from "./item"
import { useNbbCal } from "./use-nbb-cal"
import type { RecommItemGroup } from '@/models/item'

export function useFufuCal() {
  const calItems = (selections: Record<number, number>) => {
    const { calItems } = useNbbCal()
    return calItems(selections)
  }

  const calRecommProcessData = (
    targetItemsForCal: Record<number, number>,
    lv1ItemsForCal: Record<number, number>,
    baseItemsForCal: Record<number, number>
  ) => {
    const craftTargets = dealItemMapToItemList(targetItemsForCal)
    const lv1Items = dealItemMapToItemList(lv1ItemsForCal)

    // 根据1级素材计算出2/3级素材 (主要是考虑半成品套娃的情况，所以不需要多做处理)
    const lv2Map : Record<number, number> = {}
    const lv3Map : Record<number, number> = {}
    const statistics = calItems(lv1ItemsForCal)
    // 1级素材复算得到的1级素材就是需要的2级素材，2级素材就是需要的3级
    Object.values(statistics.lv1).forEach((calResult : any) => {
      const itemID : number = calResult.id
      const amount : number = calResult.need
      lv2Map[itemID] = amount
    })
    Object.values(statistics.lv2).forEach((calResult : any) => {
      const itemID : number = calResult.id
      const amount : number = calResult.need
      lv3Map[itemID] = amount
    })
    const lv2Items = dealItemMapToItemList(lv2Map)
    const lv3Items = dealItemMapToItemList(lv3Map)

    const lvBaseItems = dealItemMapToItemList(baseItemsForCal)

    return {
      craftTargets,
      lv1Items, lv2Items, lv3Items,
      lvBaseItems
    }

    function dealItemMapToItemList(itemMap: Record<number, number>) {
      const list : ItemInfo[] = []
      for (const _id in itemMap) {
        const id = Number(_id)
        const amount = itemMap[id]
        if (amount > 0) {
          const itemInfo = getItemInfo(id)
          itemInfo.amount = amount
          list.push(itemInfo)
        }
      }
      return list
    }
  }

  const calRecommProcessGroups = (
    craftTargets: ItemInfo[],
    lv1Items: ItemInfo[],
    lv2Items: ItemInfo[],
    lv3Items: ItemInfo[],
    lvBaseItems: ItemInfo[],
    processes_craftable_item_sortby: string,
    processes_merge_gatherings: boolean,
    language_ui: "zh" | "en" | "ja",
    item_server: 'chs' | 'global',
    t: (text: string, ...args: any[]) => string
  ) => {
    const itemsGatherableCommon : ItemInfo[] = []
    const itemsGatherableLimited : ItemInfo[] = []
    const aethersands : ItemInfo[] = []
    const itemsTradable : ItemInfo[] = []
    const itemsOtherCollectable : ItemInfo[] = []
    const itemsPrePrePrecraft : Record<number, ItemInfo[]> = {}
    const itemsPrePrecraft : Record<number, ItemInfo[]> = {}
    const itemsPrecraft : Record<number, ItemInfo[]> = {}
    const itemsTarget : Record<number, ItemInfo[]> = {}
  
    // 从基础素材中检索分类
    lvBaseItems.forEach(item => {
      if (item.gatherInfo?.jobId) {
        if (item.gatherInfo.timeLimitInfo?.length) {
          itemsGatherableLimited.push(item)
        } else {
          itemsGatherableCommon.push(item)
        }
      } else if (item.canReduceFrom?.length) {
        aethersands.push(item)
      } else if (item.tradeInfo?.costGlobal) {
        // 部分道具同时具备可采集/精选和可兑换的属性，需要注意区分
        itemsTradable.push(item)
      } else {
        if (item.uiTypeId !== 59) {
          // 忽略水晶
          itemsOtherCollectable.push(item)
        }
      }
    })
  
    // 逐级遍历半成品
    lv1Items.forEach(item => {
      if (item.craftInfo?.jobId) {
        dealCraftableItem(itemsPrecraft, item)
      }
    })
    lv2Items.forEach(item => {
      if (item.craftInfo?.jobId) {
        dealCraftableItem(itemsPrePrecraft, item)
      }
    })
    lv3Items.forEach(item => {
      if (item.craftInfo?.jobId) {
        dealCraftableItem(itemsPrePrePrecraft, item)
      }
    })
  
    // 最终处理成品
    craftTargets.forEach(item => {
      if (item.craftInfo?.jobId) {
        dealCraftableItem(itemsTarget, item)
      }
    })
  
    function dealCraftableItem(target: Record<number, ItemInfo[]>, item: ItemInfo) {
      const jobId = item.craftInfo!.jobId
      target[jobId] ??= []
      const existing = target[jobId].find(_item => item.id === _item.id)
      if (existing) {
        existing.amount += item.amount
      } else {
        target[jobId].push(item)
      }
    }
  
    // 根据处理后的物品列表组装各个分组
    const groups : RecommItemGroup[] = []
    const dealGatherings = (
      gathering: ItemInfo[],
      type: "common" | "limited",
      groupTitle: string,
      orderBy?: "map" | "start-time",
      mergeJobs?: {
        iconUrl: string
      }
    ) => {
      if (!gathering?.length) return
      if (orderBy === 'map') {
        gathering.sort((a, b) => {
          const aMap = a.gatherInfo.placeID
          const bMap = b.gatherInfo.placeID
          return aMap - bMap
        })
      } else if (orderBy === 'start-time') {
        gathering.sort((a, b) => {
          let startA = 99, startB = 99
          a.gatherInfo.timeLimitInfo.forEach(limit => {
            startA = Math.min(startA, Number(limit.start.split(':')[0]))
          })
          b.gatherInfo.timeLimitInfo.forEach(limit => {
            startB = Math.min(startB, Number(limit.start.split(':')[0]))
          })
          return startA - startB
        })
      }
      if (mergeJobs) {
        groups.push({
          type: `gather-${type}`,
          title: groupTitle,
          icon: mergeJobs.iconUrl,
          items: gathering
        })
      } else {
        const itemsGatheredBy = {
          16: [], 17: [], 18: []
        } as Record<number, ItemInfo[]>
        gathering.forEach(item => {
          itemsGatheredBy[item.gatherInfo.jobId].push(item)
        });
        ([16, 17, 18]).forEach(jobid => {
          if (itemsGatheredBy[jobid].length) {
            groups.push({
              type: `gather-${type}`,
              title: groupTitle.replace('{job}', XivJobs[jobid][`job_name_${language_ui}`]),
              icon: XivJobs[jobid].job_icon_url,
              items: itemsGatheredBy[jobid]
            })
          }
        });
      }
    }
    const dealCraftings = (
      craftings: Record<number, ItemInfo[]>,
      type: "target" | "precraft" | "preprecraft" | "prepreprecraft",
      groupTitle: string
    ) => {
      Object.keys(craftings).forEach(_jobID => {
        const jobId = Number(_jobID)
        const job = XivJobs[jobId]
        const items = craftings[jobId]
        const rokey = item_server === 'chs' ? 'recipeOrderCHS' : 'recipeOrder'
        if (processes_craftable_item_sortby === 'recipeOrder') {
          items.sort((a, b) => {
            if (a.craftInfo?.[rokey] && b.craftInfo?.[rokey]) {
              return a.craftInfo[rokey] - b.craftInfo[rokey]
            } else {
              return a.id - b.id
            }
          })
        }
        groups.push({
          type: `craft-${type}`,
          title: groupTitle.replace('{job}', job[`job_name_${language_ui}`]),
          icon: job.job_icon_url,
          items: items
        })
      })
    }
  
    if (processes_merge_gatherings) {
      dealGatherings(itemsGatherableCommon, 'common', t('采集非限时道具'), 'map', {
        iconUrl: './ui/gathering.png'
      })
      dealGatherings(itemsGatherableLimited, 'limited', t('采集限时道具'), 'start-time', {
        iconUrl: './ui/gathering-limited.png'
      })
    } else {
      dealGatherings(itemsGatherableCommon, 'common', t('使用{job}采集(非限时)'), 'map')
      dealGatherings(itemsGatherableLimited, 'limited', t('使用{job}采集(限时)'), 'start-time')
    }
    if (aethersands.length) {
      groups.push({
        type: 'aethersand',
        title: t('筹集灵砂'),
        icon: './ui/reduce.png',
        items: aethersands
      })
    }
    if (itemsTradable.length) {
      groups.push({
        type: 'trade-tomescript',
        title: t('兑换道具'),
        icon: './ui/important-item.png',
        items: itemsTradable
      })
    }
    if (itemsOtherCollectable.length) {
      groups.push({
        type: 'other',
        title: t('筹集其他需要的道具'),
        icon: './ui/bag.png',
        items: itemsOtherCollectable
      })
    }
    dealCraftings(itemsPrePrePrecraft, 'prepreprecraft', t('使用{job}制作半半半成品'))
    dealCraftings(itemsPrePrecraft, 'preprecraft', t('使用{job}制作半半成品'))
    dealCraftings(itemsPrecraft, 'precraft', t('使用{job}制作半成品'))
    dealCraftings(itemsTarget, 'target', t('使用{job}制作成品'))
  
    return groups
  }

  return {
    calItems,
    calRecommProcessData,
    calRecommProcessGroups
  }
}