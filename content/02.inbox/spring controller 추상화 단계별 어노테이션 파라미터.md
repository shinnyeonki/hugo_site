---
title: spring controller 추상화 단계별 어노테이션 파라미터
aliases:
tags:
  - spring
created: 2025-07-09T07:40:09+09:00
modified: 2025-07-12T13:15:36+09:00

---
### 추상화 단계별 설명

1.  **Level 1: Servlet API 직접 사용 (가장 낮은 추상화 단계)**
    *   Spring이 있기 전, Java 웹 개발의 근간인 Servlet API를 직접 사용하는 방식입니다.
    *   Spring Controller에서도 이 객체들을 직접 파라미터로 받아 모든 것을 수동으로 제어할 수 있습니다.

2.  **Level 2: 기본 매핑과 요청 데이터 추출**
    *   Servlet API를 직접 다루는 불편함을 줄이고, 특정 URL 요청을 특정 메서드에 연결(매핑)하고 요청 데이터를 쉽게 추출하는 단계입니다.

3.  **Level 3: 데이터 바인딩 및 응답 데이터 처리**
    *   요청 파라미터들을 객체(DTO)에 자동으로 담아주거나, 응답할 데이터를 모델에 담아 View로 전달하는 등 데이터 처리를 자동화하는 단계입니다.

4.  **Level 4: REST API를 위한 추상화**
    *   전통적인 HTML View 반환이 아닌, JSON/XML 같은 데이터 자체를 응답하는 RESTful API 개발에 특화된 고수준 추상화 단계입니다.

5.  **Level 5: 편의성을 위한 조합 및 축약 (가장 높은 추상화 단계)**
    *   여러 어노테이션의 기능을 하나로 합치거나, 코드를 더 간결하게 만들어주는 '문법적 설탕(Syntactic Sugar)' 단계입니다.

---

## 상세 설명 (낮은 추상화 -> 높은 추상화 순)

### Level 1: Servlet API 직접 사용 (Lowest Abstraction)

이 단계에서는 Spring의 도움을 최소한으로 받고, Java Servlet의 핵심 객체를 직접 다룹니다.

| 파라미터                | 문법 예시                                                               | 설명                                                                                                                                                                   |
| ----------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HttpServletRequest`    | `public void method(HttpServletRequest request)`                        | HTTP 요청 정보를 모두 담고 있는 객체입니다. 헤더, 파라미터, 쿠키, 세션, Body 등 모든 요청 데이터에 직접 접근할 수 있습니다. (`request.getParameter("name")`처럼 사용)       |
| `HttpServletResponse`   | `public void method(HttpServletResponse response)`                      | HTTP 응답을 제어하는 객체입니다. 응답 상태 코드(Status Code), 헤더, 쿠키를 설정하거나 응답 Body에 직접 데이터를 쓸 수 있습니다. (`response.getWriter().write("hello")`처럼 사용) |
| `HttpSession`           | `public void method(HttpSession session)`                               | 세션 객체를 직접 다룰 때 사용합니다. 세션에 데이터를 저장(`session.setAttribute(...)`)하거나 조회(`session.getAttribute(...)`)할 수 있습니다.                        |

---

### Level 2: 기본 매핑과 요청 데이터 추출

URL과 메서드를 연결하고, URL의 특정 부분을 파라미터로 쉽게 가져옵니다.

| 어노테이션/파라미터 | 문법 예시                                                                                 | 설명                                                                                                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@Controller`       | `@Controller public class MyController { ... }`                                           | 클래스 레벨에 붙이며, 해당 클래스가 Spring MVC의 컨트롤러임을 나타냅니다. Spring이 이 클래스를 스캔하여 웹 요청을 처리하는 핸들러로 사용합니다.                                            |
| `@RequestMapping`   | `@RequestMapping("/hello")` or `@RequestMapping(value="/hello", method=RequestMethod.GET)` | 특정 URL 경로와 HTTP 메서드를 처리할 메서드에 연결(매핑)합니다. 클래스와 메서드 레벨 모두에 사용할 수 있습니다. HTTP 메서드를 명시하지 않으면 모든 메서드(GET, POST 등)를 허용합니다. |
| `@RequestParam`     | `public void method(@RequestParam("name") String name)`                                   | URL의 쿼리 파라미터(`?name=John`)나 form-data 값을 메서드 파라미터에 바인딩합니다. `required` (기본값 true), `defaultValue` 속성을 통해 필수 여부나 기본값을 지정할 수 있습니다.      |
| `@PathVariable`     | `@RequestMapping("/users/{userId}") public void method(@PathVariable("userId") Long id)` | URL 경로의 일부를 변수로 사용할 때 씁니다. (`/users/123` 에서 `123`을 `id` 변수에 바인딩). RESTful API에서 리소스를 식별할 때 주로 사용됩니다.                                     |

