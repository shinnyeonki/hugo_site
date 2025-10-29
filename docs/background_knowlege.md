# Obsidian과 Hugo를 연동한 정적 사이트 운영 가이드

이 문서는 Obsidian을 CMS(콘텐츠 관리 시스템)처럼 사용하여 Hugo 정적 사이트를 자동으로 빌드하고 배포하는 전체 아키텍처와 워크플로우를 설명합니다.

## 1. 핵심 철학 및 목표

이 프로젝트의 근간에는 **콘텐츠와 그에 속한 자산(이미지, 파일 등)의 응집성**이라는 원칙이 있습니다. 모든 글과 관련 미디어는 하나의 `content` 폴더 내에서 완결된 구조를 가집니다. 이를 통해 다음 목표를 달성합니다.

-   **Obsidian 호환성**: Hugo의 `content` 폴더가 Obsidian Vault의 루트 역할을 합니다. Obsidian에서 작성한 모든 링크(내부 문서, 이미지)가 Hugo 사이트에서도 깨짐 없이 동작해야 합니다.
-   **이식성 (Portability)**: `content` 폴더만 백업하거나 다른 시스템으로 이전해도 모든 콘텐츠와 미디어 관계가 그대로 유지됩니다.
-   **직관성**: 콘텐츠를 작성하는 사람은 복잡한 Hugo의 폴더 구조(예: `static`, `assets`)를 신경 쓸 필요 없이, 마크다운 표준 상대 경로 문법에만 집중할 수 있습니다.
-   **단일 진실 공급원 (SSOT)**: 콘텐츠와 관련된 모든 것은 `content` 폴더에 있습니다.

## 2. 아키텍처: 폴더 구조와 역할

이 목표를 달성하기 위해 Hugo 프로젝트의 각 폴더는 명확한 역할을 가집니다.

### 2.1. 핵심 원칙

1.  **콘텐츠의 모든 것은 `content` 안에 있다**: 글(`.md`)에서 직접 참조하는 이미지, PDF, 첨부파일 등은 **반드시** `content` 폴더 내에 위치해야 합니다.
2.  **`static` 폴더는 '사이트'를 위한 공간이다**: `favicon.ico`, `robots.txt`, 사이트 로고, 소셜 공유 이미지 등 **콘텐츠와 직접적인 관련이 없는** 사이트 전역 자산만이 `static` 폴더에 위치합니다.
3.  **`assets` 폴더는 '테마'를 위한 공간이다**: Hugo 파이프라인으로 처리해야 하는 SCSS, JavaScript, 테마 이미지 등은 `assets` 폴더에서 관리합니다.
4.  **모든 내부 경로는 상대 경로를 사용한다**: 마크다운 파일 내에서 다른 문서나 이미지를 링크할 때는 항상 상대 경로(`../`, `./`)를 사용합니다.

### 2.2. 디렉토리 구조 비교

| 폴더        | 목적                                            | 예시 파일                                 | Hugo 처리 방식                    |
| :---------- | :---------------------------------------------- | :---------------------------------------- | :-------------------------------- |
| **`content`** | **글과 직접 관련된 모든 파일 (Obsidian Vault)** | `.md`, `image.png`, `report.pdf`          | **Render Hooks**로 경로를 동적 변환 |
| **`static`**  | **사이트 전역 파일 (가공 없이 그대로 복사)**    | `favicon.ico`, `robots.txt`, `site-logo.svg` | 그대로 `public/` 폴더에 복사      |
| **`assets`**  | **테마 및 빌드 자산 (Hugo가 처리/번들링)**      | `style.scss`, `main.js`, `theme-bg.jpg`   | Hugo Pipes로 처리 후 `public/` 생성 |

### 2.3. `content` 폴더 상세 규칙

-   **중앙 미디어 저장소**: 대부분의 미디어 파일은 `content/08.media/` 폴더에 모아서 관리하는 것을 원칙으로 합니다.
    -   **장점**: 파일 중복을 방지하고, 모든 미디어를 한 곳에서 관리하여 일관성을 유지할 수 있습니다.
    -   **사용법**: 어떤 마크다운 파일에서든 `../../08.media/이미지.png` 와 같은 상대 경로로 이미지를 참조합니다.

## 3. 기술 구현: Render Hooks

Obsidian의 상대 경로 링크가 Hugo 사이트에서 올바르게 동작하도록 만드는 핵심 기술은 **Render Hooks**입니다. 이 기능은 마크다운의 표준 링크 `[]()`와 이미지 `![]()` 구문을 Hugo가 HTML로 변환하는 시점에 가로채서 URL을 동적으로 생성하게 해줍니다.

### 3.1. 이미지 처리 (`layouts/_markup/render-image.html`)

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

### 3.2. 내부 링크 처리 (`layouts/_markup/render-link.html`)

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

## 4. 자동화: 배포 워크플로우

위 아키텍처를 기반으로, 콘텐츠 작성부터 배포까지의 과정은 GitHub Actions를 통해 자동화됩니다.

### 4.1. 전제

이 워크플로우는 2개의 분리된 Git 저장소를 사용합니다.
1.  **Obsidian 볼트 저장소**: 순수 콘텐츠(`.md` 파일, 이미지 등)만 관리합니다.
2.  **Hugo 사이트 저장소**: Hugo 테마, 설정, 레이아웃 등 사이트의 뼈대를 관리합니다.

### 4.2. 워크플로우 트리거

이 과정은 **Obsidian 볼트 저장소**의 `master` 브랜치에 `push`가 발생하거나, 수동으로 `workflow_dispatch`를 통해 트리거될 수 있습니다.

### 4.3. 주요 단계

1.  **Obsidian 볼트 체크아웃**: GitHub Actions 워크플로우는 먼저 Obsidian 볼트 저장소를 `obsidian-vault`라는 디렉터리에 체크아웃합니다.

2.  **Hugo 사이트 복제**: 이후 Hugo 사이트의 구조, 테마, 설정 파일이 포함된 별도의 저장소를 `hugo-site` 디렉터리에 클론합니다.

3.  **콘텐츠 동기화**: `obsidian-vault` 디렉터리의 모든 콘텐츠를 `hugo-site/content/` 디렉터리로 복사하여, Hugo가 렌더링할 콘텐츠를 최신 상태로 만듭니다.

4.  **전처리(Preprocessing)**: `hugo-site`에서 `pretask.sh`라는 셸 스크립트를 실행합니다. 이 스크립트는 Hugo 빌드 전에 콘텐츠에 필요한 추가적인 처리 작업을 수행합니다.

5.  **Hugo 빌드**: 최신 버전의 Hugo(Extended)를 사용하여 사이트를 빌드합니다. `--minify` 플래그로 출력 파일 크기를 최적화하고, GitHub Pages 배포를 위해 `baseURL`을 설정합니다.

6.  **GitHub Pages에 배포**: 마지막으로, 빌드된 사이트(`hugo-site/public` 디렉터리)를 GitHub Pages에 배포합니다.