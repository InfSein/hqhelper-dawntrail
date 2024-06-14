# Commit与CHANGELOG

## Commit规范

涉及新功能和修复的提交使用`Angular`规范。

### Angular规范

* `feat`：新功能
* `fix`：修复问题
* `docs`：文档修改
* `style`：代码格式修改，不影响代码逻辑
* `refactor`：重构代码，既不修复错误也不添加功能
* `perf`：性能优化
* `test`：添加或修改测试代码
* `build`：构建系统或外部依赖项修改
* `ci`：持续集成修改
* `chore`：其他修改，如修改构建流程或辅助工具等
* `revert`：回滚到之前的提交

## CHANGELOG

使用`conventional-changelog-cli`来自动生成英文版的CHANGELOG。
可能需要人工修改。
修改完成之后，交由相关人员进行本地化翻译。

### 文件规范

1. CHANGELOG.md：英文版的CHANGELOG
2. CHANGELOG-ZH.md：中文版的CHANGELOG
3. CHANGELOG-JA.md：日文版的CHANGELOG

### 插件

```bash
npm install -g conventional-changelog-cli
conventional-changelog -p angular -i CHANGELOG.md -s
```

# 简要笔记 / Quick Notes

## 兼容手机端与电脑端

利用CSS-media选择器来实现不同设备的兼容。

```css
/* 电脑端 */
@media screen and (min-width: 768px) {
  /* 电脑端样式 */
}

/* 手机端 */
@media screen and (max-width: 767px) {
  /* 手机端样式 */
}
```

在`0.0.19`版本后，应用组件皆归属于`App.vue`定义的`appClass`类容器下。

因此也可以通过下述模式的CSS选择器来实现不同设备的兼容。

```css
/* 电脑端 */
.app-desktop {
  /* 电脑端样式 */
}

/* 手机端 */
.app-mobile {
  /* 手机端样式 */
}
```

## 动态引入资源

在部分(或者大多数)环节，可能需要从json等文件动态地引入图片等资源。

由于vue的webpack逻辑，必须先手动引用这些资源，才能动态地使用它们。

出于代码整洁考虑，图片的引用代码统一存放在`components\AppResource.vue`中。

// ! 调试时发现似乎并不需要这么做。等生产环境验证。

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

## 获取职业ID的方法 / Ways to get xiv job ID

从[XivApi:ClassJob](https://xivapi.com/classjob)可以获取到所有的职业。

需要手动填写到`data\xiv-jobs.json`中。