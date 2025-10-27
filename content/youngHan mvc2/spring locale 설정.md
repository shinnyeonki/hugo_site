---
title: spring locale 설정
resource-path: youngHan mvc2/spring locale 설정.md
keywords:
tags:
date: 2025-03-30T20:50:00+09:00
lastmod: 2025-03-30T20:50:00+09:00
---
# spring locale 설정
### 질문

`build.gradle`

```java
// 모든 Java 작업에 한국어 로케일 설정 적용
tasks.withType(JavaForkOptions) {
    // 모든 JVM 포크 작업(test, bootRun 등)에 적용
    systemProperty 'user.language', 'ko'
    systemProperty 'user.country', 'KR'
}

// Java 컴파일 작업에도 동일한 설정
tasks.withType(JavaCompile) {
    options.fork = true
    options.forkOptions.jvmArgs += ['-Duser.language=ko', '-Duser.country=KR']
}
```

질문의 내용을 null값으로 주게 되면 시스템 os locale 을 찾는다고 했는데 실제 제대로 적용되지 않는 상황인것 같습니다  
저는 linux에서 개발환경구성되어 있는데  
linux 에서 지역 locale 을 쓰지 않고 중립 locale`LANG=C.UTF-8` 을 씁니다 그래서 저도 동일한 문제가 발생하였습니다

 다음 3가지 접근법이 제가 알고 있는 접근법 입니다

1. 운영체제 locale 변경(질문에 내용에 해당되지 않음)
2. jvm locale 변경`-Duser.language=ko -Duser.country=KR` 이전 댓글의 내용 동일
3. 빌드 설정 처음의 요약과 동일
4. 코드를 수정
    
      
    
    ```java
    @BeforeAll
    static void setUpLocale() {
        Locale.setDefault(Locale.KOREA);
    }
    ```


### Spring MVC 프로젝트에서 Gradle을 활용한 일관된 로케일 설정



사용자는 IntelliJ IDEA에서 기본 로케일이 `en-US`로 표시되는 반면, 운영 체제의 로케일은 한국어로 설정되어 있는 문제를 보고했습니다. 이로 인해 Spring MVC 애플리케이션이 `null` 로케일이 주어졌을 때 영어 리소스 번들을 기본적으로 선택하는 문제가 발생했습니다. 반면, `ko_KR` 로케일을 명시적으로 설정했을 때는 애플리케이션이 정상적으로 동작함을 확인했습니다.

이에 따라 사용자는 Gradle 빌드 과정에서 테스트 및 컴파일 단계에서 한국어 로케일을 강제하도록 설정하는 Gradle 구성 스니펫을 제공하였으며, 이에 대한 자세한 설명을 요청했습니다. 본 보고서는 이러한 Gradle 설정의 목적과 기능을 설명하고, IntelliJ와 Gradle 간의 로케일 불일치 문제를 해결하는 방법을 다룹니다.

---

### 1. Gradle과 작업(Task) 개념

Gradle은 강력한 빌드 자동화 도구로, 작업(Task)이라는 개념을 중심으로 동작합니다. 작업(Task)은 소스 코드 컴파일, 테스트 실행, 문서 생성, 애플리케이션 패키징 등의 독립적인 단위로 구성됩니다. 이러한 작업은 Gradle 빌드 스크립트(`build.gradle` 또는 `build.gradle.kts`)에서 정의되며, 플러그인을 적용하여 추가적인 작업을 확장할 수도 있습니다.

예를 들어, `Java` 플러그인을 적용하면 다음과 같은 작업이 자동으로 추가됩니다.

- `compileJava` : Java 소스 코드 컴파일
    
- `test` : 테스트 실행
    
- `jar` : JAR 파일 생성
    

Gradle에서 실행 가능한 모든 작업 목록을 확인하려면 프로젝트의 루트 디렉터리에서 다음 명령어를 실행할 수 있습니다.

```sh
./gradlew tasks
```

---

### 2. JVM 프로세스 분리(Forking)와 Gradle 설정

Gradle에서는 특정 작업을 수행할 때 별도의 JVM 프로세스를 실행(포크, Forking)할 수 있습니다. 이러한 작업에는 주로 **테스트 실행**(`Test`), **Java 코드 실행**(`JavaExec`), 그리고 **Java 코드 컴파일**(`JavaCompile`)이 포함됩니다.

JVM을 포크하는 이유는 다음과 같습니다.
- 빌드 프로세스와 개별 작업을 격리하여 안정성 확보
- 특정 JVM 설정(메모리 크기, 시스템 속성 등)을 독립적으로 적용
- 테스트 작업 병렬 실행을 통해 빌드 속도 향상

Gradle에서는 `JavaForkOptions` 인터페이스를 사용하여 포크된 JVM에 다양한 설정을 적용할 수 있습니다. 대표적으로 `Test` 및 `JavaExec` 작업은 `JavaForkOptions`을 구현하며, `JavaCompile` 작업도 설정에 따라 JVM을 포크할 수 있습니다.

---

