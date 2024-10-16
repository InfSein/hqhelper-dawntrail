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
  map_src: string
}
/**
 * 地图信息,因包体大小控制一般只会包括最新资料片的地图,须在处理旧版本地图时多加注意
 * * `key`: placeID
 */
export const XivMaps = JsonXivMaps as Record<number, XivMapInfo>