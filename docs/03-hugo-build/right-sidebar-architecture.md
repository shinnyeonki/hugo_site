# 우측 사이드바 아키텍처

## 개요

우측 사이드바는 반응형 레이아웃과 탭 기반 콘텐츠 전환을 결합한 하이브리드 사이드바 시스템입니다. 모바일에서는 오버레이 방식으로, 데스크탑에서는 sticky push 방식으로 동작하며, 내부적으로는 translate 기반 탭 전환을 구현합니다.

## 핵심 구조

### 1. 컨테이너 구조

```html
<aside id="right-sidebar-container" class="
    /* 모바일: 오버레이 */
    fixed top-14 right-0 z-40
    h-[calc(100vh-3.5rem)]
    translate-x-full
    
    /* 데스크탑: sticky push */
    md:sticky md:top-14
    md:w-0
    md:translate-x-0
    md:bg-transparent md:border-none
    
    /* 공통 */
    transition-all duration-300
    flex flex-col overflow-hidden">
</aside>
```

#### 레이아웃 모드별 동작

**모바일 (< 768px)**
- `fixed`: 뷰포트 고정
- `translate-x-full`: 기본 상태 숨김 (화면 밖 우측)
- `z-40`: 최상위 레이어 (좌측 사이드바 z-30보다 위)
- 토글 시 `translate-x-full` 제거 → 오버레이로 표시

**데스크탑 (≥ 768px)**
- `md:sticky`: 스크롤에 따라 고정
- `md:w-0`: 기본 너비 0 (숨김)
- `md:translate-x-0`: translate 비활성화
- 토글 시 `md:w-80` 추가 → 콘텐츠 영역을 밀어냄 (push)
- `md:bg-transparent`: 배경 투명 처리

### 2. 내부 레이아웃

```html
<div class="w-80 h-full flex flex-col">
    <!-- 탭 네비게이션: flex-shrink-0 -->
    <div role="tablist" class="flex-shrink-0">...</div>
    
    <!-- 탭 콘텐츠: flex-grow -->
    <div class="flex-grow overflow-hidden">
        <div id="right-sidebar-track" class="flex h-full">
            <div class="w-full flex-shrink-0">TOC</div>
            <div class="w-full flex-shrink-0">Metadata</div>
            <div class="w-full flex-shrink-0">Links</div>
        </div>
    </div>
</div>
```

- `w-80`: 고정 너비 (320px)
- `flex flex-col`: 세로 방향 flexbox
- `flex-shrink-0`: 탭 네비게이션 크기 고정
- `flex-grow`: 콘텐츠 영역이 남은 공간 차지
- `overflow-hidden`: 슬라이드 트랙이 넘치지 않도록 클리핑

## 반응형 토글 메커니즘

### JavaScript 기반 토글 로직

```javascript
const rightSidebar = document.getElementById('right-sidebar-container');
const rightSidebarToggle = document.getElementById('rightSidebarToggle');

const isTabletOrLarger = () => window.innerWidth >= 768;

rightSidebarToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isTabletOrLarger()) {
        // 데스크톱: 너비 조절 (push 효과)
        rightSidebar.classList.toggle('md:w-80');
    } else {
        // 모바일: translate 조절 (오버레이 효과)
        rightSidebar.classList.toggle('translate-x-full');
    }
});
```

### 토글 상태 전환

#### 모바일
```
닫힘: translate-x-full (화면 밖)
열림: translate-x-full 제거 (화면에 표시)
```

#### 데스크탑
```
닫힘: w-0 (너비 0)
열림: md:w-80 추가 (너비 320px)
```

### CSS Transition
- `transition-all duration-300`: 모든 속성 변화에 300ms 애니메이션
- 너비 변화와 translate 변화 모두 부드럽게 전환

## 탭 시스템 아키텍처

### 1. 슬라이드 트랙 구조

```html
<div id="right-sidebar-track" class="flex h-full transition-transform duration-300">
    <div class="w-full flex-shrink-0">Panel 1</div>
    <div class="w-full flex-shrink-0">Panel 2</div>
    <div class="w-full flex-shrink-0">Panel 3</div>
</div>
```

- 부모: `overflow-hidden`으로 한 패널만 표시
- 트랙: `flex`로 패널들을 수평 배치
- 각 패널: `w-full flex-shrink-0`로 고정 너비 유지
- 전체 너비: 패널 수 × 100%

