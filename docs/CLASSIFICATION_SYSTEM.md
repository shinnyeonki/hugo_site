# 콘텐츠 분류 체계

이 문서는 **Obsidian Vault 내에서 콘텐츠를 어떻게 조직하고 분류하는지**에 대한 전체 시스템을 설명합니다.

## 🎯 분류의 목적

콘텐츠를 효과적으로 분류하면:
- ✅ **검색성 향상**: 원하는 콘텐츠를 빠르게 찾을 수 있음
- ✅ **관계 파악**: 관련 콘텐츠 간의 연결성 확인
- ✅ **자동 생성**: Hugo가 자동으로 목록 페이지, 태그 페이지 생성
- ✅ **유지보수**: 콘텐츠 구조를 체계적으로 관리
- ✅ **확장성**: 새로운 분류 체계를 추가할 수 있는 유연성

## 📊 분류 체계 개요

이 프로젝트는 **3가지 주요 분류 축**을 사용합니다:

```
분류 체계
│
├── 1️⃣ 폴더 구조 (Sections)      ← 물리적 위치, 콘텐츠 상태
│   └── Hugo의 Section 시스템 활용
│
├── 2️⃣ Taxonomy (메타데이터)      ← 논리적 분류
│   ├── Tags         (키워드, 자유로운 태깅)
│   ├── Categories   (주제별 큰 분류)
│   └── Series       (연속된 시리즈)
│
└── 3️⃣ 향후 확장 가능 (Future)    ← 필요에 따라 추가
    ├── Authors      (다중 작성자)
    ├── Projects     (프로젝트별)
    ├── Status       (draft, published, archived)
    └── Custom...    (커스텀 분류)
```

---

## 1️⃣ 폴더 구조 (Sections)

### **개념**

- **물리적 위치**: 파일 시스템 상의 실제 폴더
- **Hugo Section**: Hugo는 `content/` 하위의 각 폴더를 "Section"으로 인식
- **용도**: 콘텐츠의 상태, 성격, 타입에 따라 구분

### **현재 폴더 구조**

```
content/
│
├── 00.Data View and Bases/        # Dataview 쿼리 결과 페이지
├── 01.publish/                    # ⭐ 공개 발행된 글
│   ├── tech/                      # 기술 관련
│   ├── life/                      # 일상/생각
│   └── ...
│
├── 02.inbox/                      # 📥 작성 중인 글 (초안)
│   └── drafts/
│
├── 04.Excalidraw/                 # 🎨 다이어그램 및 스케치
│   └── *.excalidraw
│
├── 05.clipping/                   # 📰 외부 아티클 클리핑
│   └── web-clippings/
│
├── 06.University/                 # 🎓 대학 강의 노트
│   ├── 딥러닝/
│   ├── 네트워크/
│   └── 알고리즘/
│
├── 07.Daily Note/                 # 📅 데일리 노트
│   └── 2025/
│       └── 01/
│
├── 08.media/                      # 🖼️ 미디어 중앙 저장소
│   ├── images/
│   ├── attachments/
│   └── *.png, *.pdf, ...
│
├── 89.Obsidian/                   # ⚙️ Obsidian 설정 및 템플릿
│   ├── templates/
│   └── snippets/
│
├── copilot/                       # 🤖 AI 대화 기록
├── Leetcode sql 문제 풀기/        # 💻 코딩 문제
├── markdown test/                 # 🧪 테스트 페이지
├── Prompt/                        # 💡 프롬프트 모음
└── ...
```

### **폴더 명명 규칙**

#### **번호 Prefix (선택사항)**
```
00. ~ 99.  숫자 prefix는 정렬 순서를 제어
```

**예시**:
- `01.publish/`: 가장 먼저 표시
- `08.media/`: 특정 위치에 고정
- `89.Obsidian/`: 마지막에 표시

#### **이름 규칙**
- **영문**: 권장 (URL-friendly)
- **한글**: 가능 (Hugo가 자동으로 URL 인코딩)
- **공백**: 가능하지만 하이픈(`-`) 또는 언더스코어(`_`) 권장
- **특수문자**: 피하기 (Hugo 빌드 오류 가능성)

### **Section의 Hugo 활용**

Hugo는 각 Section에 대해 자동으로:

