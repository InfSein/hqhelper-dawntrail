import PackageJson from '../../package.json'

class AppStatus {
  static get Version() {
    return PackageJson.version
  }
  static get SupportedGameVersion() {
    return {
      CN: '7.11',
      GLOBAL: '7.18'
    }
  }
}

export default AppStatus