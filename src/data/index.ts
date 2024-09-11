import XivJobs from '@/assets/data/xiv-jobs.json'
export interface JobInfo {
  job_id: number,
  job_name_en: string,
  job_name_zh: string,
  job_name_ja: string,
  job_icon_url: string
}
export const jobMap = XivJobs as Record<number, JobInfo>