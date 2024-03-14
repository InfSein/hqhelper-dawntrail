class AppStatus {
  static get Mobile() {
    return window.innerHeight > window.innerWidth
  }
}

export default AppStatus