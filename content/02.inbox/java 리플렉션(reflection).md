---
title: java 리플렉션(reflection)
aliases: 
tags:
  - java
created: 2024-01-27T11:29:00+09:00
modified: 2024-01-27T11:29:00+09:00

---

클래스 인터페이스의 메타 정보를 java.lang.Class 클래스 객체에서 관리한다
이를 통해 런타임 시점에 클래스의 정보를 확인할 수 있다
```java
Class class = 클래스 이름.class; // 클래스 이름을 통해 얻는다
Class class = Class.forName(클래스 이름); // 클래스 이름을 통해 얻는다
Class class = 객체 참조 변수.getClass(); // 객체의 이름을 통해 얻는다
```

이렇게 얻어진 객체로 부터 여러가지 정보를 확인할 수 있다

| 메서드                                 | info                           |
| -------------------------------------- | ------------------------------ |
| Package getPackage()                   | 패키지 정보 읽기               |
| String getSimpleName()                 | 패키지를 제외한 타입 이름      |
| String getName()                       | 패키지를 포함한 전체 타입 이름 |
| Constuctor[] getDeclaredConstructors() | 생성자 정보 읽기               |
| Method[] getDeclaredMethod()           | 메서드 정보 읽기               |
| Field[] getDeclaredField()             | 필드 정보 읽기                 |
|                                        |                                |
등등 많은 것들 을 얻을 수 있다


[제네릭은 런타임에는 타입을 알지 못한다](https://cla9.tistory.com/52)
