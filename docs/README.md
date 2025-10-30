# Hugo Site Documentation

이 문서는 Obsidian Vault를 Hugo 정적 사이트로 변환하고 GitHub Pages에 자동 배포하는 전체 시스템을 설명합니다.

## 📍 시작하기

이 프로젝트는 **Obsidian에서 작성한 마크다운 콘텐츠**를 **Hugo 정적 사이트 생성기**로 빌드하여 **GitHub Pages**에 자동 배포하는 완전 자동화된 워크플로우를 제공합니다.

### 🎯 핵심 목표

1. **데이터 소유권**: 순수 Markdown으로 모든 노트 관리 (플랫폼 독립적)
2. **Obsidian 호환성**: Obsidian에서 작성한 모든 링크(내부 문서, 이미지)가 Hugo 사이트에서 깨지지 않음
3. **완전 자동화**: Git push만으로 전체 사이트가 자동 빌드 및 배포
4. **SEO 최적화**: 정적 HTML 생성으로 검색 엔진 최적화 (SPA의 한계 극복)
5. **하이브리드 렌더링**: SSG(Hugo) + CSR(JavaScript)로 최적의 성능과 UX
6. **최소한의 복잡성**: 각 레이어가 명확한 책임을 가지고 필요한 만큼만 사용

> 자세한 설계 배경과 철학은 [DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md)를 참고하세요.

## 🛠️ 기술 스택

### **1. 콘텐츠 작성**
- **Obsidian**: 마크다운 에디터 및 노트 관리 시스템
- **Obsidian Plugins**: (사용 중인 플러그인 목록)
  - Templater (템플릿 자동화)
  - Dataview (데이터 쿼리)
  - Excalidraw (다이어그램)
  - 기타 플러그인...

### **2. 정적 사이트 생성 (SSG)**
- **Hugo**: Go 기반 정적 사이트 생성기 (Extended 버전, 최신 버전)
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크 (기본 스타일)
- **Custom CSS**: 추가 스타일링 (toc.css, prose.css)

### **3. 동적 기능 (클라이언트)**
- **Vanilla JavaScript**: 프레임워크 없는 순수 JavaScript
  - `main.js`: 전역 유틸리티
  - `left-nav.js`: 좌측 네비게이션 인터랙션
  - `content_width.js`: 반응형 레이아웃 조정
  - `toc.js` (향후): 동적 TOC 처리

### **4. CI/CD & 배포**
- **GitHub Actions**: 자동화 워크플로우
- **GitHub Pages**: 정적 사이트 호스팅
- **Python 3.12**: 전처리 스크립트 실행

## 📚 문서 구조

문서는 **콘텐츠 생산에서 배포까지의 워크플로우 순서**로 구성되어 있습니다.

### **최상위 문서 (개요)**
- **[README.md](README.md)** ← 현재 문서
- **[DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md)**: 왜 이런 아키텍처인가? (설계 철학 및 진화 과정)
- **[WORKFLOW_OVERVIEW.md](WORKFLOW_OVERVIEW.md)**: 전체 워크플로우 다이어그램 및 데이터 흐름
- **[CLASSIFICATION_SYSTEM.md](CLASSIFICATION_SYSTEM.md)**: 콘텐츠 분류 체계 (폴더, taxonomy, 향후 확장)

### **단계별 문서**

#### 📝 [01. Content Creation](01-content-creation/)
Obsidian에서 콘텐츠를 작성할 때 알아야 할 모든 규칙
- Obsidian 편집 규칙
- Frontmatter 명세
- 분류 규칙 (폴더/Section, Tags, Categories, Series)
- 콘텐츠 구조화 전략

#### 🔄 [02. Preprocessing](02-preprocessing/)
Hugo 빌드 전 실행되는 전처리 단계
- `pretask.sh` 전체 흐름
- Frontmatter 자동 관리
- Hugo 파일 생성 로직

#### 🏗️ [03. Hugo Build](03-hugo-build/)
Hugo가 콘텐츠를 HTML로 변환하는 과정
- Hugo 설정 (`hugo.toml`)
- 콘텐츠 생성 범위
- 경로 해결 (Render Hooks)
- 템플릿 시스템
- **SEO 최적화** (왜 Hugo가 좌측 Nav를 생성하는가)
- 미디어 처리

#### 🎨 [04. Client-Side Processing](04-client-side/)
브라우저에서 JavaScript로 동적 처리
- Hugo vs JavaScript 책임 분리
- 우측 사이드바 동적 처리
- TOC 향상 계획
- 다크모드, 반응형 레이아웃
- 향후 추가 기능 (댓글 시스템 등)

#### 💬 [05. Backend Integration](05-backend-integration/)
향후 추가될 백엔드 연동
- 댓글 시스템 설계
- API 아키텍처
- 데이터 영속성

#### 🚀 [06. Deployment](06-deployment/)
GitHub Actions를 통한 자동 배포
- GitHub Actions 워크플로우 상세
- GitHub Pages 설정
- 로컬 테스트 방법

