export const availableAiModelValues = [
  'gemini-3-flash-preview'
] as const
export type AvailableAiModel = typeof availableAiModelValues[number]

export const defaultAiModel = availableAiModelValues[0]

export const availableAiModels : { value: AvailableAiModel, label: string }[] = [
  { value: 'gemini-3-flash-preview', label: 'Gemini 3 Flash Preview' }
]
