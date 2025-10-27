---
title: thymeleaf 기본
resource-path: youngHan mvc1/thymeleaf 기본.md
keywords:
tags:
  - spring
  - young_han
date: 2025-03-17T04:39:00+09:00
lastmod: 2025-03-17T04:39:00+09:00
---
### 타임리프 간단히 알아보기

#### 1. **타임리프 사용 선언**
타임리프를 사용하기 위해 HTML 문서의 `<html>` 태그에 네임스페이스를 선언합니다.
```html
<html xmlns:th="http://www.thymeleaf.org">
```

---

#### 2. **속성 변경 - `th:href`**
`th:href`는 HTML의 `href` 속성을 동적으로 변경할 수 있습니다.  
예시:
```html
<link href="value1" th:href="@{/css/bootstrap.min.css}">
```
- **동작 방식**:  
  - HTML 파일을 직접 열면 `href="value1"`이 사용됩니다.  
  - 타임리프 템플릿을 거치면 `th:href`의 값(`@{/css/bootstrap.min.css}`)으로 대체됩니다.  

**핵심**:  
- `th:xxx`가 붙은 부분은 서버 사이드에서 렌더링되며, 기존 값을 대체합니다.  
- `th:xxx`가 없으면 기존 HTML 속성이 그대로 유지됩니다.

---

#### 3. **URL 링크 표현식 - `@{...}`**
타임리프에서 URL 링크를 작성할 때는 `@{...}`를 사용합니다. 이를 **URL 링크 표현식**이라 합니다.  
예시:
```html
<link th:href="@{/css/bootstrap.min.css}">
```
- **특징**:  
  - 서블릿 컨텍스트 경로를 자동으로 포함합니다.  
  - 경로 변수와 쿼리 파라미터도 쉽게 추가할 수 있습니다.

**경로 변수와 쿼리 파라미터 예시**:
```html
<a th:href="@{/basic/items/{itemId}(itemId=${item.id}, query='test')}">
```
생성된 링크:  
```
http://localhost:8080/basic/items/1?query=test
```

---

#### 4. **리터럴 대체 - `|...|`**
문자열과 표현식을 조합할 때 더하기(+) 연산자를 사용하지 않고 간단히 작성할 수 있는 문법입니다.  
예시:
```html
<span th:text="'Welcome to our application, ' + ${user.name} + '!'">
```
위 코드를 리터럴 대체 문법으로 간단히 작성하면:
```html
<span th:text="|Welcome to our application, ${user.name}!|">
```

**`th:onclick`에서 리터럴 대체 사용**:
```html
<button th:onclick="|location.href='@{/basic/items/add}'|">
```
결과:
```javascript
location.href='/basic/items/add'
```

---

#### 5. **반복 출력 - `th:each`**
컬렉션 데이터를 반복 처리할 때 사용합니다.  
예시:
```html
<tr th:each="item : ${items}">
    <td th:text="${item.name}">상품명</td>
    <td th:text="${item.price}">가격</td>
</tr>
```
- `items` 컬렉션의 각 요소가 `item` 변수에 할당되고, 반복문 안에서 사용됩니다.  
- 컬렉션의 크기만큼 `<tr>` 태그가 생성됩니다.

---

#### 6. **변수 표현식 - `${...}`**
모델에 포함된 값이나 타임리프 변수를 조회할 때 사용합니다.  
예시:
```html
<td th:text="${item.price}">10000</td>
```
- `${item.price}`는 `item.getPrice()` 메서드를 호출한 것과 동일합니다.  
- `10000`은 `${item.price}`의 값으로 대체됩니다.

---

#### 7. **내용 변경 - `th:text`**
HTML 요소의 내용을 동적으로 변경합니다.  
예시:
```html
<td th:text="${item.price}">10000</td>
```
- `10000`은 `${item.price}`의 값으로 대체됩니다.

---

#### 8. **URL 링크 간단히 작성 - 리터럴 대체 활용**
리터럴 대체 문법을 사용하여 URL을 간단히 작성할 수 있습니다.  
예시:
```html
<a th:href="@{|/basic/items/${item.id}|}">상품 상세보기</a>
```
생성된 링크:  
```
http://localhost:8080/basic/items/1
```

---

#### 9. **타임리프의 핵심 특징**
- **네츄럴 템플릿(Natural Templates)**:  
  - 순수 HTML 파일을 웹 브라우저에서 열어도 정상적으로 보입니다.  
  - 서버를 통해 뷰 템플릿을 거치면 동적으로 변경된 결과를 확인할 수 있습니다.  
  - JSP와 달리 소스 코드가 뒤죽박죽되지 않습니다.

---

#### 10. **참고**
타임리프는 다음과 같은 장점이 있습니다:
- HTML 파일을 그대로 유지하면서 템플릿 기능을 사용할 수 있습니다.  
- 서버 렌더링 후에도 클라이언트에서 정상적으로 작동합니다.  
- 직관적이고 간결한 문법으로 개발 생산성을 높입니다.  

---

### 요약
타임리프는 HTML 파일을 그대로 유지하면서 서버 사이드에서 동적으로 변환할 수 있는 강력한 템플릿 엔진입니다. 주요 기능으로는 `th:xxx` 속성, URL 링크 표현식(`@{...}`), 리터럴 대체(`|...|`), 반복 처리(`th:each`) 등이 있습니다. 이러한 특징 덕분에 네츄럴 템플릿이라는 이름으로 불리며, 현대적인 웹 개발에서 많이 사용되고 있습니다.