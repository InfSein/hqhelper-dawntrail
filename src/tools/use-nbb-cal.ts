
import { ref } from 'vue';
import item from '@/assets/data/unpacks/item.json'
import recipe from '@/assets/data/unpacks/recipe.json'
import hqConfig from '@/assets/data/unpacks/hq-config.json'
import { Cal, type IHqConfig } from './nbb-cal-v5'
import type { GearSelections } from '@/models/gears'


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

    const calFoodAndTincs = (selections: Record<number, number>, recipeMap: any) => {
        const calMap = {} as any // {"39651":[39651,1,35520,false]}
        for (const item in selections) {
            const count = selections[item]
            if (!count) continue
            calMap[item] = [item, count, recipeMap[item], false];
        }
        console.log('recipeMap:', recipeMap)
        console.log('calMap:', calMap)
        return doCal(calMap);
    }

    const getItem = (id: number) => {
        return cal.value.itemData[id];
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
        const aethersands : number[] = []
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

    const getTradeShops = (patch: string = '7.0') => {
        const data = config[patch]
        return data?.tradeShops; // todo - 也许可以在这里处理好兑换格式
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
            const foods : number[] = []
            const tincs : number[] = []
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

    return {
        doCal, getItem, getItemsName, calGearSelections, calFoodAndTincs, getSpecialItems, getTradeShops, getFoodAndTincs
    }
}