### 2. Transform 기반 전환

```javascript
const tabNameToIndex = {
    'tab-toc': 0,
    'tab-metadata': 1,
    'tab-links': 2,
};

const tabIndex = tabNameToIndex[tab.id];
track.style.transform = `translateX(-${tabIndex * 100}%)`;
```

#### 이동 거리 계산
- Tab 0 (TOC): `translateX(0%)` → 1번째 패널 표시
- Tab 1 (Metadata): `translateX(-100%)` → 2번째 패널 표시
- Tab 2 (Links): `translateX(-200%)` → 3번째 패널 표시

### 3. ARIA 기반 접근성

```html
<button role="tab" 
        aria-selected="true"
        aria-controls="panel-toc"
        tabindex="0">
```

```html
<div role="tabpanel"
     aria-labelledby="tab-toc"
     tabindex="0">
```

- `role="tab"` / `role="tabpanel"`: 스크린 리더 지원
- `aria-selected`: 활성 탭 상태 표시
- `aria-controls` / `aria-labelledby`: 탭과 패널 연결
- `tabindex`: 키보드 네비게이션 지원

## 탭 전환 로직

### 1. 이벤트 리스너 등록

```javascript
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // 1. 모든 탭 비활성화
        // 2. 클릭된 탭 활성화
        // 3. 트랙 이동
    });
});
```

### 2. 스타일 상태 관리

#### 비활성 탭 스타일
```css
border-transparent
text-slate-500
hover:text-slate-700
hover:border-slate-300
dark:text-neutral-400
dark:hover:text-neutral-200
```

#### 활성 탭 스타일
```css
border-neutral-800
dark:border-neutral-100
text-neutral-800
dark:text-neutral-100
```

### 3. 동적 클래스 조작

```javascript
// 비활성화
tab.classList.remove('border-neutral-800', 'dark:border-neutral-100', ...);
tab.classList.add('border-transparent', 'text-slate-500', ...);

// 활성화
tab.classList.add('border-neutral-800', 'dark:border-neutral-100', ...);
tab.classList.remove('border-transparent', 'text-slate-500', ...);
```

## 콘텐츠 패널 구조

### 1. TOC 패널

```html
<div class="w-full flex-shrink-0 h-full overflow-y-auto">
    {{ .TableOfContents }}
</div>
```

- Hugo의 내장 TOC 렌더링
- 독립적 수직 스크롤 (`overflow-y-auto`)
- CSS 파일 `toc.css`로 스타일링 (`baseof.html`에서 로드)

### 2. Metadata 패널

```html
{{ range $key, $value := .Params }}
    {{ if not (or (eq $key "iscjklanguage") (eq $key "draft") ...) }}
        <div class="metadata-item">
            <div class="text-xs">{{ $key }}</div>
            {{ if eq $key "tags" }}
                <!-- 태그는 클릭 가능한 링크로 렌더링 -->
                {{ range $value }}
                    <a href="/tags/{{ . | urlize }}">{{ . }}</a>
                {{ end }}
            {{ else }}
                <!-- 기타 메타데이터 -->
                {{ $value }}
            {{ end }}
        </div>
    {{ end }}
{{ end }}
```

#### 특징
- Frontmatter 메타데이터 동적 렌더링
- 특정 키 필터링 (내부 사용 키 제외)
- 태그는 링크로, 나머지는 텍스트로 표시
- `reflect.IsSlice`로 배열 타입 처리

### 3. Links 패널

```html
<div class="text-sm text-slate-600 dark:text-neutral-300">
    참조된 링크, 참조하는 링크 (구현 예정)
</div>
```

- 백링크 시스템 자리 표시자
- 향후 Hugo 데이터 파일 또는 JavaScript로 구현 가능

## 조건부 렌더링

```go
{{ if eq .Kind "page" }}
    <!-- 우측 사이드바 렌더링 -->
{{ end }}
```

- `page` Kind에서만 렌더링
- 리스트 페이지, 홈, taxonomy에서는 비활성화
- 불필요한 DOM 로드 방지

## 스크롤 관리

### 레이어별 스크롤 전략