---

### Level 3: 데이터 바인딩 및 응답 데이터 처리

요청 데이터를 객체에 자동으로 담거나, View에 전달할 데이터를 편리하게 관리합니다.

| 어노테이션/파라미터 | 문법 예시                                                              | 설명                                                                                                                                                                                                                                                                       |
| ------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@ModelAttribute`   | `public String method(@ModelAttribute UserDto userDto)`                | 여러 요청 파라미터를 객체(DTO, VO)의 필드에 자동으로 바인딩합니다. 예를 들어 `?name=John&age=30` 요청이 오면, `name`과 `age` 필드를 가진 `UserDto` 객체를 생성하고 값을 채워줍니다. 또한, 이 어노테이션이 붙은 객체는 자동으로 Model에 추가되어 View에서 사용할 수 있습니다. |
| `Model` / `Map`     | `public String method(Model model)`                                    | View에 전달할 데이터를 담는 컨테이너 역할을 합니다. 메서드 파라미터로 선언하면 Spring이 자동으로 객체를 주입해줍니다. `model.addAttribute("key", value)` 형태로 데이터를 추가하면 View(JSP, Thymeleaf 등)에서 해당 데이터를 사용할 수 있습니다. `Map`도 동일하게 동작합니다.        |
| `ModelAndView`      | `public ModelAndView method() { return new ModelAndView("viewName"); }` | **Model**과 **View**를 하나로 합친 객체입니다. 처리 결과를 보여줄 View의 이름과 View에 전달할 데이터를 함께 담아 반환할 수 있습니다. 최근에는 `Model` 파라미터와 `String` (View 이름) 반환을 더 선호하는 추세입니다.                                                       |

---

### Level 4: REST API를 위한 추상화

JSON/XML과 같은 메시지 기반 통신을 위한 핵심적인 추상화입니다.

| 어노테이션/파라미터 | 문법 예시                                                                 | 설명                                                                                                                                                                                                                                                              |
| ------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@RequestBody`      | `public void method(@RequestBody UserDto userDto)`                        | 요청의 Body에 담겨 오는 데이터(주로 JSON, XML)를 Java 객체로 변환(역직렬화, Deserialization)해줍니다. 내부적으로 `HttpMessageConverter`(주로 Jackson)가 동작하여 이 변환 과정을 자동으로 처리합니다. 클라이언트가 JSON 데이터를 보내면, 해당 JSON 구조와 일치하는 DTO 객체에 값을 채워줍니다. |
| `@ResponseBody`     | `@ResponseBody public UserDto method() { ... }`                           | 메서드가 반환하는 Java 객체를 HTTP 응답 Body에 직접 써넣도록 지시합니다. View를 찾는 것이 아니라, 반환된 객체를 JSON이나 XML 등의 데이터 형식으로 변환(직렬화, Serialization)하여 클라이언트에 전송합니다. REST API의 응답을 만들 때 필수적입니다.                                  |
| `ResponseEntity<T>` | `public ResponseEntity<UserDto> method() { ... }`                         | `@ResponseBody`의 확장판으로, 응답 데이터(Body)뿐만 아니라 HTTP 상태 코드(Status Code)와 헤더(Header)까지 세밀하게 제어하여 반환하고 싶을 때 사용합니다. `ResponseEntity.ok(body)`, `ResponseEntity.created(uri).build()` 와 같이 유연한 응답 구성이 가능합니다.      |

