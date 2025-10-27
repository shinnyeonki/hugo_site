---
title: HTTP 요청 3가지 방법
resource-path: youngHan mvc1/HTTP 요청 3가지 방법.md
keywords:
tags:
date: 2025-02-28T05:24:00+09:00
lastmod: 2025-06-27T19:52:08+09:00
---
### 1. **GET - 쿼리 파라미터**
- **데이터 전송 방식**: URL 끝에 `?key1=value1&key2=value2` 형식으로 데이터를 포함합니다.
- **특징**:
  - **메시지 바디 없음**: 데이터가 URL에 직접 노출됩니다.
  - **캐시 가능**: 브라우저나 프록시 서버에서 캐시됩니다.
  - **안전하지 않음**: 중요한 데이터(비밀번호 등) 전송에 부적합합니다.
- **사용 사례**:
  - 검색, 필터링, 페이징 (예: `GET /products?category=book&page=2`)
  - 북마크 또는 공유 가능한 링크 생성
- **예시**:

```http
  GET /users?name=hello&age=20 HTTP/1.1
  Host: example.com
```

### 2. **POST - HTML Form**
- **데이터 전송 방식**: 메시지 바디에 `key1=value1&key2=value2` 형식으로 데이터를 전송합니다. 쿼리 파라미터 형식으로 보낸다
- **헤더 설정**:

```http
  Content-Type: application/x-www-form-urlencoded
```

- **특징**:
  - **메시지 바디 사용**: URL에 데이터가 노출되지 않습니다.
  - **폼 데이터 전송**: HTML `<form>` 태그 기본 방식입니다.
  - **데이터 길이 제한 없음**: 대량의 데이터 전송 가능합니다.
- **사용 사례**:
  - 회원 가입, 로그인, 상품 주문 (예: `POST /login` + `username=admin&password=1234`)
- **예시**:

```http
  POST /submit-form HTTP/1.1
  Host: example.com
  Content-Type: application/x-www-form-urlencoded

  username=hello&age=20
```

---

### 3. **HTTP Message Body (JSON/XML 등)**
- **데이터 전송 방식**: 메시지 바디에 구조화된 데이터(JSON, XML 등)를 직접 작성합니다.
- **헤더 설정**:

```http
  Content-Type: application/json  # JSON 사용 시
```

- **특징**:
  - **다양한 데이터 형식**: JSON, XML, 텍스트 등 사용 가능합니다.
  - **HTTP API 표준**: RESTful API에서 주로 사용됩니다.
  - **복잡한 데이터 처리**: 계층적/중첩된 데이터 전송에 적합합니다.
- **사용 사례**:
  - 모바일 앱/백엔드 연동 (예: `POST /api/users` + JSON 데이터)
  - PUT/PATCH를 통한 리소스 업데이트
- **예시 (JSON)**:

```http
  POST /api/users HTTP/1.1
  Host: example.com
  Content-Type: application/json

  {
    "name": "hello",
    "age": 20,
    "hobbies": ["reading", "coding"]
  }
```

---

### 📌 차이점 요약
| 구분                | GET (쿼리 파라미터)         | POST (HTML Form)               | HTTP Message Body (JSON/XML) |
|---------------------|----------------------------|--------------------------------|------------------------------|
| **데이터 위치**      | URL 끝에 `?key=value`       | 메시지 바디 (`key=value`)      | 메시지 바디 (구조화된 데이터) |
| **사용 HTTP 메서드** | GET                        | POST                           | POST, PUT, PATCH 등          |
| **데이터 형식**      | 쿼리 스트링                | `application/x-www-form-urlencoded` | JSON, XML, 텍스트 등       |
| **주요 사용처**      | 검색, 필터링, 공유 링크     | HTML 폼 제출 (로그인, 주문)    | API 통신 (모바일/서버 연동)  |

---

### 💡 선택 가이드
- **간단한 데이터 조회**: `GET` + 쿼리 파라미터
- **폼 기반 데이터 제출**: `POST` + `application/x-www-form-urlencoded`
- **복잡한 데이터 연동**: `POST/PUT/PATCH` + `application/json`