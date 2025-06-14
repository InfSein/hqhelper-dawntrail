<script setup lang="ts">
import { computed, inject, reactive, ref, type Ref } from 'vue'
import {
  NButton, NDivider, NIcon, NInput, NInputGroup,
  useMessage,
} from 'naive-ui'
import {
  LogInOutlined, PersonAddAlt1Filled, LockResetOutlined,
  AccountCircleOutlined, KeyOutlined,
  EmailOutlined, VerifiedUserFilled,
  PersonOutlineOutlined, BadgeFilled,
  DoneOutlined,
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import { useStore } from '@/store'
import { type CloudConfigModel } from '@/models/config-cloud'
import type { NbbResponse, ResdataRegisterAndLogin } from '@/models/nbb-cloud'
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
} = useNbbCloud(cloudConfig)

const showModal = defineModel<boolean>('show', { required: true })

interface ModalLoginProps {
  defaultTab: "login" | "register"
}
const props = defineProps<ModalLoginProps>()

const loginAction = ref<"login" | "register" | "resetpass">('login')
const verifyCooldown = ref(0)
const isVerifyCooldown = ref(false)
const isSendingVerify = ref(false)
const isSubmitting = ref(false)
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

const onLoad = () => {
  loginAction.value = props.defaultTab
}

const modalIcon = computed(() => {
  switch (loginAction.value) {
    case 'resetpass': return LockResetOutlined
    case 'register': return PersonAddAlt1Filled
    case 'login': 
    default: return LogInOutlined
  }
})
const modalTitle = computed(() => {
  switch (loginAction.value) {
    case 'resetpass': return t('重置密码')
    case 'register': return t('注册')
    case 'login': 
    default: return t('登录')
  }
})

const verifyButtonText = computed(() =>
  isVerifyCooldown.value ? t('{count}秒后可再次发送', verifyCooldown.value) : t('发送验证码')
)

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
    NAIVE_UI_MESSAGE.error(t('请输入邮箱')); return
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

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    if (loginAction.value === 'login') {
      if (!loginFormData.account) {
        NAIVE_UI_MESSAGE.error(t('请输入账号')) ; return
      } else if (!loginFormData.password) {
        NAIVE_UI_MESSAGE.error(t('请输入密码')) ; return
      }
      const response = await login(
        loginFormData.account, loginFormData.password
      )
      handleResponse(response, t('登录成功'))
      if (!response.errno) {
        handleSaveLoginInfo(response.data)
      }
      showModal.value = false
    } else if (loginAction.value === 'register') {
      if (!registerFormData.email) {
        NAIVE_UI_MESSAGE.error(t('请输入邮箱')) ; return
      } else if (!registerFormData.verifycode) {
        NAIVE_UI_MESSAGE.error(t('请输入验证码')) ; return
      } else if (!registerFormData.loginname) {
        NAIVE_UI_MESSAGE.error(t('请输入登录名')) ; return
      } else if (!registerFormData.nickname) {
        NAIVE_UI_MESSAGE.error(t('请输入昵称')) ; return
      } else if (!registerFormData.password) {
        NAIVE_UI_MESSAGE.error(t('请输入密码')) ; return
      }
      const response = await register(
        registerFormData.email,
        registerFormData.nickname, registerFormData.loginname,
        registerFormData.password, registerFormData.verifycode,
      )
      handleResponse(response, t('注册成功'))
      if (!response.errno) {
        handleSaveLoginInfo(response.data)
      }
      showModal.value = false
    } else if (loginAction.value === 'resetpass') {
      if (!resetpassFormData.email) {
        NAIVE_UI_MESSAGE.error(t('请输入邮箱')) ; return
      } else if (!resetpassFormData.verifycode) {
        NAIVE_UI_MESSAGE.error(t('请输入验证码')) ; return
      } else if (!resetpassFormData.password) {
        NAIVE_UI_MESSAGE.error(t('请输入密码')) ; return
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
            :placeholder="t('请输入密码')"
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
            :placeholder="t('请输入邮箱')"
          />
          <div class="form-label">
            <n-icon :size="15"><VerifiedUserFilled /></n-icon>
            {{ t('验证码') }}
          </div>
          <n-input-group>
            <n-input v-model:value="registerFormData.verifycode" />
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
            :placeholder="t('请输入登录名')"
          />
          <div class="form-label">
            <n-icon :size="15"><BadgeFilled /></n-icon>
            {{ t('昵称') }}
          </div>
          <n-input
            v-model:value="registerFormData.nickname"
            :placeholder="t('请输入昵称')"
          />
          <div class="form-label">
            <n-icon :size="15"><KeyOutlined /></n-icon>
            {{ t('密码') }}
          </div>
          <n-input
            v-model:value="registerFormData.password"
            :placeholder="t('请输入密码')"
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
            <n-input v-model:value="resetpassFormData.verifycode" />
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