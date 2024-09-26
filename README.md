<p align="center">
  <img width="160" alt="icon" height="160" src="/public/icons/logo_v2_shadowed.png" />
</p>

<h1 align="center">7.x HQ Helper</h1>

<p align="center">
  <strong>简体中文</strong>
  |
  <a href="/docs/README.ja.md">日本語</a>
  |
  <a href="/docs/README.en.md">English</a>
</p>

![GitHub License](https://img.shields.io/github/license/InfSein/hqhelper-dawntrail?style=flat&logo=github) ![GitHub Repo stars](https://img.shields.io/github/stars/InfSein/hqhelper-dawntrail?style=flat&logo=github) ![Github Created At](https://img.shields.io/github/created-at/InfSein/hqhelper-dawntrail?style=flat&logo=github) <br>
![GitHub Release](https://img.shields.io/github/v/release/InfSein/hqhelper-dawntrail?style=flat&logo=github) ![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/InfSein/hqhelper-dawntrail/total?style=flat&logo=github)

面向生产采集玩家的黄金篇(7.0~7.4)秘籍配方制作计算器。

我们将会为你提供7.0/7.05/7.1/7.2/7.3/7.4各个版本新增的HQ装备、食物和爆发药的信息整理和配方计算服务，以及一些其他的生产采集玩家可能比较需要的杂项功能。

## 使用方法

### 在浏览器中使用

第二代的 `HqHelper` 本质上只是一个静态网页。

#### 正式环境网站

* 主站点：https://infsein.github.io/hqhelper-dawntrail/#/
* 备用站：https://hqhelper.nbb.fan/#/

> [!TIP]\
> 对于境内用户而言，访问备用站可能会更快。
> 建议把列出的站点都试一试，哪个快用哪个。

#### 测试环境网站

* https://beta.hqhelper.nbb.fan/#/

> [!CAUTION]\
> 顾名思义，仅供测试。
> 会经常更新，并随时有可能出现较为严重的BUG。

### 以应用形式使用

我们可能会提供各式各样的套壳，但是很难保证效果跟浏览器一样好。

#### Windows 应用

参见 [Release Electron v3](https://github.com/InfSein/hqhelper-dawntrail/releases/tag/electron.v3)

#### iOS 应用

由于一些原因，我们无法为你提供iOS的app，不过我们的网站支持PWA。

用 `Safari` 打开网页，点击底部正中间的按钮，再点击 `添加到主屏幕`，即可从主屏幕启动应用，获得接近于app的体验。

#### Android 应用

暂无计划

### 手动构建

需要安装 `Node.js` 。

```sh
git clone https://github.com/InfSein/hqhelper-dawntrail.git
cd hqhelper-dawntrail
npm i
npm run dev
```

## 提供支持

### 关注我们

* **给这个仓库一个Star**
* **社交媒体**：[微博](https://weibo.com/u/7870808507) | [推特](https://twitter.com/FF14_HqHelper)
* **NGA主题帖**：<https://bbs.nga.cn/read.php?tid=41510690>

### 参与开发

* **寻找问题**：如果您在使用过程中发现有错误/问题的地方，或是对我们的界面/功能/逻辑有优化的建议，欢迎 [提出议题](https://github.com/InfSein/hqhelper-dawntrail/issues/new) 。
* **解决问题**：如果您具有前端编程能力，您可以通过发起 [拉取请求](https://github.com/InfSein/hqhelper-dawntrail/pulls) 等方式参与到 `HqHelper` 的开发工作中。代码可能需要遵守通用规范和一些额外村规，具体请参阅我们的 [Wiki](https://github.com/InfSein/hqhelper-dawntrail/wiki) 。

### 提供赞助

* 还没想好怎么接收

## 其他

### 版本号说明

版本号遵循 `MAJOR.MINOR.PATCH` 的命名规则。

1. `MAJOR`,`MINOR`,`PATCH` 均为正整数;
2. `MAJOR` 代表这是第几代 `HqHelper`，同时也标识着适配的 `最终幻想XIV` 资料片版本;
3. `MINOR` 代表着适配的 `最终幻想XIV` 中等版本 (例如7.1的1);
4. `PATCH` 代表着在前述 `MAJOR` 和 `MINOR` 约束下，应用更新的第几个版本。

例如，`2.1.17` 代表：

- 第 `2` 代的 `HqHelper`，专为 `最终幻想XIV` 的 `7.x` 资料片版本设计;
- 适配 `最终幻想XIV` 的第 `1` 个中等版本，即 `7.1`;
- 在适配 `7.1` 的基础上，更新的第 `17` 个版本。

### Star数量历史

[![Stargazers over time](https://starchart.cc/InfSein/hqhelper-dawntrail.svg?variant=adaptive)](https://starchart.cc/InfSein/hqhelper-dawntrail)

## 特别感谢

* JetBrains 
