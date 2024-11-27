// 字符集映射
const charMap: Record<string, number> = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  ',': 10, ':': 11
};

// 反向映射
const reverseCharMap: Record<number, string> = Object.fromEntries(
  Object.entries(charMap).map(([key, value]) => [value, key])
);

// 预处理对象
const encryptMap = (input: Record<number, number>) => {
  let s = ''
  for (const key in input) {
    if (s) s += ','
    s += `${key}:${input[key]}`
  }
  return s
}
const decryptMap = (input: string) => {
  const pairs = input.split(',')
  const result: Record<number, number> = {}
  for (const pair of pairs) {
    const [key, value] = pair.split(':').map(Number)
    result[key] = value
  }
  return result
}

// 压缩函数
export const compress = (input: Record<number, number>) => {
  const s = encryptMap(input)
  let num = 0n; // 使用大整数存储
  for (let i = 0; i < s.length; i++) {
    num = num * 12n + BigInt(charMap[s[i]]);
  }

  // 将大整数转为一个Base36字符串，压缩为更短的表示
  return num.toString(36);
}

// 解压函数
export const decompress = (input: string) => {
  const num = BigInt('0x' + input); // 先将Base36转换为大整数
  let result = '';
  let temp = num;

  // 逐步恢复字符
  while (temp > 0n) {
    const digit = Number(temp % 12n);
    result = reverseCharMap[digit] + result;
    temp = temp / 12n;
  }

  return decryptMap(result);
}