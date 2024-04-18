# 纲要

## 思路

在`xiv-jobs`内统一配置职业固有属性，包括：
- 名称、ID、logo
- 使用的防具及首饰类型

在`xiv-patches`内配置版本的基本信息，包括：
- 版本号、版本名、logo
- 是否已经更新
- 描述文本

在`xiv-patch-gears`内配置各职业装备的信息，格式为：
// ! 可以考虑分散文件，如`xiv-patch-7.0-gears`,`xiv-patch-7.05-gears`等
```json
{
  "7.00": { // 版本号作为主键，与xiv-patches内的`v`字段对应
    // * 先依次填写各职业的装备信息
    "Job": {
      "19": { // 职业ID，与xiv-jobs内的职业ID对应
        "name_en": "Knight", // 职业名称，应当用不到，但为了便于阅读和维护而记录
        // 各装备的值为0代表这个职业这个版本没有这个部件的新HQ
        "MainHand": 37000,      // 主手装备ID
        "OffHand": 37001,     // 副手装备ID
        // 合并主副手的场景可以把装备箱id填到主手上、副手填0
        "Attire": "Fending",     // 防具类型，关联到下方防具组内
        "Accessory": "Fending",     // 首饰类型，关联到下方首饰组内
      },
      "21": {}, // 其他职业，格式一致
    }
    // * 然后去统一填写防具和首饰
    "Attire": {
      // 依次代表：头部防具、身体防具、手部防具、腿部防具、脚部防具
      "Fending": [37002, 37003, 37004, 37005, 37006], // 防具ID列表
      ... // 其他防具类型
    },
    "Accessory": {
      // 依次代表：耳坠、项链、手镯、戒指
      "Fending": [37007, 37008, 37009, 37010], // 首饰ID列表
      "Crafter": [0, 0, 0, 0] // 为0代表这个职业这个版本没有这个部件的新HQ
    }
  },
  "7.05": {}, // Same
  "7.10": {}, // Same
  "7.20": {}, // Same
  "7.30": {}, // Same
  "7.40": {}  // Same
}
```


# 旧版设计（供参考）
```json
{
  "GlobalInfo": {
    "Version": 2000,
    "SupportedFinalFantasyPatch": "7.00",
    "Documents": { // 文档,子内容使用 Dictionary<string, Dictionary<string, string>> 来Parse
      "自撰攻略": {
        "7.00HQ攻略": "...?tid=222"
      },
      "其他攻略": {},
      "其他实用工具": {}
    }
  },
  "Equipments": {
    "Patch_700": {
      "updated": false,
      "Foods": [38001, 38002, 38003],     // 此版本包含有哪些食物
      "Tinctures": [38004, 38005, 38006], // 此版本包含有哪些爆发药
      "Knight": {
        "exist": true,
        // 使用int来指向物品的id,如果不存在这个部位则设为-1
        "MainHand": 37000,    // 主手
        "Auxiliary": 37001,   // 副手
        "HeadAttire": 0,       // 头部防具
        "BodyAttire": 0,       // 身体防具
        "HandAttire": 0,       // 手部防具
        "LegAttire": 0,        // 腿部防具
        "FootAttire": 0,       // 脚部防具
        "Earrings": 0,        // 耳坠
        "Necklace": 0,        // 项链
        "Bracelet": 0,        // 手镯
        "Rings": 0,           // 戒指
        // 不需要把同类装备合并,到时候DevForm做一个自动生成就行
      },
      "Warrior": {} // Same
    },
    "Patch_705": {},
    "Patch_710": {},
    "Patch_720": {},
    "Patch_730": {},
    "Patch_740": {} // Same
  },
  /* * 下述结构可以考虑抽离出去另外做文件
  "GatherClockData": {
    // 可以直接沿用第一代的
  },
  "GanwuData": {
    // to-do
  },
  */
  "Recipes": {
    // 使用Dictionary<int, Recipe>进行Parse
    "37001": {
      "CraftResultNum": 3,  // 单次制作获得的道具数量
      "IsExpert": false,    // 是否为专家配方
      "Materials": {        // 消耗的素材
        "25003": 2,         // 使用Dictionary<int, int>进行Parse
        "21111": 1
      }
    }
  },
  "ItemIdMap": {
    // 使用Dictionary<int, Item>进行Parse
    "37001": {
      "Name_cn": "中文名",
      "Name_jp": "私密马赛",
      "Name_en": "engnamehere",
      // 物品类型,决定按照哪种逻辑进行处理或显示
      // 以Enum格式存储, Enum结构待定
      "Type": 1,
      // 需求的点数,非点数素材可以不填
      // 格式：类型|数量, 类型字典待定
      "AllaganRequires": "BASIC|20",
      "Description": ""
    }
  }
}
```