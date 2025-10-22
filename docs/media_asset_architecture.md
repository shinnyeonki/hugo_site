물론입니다. Obsidian과 Hugo를 연동하여 `content` 폴더 중심으로 미디어를 관리하는 것은 매우 효율적인 워크플로우입니다. 이를 위한 명확한 규칙을 담은 `media_architecture.md` 문서를 작성해 드리겠습니다.

이 문서는 프로젝트의 루트 디렉토리에 저장하여 팀원이나 미래의 자신이 참고할 수 있도록 하는 것이 좋습니다.

---

# Hugo 미디어 및 자산 관리 아키텍처 (Hugo Media & Asset Management Architecture)

## 1. 기본 철학 (Core Philosophy)

이 프로젝트는 **콘텐츠와 그에 속한 자산(이미지, 파일 등)의 응집성**을 최우선으로 합니다. 모든 글과 관련 미디어는 `content` 폴더 내에서 완결된 구조를 가지며, 이는 다음 목표를 달성하기 위함입니다.

-   **Obsidian 호환성**: Hugo의 `content` 폴더가 Obsidian Vault의 루트 역할을 합니다. Obsidian에서 작성한 모든 링크(내부 문서, 이미지)가 Hugo 사이트에서도 깨짐 없이 동작해야 합니다.
-   **이식성 (Portability)**: `content` 폴더만 백업하거나 다른 시스템으로 이전해도 모든 콘텐츠와 미디어 관계가 그대로 유지됩니다.
-   **직관성**: 콘텐츠를 작성하는 사람은 복잡한 Hugo의 폴더 구조(예: `static`, `assets`)를 신경 쓸 필요 없이, 마크다운 표준 상대 경로 문법에만 집중할 수 있습니다.
-   **단일 진실 공급원 (SSOT)**: 콘텐츠와 관련된 모든 것은 `content` 폴더에 있습니다.

## 2. 핵심 원칙 (Key Principles)

1.  **콘텐츠의 모든 것은 `content` 안에 있다**: 글(`.md`)에서 직접 참조하는 이미지, PDF, 첨부파일 등은 **반드시** `content` 폴더 내에 위치해야 한다.
2.  **`static` 폴더는 '사이트'를 위한 공간이다**: `favicon.ico`, `robots.txt`, 사이트 로고, 소셜 공유 이미지 등 **콘텐츠와 직접적인 관련이 없는** 사이트 전역 자산만이 `static` 폴더에 위치한다.
3.  **`assets` 폴더는 '테마'를 위한 공간이다**: Hugo 파이프라인으로 처리해야 하는 SCSS, JavaScript, 테마 이미지 등은 `assets` 폴더에서 관리한다.
4.  **모든 내부 경로는 상대 경로를 사용한다**: 마크다운 파일 내에서 다른 문서나 이미지를 링크할 때는 항상 상대 경로(`../`, `./`)를 사용한다.

## 3. 디렉토리 구조 (Directory Structure)

