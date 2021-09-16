# `@mara/babel-plugin-console-prefix`

> babel-loader 的插件，给项目的 console 增加前缀

## Install

Using npm:

```bash
npm install --save-dev @mara/babel-plugin-console-prefix
```

or using yarn:

```bash
yarn add @mara/babel-plugin-console-prefix --dev
```

## Usage

```js
const BabelPluginConsolePrefix = require('@mara/babel-plugin-console-prefix')

{
  plugins: [
    [
      BabelPluginConsolePrefix,
      {
        // customPrefix: 'prefix',  // 自定义前缀，开发组件时建议将该值设置为组件名称
        exclude: ['sncLog'], // 排除某些文件，会用正则过滤
        showLocation: false // 是否显示行号 [index.js 4:13]
      }
    ]
  ]
}
```
