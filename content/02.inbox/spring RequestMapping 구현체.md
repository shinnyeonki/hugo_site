---
title: spring RequestMapping 구현체
resource-path: 02.inbox/spring RequestMapping 구현체.md
aliases:
tags:
  - spring
  - reference
date: 2025-03-10T00:09:00+09:00
lastmod: 2025-08-19T22:16:22+09:00
---
스프링 MVC의 **`HandlerMapping` 구현체**는 다양한 방식으로 요청을 핸들러(컨트롤러)에 매핑합니다. 각 클래스의 역할과 특징을 체계적으로 정리했습니다:

---

### 1. **`AbstractHandlerMapping`**
- **역할**: 모든 `HandlerMapping`의 **기반 추상 클래스**.
- **특징**:
  - 인터셉터(`HandlerInterceptor`) 관리 및 실행 로직을 제공합니다.
  - `getHandler()` 메서드를 구현해 실제 핸들러를 찾는 로직을 정의합니다.
- **사용 예시**:  
  다른 구체적인 `HandlerMapping` 클래스들이 이 클래스를 상속받아 확장합니다.

---

### 2. **`AbstractUrlHandlerMapping`**
- **역할**: **URL 기반 매핑**을 위한 추상 클래스.
- **특징**:
  - URL 패턴과 핸들러를 연결하는 공통 로직을 제공합니다.
  - `urlMap` 또는 `handlerMap`을 사용해 URL-핸들러 매핑 정보를 저장합니다.
- **하위 클래스**:
  - `BeanNameUrlHandlerMapping`
  - `SimpleUrlHandlerMapping`
  - `AbstractDetectingUrlHandlerMapping`

---

### 3. **`BeanNameUrlHandlerMapping`**
- **역할**: **스프링 빈 이름을 URL로 매핑**합니다.
- **특징**:
  - 빈 이름이 `/`로 시작하는 경우, 해당 URL로 매핑됩니다.
  - XML 또는 자바 설정으로 빈을 등록할 때 이름을 URL로 지정합니다.
- **예시**:

  ```java
  @Component("/hello") // URL: /hello
  public class HelloController implements Controller { ... }
  ```

---

### 4. **`SimpleUrlHandlerMapping`**
- **역할**: **정적 URL 매핑**을 명시적으로 설정합니다.
- **특징**:
  - URL과 핸들러를 직접 연결하는 `urlMap`을 제공합니다.
  - XML/자바 설정으로 유연하게 매핑할 수 있습니다.
- **예시**:

  ```java
  @Bean
  public SimpleUrlHandlerMapping handlerMapping() {
      SimpleUrlHandlerMapping mapping = new SimpleUrlHandlerMapping();
      Map<String, Object> urlMap = new HashMap<>();
      urlMap.put("/api/products", productController());
      return mapping;
  }
  ```

---

### 5. **`AbstractDetectingUrlHandlerMapping`**
- **역할**: **자동 URL 감지**를 위한 추상 클래스.
- **특징**:
  - 빈의 이름이나 메타데이터를 분석해 URL을 자동으로 생성합니다.
  - 주로 레거시 시스템이나 특정 프레임워크에서 사용됩니다.
- **하위 클래스**:
  - `ControllerClassNameHandlerMapping` (클래스 이름을 URL로 매핑, 예: `HelloController` → `/hello*`)

---

### 6. **`RequestMappingHandlerMapping`**
- **역할**: **애노테이션 기반 컨트롤러 매핑** (가장 일반적).
- **특징**:
  - `@RequestMapping`, `@GetMapping`, `@PostMapping` 등을 분석해 URL을 매핑합니다.
  - `@Controller` 또는 `@RestController`로 선언된 클래스의 메서드를 처리합니다.
- **예시**:

  ```java
  @RestController
  public class UserController {
      @GetMapping("/users")
      public List<User> getUsers() { ... }
  }
  ```

---

### 7. **`RequestMappingInfoHandlerMapping`**
- **역할**: **`@RequestMapping` 메타데이터 기반 매핑**.
- **특징**:
  - `RequestMappingHandlerMapping`의 상위 클래스로, `RequestMappingInfo` 객체를 사용해 세부적인 매핑 조건(HTTP 메서드, 헤더 등)을 처리합니다.
  - 내부적으로 `RequestMappingHandlerMapping`에서 확장되어 사용됩니다.

---

### 8. **`RouterFunctionMapping`**
- **역할**: **함수형 프로그래밍 스타일**로 라우팅을 정의합니다.
- **특징**:
  - `RouterFunction`과 `HandlerFunction`을 사용해 람다 기반 라우팅을 구현합니다.
  - Spring WebFlux 또는 반응형 프로그래밍에서 주로 사용됩니다.
- **예시**:

  ```java
  @Bean
  public RouterFunction<ServerResponse> route() {
      return RouterFunctions.route()
          .GET("/api/users", request -> ServerResponse.ok().body(...))
          .build();
  }
  ```

---

### 9. **`WebSocketHandlerMapping`**
- **역할**: **WebSocket 요청 처리**를 위한 매핑.
- **특징**:
  - WebSocket 엔드포인트(`/websocket`)와 `WebSocketHandler`를 연결합니다.
  - `@EnableWebSocket`과 함께 사용됩니다.
- **예시**:

  ```java
  @Configuration
  @EnableWebSocket
  public class WebSocketConfig implements WebSocketConfigurer {
      @Override
      public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
          registry.addHandler(myHandler(), "/websocket");
      }
  }
  ```

---

### 10. **`AbstractHandlerMethodMapping`**
- **역할**: **메서드 단위 매핑**을 위한 추상 클래스.
- **특징**:
  - `@RequestMapping`과 같은 애노테이션을 메서드 단위로 분석합니다.
  - `RequestMappingHandlerMapping`의 상위 클래스로, 메서드-URL 매핑 정보를 관리합니다.

---

### 📌 **요약**
| 클래스명                         | 주요 역할                                                                 |
|----------------------------------|--------------------------------------------------------------------------|
| `AbstractHandlerMapping`         | 모든 `HandlerMapping`의 기본 기능(인터셉터 처리 등) 제공                  |
| `AbstractUrlHandlerMapping`      | URL 기반 매핑의 추상화                                                  |
| `BeanNameUrlHandlerMapping`      | 빈 이름을 URL로 매핑                                                    |
| `SimpleUrlHandlerMapping`        | 정적 URL과 핸들러를 직접 연결                                            |
| `RequestMappingHandlerMapping`   | 애노테이션 기반 컨트롤러 매핑                                           |
| `RouterFunctionMapping`          | 함수형 라우팅(`RouterFunction`) 지원                                     |
| `WebSocketHandlerMapping`        | WebSocket 엔드포인트 매핑                                                |

---

### 💡 **핵심 포인트**
- **현대적인 스프링 앱**에서는 **`RequestMappingHandlerMapping`** 과 **`RouterFunctionMapping`** 이 주로 사용됩니다.
- **레거시 시스템**에서는 `BeanNameUrlHandlerMapping` 또는 `SimpleUrlHandlerMapping`을 볼 수 있습니다.
- **WebSocket**이나 **특수 프로토콜**은 `WebSocketHandlerMapping`으로 처리합니다.