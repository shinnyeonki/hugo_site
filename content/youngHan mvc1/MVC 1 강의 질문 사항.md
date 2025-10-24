---
title: MVC 1 강의 질문 사항
date: 2025-02-28T11:57:00+09:00
lastmod: 2025-02-28T11:57:00+09:00
resource-path: youngHan mvc1/MVC 1 강의 질문 사항.md
aliases: 
tags: 
---
### 





### **HTTP 응답 코드 (Status Code)**

- **목적** : 클라이언트에게 요청 처리 결과를 수치화해 전달합니다.
- **구조** : 3자리 숫자로 분류되며, 첫 번째 숫자는 응답 클래스를 나타냅니다.
    - **1xx (정보 제공)** : `100 Continue` (요청 진행 중).
    - **2xx (성공)** : `200 OK` (성공), `201 Created` (리소스 생성됨).
    - **3xx (리다이렉션)** : `301 Moved Permanently` (영구 이동), `302 Found` (임시 이동).
    - **4xx (클라이언트 오류)** : `400 Bad Request` (잘못된 요청), `404 Not Found`.
    - **5xx (서버 오류)** : `500 Internal Server Error`, `503 Service Unavailable`.




- `@GetMapping` 의 메소드 단위 매핑의 원리가 궁금하다 강의 질문답에서는 리플렉션이라고 답하고 있다
- 어노테이션의 동작 원리
- 라이브러리 설정시에 표기되는 여러가지
	- annotation processor
	- compile processer
	- compile class path
	- production runtime classpath 
	- runtime classpath
	- test compile classpath
	- test runtime classpath
- PathVariable(경로 변수) ex) mapping/{userId} 로 요청을 하는 것과 parameter 로 전달하는 것
- jsp 는 jar 파일로 패키징 하는 것이 권장되지 않는 이유
- 