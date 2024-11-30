import type { Ref } from "vue"
import type { AccessoryAffix, AttireAffix, GearSelections } from "@/models/gears"
import type { IHqVer } from "./nbb-cal-v5"
import { XivGearRecomm, XivGearSets, type XivGearSet } from "@/assets/data"

export const getGearRecomm = (patch: string, jobId: number) => {
  console.log(`patch: ${patch}, job: ${jobId}`)
  const result : XivGearSet[] = []
  if (XivGearRecomm[patch]?.[jobId]?.length) {
    XivGearRecomm[patch][jobId].forEach(setId => {
      result.push(XivGearSets[setId])
    })
  }
  return result
}

export const useGearAdder = () => {
  const addMainOffHand = (gearSelections: Ref<GearSelections>, patchData: IHqVer | undefined, jobId: number) => {
    if (patchData?.jobs.MainHand?.[jobId]?.[0]) {
      gearSelections.value.MainHand[jobId]++
    }
    if (patchData?.jobs.OffHand?.[jobId]?.[0]) {
      gearSelections.value.OffHand[jobId]++
    }
  }
  const addAttire = (gearSelections: Ref<GearSelections>, patchData: IHqVer | undefined, affix: AttireAffix) => {
    if (patchData?.jobs.HeadAttire?.[affix]?.[0]) {
      gearSelections.value.HeadAttire[affix]++
    }
    if (patchData?.jobs.BodyAttire?.[affix]?.[0]) {
      gearSelections.value.BodyAttire[affix]++
    }
    if (patchData?.jobs.HandsAttire?.[affix]?.[0]) {
      gearSelections.value.HandsAttire[affix]++
    }
    if (patchData?.jobs.LegsAttire?.[affix]?.[0]) {
      gearSelections.value.LegsAttire[affix]++
    }
    if (patchData?.jobs.FeetAttire?.[affix]?.[0]) {
      gearSelections.value.FeetAttire[affix]++
    }
  }
  const addAccessory = (gearSelections: Ref<GearSelections>, patchData: IHqVer | undefined, affix: AccessoryAffix) => {
    if (patchData?.jobs.Earrings?.[affix]?.[0]) {
      gearSelections.value.Earrings[affix]++
    }
    if (patchData?.jobs.Necklace?.[affix]?.[0]) {
      gearSelections.value.Necklace[affix]++
    }
    if (patchData?.jobs.Wrist?.[affix]?.[0]) {
      gearSelections.value.Wrist[affix]++
    }
    if (patchData?.jobs.Rings?.[affix]?.[0]) {
      gearSelections.value.Rings[affix] += 2
    }
  }

  return {
    addMainOffHand,
    addAttire,
    addAccessory
  }
}