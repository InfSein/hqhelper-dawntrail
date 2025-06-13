export enum HqList {
  keep = 5,
}

export interface NbbResponse <T = any> {
  /** 状态码。0成功 1失败 */
  errno: 0 | 1,
  /** 成功时为 `success`, 否则为失败信息 */
  errmsg: string,
  /** 可能是 `{}` 或 `[]` */
  data: T,
}

export interface ResdataRegisterAndLogin {
  uid: number,
  nickname: string,
  loginname: string,
  email: string,
  token: string,
  country: string,
  datacenter: string,
  world: string,
  avatar: string,
}
export interface ResdataGetList {
  id: number,
  type: number,
  desc: string,
  hash: string,
  content: string,
}
export interface ResdataSetList {
  id: number,
  hash: string,
}