import JsonXivItemRemarks from './translations/xiv-item-remarks.json'
export const XivItemRemarks = JsonXivItemRemarks as Record<number, string[]>

import JsonXivRecipes from './unpacks/recipe.json'
export const XivRecipes = JsonXivRecipes as Record<number, {
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
}>

import JsonXivJobs from './xiv-jobs.json'
export interface XivJob {
  job_id: number
  job_name_en: string
  job_name_zh: string
  job_name_ja: string
  job_icon_url: string
}
export const XivJobs = JsonXivJobs as Record<number, XivJob>

import JsonXivGearAffixes from './xiv-gear-affixes.json'
import type {
  AttireAffix, AccessoryAffix
} from '@/models/gears'
export const XivGearAffixes = JsonXivGearAffixes as Record<AttireAffix | AccessoryAffix, {
  affix_name_zh: string,
  affix_name_ja: string,
  affix_name_en: string
}>

import JsonXivMaps from './xiv-maps.json'
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
/**
 * 地图信息,因包体大小控制一般只会包括最新资料片的地图,须在处理旧版本地图时多加注意
 * * `key`: placeID
 */
export const XivMaps = JsonXivMaps as Record<number, XivMapInfo>

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