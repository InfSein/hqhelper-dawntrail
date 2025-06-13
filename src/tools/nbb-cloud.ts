import type { Ref } from "vue"
import { createAlova } from "alova"
import { useRequest } from "alova/client"
import adapterFetch from "alova/fetch"
import vueHook from "alova/vue"
import { type CloudConfigModel } from '@/models/config-cloud'
import type {
  HqList,
  NbbResponse,
  ResdataRegisterAndLogin,
  ResdataGetList, ResdataSetList
} from '@/models/nbb-cloud'
import { md5 } from "./md5"

export const useNbbCloud = (
  cloudConfig: Ref<CloudConfigModel>,
) => {
  const alovaApi = createAlova({
    baseURL: 'https://cloud.nbb.ffxiv.cn',
    statesHook: vueHook,
    requestAdapter: adapterFetch(),
    beforeRequest(method) {
      // meta传入ignoreToken为true时，将不会添加token
      if (!method.meta?.ignoreToken) {
        method.config.headers.authorization = cloudConfig.value.nbb_account_token
      }
    },
    responded: (res) => {
      if (res.status >= 400) {
        throw Promise.reject(new Error(res.statusText))
      }
      return res.json()
    }
  })
  const doNbbPost = async <T = any> (
    url: string,
    data: any,
    ignoreToken = false,
  ) : Promise<NbbResponse<T>> => {
    return new Promise(resolve => {
      const { send: handlePost, onSuccess, onError } = useRequest(
        () => alovaApi.Post(url, data),
        {
          meta: {
            ignoreToken: ignoreToken
          },
          immediate: false,
        }
      )

      onSuccess((event: any) => {
        const { data } = event
        console.log(
          `[NBB.Cloud] Post to ${url} succeed.\n`,
          data
        )
        resolve(data as NbbResponse<T>)
      })
      onError((error: any) => {
        console.error(
          `[NBB.Cloud] Post to ${url} occurred an error.\n`,
          error
        )
        resolve({
          errno: 1,
          errmsg: error.message,
          data: error
        })
      })

      handlePost()
    })
  }

  const sendVerify = async (email: string) => {
    const response = await doNbbPost('/user/pycode', {email})
    return response.errmsg
  }
  const sendVerifyForResetPassword = async (email: string) => {
    const response = await doNbbPost('/user/pwdcode', {email})
    return response.errmsg
  }

  /**
   * 注册
   * @param nickname 昵称
   * @param loginname 登录名
   * @param code 验证码
   * @param avatar 头像ID
   */
  const register = async (
    email: string,
    nickname: string,
    loginname: string,
    password: string,
    code: string,
    avatar?: number,
  ) => {
    const encryptedPassword = md5(password)
    const response = await doNbbPost<ResdataRegisterAndLogin>(
      '/user/reg',
      {
        email, nickname, loginname,
        password: encryptedPassword,
        code, avatar
      },
      true
    )
    return response
  }
  const login = async (
    name: string, password: string
  ) => {
    const encryptedPassword = md5(password)
    const response = await doNbbPost<ResdataRegisterAndLogin>(
      '/user/login',
      { name, password: encryptedPassword, },
      true
    )
    return response
  }

  const resetPassword = async (
    email: string, password: string, code: string
  ) => {
    const encryptedPassword = md5(password)
    const response = await doNbbPost(
      '/user/pwdchange',
      { email, password: encryptedPassword, code },
      true
    )
    return response
  }
  const resetNickName = async (nickname: string) => {
    const response = await doNbbPost(
      '/user/upnickname',
      { nickname }
    )
    return response
  }
  const resetAvatar = async (avatar: number) => {
    const response = await doNbbPost(
      '/user/upavatar',
      { avatar }
    )
    return response
  }

  const getList = async (type: HqList) => {
    const response = await doNbbPost<ResdataGetList>(
      '/cloud/synclist',
      { type }
    )
    return response
  }
  const addList = async (
    type: HqList, content: string
  ) => {
    const desc = `hqhelper-list-${type}`
    const response = await doNbbPost<ResdataSetList>(
      '/cloud/addlist',
      { type, desc, content }
    )
    return response
  }
  const editList = async (
    type: HqList, content: string
  ) => {
    const desc = `hqhelper-list-${type}`
    const response = await doNbbPost<ResdataSetList>(
      '/cloud/addlist',
      { type, desc, content }
    )
    return response
  }

  return {
    /** 向邮箱发送验证码 */
    sendVerify,
    /** 向邮箱发送验证码(用语修改密码) */
    sendVerifyForResetPassword,
    /**
     * 注册
     * @param nickname 昵称
     * @param loginname 登录名
     * @param code 验证码
     * @param avatar 头像ID
     */
    register,
    /** 登录 */
    login,
    /** 修改密码 */
    resetPassword,
    /** 修改昵称 */
    resetNickName,
    /** 修改头像 */
    resetAvatar,
    getList, addList, editList,
  }
}

