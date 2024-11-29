import clipBoard from "vue-clipboard3"

const Clip = clipBoard
const { toClipboard } = Clip()

export const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 将给定文本复制到设备的剪贴板。
 * @param text 要复制的文本
 * @param container 在模态框中调用此函数必须传入模态框中的某个div容器的ref-value
 * @returns 如果成功，返回空字符串。否则返回"ERROR"。
 */
export const CopyToClipboard = async (text: string, container?: HTMLElement | undefined | null) => {
  try {
    if (window.electronAPI?.copyText) {
      const err = await window.electronAPI.copyText(text)
      return err ? 'ERROR' : ''
    } else {
      await toClipboard(text, container ?? undefined)
      return ''
    }
  } catch (e) {
    console.warn('Copy to clipboard action failed due to', e)
    return 'ERROR'
  }
}

/**
 * 调用系统默认浏览器打开给定网页
 * @param url 要打开的网页地址
 */
export const visitUrl = (url: string) => {
  const func = window.electronAPI?.openUrlByBrowser ?? window.open
  func(url)
}

/**
 * 播放音频
 * @param source 音频src
 */
export const playAudio = (source: string) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

  fetch(source)
    .then(response => response.arrayBuffer())
    .then(data => audioContext.decodeAudioData(data))
    .then(buffer => {
      const source = audioContext.createBufferSource()
      source.buffer = buffer
      source.connect(audioContext.destination)
      source.start(0)
    })
    .catch(error => {
      alert("播放失败：\n"+ error)
    })
}
