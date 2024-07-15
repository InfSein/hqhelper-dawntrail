# FFXIV HQ Helper: DAWNTRAIL

![GitHub License](https://img.shields.io/github/license/InfSein/hqhelper-dawntrail?style=flat&logo=github) ![GitHub Repo stars](https://img.shields.io/github/stars/InfSein/hqhelper-dawntrail?style=flat&logo=github) ![Github Created At](https://img.shields.io/github/created-at/InfSein/hqhelper-dawntrail?style=flat&logo=github) <br>
![GitHub Release](https://img.shields.io/github/v/release/InfSein/hqhelper-dawntrail?style=flat&logo=github) ![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/InfSein/hqhelper-dawntrail/total?style=flat&logo=github)

**简体中文** | [日本語](https://github.com/InfSein/hqhelper-dawntrail/blob/master/docs/README.ja.md) | [English](https://github.com/InfSein/hqhelper-dawntrail/blob/master/docs/README.en.md)


## 项目介绍

专为7.x版本的《最终幻想XIV》生产玩家设计的Web应用。

访问我们的 [Github Page](https://infsein.github.io/hqhelper-dawntrail/) 即可开始使用。

### 开发进度

本项目仍处于建设阶段，随时可能发生重大变动。

#### To-do 列表

- [x] i18n
- [ ] Development Document

### 前身

`HQ Helper`(下文中也可能称之为`HqHelper`)的初代版本是一个基于`.NET 6.0`的`Windows Forms`应用。

该应用的界面由WinForms设计器制作，使用了Windows的原生UI。

在`最终幻想XIV`的`晓月之终途`资料片期间，`HqHelper`提供了超过50次版本更新，支持版本覆盖了从`6.0`到`6.4`的所有游戏版本。

你可以仍然在[NGA玩家社区](https://bbs.nga.cn/read.php?tid=31596099)的发布页面查看截图、描述和教程，或者直接下载和使用它。

## 开发指南

我们只在`README`中提供最基本的开发和构建指南，更详细的内容可能需要参阅`docs`文件夹或[Wiki](https://github.com/InfSein/hqhelper-dawntrail/wiki)。

### 版本号说明

此应用的版本号遵循 `MAJOR.MINOR.PATCH` 的命名规则。

1. `MAJOR`,`MINOR`,`PATCH` 均为正整数;
2. `MAJOR` 代表这是第几代 `HqHelper`，同时也标识着适配的 `最终幻想XIV` 资料片版本;
3. `MINOR` 代表着适配的 `最终幻想XIV` 中等版本 (例如7.1的1);
4. `PATCH` 代表着在前述 `MAJOR` 和 `MINOR` 约束下，应用更新的第几个版本。

例如，`2.1.17` 代表：

- 第 `2` 代的 `HqHelper`，专为 `最终幻想XIV` 的 `7.x` 资料片版本设计;
- 适配 `最终幻想XIV` 的第 `1` 个中等版本，即 `7.1`;
- 在适配 `7.1` 的基础上，更新的第 `17` 个版本。

> [!NOTE]
> `PATCH` 版本号的增加可能会很激进，哪怕此版本仅有很小的优化或修复。

### 构建本地调试环境

```sh
git clone https://github.com/InfSein/hqhelper-dawntrail.git
cd hqhelper-dawntrail
npm i
npm run dev
```

## 参考内容

1. [Naive UI](https://github.com/tusen-ai/naive-ui)
2. [FFXIV Axis Font Icons](https://github.com/thewakingsands/ffxiv-axis-font-icons)

可能并未列举所有参考。

## 许可

MIT

> [!NOTE]
> 项目许可在正式发布前随时可能发生变更。