export const attireAffixes = [
  "fending",
  "maiming",
  "striking",
  "scouting",
  "aiming",
  "healing",
  "casting",
  "gathering",
  "crafting",
] as const

export type AttireAffix = typeof attireAffixes[number]

export const accessoryAffixes = [
  "fending",
  "slaying",
  "aiming",
  "healing",
  "casting",
  "gathering",
  "crafting",
] as const

export type AccessoryAffix = typeof accessoryAffixes[number]


export interface GearSelections {
  mainHand: Record<number, number>;
  offHand: Record<number, number>;
  
  headAttire: Record<AttireAffix, number>;
  bodyAttire: Record<AttireAffix, number>;
  handsAttire: Record<AttireAffix, number>;
  legsAttire: Record<AttireAffix, number>;
  feetAttire: Record<AttireAffix, number>;

  earrings: Record<AccessoryAffix, number>;
  necklace: Record<AccessoryAffix, number>;
  wrist: Record<AccessoryAffix, number>;
  rings: Record<AccessoryAffix, number>;
}

/** 判断给定已选部件对象是否为空 (即是否还未选择任何部件) */
export const isGearEmpty = (gearSelections: GearSelections) => {
  return Object.values(gearSelections).every(obj => Object.values(obj).every(val => val === 0))
}

import {
  XivJobs
} from '@/assets/data'
export const getDefaultGearSelections = () => {
  const gears = JSON.parse(JSON.stringify({
    mainHand: {} as Record<number, number>,
    offHand: {} as Record<number, number>,
    headAttire: {} as Record<AttireAffix, number>,
    
    bodyAttire: {} as Record<AttireAffix, number>,
    handsAttire: {} as Record<AttireAffix, number>,
    legsAttire: {} as Record<AttireAffix, number>,
    feetAttire: {} as Record<AttireAffix, number>,
    
    earrings: {} as Record<AccessoryAffix, number>,
    necklace: {} as Record<AccessoryAffix, number>,
    wrist: {} as Record<AccessoryAffix, number>,
    rings: {} as Record<AccessoryAffix, number>,
  })) as GearSelections
  fixGearSelections(gears)
  return gears
}
export const fixGearSelections = (gears?: GearSelections) => {
  if (!gears) {
    return getDefaultGearSelections()
  }
  else {
    const oldgear = gears as any
    const carry = (oldKey: string, newKey: string) => {
      if (oldgear[oldKey]) {
        oldgear[newKey] = oldgear[oldKey]; delete oldgear[oldKey]
      }
    }
    carry('MainHand', 'mainHand')
    carry('OffHand', 'offHand')  
    carry('HeadAttire', 'headAttire')
    carry('BodyAttire', 'bodyAttire')
    carry('HandsAttire', 'handsAttire')
    carry('LegsAttire', 'legsAttire')
    carry('FeetAttire', 'feetAttire')
    carry('Earrings', 'earrings')
    carry('Necklace', 'necklace')
    carry('Wrist', 'wrist')
    carry('Rings', 'rings')
    gears = oldgear as GearSelections
  }
  const XivJobIds = Object.keys(XivJobs).map(jobId => parseInt(jobId))
  XivJobIds.forEach(jobId => {
    gears.mainHand[jobId] |= 0
    gears.offHand[jobId] |= 0
  })
  attireAffixes.forEach(affix => {
    gears.headAttire[affix] |= 0
    gears.bodyAttire[affix] |= 0
    gears.handsAttire[affix] |= 0
    gears.legsAttire[affix] |= 0
    gears.feetAttire[affix] |= 0
  })
  accessoryAffixes.forEach(affix => {
    gears.earrings[affix] |= 0
    gears.necklace[affix] |= 0
    gears.wrist[affix] |= 0
    gears.rings[affix] |= 0
  })
  return gears
}