1. **List Page 생성**
   - `content/01.publish/` → `public/01.publish/index.html`
   - 해당 Section의 모든 페이지 목록 표시

2. **Section Template 적용**
   - `layouts/01.publish/list.html` (있으면 커스텀)
   - `layouts/_default/list.html` (기본)

3. **Navigation 구조 생성**
   - `.Site.Sections`로 모든 Section 접근 가능
   - 좌측 네비게이션 자동 생성에 활용

**예시**:
```go-template
{{ range .Site.Sections }}
  <a href="{{ .RelPermalink }}">{{ .Title }}</a>
{{ end }}
```

### **폴더 사용 가이드**

#### **어디에 파일을 둘 것인가?**

| 콘텐츠 유형 | 폴더 | 이유 |
|------------|------|------|
| 공개 블로그 글 | `01.publish/` | 메인 콘텐츠 |
| 작성 중인 초안 | `02.inbox/` | 미완성 글 |
| 대학 강의 노트 | `06.University/` | 학습 자료 |
| 데일리 노트 | `07.Daily Note/` | 날짜별 기록 |
| 이미지, PDF 등 | `08.media/` | 미디어 중앙 관리 |
| 코딩 문제 풀이 | `Leetcode sql 문제 풀기/` 등 | 특정 주제별 |

#### **미디어 파일 위치 규칙**

**원칙**: 가능한 모든 미디어는 `08.media/` 폴더에 중앙 관리

**장점**:
- 중복 방지
- 일관된 관리
- 백업 용이

**예외**: 
- Page Bundle 사용 시 (특정 글에만 속한 이미지)
  ```
  01.publish/
  └── my-post/
      ├── index.md
      └── image.png  # 이 글에만 사용되는 이미지
  ```

**링크 방법**:
```markdown
<!-- 중앙 미디어 저장소 사용 -->
![이미지](../../08.media/image.png)

<!-- Page Bundle 사용 -->
![이미지](./image.png)
```

---

## 2️⃣ Taxonomy (분류 메타데이터)

### **개념**

- **메타데이터 기반**: Frontmatter에 정의
- **다차원 분류**: 하나의 글이 여러 분류에 속할 수 있음
- **자동 페이지 생성**: Hugo가 자동으로 Taxonomy 페이지 생성

### **현재 Taxonomy 설정**

`hugo.toml` 설정:
```toml
[taxonomies]
  tag = "tags"
  category = "categories"
  series = "series"
```

### **2-1. Tags (태그)**

**용도**: 키워드, 기술 스택, 자유로운 태깅

**특징**:
- 세밀한 분류
- 여러 개 사용 가능
- 검색 키워드로 활용

**사용 예시**:
```yaml
---
title: "Docker로 개발 환경 구축하기"
tags:
  - docker
  - devops
  - container
  - linux
---
```

**자동 생성 페이지**:
- 모든 태그 목록: `https://site.com/tags/`
- 특정 태그 페이지: `https://site.com/tags/docker/`

**명명 규칙**:
- **소문자**: 권장 (`docker`, `javascript`)
- **하이픈**: 여러 단어 (`machine-learning`, `web-development`)
- **일관성**: 동일한 개념은 동일한 태그 (`js` vs `javascript` 통일)

### **2-2. Categories (카테고리)**

**용도**: 주제별 큰 분류, 콘텐츠 타입

**특징**:
- 넓은 분류 (보통 1-2개)
- 계층 구조 가능
- 사이트 주요 네비게이션

**사용 예시**:
```yaml
---
title: "React Hooks 완벽 가이드"
categories:
  - Web Development
  - Frontend
---
```

**자동 생성 페이지**:
- 모든 카테고리: `https://site.com/categories/`
- 특정 카테고리: `https://site.com/categories/web-development/`

**권장 카테고리 예시**:
```
- Programming
  - Frontend
  - Backend
  - Mobile
- Computer Science
  - Algorithm
  - Data Structure
  - Operating System
- Life
  - Essay
  - Review
- University
  - Lecture Note
  - Assignment
```

### **2-3. Series (시리즈)**

**용도**: 연속된 글 묶음, 튜토리얼 시리즈

**특징**:
- 순서가 있는 콘텐츠
- 전/후 편 연결
- 완독률 추적 가능

**사용 예시**:
```yaml
---
title: "React 시리즈 #3 - State 관리"
series:
  - React 완벽 가이드
weight: 3  # 시리즈 내 순서
---
```

