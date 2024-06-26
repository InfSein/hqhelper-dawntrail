export interface UpdateLog {
  /** 版本号，格式如`1.2.3` */
  version: string;
  /** 更新类型 */
  type: "major" | "minor" | "patch";
  /** 更新日期 */
  date: string;
  /** 更新内容 */
  content: Record<string, string[]>;
  /** 与之前的版本之间的更新日志是否不连贯，这一般出现在早期开发阶段中 */
  discontinuous: boolean;
}

/** 将`CHANGELOG.md`的内容转换为`UpdateLog[]`格式的对象 */
export const convertToUpdateLogs = (changelog: string) => {
  const lines = changelog.split('\n')
  const updateLogs: UpdateLog[] = []
  let previousLog: UpdateLog | null = null
  let currentLog: UpdateLog | null = null

  lines.forEach(line => {
    const versionMatch = line.match(/^##\s+(.+?)\s+\((\d{4}-\d{2}-\d{2})\)/)
    if (versionMatch) {
      if (currentLog) {
        previousLog = currentLog
        updateLogs.push(currentLog)
      }
      const version = versionMatch[1]
      const date = versionMatch[2]
      currentLog = { version, type: 'patch', date, content: {}, discontinuous: false }
      if (previousLog) {
        dealVersions(previousLog, currentLog)
      }
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

/** 格式不标准的版本号，这些版本号将被认定为大型版本更新 */
const majorVersions = [
  '项目成立', 'Project Established', 'プロジェクト開発開始'
]
/** 处理前后两个版本。由于CHANGELOG默认顺序是从新到旧，所以一般`previousVersion`是新版本，`currentVersion`是旧版本 */
function dealVersions(previousVersion: UpdateLog, currentVersion: UpdateLog) {
  if (majorVersions.includes(previousVersion.version)) {
    previousVersion.type = "major"
  } else {
    const _cv = majorVersions.includes(currentVersion.version) ? '0.0.0' : currentVersion.version
    const [prevMajor, prevMinor/*, prevPatch*/] = previousVersion.version.split('.').map(Number)
    const [currMajor, currMinor/*, currPatch*/] = _cv.split('.').map(Number)
    if (prevMajor > currMajor) {
      previousVersion.type = "major"
    } else if (prevMinor > currMinor) {
      previousVersion.type = "minor"
    } else {
      previousVersion.type = "patch"
    }
  }
  
  if (majorVersions.includes(currentVersion.version)) {
    previousVersion.discontinuous = true
    currentVersion.type = "major"
  }
}