# 启用权限

* 配置`nop.auth.enable-action-auth=true`后启用操作权限。字段级别权限也利用这一开关
* 配置`nop.auth.enable-data-auth=true`后启用数据权限。
* 配置`nop.auth.use-data-auth-table=true`启用数据权限配置表`NopAuthRoleDataAuth`，数据库中配置的数据权限规则可以和配置文件中的权限规则合并
* 缺省会加载/nop/main/auth/main.action-auth.xml 静态权限配置文件，可以通过nop.auth.site-map.static-config-path定制为不同的值
* 在main.action-auth.xml可以通过`x:extends`来引入已有的权限配置文件。
* 如果配置`nop.auth.skip-check-for-admin=true`,则对于具有admin角色的用户会跳过操作权限检查，缺省为true。
* 配置`nop.auth.service-public=true`可以开放后台服务，无需登录即可访问后台服务函数
* 配置`nop.auth.quarkus-dev-public=true`会开放quarkus调试页面，无需登录即可访问/q/graphql-ui等调试页面

> 平台在调试模式下启动时会打印出所有已知配置变量以及它对应的配置位置

# 核心接口

1. `IUserContext`: 保存`userId`, `roles`等用户身份和权限相关信息。通过`IUserContext.set()/get()`函数存取。
2. `IActionAuthChecker`: 检查操作权限和字段权限。在`GraphQLExecutor`中针对每个GraphQL field调用。
3. `IDataAuthChecker`: 检查数据权限。在`CrudBizModel`中为`Query`对象自动追加权限过滤条件，在获取到每个实体后执行`check`动作。
4. 登录验证在`AuthHttpServerFilter`类中通过`ILoginService`接口调用实现。
5. `ILoginService`接口负责登入登出和`token`校验相关的所有逻辑。平台内置了`LoginServiceImpl`和`OAuthLoginServiceImpl`两个实现。

# 操作权限

## 操作权限配置

通过`action-auth.xml`和`NopAuthResource`后台对象可以配置操作权限。`resource`的类型分为`TOPM`、`SUBM`和`FNPT`，分为对应于顶级菜单、子菜单和功能点。在功能点上可以标记对应的`permissions`。

````xml

<resource id="NopAuthDept-main" displayName="部门" orderNo="10001" i18n-en:displayName="Department"
          icon="ant-design:appstore-twotone" component="AMIS" resourceType="SUBM"
          url="/nop/auth/pages/NopAuthDept/main.page.yaml">
    <children>
        <resource id="FNPT:NopAuthDept:query" displayName="查询部门" orderNo="10002" resourceType="FNPT">
            <permissions>NopAuthDept:query</permissions>
        </resource>
        <resource id="FNPT:NopAuthDept:update" displayName="修改部门" orderNo="10003" resourceType="FNPT">
            <permissions>NopAuthDept:update</permissions>
        </resource>
        <resource id="FNPT:NopAuthDept:delete" displayName="删除部门" orderNo="10004" resourceType="FNPT">
            <permissions>NopAuthDept:delete</permissions>
        </resource>
    </children>
</resource>
````

然后系统后台可以配置用户角色和`NopAuthResource`的对应关系，用于控制用户能访问哪些菜单，再由此推断出用户具有哪些`permission`。

1. 菜单项对应的`resourceType=SUBM`， 页面中对应的具体的功能点（例如修改按钮）对应`resourceType=FNPT`
2. 如果使用amis页面，需要配置`component=AMIS`，`url=页面的虚拟文件路径`

## 通过界面配置权限
先不要开启操作权限，通过界面增加admin角色，然后给指定用户分配admin角色，此后再开启操作权限。通过具有admin角色的用户给其他用户分配角色，
并为角色指定它所能访问的NopAuthResource。

NopAuthResource按照siteId进行组织，缺省使用siteId=MAIN作为主站点的网站菜单。nop-auth支持同时管理多个前端应用所对应的菜单链接。
比如siteId=mobile可以用于移动端菜单，而siteId=MAIN用于Web端等。

## 后台Action

在action函数上通过`@Auth`注解来指定需要对应的`permissions`或者允许访问的`roles`。如果不指定，则按照是否是`@BizQuery`
或者`@BizMutation`自动设置`permissions`为`{BizObjName}:{actionName}|{BizObjName}:query`，以及`{BizObjName}:{actionName}|{BizObjName}:mutation`

在权限分配的时候，如果允许所有读取操作，则可以配置`{BizObjName}:query`，这样就不需要挨个指定`{actionName}`

例如

