const datastr = `PARSE_TABLE_TEXT_HERE`

const data = datastr.split('\n').map(line => {
  const elements = line.split('\t')
  return {
    gcd: elements[0],
    job: elements[1],
    gearid: elements[2]
  }
})

const existedKeys = {}
let startIndex = 32

const result = {}
data.forEach(gearset => {
  if (existedKeys[gearset.job]) {
    existedKeys[gearset.job]++
  } else {
    existedKeys[gearset.job] = 1
  }

  const geardata = {
    title_zh: `${gearset.job}开荒配装${existedKeys[gearset.job]}`,
    title_en: 'Class-Specific Starter',
    title_ja: '',
    gcd: Number(gearset.gcd),
    author: '孤风行',
    set_no: gearset.gearid
  }
  result[startIndex++] = geardata
})
console.log(JSON.stringify(result, null, 2))