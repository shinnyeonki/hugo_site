### `hugo_path_resolution.md` (심화 버전)

# Hugo 경로 문제 해결 및 Render Hooks 활용 가이드

이 문서는 Obsidian에서 작성한 상대 경로를 빌드 시 절대 경로로 변환하는 전략을 채택했음에도 불구하고, Hugo의 내부 동작 방식으로 인해 발생하는 경로 문제를 심층적으로 분석하고, 이를 해결하는 최종적인 Render Hooks 구현을 제공합니다.


## 1. 문제의 근원: Pretty URLs와 경로 깊이의 변화

Hugo는 기본적으로 `a.md`를 `a/index.html`로 빌드하는 "Pretty URLs" 기능을 사용합니다. 이로 인해 파일의 경로 깊이(depth)가 한 단계 깊어지면서, 작성 시점의 상대 경로가 더 이상 유효하지 않게 됩니다.

-   **작성 시점 (`content`):** `content/A/a.md` (깊이 2)
-   **빌드 후 (`public`):** `public/A/a/index.html` (실질적 URL 깊이 3: `baseURL/A/a/`)

이 1단계의 깊이 차이가 모든 상대 경로 문제를 일으키는 핵심 원인입니다.

### 1-1. 시나리오별 경로 깨짐 현상 분석

다양한 링크 작성 시나리오를 통해 문제가 어떻게 발생하는지 구체적으로 살펴보겠습니다.

---

### **예시 1: 하위 폴더에서 상위 폴더의 다른 파일 링크 (`A/a.md` → `c.md`)**

-   **상황:** `content/A/a.md` 파일 내에서 루트에 있는 `c.md` 파일을 링크합니다.
-   **링크 작성:** `[c 문서](../c.md)`
-   **작성 시 의도:** `content/A/`에서 한 단계 위인 `content/`로 이동 후 `c.md`를 찾습니다. **(정상 동작)**
-   **빌드 후 문제:**
    -   `a.md`는 `public/A/a/index.html`이 됩니다.
    -   이 위치에서 `../c.md` 경로는 `public/A/c.md`를 가리키게 됩니다.
    -   **정상 경로:** `public/c/index.html` (URL: `baseURL/c/`)
    -   **결론:** **링크가 깨집니다.** 올바른 상대 경로는 `../../c/`가 되어야 합니다.

---

### **예시 2: 깊은 하위 폴더에서 미디어 리소스 링크 (`A/A-1/a-1.md` → `media/sample.jpg`)**

-   **상황:** `content/A/A-1/a-1.md` 파일에서 이미지를 첨부합니다.
-   **링크 작성:** `![샘플 이미지](../../media/sample.jpg)`
-   **작성 시 의도:** `content/A/A-1/`에서 두 단계 위인 `content/`로 이동 후 `media/sample.jpg`를 찾습니다. **(정상 동작)**
-   **빌드 후 문제:**
    -   `a-1.md`는 `public/A/A-1/a-1/index.html`이 됩니다.
    -   이 위치에서 `../../media/sample.jpg` 경로는 `public/A/media/sample.jpg`를 가리키게 됩니다.
    -   **정상 경로:** `public/media/sample.jpg` (URL: `baseURL/media/sample.jpg`)
    -   **결론:** **이미지가 깨집니다.** 올바른 상대 경로는 `../../../media/sample.jpg`가 되어야 합니다.

---

### **예시 3: 형제 폴더의 파일 링크 (`A/a.md` → `B/b.md`)**

-   **상황:** `content/A/a.md` 파일에서 `content/B/b.md` 파일을 링크합니다.
-   **링크 작성:** `[b 문서](../B/b.md)`
-   **작성 시 의도:** `content/A/`에서 `content/`로 이동 후 `B/b.md`를 찾습니다. **(정상 동작)**
-   **빌드 후 문제:**
    -   `a.md`는 `public/A/a/index.html`이 됩니다.
    -   이 위치에서 `../B/b.md` 경로는 `public/A/B/b.md`를 가리키게 됩니다.
    -   **정상 경로:** `public/B/b/index.html` (URL: `baseURL/B/b/`)
    -   **결론:** **링크가 깨집니다.** 올바른 상대 경로는 `../../B/b/`가 되어야 합니다.

---

### **예시 4: 루트 파일에서 미디어 리소스 링크 (`c.md` → `media/sample.mp4`)**

