# 전체 워크플로우 개요

이 문서는 **콘텐츠 생산에서 배포까지의 전체 데이터 흐름**을 상세히 설명합니다.

## 동작 기반 워크플로우 다이어그램
```
┌─────────────────────────────────────────────────────────────────────┐
│                    1️⃣  CONTENT CREATION                             │
│                      (Obsidian Vault)                               │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ 마크다운 파일 작성
                              │ - frontmatter 정의
                              │ - 상대 경로 링크
                              │ - 이미지 삽입
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    Git Push to Master Branch                        │
│                    (Obsidian Vault Repository)                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ GitHub Actions 트리거
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│              📦 GitHub Actions Workflow 시작                         │
│                 (ubuntu-22.04 Runner)                               │
└─────────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ↓                                           ↓
┌──────────────────┐                    ┌──────────────────────┐
│ Checkout Vault   │                    │ Clone Hugo Site      │
│ → obsidian-vault/│                    │ → hugo-site/         │
└──────────────────┘                    └──────────────────────┘
        │                                           │
        └─────────────────────┬─────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    Content Copy                                     │
│              cp obsidian-vault/* → hugo-site/content/               │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    2️⃣  PREPROCESSING                                │
│                      (pretask.sh)                                   │
└─────────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ↓                           ↓
    ┌───────────────────────┐   ┌───────────────────────┐
    │ management_           │   │ create_hugo_          │
    │ frontmatter.py        │   │ site_file.py          │
    │                       │   │                       │
    │ - date 자동 생성        │   │ - 파일명 정규화           │
    │ - 누락 필드 보완         │   │ - Hugo 호환성 보장       │
    │ - 검증                 │   │                       │
    └───────────────────────┘   └───────────────────────┘
                │                           │
                └─────────────┬─────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    3️⃣  HUGO BUILD                                   │
│                 (hugo --minify --baseURL)                           │
└─────────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ↓                     ↓                     ↓
┌──────────────┐    ┌──────────────────┐    ┌─────────────┐
│ Content      │    │ Template         │    │ Static      │
│ Generation   │    │ Processing       │    │ Copy        │
│              │    │                  │    │             │
│ - .md → HTML │    │ - baseof.html    │    │ - CSS       │
│ - Render     │    │ - partials       │    │ - JS        │
│   Hooks      │    │ - sections       │    │ - images    │
│ - Taxonomy   │    │                  │    │             │
└──────────────┘    └──────────────────┘    └─────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ↓
                    ┌──────────────────┐
                    │   public/ 폴더    │
                    │   (빌드 결과물)     │
                    └──────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    6️⃣  DEPLOYMENT                                   │
│                   (GitHub Pages)                                    │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ↓
                    ┌──────────────────┐
                    │  Live Website    │
                    │  https://...     │
                    └──────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│               4️⃣  CLIENT-SIDE PROCESSING                            │
│                    (Browser)                                        │
└─────────────────────────────────────────────────────────────────────┘
        │                     │                     │
        ↓                     ↓                     ↓
┌──────────────┐    ┌──────────────────┐    ┌─────────────┐
│ HTML Load    │    │ JavaScript       │    │ Future:     │
│              │    │ Execution        │    │ Backend API │
│ - Hugo가      │    │                  │    │             │
│   생성한       │    │ - left-nav.js    │    │ 5️⃣  댓글     │
│   완전한       │    │ - content_width  │    │   시스템      │
│   HTML       │    │ - main.js        │    │             │
│              │    │ - (향후) toc.js   │    │             │
└──────────────┘    └──────────────────┘    └─────────────┘
```

## 📍 각 단계 상세 설명

### **1️⃣ Content Creation (콘텐츠 생성)**

**위치**: Obsidian Vault (로컬 또는 동기화된 환경)

**주요 활동**:
- 마크다운 파일 작성 (`.md`)
- Frontmatter 정의 (date, title, tags, categories, series 등)
- 상대 경로로 링크 작성 (`[링크](../path/to/file.md)`)
- 이미지 삽입 (`![이미지](../../08.media/image.png)`)
- 분류 체계에 따라 파일 배치

**출력**: 
- `.md` 파일들
- 미디어 파일들 (주로 `08.media/` 폴더)

**다음 단계로**: Git commit & push → GitHub Actions 트리거

**관련 문서**: 
- [01-content-creation/](01-content-creation/)
- [CLASSIFICATION_SYSTEM.md](CLASSIFICATION_SYSTEM.md)

