# 좌측 네비게이션 아키텍처

## 개요

좌측 네비게이션은 CSS peer modifier와 체크박스 기반 토글 시스템을 활용한 순수 CSS 네비게이션 구현입니다. JavaScript 없이 반응형 레이아웃과 상태 관리를 실현합니다.

## 핵심 구조

### 1. 토글 메커니즘

```html
<input type="checkbox" id="leftNavToggleCheckbox" class="hidden peer">
```

- `hidden`: 체크박스를 시각적으로 숨김
- `peer`: Tailwind CSS의 peer modifier 활성화
- 체크박스 상태가 형제 요소들의 스타일을 제어

### 2. 네비게이션 컨테이너

```html
<nav id="left-nav-container" class="
    fixed top-0 left-0 h-screen z-30
    w-[calc(100svw-4rem)]
    -translate-x-full
    peer-checked:translate-x-0
    transition-transform duration-300">
```

#### 주요 속성
- `fixed`: 뷰포트 기준 고정 위치
- `z-30`: 메인 콘텐츠(z-20) 위에 표시
- `w-[calc(100svw-4rem)]`: 화면 너비에서 4rem을 뺀 너비
- `-translate-x-full`: 기본 상태는 왼쪽으로 완전히 숨김
- `peer-checked:translate-x-0`: 체크박스 체크 시 원위치로 이동
- `transition-transform duration-300`: 300ms 부드러운 전환

### 3. 메인 콘텐츠 래퍼

```html
<div id="main-content-wrapper" class="
    w-full
    peer-checked:translate-x-[calc(100svw-4rem)]
    transition-transform duration-300">
```

- 네비게이션이 열릴 때 메인 콘텐츠도 함께 이동
- `peer-checked`: 체크박스 상태에 따라 동기화된 애니메이션
- 네비게이션과 동일한 이동 거리 및 애니메이션 duration

## 레이아웃 시스템

### 반응형 Flexbox 구조

```html
<div class="flex flex-col md:flex-row h-full">
    <!-- 1열: 검색 -->
    <div class="md:w-1/2 lg:w-1/3"></div>
    
    <!-- 콘텐츠 영역 -->
    <div class="flex-grow flex">
        <div class="flex flex-col lg:flex-row w-full">
            <!-- 2열: 파일 & 태그 트리 -->
            <div class="w-full lg:w-1/2"></div>
            
            <!-- 3열: 최신 문서 -->
            <div class="w-full lg:w-1/2"></div>
        </div>
    </div>
</div>
```

### 브레이크포인트별 동작

#### 모바일 (< 768px)
- 단일 열 수직 레이아웃
- 검색 → 파일/태그 → 최신 문서 순서
- 전체 너비 `w-[calc(100svw-4rem)]` 사용

#### 태블릿 (≥ 768px, < 1024px)
- 2열 레이아웃
- 검색: 고정 너비 `md:w-1/2`
- 파일/태그 & 최신 문서: 수직 배열

#### 데스크탑 (≥ 1024px)
- 3열 레이아웃
- 검색: `lg:w-1/3`
- 파일/태그: `lg:w-1/2`
- 최신 문서: `lg:w-1/2`
- 모든 섹션 수평 배열

## 스크롤 관리

### overflow 전략

```css
#left-nav-container {
    overflow-x: hidden;  /* 수평 스크롤 방지 */
    overflow-y: hidden;  /* 최상위 레벨 수직 스크롤 비활성화 */
}

.content-sections {
    overflow-y: auto;    /* 개별 섹션만 수직 스크롤 허용 */
}
```

- 검색 영역: 고정 (스크롤 없음)
- 파일/태그 트리: 독립적 스크롤
- 최신 문서: 독립적 스크롤

## 상태 관리 흐름

### 1. 초기 상태 (닫힘)
```
checkbox: unchecked
sidebar: -translate-x-full (화면 밖)
main: translate-x-0 (정상 위치)
```

### 2. 토글 동작
사용자가 헤더의 햄버거 아이콘 클릭 → `<label for="leftNavToggleCheckbox">`가 체크박스 상태 변경

### 3. 열림 상태
```
checkbox: checked
sidebar: translate-x-0 (화면에 표시)
main: translate-x-[calc(100svw-4rem)] (오른쪽으로 이동)
```

### 4. CSS Transition
- 양방향 모두 300ms 애니메이션 적용
- `ease-in-out` 타이밍 함수로 자연스러운 가속/감속

## 스타일링 시스템

### 다크모드 지원
```css
bg-white dark:bg-neutral-900
border-neutral-200 dark:border-neutral-800
```

- Tailwind의 `dark:` modifier 활용
- 시스템/사용자 설정에 따라 자동 전환

### 테두리 구조
- 네비게이션: 우측 테두리 (`border-r`)
- 검색 영역: 우측 테두리 분리
- 파일/태그 영역: 데스크탑에서만 우측 테두리 (`lg:border-r`)

## 성능 최적화

### 1. GPU 가속
- `transform` 속성 사용 → GPU 가속 레이어 생성
- `left/right` 대신 `translate` 사용으로 reflow 방지

### 2. will-change (선택적)
필요시 추가 가능:
```css
will-change: transform;
```

### 3. 레이어 최소화
- 불필요한 `position: fixed` 최소화
- z-index 스택 단순화 (z-20, z-30, z-40)

## JavaScript 통합

### left-nav.js 역할
```javascript
// 체크박스 상태 관리
// 외부 클릭 시 닫기 처리
// 동적 콘텐츠 로딩
// 검색 기능 구현
```

CSS는 레이아웃과 애니메이션을 담당하고, JavaScript는 상호작용 로직을 처리하는 명확한 관심사 분리

## 장점

1. **선언적 상태 관리**: 체크박스 상태 = UI 상태
2. **접근성**: 네이티브 `<input>` 요소로 키보드 네비게이션 지원
3. **성능**: CSS 전환만으로 애니메이션 구현
4. **유지보수성**: peer modifier로 간결한 코드
5. **SSR 호환**: JavaScript 로드 전에도 작동

## 제약사항 및 고려사항

1. **모바일 너비**: `calc(100svw-4rem)`은 4rem 여백 강제
2. **중첩 스크롤**: 모바일에서 body 스크롤과 충돌 가능성
3. **peer 제한**: 형제 요소에만 작동 (Tailwind 제약)
4. **z-index 관리**: 모달/드롭다운과 충돌 주의

## 확장 가능성

### 애니메이션 커스터마이징
```javascript
// tailwind.config.js
theme: {
  extend: {
    transitionDuration: {
      '400': '400ms',
    }
  }
}
```

### 너비 조정
```html
<!-- 더 넓은 네비게이션 -->
w-[calc(100svw-2rem)]
peer-checked:translate-x-[calc(100svw-2rem)]
```

### 방향 전환 (우측 네비게이션)
```html
<!-- right-to-left 전환 -->
right-0
translate-x-full
peer-checked:-translate-x-0
```

## 결론

이 네비게이션 아키텍처는 최신 CSS 기능과 Tailwind CSS의 utility-first 접근을 결합하여, 최소한의 JavaScript로 복잡한 UI 상호작용을 구현합니다. peer modifier와 transform 기반 애니메이션의 조합은 성능과 유지보수성 모두를 만족시키는 현대적인 패턴입니다.
