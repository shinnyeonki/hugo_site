## Hugo 미디어 및 자산 관리 아키텍처 (Hugo Media & Asset Management Architecture)

### 1. 기본 철학 (Core Philosophy)

이 프로젝트는 **콘텐츠와 그에 속한 자산(이미지, 파일 등)의 응집성**을 최우선으로 합니다. 모든 글과 관련 미디어는 `content` 폴더 내에서 완결된 구조를 가지며, 이는 다음 목표를 달성하기 위함입니다.

-   **Obsidian 호환성**: Hugo의 `content` 폴더가 Obsidian Vault의 루트 역할을 합니다. Obsidian에서 작성한 모든 링크(내부 문서, 이미지)가 Hugo 사이트에서도 깨짐 없이 동작해야 합니다.
-   **이식성 (Portability)**: `content` 폴더만 백업하거나 다른 시스템으로 이전해도 모든 콘텐츠와 미디어 관계가 그대로 유지됩니다.
-   **직관성**: 콘텐츠를 작성하는 사람은 복잡한 Hugo의 폴더 구조(예: `static`, `assets`)를 신경 쓸 필요 없이, 마크다운 표준 상대 경로 문법에만 집중할 수 있습니다.
-   **단일 진실 공급원 (SSOT)**: 콘텐츠와 관련된 모든 것은 `content` 폴더에 있습니다.

### 2. 핵심 원칙 (Key Principles)

1.  **콘텐츠의 모든 것은 `content` 안에 있다**: 글(`.md`)에서 직접 참조하는 이미지, PDF, 첨부파일 등은 **반드시** `content` 폴더 내에 위치해야 한다.
2.  **`static` 및 `assets` 폴더는 '사이트'를 위한 공간이다**: `favicon.ico`, `robots.txt`, 사이트 로고, 소셜 공유 이미지 등 **콘텐츠와 직접적인 관련이 없는** 사이트 전역 자산만이 `static` 폴더에 위치한다.
3.  **모든 내부 경로는 상대 경로를 사용한다**: 마크다운 파일 내에서 다른 문서나 이미지를 링크할 때는 항상 상대 경로(`../`, `{filename or foldername}`)를 사용한다.

### 3. 디렉토리 구조 (Directory Structure)

사용해왔던 obsidian vault 구조를 그대로 hugo content 폴더로 사용
```
.
├── archetypes/
├── assets/
│   ├── scss/         # 사이트 SCSS 파일
│   └── js/           # 사이트 JS 파일
├── content/          # <-- Obsidian Vault Root (실제로는 없고 추후 obsidian valut 에서 복사된 것임)
│   ├── 01.projects/
│   │   └── project-a.md
│   ├── 02.inbox/
│   │   └── 이것이 코딩테스트다 with python/
│   │       └── 그래프(graph).md  # 예: ![...](../../08.media/image.png)
│   ├── 04.Excalidraw/
│   │   └── sample.excalidraw
│   └── 08.media/     # <-- 대부분의 콘텐츠 미디어의 중앙 저장소
│       ├── 20240428022601.png
│       └── some-diagram.svg
├── data/
├── layouts/
│   └── _default/
│       └── _markup/
│           ├── render-image.html # <-- 핵심 구현 1
│           └── render-link.html  # <-- 핵심 구현 2
├── static/
│   ├── images/
│   │   └── site-logo.svg         # 사이트 로고 (콘텐츠와 무관)
│   ├── favicon.ico
│   └── robots.txt
└── config.toml
```

#### 3.1. `content` 폴더 상세 규칙

-   **중앙 미디어 저장소**: 미디어 파일은 루트 하위에 `content/08.media/`, `content/04.Excalidraw/` 폴더에 다른 파일들과 겹치지 않도록 모아서 관리하는 것을 원칙으로 합니다.
    -   **사용법**: 어떤 마크다운 파일에서든 `../../08.media/이미지.png` 와 같은 상대 경로로 이미지를 참조합니다.

#### 3.2. `static` vs `assets` vs `content`

