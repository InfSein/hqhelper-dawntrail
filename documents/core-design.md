# 核心算法设计文档

暂时先完成HQ装备的计算逻辑
食物爆发药的逻辑以后再说（

## 前端输出的已选部件格式

```typescript
const patch : "7.0" | "7.1" | "7.2" | "7.3" | "7.4" = '7.0' // 7.0包括7.0的生产采集白装和7.05的战职绿装
const gearSelections: GearSelections = {
  // * 主副手的每个职业一条
  MainHand: { // 主手
    '2': 0,
    '3': 0,
    '4': 2, // key:job_id; value:此部件选择的数量
    // ...
  },
  OffHand: { // 副手
    '2': 0, // same as above
  },
  // * 防具和首饰按词缀分类
  // 词缀即绿装英文名末尾的单词，转为小写
  /* 防具词缀列表：
      ---------------
      御敌: fending  
      制敌: maiming
      强袭: striking
      游击: scouting
      精准: aiming
      治愈: healing
      咏咒: casting
      ---------------
      大地: gathering
      巧匠: crafting
      ---------------
   */
  HeadAttire: { // 头部防具
    'fending': 3, // 御敌
    'aiming': 1, // 精准
    // ...
  },
  BodyAttire: {}, // 身体防具
  HandsAttire: {}, // 手部防具
  LegsAttire: {}, // 腿部防具
  FeetAttire: {}, // 脚部防具
  /* 首饰词缀列表：
      ---------------
      御敌: fending  
      强攻: slaying // 力量近战通用
      精准: aiming // 忍者远敏共用
      治愈: healing
      咏咒: casting
      ---------------
      大地: gathering
      巧匠: crafting
      ---------------
   */
  Earrings: {}, // 耳坠
  Necklace: {}, // 项链
  Wrist: {}, // 手镯
  Rings: {}, // 戒指
}
```

## 需要的计算结果

```typescript
interface RequiredMaterial {
  item_id: number, // 物品ID
  amount: number, // 数量
  requires: RequiredMaterial[] // 制作这个物品所需要的原料
}
const requiredMaterials: RequiredMaterial[] = [
  {
    item_id: 123, // 物品ID
    amount: 1, // 数量
    requires: [] // 如果物品是半成品，那么在这里也要列出制作这个物品所需要的原料
  },
  // ...
]
```

## 其他

如果沿用第一代hqhelper的界面，那么展示材料时需要以下分类：

1. 哪些材料是炼金幻水
2. 哪些材料是非炼金的星级半成品
3. 哪些材料是非星级的半成品
4. 哪些材料是限时的采集材料
5. 哪些材料是非限时的采集材料
6. 哪些材料是点数材料，以及各自需要多少点数
7. 还需要晶簇/水晶/碎晶的统计