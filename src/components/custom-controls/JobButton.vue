<script lang="ts" setup>
import { computed, h, inject, nextTick, ref, type Component, type Ref } from 'vue'
import {
  NBadge, NButton, NDropdown, NIcon, NPopover,
  NText
} from 'naive-ui'
import {
  FileDownloadDoneOutlined,
  AccessibilityNewOutlined
} from '@vicons/material'
import XivFARImage from './XivFARImage.vue'
import type { GearSelections } from '@/models/gears';

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const gearsSelected = defineModel<GearSelections>('gearsSelected', { required: true })
interface JobButtonProps {
  /** 被选中 */
  selected: boolean;
  /** 职能 */
  role: string;
  /** 职能名称 */
  roleName: string;
  /** 职业id */
  jobId: number;
  /** 职业 */
  jobName: string;
  /** 职业图标 */
  jobIcon: string;
  /** UI尺寸预设 */
  imgSize: number;
  /** 按钮颜色 */
  btnColor: string;
  /** 徽标计数 */
  count: number;
  /** 按钮是否禁用(可选,默认false) */
  disabled?: boolean;
}

const props = defineProps<JobButtonProps>()
const emit = defineEmits(['on-btn-clicked'])

const btnSize = props.imgSize + 5

const onBtnClicked = () => {
  emit('on-btn-clicked')
}

// #region 右键菜单相关

const currJobGears = computed(() => {
  const gears : {
    key: keyof GearSelections,
    amount: number,
    icon: string
  }[] = [];

  // 主副手
  if (gearsSelected.value?.MainHand?.[props.jobId]) {
    gears.push({
      key: 'MainHand',
      amount: gearsSelected.value.MainHand[props.jobId],
      icon: './image/game-gear-slot/mainhand.png'
    })
  }
  if (gearsSelected.value?.OffHand?.[props.jobId]) {
    gears.push({
      key: 'OffHand',
      amount: gearsSelected.value.OffHand[props.jobId],
      icon: './image/game-gear-slot/offhand.png'
    })
  }

  // 防具
  (['HeadAttire', 'BodyAttire', 'HandsAttire', 'LegsAttire', 'FeetAttire']).forEach(_key => {
    const key = _key as 'HeadAttire' | 'BodyAttire' | 'HandsAttire' | 'LegsAttire' | 'FeetAttire'
    if (gearsSelected.value?.[key])
  })
  /*
  ([
    'MainHand', 'OffHand',
    'HeadAttire', 'BodyAttire', 'HandsAttire', 'LegsAttire', 'FeetAttire',
    'Earrings', 'Necklace', 'Wrist', 'Rings'
  ]).forEach(key => {
    if (gearsSelected.value[key]) {
      const item = gearsSelected.value[key][Object.keys(gearsSelected.value[key])[0]]
      if (item) {
        const itemInfo = allItems[item]
        if (itemInfo) {
          gears.push({
            key: itemInfo.id,
            amount: Object.keys(gearsSelected.value[key]).length,
          })
        }
      }
    }
  });
  */

  return gears
})

const showDropdownRef = ref(false)
const xRef = ref(0)
const yRef = ref(0)

const contextOptions = computed(() => {
  return [
    {
      key: 'context-header',
      type: 'render',
      render: renderJobContextHeader
    },
    {
      type: 'divider',
      key: 'd0'
    },
    {
      label: t('已选'),
      key: 'selected',
      icon: renderIcon(FileDownloadDoneOutlined),
      children: [
        {
          key: 'selected-header',
          type: 'render',
          render: renderGearsSelectedHeader
        },
        {
          key: 'selected-header-divider',
          type: 'divider'
        },
        {
          label: t('在做了'),
          key: '???1',
          icon: renderIcon(FileDownloadDoneOutlined)
        }
      ]
    },
    {
      type: 'divider',
      key: 'd1'
    },
    {
      label: t('配装'),
      key: 'gearing',
      icon: renderIcon(AccessibilityNewOutlined),
      children: [
        {
          label: t('在配装模拟器中打开'),
          key: 'gearing-open-simulator',
          icon: renderIcon(AccessibilityNewOutlined)
        },
        {
          label: t('查看推荐配装'),
          key: 'gearing-recomm',
          icon: renderIcon(AccessibilityNewOutlined)
        }
      ]
    }
  ]
})
const renderJobContextHeader = () => {
  return h(
    'div',
    {
      class: 'flex',
      style: 'gap: 5px; padding: 0.2em 0.5em; min-width: 150px;'
    },
    [
      h(
        'div',
        {
          class: 'h-full flex-center'
        },
        [
          h(
            XivFARImage,
            {
              src: props.jobIcon,
              size: 32
            }
          )
        ]
      ),
      h(
        'div',
        {
          style: 'line-height: 1.2;'
        },
        [
          h('p', {class:'font-big'}, props.jobName),
          h('p', {class:'font-small'}, props.roleName)
        ]
      )
    ]
  )
}
const renderGearsSelectedHeader = () => {
  // todo
  return h(
    'div',
    {
      style: 'padding: 8px 12px;'
    },
    [
      h('p', null, t('已选部件')),
      h('div', null, [
        h('div', null, [h(NText, { depth: 2 }, { default: () => '打工仔' })]),
        h('div', { style: 'font-size: 12px;' }, [
          h(
            NText,
            { depth: 3 },
            { default: () => '毫无疑问，你是办公室里最亮的星' }
          )
        ])
      ])
    ]
  )
}
function renderIcon(icon: Component) {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}
const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault()
  showDropdownRef.value = false
  nextTick().then(() => {
    showDropdownRef.value = true
    xRef.value = e.clientX
    yRef.value = e.clientY
  })
}
const handleSelect = async (key: string | number, option: any) => {
  showDropdownRef.value = false
  console.log(key)
  if (option?.click) {
    option.click()
  } else {
    console.log('[开发提示] 未分配点击事件', key, option)
  }
}
const onClickoutside = () => {
  showDropdownRef.value = false
}

// #endregion

</script>

<template>
  <n-popover
    placement="bottom-start"
    :trigger="isMobile ? 'manual' : 'hover'"
  >
    <template #trigger>
      <n-badge :value="count" :max="99" :color="props.btnColor" @click="onBtnClicked">
        <n-button
          :ghost="!props.selected"
          :disabled="props.disabled"
          class="job-button"
          :color="props.btnColor"
          :style="{ width: `${btnSize}px`, height: `${btnSize}px` }"
          @click="onBtnClicked"
          @contextmenu="handleContextMenu"
        >
          <XivFARImage
            :src="jobIcon"
            :size="imgSize"
          />
          
          <n-dropdown
            size="small"
            placement="bottom-start"
            trigger="manual"
            :x="xRef"
            :y="yRef"
            :options="contextOptions"
            :show="showDropdownRef"
            :on-clickoutside="onClickoutside"
            @select="handleSelect"
          />
        </n-button>
      </n-badge>
    </template>

    <div>{{ jobName }}</div>
  </n-popover>
</template>

<style scoped>
:deep(.n-badge-sup) {
  border-radius: 3px;
  transform: none !important;
  right: 0;
  bottom: 0;
  left: initial;
  cursor: pointer;
  user-select: none;
}
.job-button {
  padding: 1px;
}
</style>