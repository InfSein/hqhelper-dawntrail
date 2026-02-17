export const handleGetPriceError = (error: any, t: (message: string, args?: any) => string) => {
  console.error(error)
  let errMsg = error?.message as string
  if (!errMsg) {
    errMsg = error
  } else {
    if (errMsg.match(/timeout of ([\d]+)ms exceeded/)) {
      errMsg = t('common.message.get_price_timeout')
    } else if (errMsg.includes('ECONNRESET')) {
      errMsg = t('common.message.get_price_network_error')
    }
  }
  return errMsg
}
