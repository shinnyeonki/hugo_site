---
title: spring HandlerAdapter 구현체
date: 2025-03-10T00:14:00+09:00
lastmod: 2025-03-10T00:14:00+09:00
resource-path: 02.inbox/spring HandlerAdapter 구현체.md
aliases: 
tags:
  - spring
  - reference
---
스프링 MVC의 **`HandlerAdapter`**는 다양한 유형의 핸들러(컨트롤러)를 실행하는 인터페이스입니다.  
각 `HandlerAdapter` 구현체는 특정 유형의 핸들러를 지원합니다.  
아래에서 언급된 6가지 구현체를 체계적으로 설명합니다:

---

### 1. **`AbstractHandlerMethodAdapter`**
- **역할**: **메서드 기반 핸들러 어댑터의 추상 클래스**.
- **특징**:
  - `HandlerMethod`를 처리하는 어댑터의 기본 기능을 제공합니다.
  - `RequestMappingHandlerAdapter`의 상위 클래스로, 메서드 단위 처리 로직을 공통화합니다.
- **사용 예시**:  
  구체적인 구현체(`RequestMappingHandlerAdapter`)에서 확장되어 사용됩니다.

---

### 2. **`HandlerFunctionAdapter`**
- **역할**: **함수형 프로그래밍 스타일 핸들러**(`HandlerFunction`)를 지원합니다.
- **특징**:
  - `RouterFunction`과 함께 사용되며, 람다 표현식으로 핸들러를 정의합니다.
  - Spring 5+에서 도입된 **함수형 엔드포인트**를 처리합니다.
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

### 3. **`HttpRequestHandlerAdapter`**
- **역할**: **`HttpRequestHandler` 인터페이스 구현체**를 처리합니다.
- **특징**:
  - 서블릿 API(`HttpServletRequest`, `HttpServletResponse`)를 직접 사용하는 레거시 코드와 호환됩니다.
  - `@Controller` 애노테이션 없이도 핸들러를 등록할 수 있습니다.
- **예시**:
  ```java
  public class LegacyHandler implements HttpRequestHandler {
      @Override
      public void handleRequest(HttpServletRequest request, HttpServletResponse response) {
          // 직접 응답을 생성합니다.
      }
  }
  ```

---

### 4. **`RequestMappingHandlerAdapter`**
- **역할**: **애노테이션 기반 컨트롤러**(`@RequestMapping`, `@RestController`)를 처리합니다.
- **특징**:
  - `@GetMapping`, `@PostMapping`, `@PathVariable`, `@RequestBody` 등을 지원합니다.
  - 현대적인 스프링 애플리케이션에서 **가장 많이 사용되는 어댑터**입니다.
- **예시**:
  ```java
  @RestController
  public class UserController {
      @GetMapping("/users")
      public List<User> getUsers() {
          return userService.findAll();
      }
  }
  ```

---

### 5. **`SimpleControllerHandlerAdapter`**
- **역할**: **`Controller` 인터페이스 구현체**를 처리합니다.
- **특징**:
  - 과거에 사용되던 방식으로, `Controller` 인터페이스의 `handleRequest()` 메서드를 호출합니다.
  - `@Controller` 애노테이션 없이 빈으로 등록해야 합니다.
- **예시**:
  ```java
  public class OldController implements Controller {
      @Override
      public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) {
          return new ModelAndView("viewName");
      }
  }
  ```

---

### 6. **`SimpleServletHandlerAdapter`**
- **역할**: **일반 서블릿**(`javax.servlet.Servlet`)을 핸들러로 사용합니다.
- **특징**:
  - 기존 서블릿을 스프링 MVC에서 재사용할 수 있도록 합니다.
  - 서블릿의 `service()` 메서드를 직접 호출합니다.
- **예시**:
  ```java
  @WebServlet("/legacy")
  public class LegacyServlet extends HttpServlet {
      @Override
      protected void doGet(HttpServletRequest req, HttpServletResponse res) {
          res.getWriter().write("Legacy Servlet Response");
      }
  }
  ```

---

### 📌 **요약**
| 어댑터명                          | 처리 대상                          | 주요 사용 사례                          |
|-----------------------------------|-----------------------------------|----------------------------------------|
| `HandlerFunctionAdapter`          | `HandlerFunction`                 | 함수형 라우팅(람다 기반)               |
| `HttpRequestHandlerAdapter`       | `HttpRequestHandler`              | 서블릿 API 기반 레거시 코드            |
| `RequestMappingHandlerAdapter`    | `@RequestMapping` 기반 컨트롤러   | 현대적인 REST API 개발                 |
| `SimpleControllerHandlerAdapter`  | `Controller` 인터페이스           | 과거 버전 호환용 컨트롤러              |
| `SimpleServletHandlerAdapter`     | 일반 서블릿                       | 기존 서블릿 통합                       |

---

### 💡 **핵심 포인트**
- **현대적인 개발**에서는 **`RequestMappingHandlerAdapter`** 가 주력으로 사용됩니다.
- **함수형 프로그래밍**은 **`HandlerFunctionAdapter`** 로 처리합니다.
- **레거시 코드** 통합 시 `HttpRequestHandlerAdapter` 또는 `SimpleServletHandlerAdapter`를 사용합니다.
- `SimpleControllerHandlerAdapter`는 거의 사용되지 않으며, `@Controller` 애노테이션으로 대체되었습니다.