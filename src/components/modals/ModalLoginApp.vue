<!-- alovaApi test -->
<script setup lang="ts">
import { alovaApi } from "@/tools/use-nbb-cloud";
import { useRequest } from "alova/client";
import { computed, ref, type Ref } from "vue";
import { NForm, NFormItem, NInput, NButton, NSpin } from "naive-ui";
import MyModal from "../templates/MyModal.vue";
import { MD5 } from "@/tools/md5.js";

const showModal = defineModel<boolean>("show", { required: true });

const formValue = ref({
  name: "",
  password: "",
});

const encryptedPassword = computed(() => MD5(formValue.value.password));

const { loading: loading1, data: userInfo, send: handLogin, onSuccess: loginSuccess } = useRequest(
  // 直接在请求方法中绑定参数
  () => alovaApi.Post("/user/login", {
    name: formValue.value.name,
    password: encryptedPassword.value
  }),
  {
    // v3 中 meta 配置需放在 options 对象内
    meta: {
      ignoreToken: true
    },
    immediate: false, // 禁用自动发送请求
  }
);

loginSuccess((event: any) => {
  const { data } = event
  console.log(data)
  localStorage.setItem('nbb-cloud-token', data.data.token);
})

const { loading: loading2, data: userList, send: handList } = useRequest(
  () => alovaApi.Post("/cloud/synclist", {
    type: 5
  }),
  {
    // v3 中 meta 配置需放在 options 对象内
    meta: {
      ignoreToken: true
    },
    immediate: false, // 禁用自动发送请求
  }
);

const { loading: loading3, data: addlist, send: handAddList } = useRequest(
  () => alovaApi.Post("/cloud/addlist", {
    desc: "addlist",
    type: 5, //  0-配方计算器队列 1-4配方计算器保留队列 5开始你自定义队列
    content: JSON.stringify({ "42922": 1, "44161": 999 }) //需要时String 类型
  }),
  {
    // v3 中 meta 配置需放在 options 对象内
    meta: {
      ignoreToken: true
    },
    immediate: false, // 禁用自动发送请求
  }
);


</script>

<template>
  <MyModal v-model:show="showModal" :title="'Login to NBB cloud'" :height="'600px'">
    <div class="wrapper" :style="{ height: '550px' }">
      <n-form ref="formRef" :label-width="80" :model="formValue" :size="'small'">
        <n-form-item label="邮箱或登录名" path="name">
          <n-input v-model:value="formValue.name" placeholder="邮箱或登录名" />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input v-model:value="formValue.password" placeholder="密码" />
        </n-form-item>
        <n-form-item>
          <n-button :loading="loading1" attr-type="button" @click="handLogin">
            登录
          </n-button>
          <n-button :loading="loading2" attr-type="button" @click="handList">
            拉取队列
          </n-button>
          <n-button :loading="loading2" attr-type="button" @click="handAddList">
            新增队列
          </n-button>
        </n-form-item>
      </n-form>
      encryptedPassword:{{ encryptedPassword }}<br />
      userInfo:{{ userInfo }}<br />
      userList:{{ userList }}<br />
      addlist:{{ addlist }}<br />
    </div>
  </MyModal>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  user-select: text;
  overflow-y: auto;
}
</style>
