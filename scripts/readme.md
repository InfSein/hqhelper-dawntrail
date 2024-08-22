# Scripts

此文件夹存放自动化构建脚本。

这些脚本大多会在调试与构建过程中被自动地调用，不会参与到前端项目本身。

## 脚本列表

### update-version.cjs

此脚本用于在本地 `npm i` 时自动更新 `public/version.json` 文件中的 `hqhelper` 版本，以便客户端判别是否需要更新。

要启用此脚本，则需确保 `package.json` 中配置了 `postinstall`，配置内容应包括 `node scripts/update-version.cjs`。

部分分支可能不会执行此脚本。
