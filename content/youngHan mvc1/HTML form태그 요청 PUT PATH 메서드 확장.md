---
title: HTML form태그 요청 PUT PATH 메서드 확장
resource-path: youngHan mvc1/HTML form태그 요청 PUT PATH 메서드 확장.md
aliases:
tags:
  - html
  - young_han
date: 2025-02-28T14:56:00+09:00
lastmod: 2025-06-27T19:52:13+09:00
---
HTML 표준  **Form** 태그에서 기본적으로 지원하는 메서드는 `GET`과 `POST`뿐이지만, 현대 웹 개발에서는 **PUT**, **PATCH**, 또는 **DELETE** 같은 HTTP 메서드를 사용할 수 있도록 확장할 수 있습니다. 이를 구현하기 위해 몇 가지 방법이 있습니다.

---

### 1. **HTML Form의 기본 제한**
- HTML 표준에서는 `<form>` 태그의 `method` 속성으로 **GET** 또는 **POST**만 지정할 수 있습니다.

  ```html
  <form action="/submit" method="POST">
    <!-- 폼 데이터 -->
  </form>
  ```

  - 즉, 기본적으로 HTML Form 자체로는 `PUT`, `PATCH`, `DELETE`를 직접 사용할 수 없습니다.

---

### 2. **PUT/PATCH를 사용하는 방법**
#### **(1) JavaScript를 활용한 방식**
JavaScript를 사용하면 HTML Form 데이터를 `PUT` 또는 `PATCH` 요청으로 전송할 수 있습니다. 예를 들어, `fetch` API를 사용해 다음과 같이 구현할 수 있습니다.

```html
<form id="updateForm">
  <input type="text" name="username" value="hello">
  <input type="number" name="age" value="20">
  <button type="button" onclick="submitForm()">제출</button>
</form>

<script>
  function submitForm() {
    const formData = new FormData(document.getElementById('updateForm'));
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    fetch('/update', {
      method: 'PUT', // 또는 PATCH
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => console.log(result));
  }
</script>
```

- **설명**:
  - HTML Form을 직접 제출하지 않고, JavaScript로 데이터를 수집하고 `PUT` 또는 `PATCH` 요청으로 전송합니다.
  - 이 방식은 RESTful API와 함께 자주 사용됩니다.

---

#### **(2) 숨겨진 필드 `_method`를 활용한 에뮬레이션**
일부 웹 프레임워크 (예: Ruby on Rails, Spring Boot)에서는 POST 요청을 통해 PUT/PATCH/DELETE 메서드를 에뮬레이션할 수 있는 기능을 제공합니다. 이때 `_method`라는 숨겨진 필드를 사용합니다.

```html
<form action="/update" method="POST">
  <input type="hidden" name="_method" value="PUT">
  <input type="text" name="username" value="hello">
  <input type="number" name="age" value="20">
  <button type="submit">제출</button>
</form>
```

- **설명**:
  - 실제로는 POST 요청이 전송되지만, 서버 측에서 `_method=PUT`을 확인하고 이를 PUT 요청으로 처리합니다.
  - 이러한 동작은 프레임워크가 내부적으로 처리하며, 클라이언트는 POST 요청만 보내도 됩니다.

---

### 3. **PUT vs PATCH 차이점**
| **기준**         | **PUT**                                | **PATCH**                              |
|------------------|----------------------------------------|----------------------------------------|
| **목적**         | 리소스 전체를 수정                    | 리소스 일부를 수정                     |
| **데이터 전송**   | 전체 데이터를 포함                   | 변경된 부분만 포함                    |
| **멱등성(Idempotent)** | O (같은 요청을 여러 번 실행해도 동일한 결과) | X (변경 사항에 따라 결과 다를 수 있음) |

---

### 4. **PUT/PATCH 사용 예시**
#### **PUT 예시**
리소스 전체를 업데이트하는 경우:

```http
PUT /users/123 HTTP/1.1
Content-Type: application/json

{
  "username": "newName",
  "age": 25,
  "email": "new@example.com"
}
```

#### **PATCH 예시**
리소스 일부만 업데이트하는 경우:

```http
PATCH /users/123 HTTP/1.1
Content-Type: application/json

{
  "age": 26
}
```

---

### 5. **왜 HTML Form에서 PUT/PATCH를 직접 지원하지 않을까?**
- **역사적 이유**: 초기 HTML 설계 시에는 단순한 데이터 전송(GET, POST)만 고려되었습니다.
- **RESTful API의 등장**: 이후 REST 아키텍처가 널리 사용되면서 PUT, PATCH, DELETE 같은 메서드가 중요해졌습니다.
- **보안 및 간결성**: GET과 POST는 간단하고 직관적이며, 복잡한 메서드는 JavaScript나 프레임워크를 통해 구현하도록 설계되었습니다.

---

### 6. **결론**
- **HTML Form 자체로는 PUT/PATCH를 직접 사용할 수 없습니다.**
- **JavaScript를 사용하거나 `_method`와 같은 에뮬레이션 기법을 통해 PUT/PATCH를 구현할 수 있습니다.**
- **RESTful API 설계 시**, PUT은 리소스 전체를 수정하고, PATCH는 리소스 일부를 수정하는 데 사용됩니다.

따라서, HTML Form에서도 PUT/PATCH를 사용할 수 있지만, 추가적인 기술적 구현이 필요합니다.