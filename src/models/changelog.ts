export interface UpdateLog {
  /** 版本号，格式如`1.2.3` */
  version: string;
  /** 更新类型 */
  type: "major" | "minor" | "patch";
  /** 更新日期 */
  date: string;
  /** 更新内容 */
  content: Record<string, string[]>;
}

/** 将`CHANGELOG.md`的内容转换为`UpdateLog[]`格式的对象 */
export const convertToUpdateLogs = (changelog: string) => {
  const lines = changelog.split('\n')
  const updateLogs: UpdateLog[] = []
  let currentLog: UpdateLog | null = null
  let previousVersion: string | null = null

  lines.forEach(line => {
    const versionMatch = line.match(/^##\s+(\d+\.\d+\.\d+)\s+\((\d{4}-\d{2}-\d{2})\)/)
    if (versionMatch) {
      if (currentLog) {
        updateLogs.push(currentLog)
      }
      const version = versionMatch[1]
      const date = versionMatch[2]
      const type = getType(previousVersion || '0.0.0', version)
      currentLog = { version, type, date, content: {} }
      previousVersion = version
    } else if (currentLog) {
      const sectionMatch = line.match(/^###\s+(.*)/)
      if (sectionMatch) {
        const section = sectionMatch[1]
        currentLog.content[section] = []
      } else if (line.trim().startsWith('*') && currentLog.content[Object.keys(currentLog.content).slice(-1)[0]]) {
        const section = Object.keys(currentLog.content).slice(-1)[0]
        currentLog.content[section].push(
          line.trim().slice(1).trim()
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        )
      }
    }
  })

  if (currentLog) {
    updateLogs.push(currentLog)
  }

  return updateLogs
}

function getType(previousVersion: string, currentVersion: string): "major" | "minor" | "patch" {
  const [prevMajor, prevMinor/*, prevPatch*/] = previousVersion.split('.').map(Number)
  const [currMajor, currMinor/*, currPatch*/] = currentVersion.split('.').map(Number)

  if (currMajor > prevMajor) {
    return "major"
  } else if (currMinor > prevMinor) {
    return "minor"
  } else {
    return "patch"
  }
}