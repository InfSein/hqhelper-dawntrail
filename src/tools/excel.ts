import XLSX from 'xlsx'

import {
  XivJobs, XivGearAffixes
} from '@/assets/data'
import { attireAffixes, accessoryAffixes, type GearSelections, type AttireAffix, type AccessoryAffix, fixGearSelections } from "@/models/gears"
import { getItemInfo, getStatementData, type ItemInfo } from './item'

export const export2Excel = (
  gearSelections: GearSelections,
  statistics: any,
  tomeScriptItems: Record<number, ItemInfo[]>,
  normalGathering: ItemInfo[],
  limitedGathering: ItemInfo[],
  aethersands: ItemInfo[],
  crystals: ItemInfo[],
  ui_lang: 'zh' | 'ja' | 'en',
  item_lang: 'zh' | 'ja' | 'en',
  t: (message: string, ...args: any[]) => string,
  file_name?: string
) => {
  const workBook = XLSX.utils.book_new()

  let tableData : string[][]
  let workSheet : XLSX.WorkSheet

  const statements = getStatementData(statistics)
  const getItemName = (item: ItemInfo) => {
    return item[`name_${item_lang}`] || '???'
  }
  /** 自动调整列宽 */
  const calculateColumnWidths = (data: any[][]) => {
    const bit = (ui_lang === 'en' || item_lang === 'en') ? 1.2 : 2
    return data[0].map((_, colIndex) => ({
      wch: Math.max(
        ...data.map(row => (row[colIndex] ? row[colIndex].toString().length * bit : 0))
      )
    }));
  }
  /** 设置样式 */
  const setWorkSheetStyle = (ws: XLSX.WorkSheet) => {
    for (const cell in ws) {
      if (cell[0] === '!') continue; // 跳过非单元格属性
      const cellAddress = XLSX.utils.decode_cell(cell);
      ws[cell].s = {
        font: {
          bold: cellAddress.r === 0 // 如果是第一行，设置字体加粗
          // todo: 目前没生效，以后搞吧
        }
      };
    }
  }

  // #region 已选部件
  tableData = [
    [
      t('职业/词缀'),
      t('主手'), t('副手'),
      t('头部'), t('身体'), t('手部'), t('腿部'), t('脚部'),
      t('耳坠'),  t('项链'), t('手镯'), t('戒指')
    ]
  ]

  // 处理各职业主副手
  Object.keys(XivJobs).forEach(_jobid => {
    const jobId = Number(_jobid)
    const job = XivJobs[jobId]
    let name = '???'
    switch (ui_lang) {
      case 'zh':
        name = job.job_name_zh
        break
      case 'ja':
        name = job.job_name_ja
        break
      case 'en':
        name = job.job_name_en
        break
    }
    const mainCount = gearSelections.MainHand[jobId]
    const offCount = gearSelections.OffHand[jobId]
    if (mainCount || offCount) {
      const rowData : string[] = [
        name,
        mainCount.toString(),
        offCount.toString(),
        '', '', '', '', '',
        '', '', '', ''
      ]
      tableData.push(rowData)
    }
  })
  // 处理防具/首饰词缀
  const affixes : (AttireAffix | AccessoryAffix)[] = [
    ...new Set([
      ...attireAffixes,
      ...accessoryAffixes
    ])
  ]
  affixes.forEach(affix => {
    const affixData = XivGearAffixes[affix]
    let name = '???'
    switch (ui_lang) {
      case 'zh':
        name = affixData.name_zh
        break
      case 'ja':
        name = affixData.name_ja
        break
      case 'en':
        name = affixData.name_en
        break
    }

    const attireValid = attireAffixes.includes(affix as AttireAffix)
    const accessoryValid = accessoryAffixes.includes(affix as AccessoryAffix)
    const rowCounts : (string | number)[] = []

    if (attireValid) {
      const attireAffix = affix as AttireAffix
      rowCounts.push(
        gearSelections.HeadAttire[attireAffix] || 0,
        gearSelections.BodyAttire[attireAffix] || 0,
        gearSelections.HandsAttire[attireAffix] || 0,
        gearSelections.LegsAttire[attireAffix] || 0,
        gearSelections.FeetAttire[attireAffix] || 0
      )
    } else {
      rowCounts.push(
        '', '', '', '', ''
      )
    }
    if (accessoryValid) {
      const accessoryAffix = affix as AccessoryAffix
      rowCounts.push(
        gearSelections.Earrings[accessoryAffix] || 0,
        gearSelections.Necklace[accessoryAffix] || 0,
        gearSelections.Wrist[accessoryAffix] || 0,
        gearSelections.Rings[accessoryAffix] || 0
      )
    } else {
      rowCounts.push(
        '', '', '', ''
      )
    }
    
    let rowTotal = 0
    rowCounts.forEach(count => {
      rowTotal += Number(count)
    })

    if (rowTotal > 0) {
      tableData.push([
        name,
        '', '',
        ...rowCounts.map(item => String(item))
      ])
    }
  })
  
  workSheet = XLSX.utils.aoa_to_sheet(tableData)
  workSheet['!cols'] = calculateColumnWidths(tableData)
  setWorkSheetStyle(workSheet)
  XLSX.utils.book_append_sheet(workBook, workSheet, t('已选部件'))
  // #endregion

  // #region 成品清单
  tableData = [
    [
      t('道具名'),
      t('制作职业'),
      t('数量')
    ]
  ]

  const craftTargets = statements.craftTargets
  craftTargets.forEach(item => {
    if (item.amount) {
      let craftJobName = '???'
      const craftJobId = item.craftInfo?.jobId
      if (craftJobId) {
        switch (ui_lang) {
          case 'zh':
            craftJobName = XivJobs[craftJobId]?.job_name_zh ?? `NOTFOUND(${craftJobId})`
            break
          case 'ja':
            craftJobName = XivJobs[craftJobId]?.job_name_ja ?? `NOTFOUND(${craftJobId})`
            break
          case'en':
            craftJobName = XivJobs[craftJobId]?.job_name_en ?? `NOTFOUND(${craftJobId})`
            break
        }
      }
      tableData.push([
        getItemName(item),
        craftJobName,
        item.amount.toString()
      ])
    }
  })
  
  workSheet = XLSX.utils.aoa_to_sheet(tableData)
  workSheet['!cols'] = calculateColumnWidths(tableData)
  setWorkSheetStyle(workSheet)
  XLSX.utils.book_append_sheet(workBook, workSheet, t('成品清单'))
  // #endregion

  // #region 直接素材统计
  tableData = [
    [
      t('道具名'),
      t('数量')
    ]
  ]

  const directMaterials = statements.materialsLv1
  directMaterials.forEach(item => {
    const itemGroupId = statistics.lvBase[item.id]?.uc ?? 0
    if (item.amount && itemGroupId !== 59) { // 排除水晶
      tableData.push([
        getItemName(item),
        item.amount.toString()
      ])
    }
  })
  
  workSheet = XLSX.utils.aoa_to_sheet(tableData)
  workSheet['!cols'] = calculateColumnWidths(tableData)
  setWorkSheetStyle(workSheet)
  XLSX.utils.book_append_sheet(workBook, workSheet, t('直接素材统计'))
  // #endregion

  // #region 点数统计
  tableData = [
    [
      t('道具名'),
      t('点数类型'),
      t('数量')
    ]
  ]

  Object.keys(tomeScriptItems).forEach(tsKey => {
    const tomeScriptId = Number(tsKey)
    const tomeScript = getItemInfo(tomeScriptId)
    const items = tomeScriptItems[tomeScriptId]
    items.forEach(item => {
      if (item.amount) {
        tableData.push([
          getItemName(item),
          getItemName(tomeScript),
          item.amount.toString(),
        ])
      }
    })
  })
  
  workSheet = XLSX.utils.aoa_to_sheet(tableData)
  workSheet['!cols'] = calculateColumnWidths(tableData)
  setWorkSheetStyle(workSheet)
  XLSX.utils.book_append_sheet(workBook, workSheet, t('点数统计'))
  // #endregion

  // #region 采集品(普通)统计
  tableData = [
    [
      t('道具名'),
      t('数量')
    ]
  ]
  
  normalGathering.forEach(item => {
    if (item.amount) {
      tableData.push([
        getItemName(item),
        item.amount.toString()
      ])
    }
  })
  
  workSheet = XLSX.utils.aoa_to_sheet(tableData)
  workSheet['!cols'] = calculateColumnWidths(tableData)
  setWorkSheetStyle(workSheet)
  XLSX.utils.book_append_sheet(workBook, workSheet, t('采集品(普通)统计'))
  // #endregion

  // #region 采集品(限时)统计
  tableData = [
    [
      t('道具名'),
      t('数量')
    ]
  ]
  
  limitedGathering.forEach(item => {
    if (item.amount) {
      tableData.push([
        getItemName(item),
        item.amount.toString()
      ])
    }
  })
  
  workSheet = XLSX.utils.aoa_to_sheet(tableData)
  workSheet['!cols'] = calculateColumnWidths(tableData)
  setWorkSheetStyle(workSheet)
  XLSX.utils.book_append_sheet(workBook, workSheet, t('采集品(限时)统计'))
  // #endregion
  
  // #region 灵砂统计
  tableData = [
    [
      t('道具名'),
      t('数量')
    ]
  ]
  
  aethersands.forEach(item => {
    if (item.amount) {
      tableData.push([
        getItemName(item),
        item.amount.toString()
      ])
    }
  })
  
  workSheet = XLSX.utils.aoa_to_sheet(tableData)
  workSheet['!cols'] = calculateColumnWidths(tableData)
  setWorkSheetStyle(workSheet)
  XLSX.utils.book_append_sheet(workBook, workSheet, t('灵砂统计'))
  // #endregion

  // #region 水晶统计
  tableData = [
    [
      t('道具名'),
      t('数量')
    ]
  ]
  
  crystals.forEach(item => {
    if (item.amount) {
      tableData.push([
        getItemName(item),
        item.amount.toString()
      ])
    }
  })
  
  workSheet = XLSX.utils.aoa_to_sheet(tableData)
  workSheet['!cols'] = calculateColumnWidths(tableData)
  setWorkSheetStyle(workSheet)
  XLSX.utils.book_append_sheet(workBook, workSheet, t('水晶统计'))
  // #endregion

  function generateFileName() {
    const now = new Date()
    const formattedDate = now.toISOString().slice(0, 10) // YYYY-MM-DD
    const formattedTime = now.toTimeString().slice(0, 8).replace(/:/g, '') // HHMMSS
    const fileName = `hqhelper-export_${formattedDate}T${formattedTime}.xlsx`
    return fileName
  }
  const name = file_name || generateFileName() // 保存的文件名
  XLSX.writeFile(workBook, name)
}