### 3. Gradle 설정 코드 분석

#### (1) 테스트 및 실행 작업에 대한 로케일 설정

```java
tasks.withType(JavaForkOptions) {
    systemProperty 'user.language', 'ko'
    systemProperty 'user.country', 'KR'
}
```

##### **설명**

- `tasks.withType(JavaForkOptions) {...}`
    - Gradle의 `TaskContainer`에서 `JavaForkOptions`을 구현하는 작업만 선택
    - 대표적으로 `Test` 및 `JavaExec` 작업이 포함됨
- `systemProperty 'user.language', 'ko'`
    - JVM 시스템 속성 `user.language`를 `ko`(한국어)로 설정
- `systemProperty 'user.country', 'KR'`
    - JVM 시스템 속성 `user.country`를 `KR`(대한민국)로 설정
        

**결과:**

- Gradle이 테스트(`Test`) 또는 Java 실행(`JavaExec`)을 수행할 때, JVM의 기본 로케일이 `ko_KR`로 설정됨
- 애플리케이션이 `null` 로케일을 받을 때 한국어 리소스 번들을 선택하도록 강제됨
    

---

#### (2) Java 컴파일 작업에 대한 로케일 설정

```gradle
tasks.withType(JavaCompile) {
    options.fork = true
    options.forkOptions.jvmArgs += ["-Duser.language=ko", "-Duser.country=KR"]
}
```

##### **설명**

- `tasks.withType(JavaCompile) {...}`
    - Gradle의 `JavaCompile` 작업에만 설정 적용
- `options.fork = true`
    - Java 컴파일러(`javac`)를 별도의 JVM 프로세스에서 실행하도록 설정
- `options.forkOptions.jvmArgs += ["-Duser.language=ko", "-Duser.country=KR"]`
    - 포크된 JVM에 `user.language` 및 `user.country` 시스템 속성 추가

**결과:**
- Java 코드 컴파일(`javac`)이 한국어 로케일에서 수행됨
- 만약 어노테이션 프로세서 또는 코드 생성이 로케일에 따라 다른 결과를 생성한다면, 이를 한국어 기준으로 일관되게 유지할 수 있음

---

### 4. IntelliJ IDEA와 Gradle의 로케일 불일치 문제

IntelliJ IDEA는 자체 설정에서 기본 로케일을 관리하기 때문에, 운영 체제의 로케일과 일치하지 않을 수 있습니다.

- IntelliJ에서 실행되는 JVM과 Gradle이 실행하는 JVM은 독립적으로 동작
- IntelliJ는 기본적으로 `en-US` 로케일을 사용할 수 있음
- Gradle은 OS 설정을 직접 따르지 않고, 명시적으로 설정된 로케일을 사용

이러한 차이점 때문에 Gradle 빌드가 IntelliJ의 로케일과 다르게 동작할 수 있습니다. 이를 해결하려면 Gradle 설정을 명확하게 지정해야 합니다.

---

### 5. 로케일 설정을 더욱 유연하게 관리하는 방법

Gradle 속성(`gradle.properties`) 또는 환경 변수를 활용하여 로케일 설정을 변경할 수 있습니다.

#### **(1) `gradle.properties` 파일에 설정 추가**

`gradle.properties` (프로젝트 루트에 위치)

```
userLanguage=ko
userCountry=KR
```

#### **(2) `build.gradle`에서 Gradle 속성 적용**

```gradle
tasks.withType(JavaForkOptions) {
    systemProperty 'user.language', project.properties['userLanguage']
    systemProperty 'user.country', project.properties['userCountry']
}

tasks.withType(JavaCompile) {
    options.fork = true
    options.forkOptions.jvmArgs += [
        "-Duser.language=${project.properties['userLanguage']}",
        "-Duser.country=${project.properties['userCountry']}"
    ]
}
```

**장점:**

- 필요에 따라 `gradle.properties` 파일에서 로케일을 쉽게 변경 가능
    
- 다양한 환경(OS, 개발자 설정)에서 유연하게 적용 가능
    

---

### 6. 결론 및 권장 사항

✅ **Gradle 설정 유지:**  
테스트 및 컴파일 단계에서 일관된 한국어 로케일을 강제하기 위해 제공된 Gradle 설정을 유지하는 것이 좋습니다.

✅ **애플리케이션 실행 시 로케일 확인:**  
Spring Boot의 `bootRun` 작업을 실행할 때도 한국어 로케일을 적용해야 할 수 있습니다. IntelliJ의 **Run Configuration**에서 VM 옵션을 설정하는 것이 도움이 될 수 있습니다.

✅ **환경별 로케일 변경 고려:**  
Gradle 속성(`gradle.properties`) 또는 환경 변수를 활용하여 필요에 따라 로케일을 변경할 수 있도록 설정하는 것이 좋습니다.

✅ **운영 환경 고려:**  
최종 애플리케이션이 배포되는 환경에서도 로케일 설정을 고려해야 합니다. OS의 기본 로케일이 애플리케이션 실행 시 영향을 줄 수 있습니다.