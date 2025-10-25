---
title: mac java 관리
resource-path: 02.inbox/mac java 관리.md
aliases:
tags:
  - mac
  - java
date: 2024-05-20T11:00:00+09:00
lastmod: 2025-06-20T02:16:33+09:00
---
apple 에서 관리되는 방식이므로 brew 패키지 관리자를 통해 하는 방법이 아니다


설치된 java 보기

```shell
/usr/libexec/java_home -verbose 
```

1. 모든 JDK는 기본 위치인 `/Library/Java/JavaVirtualMachines`에 놔두어집니다. 시스템은 기본적으로 가장 높은 버전을 선택합니다.
2. 기본 선택에서 제외하려면 해당 JDK의 `Contents/Info.plist` 파일 이름을 `Info.plist.disabled`로 변경합니다. 이렇게 하면 `$JAVA_HOME`이 해당 JDK를 가리키거나 스크립트나 설정에서 명시적으로 참조할 때 해당 JDK를 여전히 사용할 수 있습니다. 단지 시스템의 `java` 명령어에서는 무시됩니다.
3. 시스템 런처는 `Info.plist` 파일이 있는 JDK 중 가장 높은 버전을 사용합니다.



삭제할 때 여기도 확인

```shell
sudo rm -fr /Library/Internet\ Plug-Ins/JavaAppletPlugin.plugin 
sudo rm -fr /Library/PreferencePanes/JavaControlPanel.prefPane 
```