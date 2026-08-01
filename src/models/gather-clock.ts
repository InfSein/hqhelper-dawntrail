export interface AlarmMacroOptions {
  clearOldAlarms: boolean;
  containsJobName: boolean;
  containsMapName: boolean;
  containsAetheryteName: boolean;
  noRepeat: boolean;
}

export const fixAlarmMacroOptions = (oriOptions?: AlarmMacroOptions) => {
  const newOptions = oriOptions ?? {} as AlarmMacroOptions
  newOptions.clearOldAlarms ??= false
  newOptions.containsJobName ??= false
  newOptions.containsMapName ??= false
  newOptions.containsAetheryteName ??= false
  newOptions.noRepeat ??= false
  return newOptions
}