```
.
├── archetypes/
├── assets/
│   ├── scss/         # 사이트 SCSS 파일
│   └── js/           # 사이트 JS 파일
├── content/          # <-- Obsidian Vault Root
│   ├── 01.projects/
│   │   └── project-a.md
│   ├── 02.inbox/
│   │   └── 이것이 코딩테스트다 with python/
│   │       └── 그래프(graph).md  # 예: ![...](../../08.media/image.png)
│   ├── 08.media/     # <-- 모든 콘텐츠 미디어의 중앙 저장소
│   │   ├── 20240428022601.png
│   │   └── some-diagram.svg
│   └── _index.md
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

### 3.1. `content` 폴더 상세 규칙

-   **중앙 미디어 저장소**: 모든 미디어 파일은 `content/08.media/` 폴더에 모아서 관리하는 것을 원칙으로 합니다.
    -   **장점**: 파일 중복을 방지하고, 모든 미디어를 한 곳에서 관리하여 일관성을 유지할 수 있습니다.
    -   **사용법**: 어떤 마크다운 파일에서든 `../../08.media/이미지.png` 와 같은 상대 경로로 이미지를 참조합니다.

### 3.2. `static` vs `assets` vs `content`

| 폴더        | 목적                                            | 예시 파일                                 | Hugo 처리 방식                    |
| :---------- | :---------------------------------------------- | :---------------------------------------- | :-------------------------------- |
| **`content`** | **글과 직접 관련된 모든 파일 (Obsidian Vault)** | `.md`, `image.png`, `report.pdf`          | **Render Hooks**로 경로를 동적 변환 |
| **`static`**  | **사이트 전역 파일 (가공 없이 그대로 복사)**    | `favicon.ico`, `robots.txt`, `site-logo.svg` | 그대로 `public/` 폴더에 복사      |
| **`assets`**  | **테마 및 빌드 자산 (Hugo가 처리/번들링)**      | `style.scss`, `main.js`, `theme-bg.jpg`   | Hugo Pipes로 처리 후 `public/` 생성 |

## 4. Hugo 구현: Render Hooks

이 아키텍처의 핵심은 Hugo의 **Render Hooks**입니다. 이 기능은 마크다운의 표준 링크 `[]()`와 이미지 `![]()` 구문을 Hugo가 HTML로 변환하는 시점에 가로채서 우리가 원하는 방식으로 URL을 동적으로 생성하게 해줍니다.

### 4.1. 이미지 처리 (`layouts/_markup/render-image.html`)

`content` 폴더 내의 어떤 상대 경로든 올바른 웹 URL로 변환합니다.

```go-template
{{- $url := .Destination -}}
{{- $isRemote := strings.HasPrefix $url "http" -}}

{{- if $isRemote -}}
    <img src="{{ $url }}" alt="{{ .Text }}" {{ with .Title}} title="{{ . }}"{{ end }}>
{{- else -}}
    {{- $imageResource := "" -}}
    {{- if strings.HasPrefix $url "/" -}}
        {{- $path := strings.TrimPrefix "/" $url -}}
        {{- $imageResource = site.GetPage $path -}}
    {{- else -}}
        {{- $currentPageDir := .Page.File.Dir -}}
        {{- $targetPath := path.Join $currentPageDir $url | path.Clean -}}
        {{- $imageResource = site.GetPage $targetPath -}}
    {{- end -}}

    {{- if $imageResource -}}
        <img src="{{ $imageResource.RelPermalink }}" alt="{{ .Text }}" {{ with .Title}} title="{{ . }}"{{ end }}>
    {{- else -}}
        <img src="{{ $url | relURL }}" alt="{{ .Text }} (Image resource not found)" {{ with .Title}} title="{{ . }}"{{ end }}>
    {{- end -}}
{{- end -}}
```

### 4.2. 내부 링크 처리 (`layouts/_markup/render-link.html`)

`.md`로 끝나는 내부 문서 링크를 올바른 Hugo 페이지 링크로 변환합니다.

```go-template
{{- $url := .Destination -}}
{{- $isRemote := strings.HasPrefix $url "http" -}}

{{- if and (not $isRemote) (strings.HasSuffix $url ".md") -}}
    {{- /* .md로 끝나는 내부 링크 처리 */ -}}
    {{- $path := strings.TrimSuffix ".md" $url -}}
    <a href="{{ (ref .Page $path) | safeURL }}">{{ .Text | safeHTML }}</a>
{{- else -}}
    {{- /* 외부 링크 또는 일반 파일 링크(pdf 등) 처리 */ -}}
    <a href="{{ $url | relURL }}" {{ with .Title}} title="{{ . }}"{{ end }}{{ if $isRemote }} target="_blank" rel="noopener"{{ end }}>{{ .Text | safeHTML }}</a>
{{- end -}}
```

---