**자동 생성 페이지**:
- 모든 시리즈: `https://site.com/series/`
- 특정 시리즈: `https://site.com/series/react-완벽-가이드/`

**Hugo에서 시리즈 활용**:
```go-template
{{ if .Params.series }}
  <div class="series-nav">
    {{ range where .Site.RegularPages "Params.series" "intersect" .Params.series }}
      <a href="{{ .RelPermalink }}">{{ .Title }}</a>
    {{ end }}
  </div>
{{ end }}
```

### **Taxonomy 사용 가이드**

#### **언제 무엇을 사용할까?**

| 질문 | 사용할 Taxonomy |
|------|----------------|
| 이 글의 주제는? | **Categories** |
| 어떤 기술을 다루나? | **Tags** |
| 연속된 글인가? | **Series** |

**예시**:
```yaml
---
title: "Django REST Framework로 API 만들기 #1"
categories:
  - Backend
tags:
  - python
  - django
  - rest-api
  - web-development
series:
  - Django 백엔드 개발
weight: 1
---
```

#### **태그 vs 카테고리 선택 기준**

| 기준 | Tags | Categories |
|------|------|-----------|
| **개수** | 많음 (5-10개) | 적음 (1-2개) |
| **범위** | 좁고 구체적 | 넓고 포괄적 |
| **변경** | 자주 추가 | 거의 고정 |
| **예시** | `docker`, `k8s`, `cicd` | `DevOps` |

---

## 3️⃣ 향후 확장 가능한 분류

### **추가 가능한 Taxonomy**

#### **Authors (작성자)**
**용도**: 다중 작성자 블로그

```toml
# hugo.toml
[taxonomies]
  author = "authors"
```

```yaml
---
title: "공동 작성한 글"
authors:
  - 신년기
  - 협업자
---
```

#### **Projects (프로젝트)**
**용도**: 특정 프로젝트별 문서화

```toml
[taxonomies]
  project = "projects"
```

```yaml
---
title: "프로젝트 A 개발 로그"
projects:
  - Project Alpha
  - Internal Tool
---
```

#### **Status (상태)**
**용도**: 콘텐츠 상태 관리

```toml
[taxonomies]
  status = "statuses"
```

```yaml
---
title: "작성 중인 글"
status: draft  # draft, published, archived, outdated
---
```

#### **Type (타입)**
**용도**: 콘텐츠 포맷 구분

```yaml
---
title: "튜토리얼"
type: tutorial  # tutorial, guide, reference, example
---
```

### **커스텀 Taxonomy 추가 방법**

1. **hugo.toml에 등록**
   ```toml
   [taxonomies]
     tag = "tags"
     category = "categories"
     series = "series"
     myTaxonomy = "myTaxonomies"  # 추가
   ```

2. **Frontmatter에 사용**
   ```yaml
   ---
   myTaxonomies:
     - value1
     - value2
   ---
   ```

3. **Template 생성** (선택사항)
   ```
   layouts/
   └── myTaxonomies/
       ├── list.html      # 모든 taxonomy 목록
       └── term.html      # 특정 term 페이지
   ```

---

## 🎨 분류 체계 활용 예시

### **Case 1: 기술 블로그 글**

```yaml
---
title: "Kubernetes 클러스터 구축 완벽 가이드"
date: 2025-01-30T10:00:00+09:00

# 폴더: 01.publish/tech/devops/

# 카테고리: 큰 주제
categories:
  - DevOps
  - Cloud

# 태그: 세부 기술
tags:
  - kubernetes
  - k8s
  - docker
  - container
  - orchestration
  - gcp
  - cloud-native

# 시리즈: 없음 (단일 글)
---
```

**결과**:
- 폴더: `https://site.com/01.publish/tech/devops/`
- 카테고리: `https://site.com/categories/devops/`
- 태그: `https://site.com/tags/kubernetes/`, `/tags/docker/` 등

### **Case 2: 연속 튜토리얼**

```yaml
---
title: "React 완벽 가이드 #1 - 환경 설정"
date: 2025-01-15T10:00:00+09:00

# 폴더: 01.publish/tutorials/react/

categories:
  - Frontend

tags:
  - react
  - javascript
  - jsx
  - node.js

series:
  - React 완벽 가이드

weight: 1  # 시리즈 내 순서
---
```

