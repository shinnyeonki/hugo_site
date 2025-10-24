---
title: forward vs redirect
date: 2025-03-05T13:38:00+09:00
lastmod: 2025-06-27T19:53:53+09:00
resource-path: youngHan mvc1/forward vs redirect.md
aliases: 
tags: 
---
### 1. **Forward 동작 원리**
- **서버 내부에서만 처리**:  
  `forward()`는 클라이언트(브라우저)의 요청을 수신한 서블릿이 **동일한 웹 컨테이너 내부**에서 다른 자원(예: JSP, 다른 서블릿)으로 제어를 넘기는 동작입니다.  
  - **HTTP 요청/응답 재사용**: 원본 `ServletRequest`와 `ServletResponse` 객체를 그대로 전달하므로, 클라이언트는 이 과정을 인지하지 못합니다.
  - **URL 변경 없음**: 브라우저 주소창의 URL은 최초 요청 경로 그대로 유지됩니다. (예: `/original-servlet` → `/WEB-INF/views/new-form.jsp`로 전달되어도 URL 변경 없음)

---

### 2. **HTTP 호출과의 차이**
- **Redirect(리다이렉트)**:  
  클라이언트에게 `302` 상태 코드와 새 URL을 응답으로 전송 → 클라이언트가 **새로운 HTTP 요청**을 발생시킵니다.  
  - URL 변경됨, 네트워크 비용 증가, 요청 데이터 유실 가능성 있음.

- **Forward(포워드)**:  
  서버 내부에서 **단일 HTTP 요청 생명주기** 내에서 처리됩니다.  
  - 네트워크 오버헤드 없음, 요청/세션 데이터 보존, 클라이언트 투명성 보장.

---

### 3. **기술적 특징**
- **RequestDispatcher의 역할**:  

  ```java
  RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
  dispatcher.forward(request, response);
  ```

  - `RequestDispatcher`는 Servlet API의 일부로, **서버 내부 자원 접근**을 추상화한 인터페이스입니다.
  - `forward()`는 **동기식 제어 전달**을 수행하며, 스레드는 동일한 요청 컨텍스트를 공유합니다.

- **보호된 자원 접근**:  
  `WEB-INF` 디렉토리 아래의 JSP는 클라이언트 직접 접근이 불가능합니다.  
  → 서버 내부에서만 `forward()`로 접근 가능 (보안 강화).

---

### 4. **사용 사례**
- **MVC 패턴 구현**:  
  컨트롤러(서블릿)에서 비즈니스 로직 처리 후 뷰(JSP)로 포워딩하여 화면 렌더링.
- **에러 페이지 처리**:  
  `web.xml` 또는 `@WebServlet`에서 에러 코드/예외 매핑 후 포워딩.
- **다중 자원 조합**:  
  하나의 요청에 여러 자원(예: 헤더, 본문, 푸터 JSP)을 조합하여 응답 생성.

---

### 5. **주의 사항**
- **응답 커밋 전에만 가능**:  
  `response` 객체가 이미 클라이언트로 전송된 후(`flush()` 호출 후)에는 `forward()` 사용 불가 (예: `IllegalStateException` 발생).
- **속성 전달**:  
  `request.setAttribute()`로 데이터를 전달해야 하며, `request.getParameter()`는 원본 요청 데이터를 유지합니다.

---

### 요약
`forward()`는 **서버 내부 파이프라인 재구성**으로, 클라이언트는 최초 요청에 대한 응답만 받는 것으로 인지합니다. 이는 HTTP 프로토콜의 요청-응답 사이클을 최소화하며, 보안 및 성능 최적화에 활용됩니다.