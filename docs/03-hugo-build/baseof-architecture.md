# baseof.html 아키텍처 문서

## 1. 개요 및 목적

### 1.1 Hugo 템플릿 계층에서의 역할

`baseof.html`은 Hugo의 템플릿 조회 순서에서 기초가 되는 베이스 템플릿 역할을 합니다. 모든 페이지 타입이 상속받는 뼈대 HTML 구조를 정의하며, 사이트 전체에 걸쳐 DRY (Don't Repeat Yourself) 원칙을 구현합니다.

**템플릿 계층 구조:**
```
baseof.html (기본 레이어)
  ↓
home.html, page.html, section.html, taxonomy.html, term.html (콘텐츠 레이어)
  ↓
partials/*.html (재사용 가능한 컴포넌트)
```

이 아키텍처는 Hugo의 [Base Templates and Blocks](https://gohugo.io/templates/base/) 명세를 따르며, `baseof.html`이 `{{ block "main" . }}{{ end }}` 플레이스홀더를 제공하면 자식 템플릿들이 각자의 특정 콘텐츠 구현으로 이를 재정의합니다.

### 1.2 문서 목표

이 문서는 다음을 제공합니다:

1. **구조 분석**: 3단 반응형 레이아웃 아키텍처의 완전한 분석
2. **반응형 전략**: CSS 전용 토글 메커니즘과 중단점 전환
3. **Partial 의존성**: 컴포넌트 간 호출 트리와 데이터 흐름
4. **구현 세부사항**: TailwindCSS 유틸리티 패턴과 커스텀 설정
5. **확장 가이드라인**: 기존 아키텍처를 수정하거나 확장하는 방법

**대상 독자**: Hugo 템플릿, HTML5 시맨틱, 모던 CSS(Flexbox/Grid)에 익숙한 프론트엔드 개발자.

**전제 조건**:
- Hugo 템플릿 문법 이해 (`{{ }}`, `.`, context)
- TailwindCSS 유틸리티 클래스에 대한 친숙함
- 반응형 웹 디자인 패턴에 대한 기본 지식
- 시맨틱 HTML 및 접근성 표준에 대한 경험

### 1.3 아키텍처 철학

이 디자인은 다음을 우선시합니다:

- **성능**: 최소한의 JavaScript, 가능한 곳에서는 CSS 전용 상호작용
- **접근성**: ARIA 속성, 시맨틱 HTML, 키보드 탐색
- **유지보수성**: Partial을 통한 명확한 관심사 분리
- **반응성**: 점진적 향상을 동반한 모바일 우선 접근법

---

## 2. 전체 구조 분석

### 2.1 DOCTYPE 및 HTML 루트 설정

```html
<!DOCTYPE html>
<html lang="ko" class="">
```

**핵심 사항**:
- `lang="ko"`: 스크린 리더와 검색 엔진을 위해 한국어를 기본 언어로 설정
- 빈 `class=""`: JavaScript를 통한 런타임 다크 모드 클래스 주입을 위한 플레이스홀더
- 클래스 속성은 `head/dark.html`에 의해 동적으로 수정되어 `dark` 클래스를 추가/제거

**다크 모드 클래스 주입**:
`head/dark.html`의 JavaScript는 `localStorage.theme`과 `prefers-color-scheme`을 확인하여 초기 상태를 결정합니다:
```javascript
if (localStorage.theme === 'dark' || 
    (!('theme' in localStorage) && 
     window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
}
```

### 2.2 HEAD 섹션 아키텍처

#### 2.2.1 Meta Viewport 설정

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
```

표준 반응형 메타 설정입니다. `width=device-width`는 모바일 기기에서 적절한 스케일링을 보장하고, `initial-scale=1.0`은 iOS에서 방향 전환 시 줌을 방지합니다.

#### 2.2.2 Partial 로딩 순서

Partial들은 적절한 의존성 해결을 보장하기 위해 특정 순서로 로드됩니다:

```html
{{- partial "head/meta.html" . -}}
{{- partial "head/library.html" . -}}
{{- partial "head/font.html" . -}}
{{- partial "head/dark.html" . -}}
```

**1. head/meta.html - SEO 및 소셜 메타데이터**

처리 항목:
- Google Site Verification
- 동적 타이틀 생성 (홈 vs. 페이지)
- `.Description`, `.Summary` 또는 사이트 params로부터 메타 설명 생성
- Frontmatter `noindex` 파라미터를 기반으로 한 Robots 지시문
- Canonical URL
- Open Graph 태그 (og:title, og:description, og:url, og:type, og:image)
- Twitter Card 메타데이터

타이틀 로직 예시:
```go
{{ if .IsHome }}
<title>{{ $siteTitle }} | {{ .Site.Params.description }}</title>
{{ else }}
<title>{{ $title }} | {{ $siteTitle }}</title>
{{ end }}
```

**2. head/library.html - 외부 의존성**

로드 항목:
- **TailwindCSS CDN**: `https://cdn.tailwindcss.com?plugins=forms,typography`
- **커스텀 Tailwind 설정**: 커스텀 색상을 정의하는 인라인 스크립트
- **KaTeX**: 수학 렌더링 라이브러리 (페이지 타입에 따라 조건부)

TailwindCSS config 확장:
```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: {
                    blue: { light: "#00ccdd" }
                }
            }
        }
    },
    darkMode: "class"
};
```

헤딩 스크롤 오프셋을 위한 커스텀 유틸리티:
```css
@layer utilities {
  h1[id], h2[id], h3[id], h4[id], h5[id], h6[id] {
    scroll-margin-top: 4rem;
  }
}
```

이를 통해 앵커 링크가 고정된 헤더 뒤에 숨겨지지 않도록 합니다 (높이: 3.5rem + 여백).

**KaTeX 로딩 전략**:
`{{ if eq .Kind "page" }}`일 때만 로드됩니다:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.js"></script>
<script defer src=".../auto-render.min.js" 
    onload="renderMathInElement(document.getElementById('markdown-content'), {...});">
</script>
```

자동 렌더링은 TOC나 메타데이터 처리를 피하기 위해 `#markdown-content`만을 대상으로 합니다.

**3. head/font.html - 웹 폰트 로딩**

구현 세부사항은 폰트 제공자(Google Fonts, 로컬 등)에 따라 다릅니다. 일반적으로 포함하는 것:
- 성능을 위한 Preconnect 힌트
- Font-face 선언 또는 link 태그

**4. head/dark.html - 테마 초기화**

FOUC(Flash of Unstyled Content)를 방지하기 위해 body 렌더링 전에 실행되어야 하는 중요한 인라인 스크립트:
```javascript
if (localStorage.theme === 'dark' || 
    (!('theme' in localStorage) && 
     window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
} else {
    document.documentElement.classList.remove('dark')
}
```

추가로 포함하는 것:
- 테마 토글 버튼 이벤트 핸들러
- 테마 인디케이터 업데이트 (light/dark/system)
- localStorage 영속성 로직

### 2.3 BODY 구조 개요

```html
<body class="bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-300 
             overflow-x-hidden antialiased break-words">
    <div id="root-container" class="relative min-h-screen break-words">
        <!-- Left Navigation + Main Content + Right Sidebar -->
    </div>
</body>
```

**Body 클래스 분석**:
- `bg-white dark:bg-neutral-900`: 다크 모드에 따라 배경색 전환
- `text-neutral-800 dark:text-neutral-300`: 다크 모드 변형이 있는 기본 텍스트 색상
- `overflow-x-hidden`: 슬라이드 애니메이션 중 수평 스크롤 방지
- `antialiased`: 더 나은 가독성을 위한 폰트 스무딩
- `break-words`: 긴 URL이나 코드가 레이아웃을 깨뜨리는 것을 방지

**루트 컨테이너**:
- `relative`: fixed/absolute 자식 요소를 위한 포지셔닝 컨텍스트 설정
- `min-h-screen`: 짧은 페이지에서 footer가 하단에 유지되도록 보장
- `break-words`: 오버플로우 보호 상속

---

## 3. 반응형 디자인 전략

### 3.1 CSS 전용 토글 메커니즘

왼쪽 네비게이션은 JavaScript 없이 순수 CSS 토글 패턴을 사용합니다:

```html
<input type="checkbox" id="leftNavToggleCheckbox" class="hidden peer">
```

**Peer 패턴 설명**:

Tailwind의 `peer` 유틸리티는 체크박스와 형제 요소 간의 관계를 생성합니다. 체크박스가 체크되면, `peer-checked:*` 클래스를 가진 형제 요소들이 반응합니다:

```html
<!-- Checkbox (보이지 않는 컨트롤러) -->
<input type="checkbox" id="leftNavToggleCheckbox" class="hidden peer">

<!-- Left nav가 peer 상태에 반응 -->
<nav class="-translate-x-full peer-checked:translate-x-0">...</nav>

<!-- Main content가 peer 상태에 반응 -->
<div class="peer-checked:translate-x-[calc(100svw-4rem)]">...</div>
```

**상태 전환**:

| 체크박스 상태 | Left Nav Transform | Main Content Transform |
|---------------|-------------------|------------------------|
| 체크 안됨 | `translateX(-100%)` | `translateX(0)` |
| 체크됨 | `translateX(0)` | `translateX(calc(100svw-4rem))` |

메인 콘텐츠는 nav 너비(`100svw - 4rem`)만큼 오른쪽으로 슬라이드하여 오버레이가 아닌 푸시 효과를 생성합니다.

**왜 CSS 전용인가?**:
1. JavaScript 의존성 제로
2. 즉각적인 반응 (이벤트 핸들러 지연 없음)
3. JS 로드 실패 시에도 작동
4. 더 간단한 상태 관리
5. 더 나은 성능 (GPU 가속 transform)

### 3.2 반응형 중단점 전략

레이아웃은 세 가지 뷰포트 카테고리에 걸쳐 적응합니다:

**모바일 (< 768px)**:
- Left nav: Fixed 오버레이 (`-translate-x-full` → `translate-x-0`)
- Main content: nav 열릴 때 오른쪽으로 슬라이드
- Right sidebar: 오른쪽 가장자리에서 Fixed 오버레이
- Grid 컬럼: 단일 컬럼 (`grid-cols-1`)

**태블릿 (768px - 1024px)**:
- Left nav: 모바일과 동일
- Main content: 2단 그리드 (`md:grid-cols-2`)
- Right sidebar: fixed에서 sticky로 전환
- Header 아이콘: 더 많은 간격 (`md:gap-2`)

**데스크톱 (>= 1024px)**:
- Left nav: 동일한 토글 동작 (열린 상태를 유지하도록 향상 가능)
- Main content: 3-4단 그리드 (`lg:grid-cols-3 2xl:grid-cols-4`)
- Right sidebar: 동적 너비를 가진 Sticky 사이드바 (`md:w-0` → `md:w-80`)
- 완전한 3단 레이아웃 가능

**중단점 변수**:
```
sm:  640px  (거의 사용 안 함)
md:  768px  (주요 모바일/태블릿 분기점)
lg:  1024px (태블릿/데스크톱 분기점)
xl:  1280px (거의 사용 안 함)
2xl: 1536px (초광폭 그리드 컬럼)
```

### 3.3 Right Sidebar 반응형 복잡성

오른쪽 사이드바는 가장 복잡한 반응형 동작을 가집니다:

```html
<aside class="fixed top-14 right-0 z-40 h-[calc(100vh-3.5rem)] 
              translate-x-full
              md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:w-0 
              md:translate-x-0 md:bg-transparent md:border-none">
```

**모바일 동작** (기본값, 접두사 없음):
- `fixed top-14 right-0`: 우상단 코너에 고정
- `translate-x-full`: 오른쪽 화면 밖에 숨김
- `bg-white dark:bg-neutral-900`: 단색 배경
- `border-l`: 시각적 구분을 위한 왼쪽 테두리

**태블릿/데스크톱 동작** (`md:` 접두사):
- `md:sticky md:top-14`: fixed에서 sticky로 변경 (콘텐츠와 함께 스크롤)
- `md:w-0`: 기본적으로 접힘 (너비 0)
- `md:translate-x-0`: 변환 불필요 (인라인)
- `md:bg-transparent md:border-none`: 접혔을 때 투명

**JavaScript 토글 향상**:

기본 포지셔닝은 CSS이지만, 너비 토글은 JS를 사용합니다:

```javascript
rightSidebarToggle.addEventListener('click', (e) => {
    if (isTabletOrLarger()) {
        // 데스크톱: 너비 토글 (푸시 효과)
        rightSidebar.classList.toggle('md:w-80');
    } else {
        // 모바일: transform 토글 (오버레이 효과)
        rightSidebar.classList.toggle('translate-x-full');
    }
});
```

**상태 머신**:

```
모바일:
  닫힘: translate-x-full (오른쪽 화면 밖)
  열림: translate-x-0 (오버레이)

데스크톱:
  닫힘: md:w-0 (접힘)
  열림: md:w-80 (확장, 메인 콘텐츠 밀어냄)
```

---

## 4. Left Navigation 아키텍처

### 4.1 컨테이너 구조

```html
<nav id="left-nav-container"
    class="fixed top-0 left-0 h-screen z-30 
           bg-white dark:bg-neutral-900 
           border-r border-neutral-200 dark:border-neutral-800 
           transition-transform duration-300 ease-in-out 
           w-[calc(100svw-4rem)] 
           -translate-x-full peer-checked:translate-x-0 
           overflow-y-hidden">
    {{ partial "left-nav.html" . }}
</nav>
```

**포지셔닝 & Z-Index**:
- `fixed top-0 left-0`: 뷰포트 좌상단에 고정
- `h-screen`: 전체 뷰포트 높이
- `z-30`: 메인 콘텐츠(z-20) 위이지만 모달 오버레이(z-50) 아래

**너비 계산**:
- `w-[calc(100svw-4rem)]`: 100% 뷰포트 너비에서 4rem (64px) 제외
- 토글 레이블을 위한 64px 스트립을 남김
- `svw` (small viewport width) 사용으로 모바일 브라우저 크롬 고려

**Transform & 애니메이션**:
- `translate-transform duration-300 ease-in-out`: 부드러운 슬라이드 애니메이션
- `-translate-x-full`: 초기 상태 (왼쪽에 숨김)
- `peer-checked:translate-x-0`: 체크박스 상태에 반응

**오버플로우 전략**:
- `overflow-y-hidden`: 컨테이너의 스크롤바 방지
- 자식 요소들이 각자의 스크롤 처리 (`left-nav.html` 구조 참조)

### 4.2 내부 Partial 구성

`left-nav.html` partial은 유연한 3단 레이아웃을 생성합니다:

```html
<div class="flex flex-col md:flex-row h-full overflow-x-hidden">
    
    <!-- Column 1: Search (고정 너비) -->
    <div class="md:w-1/2 lg:w-1/3 flex-shrink-0 
                border-r border-neutral-200 dark:border-neutral-800">
        {{ partial "left-nav/search.html" . }}
    </div>

    <!-- Column 2 & 3: 콘텐츠 그룹 -->
    <div class="flex-grow flex overflow-y-auto">
        <div class="flex flex-col lg:flex-row w-full">
            
            <!-- Column 2: Trees -->
            <div class="w-full lg:w-1/2 flex-shrink-0 
                        lg:border-r lg:border-neutral-200 
                        lg:dark:border-neutral-800 md:overflow-y-auto">
                {{ partial "left-nav/file-tree.html" . }}
                {{ partial "left-nav/tag-tree.html" . }}
            </div>
            
            <!-- Column 3: 최근 문서 -->
            <div class="w-full lg:w-1/2 flex-shrink-0 md:overflow-y-auto">
                {{ partial "left-nav/recent-modified.html" . }}
                {{ partial "left-nav/recent-created.html" . }}
            </div>
            
        </div>
    </div>
</div>
```

**레이아웃 분석**:

1. **검색 컬럼** (데스크톱에서 1/3):
   - `md:w-1/2 lg:w-1/3`: 반응형 너비
   - `flex-shrink-0`: 압축 방지
   - 시각적 구분을 위한 오른쪽 테두리

2. **콘텐츠 래퍼** (데스크톱에서 2/3):
   - `flex-grow`: 남은 공간 차지
   - `overflow-y-auto`: 독립적인 스크롤 활성화

3. **트리 컬럼** (콘텐츠 영역의 1/2):
   - 파일 트리 (재귀적 디렉토리 구조)
   - 태그 트리 (분류 체계 계층)
   - 수직 공간 공유

4. **최근 문서 컬럼** (콘텐츠 영역의 1/2):
   - 최근 수정된 문서
   - 최근 생성된 문서
   - 수직으로 스택

**반응형 동작**:

```
모바일 (< 768px):
  ┌─────────────┐
  │   Search    │
  ├─────────────┤
  │    Trees    │
  ├─────────────┤
  │   Recent    │
  └─────────────┘

데스크톱 (>= 1024px):
  ┌──────┬──────┬──────┐
  │Search│Trees │Recent│
  │      │      │      │
  └──────┴──────┴──────┘
```

### 4.3 Partial 컴포넌트 세부사항

#### 4.3.1 search.html - 검색 인터페이스

클라이언트 측 검색 기능을 제공합니다. 구현 세부사항은 다양하지만 일반적으로 다음을 포함합니다:
- 키보드 단축키가 있는 입력 필드
- 페이지 인덱스의 실시간 필터링
- 결과 하이라이팅 및 네비게이션

#### 4.3.2 file-tree.html - 재귀적 디렉토리 구조

```html
<details class="group space-y-2 m-3">
    <summary class="flex items-center justify-between w-full p-2 
                    hover:bg-neutral-100 dark:hover:bg-neutral-800 
                    rounded-md cursor-pointer list-none">
        <span class="flex items-center text-sm font-semibold">
            <span class="ln-file-tree-folder-icon mr-3">
                <span class="ln-icon w-5 h-5 block"></span>
            </span>
            <a href="{{ .Site.Home.Permalink }}" 
               onclick="event.stopPropagation();">폴더별</a>
        </span>
        <span class="ln-chevron-main w-4 h-4 block transform 
                     transition-transform duration-200 
                     group-open:rotate-180"></span>
    </summary>
    <div class="pl-6 mt-1">
        <ul id="ln-file-tree" class="space-y-1 list-none">
            {{ partial "left-nav/tree-view.html" 
               (dict "currentSection" .Site.Home "currentPage" .) }}
        </ul>
    </div>
</details>
```

**주요 기능**:
- 점진적 향상을 위한 네이티브 `<details>` 엘리먼트
- 쉐브론 회전을 위한 `group`과 `group-open:` 유틸리티
- 중첩된 디렉토리를 위한 `tree-view.html` 재귀 호출
- `onclick="event.stopPropagation()"`으로 링크 클릭 시 summary 토글 방지

**tree-view.html 재귀 패턴**:

```go
{{ range .currentSection.Sections }}
    <li>
        <details>
            <summary>{{ .Title }}</summary>
            {{ partial "left-nav/tree-view.html" 
               (dict "currentSection" . "currentPage" $.currentPage) }}
        </details>
    </li>
{{ end }}
{{ range .currentSection.RegularPages }}
    <li><a href="{{ .Permalink }}">{{ .Title }}</a></li>
{{ end }}
```

`dict`를 통한 컨텍스트 전달:
- `currentSection`: 트리 순회의 현재 노드
- `currentPage`: 원본 페이지 컨텍스트 (활성 페이지 하이라이팅용)

#### 4.3.3 tag-tree.html - 분류 체계 계층

파일 트리와 유사한 구조이지만 `.Site.Taxonomies.tags`를 순회합니다:

```go
{{ range $name, $taxonomy := .Site.Taxonomies.tags }}
    <li>
        <a href="{{ .Page.Permalink }}">
            {{ $name }} ({{ .Count }})
        </a>
    </li>
{{ end }}
```

문서 수와 함께 태그 이름을 표시합니다.

#### 4.3.4 recent-modified.html / recent-created.html

수정일 또는 생성일로 정렬된 최근 문서 목록:

```go
{{ range first 10 .Site.RegularPages.ByLastmod.Reverse }}
    <li>
        <a href="{{ .Permalink }}">{{ .Title }}</a>
        <span class="text-xs">{{ .Lastmod.Format "2006-01-02" }}</span>
    </li>
{{ end }}
```

**성능 고려사항**:
- `first 10`으로 결과를 제한하여 DOM 비대화 방지
- `.ByLastmod.Reverse`로 최신 순 정렬
- 날짜 포맷팅은 Go 시간 포맷 참조 사용 (2006-01-02)

---

## 5. Main Content Area 아키텍처

### 5.1 래퍼 구조 및 슬라이드 메커니즘

```html
<div id="main-content-wrapper"
    class="w-full flex flex-col relative 
           transition-transform duration-300 ease-in-out 
           min-w-0 
           peer-checked:translate-x-[calc(100svw-4rem)] 
           z-20">
    <!-- Header -->
    {{ partial "header.html" . }}
    
    <div class="flex flex-1 items-start">
        <!-- Main content and right sidebar -->
    </div>
</div>
```

**중요 클래스**:
- `w-full`: 기본적으로 전체 너비
- `flex flex-col`: 수직 스택 (헤더, 그 다음 콘텐츠)
- `relative`: absolute 자식을 위한 컨텍스트
- `min-w-0`: flex 아이템의 오버플로우 방지 (텍스트 truncation에 중요)
- `peer-checked:translate-x-[calc(100svw-4rem)]`: left nav 체크박스에 반응
- `z-20`: 배경 위에 있지만 left nav(z-30)과 right sidebar(z-40) 아래

**왜 min-w-0인가?**

Flexbox 아이템은 암묵적으로 `min-width: auto`를 가지며, 이는 콘텐츠 크기 이하로 축소되는 것을 방지합니다. 이는 텍스트 truncation(`text-ellipsis`)을 깨뜨립니다. `min-w-0` 설정으로 아이템이 축소될 수 있도록 하고 적절한 오버플로우 처리를 가능하게 합니다.

### 5.2 Header 구현

```html
<header id="header"
    class="w-full sticky top-0 z-50 
           bg-white/70 dark:bg-neutral-900/70 
           backdrop-blur-md backdrop-saturate-150 
           border-b border-neutral-200/50 dark:border-neutral-800/50 
           shadow-[0_2px_4px_rgba(0,0,0,.02),0_1px_0_rgba(0,0,0,.06)] 
           dark:shadow-[0_-1px_0_rgba(255,255,255,.1)_inset] 
           print:bg-white dark:print:bg-neutral-900 print:shadow-none">
```

**글래스모피즘 효과**:
- `bg-white/70`: 70% 불투명도의 흰색 배경
- `backdrop-blur-md`: 뒤의 콘텐츠 블러 처리 (16px 블러 반경)
- `backdrop-saturate-150`: 색상 채도 증가 (1.5배)
- 모던한 반투명 헤더 효과 생성

**레이어링**:
- `sticky top-0`: 스크롤 시 상단에 고정
- `z-50`: 모든 콘텐츠와 사이드바 위

**인쇄 최적화**:
- `print:bg-white`: 인쇄를 위한 단색 배경
- `print:shadow-none`: 잉크 절약을 위해 그림자 제거

#### 5.2.1 Header 레이아웃 구조

```html
<div class="flex items-center justify-between p-2 h-14">
    <!-- Left group -->
    <div class="flex items-center gap-2">
        <label for="leftNavToggleCheckbox">
            <!-- Hamburger icon -->
        </label>
        <a href="{{ .Site.BaseURL }}">{{ .Site.Title }}</a>
        <span>{{ .Kind }}</span>
        <!-- Development-only debug info -->
    </div>

    <!-- Right group -->
    <div class="flex items-center gap-1 md:gap-2">
        <!-- Content width slider (page only) -->
        <!-- Share button -->
        <!-- Right sidebar toggle (page only) -->
    </div>
</div>
```

**왼쪽 그룹 컴포넌트**:

1. **햄버거 메뉴 레이블**:
```html
<label for="leftNavToggleCheckbox" 
       aria-label="왼쪽 네비게이션 열기/닫기"
       class="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 
              cursor-pointer">
    <svg><!-- hamburger icon --></svg>
</label>
```
이 레이블 클릭 시 숨겨진 체크박스를 토글하여 peer 상태 변경을 트리거합니다.

2. **사이트 타이틀 링크**:
```html
<a href="{{ .Site.BaseURL }}"
   class="text-xl font-bold latin-font">
    {{ .Site.Title }}
</a>
```

3. **페이지 Kind 인디케이터**:
```html
<span class="text-sm text-neutral-600 dark:text-neutral-400">
    {{ .Kind }}
</span>
```
현재 페이지 타입 표시 (home, page, section, taxonomy, term).

4. **개발 디버그 정보** (조건부):
```html
{{- if eq hugo.Environment "development" }} 
    <span>| {{ .Type }}</span>
    <span>🔗 {{ .Site.BaseURL }}</span> 
    <span>⚙️ Hugo v{{ hugo.Version }} @ {{ now.Format "15:04:05" }}</span>
{{ end -}}
```

**오른쪽 그룹 컴포넌트**:

1. **콘텐츠 너비 슬라이더** (페이지 전용):
```html
{{ if eq .Kind "page" }}
<div class="hidden md:flex items-center p-2 rounded-md 
            hover:bg-neutral-100 dark:hover:bg-neutral-800">
    <input id="contentWidthSlider" type="range" 
           min="40" max="120" value="72" step="4"
           class="w-20 accent-neutral-900 dark:accent-neutral-100" 
           aria-label="본문 너비 조절" />
</div>
{{ end }}
```

Range 값은 `ch` 단위를 나타냅니다:
- 최소: 40ch (좁게, 집중용)
- 기본값: 72ch (최적 가독성)
- 최대: 120ch (넓게, 테이블/코드용)

`util/content_width.js`에 의해 제어됩니다:
```javascript
slider.addEventListener('input', (e) => {
    const value = e.target.value;
    document.getElementById('content').style.maxWidth = `${value}ch`;
});
```

2. **공유 버튼**:
```html
<button id="shareBtn" aria-label="페이지 공유">
    <svg><!-- share icon --></svg>
</button>
```

사용 가능 시 Web Share API 사용:
```javascript
shareBtn.addEventListener('click', async () => {
    if (navigator.share) {
        await navigator.share({
            title: document.title,
            url: window.location.href
        });
    } else {
        // 대체: 클립보드에 복사
        navigator.clipboard.writeText(window.location.href);
    }
});
```

3. **오른쪽 사이드바 토글** (페이지 전용):
```html
{{ if eq .Kind "page" }}
<button id="rightSidebarToggle" 
        aria-label="오른쪽 사이드바 열기/닫기">
    <svg><!-- three-dots icon --></svg>
</button>
{{ end }}
```

### 5.3 Main Block 및 Page Wrapper

```html
<div class="flex flex-1 items-start">
    <main class="flex-1 transition-all duration-300 ease-in-out 
                 min-w-0 break-words">
        <div id="page-wrapper" class="w-full pt-6 px-4 md:pt-8 md:px-8 
                                      break-words">
            {{ block "main" . }}{{ end }}
        </div>
    </main>
    
    <aside id="right-sidebar-container">
        {{ partial "right-sidebar.html" . }}
    </aside>
</div>
```

**Main 엘리먼트**:
- `flex-1`: 사용 가능한 모든 공간 차지
- `transition-all`: 오른쪽 사이드바 너비 변경에 부드럽게 적응
- `min-w-0`: 콘텐츠 축소 허용 (ellipsis 활성화)
- `break-words`: 긴 URL이나 코드의 오버플로우 방지

**Page Wrapper 패딩**:
- `pt-6 px-4`: 모바일 패딩 (상단 24px, 좌우 16px)
- `md:pt-8 md:px-8`: 데스크톱 패딩 (32px)

**Block 정의**:

```go
{{ block "main" . }}{{ end }}
```

이것은 자식 템플릿을 위한 확장 지점입니다. 각 페이지 타입(home, page, section 등)은 이 플레이스홀더를 대체하는 자체 `{{ define "main" }}...{{ end }}` 블록을 정의합니다.

**컨텍스트 전달**:
`.`는 현재 페이지 컨텍스트를 블록에 전달하여 다음에 대한 접근을 제공합니다:
- `.Title`, `.Content`, `.Params`
- `.Kind`, `.Type`
- `.Pages`, `.Ancestors`
- `.Site`를 통한 사이트 전체 변수

---

## 6. Right Sidebar 아키텍처

### 6.1 조건부 렌더링

```html
{{ if eq .Kind "page" }}
<div class="w-80 h-full flex flex-col">
    <!-- Tab navigation and panels -->
</div>
{{ end }}
```

전체 오른쪽 사이드바는 개별 페이지에만 렌더링되며, 목록 페이지(home, section, taxonomy, term)에는 렌더링되지 않습니다. 그 이유는:
- TOC (목차)는 마크다운 콘텐츠가 있는 페이지에만 존재
- 메타데이터는 개별 문서에 가장 관련성이 높음
- 목록 페이지는 카드 그리드를 위해 최대 너비가 필요

### 6.2 Tab Navigation 인터페이스

```html
<div role="tablist" aria-label="사이드바 컨텐츠" class="flex-shrink-0">
    <nav class="flex -mb-px" aria-label="Tabs">
        <button id="tab-toc" role="tab" 
                aria-selected="true" 
                aria-controls="panel-toc"
                class="right-tab-btn flex-1 py-3 px-1 text-center 
                       border-b-2 font-medium text-sm 
                       border-neutral-800 dark:border-neutral-100 
                       text-neutral-800 dark:text-neutral-100">
            Toc
        </button>
        <button id="tab-metadata" role="tab" 
                aria-selected="false" 
                aria-controls="panel-metadata" 
                tabindex="-1"
                class="right-tab-btn flex-1 py-3 px-1 text-center 
                       border-b-2 font-medium text-sm 
                       border-transparent text-slate-500">
            Metadata
        </button>
        <button id="tab-links" role="tab" 
                aria-selected="false" 
                aria-controls="panel-links" 
                tabindex="-1"
                class="right-tab-btn flex-1 py-3 px-1 text-center 
                       border-b-2 font-medium text-sm 
                       border-transparent text-slate-500">
            Links
        </button>
    </nav>
</div>
```

**접근성을 위한 ARIA 속성**:
- `role="tablist"`: 컨테이너를 탭 네비게이션으로 식별
- `role="tab"`: 각 버튼은 탭 컨트롤
- `aria-selected="true/false"`: 활성 탭 표시
- `aria-controls="panel-*"`: 탭을 해당 패널에 연결
- `tabindex="-1"`: 비활성 탭은 키보드 탭 순서에 없음 (사용자는 화살표 키로 탭 간 이동 가능)

**활성 vs 비활성 상태 클래스**:

활성:
```css
border-neutral-800 dark:border-neutral-100 
text-neutral-800 dark:text-neutral-100
```

비활성:
```css
border-transparent text-slate-500 
hover:text-slate-700 hover:border-slate-300
```

### 6.3 Panel 컨테이너 및 슬라이드 트랙

```html
<div class="flex-grow overflow-hidden mt-2 
            md:border-l md:border-neutral-200 
            dark:md:border-neutral-800 min-h-0">
    <div id="right-sidebar-track" 
         class="flex h-full transition-transform duration-300 ease-in-out">
        <!-- Panels stacked horizontally -->
    </div>
</div>
```

**컨테이너**:
- `flex-grow`: 남은 수직 공간 차지
- `overflow-hidden`: 화면 밖 패널 숨김
- `min-h-0`: flex 자식이 축소될 수 있도록 허용 (패널 스크롤 활성화)

**트랙**:
- `flex`: 패널이 수평으로 배치됨
- `h-full`: 컨테이너의 전체 높이
- `transition-transform`: 패널 간 부드러운 슬라이드

**슬라이드 메커니즘**:

패널은 100% 너비로 나란히 배치됩니다:
```
┌─────────┬─────────┬─────────┐
│   TOC   │Metadata │ Links   │
│ (표시됨)│ (숨김)  │ (숨김)  │
└─────────┴─────────┴─────────┘
```

JavaScript가 트랙을 변환하여 다른 패널을 표시합니다:
```javascript
track.style.transform = `translateX(-${tabIndex * 100}%)`;
```

탭 인덱스:
- TOC: 0 → `translateX(0%)`
- Metadata: 1 → `translateX(-100%)`
- Links: 2 → `translateX(-200%)`

### 6.4 Panel 구현

#### 6.4.1 TOC Panel

```html
<div id="panel-toc" role="tabpanel" 
     aria-labelledby="tab-toc" 
     tabindex="0"
     class="right-tab-content w-full flex-shrink-0 h-full 
            overflow-y-auto overflow-x-hidden px-2 py-4 text-sm">
    {{ .TableOfContents }}
</div>
```

**Hugo의 TableOfContents**:

마크다운 헤딩으로부터 자동 생성됩니다. `hugo.toml`에서 설정:
```toml
[markup]
  [markup.tableOfContents]
    startLevel = 2
    endLevel = 4
    ordered = false
```

중첩된 `<nav><ul><li>` 구조 생성:
```html
<nav id="TableOfContents">
  <ul>
    <li><a href="#heading-1">Heading 1</a>
      <ul>
        <li><a href="#heading-1-1">Heading 1.1</a></li>
      </ul>
    </li>
  </ul>
</nav>
```

`css/toc.css`를 통해 스타일링 (baseof.html에서 조건부로 로드됨).

#### 6.4.2 Metadata Panel

```html
<div id="panel-metadata" role="tabpanel" 
     aria-labelledby="tab-metadata" 
     tabindex="0"
     class="right-tab-content w-full flex-shrink-0 h-full 
            overflow-y-auto p-4 text-sm">
    <div class="space-y-4">
        {{ range $key, $value := .Params }}
        {{ if not (or (eq $key "iscjklanguage") 
                      (eq $key "draft") 
                      (eq $key "resource-path")) }}
            <div class="metadata-item">
                <div class="text-xs font-medium text-gray-500 
                            dark:text-gray-400 mb-1 capitalize">
                    {{ $key }}
                </div>
                {{ if eq $key "tags" }}
                    <div class="flex flex-wrap gap-2">
                        {{ range $value }}
                            <a href="/tags/{{ . | urlize }}" 
                               class="px-2 py-1 text-xs 
                                      bg-primary-blue-light/10 
                                      text-primary-blue-light 
                                      rounded hover:bg-primary-blue-light/20"
                               onclick="event.stopPropagation()">
                                {{ . }}
                            </a>
                        {{ end }}
                    </div>
                {{ else }}
                    <div class="text-sm text-gray-700 dark:text-gray-300">
                        {{ if reflect.IsSlice $value }}
                            {{ delimit $value ", " }}
                        {{ else }}
                            {{ $value }}
                        {{ end }}
                    </div>
                {{ end }}
            </div>
        {{ end }}
        {{ end }}
    </div>
</div>
```

**필터링 로직**:
내부 Hugo 파라미터 제외:
- `iscjklanguage`: 자동 감지된 CJK 언어 플래그
- `draft`: 초안 상태
- `resource-path`: 내부 리소스 위치

**태그 특별 처리**:
태그는 클릭 가능한 링크로 렌더링되며 커스텀 스타일링 적용 (`bg-primary-blue-light/10`으로 미묘한 하이라이트).

**타입 감지**:
`reflect.IsSlice`를 사용하여 값이 배열인지 판단:
```go
{{ if reflect.IsSlice $value }}
    {{ delimit $value ", " }}  // 쉼표로 배열 결합
{{ else }}
    {{ $value }}               // 있는 그대로 표시
{{ end }}
```

#### 6.4.3 Links Panel

```html
<div id="panel-links" role="tabpanel" 
     aria-labelledby="tab-links" 
     tabindex="0"
     class="right-tab-content w-full flex-shrink-0 h-full 
            overflow-y-auto p-4 text-sm">
    참조된 링크, 참조하는 링크 (구현 예정)
</div>
```

**계획된 구현**:
- **Outbound Links**: 현재 페이지에서 다른 페이지로의 링크
- **Backlinks**: 현재 페이지로 링크하는 페이지 (인덱스 구축 필요)
- **External Links**: 외부 도메인으로의 링크

잠재적 데이터 구조:
```go
{{ $currentPath := .RelPermalink }}
{{ range .Site.RegularPages }}
    {{ if in .RawContent $currentPath }}
        <!-- 이 페이지가 현재 페이지로 링크 (백링크) -->
    {{ end }}
{{ end }}
```

### 6.5 Tab 전환 JavaScript

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.right-tab-btn');
    const track = document.getElementById('right-sidebar-track');
    const tabNameToIndex = {
        'tab-toc': 0,
        'tab-metadata': 1,
        'tab-links': 2,
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 모든 탭에서 활성 상태 제거
            tabs.forEach(t => {
                t.setAttribute('aria-selected', 'false');
                t.classList.remove('border-neutral-800', 
                                   'dark:border-neutral-100', 
                                   'text-neutral-800', 
                                   'dark:text-neutral-100');
                t.classList.add('border-transparent', 
                                'text-slate-500', 
                                'hover:text-slate-700', 
                                'hover:border-slate-300');
            });

            // 클릭된 탭에 활성 상태 추가
            tab.setAttribute('aria-selected', 'true');
            tab.classList.add('border-neutral-800', 
                              'dark:border-neutral-100', 
                              'text-neutral-800', 
                              'dark:text-neutral-100');
            tab.classList.remove('border-transparent', 
                                 'text-slate-500', 
                                 'hover:text-slate-700', 
                                 'hover:border-slate-300');

            // 해당 패널로 트랙 슬라이드
            const tabIndex = tabNameToIndex[tab.id];
            if (tabIndex !== undefined) {
                track.style.transform = `translateX(-${tabIndex * 100}%)`;
            }
        });
    });
});
```

**상태 관리**:
1. 클릭 핸들러가 모든 탭에서 활성 클래스 제거
2. 클릭된 탭에 활성 클래스 추가
3. 스크린 리더를 위한 ARIA 속성 업데이트
4. 탭 인덱스를 기반으로 translateX 계산

**CSS 클래스 토글 패턴**:
개별 클래스를 토글하는 대신 모든 가능한 상태를 제거한 후 원하는 상태를 추가합니다. 이는 상태 동기화 문제를 방지합니다.

---

## 7. Footer 및 스크립트 로딩

### 7.1 JavaScript 로딩 전략

```html
<script src="{{ .Site.BaseURL }}js/main.js" defer></script>
<script src="{{ .Site.BaseURL }}js/util/content_width.js" defer></script>
<script src="{{ .Site.BaseURL }}js/left-nav.js" defer></script>
```

**Defer 속성**:
- 스크립트가 HTML 파싱과 병렬로 다운로드
- DOM이 완전히 파싱된 후 실행
- 실행 순서 유지 (main.js → content_width.js → left-nav.js)
- 논블로킹 (페이지 렌더링 지연 없음)

**vs Async**:
`async`는 다운로드되는 즉시 실행되어 순서가 맞지 않을 수 있습니다. `defer`는 다음을 보장합니다:
1. 실행 전에 DOM 준비 완료
2. 소스 순서대로 스크립트 실행
3. 모든 지연된 스크립트 후 DOMContentLoaded 발생

**파일 역할**:

1. **main.js**: 전역 유틸리티
   - 테마 토글 로직
   - 공유 버튼 핸들러
   - 공통 이벤트 리스너

2. **util/content_width.js**: 콘텐츠 너비 슬라이더
   - Range 입력 이벤트 리스너
   - `#content` 요소에 너비 적용
   - localStorage에 선호도 저장

