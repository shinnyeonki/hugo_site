---
title: hugo template 시스템 경우의 수로 비교한 자세한 설명
resource-path: hugo template 시스템 경우의 수로 비교한 자세한 설명.md
aliases:
tags:
  - hugo
series: hugo
series_weight: 2
date: 2025-10-27T15:27:43+09:00
lastmod: 2025-10-27T16:31:07+09:00
---
### 전제

hugo 는 기본적으로 md 파일을 html 로 렌더링(컴파일) 하여 정적인 사이트를 만들수 있는 도구이다 이중 template 관련 개념이 복잡하여 이를 제대로 정리한다  
md->html 변환 과정중 적절한 template 를 선택하여 적절한 html 로 만들때 사용하는 것이 template 이다
  
[hugo 기본 전제](hugo%20기본%20전제.md) 를 먼저 보고 오자

### 우선순위
일단 이해가 안되더라도 이것부터 보고 넘어가자 이 순서대로 우선순위가 적용된다
1. 커스텀 레이아웃 프런트머터에 설정된`layout`값
2. [페이지 종류(Page kinds)](https://gohugo.io/methods/page/kind/) `home`,`section`,`taxonomy`,`term`,`page`중 하나
3. 표준 레이아웃 1 `list`또는`single` 
4. 출력 형식(Output format) `html`,`rss`등
5. 표준 레이아웃 2 `all`
6. 언어(Language) `en`등
7. 미디어 타입(Media type) `text/html`등
8. [페이지 경로(Page path)](https://gohugo.io/methods/page/path/) 예:`/blog/mypost`
9. 타입(Type) 프런트머터에 설정된`type`값

### 모든 경우의 수로 알아본 template 선택 시스템
