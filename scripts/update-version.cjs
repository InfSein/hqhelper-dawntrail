const fs = require('fs')
const path = require('path')

const versionJsonPath = path.resolve(__dirname, '../public/version.json')
const packageJsonPath = path.resolve(__dirname, '../package.json')

// 读取 package.json 中的版本号
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const newVersion = packageJson.version

// 检查 version.json 是否存在
let versionJsonContent = {}

// 如果 version.json 存在，读取现有内容
if (fs.existsSync(versionJsonPath)) {
  const existingVersionJson = fs.readFileSync(versionJsonPath, 'utf8')
  versionJsonContent = JSON.parse(existingVersionJson)
}

// 更新 hqhelper 字段
versionJsonContent.hqhelper = newVersion

// 写入更新后的内容到 version.json
fs.writeFileSync(versionJsonPath, JSON.stringify(versionJsonContent, null, 2), 'utf8')

console.log(`Version updated to ${newVersion}`)
