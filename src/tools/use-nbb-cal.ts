
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
        console.log('calGearSelections calMap=', out)
        return doCal(out);
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
        return {
            normalGathering: data?.normalGathering,
            reduceGathering: data?.reduceGathering,
            limitedGathering: data?.limitedGathering,
            masterCrafting: data?.masterCrafting,
            normalCrafting: data?.normalCrafting,
        }
    }

    const getTradeShops = (patch: string = '7.0') => {
        const data = config[patch]
        return data?.tradeShops; // todo - 也许可以在这里处理好兑换格式
    }

    return {
        doCal, getItem, getItemsName, calGearSelections, getSpecialItems, getTradeShops
    }
}