-   **상황:** `content/c.md` 파일에서 비디오를 첨부합니다.
-   **링크 작성:** `![샘플 영상](./media/sample.mp4)` 또는 `![샘플 영상](media/sample.mp4)`
-   **작성 시 의도:** `content/` 폴더 내의 `media/sample.mp4`를 찾습니다. **(정상 동작)**
-   **빌드 후 문제:**
    -   `c.md`는 `public/c/index.html`이 됩니다.
    -   이 위치에서 `media/sample.mp4` 경로는 `public/c/media/sample.mp4`를 가리키게 됩니다.
    -   **정상 경로:** `public/media/sample.mp4` (URL: `baseURL/media/sample.mp4`)
    -   **결론:** **비디오가 깨집니다.** 올바른 상대 경로는 `../media/sample.mp4`가 되어야 합니다.

---

### **예시 5: 하위 폴더에서 상위 폴더의 다른 파일 링크 (`A/A-1/a-1.md` → `A/a.md`)**

-   **상황:** `content/A/A-1/a-1.md`에서 바로 위 부모 폴더에 있는 `a.md`를 링크합니다.
-   **링크 작성:** `[a 문서](../a.md)`
-   **작성 시 의도:** `content/A/A-1/`에서 `content/A/`로 이동 후 `a.md`를 찾습니다. **(정상 동작)**
-   **빌드 후 문제:**
    -   `a-1.md`는 `public/A/A-1/a-1/index.html`이 됩니다.
    -   이 위치에서 `../a.md`는 `public/A/A-1/a.md`를 가리키게 됩니다.
    -   **정상 경로:** `public/A/a/index.html` (URL: `baseURL/A/a/`)
    -   **결론:** **링크가 깨집니다.** 올바른 상대 경로는 `../../a/`가 되어야 합니다.

## 2. 해결 전략: 절대 경로화

이 문제를 해결하기 위해 **모든 내부 경로를 전처리 단계에서 루트 기준 절대 경로(`/`로 시작)로 변환하는 전략**을 채택했습니다. 이는 가장 올바르고 강력한 접근 방식입니다.

-   **전처리 예시:**
    -   `[c 문서](../c.md)` → `[c 문서](/c.md)`
    -   `![이미지](../../media/sample.jpg)` → `![이미지](/media/sample.jpg)`

하지만 이 전략을 사용했음에도 불구하고, Hugo가 이 절대 경로들을 해석하는 과정에서 새로운 문제가 발생합니다.

## 3. 심화 문제: Hugo의 '페이지'와 '리소스' 경로 해석 차이

Hugo는 링크를 처리할 때, 해당 링크가 **자신이 알고 있는 '페이지(Page)'를 가리키는지, 아니면 단순 '리소스(Asset)'를 가리키는지**에 따라 동작이 달라집니다.

-   **콘텐츠 페이지 링크 (예: `/c.md`)**
    -   Hugo는 빌드 시점에 사이트의 모든 `.md` 파일을 분석하여 페이지 컬렉션을 만듭니다.
    -   `/c.md`라는 경로를 보면 "아, 이건 `content/c.md` 파일이고, 빌드 후에는 `/c/`라는 URL을 갖게 될 페이지구나"라고 **인지**합니다.
    -   따라서 `relURL`, `absURL` 같은 함수들이 이 페이지의 최종 URL(`Permalink`)을 기준으로 영리하게 동작합니다.

-   **리소스 링크 (예: `/media/sample.jpg`)**
    -   Hugo의 페이지 컬렉션에 `/media/sample.jpg`라는 항목은 존재하지 않습니다.
    -   Hugo 입장에서 이것은 그냥 **의미를 알 수 없는 문자열**일 뿐입니다. `content/media/sample.jpg`가 최종적으로 `public/media/sample.jpg`에 복사될 것이라는 사실을 Hugo의 URL 처리 함수는 직접적으로 알지 못합니다.
    -   이로 인해, `relURL` 같은 함수는 현재 페이지(`a/index.html`)를 기준으로 이 "알 수 없는 문자열"에 대한 상대 경로를 계산하려다 **엉뚱한 결과**를 반환하게 됩니다. 예를 들어 `../media/sample.jpg` 같은 잘못된 경로를 생성할 수 있습니다.

