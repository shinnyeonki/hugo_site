---
title: 계층 기반 폴더 구조 vs 서비스 단위 기반 폴더 구조
date: 2025-07-31T09:15:00+09:00
lastmod: 2025-10-21T20:40:31+09:00
resource-path: 02.inbox/계층 기반 폴더 구조 vs 서비스 단위 기반 폴더 구조.md
aliases: 
tags:
  - design
---
좋은 질문입니다. **DTO, Repository, Domain, Service** 와 같은 **계층 기반 폴더 구조**(Layered Architecture)와 **서비스 단위 기반 폴더 구조**(Vertical Slice / Feature-based Architecture) 중 어느 것이 더 나은지는 **프로젝트의 규모, 팀 구조, 유지보수성, 확장성** 등에 따라 달라집니다.

아래에서 두 방식의 특징과 장단점을 비교하고, 어떤 상황에서 어떤 방식이 적합한지 정리해 드릴게요.

---

### ✅ 1. **계층 기반 구조 (Layered / Horizontal Architecture)**

```
src/
├── dto/
│   ├── UserRequestDto.java
│   └── UserResponseDto.java
├── domain/
│   ├── User.java
│   └── UserStatus.java
├── repository/
│   └── UserRepository.java
├── service/
│   └── UserService.java
├── controller/
│   └── UserController.java
└── config/
    └── DatabaseConfig.java
```

#### ✅ 장점
- **일관성 있는 구조**: 모든 개발자가 동일한 위치에서 동일한 타입의 클래스를 찾을 수 있음.
- **초기 개발이 쉬움**: 특히 작은 프로젝트나 학습용 프로젝트에 적합.
- **Spring Boot 등의 프레임워크와 자연스럽게 맞음**: MVC 패턴과 잘 어울림.

#### ❌ 단점
- **변경이 어렵다**: 하나의 기능을 수정할 때 여러 패키지를 왔다갔다 해야 함 (예: 유저 생성 기능 수정 시 controller → service → repository → dto 모두 확인).
- **결합도 증가**: 모든 기능이 동일한 계층에 몰려 있어, 관련 없는 기능들끼리 묶임.
- **대규모 프로젝트에서 관리 어려움**: 기능이 많아질수록 파일 수가 많아지고, 관련 코드를 찾기 어려워짐.

---

### ✅ 2. **서비스(기능) 단위 구조 (Vertical Slice / Feature-based Architecture)**

```
src/
├── user/
│   ├── User.java
│   ├── UserRepository.java
│   ├── UserService.java
│   ├── UserController.java
│   ├── UserRequestDto.java
│   └── UserResponseDto.java
├── order/
│   ├── Order.java
│   ├── OrderService.java
│   └── OrderController.java
└── common/
    ├── config/
    └── exception/
```

#### ✅ 장점
- **기능 단위로 코드가 묶여 있어 유지보수 용이**: 유저 관련 기능은 `user/` 폴더 안에 모두 있음.
- **변경이 쉬움**: 기능 하나를 수정할 때 관련된 모든 코드를 한 폴더에서 찾을 수 있음.
- **팀 기반 개발에 유리**: 팀이 기능 단위로 분업하기 쉬움 (예: A팀은 user, B팀은 order 담당).
- **확장성 좋음**: 새 기능 추가 시 폴더 하나 생성하면 됨.

#### ❌ 단점
- **중복 가능성**: 공통 로직(예: DTO, 유틸)이 각 폴더에 중복될 수 있음 → `common` 또는 `shared` 패키지로 해결 필요.
- **초기 설계가 중요**: 공통 모듈과 기능 모듈의 경계를 잘 설정해야 함.
- **익숙하지 않은 구조**: 전통적인 계층 구조에 익숙한 개발자에게는 어색할 수 있음.

---

### ✅ 결론: 어떤 걸 선택해야 할까?

| 프로젝트 유형 | 추천 구조 |
|---------------|-----------|
| **작은 프로젝트, 학습용, MVP** | ✅ 계층 기반 구조 (간단하고 직관적) |
| **중대형 프로젝트, 장기 운영, 팀 개발** | ✅ **서비스/기능 단위 구조** (유지보수성 ↑) |
| **도메인 중심 설계(DDD) 적용** | ✅ 기능 단위 + bounded context 기반 구성 |
| **마이크로서비스 아키텍처** | ✅ 각 서비스 내부는 기능 단위 구조 권장 |

---

### 🔁 보완 전략 (하이브리드 접근)

실제로는 **하이브리드**로 구성하는 경우도 많습니다:

```text
src/
├── user/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   └── dto/
├── order/
│   ├── controller/
│   └── service/
├── common/
│   ├── dto/
│   ├── exception/
│   └── util/
└── config/
```

→ **기능 단위로 묶되**, 내부는 계층 구조를 유지.  
이 방식은 **유지보수성과 일관성을 동시에 잡을 수 있어 실무에서 많이 사용**됩니다.

---

### ✅ 추천

> 🔔 **"기능 단위 기반 구조 + 내부 계층 분리"** 를 추천합니다.

예:

```java
com.example.app.user
  ├── User.java
  ├── UserController.java
  ├── UserService.java
  ├── UserRepository.java
  ├── UserCreateRequest.java
  └── UserResponse.java
```

이렇게 하면:
- 기능 단위로 코드를 찾기 쉽고,
- 각 기능 내부는 역할에 따라 분리되어 있어 체계적입니다.

---

### 📚 참고 아키텍처 패턴
- [Vertical Slice Architecture](https://jimmybogard.com/vertical-slice-architecture/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design (DDD)](https://domaindrivendesign.org/)
