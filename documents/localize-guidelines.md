# HqHelper 本地化操作指南

## 简介

`HqHelper` 借助 [VoerkaI18n](https://zhangfisher.github.io/voerka-i18n/#/zh/guide/intro/install) 提供基础UI界面的本地化翻译。

## 开发注意事项

### 插值

采用`t('翻译内容，插入值1：{}，插入值2：{}', 插入值1, 插入值2)`来构建插值。

出现多个插值，且后续可能会追加的场景，使用对象插值，格式如

```typescript
t('翻译内容，插入值：{key1}，{key2}，{key3}', {
  key1: 插入值1,
  key2: 插入值2,
  key3: 插入值3
})
```

## 翻译

注意：由于`voerkai18n`的框架限制，无论通过哪种方法翻译，都不能更改中文文本！

### 使用表格进行翻译

此方法必须借助开发管理员的闭源项目`hqhelper-resolver`进行。

向开发管理员提出申请后，开发管理员将会向您发送一个`.xlsx`文件，您可使用`Microsoft Excel`等软件打开并编辑。

请注意在编辑的过程中不要对`中文`列做出任何修改，也不要删除标题行(第1行)。

请根据中文文本和程序的UI界面场景将其翻译为由您负责处理的语言，然后将修改后的`.xlsx`文件发送回开发管理员。

#### 开发管理员的操作流程

1. 开发后，执行`voerkai18n extract`命令来更新`default.json`
2. 通过`hqhelper-resolver`将`default.json`转译为`i18n.xlsx`
3. 将`i18n.xlsx`发送给翻译人员
4. 从翻译人员处获取翻译好的`i18n.xlsx`
5. 通过`hqhelper-resolver`将`i18n.xlsx`转译为`default.json`
6. 通过格式化程序格式化`default.json`，以保持其可读性
7. 执行`voerkai18n compile`命令以做好发布准备

### 直接修改JSON文件

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

注：反复执行`voerkai18n extract`命令是安全的，不会导致进行了一半的翻译内容丢失。

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