---

### Level 5: 편의성을 위한 조합 및 축약 (Highest Abstraction)

자주 사용되는 패턴을 하나의 어노테이션으로 묶어 코드의 가독성과 생산성을 높입니다.

| 어노테이션/파라미터        | 문법 예시                                                  | 설명                                                                                                                                                                                        |
| ----------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@RestController` | `@RestController public class MyApiController { ... }` | **`@Controller` + `@ResponseBody`** 의 조합입니다. 이 어노테이션을 클래스에 붙이면, 해당 컨트롤러의 모든 메서드에는 기본적으로 `@ResponseBody`가 적용됩니다. 따라서 모든 메서드가 View를 반환하는 대신 데이터(JSON 등)를 반환하게 되므로, REST API를 만들 때 매우 편리합니다. |
| `@GetMapping`     | `@GetMapping("/users/{id}")`                           | **`@RequestMapping(method = RequestMethod.GET)`** 의 축약형입니다. HTTP GET 요청을 처리하는 핸들러를 간결하게 매핑할 수 있습니다.                                                                                       |
| `@PostMapping`    | `@PostMapping("/users")`                               | **`@RequestMapping(method = RequestMethod.POST)`** 의 축약형입니다. HTTP POST 요청을 처리합니다.                                                                                                         |
| `@PutMapping`     | `@PutMapping("/users/{id}")`                           | **`@RequestMapping(method = RequestMethod.PUT)`** 의 축약형입니다. HTTP PUT 요청을 처리합니다.                                                                                                           |
| `@DeleteMapping`  | `@DeleteMapping("/users/{id}")`                        | **`@RequestMapping(method = RequestMethod.DELETE)`** 의 축약형입니다. HTTP DELETE 요청을 처리합니다.                                                                                                     |
| `@PatchMapping`   | `@PatchMapping("/users/{id}")`                         | **`@RequestMapping(method = RequestMethod.PATCH)`** 의 축약형입니다. HTTP PATCH 요청을 처리합니다.                                                                                                       |

### 요약: 추상화의 흐름

**Servlet API (`HttpServletRequest`)**
-> "이 URL을 이 메서드에 연결해줘" **(`@RequestMapping`)**
-> "URL 파라미터는 이 변수에 넣어줘" **(`@RequestParam`)**
-> "여러 파라미터를 이 객체에 알아서 채워줘" **(`@ModelAttribute`)**
-> "요청 Body의 JSON을 이 객체로 바꿔줘" **(`@RequestBody`)**
-> "메서드 반환값을 바로 JSON으로 응답해줘" **(`@ResponseBody`)**
-> "이 컨트롤러는 전부 REST API용이니 모든 메서드에 `@ResponseBody`를 붙여줘" **(`@RestController`)**
-> "`@RequestMapping(method=GET)` 대신 `@GetMapping`으로 간단히 쓰자" **(`@GetMapping` 등)**

이처럼 Spring은 개발자가 저수준의 반복적인 작업을 하지 않고, 비즈니스 로직에 집중할 수 있도록 점점 더 편리하고 높은 수준의 추상화를 제공하는 방향으로 발전해왔습니다.

---
---

### 추상화 단계별 설명

Spring 프레임워크는 개발자가 웹 개발의 복잡한 저수준 세부 사항에서 벗어나 비즈니스 로직에 집중할 수 있도록 다양한 수준의 추상화를 제공합니다. 여기서는 가장 낮은 추상화 단계부터 높은 추상화 단계까지, Spring이 어떻게 개발 경험을 간소화하는지 단계별로 살펴보겠습니다.

---

### Level 1: Servlet API 직접 사용 (가장 낮은 추상화 단계)

이 단계는 Spring의 도움을 최소한으로 받고, Java Servlet의 핵심 객체를 직접 다루는 방식입니다. HTTP 요청/응답의 모든 요소를 바닥부터 제어해야 할 때, 또는 기존 Servlet 기반 코드를 Spring으로 마이그레이션할 때 유용합니다.

*   **`HttpServletRequest` (예시: `public void method(HttpServletRequest request)`)**
    HTTP 요청 정보를 모두 담고 있는 객체입니다. 헤더, 파라미터, 쿠키, 세션, Body, 요청 URI, 원격지 IP 등 모든 요청 데이터에 직접 접근할 수 있습니다.
    *   **기본 사용:**
        *   `String name = request.getParameter("name");`
        *   `String userAgent = request.getHeader("User-Agent");`
    *   **추가 예시:**
        *   **동일 이름의 여러 파라미터 받기:** `String[] interests = request.getParameterValues("interest");` (예: `?interest=coding&interest=music` 요청 시)
        *   **모든 헤더 이름 조회:** `Enumeration<String> headerNames = request.getHeaderNames();`
        *   **요청 Body 직접 읽기 (JSON):** `String jsonBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));`

*   **`HttpServletResponse` (예시: `public void method(HttpServletResponse response)`)**
    HTTP 응답을 제어하는 객체입니다. 응답 상태 코드(Status Code), 헤더, 쿠키를 설정하거나 응답 Body에 직접 데이터를 쓸 수 있습니다.
    *   **기본 사용:**
        *   `response.setStatus(HttpServletResponse.SC_CREATED);` (201 상태 코드 설정)
        *   `response.getWriter().write("hello world");`
    *   **추가 예시:**
        *   **커스텀 헤더 추가:** `response.setHeader("X-Custom-Auth", "some-token");`
        *   **파일 다운로드를 위한 헤더 설정:** `response.setContentType("application/octet-stream"); response.setHeader("Content-Disposition", "attachment; filename=\"data.csv\"");`
        *   **에러 응답 보내기:** `response.sendError(400, "Invalid parameter");`

*   **`HttpSession` (예시: `public void method(HttpSession session)`)**
    세션 객체를 직접 다룰 때 사용합니다. 세션에 데이터를 저장(`setAttribute`), 조회(`getAttribute`), 무효화(`invalidate`)할 수 있습니다.
    *   **기본 사용:**
        *   `session.setAttribute("cart", new Cart());`
        *   `Cart cart = (Cart) session.getAttribute("cart");`
        *   `session.invalidate();`
    *   **추가 예시:**
        *   **세션 타임아웃 설정:** `session.setMaxInactiveInterval(1800);` (30분)
        *   **세션 생성 시간 확인:** `long creationTime = session.getCreationTime();`

*   **`java.security.Principal` (예시: `public String getUsername(Principal principal)`)**
    현재 인증된 사용자 정보를 담고 있는 객체입니다. Spring Security와 함께 사용할 경우, `principal.getName()`을 통해 로그인한 사용자의 ID를 얻을 수 있습니다.
    *   **참고:** 최신 Spring Security에서는 `@AuthenticationPrincipal` 어노테이션을 사용하여 더 타입-세이프하게 사용자 객체를 주입받는 것을 권장합니다.

*   **`java.util.Locale` (예시: `public void method(Locale locale)`)**
    요청의 지역 정보를 담고 있는 객체입니다. 클라이언트의 `Accept-Language` 헤더를 기반으로 결정되며, 다국어 처리 시 현재 언어에 맞는 메시지를 보여주는 데 사용됩니다.
    *   **예시:** `locale.getLanguage()`는 "ko", `locale.getCountry()`는 "KR", `locale.toString()`는 "ko_KR" 등을 반환할 수 있습니다.

*   **`InputStream` / `Reader` (예시: `public void method(InputStream input, Reader reader)`)**
    요청 Body의 내용을 직접 스트림으로 읽을 때 사용합니다. 대용량 파일을 처리하거나, Spring의 메시지 컨버터를 거치지 않은 원본 데이터를 읽고 싶을 때 유용합니다.
    *   **예시 (파일 업로드 처리):** `Files.copy(input, new File("uploaded-file.dat").toPath());`

*   **`OutputStream` / `Writer` (예시: `public void method(OutputStream output, Writer writer)`)**
    응답 Body에 직접 스트림으로 데이터를 쓸 때 사용합니다. 대용량 파일을 다운로드시키거나, 특정 형식의 응답을 수동으로 구성할 때 사용됩니다.
    *   **예시 (대용량 CSV 생성):** `try (PrintWriter printWriter = new PrintWriter(writer)) { printWriter.println("id,name"); printWriter.println("1,John"); }`

---

### Level 2: 기본 매핑과 요청 데이터 추출

이 단계에서는 URL과 메서드를 연결하고, URL이나 헤더 등에서 원하는 값을 편리하게 추출할 수 있습니다.

*   **`@Controller` (예시: `@Controller public class MyController { ... }`)**
    클래스 레벨에 붙이며, 해당 클래스가 Spring MVC의 컨트롤러임을 나타냅니다. Spring이 이 클래스를 스캔하여 웹 요청을 처리하는 핸들러로 사용합니다.

*   **`@RequestMapping` (예시: `@RequestMapping(value="/users", method=RequestMethod.POST, consumes="application/json", produces="application/json")`)**
    특정 URL 경로와 HTTP 메서드를 처리할 메서드에 연결(매핑)합니다.
    *   **속성 상세:**
        *   `params`: 특정 파라미터가 있을 때만 매핑 (예: `params="mode=edit"`).
        *   `headers`: 특정 헤더가 있을 때만 매핑 (예: `headers="X-API-VERSION=2"`).
        *   `consumes`: 요청의 `Content-Type`을 제한. (예: `application/json`)
        *   `produces`: 응답의 `Content-Type`을 지정. (예: `application/xml`)
    *   **추가 예시 (클래스/메서드 조합):**

        ```java
        @RequestMapping("/users")
        public class UserController {
            @RequestMapping("/{id}")
            public void getUser() { /* -> /users/{id} */ }
        }
        ```

*   **`@RequestParam` (예시: `public void search(@RequestParam(value="q", required=false, defaultValue="spring") String query)`)**
    URL의 쿼리 파라미터(`?q=...`)나 `x-www-form-urlencoded` 형식의 form-data 값을 메서드 파라미터에 바인딩합니다.
    *   **추가 예시:**
        *   **모든 파라미터 받기:** `public void allParams(@RequestParam Map<String, String> paramMap)`
        *   **여러 값 받기:** `public void listParams(@RequestParam List<String> interest)` (예: `?interest=a&interest=b`)
        *   **Java 8 `Optional` 사용:** `public void optionalParam(@RequestParam Optional<String> query)`

*   **`@PathVariable` (예시: `@RequestMapping("/users/{userId}/orders/{orderId}") public void method(@PathVariable Long userId, @PathVariable Long orderId)`)**
    URL 경로의 일부를 변수로 사용할 때 씁니다. (예: `/users/123/orders/456` 에서 `123`과 `456`을 각각 `userId`, `orderId` 변수에 바인딩).
    *   **추가 예시:**
        *   **변수명 다를 때:** `@PathVariable("userId") Long id`
        *   **정규식으로 제한:** `@GetMapping("/members/{memberId:[0-9]+}") public void getMember(@PathVariable Long memberId)`
        *   **`Map`으로 받기:** `@GetMapping("/{var1}/{var2}") public void pathVars(@PathVariable Map<String, String> pathVarMap)`

*   **`@RequestHeader` (예시: `public void method(@RequestHeader("User-Agent") String userAgent, @RequestHeader(name="Accept-Language", required=false) String lang)`)**
    요청 헤더의 특정 값을 파라미터로 받아옵니다.
    *   **추가 예시:**
        *   **모든 헤더 받기 (Map):** `@RequestHeader Map<String, String> headerMap`
        *   **모든 헤더 받기 (객체):** `@RequestHeader MultiValueMap<String, String> multiValueMap`, `@RequestHeader HttpHeaders headers`

*   **`@CookieValue` (예시: `public void method(@CookieValue(value="JSESSIONID", required=false) String sessionId)`)**
    요청에 포함된 쿠키의 값을 파라미터로 받아옵니다.
    *   **추가 예시:**
        *   **쿠키가 없을 때 예외:** `required=true` (기본값)이고 쿠키가 없으면 `MissingRequestCookieException` 발생.
        *   **기본값 설정:** `@CookieValue(defaultValue = "guest") String visitorId`

---

### Level 3: 데이터 바인딩 및 응답/세션 처리

이 단계에서는 요청 데이터를 객체에 자동으로 담거나, View에 전달할 데이터 및 세션을 편리하게 관리할 수 있습니다.

*   **`@ModelAttribute` (예시 1: `public String saveUser(@ModelAttribute UserDto userDto)`, 예시 2: `@ModelAttribute("categories") public List<Category> getCategories() { ... }`)**
    *   **1. (파라미터에서 사용 시)** 여러 요청 파라미터를 객체(DTO, VO)의 필드에 자동으로 바인딩합니다. (예: `?name=John&age=30` -> `UserDto` 객체). 생략 가능합니다.
    *   **2. (메서드에 사용 시)** 특정 메서드 위에 붙이면, 해당 컨트롤러의 모든 요청 처리 전에 이 메서드가 먼저 실행되고 반환값이 Model에 자동으로 추가됩니다.
    *   **추가 예시 (수정 폼):**

        ```java
        @ModelAttribute("user")
        public User findUser(@PathVariable Long id) {
            return userRepository.findById(id);
        }

        public String updateUser(@ModelAttribute("user") User user) { /* ... */ }
        ```

        (위 예시는 `findUser`로 DB에서 user를 조회해 모델에 넣고, 요청 파라미터로 그 user 객체를 덮어씁니다.)

*   **`Model` / `ModelMap` / `Map` (예시: `public String method(Model model)`)**
    View에 전달할 데이터를 담는 컨테이너 역할을 합니다. `model.addAttribute("key", value)` 형태로 데이터를 추가하면 View(JSP, Thymeleaf 등)에서 해당 키로 데이터를 사용할 수 있습니다. `Model`, `ModelMap`, `Map`은 사실상 동일하게 동작합니다.

*   **`ModelAndView` (예시: `public ModelAndView method() { ModelAndView mav = new ModelAndView("user/profile"); mav.addObject("user", user); return mav; }`)**
    **Model**과 **View**를 하나로 합친 객체입니다. 처리 결과를 보여줄 View의 이름과 View에 전달할 데이터를 함께 담아 반환할 수 있습니다.
    *   **추가 예시 (상태 코드 설정):** `mav.setStatus(HttpStatus.CREATED);`

*   **`@SessionAttributes` (예시: `@Controller @SessionAttributes("user")`)**
    컨트롤러 클래스 레벨에 사용하여, Model에 추가된 특정 이름의 속성을 HTTP 세션에도 저장하도록 지정합니다. 여러 페이지에 걸쳐 특정 객체(ex: 장바구니, 폼 데이터)를 유지해야 할 때 편리합니다.
    *   **`SessionStatus`와 함께 사용:**
        `public String complete(SessionStatus status) { status.setComplete(); return "redirect:/"; }` (세션 데이터 정리)

*   **`@SessionAttribute` (예시: `public void method(@SessionAttribute(name="user", required=false) User loggedInUser)`)**
    HTTP 세션에 저장된 특정 속성을 직접 파라미터로 받아올 때 사용합니다. `@SessionAttributes`와 달리, 세션에 있는 값을 직접 조회하는 용도입니다. 다른 곳(e.g., 필터)에서 세션에 넣은 값을 꺼낼 때 유용합니다.

*   **`RedirectAttributes` (예시: `public String save(RedirectAttributes redirectAttributes) { redirectAttributes.addFlashAttribute("message", "저장되었습니다!"); return "redirect:/users"; }`)**
    리다이렉트 시 데이터를 전달하는 데 특화된 객체입니다.
    *   **`addFlashAttribute`**: 1회성 데이터로, 리다이렉트된 페이지에서만 사용되고 세션에서 즉시 사라집니다. (Post-Redirect-Get 패턴에 유용). URL에 노출되지 않습니다.
    *   **`addAttribute`**: URL 쿼리 파라미터로 추가됩니다. (예: `return "redirect:/users/{id}"` 와 함께 사용 시 `{id}`에 바인딩, 나머지는 쿼리 파라미터)

---

### Level 4: REST API를 위한 추상화

이 단계는 전통적인 HTML View 반환이 아닌, JSON/XML과 같은 데이터 자체를 응답하는 RESTful API 개발에 특화된 고수준 추상화입니다.

*   **`@RequestBody` (예시: `public UserDto createUser(@RequestBody CreateUserRequest request)`)**
    요청의 Body에 담겨 오는 데이터(주로 JSON, XML)를 Java 객체로 변환(역직렬화)합니다. 내부적으로 `HttpMessageConverter`(주로 Jackson 라이브러리)가 동작합니다.
    *   **추가 예시:**
        *   **유효성 검사:** `public void create(@Valid @RequestBody UserDto userDto, BindingResult bindingResult)`
        *   **Raw 데이터 받기:** `public void rawJson(@RequestBody String jsonString)`
        *   **Map으로 받기:** `public void mapBody(@RequestBody Map<String, Object> dataMap)`

*   **`@ResponseBody` (예시: `@ResponseBody @GetMapping("/api/users/1") public UserDto getUser() { ... }`)**
    메서드가 반환하는 Java 객체를 HTTP 응답 Body에 직접 써넣도록 지시합니다. View를 찾는 것이 아니라, 반환된 객체를 JSON이나 XML 등의 데이터 형식으로 변환(직렬화)하여 클라이언트에 전송합니다.

*   **`HttpEntity<T>` (예시: `public String process(HttpEntity<String> httpEntity) { String body = httpEntity.getBody(); HttpHeaders headers = httpEntity.getHeaders(); ... }`)**
    요청의 헤더와 바디를 함께 감싼 객체입니다. `@RequestBody`와 `@RequestHeader`를 합친 것과 유사하며, 요청의 모든 요소를 한 번에 받아 분석할 때 유용합니다. **응답 시에도 사용 가능합니다.**

*   **`ResponseEntity<T>` (예시: `public ResponseEntity<UserDto> getUser(@PathVariable Long id) { UserDto user = userService.findById(id); HttpHeaders headers = new HttpHeaders(); headers.add("X-Custom-Header", "value"); return new ResponseEntity<>(user, headers, HttpStatus.OK); }`)**
    `@ResponseBody`의 확장판으로, 응답 데이터(Body)뿐만 아니라 **HTTP 상태 코드(Status Code)**와 **헤더(Header)**까지 세밀하게 제어하여 반환하고 싶을 때 사용합니다.
    *   **추가 예시 (빌더 패턴):**
        *   **성공:** `return ResponseEntity.ok(user);`
        *   **생성됨:** `URI location = ...; return ResponseEntity.created(location).build();`
        *   **콘텐츠 없음:** `return ResponseEntity.noContent().build();`
        *   **요청 오류:** `return ResponseEntity.badRequest().body("Error message");`

*   **`@ResponseStatus` (예시: `@ResponseStatus(HttpStatus.CREATED) @PostMapping("/users") public void createUser(...)`)**
    성공적인 응답의 HTTP 상태 코드를 지정하는 어노테이션입니다. `void`를 반환하거나 데이터만 반환하면서도 상태 코드를 200 OK가 아닌 201 Created, 204 No Content 등으로 설정하고 싶을 때 간편하게 사용합니다.
    *   **추가 예시 (예외 클래스에 적용):**

        ```java
        @ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "User not found")
        public class UserNotFoundException extends RuntimeException {}
        ```

---

### Level 5: 편의성을 위한 조합 및 축약 (가장 높은 추상화 단계)

이 단계에서는 자주 사용되는 패턴을 하나의 어노테이션으로 묶어 코드의 가독성과 생산성을 높입니다. '문법적 설탕(Syntactic Sugar)'의 대표적인 예시들입니다.

*   **`@RestController` (예시: `@RestController @RequestMapping("/api/users") public class UserApiController { ... }`)**
    **`@Controller` + `@ResponseBody`** 의 조합입니다. 이 어노테이션을 클래스에 붙이면, 해당 컨트롤러의 모든 메서드에는 기본적으로 `@ResponseBody`가 적용됩니다. 따라서 모든 메서드가 View를 반환하는 대신 데이터(JSON 등)를 반환하게 되므로, REST API를 만들 때 매우 편리합니다.

*   **`@GetMapping` (예시: `@GetMapping("/{id}")`)**
    **`@RequestMapping(method = RequestMethod.GET)`** 의 축약형입니다.

*   **`@PostMapping` (예시: `@PostMapping`)**
    **`@RequestMapping(method = RequestMethod.POST)`** 의 축약형입니다.

*   **`@PutMapping` (예시: `@PutMapping("/{id}")`)**
    **`@RequestMapping(method = RequestMethod.PUT)`** 의 축약형입니다.

*   **`@DeleteMapping` (예시: `@DeleteMapping("/{id}")`)**
    **`@RequestMapping(method = RequestMethod.DELETE)`** 의 축약형입니다.

*   **`@PatchMapping` (예시: `@PatchMapping("/{id}")`)**
    **`@RequestMapping(method = RequestMethod.PATCH)`** 의 축약형입니다.

*   **`@ControllerAdvice` / `@RestControllerAdvice` (예시: `@RestControllerAdvice public class GlobalExceptionHandler { @ExceptionHandler(IllegalArgumentException.class) @ResponseStatus(HttpStatus.BAD_REQUEST) public ErrorResponse handleIllegalArgument(Exception e) { ... } }`)**
    **전역 설정**을 위한 고수준 추상화입니다.
    *   **`@ExceptionHandler`**: 여러 컨트롤러에서 발생하는 특정 예외를 한 곳에서 공통으로 처리합니다.
    *   **`@ModelAttribute`**: 모든 컨트롤러에 공통으로 필요한 모델 데이터를 추가합니다.
    *   **`@InitBinder`**: 모든 컨트롤러에 적용될 데이터 바인딩 설정을 합니다.
    *   `@RestControllerAdvice`는 `@ControllerAdvice`와 `@ResponseBody`를 합친 것으로, 예외 처리 결과 자체를 JSON 같은 데이터로 응답할 때 사용합니다.

---

### 요약: 추상화의 흐름

Spring은 개발자가 저수준의 반복적인 작업을 하지 않고, 비즈니스 로직에 집중할 수 있도록 점점 더 편리하고 높은 수준의 추상화를 제공하는 방향으로 발전해왔습니다.

*   **Servlet API (HttpServletRequest)**

    > "HTTP 요청의 모든 것을 내가 직접 다룰게."

*   **→ `@RequestMapping`**

    > "이 URL을 이 메서드에 연결하는 건 Spring에게 맡길게."

*   **→ `@RequestParam`, `@RequestHeader`, `@CookieValue`**

    > "요청에서 값 꺼내는 귀찮은 일도 Spring이 알아서 해줘."

*   **→ `@ModelAttribute`**

    > "파라미터가 많아도 괜찮아. 객체로 한 번에 받을 수 있어."

*   **→ `@RequestBody`**

    > "요청 Body의 JSON을 이 객체로 바꾸는 건 이제 신경 안 쓸래."

*   **→ `@ResponseBody`**

    > "메서드 반환값을 바로 JSON으로 응답해줘. Java 객체를 다시 JSON으로 바꾸는 것도 Spring이 알아서 해줘."

*   **→ `@RestController`**

    > "매번 `@ResponseBody` 붙이기 귀찮으니 이 컨트롤러는 전부 REST API용으로 `@RestController`만 선언할게."

*   **→ `@GetMapping` 등 HTTP 메서드별 축약 어노테이션**

    > "코드를 더 짧고 명확하게 만들자."

*   **→ `@RestControllerAdvice`**

    > "모든 컨트롤러에서 발생하는 예외는 여기서 한 번에 처리하자. 중복되는 예외 처리 코드는 한 곳에 모아서 관리할래."

각 단계의 특징을 이해하면 상황에 맞는 최적의 도구를 선택하여 효율적으로 개발할 수 있습니다.