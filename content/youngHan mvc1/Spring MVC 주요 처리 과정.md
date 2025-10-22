---
title: Spring MVC 주요 처리 과정
aliases: 
tags:
  - spring
  - young_han
created: 2025-03-09T18:39:00+09:00
modified: 2025-06-27T19:54:41+09:00

---

### 메인 흐름
1. 사용자 요청
2. DispatcherServle doDispatch() 호출
3. 등록되어 있는 핸들러(컨트롤러) 조회 : 매핑정보에서 맞는 핸들러를 가져온다
4. 핸들러를 처리할 수 있는 어댑터 조회
5. 핸들러 어댑터를 통해 핸들러(컨트롤러)를 실행
6. (어뎁터를 통해 무조건) ModelAndView 를 반환받는다
7. ModelAndView를 processDispatchResult함수를 통해 넘겨준다
8. 뷰리졸버를 통해 적절한 뷰를 찾아서 뷰를 반환받는다
9. 뷰를 통해 렌더링한다






---


### 2번 처리
(DispatcherServle doDispatch() 이 호출되기 까지 설명)
1. DispatcherServlet 서블릿 등록
	1. DispatcherServlet 도 부모 클래스에서 HttpServlet 을 상속 받아서 사용하고, 서블릿으로 동작한다. 
	   DispatcherServlet -> FrameworkServlet -> HttpServletBean -> HttpServlet
	2. 스프링 부트는 DispatcherServlet 을 서블릿으로 자동으로 등록하면서 모든 경로( urlPatterns="/" )에 대해서 매핑한다. 
	   참고: 더 자세한 경로가 우선순위가 높다. 그래서 기존에 등록한 서블릿도 함께 동작한다
2. 요청 흐름
	1. 서블릿이 호출되면 HttpServlet 이 제공하는 serivce() 가 호출된다.
	2. 스프링 MVC는 DispatcherServlet 의 부모인 FrameworkServlet 에서 service() 를 오버라이드 해 두었다.
	3. FrameworkServlet.service() 를 시작으로 여러 메서드가 호출되면서 DispatcherServlet.doDispatch() 가 호출된다.


### 3번 처리
스프링이 적절한 컨트롤러를 가져오는 과정을 하기 위해서 (파일이든 xml 이든) 미리 가져와서 매핑처리를 하는 친구가 필요하다
HandlerMapping 

```
0 = RequestMappingHandlerMapping : 애노테이션 기반의 컨트롤러인
	@RequestMapping에서 사용
1 = BeanNameUrlHandlerMapping : 스프링 빈의 이름으로 핸들러를 찾는다.
```

[spring RequestMapping 구현체](../02.inbox/spring%20RequestMapping%20구현체.md)
어노테이션 기반의 컨트롤러를 명시하기 위해서는 `@Controller` 또는 `@RestController` 가 필요하다

### 4번 처리
HandlerAdapter

```
0 = RequestMappingHandlerAdapter : 애노테이션 기반의 컨트롤러인 @RequestMapping에서 사용
1 = HttpRequestHandlerAdapter : HttpRequestHandler 처리
2 = SimpleControllerHandlerAdapter : Controller 인터페이스
	(애노테이션X, 과거에 사용) 처리
```

[spring HandlerAdapter 구현체](../02.inbox/spring%20HandlerAdapter%20구현체.md)

### 5번 처리
**ModelAndView** 는 Spring MVC에서 **컨트롤러가 처리 결과를 뷰에 전달하는 데 사용되는 핵심 클래스** 입니다.  
Model(데이터)과 View(화면) 이름을 함께 저장하고, `DispatcherServlet`이 이를 해석해 최종 응답을 생성합니다.
ModelAndView 역할
- **Model** :  
    뷰에 전달할 데이터를 **키-값 쌍(Map)** 으로 저장합니다.  
    (예: `model.put("users", userList)` → 뷰에서 `${users}`로 접근)
- **View** :  
    뷰 이름(문자열) 또는 `View` 객체를 저장합니다.
    - **뷰 이름** : `ViewResolver`가 실제 뷰 객체(예: JSP, Thymeleaf 템플릿)로 변환합니다.
    - **View 객체** : 직접 생성한 `View` 구현체(예: JSON 뷰)를 사용합니다

### 8번 처리
[spring ViewResolver 구현체](../02.inbox/spring%20ViewResolver%20구현체.md)

### 9번 처리
[spring View 구현체](../02.inbox/spring%20View%20구현체.md)

### 추가 