**결론: `![](/media/sample.jpg)`와 같이 리소스를 가리키는 절대 경로에 Hugo의 페이지 중심적인 URL 함수를 잘못 적용하면 경로가 다시 깨지게 됩니다.**

## 4. 최종 해결책: '페이지'와 '리소스'를 구분하는 Render Hooks

이 문제를 해결하려면 Render Hooks 내에서 링크의 종류를 명확히 구분하여 각기 다른 처리 방식을 적용해야 합니다.

### 4.1. `layouts/_default/_markup/render-image.html` (리소스 처리)

`![]()`는 항상 이미지, 비디오 등 '리소스'를 대상으로 하므로 로직이 비교적 간단합니다. 리소스는 Hugo의 페이지 처리 로직을 완전히 우회하고, 주어진 절대 경로에 `baseURL`만 붙여주면 됩니다. `absURL` 함수는 이럴 때 사용하기에 완벽합니다.

```html
<!-- layouts/_default/_markup/render-image.html -->
{{- $src := .Destination -}}
{{- $alt := .Text | plainify -}}
{{- $isExternal := strings.HasPrefix $src "http" -}}

{{- if $isExternal -}}
  {{- /* 외부 URL은 그대로 사용 */}}
{{- else -}}
  {{- /* 내부 리소스는 absURL을 사용하여 baseURL만 정확히 붙여줌 */}}
  {{- $src = $src | absURL -}}
{{- end -}}

{{- $ext := path.Ext $src | strings.TrimLeft "." | lower -}}

{{- if find (slice "mp4" "webm" "mov") $ext -}}
<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; height: auto;">
  <video controls src="{{ $src }}" title="{{ $alt }}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 8px;"></video>
</div>
{{- else if find (slice "mp3" "ogg" "wav") $ext -}}
<audio controls src="{{ $src }}" title="{{ $alt }}" style="width: 100%;"></audio>
{{- else if eq $ext "cast" -}}
  <asciinema-player src="{{ $src }}" theme="solarized-dark" autoplay loop></asciinema-player>
{{- else if eq $ext "excalidraw" -}}
  <object data="{{ $src }}" type="image/svg+xml" style="width: 100%; border: 1px solid #ddd; border-radius: 8px;"></object>
{{- else -}}
  <img src="{{ $src }}" alt="{{ $alt }}" {{ with .Title }}title="{{ . }}"{{ end }} loading="lazy" style="max-width: 100%; height: auto; border-radius: 8px;" />
{{- end -}}
```

### 4.2. `layouts/_default/_markup/render-link.html` (페이지와 리소스 구분 처리)

`[]()`는 '페이지'를 링크할 수도, PDF나 ZIP 같은 '리소스'를 링크할 수도 있습니다. 따라서 이 둘을 구분하는 로직이 반드시 필요합니다.

```html
<!-- layouts/_default/_markup/render-link.html -->
{{- $url := .Destination -}}
{{- $isExternal := strings.HasPrefix $url "http" -}}
{{- $isAnchor := strings.HasPrefix $url "#" -}}

{{- $finalURL := "" -}}
{{- if or $isExternal $isAnchor -}}
  {{- /* Case 1: 외부 링크 또는 앵커 링크는 그대로 둠 */}}
  {{- $finalURL = $url -}}
{{- else if strings.HasSuffix $url ".md" -}}
  {{- /* Case 2: 링크가 .md로 끝나는 '페이지'인 경우 */}}
  {{- /* .md를 제거하고 Pretty URL 형식(/)으로 만든 후, Hugo의 페이지 상대경로 함수(relURL)를 사용 */}}
  {{- $finalURL = (strings.TrimSuffix ".md" $url | printf "%s/") | relURL -}}
{{- else -}}
  {{- /* Case 3: 그 외 모든 내부 링크 (PDF, ZIP 등 '리소스') */}}
  {{- /* Hugo의 페이지 로직을 타지 않도록 absURL로 baseURL만 붙여줌 */}}
  {{- $finalURL = $url | absURL -}}
{{- end -}}

<a href="{{ $finalURL | safeURL }}"
   {{- with .Title }} title="{{ . }}"{{ end -}}
   {{- if $isExternal }} target="_blank" rel="noopener noreferrer"{{ end -}}
>
 {{- .Text | safeHTML -}}
</a>
```

