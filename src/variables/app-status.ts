import PackageJson from '../../package.json'

class AppStatus {
  static get Version() {
    return PackageJson.version
  }
  static get SupportedGameVersion() {
    return {
      CN: '7.38',
      GLOBAL: '7.38'
    }
  }
}

export default AppStatus