/**
 * This file may not contains too many English,
  but you don't need to try translating them,
  cause they are mostly beginner's notes.
 */

# Vue 3 组件相关

## props

```ts
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number
})

const props = defineProps<{
  foo: string
  bar?: number
}>()

interface Props {
  foo: string
  bar?: number
}
const props = defineProps<Props>()

export interface Props {
  msg?: string
  labels?: string[]
}
const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

## emit

```ts
// 运行时
const emit = defineEmits(['change', 'update'])

// 基于选项
const emit = defineEmits({
  change: (id: number) => {
  },
  update: (value: string) => {
  }
  // lamda 返回 `true` 或 `false`
  // 表明验证通过或失败
})

// 基于类型
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: 可选的、更简洁的语法
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
```

## v-model

```vue
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
```
```vue
<script setup>
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>

<template>
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>
```

## slot

```vue
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```
```vue
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <!-- 隐式的默认插槽 -->
  <!-- 也可使用：<template #default> -->
  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```
