# OnlineJudge

这个模板可以帮助你快速开始使用 Vue 3 与 Vite 进行开发。

## 推荐的 IDE 配置

推荐使用：

* [VSCode](https://code.visualstudio.com/?utm_source=chatgpt.com)
* [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar&utm_source=chatgpt.com)（并禁用 Vetur）
* [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin&utm_source=chatgpt.com)

---

## TypeScript 中 `.vue` 文件导入的类型支持

默认情况下，TypeScript 无法处理 `.vue` 文件的类型信息，因此我们使用 `vue-tsc` 替代 `tsc` 命令行工具来进行类型检查。

在编辑器中，我们需要安装 [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin&utm_source=chatgpt.com)，以便让 TypeScript 语言服务识别 `.vue` 文件类型。

如果你觉得独立的 TypeScript 插件速度不够快，Volar 还提供了一种性能更高的模式 —— [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471?utm_source=chatgpt.com#discussioncomment-1361669)。

可以按照以下步骤启用：

1. 禁用 VSCode 内置的 TypeScript 扩展

   1. 在 VSCode 命令面板中运行 `Extensions: Show Built-in Extensions`
   2. 找到 `TypeScript and JavaScript Language Features`
   3. 右键选择 `Disable (Workspace)`

2. 在命令面板中运行 `Developer: Reload Window` 重新加载 VSCode 窗口

---

## 自定义配置

详见 [Vite Configuration Reference](https://vitejs.dev/config/?utm_source=chatgpt.com)。

---

## 项目安装

```sh
npm install
```

---

## 开发环境编译与热更新

```sh
npm run dev
```

---

## 生产环境类型检查、编译与压缩

```sh
npm run build
```