## 5. 최종 완성된 워크플로우

1.  **Obsidian (작성):** `../`, `../../` 등 자유로운 상대 경로로 모든 콘텐츠와 리소스를 연결합니다.
2.  **GitHub Actions (전처리):** `git push` 시, 자동화 스크립트가 모든 마크다운 파일 내의 내부 링크를 `/`로 시작하는 **루트 기준 절대 경로로 일괄 치환**합니다. 이 단계가 모든 안정성의 핵심입니다.
3.  **Hugo Build (빌드):**
    -   Hugo는 전처리된 마크다운 파일을 읽습니다.
    -   `![](/media/image.png)`를 만나면, `render-image.html`이 호출됩니다. 이 Hook은 경로가 '리소스'임을 알고 `absURL`을 적용하여 완벽한 전체 URL을 생성합니다.
    -   `[](/notes/post.md)`를 만나면, `render-link.html`이 호출됩니다. 이 Hook은 경로가 `.md`로 끝나는 '페이지'임을 인지하고, Hugo의 `relURL`을 사용하여 올바른 페이지 링크(`https://.../notes/post/`)를 생성합니다.
    -   `[](/files/document.pdf)`를 만나면, `render-link.html`이 호출됩니다. 이 Hook은 경로가 '리소스'임을 인지하고, `absURL`을 사용하여 정확한 파일 경로(`https://.../files/document.pdf`)를 생성합니다.
4.  **GitHub Pages (배포):** 모든 종류의 링크가 각자의 특성에 맞게 올바르게 변환된, 완벽하게 동작하는 정적 사이트가 배포됩니다.
5.  













알겠습니다. Hugo의 Pretty URLs 기능 때문에 발생하는 상대 경로 문제를 다양한 예시를 통해 심층적으로 분석하고, 이를 해결하기 위한 `render-link.html`과 `render-image.html`의 구체적인 구현 방안을 담은 문서를 작성해 드리겠습니다.

문서 이름은 **`hugo_path_resolution.md`** 가 가장 적절합니다.

---

### `hugo_path_resolution.md`

# Hugo 경로 문제 해결 및 Render Hooks 활용 가이드

이 문서는 Obsidian에서 작성한 상대 경로가 Hugo 빌드 과정에서 깨지는 문제를 다양한 예시를 통해 심층적으로 분석하고, Hugo의 Render Hooks를 사용하여 이 문제를 해결하는 기술적인 방법을 설명합니다.

## 3. 해결 전략: 모든 내부 경로의 절대화(Absolutization)

이 모든 문제를 한 번에 해결하는 가장 강력하고 안정적인 방법은, **빌드 시 모든 내부 경로를 사이트 루트(`baseURL`) 기준의 절대 경로로 변환**하는 것입니다.

-   `../c.md` → `/c/`
-   `../../media/sample.jpg` → `/media/sample.jpg`
-   `../B/b.md` → `/B/b/`

이 변환 작업은 Hugo의 **Render Hooks**와 **전처리 스크립트**의 조합으로 자동화할 수 있습니다.

## 4. Render Hooks 구현

**가장 중요한 전제 조건:** GitHub Actions의 **전처리 스크립트**가 `../` 와 같은 상대 경로를 `/` 로 시작하는 루트 기준 절대 경로로 미리 변환해주는 것이 가장 이상적이고 안정적입니다. 예를 들어, 전처리 스크립트가 `../../media/sample.jpg`를 `/media/sample.jpg`로 바꿔주는 작업을 수행한다고 가정합니다.

아래 Render Hooks는 이 전제가 충족되었을 때 최적으로 동작합니다.

### 4.1. `layouts/_default/_markup/render-image.html`

`![]()` 문법으로 작성된 이미지, 비디오, 오디오 등을 올바른 HTML 태그와 절대 경로로 변환합니다.

