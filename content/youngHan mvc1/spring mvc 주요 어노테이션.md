---
title: spring mvc 주요 어노테이션
resource-path: youngHan mvc1/spring mvc 주요 어노테이션.md
aliases:
tags:
  - young_han
  - spring
date: 2025-03-11T12:57:00+09:00
lastmod: 2025-06-27T19:54:53+09:00
---
- 클래스 단위
	- @Controller : 이 클래스가 컨트롤러임을 명시
	- @RequestMapping : 메소드 단위의 RequestMapping 의 공통 url 을 명시
	- @RestContoller : @ResponseBody + @Controller 이 클래스가 반환이 view 가아닌 바디에 직접 컨트롤 즉 Rest 속성을 지닌 컨트롤러임을 명시
- 메소드 단위
	- @RequestMapping : 리플렉션을 사용해서 url 등록 각 메서드 마다 GetMapping 등이 있다
	- 메소드 인자 단위
		- @RequestParam : request parameter 의 값을 가져올 수 있다
		- @ModelAttribute : 모델을 생성하고 parameter 값을 넣어주는 행위를 자동화
		- @RequestHeader : 헤더의 정보를 조회
		- @CookieValue : 쿠키 value 를 조회
		- @ResponseBody : `ResponseEntity<?>` 에 자동으로 넣어준다 `ResponseEntity<?>`는 HTTP 컨버터를 작동할 수 있는 객체
	- 

> @ModelAttribute 는 생략할 수 있다.
> 그런데 @RequestParam 도 생략할 수 있으니 혼란이 발생할 수 있다.
> 스프링은 해당 생략시 다음과 같은 규칙을 적용한다.
> String , int , Integer 같은 단순 타입 = @RequestParam
> 나머지 = @ModelAttribute (argument resolver 로 지정해둔 타입 외)

#### 기본 템플릿엔진
1. JSP (JavaServer Pages)**
2. Thymeleaf
3. FreeMarker
4. Velocity
#### 데이터 포멧 뷰

1. JSON/XML
2. RSS/Atom : `RssView` 또는 `AtomView`를 사용해 피드 생성.
#### 문서 생성 뷰

1. PDF : `AbstractPdfView`를 상속받아 PDF 문서 생성, `iText` 라이브러리 사용.
2. execl : `AbstractExcelView` 또는 `AbstractJExcelView`를 상속, Apache POI 또는 JExcelAPI 사용
#### 기타
1. redirect : `redirect:` 접두어를 사용해 다른 URL로 리다이렉트, `RedirectView` 클래스로 명시적 리다이렉트 처리.