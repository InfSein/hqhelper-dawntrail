import PackageJson from '../../package.json'

class AppStatus {
  static get Version() {
    return PackageJson.version
  }
  static get SupportedGameVersion() {
    return {
      CN: '7.2',
      GLOBAL: '7.25'
    }
  }
}

export default AppStatus