3. **left-nav.js**: 왼쪽 네비게이션 상호작용
   - 트리 확장/축소
   - 검색 필터링
   - 스크롤 위치 영속성

### 7.2 조건부 CSS 로딩

```html
{{ if eq .Kind "page" }}
{{/*  우측 toc 의 스타일  */}}
<link rel="stylesheet" href="{{ .Site.BaseURL }}css/toc.css">
<link rel="stylesheet" href="{{ .Site.BaseURL }}css/prose.css">
{{ end }}
```

**왜 조건부인가?**
- `toc.css`: 목차용 스타일 (오른쪽 사이드바에만, 페이지에만)
- `prose.css`: 마크다운 콘텐츠용 타이포그래피 스타일 (목록 페이지에는 prose 콘텐츠 없음)

**성능 영향**:
- 목록 페이지에서 CSS 페이로드 ~10-15KB 감소
- 스타일이 적을수록 CSS 파싱과 레이아웃 계산이 빠름
- 모바일 성능에 중요

**대안 접근법**:
CSS-in-JS나 인라인 크리티컬 스타일을 사용할 수 있지만, 별도 파일은 다음을 가능하게 합니다:
- 더 나은 캐싱
- 더 쉬운 유지보수
- 명확한 관심사 분리

---

## 8. 템플릿 Partial 호출 트리

