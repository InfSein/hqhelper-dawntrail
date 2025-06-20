<script setup lang="ts">
import { computed, inject, reactive, ref, type Ref } from 'vue'
import {
  NAvatar, NButton, NDivider, NIcon, NInput, NInputGroup,
  useMessage,
} from 'naive-ui'
import {
  LogInOutlined, PersonAddAlt1Filled, LockResetOutlined,
  AccountCircleOutlined, KeyOutlined,
  EmailOutlined, VerifiedUserFilled,
  PersonOutlineOutlined, BadgeFilled,
  EditNoteOutlined, LabelImportantFilled, FaceRetouchingNaturalFilled,
  DoneOutlined,
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import ModalNbbAvatarSelector from './ModalNbbAvatarSelector.vue'
import { useStore } from '@/store'
import { type CloudConfigModel } from '@/models/config-cloud'
import type { NbbResponse, ResdataRegisterAndLogin } from '@/models/nbb-cloud'
import { deepCopy } from '@/tools'
import { getImgCdnUrl } from '@/tools/item'
import { useNbbCloud } from '@/tools/nbb-cloud'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const cloudConfig = inject<Ref<CloudConfigModel>>('cloudConfig')!
const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()
const {
  sendVerify, sendVerifyForResetPassword,
  register, login, resetPassword,
  resolveUserInfo,
  resetNickNameAndTitle, resetAvatar,
} = useNbbCloud(cloudConfig)

const showModal = defineModel<boolean>('show', { required: true })

interface ModalLoginProps {
  defaultTab: "login" | "register" | "edituser"
}
const props = defineProps<ModalLoginProps>()

const loginAction = ref<"login" | "register" | "resetpass" | "edituser">('login')
const verifyCooldown = ref(0)
const isVerifyCooldown = ref(false)
const isSendingVerify = ref(false)
const isSubmitting = ref(false)
const showNbbAvatarSelector = ref(false)
const loginFormData = reactive({
  account: '',
  password: '',
})
const registerFormData = reactive({
  email: '',
  nickname: '',
  loginname: '',
  password: '',
  verifycode: '',
})
const resetpassFormData = reactive({
  email: '',
  password: '',
  verifycode: '',
})
const edituserFormData = reactive({
  nickname: '',
  title: '',
  avatar: 0,
})

const onLoad = () => {
  loginAction.value = props.defaultTab
  edituserFormData.nickname = cloudConfig.value.nbb_account_nickname
  edituserFormData.title = cloudConfig.value.nbb_account_title
  edituserFormData.avatar = cloudConfig.value.nbb_account_avatar
}

const modalIcon = computed(() => {
  switch (loginAction.value) {
    case 'resetpass': return LockResetOutlined
    case 'register': return PersonAddAlt1Filled
    case 'edituser': return EditNoteOutlined
    case 'login': 
    default: return LogInOutlined
  }
})
const modalTitle = computed(() => {
  switch (loginAction.value) {
    case 'resetpass': return t('重置密码')
    case 'register': return t('注册')
    case 'edituser': return t('编辑账号信息')
    case 'login': 
    default: return t('登录')
  }
})

const verifyButtonText = computed(() =>
  isVerifyCooldown.value ? t('{count}秒后可再次发送', verifyCooldown.value) : t('发送验证码')
)
const avatarUrl = computed(() => {
  const avatarId = edituserFormData.avatar || 64384
  return getImgCdnUrl(avatarId)
})

const startCooldown = (seconds: number) => {
  verifyCooldown.value = seconds
  isVerifyCooldown.value = true

  const timer = setInterval(() => {
    verifyCooldown.value--
    if (verifyCooldown.value <= 0) {
      clearInterval(timer)
      isVerifyCooldown.value = false
    }
  }, 1000)
}
const handleCheckStrLength = (
  str: string, maxlen: number, tipkey: string
) => {
  const strlen = str.replace(/[\u4e00-\u9fa5]/g, 'aa').length
  if (strlen > maxlen) {
    return t('{key}过长', {
      key: tipkey
    })
  }
  return ''
}
const handleResponse = (
  response: NbbResponse,
  on_success = '',
  on_error = '',
  show_errmsg = true,
) => {
  if (response.errno) {
    let errmsg = ''
    if (on_error) errmsg += on_error
    if (show_errmsg) errmsg += response.errmsg
    NAIVE_UI_MESSAGE.error(errmsg)
  } else {
    const succmsg = on_success || t('操作成功')
    NAIVE_UI_MESSAGE.success(succmsg)
  }
}
const handleSaveLoginInfo = (data: ResdataRegisterAndLogin) => {
  const newCloudConfig = resolveUserInfo(data, cloudConfig.value)
  store.commit('setCloudConfig', newCloudConfig)
  appForceUpdate()
}

const handleSendVerify = async (email: string) => {
  if (!email) {
    NAIVE_UI_MESSAGE.error(t('请输入{val}', t('邮箱'))); return
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    NAIVE_UI_MESSAGE.error(t('邮箱格式错误')); return
  }
  isSendingVerify.value = true
  const verifyFunc = loginAction.value === 'resetpass' ? sendVerifyForResetPassword : sendVerify
  try {
    const response = await verifyFunc(email)
    handleResponse(response, t('已发送验证码'))
    if (!response.errno) {
      startCooldown(60)
    }
  } catch (err: any) {
    NAIVE_UI_MESSAGE.error(t('发送失败：{err}', err.message))
    console.error('Send verify failed:\n', err)
  } finally {
    isSendingVerify.value = false
  }
}
const handleShowNbbAvatarSelector = () => {
  showNbbAvatarSelector.value = true
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    if (loginAction.value === 'login') {
      if (!loginFormData.account) {
        NAIVE_UI_MESSAGE.error(t('请输入{val}', t('账号'))); return
      } else if (!loginFormData.password) {
        NAIVE_UI_MESSAGE.error(t('请输入{val}', t('密码'))); return
      }
      const response = await login(
        loginFormData.account, loginFormData.password
      )
      handleResponse(response, t('登录成功'))
      if (!response.errno) {
        handleSaveLoginInfo(response.data)
        showModal.value = false
      }
    } else if (loginAction.value === 'register') {
      if (!registerFormData.email) {
        NAIVE_UI_MESSAGE.error(t('请输入{val}', t('邮箱'))); return
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerFormData.email)) {
        NAIVE_UI_MESSAGE.error(t('邮箱格式错误')); return
      } else if (!registerFormData.verifycode) {
        NAIVE_UI_MESSAGE.error(t('请输入{val}', t('验证码'))); return
      } else if (!registerFormData.loginname) {
        NAIVE_UI_MESSAGE.error(t('请输入{val}', t('登录名'))); return
      } else if (!registerFormData.nickname) {
        NAIVE_UI_MESSAGE.error(t('请输入{val}', t('昵称'))); return
      } else if (!registerFormData.password) {
        NAIVE_UI_MESSAGE.error(t('请输入{val}', t('密码'))); return
      }
      const inputLenTooLong = handleCheckStrLength(registerFormData.nickname, 12, t('昵称'))
      if (inputLenTooLong) {
        NAIVE_UI_MESSAGE.error(inputLenTooLong); return
      }
      const response = await register(
        registerFormData.email,
        registerFormData.nickname, registerFormData.loginname,
        registerFormData.password, registerFormData.verifycode,
      )
      handleResponse(response, t('注册成功'))
      if (!response.errno) {
        handleSaveLoginInfo(response.data)
        showModal.value = false
      }
    } else if (loginAction.value === 'resetpass') {
      if (!resetpassFormData.email) {
        NAIVE_UI_MESSAGE.error(t('请输入{val}', t('邮箱'))); return
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetpassFormData.email)) {
        NAIVE_UI_MESSAGE.error(t('邮箱格式错误')); return
      } else if (!resetpassFormData.verifycode) {
        NAIVE_UI_MESSAGE.error(t('请输入{val}', t('验证码'))); return
      } else if (!resetpassFormData.password) {
        NAIVE_UI_MESSAGE.error(t('请输入{val}', t('密码'))); return
      }
      const response = await resetPassword(
        resetpassFormData.email,
        resetpassFormData.password,
        resetpassFormData.verifycode
      )
      handleResponse(response, t('重置密码成功'))
      if (!response.errno) {
        loginAction.value = 'login'
      }
    } else if (loginAction.value === 'edituser') {
      if (!edituserFormData.nickname) {
        NAIVE_UI_MESSAGE.error(t('请输入{val}', t('昵称'))); return
      }
      const inputLenTooLong = handleCheckStrLength(edituserFormData.nickname, 12, t('昵称')) || handleCheckStrLength(edituserFormData.title, 20, t('称号'))
      if (inputLenTooLong) {
        NAIVE_UI_MESSAGE.error(inputLenTooLong); return
      }

      const newCloudConfig = deepCopy(cloudConfig.value)
      if (
        edituserFormData.nickname !== cloudConfig.value.nbb_account_nickname
        || edituserFormData.title !== cloudConfig.value.nbb_account_title
      ) {
        const response = await resetNickNameAndTitle(edituserFormData.nickname, edituserFormData.title)
        if (response.errno) {
          NAIVE_UI_MESSAGE.error(t('修改昵称/称号失败：{err}', response.errmsg)); return
        } else {
          newCloudConfig.nbb_account_nickname = edituserFormData.nickname
          newCloudConfig.nbb_account_title = edituserFormData.title
          store.commit('setCloudConfig', newCloudConfig)
        }
      }
      if (edituserFormData.avatar !== cloudConfig.value.nbb_account_avatar) {
        const response = await resetAvatar(edituserFormData.avatar)
        if (response.errno) {
          NAIVE_UI_MESSAGE.error(t('修改头像失败：{err}', response.errmsg)); return
        } else {
          newCloudConfig.nbb_account_avatar = edituserFormData.avatar
          store.commit('setCloudConfig', newCloudConfig)
        }
      }

      appForceUpdate()
      showModal.value = false
    } else {
      console.error('Unexpected loginAction', loginAction.value)
    }
  } catch (err: any) {
    NAIVE_UI_MESSAGE.error(t('提交失败：{err}', err.message))
    console.error('Submit failed:\n', err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    max-width="500px"
    :icon="modalIcon"
    :title="modalTitle"
    @on-load="onLoad"
  >
    <div class="wrapper">
      <div v-if="loginAction === 'login'" class="login-panel">
        <div class="form-container">
          <div class="form-label">
            <n-icon :size="15"><AccountCircleOutlined /></n-icon>
            {{ t('账号') }}
          </div>
          <n-input
            v-model:value="loginFormData.account"
            :placeholder="t('请输入登录名或邮箱')"
          />
          <div class="form-label">
            <n-icon :size="15"><KeyOutlined /></n-icon>
            {{ t('密码') }}
          </div>
          <n-input
            type="password"
            v-model:value="loginFormData.password"
            show-password-on="click"
            :placeholder="t('请输入{val}', t('密码'))"
          />
        </div>
        <div class="sub-links">
          <a href="javascript:void(0);" @click="loginAction = 'register'">{{ t('注册账号') }}</a>
          <n-divider vertical />
          <a href="javascript:void(0);" @click="loginAction = 'resetpass'">{{ t('忘记密码') }}</a>
        </div>
      </div>
      <div v-else-if="loginAction === 'register'" class="register-panel">
        <div class="form-container">
          <div class="form-label">
            <n-icon :size="15"><EmailOutlined /></n-icon>
            {{ t('邮箱') }}
          </div>
          <n-input
            v-model:value="registerFormData.email"
            :placeholder="t('请输入{val}', t('邮箱'))"
          />
          <div class="form-label">
            <n-icon :size="15"><VerifiedUserFilled /></n-icon>
            {{ t('验证码') }}
          </div>
          <n-input-group>
            <n-input
              v-model:value="registerFormData.verifycode"
              :placeholder="t('请输入{val}', t('验证码'))"
            />
            <n-button
              type="info"
              :disabled="isVerifyCooldown || isSendingVerify"
              :loading="isSendingVerify"
              @click="handleSendVerify(registerFormData.email)"
            >
              {{ verifyButtonText }}
            </n-button>
          </n-input-group>
          <div class="form-label">
            <n-icon :size="15"><PersonOutlineOutlined /></n-icon>
            {{ t('登录名') }}
          </div>
          <n-input
            v-model:value="registerFormData.loginname"
            :placeholder="t('请输入{val}', t('登录名'))"
          />
          <div class="form-label">
            <n-icon :size="15"><BadgeFilled /></n-icon>
            {{ t('昵称') }}
          </div>
          <n-input
            v-model:value="registerFormData.nickname"
            :placeholder="t('请输入{val}', t('昵称'))"
            show-count clearable
          >
            <template #count="{ value }">
              <span :style="value.replace(/[\u4e00-\u9fa5]/g, 'aa').length > 12 ? 'color: var(--color-error);' : ''">
                {{ value.replace(/[\u4e00-\u9fa5]/g, 'aa').length + ' / 12' }}
              </span>
            </template>
          </n-input>
          <div class="form-label">
            <n-icon :size="15"><KeyOutlined /></n-icon>
            {{ t('密码') }}
          </div>
          <n-input
            v-model:value="registerFormData.password"
            :placeholder="t('请输入{val}', t('密码'))"
          />
        </div>
        <div class="sub-links">
          <div>{{ t('已有账号?') }}</div>
          <a href="javascript:void(0);" @click="loginAction = 'login'">{{ t('点此登录') }}</a>
        </div>
      </div>
      <div v-else-if="loginAction === 'resetpass'" class="resetpass-panel">
        <div class="form-container">
          <div class="form-label">
            <n-icon :size="15"><EmailOutlined /></n-icon>
            {{ t('邮箱') }}
          </div>
          <n-input
            v-model:value="resetpassFormData.email"
            :placeholder="t('请输入注册时填写的邮箱')"
          />
          <div class="form-label">
            <n-icon :size="15"><VerifiedUserFilled /></n-icon>
            {{ t('验证码') }}
          </div>
          <n-input-group>
            <n-input
              v-model:value="resetpassFormData.verifycode"
              :placeholder="t('请输入{val}', t('验证码'))"
            />
            <n-button
              type="info"
              :disabled="isVerifyCooldown || isSendingVerify"
              :loading="isSendingVerify"
              @click="handleSendVerify(resetpassFormData.email)"
            >
              {{ verifyButtonText }}
            </n-button>
          </n-input-group>
          <div class="form-label">
            <n-icon :size="15"><KeyOutlined /></n-icon>
            {{ t('新密码') }}
          </div>
          <n-input
            v-model:value="resetpassFormData.password"
            :placeholder="t('请输入新密码')"
          />
        </div>
        <div class="sub-links">
          <a href="javascript:void(0);" @click="loginAction = 'login'">{{ t('返回登录') }}</a>
        </div>
      </div>
      <div v-else-if="loginAction === 'edituser'" class="edituser-panel">
        <div class="form-container">
          <div class="form-label">
            <n-icon :size="15"><BadgeFilled /></n-icon>
            {{ t('昵称') }}
          </div>
          <n-input
            v-model:value="edituserFormData.nickname"
            :placeholder="t('请输入{val}', t('昵称'))"
            show-count clearable
          >
            <template #count="{ value }">
              <span :style="value.replace(/[\u4e00-\u9fa5]/g, 'aa').length > 12 ? 'color: var(--color-error);' : ''">
                {{ value.replace(/[\u4e00-\u9fa5]/g, 'aa').length + ' / 12' }}
              </span>
            </template>
          </n-input>
          <div class="form-label">
            <n-icon :size="15"><LabelImportantFilled /></n-icon>
            {{ t('称号') }}
          </div>
          <n-input
            v-model:value="edituserFormData.title"
            :placeholder="t('请输入{val}', t('称号'))"
            show-count clearable
          >
            <template #count="{ value }">
              <span :style="value.replace(/[\u4e00-\u9fa5]/g, 'aa').length > 20 ? 'color: var(--color-error);' : ''">
                {{ value.replace(/[\u4e00-\u9fa5]/g, 'aa').length + ' / 20' }}
              </span>
            </template>
          </n-input>
          <div class="form-label">
            <n-icon :size="15"><FaceRetouchingNaturalFilled /></n-icon>
            {{ t('头像') }}
          </div>
          <div class="avatar-edit-container">
            <n-avatar
              :size="48"
              :src="avatarUrl"
              class="button-avatar"
            />
            <n-button
              size="small"
              @click="handleShowNbbAvatarSelector"
            >
              {{ t('编辑') }}
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <template #action>
      <div class="modal-submit-container">
        <n-button
          type="primary"
          size="large"
          :loading="isSubmitting"
          :disabled="isSubmitting"
          @click="handleSubmit"
        >
          <template #icon>
            <n-icon><DoneOutlined /></n-icon>
          </template>
          {{ t('确认') }}
        </n-button>
      </div>
    </template>

    <ModalNbbAvatarSelector
      v-model:show="showNbbAvatarSelector"
      v-model:avatar-id="edituserFormData.avatar"
    />
  </MyModal>
</template>

<style scoped>
.wrapper {
  .form-container {
    display: grid;
    grid-template-columns: minmax(75px, auto) 1fr;
    padding: 0 0.5em;
    gap: 4px;

    .form-label {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 15px;
    }
    .avatar-edit-container {
      margin-top: 4px;
      display: flex;
      gap: 4px;
      align-items: end;

      .button-avatar {
        display: flex;
      }
    }
  }
  .sub-links {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    font-size: 12px;
    line-height: 1;
    margin-top: 20px;
  }
}
</style>