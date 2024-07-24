/**
 * nbb Calculator v5 
 * 2016-12-10 
 */

export interface IHqJobs {
    [key: string]: any;
    // MainHand?: Record<string, number>;
    // OffHand?: Record<string, number>;
    // HeadAttire?: Record<string, number>;
    // BodyAttire?: Record<string, number>;
    // HandsAttire?: Record<string, number>;
    // LegsAttire?: Record<string, number>;
    // FeetAttire?: Record<string, number>;
    // Earrings?: Record<string, number>;
    // Necklace?: Record<string, number>;
    // Wrist?: Record<string, number>;
    // Rings?: Record<string, number>;
    Meal?: number[][];
    Medicine?: number[][];
}

export interface IHqVer {
    available: boolean;
    jobs: IHqJobs;
    normalGathering?: number[];
    reduceGathering?: unknown[];
    limitedGathering?: number[];
    alkahests?: number[];
    masterCrafting?: number[];
    normalCrafting?: number[];
    tradeShops?: unknown[];
}

export interface IHqConfig {
    [keys: string]: IHqVer;
}

export interface IItem {
    desc: any;
    id: number;
    lang: any[];
    //ab: any[];
    icon: number;
    /** 物等 */
    ilv: number;
    /** UI分类 */
    uc: number;
    /** 搜索分类 */
    sc: number;
    /** 可否hq */
    hq: boolean;
    /** 可否染色 */
    dye: number | boolean;
    act: number;
    /**  */
    desy?: number;
    /**  */
    bon?: number;
    /** 可否精选 */
    reduce: boolean;
    /** 装备等级 */
    elv: number;
    /** 职业组 */
    jobs: number;
    /** 魔晶石安全孔 */
    ms: number;
    /** 可否禁断 */
    jd: boolean;
    p: number | string;
    bpm?: any[];
    /**
     * 特殊属性
     */
    spm?: any[];
    /**  */
    actParm?: any[];
    /** 配方id */
    rids: string[];
    /** 星级 */
    recipeStar?: string;
}

/**
* 配方
*/
export interface IRecipe {
    id: number;
    job: number;
    it: number;
    /** 基本属性 */
    bp: any[];
    /** 素材 [id,数量,id,数量,....] */
    m: any[];
    /** 配方等阶 */
    rlv: number;
    /** 水晶 */
    s: any[];
    sp1: any[];
    /** 特殊属性2: 必要加工、作业数值、简易制作门槛：必要加工、作业数值 */
    sp2: any[];
    /** 特殊属性3： 属性，buff，必要物品，？ */
    sp3: any[];
    /** 简易制作 */
    qs: boolean;
    /** hq制作 */
    hq: boolean;
    /** 职业图标 */
    jobIcon?: number;
    /** Secret Recipe Book 秘籍id */
    srb?: number;
}

export class Cal {
    itemData: { [keys: number | string]: IItem };
    recipeData: { [keys: number | string]: IRecipe };

    constructor(a: { [keys: number | string]: IItem }, b: { [keys: number | string]: IRecipe }) {
        // console.log("Cal init....")
        this.itemData = a;
        this.recipeData = b;
    }

    // calMap {"39651":[39651,1,35520,false]}
    doCal(calMap: any[] | { [keys: string]: any }, hideCluster = false, shipArr0: any[] = [], shipArr1: any[] = [], shipArr2: any[] = [], shipArr3: any[] = [], shipArr4: any[] = []) {
        // console.log('doCal shipArr = ', shipArr)
        let sumMap0 = {}; // 队列
        let sumMap1 = {}; // 直接材料
        let sumMap2 = {}; // 2级材料
        let sumMap3 = {}; // 2级材料
        let sumMap4 = {}; // 3级材料
        let sumMap5 = {}; // 4级材料

        let sumMap02 = {}; // 基础素材统计

        sumMap0 = this.calHelperTop(calMap, shipArr0);
        // console.log('sumMap0', sumMap0)

        sumMap1 = this.docalHelper(sumMap0, false, hideCluster, shipArr1);
        // console.log('1级材料 sumMap1', shipArr1, sumMap1)

        sumMap2 = this.docalHelper(sumMap1, false, hideCluster, shipArr2);
        // console.log('2级材料 sumMap2', shipArr2, sumMap2)

        sumMap3 = this.docalHelper(sumMap2, false, hideCluster, shipArr3);
        // console.log('3级材料 sumMap3', shipArr3, sumMap3)

        sumMap4 = this.docalHelper(sumMap3, false, hideCluster, shipArr4);
        // console.log('4级材料 sumMap4', shipArr4, sumMap4)

        sumMap5 = this.docalHelper(sumMap4, false, hideCluster);
        // console.log('sumMap5', sumMap5)

        sumMap02 = this.dusum(sumMap1, sumMap02);
        sumMap02 = this.dusum(sumMap2, sumMap02);
        sumMap02 = this.dusum(sumMap3, sumMap02);
        sumMap02 = this.dusum(sumMap4, sumMap02);
        sumMap02 = this.dusum(sumMap5, sumMap02);
        // console.log('sumMap02', sumMap02)

        const re = {
            ls: sumMap0,
            lv1: sumMap1,
            lv2: sumMap2,
            lv3: sumMap3,
            lv4: sumMap4,
            lv5: sumMap5,
            lvBase: sumMap02
        }
        return JSON.parse(JSON.stringify(re));
    }

