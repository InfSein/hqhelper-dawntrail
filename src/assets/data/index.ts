// #region Import for other ts files
import type {
  AttireAffix, AccessoryAffix,
  GearSelections
} from '@/models/gears'
import {
  parseUnpackedMapData
} from '@/tools/map'
// #endregion

// #region Translations
import JsonXivTranslatedItemDescriptions from './translations/xiv-item-descriptions.json'
export const XivTranslatedItemDescriptions = JsonXivTranslatedItemDescriptions as Record<number, string>

import JsonXivTranslatedItemNames from './translations/xiv-item-names.json'
export const XivTranslatedItemNames = JsonXivTranslatedItemNames as Record<number, string>

import JsonXivItemRemarks from './translations/xiv-item-remarks.json'
export const XivItemRemarks = JsonXivItemRemarks as Record<number, string[]>

import JsonXivTranslatedPlaces from './translations/xiv-places.json'
export const XivTranslatedPlaces = JsonXivTranslatedPlaces as Record<number, string>
// #endregion

// #region Unpacks
/*
  忽略以下 JSON:
  * src\assets\data\unpacks\hq-config.json - 因为只在 use-nbb-cal 中使用，并且已经进行了类型声明 (虽然后续可能还要改)
 */

import JsonXivUnpackedGatheringItems from './unpacks/gathering-item.json'
export const XivUnpackedGatheringItems = JsonXivUnpackedGatheringItems as Record<number, {
  type: number
  pointType?: number
  territory?: number
  place?: number
  popType?: string
  popTime?: {
    start1: string
    end1: string
    start2: string
    end2: string
    start3: string
    end3: string
  } | false
  coords?: { x: string, y: string }
}>

import JsonXivUnpackedItems from './unpacks/item.json'
export interface XivUnpackedItem {
  rids: string[]
  id: number
  lang: string[],
  icon: number
  ilv: number
  uc: number
  sc: number
  hq: boolean
  dye: number
  act: number
  bon: number
  reduce: boolean
  elv: number
  jobs: number
  ms: number
  jd: boolean
  p: string
  desc: string[]
  bpm: number[][]
  spm?: number[][]
  actParm: any[][]
  // 允许扩展
  [key: string]: any
}
export const XivUnpackedItems = JsonXivUnpackedItems as Record<number, XivUnpackedItem>

import JsonXivUnpackedMaps from './unpacks/maps.json'
export interface XivUnpackedMap {
  regionId: number
  zoneId: number
  placeId: number
  weatherRate: number
  mapId: number
  mapSrc: string
  aetherytes: {
    placeId: number
    x: number
    y: number
  }[]
}
export const XivUnpackedMaps = JsonXivUnpackedMaps as Record<number, XivUnpackedMap>

import JsonXivUnpackedPlaceNames from './unpacks/place-name.json'
/**
 * 解包的地点名称
 * * `key`: placeID
 * * `value`: placeNames，顺序 [日文, 英文, 中文]
 */
export const XivUnpackedPlaceNames = JsonXivUnpackedPlaceNames as Record<number, string[]>

import JsonXivUnpackedRecipes from './unpacks/recipe.json'
export const XivUnpackedRecipes = JsonXivUnpackedRecipes as Record<number, {
  id: number
  job: number
  it: number
  bp: number[]
  m: number[]
  rlv: number
  s: number[]
  sp1: number[]
  sp2: number[]
  sp3: number[]
  qs: boolean
  hq: boolean
  srb: number
  noteBook: number[]
}>

import JsonXivUnpackedTerritories from './unpacks/territory.json'
export const XivUnpackedTerritories = JsonXivUnpackedTerritories as Record<number, number[]>
// #endregion

// #region Other
import JsonXivAttributes from './xiv-attributes.json'
export const XivAttributes = JsonXivAttributes as Record<number, {
  name_zh: string
  name_en: string
  name_ja: string
  name_de: string
  name_fr: string
}>

import JsonXivGearAffixes from './xiv-gear-affixes.json'
export const XivGearAffixes = JsonXivGearAffixes as Record<AttireAffix | AccessoryAffix, {
  key: AttireAffix | AccessoryAffix,
  name_zh: string,
  name_ja: string,
  name_en: string
}>

import JsonXivGearRecomm from './xiv-gear-recomm.json'
import JsonXivGearSets from './xiv-gear-sets.json'
export interface XivGearSet {
  title_zh: string,
  title_ja: string,
  title_en: string,
  gcd?: number,
  author: string,
  set_no: string
}
export const XivGearRecomm = JsonXivGearRecomm as Record<string, Record<number, number[]>>
export const XivGearSets = JsonXivGearSets as Record<number, XivGearSet>

import JsonXivGearSlots from './xiv-gear-slots.json'
export const XivGearSlots = JsonXivGearSlots as Record<keyof GearSelections, {
  icon: string
}>

import JsonXivItemTypes from './xiv-item-types.json'
export const XivItemTypes = JsonXivItemTypes as Record<number, {
  id: number
  lang: string[]
  icon: number
}>

import JsonXivJobs from './xiv-jobs.json'
export interface XivJob {
  job_id: number
  short_name: string
  job_name_en: string
  job_name_zh: string
  job_name_ja: string
  job_icon_url: string
}
export const XivJobs = JsonXivJobs as Record<number, XivJob>

export interface XivMapInfo {
  name_zh: string
  name_ja: string
  name_en: string
  map_id: number
  map_src: string
  aetherytes: XivMapAetheryteInfo[]
}
export interface XivMapAetheryteInfo {
  name_zh: string
  name_ja: string
  name_en: string
  x: number
  y: number
}
export const XivMaps = parseUnpackedMapData(XivUnpackedMaps)

import JsonXivPatches from './xiv-patches.json'
export interface XivPatch {
  v: string
  name_zh: string
  name_en: string
  name_ja: string
  updated: boolean
  combat_hq_il?: number
  life_hq_il?: number
  logo: string
  background?: string
}
export const XivPatches = JsonXivPatches as XivPatch[]

import JsonXivRoles from './xiv-roles.json'
export type XivRoleKey = "tank" | "healer" | "dps_maim" | "dps_strike" | "dps_scout" | "dps_ranged" | "dps_magic" | "gatherer" | "crafter"
export interface XivRole {
  role_name_en: string
  role_name_zh: string
  role_name_ja: string
  role_color: string
  role_icon_url: string
  attire: AttireAffix
  accessory: AccessoryAffix
  jobs: number[]
}
export const XivRoles = JsonXivRoles as Record<XivRoleKey, XivRole>
// #endregion