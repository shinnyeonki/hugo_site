---
title: spring 외부설정
date: 2025-08-09T16:26:56+09:00
lastmod: 2025-10-22T03:20:38+09:00
resource-path: spring 외부설정.md
aliases: 
tags: 
---
1. application.properties
설정 우선순위 (가장 높음 → 낮음)

| 우선순위 | 소스                                                  |
| ---- | --------------------------------------------------- |
| 1    | Devtools 전역 설정 (`.spring-boot-devtools.properties`) |
| 2    | 테스트 애너테이션 (`@TestPropertySource`)                   |
| 3    | 커맨드 라인 아규먼트 (`--server.port=8080`)                  |
| 4    | JVM 시스템 프로퍼티 (`-Dproperty=value`)                   |
| 5    | OS 환경 변수                                            |
| 6    | `RandomValuePropertySource` (`${random.*}`)         |
| 7    | JAR 외부의 `application-{profile}.properties`          |
| 8    | JAR 외부의 `application.properties`                    |
| 9    | JAR 내부의 `application-{profile}.properties`          |
| 10   | JAR 내부의 `application.properties`                    |
| 11   | `@PropertySource` / `@ConfigurationProperties`      |




---
### application.properties



#### **application.properties 우선 순위**

> application.properties 파일은 아래 4가지 경로에 만들 수 있지만,  우선순위에 따라 덮어쓰기가 된다.

> 1. file:./config/  
> 2. file:./  
> 3. classpath:/config/  
> 4. classpath:/

- file 경로 : src 폴더 하위에 application.properties
- classpath 경로 : 기본적으로 만들어지는 resources 폴더 하위 application.properties


### application.properties

#### 1. 설정 파일 로딩 원리

Spring Boot는 시작 시 Environment 객체를 생성합니다. 이후 정해진 우선순위에 따라 application.properties, 환경 변수 등 다양한 소스(Source)의 설정 값을 읽어 Environment에 채워 넣습니다. 애플리케이션의 다른 부분들은 이 Environment를 통해 설정 값을 사용합니다.

#### 2. 설정 우선순위

핵심 원칙은 **외부 설정이 내부 설정을 덮어쓴다(override)**는 것입니다. 즉, 애플리케이션을 실행하는 시점에 주입하는 설정이 코드에 포함된 설정보다 우선순위가 높습니다.

**실무 핵심 순서 (높은 순):**

- **테스트 코드 내 설정** (@TestPropertySource)
- **커맨드 라인 인수** (java -jar app.jar --server.port=9000)
- **OS 환경 변수** (export SERVER_PORT=9002)
- **JAR 외부의 설정 파일** (./config/application.properties)
- **JAR 내부의 설정 파일** (classpath:/application.properties)
- **@PropertySource 로드 파일**
- **SpringApplication 기본값**
    

### 3. @ConfigurationProperties 고급 활용

프로퍼티 값을 타입-세이프(Type-safe)하게 객체로 바인딩하는 기능입니다.
- **구조**: 중첩 객체, 리스트, 맵 등 복잡한 구조의 프로퍼티를 객체에 자동으로 매핑할 수 있습니다.
- **유효성 검사**: @Validated 애너테이션과 spring-boot-starter-validation 의존성을 추가하면, 로드된 값에 대해 @NotNull, @Min 등 JSR-303 유효성 검사를 적용할 수 있습니다.
    

### 4. 외부 설정 파일 주입

- spring.config.location: 지정된 위치의 파일**만** 사용합니다. (기본 경로 무시)
- spring.config.additional-location: 기본 경로를 유지하면서 지정된 파일을 **추가로** 로드합니다.
- spring.config.import: application.properties 내에서 다른 설정 파일을 불러옵니다. optional: 접두사를 붙이면 파일이 없어도 오류가 발생하지 않습니다.
    - spring.config.import=optional:classpath:aws.properties

### 5. @PropertySource vs application.properties

- **우선순위**: @PropertySource로 로드한 설정은 **application.properties보다 우선순위가 낮습니다.** 즉, 두 파일에 동일한 키가 있으면 application.properties의 값이 적용됩니다.
    
- **용도**: @PropertySource는 특정 기능에 대한 설정을 모듈화하거나 레거시 설정을 통합할 때 유용합니다. 주 설정 파일은 application.properties를 사용하는 것이 표준입니다.
    

### 6. IDE 지원 (자동 완성)

spring-boot-configuration-processor 의존성을 추가하면, @ConfigurationProperties로 정의한 설정 키에 대해 IDE가 자동 완성 및 설명을 제공하여 개발 생산성을 크게 향상시킵니다.

### 7. 민감 정보 관리

민감한 정보(DB 비밀번호, API 키 등)는 코드에 직접 작성하지 않는 것이 원칙입니다.

- **관리 방법**: OS 환경 변수나 외부 설정 파일을 사용합니다.
    
- **권장 방식**: 클라우드 환경에서는 **Vault, AWS SSM, GCP Secret Manager**와 같은 외부 보안 저장소와 연동하는 것이 가장 안전합니다.
    

### 8. 프로필과 조건부 설정

- @Profile: "dev", "prod" 와 같이 특정 프로필이 활성화될 때만 특정 빈(Bean)을 등록하도록 제어합니다.
    
- @ConditionalOnProperty: 특정 프로퍼티 값에 따라 빈의 등록 여부를 결정합니다. 기능 플래그(Feature Flag)를 구현할 때 매우 유용합니다.
    

### 9. 테스트 설정

- **설정 분리**: src/test/resources/application-test.properties와 같이 테스트용 설정 파일을 분리하여 관리합니다.
    
- @TestPropertySource: 특정 테스트 케이스에만 적용할 설정을 높은 우선순위로 주입할 수 있어, 독립적인 테스트 환경을 구성하는 데 효과적입니다.
    

### 10. .properties vs .yml

- **우선순위**: 동일한 경로에 두 파일이 모두 존재할 경우, **application.properties 파일이 .yml 파일보다 항상 우선순위가 높습니다.**
    
- **특징**:
    
    - **application.properties**: key=value 형식. 우선순위가 더 높음.
        
    - **application.yml**: YAML 형식. 계층 구조 표현이 용이해 가독성이 좋음.
        
    

### 11. 핵심 실무 팁

- **보안**: 민감 정보(비밀번호, API 키 등)는 절대로 Git에 커밋하지 마세요.
    
- **분리**: 테스트 환경을 위한 프로필(application-test.properties)을 분리하여 관리하세요.
    
- **컨벤션**: 팀 내에서 .properties와 .yml 중 하나를 주력으로 사용하기로 컨벤션을 정하여 혼란을 방지하세요. (최근에는 가독성이 좋은 .yml이 선호되는 추세입니다.)
