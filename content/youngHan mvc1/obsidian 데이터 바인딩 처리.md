---
title: obsidian 데이터 바인딩 처리
date: 2025-03-31T20:09:00+09:00
lastmod: 2025-03-31T20:09:00+09:00
resource-path: youngHan mvc1/obsidian 데이터 바인딩 처리.md
aliases: 
tags:
  - spring
---
Spring MVC의 데이터 바인딩과 관련된 주요 처리 과정을 순서대로 정리해드리겠습니다:

1. 요청 수신
- DispatcherServlet이 HTTP 요청을 받음

2. 컨트롤러 매핑
- 요청 URL에 매핑된 적절한 컨트롤러 메서드를 찾음

3. 파라미터 바인딩 단계
- @ModelAttribute 객체 생성
- 요청 파라미터를 객체의 프로퍼티에 매핑 시도
  - 타입 변환 시도
  - 변환 성공: 해당 필드에 값 설정
  - 변환 실패: BindingResult에 에러 정보 저장 (bindingFailure = true)

4. 검증 단계 (@Valid 또는 @Validated 사용 시)
- Validator 실행 
- 검증 규칙 위반 시 BindingResult에 에러 정보 저장 (bindingFailure = false)

5. 컨트롤러 메서드 실행
- 바인딩(및 검증)이 완료된 @ModelAttribute 객체를 메서드 파라미터로 전달
- BindingResult는 해당 객체의 바로 다음 파라미터로 전달

6. 뷰 렌더링
- BindingResult의 내용을 활용하여 오류 메시지 표시
- rejectedValue 등을 사용하여 사용자 입력값 유지

중요한 점:
- 각 @ModelAttribute마다 별도의 BindingResult가 필요
- 바인딩 실패와 검증 실패는 구분되어 처리됨
- 바인딩은 컨트롤러 메서드 실행 전에 완료됨

이러한 순서로 Spring MVC는 요청 파라미터를 처리하고 컨트롤러에 전달합니다.