---

### **2️⃣ Preprocessing (전처리)**

**위치**: GitHub Actions Runner 또는 로컬 (`pretask.sh`)

**실행 순서**:
```bash
#!/bin/bash
python3 ./pretask/management_frontmatter.py
python3 ./pretask/create_hugo_site_file.py
```

#### **2-1. management_frontmatter.py**
**목적**: Frontmatter 자동 관리 및 검증

**주요 작업**:
- `date` 필드가 없으면 파일 생성 시간으로 자동 생성
- 필수 필드 검증 (title, date)
- 잘못된 형식 수정
- YAML 파싱 오류 감지 및 복구

**입력**: `content/**/*.md`
**출력**: 수정된 `.md` 파일 (in-place)

#### **2-2. create_hugo_site_file.py**
**목적**: Hugo 호환 파일 생성

**주요 작업**:
- 파일명 정규화 (특수 문자 처리)
- Hugo가 인식 가능한 형식으로 변환
- 경로 유효성 검증

**입력**: `content/**/*.md`
**출력**: Hugo 호환 파일들

**관련 문서**: 
- [02-preprocessing/](02-preprocessing/)

---

### **3️⃣ Hugo Build (정적 사이트 생성)**

**위치**: GitHub Actions Runner 또는 로컬

**실행 명령**:
```bash
hugo --minify --baseURL "https://shinnyeonki.github.io/obsidian_repo/"
```

#### **3-1. Content Generation (콘텐츠 생성)**

**Hugo가 생성하는 페이지**:

1. **Single Pages** (개별 페이지)
   - `content/post.md` → `public/post/index.html`
   - Template: `page.html` 사용

2. **List Pages** (목록 페이지)
   - `content/posts/` → `public/posts/index.html`
   - Template: `list.html` 또는 `section.html` 사용

3. **Taxonomy Pages**
   - Tags 목록: `public/tags/index.html`
   - 특정 Tag: `public/tags/golang/index.html`
   - Categories, Series 동일

4. **Home Page**
   - `content/_index.md` → `public/index.html`
   - Template: `home.html` 사용

**Render Hooks 적용**:
- `layouts/_markup/render-link.html`: 모든 `[]()`를 가로채서 경로 변환
- `layouts/_markup/render-image.html`: 모든 `![]()`를 가로채서 경로 변환

**왜 Render Hooks가 필요한가?**
- Obsidian의 상대 경로 → Hugo의 절대 경로 변환
- Pretty URLs로 인한 경로 깊이 변화 보정
- 예: `../image.png` → `/path/to/image.png`

#### **3-2. Template Processing (템플릿 처리)**

**템플릿 계층 구조**:
```
baseof.html (기본 틀)
  ├── home.html (홈페이지)
  ├── page.html (단일 페이지)
  ├── list.html (목록)
  ├── section.html (섹션별 커스텀)
  ├── taxonomy.html (taxonomy 목록)
  └── term.html (특정 term)
```

**주요 Partial 컴포넌트**:
- `head/meta.html`: SEO 메타 태그
- `header.html`: 상단 헤더
- `left-nav.html`: **좌측 네비게이션 (Hugo가 생성)**
- `right-sidebar.html`: 우측 사이드바 틀

**왜 좌측 Nav는 Hugo가 생성하는가?**
- **SEO**: 검색 엔진이 크롤링할 수 있도록 서버 사이드에서 완전한 HTML 생성
- **초기 로딩 성능**: JavaScript 실행 전에도 네비게이션 표시
- **접근성**: JavaScript 비활성화 환경에서도 동작
- **구조화된 데이터**: Hugo의 `.Site.Menus`, `.Pages` 활용

#### **3-3. Static Copy (정적 파일 복사)**

**복사되는 파일**:
- `static/css/` → `public/css/`
- `static/js/` → `public/js/`
- `static/images/` → `public/images/`
- 기타 `static/` 내 모든 파일

**출력**: `public/` 폴더 (완전한 정적 사이트)

**관련 문서**: 
- [03-hugo-build/](03-hugo-build/)

---

### **4️⃣ Client-Side Processing (클라이언트 동적 처리)**

**위치**: 사용자의 브라우저

**실행 순서**:
```html
<!-- baseof.html의 하단 -->
<script src="/js/main.js" defer></script>
<script src="/js/util/content_width.js" defer></script>
<script src="/js/left-nav.js" defer></script>
```

#### **Hugo vs JavaScript 책임 분리**

| 항목 | Hugo가 생성 | JavaScript가 처리 |
|------|------------|------------------|
| **좌측 Nav** | ✅ 전체 HTML 생성 | ✅ 토글 인터랙션 (모바일) |
| **우측 Sidebar** | ✅ 틀 (structure) 생성 | 🔜 TOC 동적 하이라이트 |
| **TOC** | ✅ 기본 링크 생성 | 🔜 활성 항목 추적, 스크롤 |
| **콘텐츠** | ✅ 완전한 HTML | ✅ 반응형 너비 조정 |
| **다크모드** | ✅ 초기 클래스 | ✅ 토글 및 저장 |
| **댓글** | ❌ | 🔜 백엔드 API 호출 |

#### **현재 JavaScript 기능**

1. **left-nav.js**
   - 모바일에서 좌측 네비게이션 토글
   - 체크박스 상태 관리
   - 오버레이 클릭 시 닫기

2. **content_width.js**
   - 콘텐츠 영역 너비 동적 조정
   - 반응형 브레이크포인트 처리

3. **main.js**
   - 전역 유틸리티 함수
   - 다크모드 초기화

#### **향후 JavaScript 기능**

1. **우측 TOC 동적 처리** (계획 중)
   - **왜 JavaScript로?**
     - Intersection Observer로 현재 읽고 있는 섹션 추적
     - 부드러운 스크롤 애니메이션
     - 접기/펼치기 인터랙션
   - **Hugo의 역할**: 기본 TOC HTML 구조 제공
   - **JS의 역할**: 동적 동작 추가

2. **검색 기능** (향후)
   - 클라이언트 사이드 검색 (Fuse.js 등)
   - Hugo가 생성한 JSON 인덱스 활용

**관련 문서**: 
- [04-client-side/](04-client-side/)

---

### **5️⃣ Backend Integration (백엔드 연동)** 🔜

**상태**: 향후 구현 예정

**계획된 기능**:

#### **댓글 시스템**
**왜 백엔드가 필요한가?**
- 데이터 영속성 (댓글 저장)
- 인증/인가 (사용자 확인)
- 스팸 방지

**설계**:
- **Post ID**: Frontmatter의 `date` 필드를 URL-safe ID로 변환
  - 예: `2025-01-30T12:00:00+09:00` → `2025-01-30t12-00-00-09-00`
  - 또는 Base64 인코딩
- **API 엔드포인트**:
  - `GET /api/comments/:postId`: 댓글 목록 조회
  - `POST /api/comments/:postId`: 댓글 작성
  - `DELETE /api/comments/:commentId`: 댓글 삭제

**관련 문서**: 
- [05-backend-integration/comment-system.md](05-backend-integration/comment-system.md)

---

### **6️⃣ Deployment (배포)**

**위치**: GitHub Actions → GitHub Pages

#### **GitHub Actions 워크플로우 단계**

**트리거**:
```yaml
on:
  push:
    branches: ["master"]
  workflow_dispatch:
```

**주요 Steps**:

1. **Checkout Obsidian Vault** (`actions/checkout@v4`)
   - Obsidian vault 저장소를 `obsidian-vault/` 폴더로 체크아웃
   - 이 저장소에 `.github/workflows/hugo_site_deploy.yml` 존재

2. **Clone Hugo Site**
   ```bash
   git clone --depth=1 https://github.com/shinnyeonki/hugo_site.git hugo-site
   ```

3. **Copy Content**
   ```bash
   mkdir -p hugo-site/content/
   rm obsidian-vault/index.html  # Obsidian 자동 생성 파일 제거
   cp -r obsidian-vault/* hugo-site/content/
   ```

4. **Setup Python** (`actions/setup-python@v5`)
   - Python 3.12 설치

5. **Run Preprocessing**
   ```bash
   cd hugo-site
   bash pretask.sh
   ```

6. **Setup Hugo** (`peaceiris/actions-hugo@v3`)
   - Hugo Extended 최신 버전 설치

7. **Build Hugo Site**
   ```bash
   hugo --minify --baseURL "https://shinnyeonki.github.io/main/"
   ```

8. **Deploy to GitHub Pages** (`actions/deploy-pages@v4`)
   - `hugo-site/public/` 폴더를 GitHub Pages로 배포

**권한 설정**:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

**동시성 제어**:
```yaml
concurrency:
  group: "pages"
  cancel-in-progress: true
```

