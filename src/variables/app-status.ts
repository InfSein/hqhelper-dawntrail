import PackageJson from '../../package.json'

class AppStatus {
  static get Version() {
    return PackageJson.version
  }
  static get SupportedGameVersion() {
    return {
      CN: '7.0',
      GLOBAL: '7.05'
    }
  }
}

export default AppStatus