```html
<!-- layouts/_default/_markup/render-image.html -->
{{- $src := .Destination -}}
{{- $alt := .Text | plainify -}}
{{- $isExternal := strings.HasPrefix $src "http" -}}

{{- if not $isExternal -}}
  {{- /* 전처리 단계에서 /로 시작하는 절대경로로 변환되었다고 가정 */}}
  {{- $src = $src | absURL -}}
{{- end -}}

{{- $ext := path.Ext $src | strings.TrimLeft "." -}}

{{- if eq $ext "mp4" "webm" -}}
<div class="video-container">
  <video controls src="{{ $src }}" title="{{ $alt }}" style="width: 100%; border-radius: 8px;"></video>
</div>
{{- else if eq $ext "mp3" "ogg" "wav" -}}
<audio controls src="{{ $src }}" title="{{ $alt }}"></audio>
{{- else if eq $ext "cast" -}}
  {{- /* asciinema-player.js가 로드되어 있어야 함 */}}
  <asciinema-player src="{{ $src }}" theme="solarized-dark" autoplay loop></asciinema-player>
{{- else if eq $ext "excalidraw" -}}
  {{- /* Excalidraw를 임베드하는 커스텀 로직이 필요하다면 여기에 추가 */}}
  <object data="{{ $src }}" type="image/svg+xml" style="width: 100%;"></object>
{{- else -}}
<img src="{{ $src }}" alt="{{ $alt }}" {{ with .Title }}title="{{ . }}"{{ end }} loading="lazy" style="max-width: 100%; height: auto;" />
{{- end -}}
```

### 4.2. `layouts/_default/_markup/render-link.html`

`[]()` 문법으로 작성된 내부/외부 링크를 올바른 `<a>` 태그로 변환합니다.

```html
<!-- layouts/_default/_markup/render-link.html -->
{{- $url := .Destination -}}
{{- $isExternal := strings.HasPrefix $url "http" -}}
{{- $isAnchor := strings.HasPrefix $url "#" -}}

{{- $finalURL := "" -}}
{{- if or $isExternal $isAnchor -}}
  {{- $finalURL = $url -}}
{{- else -}}
  {{- /* .md 확장자 제거 및 Pretty URL 형태로 변환 */}}
  {{- $cleanedURL := strings.TrimSuffix ".md" $url -}}
  {{- /* 후행 슬래시 추가 */}}
  {{- if not (strings.HasSuffix $cleanedURL "/") -}}
    {{- $cleanedURL = printf "%s/" $cleanedURL -}}
  {{- end -}}
  {{- $finalURL = $cleanedURL | relURL -}}
{{- end -}}

<a href="{{ $finalURL | safeURL }}"
   {{- with .Title }} title="{{ . }}"{{ end -}}
   {{- if $isExternal }} target="_blank" rel="noopener noreferrer"{{ end -}}
>
 {{- .Text | safeHTML -}}
</a>
```

## 5. 최종 권장 워크플로우

1.  **Obsidian (작성):** 경로 깊이를 신경 쓰지 않고 `../`, `../../` 등 자유롭게 상대 경로를 사용하여 문서를 작성합니다.
2.  **GitHub Actions (전처리):** `git push` 시, 자동화 스크립트가 모든 마크다운 파일 내의 내부 링크(`href`, `src`)를 탐색하여 `../`와 같은 상대 경로를 `/`로 시작하는 루트 기준 절대 경로로 **일괄 치환**합니다.
    -   `[c 문서](../c.md)` → `[c 문서](/c.md)`
    -   `![이미지](../../media/sample.jpg)` → `![이미지](/media/sample.jpg)`
3.  **Hugo Build (빌드):** Hugo가 전처리된 마크다운 파일을 읽습니다.
4.  **Render Hooks (변환):**
    -   `render-link.html`은 `/c.md`를 받아 `/c/` 라는 최종 URL로 변환합니다.
    -   `render-image.html`은 `/media/sample.jpg`를 받아 `https://yoursite.com/media/sample.jpg` 라는 최종 URL과 함께 적절한 HTML 태그(`<img>`, `<video>`)를 생성합니다.
5.  **GitHub Pages (배포):** 모든 링크가 완벽하게 동작하는 정적 사이트가 배포됩니다.




절대 경로로 적어도 애초에 hugo 에서 반환하는 값이 틀려서 올바르게 반영하지 못하는 문제를 담아 일반적인 마크다운 파일(변환된 html 경로)은 적절히 반환하는데 이외의 이미지 비디오 같은 것들은 올바르게 주지 않아 나는 content 내부에서 리소스들을 관리해 static 이나 asstes 은 사이트와 관련된 리소스만 존재하고 나머지는 그냥 사용할거야
애초에 모든 변환은 기본적으로 절대경로로 변환할거야 그럼에도 문제가 발생하는 것을 설명해줘
