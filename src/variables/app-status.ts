import PackageJson from '../../package.json'

class AppStatus {
  static get Version() {
    return PackageJson.version
  }
  static get SupportedGameVersion() {
    return {
      CN: '7.31',
      GLOBAL: '7.31'
    }
  }
}

export default AppStatus