| 폴더        | 목적                                            | 예시 파일                                 | Hugo 처리 방식                    |
| :---------- | :---------------------------------------------- | :---------------------------------------- | :-------------------------------- |
| **`content`** | **글과 직접 관련된 모든 파일 (Obsidian Vault)** | `.md`, `image.png`, `report.pdf`          | **Render Hooks**로 경로를 동적 변환 |
| **`static`**  | **사이트 전역 파일 (가공 없이 그대로 복사)**    | `favicon.ico`, `robots.txt`, `site-logo.svg` | 그대로 `public/` 폴더에 복사      |
| **`assets`**  | **테마 및 빌드 자산 (Hugo가 처리/번들링)**      | `style.scss`, `main.js`, `theme-bg.jpg`   | Hugo Pipes로 처리 후 `public/` 생성 |

### 4. hugo 의 리소스 처리 기본

참고 문서 1 : https://gohugo.io/content-management/image-processing/  
참고 문서 2 : https://gohugo.io/content-management/page-bundles/  
참고 문서 3 : https://gohugo.io/methods/page/resources/  

위의 3개의 문서를 참조  

#### 4.1. Hugo의 리소스 유형 (Resource Types)

Hugo는 세 가지 유형의 리소스를 구분하여 처리합니다:

##### 4.1.1. Page Resource (페이지 리소스)
- **정의**: Page Bundle 내에 포함된 파일
- **위치**: `index.md` 또는 `_index.md`와 같은 디렉토리에 위치한 파일
- **접근 방법**: `.Resources.Get`, `.Resources.GetMatch`, `.Resources.Match` 메서드 사용
- **예시**:
```
content/
└── posts/
    └── my-post/           <-- Leaf Bundle
        ├── index.md
        ├── sunset.jpg    <-- Page Resource
        └── diagram.png   <-- Page Resource
```
```go-template
{{/* Page Resource 접근 */}}
{{ $image := .Resources.Get "sunset.jpg" }}
{{ $image := .Resources.GetMatch "*.jpg" }}
{{ range .Resources.ByType "image" }}
  <img src="{{ .RelPermalink }}" alt="">
{{ end }}
```

##### 4.1.2. Global Resource (전역 리소스)
- **정의**: `assets` 디렉토리에 위치한 파일
- **위치**: `assets/` 폴더 또는 `assets`에 마운트된 디렉토리
- **접근 방법**: `resources.Get`, `resources.GetMatch` 함수 사용
- **예시**:
```
assets/
└── images/
    └── site-logo.svg    <-- Global Resource
```
```go-template
{{/* Global Resource 접근 */}}
{{ $logo := resources.Get "images/site-logo.svg" }}
```

##### 4.1.3. Static Resource (정적 리소스)
- **정의**: `static` 디렉토리의 파일 (Hugo가 처리하지 않고 그대로 복사)
- **위치**: `static/` 폴더
- **특징**: 빌드 시 `public/`으로 그대로 복사되며, Hugo의 리소스 처리 기능을 사용할 수 없음
- **용도**: `favicon.ico`, `robots.txt` 등 사이트 전역 파일

#### 4.2. Page Bundle의 두 가지 유형

##### 4.2.1. Leaf Bundle (리프 번들)
- **인덱스 파일**: `index.md` (underscore 없음)
- **특징**: 
  - 콘텐츠의 "끝" (자식 페이지를 가질 수 없음)
  - 동일 디렉토리의 모든 파일이 Page Resource가 됨
  - `.md` 파일도 리소스로만 접근 가능 (별도 페이지로 렌더링되지 않음)
- **Page Kind**: `page`
- **템플릿 타입**: `single`

##### 4.2.2. Branch Bundle (브랜치 번들)
- **인덱스 파일**: `_index.md` (underscore 있음)
- **특징**:
  - 섹션 페이지를 생성
  - 자식 페이지(Leaf/Branch Bundle)를 가질 수 있음
  - 동일 디렉토리의 non-Markdown 파일만 Page Resource가 됨
  - `.md` 파일은 별도 페이지로 렌더링됨
- **Page Kind**: `home`, `section`, `taxonomy`, `term`
- **템플릿 타입**: `home`, `section`, `taxonomy`, `term`

#### 4.3. Hugo 빌드 처리 예시

