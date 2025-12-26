# 简要笔记 / Quick Notes

## 兼容手机端与电脑端

利用CSS-media选择器来实现不同设备的兼容。

```css
/* Desktop */
@media screen and (min-width: 768px) {
}

/* Mobile */
@media screen and (max-width: 767px) {
}
```

# 开发依赖

## Icons in FFXIV Axis font

https://thewakingsands.github.io/ffxiv-axis-font-icons/

# 杂项 / Others

## Vue 模板 / Vue Template

我是不是应该有装这插件

```vue
<script setup lang="ts">
</script>

<template>
  <div />
</template>

<style scoped>
</style>
```

### 模态框 (Modal) 模板

```vue
<script setup lang="ts">
import { 
  CodeSharp, SaveOutlined
} from '@vicons/material'

const showModal = defineModel<boolean>('show', { required: true })

interface ModalProps {
}
const props = defineProps<ModalProps>()

const wrapper = ref<HTMLElement>()

const onLoad = () => {
}

</script>

<template>
  <MyModal
    v-model:show="showModal"
    :icon="CodeSharp"
    :title="t('')"
    max-width="350px"
    @on-load="onLoad"
  >
    <div class="wrapper" ref="wrapper">
    </div>

    <template #action>
      <div class="modal-submit-container">
        <n-button type="primary" size="large">
          <template #icon>
            <n-icon><SaveOutlined /></n-icon>
          </template>
          {{ t('保存') }}
        </n-button>
      </div>
    </template>
  </MyModal>
</template>

<style scoped>
.wrapper {
}
</style>
```

## 获取职业ID的方法 / Ways to get xiv job ID

从[XivApi:ClassJob](https://xivapi.com/classjob)可以获取到所有的职业。

需要手动填写到`data\xiv-jobs.json`中。

## 获取职业Icon的方法 / Ways to get xiv job icons

从[XivApi:Icons062000](https://xivapi.com/docs/Icons?set=icons062000)和[XivApi:Class/Jobs Companion](https://xivapi.com/docs/Icons?set=class_job_companion)可以获取到所有的职业图标。