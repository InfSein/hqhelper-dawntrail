import AppStatus from '@/variables/AppStatus'
import i18n from '../language/i18n'

// todo: This file's code remains fatal errors.

class Dialog {
  public static _vant_dialog_default: any
  public static _vant_dialog_confirm: any
  public static _naive_dialog: any

  /**
   * Show a dialog onto the user screen.
   * @param message Dialog content.
   * @param title Dialog title (optional).
   */
  public static Show(message: string, title?: string) {
    if (AppStatus.Mobile) {
      return Dialog._vant_dialog_default({
        title: title ?? '',
        message: message,
        theme: 'round-button',
        confirmButtonText: i18n.global.t('ui.ok')
      })
    } else {
      return new Promise((resolve, reject) => {
        Dialog._naive_dialog.info({
          title: title ?? '',
          content: message,
          positiveText: i18n.global.t('ui.ok'),
          onPositiveClick: resolve,
          onMaskClick: reject,
          onEsc: reject
        })
      })
    }
  }
}

export default Dialog