##### 빌드 전 (content 구조)
```
content/
├── about/
│   ├── index.md          <-- Leaf Bundle 시작
│   ├── welcome.jpg       <-- Page Resource (about 페이지의)
│   └── team/
│       ├── access.md     <-- 일반 Markdown (별도 페이지가 됨)
│       └── member1.jpg   <-- 단순 파일 (Page Resource 아님)
├── privacy/
│   ├── _index.md         <-- Branch Bundle 시작
│   ├── sample.png        <-- Page Resource (privacy 섹션의)
│   └── terms.md          <-- 별도 페이지로 렌더링
└── temporary.md          <-- 일반 Markdown (별도 페이지가 됨)

static/
    └── milk.jpg          <-- Static Resource
assets/
    └── site-logo.svg     <-- Global Resource
```

##### 빌드 후 (public 구조)
```
public/
├── about/                <-- Leaf Bundle → 단일 페이지 (type : page)(내부에 index.md 가 있었으므로)
│   ├── index.html        <-- about 페이지
│   ├── welcome.jpg       <-- Page Resource (접근 가능: .Resources.Get "welcome.jpg")
│   └── team/             <-- 단순 폴더 (Bundle 아님)
│       ├── access/       <-- Pretty URL 적용
│       │   └── index.html
│       └── member1.jpg   <-- 단순 파일 (.Resources로 접근 불가)
├── privacy/              <-- Branch Bundle → 섹션 페이지 (type : section)(내부에 _index.md 가 있었으므로)
│   ├── index.html        <-- privacy 섹션 페이지
│   ├── sample.png        <-- Page Resource (접근 가능: .Resources.Get "sample.png")
│   └── terms/            <-- Pretty URL 적용
│       └── index.html    <-- terms 페이지
├── temporary/            <-- Pretty URL 적용
│   └── index.html        <-- temporary 페이지
├── milk.jpg              <-- 그대로 복사
└── site-logo.svg         <-- Global Resource (그대로 복사)
```

##### 리소스 접근 가능성 정리
| 파일 | 리소스 타입 | `.Resources`로 접근 | 비고 |
|------|------------|-------------------|------|
| `about/welcome.jpg` | Page Resource | ✅ 가능 (about 페이지에서) | Leaf Bundle의 리소스 |
| `about/team/member1.jpg` | 단순 파일 | ❌ 불가능 | Bundle에 속하지 않음 |
| `privacy/sample.png` | Page Resource | ✅ 가능 (privacy 섹션에서) | Branch Bundle의 리소스 |
| `static/milk.jpg` | Static Resource | ❌ 불가능 | Hugo가 처리하지 않음 |

#### 4.4. Page Resource 접근 메서드

Hugo는 Page Resource에 접근하기 위한 다양한 메서드를 제공합니다:

##### `.Resources.Get`
특정 경로의 리소스 하나를 반환 (없으면 nil):
```go-template
{{ with .Resources.Get "images/sunset.jpg" }}
  <img src="{{ .RelPermalink }}" alt="">
{{ end }}
```

##### `.Resources.GetMatch`
Glob 패턴과 일치하는 첫 번째 리소스 반환:
```go-template
{{ with .Resources.GetMatch "images/*.jpg" }}
  <img src="{{ .RelPermalink }}" alt="">
{{ end }}
```

##### `.Resources.Match`
Glob 패턴과 일치하는 모든 리소스 컬렉션 반환:
```go-template
{{ range .Resources.Match "images/*.jpg" }}
  <img src="{{ .RelPermalink }}" alt="">
{{ end }}
```

##### `.Resources.ByType`
특정 미디어 타입의 모든 리소스 반환:
```go-template
{{ range .Resources.ByType "image" }}
  <img src="{{ .RelPermalink }}" alt="">
{{ end }}
```

**Glob 패턴 예시**:
| 파일 경로 | 패턴 | 매칭 여부 |
|-----------|------|-----------|
| `images/foo/a.jpg` | `images/foo/*.jpg` | ✅ |
| `images/foo/a.jpg` | `images/*/*.jpg` | ✅ |
| `images/foo/a.jpg` | `**/*.jpg` | ✅ |
| `images/foo/a.jpg` | `*.jpg` | ❌ |

