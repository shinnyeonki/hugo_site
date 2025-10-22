---
title: spring bean scope
aliases:
  - 범위
tags:
  - spring
created: 2024-02-02T09:26:00+09:00
modified: 2024-02-02T09:26:00+09:00

---
스프링은 다음과 같은 다양한 스코프를 지원한다.
- 싱글톤: 기본 스코프, 스프링 컨테이너의 시작과 종료까지 유지되는 가장 넓은 범위의 스코프이다.
- 프로토타입: 스프링 컨테이너는 프로토타입 빈의 생성과 의존관계 주입까지만 관여하고 더는 관리하지 않는 매우 짧은 범위의 스코프이다.
- 웹 관련 스코프
	- request: 웹 요청이 들어오고 나갈때 까지 유지되는 스코프이다.
	- session: 웹 세션이 생성되고 종료될 때 까지 유지되는 스코프이다.
	- application: 웹의 서블릿 컨텍스트와 같은 범위로 유지되는 스코프이다


## 프로토타입
초기화 메서드 실행되지만 종료 메서드 호출 안됨 사용자가 직접 해야함

### [싱글톤 내부 의존관계로 프로토타입 스코프의 bean 을 가질때](../02.inbox/싱글톤%20내부%20의존관계로%20프로토타입%20스코프의%20bean%20을%20가질때.md)
싱글톤 객체 내부에 필드로 프로토타입을 가지고 있는경우 서로 다른 scope 성질로 인해 문제가 발생한다
두가지 방식으로 해결
- ObjectProvider 로 생성시점을 조절
- JSR-330 javax.injectProvider

> ObjectFatory 부모
> ObjectProvider 자식
> 객체를 생성하는 시기를 getObject() 통해 조절 가능 **DL** dependency Lookup
> 스프링 의존적

> java 표준을 사용
> jakarta.inject.Provider JSR-330 자바 표준
> import jakarta.inject.Provider;
> implementation 'jakarta.inject:jakarta.inject-api:2.0.1'

## 웹 스코프

- 웹 스코프의 특징
	- 웹 스코프는 웹 환경에서만 동작한다.
	- 웹 스코프는 프로토타입과 다르게 스프링이 해당 스코프의 종료시점까지 관리한다. 따라서 종료 메서드가 호출된 다.
- 웹 스코프 종류 
	- request: HTTP 요청 하나가 들어오고 나갈 때 까지 유지되는 스코프, 각각의 HTTP 요청마다 별도의 빈 인스턴 스가 생성되고, 관리된다.
	- session: HTTP Session과 동일한 생명주기를 가지는 스코프
	- application: 서블릿 컨텍스트( ServletContext )와 동일한 생명주기를 가지는 스코프
	- websocket: 웹 소켓과 동일한 생명주기를 가지는 스코프