데이터 흐름을 보여주는 완전한 의존성 그래프:

```
baseof.html
│
├── head/
│   ├── meta.html
│   │   ├── 읽기: .Title, .Description, .Summary, .Site.Title
│   │   ├── 읽기: .Params.noindex, .Params.image
│   │   └── 출력: <meta> 태그, <title>, <link rel="canonical">
│   │
│   ├── library.html
│   │   ├── 출력: TailwindCSS CDN <script>
│   │   ├── 출력: Tailwind config (colors, darkMode)
│   │   ├── 조건부: .Kind == "page"일 때 KaTeX 라이브러리
│   │   └── 출력: 커스텀 @layer utilities CSS
│   │
│   ├── font.html
│   │   └── 출력: 웹 폰트 <link> 또는 @font-face
│   │
│   └── dark.html
│       ├── 출력: 테마 초기화 인라인 <script>
│       └── DOMContentLoaded: 테마 토글 핸들러
│
├── header.html
│   ├── 읽기: .Site.BaseURL, .Site.Title, .Kind, .Type
│   ├── 조건부: hugo.Environment == "development"
│   ├── 조건부: .Kind == "page" (너비 슬라이더, 공유, 사이드바 토글)
│   └── 출력: 햄버거, 타이틀, 디버그 정보, 컨트롤
│
├── left-nav.html
│   ├── 구조: 3단 flex 레이아웃
│   │
│   ├── left-nav/search.html
│   │   ├── 읽기: .Site.RegularPages (검색 인덱스용)
│   │   └── 출력: 검색 입력과 결과 컨테이너
│   │
│   ├── left-nav/file-tree.html
│   │   ├── 호출: left-nav/tree-view.html (재귀)
│   │   │   ├── 읽기: .currentSection.Sections
│   │   │   ├── 읽기: .currentSection.RegularPages
│   │   │   └── 재귀적으로 자신을 호출
│   │   └── 출력: <details> 트리 구조
│   │
│   ├── left-nav/tag-tree.html
│   │   ├── 읽기: .Site.Taxonomies.tags
│   │   └── 출력: 카운트가 포함된 태그 목록
│   │
│   ├── left-nav/recent-modified.html
│   │   ├── 읽기: .Site.RegularPages.ByLastmod.Reverse | first 10
│   │   └── 출력: 최근 수정된 페이지 목록
│   │
│   └── left-nav/recent-created.html
│       ├── 읽기: .Site.RegularPages.ByDate.Reverse | first 10
│       └── 출력: 최근 생성된 페이지 목록
│
├── {{ block "main" . }}
│   │
│   ├── home.html ("main" 정의)
│   │   ├── 읽기: .Pages.ByLastmod.Reverse
│   │   ├── 로직: .Kind == "section" vs page 별도 렌더링
│   │   ├── 호출: footer.html
│   │   └── 출력: Breadcrumb, 타이틀, 카드 그리드, footer
│   │
│   ├── page.html ("main" 정의)
│   │   ├── 읽기: .Ancestors.Reverse, .Title, .Content
│   │   ├── 호출: footer.html
│   │   ├── 호출: comment.html
│   │   └── 출력: Breadcrumb, 타이틀, prose 콘텐츠, 댓글, footer
│   │
│   ├── section.html ("main" 정의)
│   │   ├── 읽기: .Pages.ByLastmod.Reverse
│   │   ├── 로직: home.html과 유사하나 breadcrumb 포함
│   │   ├── 호출: footer.html
│   │   └── 출력: Breadcrumb, 타이틀, 카드 그리드, footer
│   │
│   ├── taxonomy.html ("main" 정의)
│   │   ├── 읽기: .Data.Terms.ByCount
│   │   ├── 호출: footer.html
│   │   └── 출력: Breadcrumb, 타이틀, 태그 클라우드, footer
│   │
│   └── term.html ("main" 정의)
│       ├── 읽기: .Pages (분류 용어로 필터링됨)
│       ├── 호출: footer.html
│       └── 출력: Breadcrumb, 타이틀, 필터링된 페이지 그리드, footer
│
├── right-sidebar.html
│   ├── 조건부: if .Kind == "page"
│   ├── Panel 1: {{ .TableOfContents }}
│   ├── Panel 2: range .Params (메타데이터)
│   ├── Panel 3: Links (플레이스홀더)
│   └── 인라인 <script>: 탭 전환 + 사이드바 토글 로직
│
└── Scripts (지연 로드)
    ├── js/main.js
    ├── js/util/content_width.js
    └── js/left-nav.js
```

