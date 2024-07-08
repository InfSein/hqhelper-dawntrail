# Commit与CHANGELOG

## Commit规范

涉及新功能和修复的提交使用`Angular`规范。

### Angular规范

1. `feat`：增加新的特征
2. `fix`：修复`bug`
3. `build`：对构建系统或者外部依赖项进行了修改
4. `ci`：对CI配置文件或脚本进行了修改
5. `docs`：对文档进行了修改
6. `pref`：提高性能的代码更改
7. `refactor`：既不是修复`bug`也不是添加特征的代码重构
8. `style`：不影响代码含义的修改，比如空格、格式化、缺失的分号等
9. `test`：增加确实的测试或者矫正已存在的测试

// https://github.com/Document-Collection/git-guide/blob/master/docs/message/Angular%E6%8F%90%E4%BA%A4%E4%BF%A1%E6%81%AF%E8%A7%84%E8%8C%83.md

## CHANGELOG

使用`conventional-changelog-cli`来自动生成英文版的CHANGELOG。
可能需要人工修改。
修改完成之后，交由相关人员进行本地化翻译。

> [!NOTE]
> 从2024年7月开始的commit正文开始使用中文，可能是因为某个英语并不怎么好的呆比受不了装模作样写英文的日子了吧

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

## 获取职业Icon的方法 / Ways to get xiv job icons

从[XivApi:Icons062000](https://xivapi.com/docs/Icons?set=icons062000)和[XivApi:Class/Jobs Companion](https://xivapi.com/docs/Icons?set=class_job_companion)可以获取到所有的职业图标。