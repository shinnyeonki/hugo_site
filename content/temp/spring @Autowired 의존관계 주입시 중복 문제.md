---
title: spring @Autowired 의존관계 주입시 중복 문제
date: 2024-02-01T08:31:00+09:00
lastmod: 2024-02-01T08:31:00+09:00
resource-path: temp/spring @Autowired 의존관계 주입시 중복 문제.md
aliases: 
tags:
  - spring
---
Autowired 어노테이션을 통해 어떠한 객체를 생성할 spring에서 의존 관계를 자동으로 주입해 준다
이때 조회되는 빈이 2개 이상이라면 즉 동일한 부모타입의 객체가 2개가 중복으로 등록되었다면 다음의 3가지 방법으로 해결한다
조회 대상 빈이 2개 이상일 때 해결 방법
- @Autowired 필드 명 매칭
- @Qualifier -> @Qualifier끼리 매칭 빈 이름 매칭
- @Primary 사용