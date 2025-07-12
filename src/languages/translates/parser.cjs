const fs = require('fs')
const path = require('path')

// 源文件路径（VoerkaI18n格式）
const sourceFile = path.resolve(__dirname, './default.json')
const textMapFile = path.resolve(__dirname, './textmap.json')

// 输出目录
const outDir = path.resolve(__dirname, './crowdin')

// 读取原始 JSON
const raw = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'))
const textMap = JSON.parse(fs.readFileSync(textMapFile, 'utf-8'))

// 用于存储每种语言的结果
const langs = {
  zh: {},
  en: {},
  ja: {}
}

for (const [key, value] of Object.entries(textMap)) {
  let text_zh = key; let text_id = value
  if (!text_id) throw new Error('text: ' + text_zh + ' not id!!!')
  const rawData = raw[text_zh]
  if (!rawData) throw new Error('text: ' + text_zh + ' not exist!!!')
  const text_en = rawData.en; const text_ja = rawData.ja
  buildPath(langs.zh, text_id, text_zh)
  buildPath(langs.en, text_id, text_en)
  buildPath(langs.ja, text_id, text_ja)
}
function buildPath(obj, text_id, val) {
  let ptr = obj
  if (!(typeof text_id === 'string')) throw new Error('invalid text_id: ' + JSON.stringify(text_id))
  const keys = text_id.split('.')
  keys.forEach((key, index) => {
    if (!key) throw new Error('invalid text_id: ' + text_id)
    const isLast = index === keys.length - 1
    if (isLast) {
      if (!ptr[key]) ptr[key] = val
      else if (typeof ptr[key] === 'object') ptr[key].title = val
      else if (val !== ptr[key]) throw new Error('duplicate text_id: ' + text_id)
    } else {
      if (!ptr[key]) ptr[key] = {}
      else if (typeof ptr[key] === 'string') ptr[key] = { title: ptr[key] }
      ptr = ptr[key]
    }
  })
}

// 确保输出目录存在
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

// 写入每个语言文件
for (const [lang, content] of Object.entries(langs)) {
  const filePath = path.join(outDir, `${lang}.json`)
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8')
  console.log(`✅ 输出 ${filePath}`)
}