export const importExcel = (file: File) : Promise<GearSelections> => {
  // all fucking from ai generate, but it works
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const tableData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][]

        // 初始化结果
        const gearSelections: GearSelections = fixGearSelections()

        // 解析表头
        // const headers = tableData[0]
        const dataRows = tableData.slice(1)

        dataRows.forEach((row) => {
          const name = row[0]
          if (!name) return

          // 职业数据
          if (row[1] || row[2]) {
            // 主副手解析
            const job = Object.values(XivJobs).find(
              (job) => job.job_name_zh === name || job.job_name_ja === name || job.job_name_en === name
            )
            if (job) {
              const jobId = job.job_id
              gearSelections.MainHand[jobId] = parseInt(row[1] || '0', 10)
              gearSelections.OffHand[jobId] = parseInt(row[2] || '0', 10)
            }
          } else {
            // 词缀数据解析
            const affix = Object.values(XivGearAffixes).find(
              (affix) =>
                affix.name_zh === name || affix.name_ja === name || affix.name_en === name
            )
            if (affix) {
              const counts = row.slice(3).map((count) => parseInt(count || '0', 10))

              const attireCounts = counts.slice(0, 5)
              const accessoryCounts = counts.slice(5)

              if (attireCounts.some((count) => count > 0)) {
                const id = affix.key as AttireAffix
                gearSelections.HeadAttire[id] = attireCounts[0]
                gearSelections.BodyAttire[id] = attireCounts[1]
                gearSelections.HandsAttire[id] = attireCounts[2]
                gearSelections.LegsAttire[id] = attireCounts[3]
                gearSelections.FeetAttire[id] = attireCounts[4]
              }

              if (accessoryCounts.some((count) => count > 0)) {
                const id = affix.key as AccessoryAffix
                gearSelections.Earrings[id] = accessoryCounts[0]
                gearSelections.Necklace[id] = accessoryCounts[1]
                gearSelections.Wrist[id] = accessoryCounts[2]
                gearSelections.Rings[id] = accessoryCounts[3]
              }
            }
          }
        })

        resolve(gearSelections)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = (error) => reject(error)
    reader.readAsArrayBuffer(file)
  })
}