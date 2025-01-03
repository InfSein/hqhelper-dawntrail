# Scripts

此文件夹存放自动化构建脚本。

这些脚本大多会在调试与构建过程中被自动地调用，不会参与到前端项目本身。

## 脚本列表

### compress-data.cjs

此脚本用于压缩部分数据文件，目前包括：
* `src\assets\data\unpacks\raw\place-name.full.json`
* `src\assets\data\unpacks\raw\territory.full.json`

其内部逻辑会筛除掉不需要的数据，以减少程序更新包/网页资源体积 (节省量约0.15MB)。

只在更新了解包文件时需要调用，运行 `scripts\package.json` 中的 NPM 脚本 `compress-data` 即可执行。

### update-version.cjs

此脚本用于在本地 `npm i` 时自动更新 `public/version.json` 文件中的 `hqhelper` 版本，以便客户端判别是否需要更新。

要启用此脚本，则需确保 `package.json` 中配置了 `postinstall`，配置内容应包括 `node scripts/update-version.cjs`。

部分分支可能不会执行此脚本。
