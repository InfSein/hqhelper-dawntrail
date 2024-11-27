/**
 * 获取从本机到某个网站的延迟
 * @param domain 
 * @returns 如果成功PING通，返回PING值。否则返回 `timeout` 表示超时。
 */
export const checkUrlLag = async (domain: string) => {
  let url = domain
  if (!url.startsWith('https://') && !url.startsWith('http://')) url = `https://${domain}`
  const timeout = 1500
  const controller = new AbortController()
  const signal = controller.signal
  const startTime = Date.now()

  const timeoutId = setTimeout(() => {
    controller.abort() // 超时后中止请求
  }, timeout)

  try {
    let response : string | Response
    if (window.electronAPI?.httpGet) {
      response = await window.electronAPI.httpGet(url)
    } else {
      response = await fetch(url, { mode: "no-cors", signal })
    }

    if (typeof(response) !== 'string' && !response.ok && response.status) {
      throw new Error(`HTTP 错误: ${response.status}`)
    }

    const endTime = Date.now()
    const duration = endTime - startTime
    clearTimeout(timeoutId) // 请求成功，清除超时定时器
    return duration
  } catch (error) {
    console.error('GET', url, 'FAILED DUE TO\n', error)
    if (String(error).includes('CORS')) {
      return "unknown"
    }
    return "timeout"
  }
}