import type { GearSelections } from "@/models/gears"

// * npm install xlsx file-saver --save
// 暂不安装，接口写好了再说
const XLSX : any = {}

export const export2Excel = (
  gearSelections: GearSelections
) => {
  console.log('gearSelections:', gearSelections)
  const tableData = [
    // 表头
    ['序号', '内容']
  ]
  const sampleData = [1,2,3]
  sampleData.forEach((item, index) => {
    // 表格的一行
    const rowData : string[] = [
      (index + 1).toString(),
      item.toString()
    ]
    tableData.push(rowData)
  })
  const workSheet = XLSX.utils.aoa_to_sheet(tableData);
  const bookNew = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(bookNew, workSheet, '工作表名称') // 工作表名称
  const name = 'sample.xlsx' // 保存的文件名
  XLSX.writeFile(bookNew, name)
}