```css
/* 최상위 컨테이너: 스크롤 없음 */
#right-sidebar-container {
    overflow: hidden;
}

/* 콘텐츠 래퍼: 수평 스크롤 방지, 수직 숨김 */
.flex-grow {
    overflow-hidden;
}

/* 슬라이드 트랙: 스크롤 없음 (transform 이동) */
#right-sidebar-track {
    /* overflow 명시 안 함, 부모 hidden 상속 */
}

/* 개별 패널: 독립적 수직 스크롤 */
.right-tab-content {
    overflow-y: auto;
    overflow-x: hidden;
}
```

- 3단계 중첩 overflow 제어
- 각 패널이 독립적인 스크롤 컨텍스트 생성
- 부모 레벨에서 수평 스크롤 완전 차단

## 성능 최적화

### 1. GPU 가속

```javascript
track.style.transform = `translateX(-${tabIndex * 100}%)`;
```

- `transform` 속성 사용 → Composite 레이어 생성
- Reflow/Repaint 없이 GPU에서 처리
- 60fps 애니메이션 보장

### 2. 이벤트 전파 제어

```javascript
rightSidebarToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    // ...
});
```

- 버블링 방지로 불필요한 이벤트 핸들러 실행 차단
- 특히 메타데이터 패널의 태그 링크 클릭 시 중요

### 3. 조건부 스크립트 실행

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // DOM 완전히 로드된 후 실행
});
```

- HTML 파싱 완료 대기
- 렌더 블로킹 방지

## Z-Index 레이어링

```
z-20: main-content-wrapper (메인 콘텐츠)
z-30: left-nav-container (좌측 사이드바)
z-40: right-sidebar-container (우측 사이드바)
```

- 우측 사이드바가 최상위 레이어
- 모바일에서 좌측/우측 사이드바 동시 열림 시 우측이 위에 표시

## Sticky 포지셔닝 상세

### 데스크탑 Sticky 동작

```css
md:sticky
md:top-14  /* 헤더 높이만큼 오프셋 */
md:h-[calc(100vh-3.5rem)]  /* 뷰포트 높이 - 헤더 높이 */
```

- `top-14`: 헤더 아래 고정 (헤더 높이 3.5rem)
- 스크롤 시 헤더와 함께 고정 유지
- 높이 계산으로 뷰포트 넘침 방지

### Flow Layout 통합

- `md:w-0` → `md:w-80` 전환 시
- Flex 부모(`.flex .items-start`)가 자동 재계산
- 메인 콘텐츠 영역 자동 축소 (push 효과)

## 장점

1. **반응형 이중 모드**: 모바일 오버레이 + 데스크탑 push
2. **접근성**: ARIA 완전 구현
3. **성능**: Transform 기반 GPU 가속
4. **유지보수성**: Hugo 템플릿으로 콘텐츠 자동 생성
5. **확장성**: 패널 추가 시 `tabNameToIndex`만 수정

## 제약사항

1. **JavaScript 의존**: 좌측 사이드바와 달리 JS 필수
2. **고정 너비**: `w-80` 하드코딩
3. **패널 수 제한**: `translateX` 계산이 패널 수에 결합됨
4. **브레이크포인트 중복**: JS와 CSS에서 768px 중복 정의

## 확장 가능성

### 패널 추가

```javascript
// 1. HTML에 패널 추가
<div class="w-full flex-shrink-0">New Panel</div>

// 2. 탭 버튼 추가
<button id="tab-new">New</button>

// 3. 인덱스 맵 업데이트
const tabNameToIndex = {
    'tab-toc': 0,
    'tab-metadata': 1,
    'tab-links': 2,
    'tab-new': 3,  // 추가
};
```

### 너비 동적 조정

```javascript
// Tailwind config에서 커스텀 너비 정의
theme: {
  extend: {
    width: {
      'sidebar': '22rem',  // 352px
    }
  }
}

// 클래스 변경
rightSidebar.classList.toggle('md:w-sidebar');
```

## 결론

우측 사이드바는 반응형 레이아웃 전략, 탭 기반 UI 패턴, 접근성 표준을 통합한 복합 컴포넌트입니다. 모바일과 데스크탑에서 서로 다른 레이아웃 모드를 제공하면서도 내부 탭 전환은 일관된 transform 기반 애니메이션으로 구현합니다. Hugo 템플릿 시스템과의 긴밀한 통합으로 콘텐츠 메타데이터를 자동으로 렌더링하며, ARIA 속성을 통해 접근성을 보장합니다.
