## 在 Crowdin 上设置和同步翻译项目

### 使用 CLI 工具

先确认自己的 Crowdin 账号具有 HqHelper 的编辑权限，然后就可以设置环境变量了。

```
key: CROWDIN_PERSONAL_TOKEN
val: ...
```

可以直接设置到系统中。

#### 上传

##### 上传源文件指令

```bash
npx crowdin upload sources
```

##### 上传翻译指令

```bash
npx crowdin upload translations
```

#### 下载

```bash
npx crowdin download
```