````javascript
@Auth(permissions="delete")
@BizMutation
public boolean delete(@Name("id") @Description("@i18n:biz.id|对象的主键标识") String id, IServiceContext context) {
    return super.delete(id, context);
}
````

`permission`的完整格式为`bizObjName:action`，如果只写action部分，则会自动补充`bizObjName`前缀。例如上面配置的`permissions="delete"`最终转换得到的
可能是`NopAuthUser:delete`。

如果在action上不标注`@Auth`注解，则缺省对应的`permission`为`{bizObjName}:mutation`或者`{bizObjName}:query`。

在xbiz文件中可以为对应action设置`auth`配置，它会覆盖同名的Java方法上通过`@Auth`注解引入的权限设置。例如

````xml

<mutation name="delete">
    <auth permissions="delete"/>
</mutation>
````

## 结果对象上的属性

在xmeta文件中，可以为`prop`指定`auth`设置

```xml

<prop name="xx">
    <auth permissions="NopAuthUser:query" roles="admin" for="read"/>
    <auth permissions="NopAuthUser:mutation" roles="hr" for="write"/>
</prop>
```

通过这里的配置可以实现字段级别的读写权限控制. `for="read"`表示控制字段读权限，`for="write"`控制字段写权限，而`for="all"`同时允许读和写

## 公开访问
如果`@Auth`注解或者xbiz中的auth配置指定了publicAccess=true，则该方法为公开可访问方法，会自动跳过操作权限检查。但是数据权限仍然会应用。

所有的用户都自动具有角色user，所以如果配置`@Auth(roles="user")`则表示允许所有登录用户访问。这种方式与publicAccess的区别在于，如果标记为
publicAccess的方法不会检查当前访问用户是否已经登录。

# 操作权限检查接口

系统通过`IActionAuthChecker`接口来检查操作权限。

```java
public interface IActionAuthChecker {
    boolean isPermitted(String permission, ISecurityContext context);

    default boolean isAllPermitted(Set<String> permissions, ISecurityContext context) {
        if (permissions == null || permissions.isEmpty())
            return true;

        for (String permission : permissions) {
            if (!isPermitted(permission, context))
                return false;
        }
        return true;
    }

    default boolean isPermissionSetSatisfied(MultiCsvSet permissionSet, ISecurityContext context) {
        if (permissionSet == null || permissionSet.isEmpty())
            return true;

        for (Set<String> permissions : permissionSet) {
            if (isAllPermitted(permissions, context))
                return true;
        }
        return false;
    }
}
```

根据`auth`配置进行权限校验的实现如下：

```java
IUserContext userContext = context.getUserContext();
if (userContext == null)
   throw new IllegalStateException("nop.err.auth.no-user-context");
if (auth.getRoles() != null && !auth.getRoles().isEmpty()) {
   if (userContext.isUserInAnyRole(auth.getRoles()))
       return;
}

if (auth.getPermissions() != null && !auth.getPermissions().isEmpty()) {
   if (checker.isPermissionSetSatisfied(auth.getPermissions(), context))
       return;
}

 throw new NopException(AuthApiErrors.ERR_AUTH_NO_PERMISSION)
           .param(AuthApiErrors.ARG_ACTION_NAME, fieldName)
           .param(ARG_PERMISSION, auth.getPermissions())
           .param(ARG_ROLES, auth.getRoles())
           .param(ARG_OBJ_TYPE_NAME, objTypeName);

```

判断规则：

1. 如果设置了`roles`，则满足角色条件则返回`true`。`roles`的配置一般是逗号分隔的字符串，具有任意一个`role`就具有对应权限
2. 如果设置了`permissions`，则不满足`permission`条件则返回`false`。`permissions`配置的类型一般为`multi-csv-set,`格式为`a,b|c,d`，表示`(a并且b)或者(c并且d)`

也就是说可以只配置`roles`，或者只配置`permissions`。如果只配置了`permissions`，则系统内部实现是根据`role`和`resource`之间的映射关系，
找到满足`permission`条件的所有`role`，然后再按照`roles`条件去进行权限检查。

> 根据`permission`查找到所有的`role`这一步不依赖于具体用户，可以统一完成计算然后缓存映射结果。

# 数据权限

后台内置的`findPage`、`findList`和`findFirst`动作都会应用数据权限检查接口`IDataAuthChecker`。
通过`nop.auth.enable-data-auth`来启用数据权限，缺省为`true`

### 数据权限定义文件

在`/nop/main/auth/app.data-auth.xml`文件中配置数据权限。`filter`段为xpl格式，输出`filter`定义节点。xpl执行时上下文具有`entity`、`userContext`等变量

````xml

