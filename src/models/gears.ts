export type AttireAffix = "fending" | "maiming" | "striking" | "scouting" | "aiming"
              | "healing" | "casting" | "gathering" | "crafting"
export type AccessoryAffix = "fending" | "slaying" | "aiming" | "healing" | "casting" | "gathering" | "crafting"

/** Visit `documents\core-design.md` to see the structure meanings. */
export interface GearSelections {
  /** Gear selections for the main hand. */
  MainHand: Map<number, number>;
  OffHand: Map<number, number>;
  HeadAttire: Map<AttireAffix, number>;
  BodyAttire: Map<AttireAffix, number>;
  HandsAttire: Map<AttireAffix, number>;
  LegsAttire: Map<AttireAffix, number>;
  FeetAttire: Map<AttireAffix, number>;
  Earrings: Map<AccessoryAffix, number>;
  Necklace: Map<AccessoryAffix, number>;
  Wrist: Map<AccessoryAffix, number>;
  Rings: Map<AccessoryAffix, number>;
}