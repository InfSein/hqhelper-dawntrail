import PackageJson from '../../package.json'

class AppStatus {
  static get Version() {
    return PackageJson.version
  }
  static get SupportedGameVersion() {
    return {
      CN: '7.25',
      GLOBAL: '7.3'
    }
  }
}

export default AppStatus