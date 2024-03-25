import PackageJson from '../../package.json'

class AppStatus {
  static get Version() {
    return PackageJson.version
  }
}

export default AppStatus