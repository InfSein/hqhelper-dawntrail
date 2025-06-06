import PackageJson from '../../package.json'

class AppStatus {
  static get Version() {
    return PackageJson.version
  }
  static get SupportedGameVersion() {
    return {
      CN: '7.15',
      GLOBAL: '7.21'
    }
  }
}

export default AppStatus