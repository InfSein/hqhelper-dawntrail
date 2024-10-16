export const drawMap = (
  mapSrc: string, 
  mapSize: number,
  flags: { src: string, x: number, y: number, size?: number }[]
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if (!context) {
      return reject('Canvas context not available')
    }

    const mapImage = new Image()
    mapImage.src = mapSrc

    mapImage.onload = () => {
      /* 
        -- 坐标规则
        从左上角到右下角，从(1,1)开始，到(41,41)结束
        因此计算flag位置时，需要先减1，然后除以40(mapSize)，最后乘以地图实际大小(像素大小)
       */

      canvas.width = mapSize
      canvas.height = mapSize

      const _MAP_SCALE = mapSize / 40

      // 绘制缩放后的地图图片到 canvas 上
      context.drawImage(mapImage, 0, 0, canvas.width, canvas.height)

      // 遍历 flags 数组，逐个加载并绘制旗帜
      const flagPromises = flags.map(flag => {
        return new Promise<void>((flagResolve, flagReject) => {
          const flagImage = new Image()
          flagImage.src = flag.src

          flagImage.onload = () => {
            const size = flag.size || 16

            // 计算缩放后的坐标，以 flag 的中心点为基准
            const scaledX = (flag.x - 1) * _MAP_SCALE - (size / 2)
            const scaledY = (flag.y - 1) * _MAP_SCALE - (size / 2)

            // 绘制旗帜图片到 canvas 上指定的坐标和尺寸
            context.drawImage(flagImage, scaledX, scaledY, size, size)
            flagResolve()
          }

          flagImage.onerror = flagReject
        })
      })

      // 等待所有旗帜加载完成
      Promise.all(flagPromises)
        .then(() => {
          // 将 canvas 转换为 base64 的图片数据
          const dataUrl = canvas.toDataURL('image/png')
          resolve(dataUrl) // 返回绘制好的图片的 base64 URL
        })
        .catch(reject)
    }

    mapImage.onerror = reject
  })
}