**컨텍스트 흐름**:

`.` (점)은 현재 페이지 컨텍스트를 나타내며 전체 템플릿 계층을 통해 흐릅니다:

1. Hugo가 다음 속성을 가진 페이지 객체 생성:
   - `.Title`, `.Content`, `.Summary`
   - `.Kind`, `.Type`
   - `.Params` (frontmatter)
   - `.Pages`, `.Ancestors`
   - `.Site` (전역 사이트 설정)

2. `baseof.html`이 컨텍스트 받음

3. Partial들이 `{{ partial "name.html" . }}`를 통해 컨텍스트 받음

4. Block 정의가 자식 템플릿으로 컨텍스트 전달

5. 자식 템플릿은 `dict`로 새 컨텍스트 생성 가능:
   ```go
   {{ partial "tree-view.html" (dict "currentSection" . "currentPage" .) }}
   ```

---

## 9. 자식 템플릿 구현

### 9.1 home.html

섹션과 페이지의 그리드로 사이트 홈페이지를 렌더링합니다.

**구조**:
```
1. Breadcrumb ("Home" 표시)
2. Header (사이트 타이틀)
3. Content (카드 그리드)
4. Footer
```

**그리드 설정**:
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
```

중단점 진행:
- 모바일: 1 컬럼
- 태블릿: 2 컬럼 (768px+)
- 데스크톱: 3 컬럼 (1024px+)
- 광폭: 4 컬럼 (1536px+)

**섹션 vs 페이지 렌더링**:

```go
{{ range .Pages.ByLastmod.Reverse }}
    {{ if eq .Kind "section" }}
        <!-- 폴더 카드 렌더링 -->
    {{ else }}
        <!-- 페이지 카드 렌더링 -->
    {{ end }}
{{ end }}
```

**섹션 (폴더) 카드**:

```html
<a href="{{ .Permalink }}" 
   class="flex flex-col p-6 
          border-2 border-neutral-300 dark:border-neutral-700 
          rounded-lg transition-all duration-300 
          hover:shadow-xl hover:border-primary-blue-light 
          bg-neutral-50 dark:bg-neutral-800/50">
    
    <!-- 폴더 아이콘 + 타이틀 -->
    <div class="flex items-center mb-3">
        <svg class="h-6 w-6 mr-2 text-primary-blue-light">
            <!-- folder icon -->
        </svg>
        <h2 class="text-xl font-bold">{{ .Title }}</h2>
    </div>
    
    <!-- 최근 업데이트 (처음 3개 페이지) -->
    <div class="flex-grow">
        {{ with (first 3 .Pages.ByLastmod.Reverse) }}
            {{ range . }}
                <div class="mb-2 text-sm">
                    <svg><!-- file icon --></svg>
                    <span>{{ .Title | truncate 40 }}</span>
                    <span>{{ .Lastmod.Format "2006-01-02 15:04" }}</span>
                </div>
            {{ end }}
        {{ end }}
    </div>
    
    <!-- 폴더/파일 개수 -->
    <div class="mt-auto pt-3 border-t">
        {{ $sections := 0 }}
        {{ $pages := 0 }}
        {{ range .Pages }}
            {{ if eq .Kind "section" }}
                {{ $sections = add $sections 1 }}
            {{ else }}
                {{ $pages = add $pages 1 }}
            {{ end }}
        {{ end }}
        
        {{ if gt $sections 0 }}
            <span>📁 {{ $sections }}개</span>
        {{ end }}
        {{ if gt $pages 0 }}
            <span>📄 {{ $pages }}개</span>
        {{ end }}
        {{ if and (eq $sections 0) (eq $pages 0) }}
            <span>빈 폴더</span>
        {{ end }}
    </div>
