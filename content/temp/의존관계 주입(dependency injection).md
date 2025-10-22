---
title: 의존관계 주입(dependency injection)
aliases:
  - 의존성 주입
  - DI
  - di
tags:
  - java
  - spring
  - oop
created: 2024-01-31T20:25:00+09:00
modified: 2025-08-19T22:14:39+09:00

---

- 생성자 주입
- 설정자 수정자 주입(setter)
- 필드 주입
- 일반 메서드 주입


## 생성자 주입
생성자 주입(Constructor Injection) 이 방법 객체 생성 시점 의존성 부여
불변,필수

```java
public class ExampleClass {
    private SomeDependency dependency;

    public ExampleClass(SomeDependency dependency) {
        this.dependency = dependency;
    }
}
```

> spring 에서는 @Autowired 를 통해 의존성을 주입하는데
> 생성자가 1개 라면 생략 가능하다

---

## 설정자 주입
설정자 주입(Setter Injection) 이 방법은 객체 생성 이후에도 의존성 변경 가능

```java
public class ExampleClass {
    private SomeDependency dependency;

    public void setDependency(SomeDependency dependency) {
        this.dependency = dependency;
    }
}
```

---

## 필드 주입
필드 주입(Field Injection) 

```java
public class ExampleClass {
    @Inject
    public SomeDependency dependency;
}
```

> public 접근제어자를 사용하지 않고 private 을 사용하고도 @Autowired 를 사용하여 의존성 주입을 할 수 있다 하지만 권장하지 않음

---

## 일반 메서드 주입
일반 메서드 주입(Method Injection) 

```java
public class ExampleClass {
    private SomeDependency dependency;

    public void anyMethodName(SomeDependency dependency) {
        this.dependency = dependency;
    }
}
```