**시리즈 다른 글들**:
```yaml
---
title: "React 완벽 가이드 #2 - 컴포넌트"
series:
  - React 완벽 가이드
weight: 2
---

---
title: "React 완벽 가이드 #3 - State 관리"
series:
  - React 완벽 가이드
weight: 3
---
```

**결과**:
- 시리즈 페이지: `https://site.com/series/react-완벽-가이드/`
- 전체 시리즈 글 목록 자동 표시
- 이전/다음 글 네비게이션

### **Case 3: 대학 강의 노트**

```yaml
---
title: "네트워크 하향식 접근 - Chapter 3 요약"
date: 2025-01-20T14:00:00+09:00

# 폴더: 06.University/네트워크/

categories:
  - University
  - Computer Science

tags:
  - network
  - tcp-ip
  - transport-layer
  - lecture-note

series:
  - 네트워크 하향식 접근 강의

weight: 3
---
```

---

## 📊 분류 체계 베스트 프랙티스

### ✅ **DO**

1. **일관성 유지**
   ```yaml
   # Good
   tags: [python, django, flask]
   
   # Bad (대소문자 혼용)
   tags: [Python, Django, flask]
   ```

2. **명확한 이름 사용**
   ```yaml
   # Good
   categories: [Web Development]
   
   # Bad (모호함)
   categories: [Dev]
   ```

3. **적절한 개수**
   ```yaml
   # Good
   tags: [react, hooks, state-management, typescript]
   
   # Bad (너무 많음)
   tags: [react, hooks, state, management, typescript, javascript, 
          web, frontend, development, coding, programming, ...]
   ```

4. **계층 구조 활용**
   ```
   categories:
     Programming
       ├── Frontend
       └── Backend
   ```

### ❌ **DON'T**

1. **태그와 카테고리 혼용하지 않기**
   ```yaml
   # Bad
   categories: [Python]  # 이건 태그여야 함
   tags: [Programming]   # 이건 카테고리여야 함
   ```

2. **중복 분류 피하기**
   ```yaml
   # Bad
   tags: [js, javascript, JavaScript, JS]  # 하나만 사용
   ```

3. **너무 세분화하지 않기**
   ```yaml
   # Bad
   tags: [react-hooks-useState, react-hooks-useEffect, ...]
   
   # Good
   tags: [react, hooks]
   ```

---

## 🔍 분류 체계 검증

### **체크리스트**

- [ ] 모든 `01.publish/` 글에 카테고리가 있는가?
- [ ] 태그가 일관된 명명 규칙을 따르는가?
- [ ] 시리즈 글에 weight가 올바르게 설정되었는가?
- [ ] 미디어 파일이 `08.media/` 또는 Page Bundle에 있는가?
- [ ] 폴더 이름이 URL-friendly한가?

### **자동 검증 스크립트** (향후)

```python
# pretask/validate_taxonomy.py
def validate_frontmatter(md_file):
    # 카테고리 필수 체크
    # 태그 형식 검증
    # 시리즈 weight 중복 확인
    pass
```

---

## 📈 분류 체계 발전 방향

### **Phase 1 (현재)**
- ✅ 폴더 구조 (Sections)
- ✅ Tags, Categories, Series

### **Phase 2 (단기)**
- 📋 Authors (다중 작성자)
- 📋 Projects (프로젝트별 문서)

### **Phase 3 (중기)**
- 📋 Language (다국어 지원)
- 📋 Difficulty (난이도)
- 📋 Type (콘텐츠 타입)

### **Phase 4 (장기)**
- 📋 AI 기반 자동 태깅
- 📋 관련 글 추천 시스템
- 📋 태그 계층 구조

---

## 🔗 관련 문서

- [01-content-creation/obsidian-editing-rules.md](01-content-creation/obsidian-editing-rules.md) - 콘텐츠 작성 규칙
- [01-content-creation/frontmatter-specification.md](01-content-creation/frontmatter-specification.md) - Frontmatter 명세
- [03-hugo-build/hugo-config.md](03-hugo-build/hugo-config.md) - Hugo Taxonomy 설정
- [03-hugo-build/template-system.md](03-hugo-build/template-system.md) - Taxonomy 템플릿

---

**마지막 업데이트**: 2025년 10월 30일