</a>
```

**주요 기능**:
- `flex flex-col`: 수직 레이아웃
- 최근 업데이트에 `flex-grow`: 카운트를 하단으로 밀어냄
- `mt-auto`: 콘텐츠 높이와 상관없이 카운트를 항상 하단에
- 페이지와 구별하기 위한 더 두꺼운 테두리 (`border-2`)

**페이지 (파일) 카드**:

```html
<div class="flex flex-col p-6 
            border border-neutral-200 dark:border-neutral-800 
            rounded-lg transition-all duration-300 
            hover:shadow-xl hover:border-primary-blue-light">
    
    <a href="{{ .Permalink }}" class="flex-grow">
        <!-- 파일 아이콘 + 타이틀 -->
        <div class="flex items-center mb-3">
            <svg class="h-6 w-6 mr-2 text-primary-blue-light">
                <!-- file icon -->
            </svg>
            <h2 class="text-xl font-bold">{{ .Title }}</h2>
        </div>
        
        <!-- 요약 -->
        <p class="text-sm mb-3">
            {{ .Summary | plainify | truncate 150 }}
        </p>
    </a>
    
    <div class="mt-auto pt-3 border-t">
        <!-- 태그 -->
        {{ if .Params.tags }}
            <div class="flex flex-wrap gap-2 mb-3">
                {{ range .Params.tags }}
                    <a href="/tags/{{ . | urlize }}" 
                       class="px-2 py-1 text-xs bg-neutral-100 
                              rounded hover:bg-neutral-200"
                       onclick="event.stopPropagation()">
                        {{ . }}
                    </a>
                {{ end }}
            </div>
        {{ end }}
        
        <!-- 메타데이터: 날짜, 수정일, 단어 수 -->
        <div class="text-xs text-neutral-500 flex items-center gap-4">
            {{ if .Date }}
                <span>📅 {{ .Date.Format "2006-01-02 15:04" }}</span>
            {{ end }}
            {{ if .Lastmod }}
                <span>🕐 {{ .Lastmod.Format "2006-01-02 15:04" }}</span>
            {{ end }}
            {{ if .WordCount }}
                <span>{{ .WordCount }} Word</span>
            {{ end }}
        </div>
    </div>
