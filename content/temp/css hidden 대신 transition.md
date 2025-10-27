---
title: css hidden 대신 transition
resource-path: temp/css hidden 대신 transition.md
keywords:
tags:
  - ai-content
date: 2025-09-27T06:18:15+09:00
lastmod: 2025-09-27T06:18:29+09:00
---
Tailwind CSS를 사용한다고 가정하고, 좌우 사이드바(왼쪽 사이드바와 오른쪽 사이드바)가 각각 화면 왼쪽/오른쪽 밖에 숨어 있다가, 필요할 때 애니메이션과 함께 나타나도록 설정하는 과정입니다.

---

## 🔧 요구사항 요약

1. **좌우 사이드바에** 다음 클래스를 추가:
   - `transition-transform`: `transform` 속성에 대한 트랜지션(애니메이션)을 활성화
   - `duration-300`: 트랜지션 지속 시간을 300ms로 설정

2. **초기 상태에서**:
   - 왼쪽 사이드바는 화면 **왼쪽 밖**에 위치 → ` -translate-x-full`
   - 오른쪽 사이드바는 화면 **오른쪽 밖**에 위치 → ` translate-x-full`

3. **기존의 `hidden` 클래스는 제거**  
   → `hidden`은 `display: none`을 적용하므로, 애니메이션이 작동하지 않음

---

## 📄 HTML 구조 예시 (수정 전)

먼저, 일반적인 사이드바 구조를 예로 들어보겠습니다:

```html
<!-- 왼쪽 사이드바 -->
<aside id="left-sidebar" class="hidden">
  <!-- 콘텐츠 -->
</aside>

<!-- 오른쪽 사이드바 -->
<aside id="right-sidebar" class="hidden">
  <!-- 콘텐츠 -->
</aside>
```

이 상태에서는 `hidden` 클래스 때문에 두 사이드바가 **완전히 DOM에서 사라지며**, CSS 트랜지션(애니메이션)이 **작동하지 않습니다**.

---

## ✅ 수정된 HTML 구조 (수정 후)

```html
<!-- 왼쪽 사이드바 -->
<aside id="left-sidebar"
       class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg
              transform -translate-x-full
              transition-transform duration-300">
  <!-- 사이드바 콘텐츠 -->
</aside>

<!-- 오른쪽 사이드바 -->
<aside id="right-sidebar"
       class="fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg
              transform translate-x-full
              transition-transform duration-300">
  <!-- 사이드바 콘텐츠 -->
</aside>
```

---

## 📌 각 클래스의 역할 상세 설명

### 1. `fixed inset-y-0 left-0` / `right-0`
- `fixed`: 뷰포트 기준으로 고정 위치
- `inset-y-0`: 상단과 하단을 0으로 고정 → 전체 높이 차지
- `left-0` / `right-0`: 왼쪽 또는 오른쪽 끝에 붙임

### 2. `w-64`
- 사이드바 너비를 16rem (256px)로 설정 (Tailwind 기본값)

### 3. `bg-white shadow-lg`
- 시각적 스타일 (배경색 + 그림자) — 실제 디자인에 따라 달라질 수 있음

### 4. `transform`
- **필수 클래스**: Tailwind에서 `translate-*` 클래스를 사용하려면 반드시 `transform` 클래스가 있어야 실제 CSS `transform` 속성이 적용됩니다.
- 이 클래스가 없으면 `-translate-x-full` 등이 무시될 수 있습니다.

### 5. `-translate-x-full` (왼쪽 사이드바)
- 요소를 **자신의 너비만큼 왼쪽으로 이동** → 화면 밖으로 사라짐
- 예: 너비가 256px이면, 왼쪽으로 256px 이동 → 화면 왼쪽 끝에서 완전히 숨김

### 6. `translate-x-full` (오른쪽 사이드바)
- 요소를 **자신의 너비만큼 오른쪽으로 이동** → 화면 오른쪽 밖으로 사라짐

### 7. `transition-transform`
- `transform` 속성(예: `translateX`)에 대해 **애니메이션을 적용**하도록 지시
- 이 클래스가 없으면 이동이 **즉시** 일어나서 애니메이션이 없음

### 8. `duration-300`
- 트랜지션 지속 시간을 **300ms**로 설정 → 부드러운 슬라이드 인/아웃 효과

### 9. `hidden` 클래스 제거
- `hidden`은 `display: none`을 적용 → 요소가 렌더링되지 않음
- `display: none` 상태에서는 **어떤 CSS 트랜지션도 작동하지 않음**
- 대신, **위치만 이동시켜 시각적으로 숨기는 방식**을 사용 → 애니메이션 가능

---

## 🎯 사이드바를 보이게 하려면?

나중에 JavaScript나 Alpine.js, Vue 등으로 사이드바를 열고 싶을 때는:

- 왼쪽 사이드바: `-translate-x-full` → 제거 (또는 `translate-x-0` 추가)
- 오른쪽 사이드바: `translate-x-full` → 제거 (또는 `translate-x-0` 추가)

예시 (JavaScript로 왼쪽 사이드바 열기):

```js
document.getElementById('left-sidebar').classList.remove('-translate-x-full');
// 또는
document.getElementById('left-sidebar').classList.add('translate-x-0');
```

닫을 때는 다시 `-translate-x-full`를 추가하면 됩니다.

---

## 💡 요약

| 변경 사항 | 설명 |
|----------|------|
| `hidden` 제거 | 애니메이션을 위해 요소는 항상 DOM에 존재해야 함 |
| `transform` 추가 | Tailwind에서 translate 계열 클래스를 동작시키기 위함 |
| `-translate-x-full` / `translate-x-full` | 초기에 화면 밖으로 이동 |
| `transition-transform duration-300` | 부드러운 슬라이드 애니메이션 활성화 |

---

이렇게 설정하면, 사이드바는 **처음에는 보이지 않지만**, 필요할 때 **애니메이션과 함께 부드럽게 슬라이드 인/아웃**할 수 있습니다.  
Tailwind의 유틸리티 기반 클래스 시스템을 최대한 활용한 접근입니다.