#### 4.5. 이미지 처리 기능

Hugo는 Page Resource와 Global Resource에 대해 강력한 이미지 처리 기능을 제공합니다:

##### 주요 메서드
- **`.Resize "width x height"`**: 이미지 크기 조정 (비율 유지 가능)
- **`.Fit "width x height"`**: 지정된 크기 내로 축소 (비율 유지)
- **`.Fill "width x height"`**: 크롭 + 리사이즈로 정확한 크기 생성
- **`.Crop "width x height"`**: 리사이즈 없이 크롭만 수행
- **`.Filter`**: 필터 적용 (블러, 픽셀레이트 등)

```go-template
{{/* 다양한 이미지 처리 예시 */}}
{{ $original := .Resources.Get "photo.jpg" }}
{{ $resized := $original.Resize "800x" }}
{{ $thumbnail := $original.Fill "200x200 smart" }}
{{ $cropped := $original.Crop "600x400 center" }}
```

##### 이미지 처리 옵션
- **크기**: `600x400`, `600x` (너비만), `x400` (높이만)
- **포맷 변환**: `webp`, `png`, `jpg`
- **품질**: `q75` (1-100, 기본값 75)
- **회전**: `r90`, `r180`, `r270`
- **앵커**: `smart`, `center`, `topleft`, `top`, `topright`, `left`, `right`, `bottomleft`, `bottom`, `bottomright`
- **리샘플링 필터**: `Box`, `Lanczos`, `CatmullRom`, `Linear`, `NearestNeighbor`

```go-template
{{ $processed := $image.Resize "800x600 webp q85 smart" }}
```

#### 4.6. 본 프로젝트에서의 문제점과 해결 방안

##### 문제점
1장부터 3장까지 설명한 것에서 hugo 빌드 규칙을 적용하면 다음과 같은 문제가 발생합니다:

1. **중앙 미디어 저장소의 한계**: 
   - `content/08.media/`, `content/04.Excalidraw/` 폴더의 리소스는 어떤 Page Bundle에도 속하지 않음
   - 따라서 `.Resources` 메서드로 접근 불가능
   - `member1.jpg`처럼 "단순 파일"로 존재하게 됨

2. **상대 경로 문제**:
   - `hello.md` → `hello/index.html`로 변환 (한 단계 깊어짐)
   - 마크다운에서 `../../08.media/image.png`로 참조했던 경로가 빌드 후 깨짐

3. **Hugo의 Page Resource 기능 사용 불가**:
   - 이미지 처리 (`.Resize`, `.Fill` 등) 불가능
   - EXIF 데이터 추출 불가능
   - 성능 최적화 (자동 캐싱 등) 불가능

##### 해결 방안
이를 해결하기 위해 Hugo의 **Render Hook** 기능을 사용합니다:

1. **Render Hook의 역할**:
   - 마크다운의 `![]()` (이미지)와 `[]()` (링크) 구문을 HTML로 변환하는 시점에 개입
   - 빌드 후 경로 변화를 자동으로 보정 (`../` 추가)
   - 추가 기능 구현 (YouTube 임베딩, 비디오/오디오/PDF 지원)

2. **경로 보정 로직**:
   ```go-template
   {{- with .Page.Resources.GetMatch $src -}}
     {{- /* Page Resource인 경우: Permalink 사용 */ -}}
     {{- $src = .Permalink -}}
   {{- else -}}
     {{- /* 일반 파일인 경우: ../ 추가 */ -}}
     {{- $src = printf "../%s" $src -}}
   {{- end -}}
   ```

3. **추가 기능**:
   - YouTube URL 자동 임베드
   - 비디오/오디오 파일 `<video>`/`<audio>` 태그 생성
   - PDF 파일 `<iframe>` 임베딩
   - 외부 링크 스타일 차별화

이처럼 Hugo는 복잡한 빌드 규칙을 가지고 있으며, 본 프로젝트에서는 Render Hook을 통해 이러한 제약을 우회하면서도 Obsidian 호환성을 유지합니다


### 5. Hugo 구현: Render Hooks

