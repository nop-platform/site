# 贡献指南

## 文档编写

官网中指南、教程类文档皆存放在 `/docs` 下，需要展示在网站中的文档得将其信息添加进 `/docs/.meta/toc.yml` 中，数据结构如下：

```yml
- text: 节点一名称
  uri: 节点一路径
- text: 节点二名称
  children:
    - text: 节点二的第一个子节点名称
      uri: 节点二的第一个子节点路径
    - 节点二的第二个子节点路径
```

每个节点的数据类型可以是字符串或对象，当是字符串时代表是该节点的路径，是对象时的含义为：

| 键名 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `uri` | 字符串 | 是 | 相对于 `/docs` 或父节点的路径 |
| `text` | 字符串 | 否 | 节点名称，用于生成目录树，默认取文档中的标题 |
| `children` | 数组 | 否 | 子节点 |

## 网站主题开发

本主题是基于 [Lime](https://ourai.github.io/lime) 的 [Hexo 版本](https://www.npmjs.com/package/hexo-theme-lime)进行扩展，除了用于官网之外，也可在本地预览社区项目文档生成效果时使用。

在开发时需要：

1. 在根目录 `npm i` 安装依赖，Node.js 版本最好是 `14.15.3`；
2. 首次开发或需要更新 `hexo-theme-lime` 时得执行 `npm run copy` 将原主题相关文件复制到 `themes/nop-project`；
3. 用 `npm start` 启动 Hexo 开始调试。
