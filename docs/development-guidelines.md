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

# 术语说明 / Glossary

## Job,Role,Class

1. Job: 职业，如战士，官方。
2. Role: 职能，如防护职业，官方。
3. Class: 职类，按装备划分，非官方。

### Class

1. 坦克：使用`御敌`系列防具和首饰的职业，即所有防护职业
2. 治疗：使用`治愈`系列防具和首饰的职业，即所有治疗职业
3. 制敌：使用`制敌`系列防具和`强攻`系列首饰的职业，目前有龙骑、钐镰客
4. 强袭：使用`强袭`系列防具和`强攻`系列首饰的职业，目前有武僧、武士
5. 近敏：使用`游击`系列防具和`精准`系列首饰的职业，目前有忍者、双剑客(7.0职业/暂译)
6. 远敏：使用`精准`系列防具和首饰的职业，目前有吟游诗人、机工士、舞者
7. 法系：使用`咏咒`系列防具的职业，目前有黑魔法师、召唤师、赤魔法师、画师(7.0职业/暂译)

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
import { computed, inject, ref, type Ref } from 'vue'
import {
  NButton,
} from 'naive-ui'
import { 
  CodeSharp, SaveOutlined
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'

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