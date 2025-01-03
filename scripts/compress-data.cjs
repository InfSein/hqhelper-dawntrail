/* eslint-disable no-undef */
const fs = require('fs')
const path = require('path')

console.log('[scripts/compress-data.cjs] Starting data compression...')

const placeNameFullPath = path.resolve(__dirname, '../src/assets/data/unpacks/raw/place-name.full.json')
const placeNamePath = path.resolve(__dirname, '../src/assets/data/unpacks/place-name.json')
const territoryFullPath = path.resolve(__dirname, '../src/assets/data/unpacks/raw/territory.full.json')
const territoryPath = path.resolve(__dirname, '../src/assets/data/unpacks/territory.json')

const placeNameFull = JSON.parse(fs.readFileSync(placeNameFullPath, 'utf8'))
const territoryFull = JSON.parse(fs.readFileSync(territoryFullPath, 'utf8'))

const gatheringItems = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/assets/data/unpacks/gathering-item.json'), 'utf8'))
const maps = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/assets/data/unpacks/maps.json'), 'utf8'))

console.log('[scripts/compress-data.cjs] Raw data have been loaded.')

// 获取用到的 territories
const territories = []
Object.values(gatheringItems).forEach(item => {
  if (item.territory && !territories.includes(item.territory)) {
    territories.push(item.territory)
  }
})

// 获取用到的 place_ids
const placeIds = []
territories.forEach(territory => {
  const territoryData = territoryFull[territory]
  if (territoryData?.length > 2) {
    const placeId = territoryFull[territory][2]
    if (!placeIds.includes(placeId)) {
      placeIds.push(placeId)
    }
  }
})
Object.values(gatheringItems).forEach(item => {
  if (item.place && !placeIds.includes(item.place)) {
    placeIds.push(item.place)
  }
})
Object.values(maps).forEach(map => {
  const keys = ['regionId', 'zoneId', 'placeId']
  keys.forEach(key => {
    if (map?.[key] && !placeIds.includes(map[key])) {
      placeIds.push(map[key])
    }
  })
  map?.aetherytes?.forEach(aetheryte => {
    if (aetheryte?.placeId && !placeIds.includes(aetheryte.placeId)) {
      placeIds.push(aetheryte.placeId)
    }
  })
})
placeIds.sort((a, b) => a - b)

// 组装压缩后的 territory.json
const territory = {}
for (const territoryId of territories) {
  if (!territoryFull[territoryId]) {
    console.error(`[scripts/compress-data.cjs] Missing territory for territoryId ${territoryId}`)
  } else {
    territory[territoryId] = territoryFull[territoryId]
  }
}

// 与现存的 territory.json 对比，有变化才执行写入
const originTerritory = JSON.parse(fs.readFileSync(territoryPath, 'utf8'))
const territoryFileChanged = JSON.stringify(territory) !== JSON.stringify(originTerritory)
if (territoryFileChanged) {
  console.log('[scripts/compress-data.cjs] territory.json has changed, writing to file...')
  fs.writeFileSync(territoryPath, JSON.stringify(territory, null, 2), 'utf8')
} else {
  console.log('[scripts/compress-data.cjs] territory.json has not changed.')
}

// 组装压缩后的 place-name.json
const placeName = {}
for (const placeId of placeIds) {
  if (!placeNameFull[placeId]) {
    console.error(`[scripts/compress-data.cjs] Missing place name for placeId ${placeId}`)
  } else {
    placeName[placeId] = placeNameFull[placeId]
  }
}

// 与现存的 place-name.json 对比，有变化才执行写入
const originPlaceName = JSON.parse(fs.readFileSync(placeNamePath, 'utf8'))
const placeFileChanged = JSON.stringify(placeName) !== JSON.stringify(originPlaceName)

if (placeFileChanged) {
  console.log('[scripts/compress-data.cjs] place-name.json has changed, writing to file...')
  fs.writeFileSync(placeNamePath, JSON.stringify(placeName, null, 2), 'utf8')
} else {
  console.log('[scripts/compress-data.cjs] place-name.json has not changed.')
}
