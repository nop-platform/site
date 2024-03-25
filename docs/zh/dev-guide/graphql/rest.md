# REST链接

Nop平台中使用的REST链接很少，只有以下几种

* /graphql
* /r/{bizObjName}__{bizMethod}
* /p/{bizObjName}__{bizMethod}
* /f/download
* /f/upload

1. /r/的GET请求对应于graphql的Query，而POST请求可以调用query，也可以调用mutation
2. /p/会自动识别返回的结果是不是WebContentBean对象，如果是，则按照WebContentBean中设置的contentType来设置http的contentType，一般用于预览文件。
  例如调试模式下/p/DevDoc__beans会以XML格式显示系统中所有注册的bean
3. /f/download用于下载文件

后台的实现代码对应于

1. io.nop.quarkus.web.service.QuarkusGraphQLWebService
2. io.nop.file.quarkus.web.QuarkusFileService

{bizObjName}__{bizMethod}会调用到后台BizModel对象的方法上。例如`NopAuthUser__resetUserPassword`
会调用到 NopAuthUserBizModel对象的resetUserPassword方法。