</div>
```

**섹션 카드와의 주요 차이점**:
- 일반 테두리 (`border-2`가 아닌 `border`)
- 최근 페이지 대신 요약 텍스트
- 태그 표시
- 날짜/단어 수 메타데이터

**onclick="event.stopPropagation()"**:
태그 링크 클릭이 카드 링크를 트리거하는 것을 방지합니다. 이것이 없으면 태그 클릭 시 태그 페이지 대신 페이지로 이동합니다.

### 9.2 section.html

`home.html`과 거의 동일하지만 한 가지 주요 차이점이 있습니다:

**Breadcrumb Navigation**:

```html
<nav class="text-xs flex items-center gap-2">
    <a href="{{ .Page.Site.BaseURL }}">Home</a>
    {{ range .Ancestors.Reverse }}
        {{ if ne .Kind "home" }}
            <span>/</span>
            <a href="{{ .Permalink }}">{{ .Title }}</a>
        {{ end }}
    {{ end }}
    <span>/</span>
    <span class="font-semibold">
        <a href="{{ .Permalink }}">{{ .Title }}</a>
    </span>
</nav>
```

**Ancestors 순회**:
`.Ancestors`는 home까지의 모든 부모 섹션을 반환합니다. `.Reverse`는 올바른 순서(home → ... → parent → current)를 보장합니다.

`/content/docs/hugo/templates/page.md` 예시:
```
Home / docs / hugo / templates / page
```

### 9.3 page.html

개별 마크다운 콘텐츠 페이지를 렌더링합니다.

**구조**:
```
1. Breadcrumb
2. Title (가운데 정렬, 큰 크기)
3. Content (prose 스타일 마크다운)
4. Comments
5. Footer
```

**콘텐츠 컨테이너 너비**:

```html
<div id="content-container" class="w-full mx-auto">
    <div id="content" class="max-w-[72ch] mx-auto">
        <article id="main-content-container">
            <section id="markdown-content" 
                     class="prose prose-sm dark:prose-invert 
                            max-w-none break-words overflow-wrap-anywhere">
                {{ .Content }}
            </section>
        </article>
        
        {{ partial "comment.html" . }}
    </div>
</div>
```

**너비 전략**:
- `max-w-[72ch]`: 72자 너비 (가독성을 위한 최적의 줄 길이)
- `mx-auto`: 가운데 정렬
- `72ch`는 콘텐츠 너비 슬라이더를 통해 조절 가능 (40-120ch 범위)

**Prose 스타일링**:
- `prose`: TailwindCSS Typography 플러그인 기본 클래스
- `prose-sm`: 더 작은 텍스트 (기본 14px)
- `dark:prose-invert`: 다크 모드용 색상 반전
- `max-w-none`: prose의 기본 max-width 재정의
- `break-words overflow-wrap-anywhere`: 긴 URL/코드 처리

**댓글 통합**:

```html
{{ partial "comment.html" . }}
```

일반적인 구현:
- Disqus
- Utterances (GitHub issues)
- Giscus (GitHub discussions)
- 커스텀 솔루션

Partial 구조:
```html
{{ if not .Params.disable_comments }}
    <div id="comments" class="mt-12 pt-12 border-t">
        <!-- 댓글 시스템 임베드 코드 -->
    </div>
{{ end }}
```

### 9.4 taxonomy.html

분류의 모든 용어를 표시합니다 (예: 사용 가능한 모든 태그).

**콘텐츠 영역**:

```html
<div class="flex flex-wrap justify-center gap-3">
    {{ range .Data.Terms.ByCount }}
        <a href="{{ .Page.Permalink }}" 
           class="flex items-center bg-neutral-100 dark:bg-neutral-800 
                  rounded-full px-4 py-2 text-sm font-medium 
                  hover:bg-primary-blue-light/20">
            <span>{{ .Page.Title }}</span>
            <span class="ml-2 text-xs bg-white dark:bg-neutral-700 
                         rounded-full px-2 py-0.5">
                {{ .Count }}
            </span>
        </a>
    {{ end }}