    calHelperTop(calMap: { [keys: string]: any }, shipArr: any[] = []) {
        const b: { [keys: string]: any } = {};
        for (const id in calMap) {
            if (shipArr.indexOf(Number(id)) >= 0) continue; // 跳过排除列表
            if (calMap[id].length === 5 && calMap[id][4]) continue;// 特殊场景使用
            const need = calMap[id][1];// 該素材需要的數量
            let mkc = 0; // 該素材生產次數
            const repice = this.recipeData[calMap[id][2]];
            const item = this.itemData[id];

            if (repice) {
                const pc = parseInt(repice.bp[1]);
                mkc = parseInt((need / pc).toString()); // eslint-disable-line
                mkc += (need % pc) > 0 ? 1 : 0;
                b[id] = {
                    id: Number(id),
                    rid: calMap[id][2],
                    checked: calMap[id][3],
                    job: repice.job,
                    name: item.lang,
                    icon: item.icon,
                    desc: item.desc,
                    uc: item.uc,
                    need: need,
                    mkc: mkc,
                    pc: pc
                }
            } else {
                b[id] = {
                    id: Number(id),
                    checked: calMap[id][3],
                    rid: [],
                    name: item.lang,
                    icon: item.icon,
                    desc: item.desc,
                    uc: item.uc,
                    need: need,
                    mkc: mkc
                }
            }
        }
        return b;
    }

    docalHelper(itemTemMap: { [keys: string]: any }, debug = false, hideCluster = false, shipArr: any[] = []) {
        const reMap: { [keys: string]: any } = {};
        for (const id in itemTemMap) {
            if (itemTemMap[id].checked === true) continue;
            let rid = itemTemMap[id].rid;
            if (rid === undefined || rid.length === 0) {
                continue;
            }
            if (typeof rid === 'object' && rid.length !== undefined) rid = rid[0];
            // console.log('calHelper rid', rid)
            const recipe = this.recipeData[rid];
            const material = recipe.m;
            const shard = recipe.s;
            const mkc = itemTemMap[id].mkc;

            for (let i = 0; i < 4; i += 2) {
                if (hideCluster) continue;
                const shardId = shard[i];
                if (shardId <= 0) continue;
                const item = this.itemData[shardId];
                const count = shard[i + 1];
                if (reMap[shardId]) {
                    const shardCount2 = parseInt(reMap[shardId]['need']) + count;
                    reMap[shardId].need = shardCount2;
                } else {
                    reMap[shardId] = {
                        id: shardId,
                        rid: [],
                        icon: item.icon,
                        name: item.lang,
                        desc: item.desc,
                        uc: item.uc,
                        need: count,
                        mkc: 0,
                        pc: 1
                    }
                }
            }

            for (let j = 0; j < material.length; j += 2) {
                const itemId = material[j];
                if (shipArr.indexOf(Number(itemId)) >= 0) continue;
                const item = this.itemData[itemId];
                const count = mkc * parseInt(material[j + 1]);
                if (reMap[itemId]) {
                    const count2 = parseInt(reMap[itemId]['need']) + count;
                    reMap[itemId].need = count2;
                } else {
                    reMap[itemId] = {
                        id: itemId,
                        rid: item.rids,
                        name: item.lang,
                        icon: item.icon,
                        desc: item.desc,
                        uc: item.uc,
                        need: count,
                        mkc: 0,
                        pc: 1
                    }
                }
            }
        }
        for (const k in reMap) {
            const jj = reMap[k];
            // console.log('jj', jj)
            let mkc1 = 0;
            const need1 = parseInt(jj['need']);
            let pc1 = 0;

            if (jj.rid && jj.rid.length > 0) {
                const _recipe1 = this.recipeData[jj.rid[0]];
                pc1 = parseInt(_recipe1.bp[1]);
                mkc1 = parseInt((need1 / pc1).toString());
                mkc1 += (need1 % pc1) > 0 ? 1 : 0;
            }

            reMap[k].mkc = mkc1;
            reMap[k].pc = pc1;

            if (debug) {
                // console.log(' 需求数量  = ', need1, ' 产量 = ', pc1, ' 生产次数 = ', mkc1);
            }
        }
        return reMap
    }

    dusum(temmap: { [keys: string]: any }, sumMap02: { [keys: string]: any }) {
        for (const id in temmap) {
            if (temmap[id].checked === true) continue;
            let num = temmap[id]['need'];
            // const name1 = temmap[id]['name'];
            if (temmap[id].rid === undefined || temmap[id].rid.length === 0) {
                if (sumMap02[id]) {
                    num = parseInt(sumMap02[id]['need']) + parseInt(num);
                    sumMap02[id].need = num;
                } else {
                    sumMap02[id] = {
                        id: id,
                        name: temmap[id].name,
                        icon: temmap[id].icon,
                        desc: temmap[id].desc,
                        uc: temmap[id].uc,
                        need: num,
                        mkc: 0
                    }
                }
            }
        }
        return sumMap02
    }

}
