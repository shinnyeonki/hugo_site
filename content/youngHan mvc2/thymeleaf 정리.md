---
title: thymeleaf 정리
resource-path: youngHan mvc2/thymeleaf 정리.md
keywords:
tags:
date: 2025-03-18T13:26:00+09:00
lastmod: 2025-03-18T13:26:00+09:00
---
### text
```html
<li>th:text 사용 <span th:text="${data}"></span></li>
<li>컨텐츠 안에서 직접 출력하기 = [${data}](${data})</li>
```
















아래는 타임리프(Thymeleaf)의 기본 사용 선언과 제공하는 기본 표현식들을 정리한 내용입니다. 이를 통해 타임리프를 효과적으로 활용할 수 있습니다.

---

### **타임리프 사용 선언**
```html
<html xmlns:th="http://www.thymeleaf.org">
```
- 위 선언은 HTML 문서에서 타임리프를 사용하기 위해 필요한 네임스페이스를 정의합니다.

---

### **타임리프 기본 표현식**

#### **1. 간단한 표현식**
- **변수 표현식**: `${...}`
  - 컨텍스트 내 변수에 접근하거나 값을 출력하는 데 사용됩니다.
  - 예: `<p th:text="${user.name}">이름</p>`

- **선택 변수 표현식**: `*{...}`
  - 현재 선택된 객체에 대한 속성에 접근할 때 사용됩니다.
  - 예: `<div th:object="${user}"><p th:text="*{name}">이름</p></div>`

- **메시지 표현식**: `#{...}`
  - 국제화(i18n)를 지원하는 메시지를 출력하는 데 사용됩니다.
  - 예: `<p th:text="#{welcome.message}">환영합니다!</p>`

- **링크 URL 표현식**: `@{...}`
  - 동적인 URL을 생성하는 데 사용됩니다.
  - 예: `<a th:href="@{/user/{id}(id=${user.id})}">프로필</a>`

- **조각 표현식**: `~{...}`
  - 템플릿 조각(fragment)을 포함하는 데 사용됩니다.
  - 예: `<div th:replace="~{fragments/header :: header}"></div>`

---

#### **2. 리터럴**
- **텍스트**: `'one text'`, `'Another one!'`
  - 문자열을 나타냅니다.
  - 예: `<p th:text="'Hello, World!'">기본 텍스트</p>`

- **숫자**: `0`, `34`, `3.0`, `12.3`
  - 숫자를 나타냅니다.
  - 예: `<p th:text="${10 + 20}">합계</p>`

- **불린**: `true`, `false`
  - 논리값을 나타냅니다.
  - 예: `<p th:if="${isActive}">활성화됨</p>`

- **널**: `null`
  - null 값을 나타냅니다.
  - 예: `<p th:if="${user == null}">사용자 없음</p>`

- **리터럴 토큰**: `one`, `sometext`, `main`
  - 문자열 대신 사용할 수 있는 심볼릭 토큰입니다.
  - 예: `<p th:class="main">주요 내용</p>`

---

#### **3. 문자 연산**
- **문자 합치기**: `+`
  - 문자열을 연결합니다.
  - 예: `<p th:text="'Hello, ' + ${name}">인사말</p>`

- **리터럴 대체**: `|The name is ${name}|`
  - 문자열 내에서 변수를 직접 삽입하는 방법입니다.
  - 예: `<p th:text="|Welcome, ${user.name}!|">환영합니다</p>`

---

#### **4. 산술 연산**
- **이항 연산자**: `+`, `-`, `*`, `/`, `%`
  - 산술 연산을 수행합니다.
  - 예: `<p th:text="${10 + 5}">15</p>`

- **단항 연산자(음수 표시)**: `-`
  - 음수를 나타냅니다.
  - 예: `<p th:text="${-10}">-10</p>`

---

#### **5. 불린 연산**
- **이항 연산자**: `and`, `or`
  - 논리 AND와 OR 연산을 수행합니다.
  - 예: `<p th:if="${isActive and isAdmin}">관리자 활성화</p>`

- **부정 연산자**: `!`, `not`
  - 논리값을 반전합니다.
  - 예: `<p th:if="${!isActive}">비활성화됨</p>`

---

#### **6. 비교와 동등 연산**
- **비교 연산자**: `>`, `<`, `>=`, `<=` (`gt`, `lt`, `ge`, `le`)
  - 크기 비교를 수행합니다.
  - 예: `<p th:if="${age >= 18}">성인</p>`

- **동등 연산자**: `==`, `!=` (`eq`, `ne`)
  - 값의 동일성을 비교합니다.
  - 예: `<p th:if="${status == 'active'}">활성 상태</p>`

---

#### **7. 조건 연산**
- **If-then**: `(if) ? (then)`
  - 조건이 참일 때 특정 값을 반환합니다.
  - 예: `<p th:text="${isActive ? 'Active' : 'Inactive'}">상태</p>`

- **If-then-else**: `(if) ? (then) : (else)`
  - 조건에 따라 다른 값을 반환합니다.
  - 예: `<p th:text="${isAdmin ? 'Admin' : 'User'}">역할</p>`

- **Default**: `(value) ?: (defaultvalue)`
  - 값이 null일 경우 기본값을 반환합니다.
  - 예: `<p th:text="${user.name ?: 'Guest'}">이름</p>`

---

#### **8. 특별한 토큰**
- **No-Operation**: `_`
  - 아무 작업도 수행하지 않음을 나타냅니다.
  - 예: `<p th:text="_">기본값 유지</p>`

---

### **참고 자료**
- 공식 문서: [](https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#standard-expression-syntax)


