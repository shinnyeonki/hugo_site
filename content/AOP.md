---
title: AOP
resource-path: AOP.md
keywords:
tags:
  - ai-content
date: 2025-10-19T16:27:14+09:00
lastmod: 2025-10-19T16:27:21+09:00
---
**AOP**(Aspect-Oriented Programming, **관점 지향 프로그래밍**)는 소프트웨어 설계에서 **횡단 관심사**(Cross-cutting Concerns)를 효과적으로 분리하고 모듈화하기 위한 프로그래밍 패러다임입니다.

---

### 🔍 핵심 아이디어
- **문제**: 로깅, 보안, 트랜잭션, 예외 처리 같은 기능은 **여러 모듈에 걸쳐 중복**되며,  
  이로 인해 **핵심 비즈니스 로직이 흐려지고**, **유지보수가 어려워집니다**.
- **해결**: AOP는 이런 **공통 관심사를 별도의 "관점**(Aspect)으로 추출하여,  
  원래 코드(핵심 로직)와 **분리해서 관리**할 수 있게 해줍니다.

> 💡 AOP는 **OOP**(객체 지향 프로그래밍)를 **보완**하는 개념입니다.  
> OOP는 "무엇을 하는가?"(객체와 책임)에 집중한다면,  
> AOP는 "언제, 어디서 공통 동작을 수행할 것인가?"에 집중합니다.

---

### 🧱 AOP의 주요 용어

| 용어 | 설명 |
|------|------|
| **Aspect **(관점) | 횡단 관심사를 모듈화한 단위. 예: `LoggingAspect`, `SecurityAspect` |
| **Join Point **(조인 포인트) | 프로그램 실행 중 **관점을 삽입할 수 있는 후보 지점** (예: 메서드 호출, 예외 발생 등) |
| **Pointcut **(포인트컷) | **실제로 관점을 적용할 조인 포인트를 필터링**하는 표현식. (예: `UserService의 모든 메서드`) |
| **Advice **(어드바이스) | 포인트컷에서 **실행될 실제 코드**. 언제 실행될지에 따라 종류가 나뉨. |
| **Weaving **(위빙) | Aspect를 **핵심 코드에 삽입하는 과정**. 컴파일 시, 로드 시, 런타임 시 가능. |

---

### 📌 Advice의 종류 (실행 시점 기준)

| 종류 | 설명 |
|------|------|
| **Before** | 대상 메서드 **실행 전**에 실행 |
| **After** | 대상 메서드 **실행 후** (성공/실패 상관없이) |
| **After-returning** | 대상 메서드가 **정상적으로 반환된 후** 실행 |
| **After-throwing** | 대상 메서드에서 **예외가 발생한 후** 실행 |
| **Around** | 대상 메서드 **전후를 완전히 감싸는** 가장 강력한 형태 (실행 제어 가능) |

---

### 💡 예시 (Spring AOP 기준)

```java
@Aspect
@Component
public class LoggingAspect {

    @Before("execution(* com.example.service.UserService.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        System.out.println("메서드 호출 전: " + joinPoint.getSignature().getName());
    }

    @Around("@annotation(LogExecutionTime)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = joinPoint.proceed(); // 원래 메서드 실행
        long end = System.currentTimeMillis();
        System.out.println(joinPoint.getSignature() + " 실행 시간: " + (end - start) + "ms");
        return result;
    }
}
```

→ `UserService`의 모든 메서드에 자동으로 로깅이 적용되며,  
핵심 로직에는 **로깅 코드 한 줄도 없음**!

---

### ✅ AOP의 장점
- **핵심 로직과 횡단 관심사 분리** → 코드가 깔끔하고 집중도 높음  
- **중복 제거** → DRY 원칙 준수  
- **유지보수 용이** → 로깅 정책 변경 시 한 곳만 수정  
- **유연한 확장** → 새로운 공통 기능을 쉽게 추가

---

### ⚠️ 주의 사항
- **과도한 사용은 디버깅을 어렵게 함** (실행 흐름이 명시적이지 않음)  
- **런타임 위빙은 성능 오버헤드** 발생 가능  
- 모든 언어에서 네이티브 지원하지 않음 (Java: Spring AOP, AspectJ / C#: PostSharp / Python: 데코레이터로 유사 구현 등)

---

### 📚 요약

> **AOP는 "로깅, 보안, 트랜잭션 같은 공통 기능을 핵심 코드에서 분리해,  
> 마치 레고 블록처럼 붙일 수 있게 해주는 기술"입니다**.  
> 이를 통해 **관심사의 분리**(SoC), **높은 응집도**, **낮은 결합도**를 실현할 수 있습니다.

궁금한 부분(예: Spring에서의 사용법, 다른 언어 예시 등)이 있다면 알려주세요!
