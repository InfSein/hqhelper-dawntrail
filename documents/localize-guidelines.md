# HqHelper 本地化操作指南

## 简介

`HqHelper` 借助 [VoerkaI18n](https://zhangfisher.github.io/voerka-i18n/#/zh/guide/intro/install) 提供基础UI界面的本地化翻译。

## 翻译

在程序的`/src/languages/translates/default.json`中进行翻译。

JSON的大致格式如下：

```json
{
  "欢迎": { // 简体中文
    "en": "Welcome", // 英文翻译
    "ja": "ようこそ", // 日文翻译
    "$files": [] // 哪些文件用到了这个翻译项
  },
  // ...
}
```

提供翻译时，只需要根据简体中文的原文，在下方的`en`,`ja`等字段中添加对应的翻译即可。

## 指令

### 获取需要翻译的内容

在开发期间，使用`t('中文')`来构筑页面文本。开发结束后，在终端输入以下指令，让`VoerkaI18n`自动提取需要翻译的内容：

```bash
voerkai18n extract
```

注：反复执行voerkai18n extract命令是安全的，不会导致进行了一半的翻译内容丢失。

### 自动翻译

在终端输入以下指令，让`VoerkaI18n`自动翻译所有需要翻译的内容：

```bash
voerkai18n translate --appkey <在百度翻译上申请的密钥> --appid <在百度翻译上申请的appid>
```

注：将会自动调用百度的在线翻译API进行翻译。

### 编译本地化内容

在调试和发布之前，需要通过在终端输入指令来编译本地化内容。

```bash
voerkai18n compile
```

