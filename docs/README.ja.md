<p align="center">
  <img alt="icon" height="160" src="/docs/image/app-logo.png" />
</p>
<h1 align="center"></h1>

<p align="center">
  <a href="/README.md">简体中文</a>
  |
  <strong>日本語</strong>
  |
  <a href="/docs/README.en.md">English</a>
</p>

[![GitHub License](https://img.shields.io/github/license/InfSein/hqhelper-dawntrail?style=flat&logo=github)](/LICENSE) ![GitHub Repo stars](https://img.shields.io/github/stars/InfSein/hqhelper-dawntrail?style=flat&logo=github) ![Github Created At](https://img.shields.io/github/created-at/InfSein/hqhelper-dawntrail?style=flat&logo=github) [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/InfSein/hqhelper-dawntrail) <br>
[![GitHub Release](https://img.shields.io/github/v/release/InfSein/hqhelper-dawntrail?style=flat&logo=github)](https://github.com/InfSein/hqhelper-dawntrail/releases) [![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/InfSein/hqhelper-dawntrail/total?style=flat&logo=github)](https://github.com/InfSein/hqhelper-dawntrail/releases) [![Crowdin](https://badges.crowdin.net/hqhelper/localized.svg)](https://crowdin.com/project/hqhelper) <br>
[![Based on Vite](https://img.shields.io/badge/Vite-6.3.4-646CFF?style=flat&logo=vite)](https://github.com/vitejs/vite) [![Based on Vue3](https://img.shields.io/badge/Vue-3.5.13-4FC08D?style=flat&logo=vue.js)](https://github.com/vuejs/core) [![Based on TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=flat&logo=typescript)](https://github.com/microsoft/TypeScript) [![Based on Naive UI](https://img.shields.io/badge/Naive%20UI-2.41.0-008080?style=flat&logo=npm)](https://github.com/tusen-ai/naive-ui)

生産＆採集プレイヤー向けの秘伝書レシピ計算ツール。

パッチで追加されたHQ装備、食事、強化薬の情報整理とレシピ計算ツールを提供します。さらに、生産＆採集プレイヤーにとって便利なその他の機能も用意しています。

## 使い方

### ブラウザで使う

#### 本番環境サイト

* メインサイト: https://infsein.github.io/hqhelper-dawntrail/#/
* サブサイト:https://hqhelper.nbb.fan/#/


#### テスト環境サイト

* https://beta.hqhelper.nbb.fan/#/

> [!CAUTION]\
> 名前の通り、テスト専用です。
> 頻繁に更新され、深刻なバグが発生する可能性があります。

### アプリとして使う

様々なラッピング方法を提供する予定ですが、ブラウザと同じパフォーマンスを保証しかねます。

[hqhelper-client](https://github.com/InfSein/hqhelper-client) をご覧ください。

### 手動ビルド

 `Node.js` をインストールする必要があります。

```sh
git clone https://github.com/InfSein/hqhelper-dawntrail.git
cd hqhelper-dawntrail
npm i
npm run dev
```

## サポートの提供

### フォローしてください

* **このリポジトリにStarをつけてください**
* **SNS**：[Weibo](https://weibo.com/u/7870808507) | [X（Twitter)](https://twitter.com/FF14_HqHelper)
* **NGA**：<https://bbs.nga.cn/read.php?tid=41510690>

### 開発に参加する

* **問題を探す:**：使用中にエラーや問題点を見つけたり、UIや機能、ロジックの改善案がある場合は、 [イシューを提出](https://github.com/InfSein/hqhelper-dawntrail/issues/new) してください。
* **問題を解決する**：フロントエンドプログラミングのスキルがある方は、 [プルリクエスト](https://github.com/InfSein/hqhelper-dawntrail/pulls) を通じて `HqHelper` の開発に参加できます。コードは共通の規約といくつかの追加規則に従う必要があります。詳しくは [Wiki](https://github.com/InfSein/hqhelper-dawntrail/wiki)をご覧ください。

### ギフティング

* <https://afdian.com/a/infseins>

## その他

### バージョン番号の説明

バージョン番号は `MAJOR.MINOR.PATCH`  という命名規則に従います。

1. `MAJOR`,`MINOR`,`PATCH` はすべて正の整数です;
2. `MAJOR` は `HqHelper`の第何世代かを示し、対応する `ファイナルファンタジーXIV` の拡張パッケージも表します;
3. `MINOR` は `ファイナルファンタジーXIV` の中間バージョン（例：7.1の1）を表します;
4. `PATCH` は、指定した `MAJOR` および `MINOR` のもとで、何回目の更新かを示します。

例として、`2.1.17` は以下を意味します：

- 第 `2` 世代の `HqHelper`であり、 `ファイナルファンタジーXIV` の パッチ`7.x` に対応している;
-  `ファイナルファンタジーXIV` の第 `1` 中間バージョン、つまり `7.1`に対応。
-  `7.1` に対応したバージョンを基づいて、`17` 回目の更新。

### Star数の推移

[![Stargazers over time](https://starchart.cc/InfSein/hqhelper-dawntrail.svg?variant=adaptive)](https://starchart.cc/InfSein/hqhelper-dawntrail)
