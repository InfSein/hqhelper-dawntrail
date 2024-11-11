export type AttireAffix = "fending" | "maiming" | "striking" | "scouting" | "aiming"
              | "healing" | "casting" | "gathering" | "crafting"
export type AccessoryAffix = "fending" | "slaying" | "aiming" | "healing" | "casting" | "gathering" | "crafting"

export const attireAffixes: AttireAffix[] = [
  "fending",
  "maiming",
  "striking",
  "scouting",
  "aiming",
  "healing",
  "casting",
  "gathering",
  "crafting"
]
export const accessoryAffixes: AccessoryAffix[] = [
  "fending",
  "slaying",
  "aiming",
  "healing",
  "casting",
  "gathering",
  "crafting"
]

export interface GearSelections {
  MainHand: Record<number, number>;
  OffHand: Record<number, number>;
  
  HeadAttire: Record<AttireAffix, number>;
  BodyAttire: Record<AttireAffix, number>;
  HandsAttire: Record<AttireAffix, number>;
  LegsAttire: Record<AttireAffix, number>;
  FeetAttire: Record<AttireAffix, number>;

  Earrings: Record<AccessoryAffix, number>;
  Necklace: Record<AccessoryAffix, number>;
  Wrist: Record<AccessoryAffix, number>;
  Rings: Record<AccessoryAffix, number>;
}

/** 判断给定已选部件对象是否为空 (即是否还未选择任何部件) */
export const isGearEmpty = (gearSelections: GearSelections) => {
  return Object.values(gearSelections).every(obj => Object.values(obj).every(val => val === 0))
}

import XivJobs from '@/assets/data/xiv-jobs.json'
export const getDefaultGearSelections = () => {
  const gears = JSON.parse(JSON.stringify({
    MainHand: {} as Record<number, number>,
    OffHand: {} as Record<number, number>,
    HeadAttire: {} as Record<AttireAffix, number>,
    
    BodyAttire: {} as Record<AttireAffix, number>,
    HandsAttire: {} as Record<AttireAffix, number>,
    LegsAttire: {} as Record<AttireAffix, number>,
    FeetAttire: {} as Record<AttireAffix, number>,
    
    Earrings: {} as Record<AccessoryAffix, number>,
    Necklace: {} as Record<AccessoryAffix, number>,
    Wrist: {} as Record<AccessoryAffix, number>,
    Rings: {} as Record<AccessoryAffix, number>,
  })) as GearSelections
  fixGearSelections(gears)
  return gears
}
export const fixGearSelections = (gears?: GearSelections) => {
  if (!gears) return getDefaultGearSelections()
  const XivJobIds = Object.keys(XivJobs).map(jobId => parseInt(jobId))
  XivJobIds.forEach(jobId => {
    gears.MainHand[jobId] |= 0
    gears.OffHand[jobId] |= 0
  })
  attireAffixes.forEach(affix => {
    gears.HeadAttire[affix] |= 0
    gears.BodyAttire[affix] |= 0
    gears.HandsAttire[affix] |= 0
    gears.LegsAttire[affix] |= 0
    gears.FeetAttire[affix] |= 0
  })
  accessoryAffixes.forEach(affix => {
    gears.Earrings[affix] |= 0
    gears.Necklace[affix] |= 0
    gears.Wrist[affix] |= 0
    gears.Rings[affix] |= 0
  })
  return gears
}