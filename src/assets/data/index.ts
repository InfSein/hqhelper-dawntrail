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