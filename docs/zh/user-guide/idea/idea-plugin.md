# XLang DSL Plugin

在Nop平台中，所有的DSL都采用XML语法格式，使用统一的xdef元模型来提供规范化的形式约束和基本的属性语义。基于xdef元模型，我们可以实现统一的语法提示、关联分析、断点调试等功能，而无需针对每个DSL语言单独编写IDE插件。

>  插件的编译、安装可以参考文档： [idea.md](../../dev-guide/ide/idea.md)

## DSL语法格式

XLang DSL采用XML格式，根节点上必须通过x:schema属性来指定所对应的xdef元模型，例如

```xml
<beans x:schema="/nop/schema/beans.xdef" 
       xmlns:x="/nop/schema/xdsl.xdef" ...>
</beans>
```

## 语法提示

输入标签名、属性名、属性值的时候，会弹出xdef中定义的相关信息。

![idea-completion](idea-completion.jpg)

## 语法检查

插件会根据xdef定义检查标签名、属性名以及属性值的格式。不符合要求的语法元素会被增加Error标记。

![idea-check](idea-check.jpg)

## 快速文档

鼠标悬停在标签名、属性名以及属性值上时，会显示xdef文件中定义的文档
![idea-quick-doc](idea-quick-doc.jpg)

## 路径链接

鼠标悬停在路径格式的属性值上，同时按CTRL键，会提示跳转到路径所对应的文件。
对于XPL模板标签，则提示跳转到标签库的定义处。
![idea-link](idea-link.png)

## 断点调试

在XScript脚本或者Xpl模板片段中可以增加断点。
插件增加了一个与Run和Debug指令平级的执行器XLangDebug，通过它启动后会同时启动Java调试器和启动XLang脚本语言调试器。

![idea-executor](idea-executor.png)

![xlang-debugger](xlang-debugger.png)

为了调试XLang，需要引入nop-xlang-debugger模块

````xml
<dependency>
    <groupId>io.github.entropy-cloud</groupId>
    <artifactId>nop-xlang-debugger</artifactId>
    <version>2.0.0-SNAPSHOT</version>
</dependency>
````