이 아키텍처의 핵심은 Hugo의 **Render Hooks**입니다. 이 기능은 마크다운의 표준 링크 `[]()`와 이미지 `![]()` 구문을 Hugo가 HTML로 변환하는 시점에 가로채서 우리가 원하는 방식으로 URL을 동적으로 생성하게 해줍니다.
#### 5.1. 전제
- hugo 렌더링 후 `hello.md` 라는 파일이 `hello/index.html` 로 변환 즉 렌더링된 파일은 한단계 깊어진다
- 미디어 폴더 구조 즉 마크다운이 아닌 모든 리소스는 `content/08.media/` , `content/04.Excalidraw/` 등 루트 하위의 별도의 폴더에 위치한다

##### 빌드로 인한 내부 구조 변화

> 외부 링크는 변화가 필요 없고 내부 링크에서만 문제가 발생한다 또한 내부링크에서 md -> md 를 링크된 경우 이미 hugo 에서 적절한 함수를 제공하므로  여기서는 예시로 들지 않는다 여기서는  내부링크, 리소스 참조의 경우만을 다룬다




마크다운을 가리키는 내부 링크의 경우 hugo 에서 제공되는 method 들을 활용하여 구조가 변경되더라도 올바르게 링크가 가능하다 하지만 hugo 에서는 이미지 등 기타 리소스 파일의 경우 [리소스 처리 기본](#4-hugo-의-리소스-처리-기본) 에 따라 다른 폴더 즉 `08.media`, `04.Excalidraw` 등의 폴더에 두는 것을 전제로 하지 않기 때문에 별도의 구현이 필요하다  (단 hugo 는 동일한 폴더에 존재하는 리소스 파일의 경우 패키징이 기본 형태이다 하지만 그렇게 파일을 관리하지 않기 때문에 넘어가도 괜찮다)

아래부터는 index.md 파일을 스스로 만들지 않는다면 즉 페이지 번들을 하지 않는다면 아래 논리가 완벽히 적용된다. index.md 파일을 스스로 만든다면 경로가 변하지 않기 때문에 아래 논리가 불필요하다

참조하는 파일 즉 마크다운 자체의 경로가 변하기 때문에 이를 반영할 필요가 있다 마크다운 경로의 위치가 단순히 1단계 깊어지는 것과 같으므로 상대경로에 `../` 을 붙여서 동작하면 올바르게 동작한다

#### 5.2. 이미지 처리 (`layouts/_markup/render-image.html`)

> `![]()` 문법을 발견하면 동작하는 hook로써 원래는 마크다운 표준상 이미지만을 처리해야 하지만 이미지만을 처리하지는 않고 ![]() 문법의 기능중 "보여준다" 의 의미를 확장하여 비디오, 오디오, PDF 등 다양한 미디어 포함을 지원한다. 

**핵심 동작 원리:**

1. **외부 리소스 (`http`로 시작)**: 
   - 일반적으로 그대로 사용
   - YouTube URL (`https://www.youtube.com/watch?v=`)인 경우 자동으로 임베드 iframe으로 변환

2. **내부 리소스 (상대 경로)**:
   - Page Resource(페이지와 함께 저장된 파일)인지 먼저 확인
   - Page Resource가 아닌 경우, 상대 경로에 `../`를 추가하여 렌더링 후 경로 변화 보정
   - 파일 확장자에 따라 적절한 HTML 태그 생성:
     - `mp4`, `webm`, `mov`: `<video>` 태그
     - `mp3`, `ogg`, `wav`: `<audio>` 태그
     - `pdf`: `<iframe>` 태그 (600px 높이)
     - 지원되지 않는 비디오/오디오 포맷 (`avi`, `mkv` 등): 다운로드 링크 제공
     - 기본 (이미지): `<img>` 태그

**핵심 코드 로직:**

```go-template
{{- if $isExternal -}}
  {{- /* YouTube 링크는 embed iframe으로 변환 */}}
  {{- $isYouTubeWatch := strings.HasPrefix $src "https://www.youtube.com/watch?v=" -}}
  {{- if $isYouTubeWatch -}}
    {{- /* videoID 추출 및 iframe 생성 */}}
  {{- end -}}
{{- else -}}
  {{- /* Page Resource 확인 */}}
  {{- with .Page.Resources.GetMatch $src -}}
    {{- $src = .Permalink -}}
  {{- else -}}
    {{- /* 상대 경로 보정: ../ 추가 */}}
    {{- $src = printf "../%s" $src -}}
  {{- end -}}
{{- end -}}

{{- /* 확장자별 처리 */}}
{{- if in (slice "mp4" "webm" "mov") $ext -}}
  <video controls src="{{ $src }}" ...></video>
{{- else if in (slice "mp3" "ogg" "wav") $ext -}}
  <audio controls src="{{ $src }}" ...></audio>
{{- else if eq $ext "pdf" -}}
  <iframe src="{{ $src }}" ...></iframe>
{{- else -}}
  <img src="{{ $src }}" alt="{{ $alt }}" ... />
{{- end -}}
```

#### 5.3. 내부 링크 처리 (`layouts/_markup/render-link.html`)

> `[]()` 문법을 발견하면 동작하는 hook로써 외부 링크와 내부 링크, 내부 링크의 경우 마크다운 페이지와 기타 리소스 파일(pdf 등)을 구분하여 적절한 스타일과 동작을 적용한다.

**핵심 동작 원리:**

1. **외부 링크** (URL Scheme이 있는 경우: `http`, `https`, `mailto` 등):
   - 파란색 스타일 (`text-blue-700 hover:text-primary-blue-light`)
   - 새 탭에서 열림 (`target="_blank"`)
   - 보안 속성 추가 (`rel="noopener noreferrer"`)

2. **앵커 전용 링크** (`#`로 시작하는 경우, 예: `#heading`):
   - 에메랄드 색상 (`text-emerald-700 dark:text-emerald-300`)
   - 단순 앵커 링크는 그대로 사용
   - 같은 페이지 내 이동

3. **`.md`로 끝나는 페이지 링크** (예: `/c.md#anchor`):
   - 에메랄드 색상 (`text-emerald-700 dark:text-emerald-300`)
   - Hugo의 `ref` 함수를 사용하여 정확한 페이지 경로로 변환
   - **중요**: `ref` 함수는 앵커(#)를 포함한 경로도 정확히 변환해 줌

4. **기타 리소스 링크** (PDF, ZIP, 이미지 등):
   - 회색 스타일 (`text-neutral-600 dark:text-neutral-400`)
   - 상대 경로에 `../`를 추가하여 렌더링 후 경로 변화 보정

**핵심 코드 로직:**

```go-template
{{- $url := .Destination -}}
{{- $text := .Text | safeHTML -}}
{{- $title := .Title -}}
{{- $parsedURL := urls.Parse $url -}}

{{- if $parsedURL.Scheme -}}
  {{- /* 1. 외부 링크: URL Scheme이 있는 경우 */}}
  <a href="{{ $url | safeURL }}"
     target="_blank"
     rel="noopener noreferrer"
     class="text-blue-700 hover:text-primary-blue-light ...">
    {{- $text -}}
  </a>

{{- else if strings.HasPrefix $url "#" -}}
  {{- /* 2. 앵커 전용 링크 */}}
  <a href="{{ $url }}"
     class="text-emerald-700 dark:text-emerald-300 ...">
    {{- $text -}}
  </a>

{{- else if strings.HasSuffix $parsedURL.Path ".md" -}}
  {{- /* 3. .md로 끝나는 '페이지' 링크 */}}
  {{- /* ref 함수는 앵커(#)를 포함한 경로도 정확히 변환 */}}
  <a href="{{ ref .Page $url | safeURL }}"
     class="text-emerald-700 dark:text-emerald-300 ...">
    {{- $text -}}
  </a>

{{- else -}}
  {{- /* 4. 기타 '리소스' 링크 (PDF, ZIP, 이미지 등) */}}
  {{- $finalURL := printf "../%s" $url -}}
  <a href="{{ $finalURL | safeURL }}"
     class="text-neutral-600 dark:text-neutral-400 ...">
    {{- $text -}}
  </a>
{{- end -}}
```

---