<data-auth>
    <objs>
        <obj name="NopSysUserVariable">
            <role-auths>
                <role-auth roleId="manager">
                </role-auth>

                <role-auth roleId="user">
                    <filter>
                        <eq name="userId" value="@biz:userId"/>
                    </filter>
                </role-auth>
            </role-auths>
        </obj>
    </objs>
</data-auth>
````

* 针对不同的角色可以设置不同的数据权限规则。一个用户只会匹配优先级最高的一条规则（如果规则优先级相同，则按照顺序检查用户是否具有指定角色）

在`filter`段中可以编写权限过滤条件，其中`value`部分可以使用`@biz:`为前缀的表达式变量，例如`@biz:userId`、`@biz:deptId`等。
全部可用的变量在[biz-var.dict.yaml](https://gitee.com/canonical-entropy/nop-entropy/blob/master/nop-xlang/src/main/resources/_vfs/dict/core/biz-var.dict.yaml)
中定义。

### 通过NopAuthRoleDataAuth表来定义数据权限

数据库中定义的数据权限会和`data-auth.xml`配置文件中定义的权限合并。

### 业务场景拆分

经常出现一种情况是同样的业务对象在不同的业务场景中过滤条件不同，比如说每个人都可以查询自己的数据，而admin可以查询所有人的数据，但是他仍然需要一个查询自己数据的页面。
这本质上是同一个业务对象分裂为两个业务场景，一个是查询owner的数据，一个是查询全部数据。对于这种应用可以有三种解决方案：

1. 对象拆分
直接新建一个新的业务对象，比如MyObject_self，然后它会自动使用缺省的xmeta模型和xbiz配置。
````
<bean id="MyObject_self" class="xxx.MyObjectBizModel" />
````

如果增加MyObject_self.xmeta，则MyObject_self会使用这个meta配置，否则会使用缺省的MyObject.xmeta。对于xbiz配置，同样是这样处理。

> 这种缺省模型的识别逻辑在BizObjectBuilder.java类中实现。

对象拆分后，数据权限那里就可以配置使用不同的权限过滤条件。同时通过meta上的filter也可以直接限定过滤条件。

2. 如果不拆分对象，也可以在查询方法中增加过滤条件

````xml
 <query name="active_findPage" x:prototype="findPage">
    <source>
        <c:import class="io.nop.auth.api.AuthApiConstants" />

        <bo:DoFindPage query="${query}" selection="${selection}" xpl:lib="/nop/biz/xlib/bo.xlib">
            <filter>
                <eq name="status" value="${AuthApiConstants.USER_STATUS_ACTIVE}" />
            </filter>
        </bo:DoFindPage>
    </source>
</query>
````

或者在java中实现
````
public PageBean<MyObject> findPage_self(@Name("query")QueryBean query, FieldSelectonBean selection, IServiceContext context){
  return doFindPage(query, (q,ctx)->{
     q.addFilter(FilterBeans.eq("ownerId", ctx.getUserId());
  }, selection, context);
}
````

3. 通过authObjName实现数据权限配置切换
上面的第二种方法会导致data-auth.xml的配置总是应用到当前对象上。如果是不同的业务场景需要启用不同的权限配置，可以使用authObjName参数来区分。

CrudBizModel的doFindPage0/doFindList0/doFindFirst0等方法可以通过authObjName参数指定不同于当前对象名的权限对象名，从而启用不同的数据权限配置。

````
    @BizQuery
    @BizArgsNormalizer(BizConstants.BEAN_nopQueryBeanArgsNormalizer)
    @GraphQLReturn(bizObjName = BIZ_OBJ_NAME_THIS_OBJ)
    public List<T> findList(@Optional @Name("query") QueryBean query, FieldSelectionBean selection, IServiceContext context) {
        if (query != null)
            query.setDisableLogicalDelete(false);
        return doFindList(query, this::defaultPrepareQuery, selection, context);
    }

    @BizAction
    public List<T> doFindList(@Name("query") QueryBean query,
                              @Name("prepareQuery") BiConsumer<QueryBean, IServiceContext> prepareQuery,
                              FieldSelectionBean selection,
                              IServiceContext context) {
        return doFindList0(query, getBizObjName(), prepareQuery, selection, context);
    }
    
    @BizAction
    public List<T> doFindList0(@Name("query") QueryBean query,
                               @Name("authObjName") String authObjName,
                               @Name("prepareQuery") BiConsumer<QueryBean, IServiceContext> prepareQuery,
                               FieldSelectionBean selection,
                               IServiceContext context){
        ...
    }
````

内置的findList使用doFindList函数实现，而doFindList实际是使用doFindList0，然后传入authObjName为当前业务对象名。