#### 📖 [07. Reference](07-reference/)
참조 문서 및 문제 해결
- Hugo 기초 개념
- Frontmatter 필드 레퍼런스
- Tailwind CSS 패턴
- 문제 해결 가이드

## 🚀 Quick Start

### **로컬 개발 환경 설정**

1. **저장소 클론**
   ```bash
   git clone https://github.com/shinnyeonki/hugo_site.git
   cd hugo_site
   ```

2. **Obsidian 콘텐츠 복사**
   ```bash
   # Obsidian vault의 모든 콘텐츠를 content/ 폴더로 복사
   cp -r /path/to/obsidian/vault/* content/
   ```

3. **전처리 실행**
   ```bash
   bash pretask.sh
   ```

4. **Hugo 로컬 서버 실행**
   ```bash
   hugo serve --disableFastRender
   ```

5. **브라우저에서 확인**
   - http://localhost:1313

### **배포 (자동)**

Obsidian vault 저장소에서 변경사항을 push하면 자동으로 배포됩니다:

```bash
cd /path/to/obsidian/vault
git add .
git commit -m "Update content"
git push origin master
```

GitHub Actions가 자동으로:
1. Obsidian vault 체크아웃
2. Hugo site 저장소 클론
3. 콘텐츠 복사
4. 전처리 실행
5. Hugo 빌드
6. GitHub Pages 배포

## 📋 주요 개념

### **두 개의 저장소**

이 프로젝트는 두 개의 독립된 Git 저장소로 구성됩니다:

1. **Obsidian Vault 저장소** (`shinnyeonki/main`)
   - 순수 마크다운 콘텐츠
   - Obsidian 설정 및 플러그인
   - `.github/workflows/hugo_site_deploy.yml` 포함

2. **Hugo Site 저장소** (`shinnyeonki/hugo_site`)
   - Hugo 프로젝트 구조
   - 템플릿 (layouts)
   - 설정 파일 (hugo.toml)
   - 전처리 스크립트 (pretask/)
   - CSS 및 JavaScript

### **콘텐츠 흐름**

```
Obsidian Vault (원본)
    ↓ (git push)
GitHub Actions 트리거
    ↓
Vault → Hugo Site/content/ 복사
    ↓
pretask.sh 전처리
    ↓
Hugo 빌드
    ↓
GitHub Pages 배포
```

### **책임 분리**

| 처리 단계 | 담당 | 역할 |
|----------|------|------|
| **콘텐츠 작성** | Obsidian | 마크다운 작성, 링크 생성 |
| **전처리** | Python Scripts | Frontmatter 관리, 파일 변환 |
| **HTML 생성** | Hugo | 정적 HTML 생성, SEO 최적화 |
| **동적 기능** | JavaScript | 인터랙션, 애니메이션 |
| **데이터 저장** | Backend (향후) | 댓글, 사용자 데이터 |

## 🔑 핵심 파일

### **설정 파일**
- `hugo.toml`: Hugo 전역 설정
- `pretask.sh`: 전처리 스크립트 실행기

### **템플릿**
- `layouts/baseof.html`: 기본 레이아웃 틀
- `layouts/page.html`: 단일 페이지
- `layouts/_markup/render-*.html`: 링크/이미지 경로 변환

### **스타일**
- `static/css/`: Tailwind 빌드 결과 및 커스텀 CSS

### **스크립트**
- `pretask/management_frontmatter.py`: Frontmatter 자동 관리
- `pretask/create_hugo_site_file.py`: Hugo 호환 파일 생성

## 📖 더 알아보기

### **처음 시작하는 경우**
1. [DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md) - 왜 이렇게 만들었는가?
2. [WORKFLOW_OVERVIEW.md](WORKFLOW_OVERVIEW.md) - 전체 흐름 이해
3. [01-content-creation/](01-content-creation/) - 콘텐츠 작성 규칙
4. [06-deployment/local-testing.md](06-deployment/local-testing.md) - 로컬 테스트

### **커스터마이징하는 경우**
1. [03-hugo-build/template-system.md](03-hugo-build/template-system.md) - 템플릿 수정
2. [04-client-side/javascript-architecture.md](04-client-side/javascript-architecture.md) - JS 기능 추가
3. [02-preprocessing/](02-preprocessing/) - 전처리 로직 수정

### **문제가 발생한 경우**
1. [07-reference/troubleshooting.md](07-reference/troubleshooting.md) - 일반적인 문제
2. [03-hugo-build/path-resolution.md](03-hugo-build/path-resolution.md) - 링크 깨짐 문제
3. [06-deployment/deployment-troubleshooting.md](06-deployment/deployment-troubleshooting.md) - 배포 문제

## 🤝 기여하기

이 문서 자체도 개선이 필요합니다:
- 오타나 잘못된 정보 발견 시 수정
- 누락된 내용 추가
- 더 나은 설명 제안

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.

---

**마지막 업데이트**: 2025년 10월 30일
