import type { Ref } from "vue"
import type { AccessoryAffix, AttireAffix, GearSelections } from "@/models/gears"
import { XivGearRecomm, XivGearSets, type HqDataVer, type XivGearSet } from "@/assets/data"

export const getGearRecomm = (patch: string, jobId: number) => {
  const result : XivGearSet[] = []
  if (XivGearRecomm[patch]?.[jobId]?.length) {
    XivGearRecomm[patch][jobId].forEach(setId => {
      result.push(XivGearSets[setId])
    })
  }
  return result
}

export const useGearAdder = () => {
  const addMainOffHand = (gearSelections: Ref<GearSelections>, patchData: HqDataVer | undefined, jobId: number) => {
    if (patchData?.mainHand?.[jobId]) {
      gearSelections.value.mainHand[jobId]++
    }
    if (patchData?.offHand?.[jobId]) {
      gearSelections.value.offHand[jobId]++
    }
  }
  const addAttire = (gearSelections: Ref<GearSelections>, patchData: HqDataVer | undefined, affix: AttireAffix) => {
    if (patchData?.headAttire?.[affix]) {
      gearSelections.value.headAttire[affix]++
    }
    if (patchData?.bodyAttire?.[affix]) {
      gearSelections.value.bodyAttire[affix]++
    }
    if (patchData?.handsAttire?.[affix]) {
      gearSelections.value.handsAttire[affix]++
    }
    if (patchData?.legsAttire?.[affix]) {
      gearSelections.value.legsAttire[affix]++
    }
    if (patchData?.feetAttire?.[affix]) {
      gearSelections.value.feetAttire[affix]++
    }
  }
  const addAccessory = (gearSelections: Ref<GearSelections>, patchData: HqDataVer | undefined, affix: AccessoryAffix) => {
    if (patchData?.earrings?.[affix]) {
      gearSelections.value.earrings[affix]++
    }
    if (patchData?.necklace?.[affix]) {
      gearSelections.value.necklace[affix]++
    }
    if (patchData?.wrist?.[affix]) {
      gearSelections.value.wrist[affix]++
    }
    if (patchData?.rings?.[affix]) {
      gearSelections.value.rings[affix] += 2
    }
  }

  return {
    addMainOffHand,
    addAttire,
    addAccessory
  }
}