</div>
```

**.Data.Terms**:
Hugo가 taxonomy 목록 페이지에 제공:
- `.Data.Plural`: "tags", "categories"
- `.Data.Singular`: "tag", "category"
- `.Data.Terms`: 용어 이름 → 용어 페이지 + 카운트 맵

**ByCount 정렬**:
페이지 수로 태그 정렬 (가장 인기 있는 것 먼저).

**Pill 스타일링**:
- `rounded-full`: 알약 모양
- 내부 카운트가 있는 배지
- 브랜드 색상의 hover 효과

### 9.5 term.html

특정 용어로 태그된 모든 페이지를 나열합니다.

**헤더 정보**:

```html
<p class="text-center text-base font-semibold text-primary-blue-light">
    {{ .Data.Singular | humanize | title }}
</p>
<h1 class="text-4xl font-bold text-center">
    {{ .Title }}
</h1>
<p class="text-center text-neutral-500">
    A collection of {{ len .Pages }} posts.
</p>
```

표시 항목:
- 분류 유형 (예: "Tag")
- 용어 이름 (예: "Hugo")
- 게시물 수 (예: "12 posts")

**페이지 그리드**:

`home.html` 및 `section.html`과 동일한 카드 구조를 사용하지만 페이지만 표시 (섹션 없음):

```go
{{ range .Pages }}
    <!-- 페이지 카드 (파일 아이콘, 타이틀, 요약, 태그, 메타데이터) -->
{{ end }}
```

현재 태그/카테고리의 페이지만으로 필터링됩니다.

---

## 10. CSS 및 TailwindCSS 전략

### 10.1 유틸리티 우선 접근법

코드베이스는 커스텀 CSS보다 TailwindCSS 유틸리티 클래스를 광범위하게 사용합니다:

**이점**:
1. **일관성**: 유틸리티를 통해 강제되는 디자인 시스템
2. **성능**: 프로덕션에서 사용되지 않는 유틸리티 제거
3. **유지보수성**: HTML과 CSS 파일 간 컨텍스트 전환 불필요
4. **반응성**: 내장 중단점 시스템

**패턴 예시**:

다음 대신:
```html
<div class="card">...</div>
```
```css
.card {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    border: 1px solid theme('colors.neutral.200');
    border-radius: 0.5rem;
}
```

다음 사용:
```html
<div class="flex flex-col p-6 border border-neutral-200 rounded-lg">...</div>
```

### 10.2 커스텀 색상 설정

TailwindCSS 기본 팔레트 확장:

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: {
                    blue: {
                        light: "#00ccdd"
                    }
                }
            }
        }
    }
};
```

**사용법**:
- `text-primary-blue-light`
- `bg-primary-blue-light`
- `border-primary-blue-light`
- `bg-primary-blue-light/10` (10% 불투명도)

**재정의 대신 확장하는 이유**:
브랜드 색상을 추가하면서 기본 Tailwind 색상(neutral, slate 등)을 유지합니다.

### 10.3 다크 모드 구현

**클래스 기반 전략**:

```javascript
darkMode: "class"
```

모든 유틸리티에 `dark:` 변형 추가:
```html
<div class="bg-white dark:bg-neutral-900">
```

**vs 미디어 쿼리 전략**:
- `darkMode: "media"`는 `@media (prefers-color-scheme: dark)` 사용
- `darkMode: "class"`는 `<html>`에 수동으로 `.dark` 클래스 필요
- 클래스 전략은 사용자 선호도 재정의 허용

**다크 모드 패턴**:

1. **배경/텍스트 쌍**:
```html
bg-white dark:bg-neutral-900
text-neutral-800 dark:text-neutral-300
```

2. **테두리**:
```html
border-neutral-200 dark:border-neutral-800
```

3. **투명도**:
```html
bg-white/70 dark:bg-neutral-900/70
```

4. **Hover 상태**:
```html
hover:bg-neutral-100 dark:hover:bg-neutral-800
```

### 10.4 반응형 접두사 패턴

**모바일 우선 접근법**:

기본 클래스는 모바일에 적용되고, 접두사가 더 큰 크기에서 재정의:

```html
<div class="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
```

확장:
```css
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }

@media (min-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (min-width: 1536px) {
  .\32xl\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
```

**반응형 + 상태 결합**:

```html
<button class="md:hidden lg:flex">
```
- 태블릿에서 숨김
- 데스크톱에서 flex로 표시

**반응형 타이포그래피**:

```html
<h1 class="text-2xl md:text-3xl lg:text-4xl">
```

### 10.5 Flexbox 및 Grid 조합

**레이아웃 구조를 위한 Flexbox**:

```html
<div class="flex flex-col">
    <header class="flex-shrink-0">...</header>
    <main class="flex-grow">...</main>
    <footer class="flex-shrink-0">...</footer>
</div>
```

**콘텐츠 표시를 위한 Grid**:

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div>Card 1</div>
    <div>Card 2</div>
    <div>Card 3</div>
</div>
```

**각각 사용 시기**:

| 사용 사례 | Flexbox | Grid |
|----------|---------|------|
| 단일 차원 (행/열) | ✓ | |
| 2차원 | | ✓ |
| 알 수 없는 항목 수 | ✓ | |
| 정의된 열/행 | | ✓ |
| 정렬 제어 | ✓ | ✓ |

---

## 11. 접근성 고려사항

### 11.1 ARIA 속성

**탭 인터페이스**:

```html
<div role="tablist" aria-label="사이드바 컨텐츠">
    <button role="tab" 
            aria-selected="true" 
            aria-controls="panel-toc" 
            id="tab-toc">
        Toc
    </button>
</div>
<div role="tabpanel" 
     aria-labelledby="tab-toc" 
     id="panel-toc">
    <!-- Content -->
</div>
```

**관계**:
- `aria-controls="panel-toc"`: 탭이 이 패널 제어
- `aria-labelledby="tab-toc"`: 패널이 이 탭으로 레이블됨
- `aria-selected`: 현재 활성 탭

**버튼 레이블**:

```html
<button id="rightSidebarToggle" 
        aria-label="오른쪽 사이드바 열기/닫기">
    <svg>...</svg>
</button>
```

아이콘 전용 버튼은 스크린 리더를 위해 `aria-label` 필요.

### 11.2 키보드 네비게이션

**Tabindex 관리**:

```html
<button id="tab-toc" role="tab" aria-selected="true">Toc</button>
<button id="tab-metadata" role="tab" aria-selected="false" tabindex="-1">Metadata</button>
```

비활성 탭은 `tabindex="-1"`로 탭 순서에서 제거. 사용자는 화살표 키로 탭 간 이동 (JS로 구현).

**포커스 관리**:

```javascript
tab.addEventListener('click', () => {
    // tabindex 업데이트
    tabs.forEach(t => t.setAttribute('tabindex', '-1'));
    tab.removeAttribute('tabindex');
    
    // 포커스 설정
    tab.focus();
});
```

### 11.3 시맨틱 HTML

**적절한 요소 사용**:

- `<nav>`: 네비게이션 영역 (header, breadcrumb, left-nav)
- `<main>`: 주요 콘텐츠 (페이지당 하나만)
- `<aside>`: 접선적으로 관련된 콘텐츠 (right sidebar)
- `<article>`: 독립적인 구성 (page content)
- `<section>`: 주제별 그룹화 (article 내)
- `<header>`: 소개 콘텐츠
- `<footer>`: 닫는 콘텐츠

**헤딩 계층**:

```html
<h1>Page Title</h1>         <!-- 페이지당 하나만 -->
  <h2>Section</h2>
    <h3>Subsection</h3>
      <h4>Detail</h4>
```

레벨 건너뛰지 않기 (예: h1 → h3).

**링크 텍스트**:

```html
<!-- 나쁜 예 -->
<a href="/page">여기를 클릭</a>

<!-- 좋은 예 -->
<a href="/page">설치 가이드 읽기</a>
```

스크린 리더 사용자를 위한 설명적인 링크 텍스트.

---

## 12. 성능 최적화

### 12.1 스크립트 로딩 최적화

**Defer 전략**:

```html
<script src="main.js" defer></script>
```

타임라인:
```
HTML 파싱 → main.js 다운로드 (병렬) → DOM 준비 → main.js 실행 → DOMContentLoaded
```

**vs 기본 (블로킹)**:
```
HTML 파싱 → [차단됨] → JS 다운로드/실행 → 파싱 계속
```

**중요 인라인 스크립트**:

다크 모드 초기화는 `<head>`에 인라인:
```html
<script>
    if (localStorage.theme === 'dark' || ...) {
        document.documentElement.classList.add('dark')
    }
