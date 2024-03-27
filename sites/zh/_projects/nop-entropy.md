---
title: Nop Entropy
---

Nop 平台（Nop Platform 2.0）是基于[可逆计算原理](https://zhuanlan.zhihu.com/p/64004026){:rel="external nofollow"}{:target="_blank"}从零开始构建的新一代低代码平台，致力于克服传统低代码平台无法摆脱穷举法的困境，从理论层面超越组件技术，有效地解决粗粒度软件复用的问题。

Nop Entropy 是 Nop 平台的后端部分，前端部分可使用 [Nop Chaos](/projects/nop-chaos/)。

## 核心特性

- 采用 Java 语言实现，不依赖第三方框架，可以和 [Quarkus](https://quarkus.io/){:rel="external nofollow"}{:target="_blank"} 或者 Spring 框架集成在一起使用；
- 支持 GraalVM 技术，可以借助于 Quarkus 或者 [Spring Native](https://docs.spring.io/spring-native/docs/current/reference/htmlsingle/){:rel="external nofollow"}{:target="_blank"} 框架编译为原生可执行程序，运行时不需要安装JDK，且启动速度提升数十倍；
- **设计目标是成为简单易用的领域语言工作台（Domain Language Workbench）**，通过增加简单的元数据定义就可自动得到对应的解析器、验证器、IDE 插件、调试工具等，并自动为 DSL 领域语言增加模块分解、差量定制、元编程等通用语言特性，在这一点上类似于 JetBrains 公司的 [MPS](https://www.jetbrains.com/mps/){:rel="external nofollow"}{:target="_blank"} 产品，只是设计原理和技术实现路径与 MPS 有着本质性差别；
- 采用云原生设计，内置分布式事务和多租户支持，可以单机运行，也可以作为分布式集群运行，可以提供在线的 API 服务，也可以将针对单个业务对象的在线服务自动包装为针对批处理文件的批处理任务，对于大多数业务应用场景均提供相应的模型支持，只需少量配置即可完成主要功能，大大降低对手工编码的需求；
- 在开发期可以作为**支持增量式开发的低代码平台**，自动生成各类代码以及相关文档，在运行期可以作为**面向最终用户的无代码平台的支撑技术**，允许客户在线调整业务模块功能，以所见即所得的方式进行产品迭代。

## 示例工程

- [`nop-app-mall`](https://gitee.com/canonical-entropy/nop-app-mall){:rel="external nofollow"}{:target="_blank"}：演示 Nop 平台基本开发流程；
- [`nop-orm-demo`](https://gitee.com/xyplayman/nop-orm-demo){:rel="external nofollow"}{:target="_blank"}：演示 Nop 平台中 `nop-orm` 模块的使用。

## 源码仓库

- Gitee：[`canonical-entropy/nop-entropy`](https://gitee.com/canonical-entropy/nop-entropy){:rel="external nofollow"}{:target="_blank"}
- GitHub：[`entropy-cloud/nop-entropy`](https://github.com/entropy-cloud/nop-entropy){:rel="external nofollow"}{:target="_blank"}
