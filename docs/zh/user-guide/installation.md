# ��װ

����׼���� JDK 17+��Maven 3.9.3+��Git

```shell
git clone https://gitee.com/canonical-entropy/nop-entropy.git
cd nop-entropy
mvn clean install -DskipTests -Dquarkus.package.type=uber-jar
```

ע��: **����������ҪJDK17���ϰ汾����֧��JDK8**, **��PowerShell��ִ�е�ʱ����Ҫ�����Ž�������������**

�ݷ�������ЩJDK�汾����ᱨ����jdk:17.0.9-graal�ᱨ��IndexOutOfBound�쳣��������������������ʱ�����ȳ���һ��OpenJDK��

```
mvn clean install "-DskipTests" "-Dquarkus.package.type=uber-jar"
```

quarkus.package.type������quarkus�����ʶ���һ��������ָ����Ϊuber-jar�����nop-quarkus-demo����Ŀ�����һ����������������ĵ�һjar��������ͨ��java
-jar XXX-runner.jar�ķ�ʽֱ�����С�

## PowerShell����������

���Խ�PowerShell�ı�������ΪUTF8

````
$OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8
````

Ŀǰ�Ѿ�������quarkus3.0�汾���õͰ汾maven����nop-auth-app��ģ����ܻ�ʧ�ܡ�����������maven
3.9.3�汾������ʹ��nop-entropy��Ŀ¼�µ�mvnwָ������Զ����ز�ʹ��maven 3.9.3��

* nop-idea-plugin
  nop-idea-plugin��IDEA�Ĳ����Ŀ���������Gradle���롣

```
cd nop-idea-plugin
gradlew buildPlugin
```

> Ŀǰʹ�õ�idea��������֧�ָ߰汾gradle��gradlew���Զ����������gradle�汾��Ŀǰʹ�õ���7.5.1
> �����ӿ�gradle�����ٶȣ�����gradle-wrapper.properties�л���
> distributionUrl=https://mirrors.cloud.tencent.com/gradle/gradle-7.5.1-bin.zip

��������Ĳ�������build/distributionsĿ¼�¡��μ�[����İ�װ��ʹ��](docs/dev-guide/ide/idea.md)��
