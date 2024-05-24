export type AttireAffix = "fending" | "maiming" | "striking" | "scouting" | "aiming"
              | "healing" | "casting" | "gathering" | "crafting"
export type AccessoryAffix = "fending" | "slaying" | "aiming" | "healing" | "casting" | "gathering" | "crafting"

/** Visit `documents\core-design.md` to see the structure meanings. */
export interface GearSelections {
  /** Gear selections for the `main hand`. Key: job ID, value: gear count. */
  MainHand: Record<number, number>;
  /** Gear selections for the `off hand`. Key: job ID, value: gear count. */
  OffHand: Record<number, number>;
  
  /** Gear selections for the `head attire`. Key: attire affix, value: gear count. */
  HeadAttire: Record<AttireAffix, number>;
  /** Gear selections for the `body attire`. Key: attire affix, value: gear count. */
  BodyAttire: Record<AttireAffix, number>;
  /** Gear selections for the `hands attire`. Key: attire affix, value: gear count. */
  HandsAttire: Record<AttireAffix, number>;
  /** Gear selections for the `legs attire`. Key: attire affix, value: gear count. */
  LegsAttire: Record<AttireAffix, number>;
  /** Gear selections for the `feet attire`. Key: attire affix, value: gear count. */
  FeetAttire: Record<AttireAffix, number>;

  /** Gear selections for the `earrings`. Key: accessory affix, value: gear count. */
  Earrings: Record<AccessoryAffix, number>;
  /** Gear selections for the `necklace`. Key: accessory affix, value: gear count. */
  Necklace: Record<AccessoryAffix, number>;
  /** Gear selections for the `wrist`. Key: accessory affix, value: gear count. */
  Wrist: Record<AccessoryAffix, number>;
  /** Gear selections for the `rings`. Key: accessory affix, value: gear count. */
  Rings: Record<AccessoryAffix, number>;
}

export const defaultGearSelections: GearSelections = {
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
}

export const getDefaulGearSelections = () => {
  return JSON.parse(JSON.stringify(defaultGearSelections)) as GearSelections;
}