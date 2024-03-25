NopOrm通过`Dialect`模型来封装不同数据库之间的差异。

# Dialect的继承和定制

[default dialect](https://gitee.com/canonical-entropy/nop-entropy/tree/master/nop-dao/src/main/resources/_vfs/nop/dao/dialect/default.dialect.xml)

[mysql dialect](https://gitee.com/canonical-entropy/nop-entropy/tree/master/nop-dao/src/main/resources/_vfs/nop/dao/dialect/mysql.dialect.xml)

[postgresql dialect](https://gitee.com/canonical-entropy/nop-entropy/tree/master/nop-dao/src/main/resources/_vfs/nop/dao/dialect/postgresql.dialect.xml)

参考上面的示例，`mysql.dialect.xml`和`postgresql.dialect.xml`均从`default.dialect.xml`继承。与Hibernate通过编程方式构造`Dialect`对象相比，使用dialect模型文件明显信息密度更高，表达形式更加直观。更重要的是，在`postgresql.dialect.xml`中可以清楚的识别出相对于`default.dialect.xml`所**增加、修改和减少**的配置。

因为整个Nop平台的底层都是基于可逆计算原理构建的，因此dialect模型文件的解析和验证可以由通用的`DslModelParser`完成，同时自动支持Delta定制，即**在不修改`default.dialect.xml`文件，也不修改所有对`default.dialect.xml`文件的引用的情况下**（例如不需要修改`postgresql.dialect.xml`中的`x:extends`属性），我们可以在`/_delta`目录下增加一个`default.dialect.xml`文件，通过它来定制系统内置的模型文件。

```xml
<!-- /_delta/myapp/nop/dao/dialect/default.dialect.xml -->
<dialect x:extends="raw:/nop/dao/dialect/default.dialect.xml">
  这里只需要描述差量变化的部分
</dialect>
```

Delta定制类似Docker技术中的overlay fs差量文件系统，**允许多个Delta层的叠加**。与Docker不同的是，Delta定制不仅发生在文件层面，它还延展到文件内部的差量结构运算。**借助于xdef元模型定义，Nop平台中的所有模型文件都自动支持Delta差量化定制**。
