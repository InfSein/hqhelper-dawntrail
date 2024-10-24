
import { ref } from 'vue';
import item from '@/assets/data/unpacks/item.json'
import recipe from '@/assets/data/unpacks/recipe.json'
import hqConfig from '@/assets/data/unpacks/hq-config.json'
import gatherData from '@/assets/data/unpacks/gathering-item.json'
import { Cal, type CostCHS, type IHqConfig } from './nbb-cal-v5'
import type { GearSelections } from '@/models/gears'
import { getItemInfo, type ItemInfo, type ItemTradeInfo } from './item';
import { XivRecipes } from '@/assets/data'

export function useNbbCal() {
  const langHash: any = { 'lang-zh': 2, 'lang-en': 1, 'lang-ja': 0 };

  const cal = ref(new Cal(item, recipe))
  const config: IHqConfig = hqConfig

  const doCal = (calMap: any[] | { [keys: string]: any }, hideCluster = false, shipArr0: any[] = [], shipArr1: any[] = [], shipArr2: any[] = [], shipArr3: any[] = [], shipArr4: any[] = []) => {
    return cal.value.doCal(calMap, hideCluster, shipArr0, shipArr1, shipArr2, shipArr3, shipArr4);
  }

  const calGearSelections = (input: GearSelections, patch: string = '7.0') => {
    const job = config[patch].jobs;
    const data = JSON.parse(JSON.stringify(input));
    const out: { [keys: string]: any } = {};
    if (job['MainHand'] === undefined) {
      return undefined;
    }
    for (const gearKey in data) {
      const gear = data[gearKey];
      // console.log('calGearSelections', gearKey);
      for (const jobId in gear) {
        if (gear[jobId] > 0) {
          const hqInfo = job[gearKey][jobId]
          //console.log('calGearSelections hqInfo=', hqInfo);
          if (hqInfo[0] > 0) {
            out[hqInfo[0]] = [hqInfo[0], gear[jobId], hqInfo[1], false];
          }
        }
      }
    }
    // console.log('calGearSelections calMap=', out)
    return doCal(out);
  }

  const getRecipeMap = () => {
    const map : Record<number, number> = {}
    Object.values(XivRecipes).forEach(recipe => {
      map[recipe.it] = recipe.id
    })
    return map
  }
  const recipeMap = getRecipeMap()

  /**
   * 直接通过 itemMap 来计算所需道具
   * @param selections key:道具id value:数量
   */
  const calItems = (selections: Record<number, number>) => {
    const calMap = {} as any // {"39651":[39651,1,35520,false]}
    for (const item in selections) {
      const count = selections[item]
      if (!count) continue
      calMap[item] = [item, count, recipeMap[item], false];
    }
    return doCal(calMap);
  }

  const getItem = (id: string | number) => {
    return cal.value.itemData[id];
  }

  const getPatchData = (patch: string = '7.0') => {
    return config[patch]
  }

  const getItemsName = (ids: number, lang = 'lang-zh') => {
    const item = cal.value.itemData[ids];
    if (item) {
      return item.lang[langHash[lang]];
    }
    return;
  }

  const getSpecialItems = (patch: string = '7.0') => {
    const data = config[patch]

    // * 处理灵砂 
    // (数据中是以精选组的格式存储的，每个数组中的第一个元素代表精选所得的道具，第二个元素代表精选的来源)
    const aethersands: number[] = []
    data.reduceGathering?.forEach(_item => {
      if (
        _item.length >= 2
        && !aethersands.includes(_item[0])
        && (item as any)[_item[0]] // 当前版本用不到的灵砂不会被导入物品表，这里筛掉这些数据
      ) {
        aethersands.push(_item[0])
      }
    })

    return {
      normalGathering: data?.normalGathering,
      reduceGathering: data?.reduceGathering,
      aethersands: aethersands,
      limitedGathering: data?.limitedGathering,
      masterCrafting: data?.masterCrafting,
      normalCrafting: data?.normalCrafting,
      alkahests: data?.alkahests
    }
  }

  /**
   * 获取可以兑换的道具jsmap
   * @returns Record<number, ItemTradeInfo>
   *  * key: 兑换所得道具的 itemID
   */
  const getTradeMap = () => {
    const map = {} as Record<number, ItemTradeInfo>
    for (const patch in config) {
      const trades = config[patch].tradeShops
      trades?.forEach(trade => {
        const itemID = trade.receiveId
        if (itemID) {
          const costGlobal = {
            costId: trade.costId,
            costCount: trade.costCount
          }
          const costCHS = (trade.costCHS || costGlobal) as CostCHS
          map[itemID] = {
            receiveCount: trade.receiveCount,
            costGlobal: costGlobal,
            costCHS: costCHS
          }
        }
      })
    }
    return map
  }

  /**
   * 获取可以精选的道具jsmap
   * @returns Record<number, number[]>
   *  * key: 精选所得道具的 itemID
   *  * value: 精选来源的 itemID，可能有多个
   */
  const getReduceMap = () => {
    const map = {} as Record<number, number[]>
    for (const patch in config) {
      const reduces = config[patch].reduceGathering
      reduces?.forEach(reduceGroup => {
        const idGot = reduceGroup[0]
        const idGive = reduceGroup[1]
        if (idGot && idGive) {
          if (!map[idGot]) map[idGot] = []
          map[idGot].push(idGive)
        }
      })
    }
    return map
  }
  /**
   * 获取反转的精选jsmap
   * @returns Record<number, number>
   *  * key: 精选来源的 itemID
   *  * value: 精选所得道具的 itemID
   */
  const getReduceMapReverted = () => {
    const map = {} as Record<number, number>
    for (const patch in config) {
      const reduces = config[patch].reduceGathering
      reduces?.forEach(reduceGroup => {
        const idGot = reduceGroup[0]
        const idGive = reduceGroup[1]
        if (idGot && idGive) {
          map[idGive] = idGot
        }
      })
    }
    return map
  }

  const getFoodAndTincs = () => {
    const data = [] as {
      patch: string, // "7.0" | "7.1" | "7.2" | "7.3" | "7.4",
      count: number,
      foods: number[],
      tincs: number[]
    }[]
    const recipeMap = {} as any
    for (const patch in config) {
      const o = config[patch].jobs
      const foods: number[] = []
      const tincs: number[] = []
      o.Meal?.forEach(mealGroup => {
        if (mealGroup.length >= 2) {
          foods.push(mealGroup[0])
          recipeMap[mealGroup[0]] = mealGroup[1]
        }
      })
      o.Medicine?.forEach(tincGroup => {
        if (tincGroup.length >= 2) {
          tincs.push(tincGroup[0])
          recipeMap[tincGroup[0]] = tincGroup[1]
        }
      })
      data.push({
        patch,
        count: foods.length + tincs.length,
        foods,
        tincs
      })
    }

    return {
      data, recipeMap
    }
  }
  const getFoodAndTincs_v2 = () => {
    const data = {} as Record<string, {
      count: number,
      foods: ItemInfo[],
      tincs: ItemInfo[]
    }> // key: patch
    for (const patch in config) {
      const o = config[patch].jobs
      o.Meal?.forEach(mealGroup => {
        if (mealGroup.length >= 2) {
          const itemID = mealGroup[0]
          const itemInfo = getItemInfo(itemID)
          const p = itemInfo.patch
          if (!data[p]) data[p] = {
            count: 0,
            foods: [],
            tincs: []
          }
          data[p].foods.push(itemInfo)
          data[p].count++
        }
      })
      o.Medicine?.forEach(tincGroup => {
        if (tincGroup.length >= 2) {
          const itemID = tincGroup[0]
          const itemInfo = getItemInfo(itemID)
          const p = itemInfo.patch
          if (!data[p]) data[p] = {
            count: 0,
            foods: [],
            tincs: []
          }
          data[p].tincs.push(itemInfo)
          data[p].count++
        }
      })
      if (!data[patch]) data[patch] = {
        count: 0,
        foods: [],
        tincs: []
      }
    }
    return data
  }

  const getLimitedGatherings = () => {
    const gd = gatherData as any
    const map = {} as Record<string, ItemInfo[]>
    for (const itemID in gatherData) {
      if (gd[itemID].popTime) { // 是限时物品
        const id = Number(itemID)
        if (id < 36630) continue // 手动过滤掉7.0之前的
        if (!getItem(id)) continue // 过滤掉没有数据的
        const itemInfo = getItemInfo(id)
        const itemLevel = itemInfo.itemLevel <= 690 ? '~690' : itemInfo.itemLevel
        const key = itemInfo.patch + '-' + itemLevel
        if (!map[key]) map[key] = []
        map[key].push(itemInfo)
      }
    }
    return map
  }

  return {
    doCal, getItem, getPatchData, getItemsName, calGearSelections, getRecipeMap,
    calItems, getSpecialItems, getTradeMap, getReduceMap, getReduceMapReverted, getFoodAndTincs,
    getFoodAndTincs_v2, getLimitedGatherings
  }
}