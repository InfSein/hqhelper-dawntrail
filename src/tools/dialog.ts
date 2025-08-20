import type { VNodeChild } from "vue"
import {
  useDialog as useNaiveDialog,
  type DialogOptions as NaiveDialogOptions,
} from "naive-ui"

type DialogType = "error" | "success" | "warning" | "info"
export interface DialogOptions {
  title?: string | (() => VNodeChild)
  content?: string | (() => VNodeChild)
  type?: DialogType
  closable?: boolean
}

export const useDialog = (
  t: (message: string, args?: any) => string,
) => {
  const dialog = useNaiveDialog()

  const buildDialogOptions = (
    input: string | DialogOptions,
    defaultTitle: string,
    defaultType: DialogType,
  ): NaiveDialogOptions => {
    if (typeof input === "string") {
      return {
        title: defaultTitle,
        content: input,
        type: defaultType,
        closable: false,
      }
    } else {
      return {
        title: input.title || defaultTitle,
        content: input.content,
        type: input.type || defaultType,
        closable: input.closable ?? false,
      }
    }
  }

  const alert = (input: string | DialogOptions) : Promise<void> => {
    const options = buildDialogOptions(input, t('common.warn'), 'warning')
    return new Promise((resolve) => {
      dialog.info({
        ...options,
        positiveText: t('common.confirm'),
        onPositiveClick: () => {
          resolve()
        },
      })
    })
  }

  const confirm = (input: string | DialogOptions): Promise<boolean> => {
    const options = buildDialogOptions(input, t('common.tip'), 'info')
    return new Promise((resolve) => {
      dialog.warning({
        ...options,
        positiveText: t('common.confirm'),
        negativeText: t('common.cancel'),
        onPositiveClick: () => {
          resolve(true)
        },
        onNegativeClick: () => {
          resolve(false)
        },
      })
    })
  }

  return {
    alert,
    confirm,
  }
}