</script>
```

FOUC 방지를 위해 body 렌더링 전에 실행되어야 함.

### 12.2 CSS 최적화

**조건부 로딩**:

```html
{{ if eq .Kind "page" }}
    <link rel="stylesheet" href="toc.css">
    <link rel="stylesheet" href="prose.css">
{{ end }}
```

목록 페이지는 이것들을 로드하지 않음 (~10KB 절약).

**TailwindCSS JIT**:

개발 시 편의를 위해 CDN 사용, 프로덕션에서는:
```bash
npx tailwindcss -i input.css -o output.css --minify
```

사용된 유틸리티만 생성 (~5-10KB vs 전체 프레임워크 3MB).

### 12.3 이미지 최적화 (향후)

**계획된 구현**:

1. **지연 로딩**:
```html
<img src="image.jpg" loading="lazy" alt="...">
```

2. **반응형 이미지**:
```html
<img srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1200w"
     sizes="(max-width: 768px) 100vw, 768px"
     src="medium.jpg" alt="...">
```

3. **모던 포맷**:
```html
<picture>
    <source srcset="image.avif" type="image/avif">
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" alt="...">
</picture>
```

### 12.4 폰트 로딩

**현재 전략**:

`head/font.html`에서 로드 (구현 미표시).

**모범 사례**:

1. **Preconnect**:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
```

2. **Font-Display**:
```css
@font-face {
    font-family: 'CustomFont';
    src: url('font.woff2');
    font-display: swap; /* 즉시 대체 폰트 표시 */
}
```

3. **폰트 서브셋**:
필요한 문자만 로드 (Latin, CJK 등).

---

## 13. 개발 환경 기능

### 13.1 환경 감지

```go
{{ if eq hugo.Environment "development" }}
    <!-- 디버그 정보 -->
{{ end }}
```

**Hugo 환경**:
- `development`: `hugo serve`
- `production`: `hugo` (기본 빌드)
- 커스텀: `hugo --environment staging`

### 13.2 디버그 정보 표시

**헤더 디버그 Span**:

```html
{{ if eq hugo.Environment "development" }}
    <span>| {{ .Type }}</span>
    <span>🔗 {{ .Site.BaseURL }}</span>
    <span>⚙️ Hugo v{{ hugo.Version }} @ {{ now.Format "15:04:05" }}</span>
{{ end }}
```

표시 항목:
- 콘텐츠 타입 (예: "posts", "docs")
- Base URL (하위 디렉토리 배포용)
- Hugo 버전 및 빌드 시간

**타이틀의 템플릿 이름**:

```html
<h1>
    {{ .Title }}
    {{- if eq hugo.Environment "development" }}
        <span class="text-sm text-neutral-500"> | page.html</span>
    {{ end }}
</h1>
```

어떤 템플릿이 콘텐츠를 렌더링했는지 표시.

### 13.3 Live Reload

`hugo serve`는 LiveReload 서버 포함:
- 파일 변경 감시
- 영향받는 페이지 재빌드
- 브라우저 자동 새로고침

**WebSocket 연결**:

Hugo 주입:
```html
<script src="/livereload.js?mindelay=10&amp;v=2"></script>
```

개발 모드에서만.

---

## 14. 향후 개선 및 TODO

### 14.1 Right Sidebar Links Panel

**구현 계획**:

```go
{{ $currentPath := .RelPermalink }}

<!-- Outbound Links -->
<h3>Links to:</h3>
{{ range .OutputFormats.Get "html" }}
    {{ $content := .Content }}
    {{ range findRE `href="([^"]*)"` $content }}
        <a href="{{ . }}">{{ . }}</a>
    {{ end }}
{{ end }}

<!-- Backlinks -->
<h3>Referenced by:</h3>
{{ range .Site.RegularPages }}
    {{ if in .RawContent $currentPath }}
        <a href="{{ .Permalink }}">{{ .Title }}</a>
    {{ end }}
{{ end }}
```

**성능 우려**:
백링크는 모든 페이지를 반복해야 함. 캐시되거나 사전 빌드되어야 함.

### 14.2 페이지네이션

현재 모든 페이지를 한 번에 로드. 대규모 사이트의 경우:

```html
{{ range .Paginator.Pages }}
    <!-- 페이지 카드 -->
{{ end }}

{{ template "_internal/pagination.html" . }}
```

`hugo.toml`에서 설정:
```toml
[pagination]
  pagerSize = 20
```

### 14.3 고급 검색

현재 검색은 기본 필터링. 개선 사항:

1. **Lunr.js를 사용한 전문 검색**:
```javascript
const idx = lunr(function () {
    this.ref('id')
    this.field('title')
    this.field('content')
    
    documents.forEach(doc => this.add(doc))
});
```

2. **검색 인덱스 생성**:
`index.json` 출력 포맷 생성:
```go
{{ range .Site.RegularPages }}
    {
        "id": "{{ .RelPermalink }}",
        "title": "{{ .Title }}",
        "content": "{{ .Content | plainify }}"
    }
{{ end }}
```

3. **하이라이팅**:
컨텍스트 내 일치 용어 표시.

### 14.4 성능 모니터링

**추적 메트릭**:

1. **Core Web Vitals**:
   - LCP (Largest Contentful Paint): < 2.5s
   - FID (First Input Delay): < 100ms
   - CLS (Cumulative Layout Shift): < 0.1

2. **커스텀 메트릭**:
```javascript
// Time to Interactive
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        console.log('TTI:', entry.processingStart);
    }
});
observer.observe({entryTypes: ['navigation']});
```

3. **번들 크기 추적**:
시간 경과에 따른 CSS/JS 페이로드 모니터링.

### 14.5 접근성 감사

**자동화 테스트**:
```bash
npm install -g pa11y
pa11y http://localhost:1313
```

**수동 체크리스트**:
- [ ] 모든 이미지에 alt 텍스트
- [ ] 논리적인 헤딩 계층
- [ ] 색상 대비가 WCAG AA 충족 (4.5:1)
- [ ] 키보드 네비게이션 작동
- [ ] 스크린 리더가 페이지 변경 알림
- [ ] 폼에 레이블
- [ ] 포커스 인디케이터 표시

### 14.6 Progressive Web App (PWA)

**오프라인을 위한 Service Worker**:

```javascript
// sw.js
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
```

**Web App Manifest**:

```json
{
    "name": "Site Name",
    "short_name": "Site",
    "start_url": "/",
    "display": "standalone",
    "theme_color": "#00ccdd",
    "background_color": "#ffffff",
    "icons": [...]
}
```

---

## 15. 결론

### 15.1 아키텍처 요약

`baseof.html` 템플릿은 정교한 3단 반응형 레이아웃을 구현합니다:

1. **Left Navigation**: 파일 트리, 태그, 최근 문서가 있는 Fixed 오버레이
2. **Main Content**: Sticky 헤더 및 템플릿 블록이 있는 유연한 영역
3. **Right Sidebar**: TOC, 메타데이터, 링크를 위한 조건부 탭 인터페이스

**주요 기술 결정**:

- CSS 전용 left nav 토글 (peer 패턴)
- 조건부 right sidebar (페이지 타입만)
- 모바일 우선 반응형 전략
- TailwindCSS를 사용한 유틸리티 우선 CSS
- ARIA 속성이 있는 시맨틱 HTML
- 성능을 위한 지연 스크립트 로딩

### 15.2 유지보수 가이드라인

**기능 추가 시**:

1. 기능이 `baseof.html`에 속하는지 자식 템플릿에 속하는지 확인
2. 모든 중단점에서 반응형 동작 고려
3. 접근성을 위한 ARIA 속성 추가
4. 키보드 네비게이션 테스트
5. 다크 모드 스타일링 확인
6. 이 문서 업데이트

**일반적인 수정 지점**:

- **색상 구성표 변경**: `head/library.html`의 Tailwind config 편집
- **중단점 조정**: `md:`, `lg:` 클래스 수정
- **헤더 컨트롤 추가**: `header.html` 업데이트
- **네비게이션 수정**: `left-nav/*.html` partial 편집
- **콘텐츠 너비 변경**: `page.html`의 `max-w-[72ch]` 업데이트

### 15.3 관련 문서

- `01-content-creation.md`: 콘텐츠 구조 및 frontmatter
- `02-preprocessing.md`: 빌드 전 프로세스
- `04-client-side.md`: JavaScript 구현 세부사항
- `hugo_path_resolution.md`: 템플릿 조회 순서

### 15.4 버전 히스토리

| 버전 | 날짜 | 변경사항 |
|---------|------|---------|
| 1.0 | 2025-10-31 | 초기 문서 |

---

**문서 메타데이터**:
- 작성자: Development Team
- 최종 업데이트: 2025-10-31
- Hugo 버전: 0.120+
- TailwindCSS 버전: 3.x