**배포 URL**: `https://shinnyeonki.github.io/main/`

**관련 문서**: 
- [06-deployment/](06-deployment/)

---

## 🔄 데이터 흐름 요약

### **파일 경로 변화**

```
[Obsidian Vault]
content/
├── 01.publish/
│   └── my-post.md
└── 08.media/
    └── image.png

        ↓ (git push)

[GitHub Actions: obsidian-vault/]
obsidian-vault/
├── 01.publish/
│   └── my-post.md
└── 08.media/
    └── image.png

        ↓ (copy)

[GitHub Actions: hugo-site/content/]
hugo-site/content/
├── 01.publish/
│   └── my-post.md
└── 08.media/
    └── image.png

        ↓ (pretask.sh)

[전처리 후]
hugo-site/content/
├── 01.publish/
│   ├── _index.md (모든 폴더는 섹션화)
│   └── my-post.md  (frontmatter 보완)
└── 08.media/
    ├── _index.md (모든 폴더는 섹션화)
    └── image.png

        ↓ (hugo build)

[빌드 결과]
hugo-site/public/
├── 01.publish/
│   ├── _index.html (섹션 페이지)
│   └── my-post/
│       └── index.html
├── 08.media/
│   ├── _index.html (섹션 페이지)
│   └── image.png
├── css/
├── js/
└── index.html

        ↓ (deploy)

[GitHub Pages]
https://shinnyeonki.github.io/main/
├── 01.publish/my-post/
├── 08.media/image.png
└── ...
```

### **링크 경로 변환 예시**

**Obsidian에서 작성** (`content/01.publish/my-post.md`):
```markdown
![이미지](../../08.media/image.png)
[다른 글](../another-post.md)
```

**Hugo Render Hook 처리**:
hugo 는 렌더링할 md 파일을 디렉토리화 하기 때문에 경로가 변경됩니다.
이때문에 여러가지 참조의 문제가 발생합니다.
- md -> md 링크 : 2파일 모두 경로가 변경되지만 hugo 에서 리소스의 경로를 변환해주는 함수가 존재하므로 문제가 없습니다
- md -> resource(jpg, png, pdf) : 참조하는 기존 리소스 파일들의 경로를 한번더 깊게  변경해야 합니다. (단 page resource : 폴더와 동일한 위치의 리소스 파일은 제외)
- `../../08.media/image.png` → `../../../08.media/image.png` (상대 경로)
- `../another-post.md` → `/01.publish/another-post/` (Pretty URL)

**최종 HTML** (`public/01.publish/my-post/index.html`):
```html
<img src="../../../08.media/image.png" alt="이미지">
<a href="/01.publish/another-post/">다른 글</a>
```

---

## ⏱️ 전체 워크플로우 소요 시간

| 단계 | 소요 시간 (예상) |
|------|----------------|
| Git Push | 즉시 |
| GitHub Actions 시작 | ~10초 |
| Checkout & Clone | ~30초 |
| Preprocessing | ~5초 (콘텐츠 양에 따라) |
| Hugo Build | ~30초 (콘텐츠 양에 따라) |
| Deploy to Pages | ~30초 |
| **총** | **~1-2분** |

---

## 🎯 워크플로우 최적화 포인트

### **현재 최적화**
- ✅ `--depth=1`: Git clone 시 히스토리 최소화
- ✅ `--minify`: HTML/CSS/JS 압축
- ✅ `cancel-in-progress`: 중복 빌드 방지

### **향후 개선 가능**
- 📋 캐싱: Hugo 빌드 캐시 활용
- 📋 증분 빌드: 변경된 파일만 재빌드
- 📋 이미지 최적화: WebP 변환, lazy loading

---

## 🔍 트러블슈팅

### **빌드 실패 시 체크리스트**

1. **Frontmatter 오류**
   - YAML 문법 오류 확인
   - 필수 필드 존재 확인

2. **경로 문제**
   - 상대 경로 올바른지 확인
   - 파일 존재 여부 확인

3. **Python 스크립트 오류**
   - `pretask.sh` 로그 확인
   - 파일 인코딩 확인 (UTF-8)

4. **Hugo 빌드 오류**
   - Template 문법 오류
   - Shortcode 오류

**관련 문서**: 
- [07-reference/troubleshooting.md](07-reference/troubleshooting.md)
- [06-deployment/deployment-troubleshooting.md](06-deployment/deployment-troubleshooting.md)

---

**마지막 업데이트**: 2025년 10월 30일
