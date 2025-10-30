# 설계 철학 및 원칙

이 문서는 **왜 이런 아키텍처를 선택했는가**에 대한 근본적인 이유와 철학을 설명합니다.

## 🎯 핵심 질문

> "왜 단순한 블로그 하나를 만드는데 SSG(Hugo) + CSR(JavaScript) + 백엔드(향후)를 모두 사용하는가?"

이 질문에 답하기 위해서는 이 프로젝트의 **진화 과정**과 **각 단계에서 마주한 문제**를 이해해야 합니다.

---

## 📚 Phase 1: 메모 관리의 여정

### **문제: 노트 플랫폼 이동의 악몽**

나는 평소 공부나 여러 가지를 기록하는 습관이 있다.
그러면서 여러번 노트 플랫폼을 이동한 경험이 있다:

```
OneNote → Notion → Obsidian (현재)
```

**각 플랫폼에서 겪은 문제**:

1. **데이터 소유권 부재**
   - 내가 작성한 콘텐츠인데도 완전히 내 것이 아닌 느낌
   - 플랫폼이 종료되거나 정책이 변경되면 속수무책

2. **Export의 고통**
   - PDF로 받으면 편집 불가능
   - HTML로 받으면 스타일이 깨짐
   - 다른 플랫폼으로 이동할 때마다 데이터 손실

3. **플랫폼 종속성**
   - 각 플랫폼의 독자적인 문법과 기능
   - 다른 곳으로 이동하면 모든 것을 다시 배워야 함

### **해결: 순수 Markdown으로 회귀**

이러한 경험 후 내린 결론:

> **순수한 Markdown을 사용하면 장기적으로 일관성 있게 메모를 정리할 수 있다.**

**Markdown을 선택한 이유**:

1. **표준 문법**: [Markdown Syntax](https://www.markdownguide.org/) - 1990년대부터 사용되어 온 검증된 표준
2. **완전한 소유권**: `.md` 파일은 순수 텍스트 파일
3. **플랫폼 독립적**: 어떤 에디터에서도 열 수 있음
4. **Git 버전 관리 가능**: 텍스트 파일이므로 diff, merge 가능
5. **미래 보장**: 단순 text 파일이므로 순수하게 읽을 수 있음

### **Obsidian 선택과 제약**

**왜 Obsidian인가?**
- 로컬 우선 (Local-first): 모든 데이터가 내 컴퓨터에
- Vault = 폴더: 실제로는 그냥 폴더 구조
- 강력한 플러그인 생태계
- 하지만 **순수 Markdown 유지**

**중요한 원칙**:
```markdown
❌ Obsidian 독자 문법 사용 안 함
   - [[wikilink]] 사용 안 함
   - Obsidian 전용 문법 피함

✅ 표준 Markdown만 사용
   - [링크](./path/to/file.md)
   - ![이미지](./path/to/image.png)
   - Frontmatter만 추가 대부분의 markdown 기반의 노트앱들과 호환
   - ![]() 문법의 경우 이미지를 렌더링하기 위한 문법이지만 나의 경우 비디오, 오디오, PDF 등 다양한 미디어를 포함하기 위해 확장 사용
```

**이유**: Obsidian을 떠나도 모든 노트가 그대로 동작해야 함

---

## 🌐 Phase 2: 사이트 구축 - SPA의 시도와 한계

### **문제: 공유하고 싶다**

Obsidian으로 메모를 정리하다 보니 자연스럽게 생각이 들었다:

> "이 내용을 다른 사람들에게도 보여주고 싶다."

**선택지**:
- 브런치, 티스토리, 네이버 블로그 등
- 하지만... **나만의 사이트로 만들고 싶었다** (+ 광고도 적당히 붙이고)

### **첫 번째 시도: 완전한 SPA (Single Page Application)**

**설계 철학**: 백엔드 없이 모든 것을 브라우저에서, index.html 하나로 모든 것을 공유(가려야 하는 것은 .ignore_deploy 파일(git ignore 문법)을 만들어 제외)

#### **왜 백엔드를 두지 않으려 했는가?**

1. **관리 부담**
   - 서버 유지보수 비용 (시간 + 돈)
   - 데이터베이스 관리
   - 보안 업데이트
   - 트래픽 관리

2. **초기 목적**
   - 단순히 "공유"가 목적
   - 댓글, 사용자 관리 등 불필요
   - 정적 호스팅 (GitHub Pages)이면 충분

#### **SPA 아키텍처 설계**

**핵심 아이디어**: 모든 처리를 클라이언트(브라우저)에서

```
사용자 브라우저
  ↓
1. index.html 로드
  ↓
2. 사전 생성된 인덱스 JSON 파일 로드 ( 파일 인덱스, 검색 인덱스, tag 인덱스, graph 인덱스 )
  ↓
3. 좌측 네비게이션(사이트 전체) 렌더링 (파일별 트리, 검색 트리, tag 트리, recent 트리)
  ↓
4. 특정 파일을 클릭하면 Markdown 파일 fetch
  ↓
5. JavaScript로 Markdown → HTML 변환 (marked.js)
  ↓
6. 코드 하이라이팅 (highlight.js), LaTeX 렌더링 (KaTeX) 및 추가 기능 추가
  ↓
7. 우측 패널 렌더링 (목차, 태그, 메타데이터, 링크모음)
```

**데이터 소스 구조**:
```javascript
// Python 스크립트로 미리 생성
1. file_index.json    → .src/js/ui/file-tree.js (파일 트리)
2. search_index.json  → .src/js/ui/search.js (검색 엔진)
3. graph_index.json   → .src/js/ui/graph.js (그래프 뷰 기능)
4. recent_index.json  → .src/js/ui/recent.js (최근 문서 탭 기능)
5. tag_index.json     → .src/js/ui/tag.js (태그 클라우드/목록 기능)
```

**장점**:
- ✅ 백엔드 불필요
- ✅ 호스팅 비용 제로 (GitHub Pages)
- ✅ 무한한 커스터마이징 가능성

### **SPA의 치명적인 한계들**

#### **1. SEO (Search Engine Optimization) 문제**

블로그의 특성상 **거의 모든 트래픽이 Google 검색에서 발생**한다.
최근 google 검색엔진이 javascript 렌더링을 어느 정도 지원한다고 하지만, 여전히 한계가 많다. path 기반으로 특정 페이지임을 나타내야 하지만 서버측 웹서버 설정 변경없이는 해결이 힘들다 이것 또한 404.html 으로 처리한다고는 하지만 이러한 것들이 검색엔진의 인덱스 생성에 큰 장애물이 된다.

**SPA의 SEO 문제**:

```html
<!-- 검색 엔진이 보는 초기 HTML 예시-->
<html>
  <head>
    <title>Loading...</title>
  </head>
  <body>
    <div id="root"></div>
    <!-- 내용이 없음! -->
    <script src="app.js"></script>
  </body>
</html>
```

**문제점**:
1. **Markdown → HTML 변환 시간 차**
   - 서버에 Markdown 파일 요청 (비동기)
   - JavaScript로 파싱 및 렌더링
   - 검색 엔진 크롤러는 이 과정을 기다려주지 않음

2. **의미 없는 초기 HTML**
   - JavaScript 해석 전에는 `<div id="root"></div>`만 존재
   - 검색 엔진은 "빈 페이지"로 인식

3. **메타 태그 동적 생성의 한계**
   - `<meta>` 태그를 JavaScript로 동적 생성
   - 크롤러가 인식하지 못함

**시도한 해결책들과 한계**:
```javascript
// HTML5 History API
window.history.pushState({}, '', '/post/my-article');
// → 크롤러는 여전히 초기 HTML만 봄

// Server-Side Rendering 시뮬레이션
// → 결국 서버가 필요함 (본래 목적과 모순)

// Pre-rendering
// → 모든 페이지를 미리 렌더링? 그럼 SSG가 낫지 않나?
```

#### **2. 비동기 처리의 복잡성 폭발**

기능이 늘어날수록 비동기 처리가 기하급수적으로 증가:  
아래는 페이지 로드 시나리오의 시나리오를 매우 단순화한 예시이다.
```javascript
// 페이지 로드 시나리오
Promise.all([
  fetchMarkdown(),
  loadSearchIndex(),
  loadFileTree(),
  loadGraphData(),
  loadRecentPosts(),
  loadTagCloud()
])
.then(() => {
  return parseMarkdown();
})
.then((html) => {
  renderHTML(html);
  return Promise.all([
    highlightCode(),
    renderMath(),
    renderDiagrams(),
    loadComments(),
    trackAnalytics()
  ]);
})
.then(() => {
  // 이제 TOC 생성 가능
  generateTOC();
  // 이제 링크 처리 가능
  processInternalLinks();
  // ...
})
.catch(handleError);
```

**문제점**:
- 의존성 지옥: A가 끝나야 B 시작 가능
- 우선순위 관리: 무엇을 먼저 보여줄 것인가?
- 디버깅 어려움: 어디서 실패했는지 추적 곤란
- **개발 난이도 폭증**: 혼자 감당하기 어려움

#### **3. 기능 추가의 고통**

각 기능을 추가할 때마다 **모든 규칙을 직접 정의**해야 함:

**예시: YouTube 임베딩**
```javascript
// Markdown에서 YouTube 링크 감지
// → iframe 생성
// → 반응형 크기 조정
// → Lazy loading 구현
// → 에러 처리
// → ...모든 것을 직접 구현
```

**예시: Excalidraw 다이어그램**
```javascript
// .excalidraw 파일 파싱
// → Excalidraw 라이브러리 로드
// → SVG로 렌더링
// → 반응형 처리
// → ...역시 모든 것을 직접
```

**문제**:
- 바퀴를 계속 재발명
- 표준이 없음 (내가 만든 규칙)
- 유지보수 부담
- **점점 힘이 부침**

#### **4. "이럴 거면 그냥..." 순간**

SPA를 계속 개선하려다 깨달은 순간:

```
문제: SEO가 안 됨
→ 해결: Pre-rendering 하자
→ 생각: 모든 페이지를 미리 HTML로?
→ 깨달음: 이럴거면 이미 잘 나와 있는 static site 생성기를 쓰면 되는거 아닌가?

문제: 기능마다 직접 구현
→ 해결: 프레임워크를 쓰자
→ 생각: 근데 SSG 프레임워크가 이미 다 있는데?
→ 깨달음: Hugo에서 다른 사람들이 해결한 것들 즉 포럼을 보면서 도움을 받을 수 있다는 점이다.
```

---

## 🏗️ Phase 3: Hugo (SSG)로의 전환

### **왜 Hugo인가?**

SPA의 한계를 겪으면서 내린 결론:

> **"빌드 타임에 모든 것을 처리하자"**

**Hugo의 장점이 내 문제를 해결**:

| 내가 겪은 문제 | Hugo의 해결책 |
|--------------|--------------|
| SEO 안 됨 | ✅ 완전한 HTML을 미리 생성 |
| 비동기 지옥 | ✅ 빌드 타임에 모두 처리 |
| 직접 구현 부담 | ✅ 템플릿 시스템, Shortcodes |
| Markdown 파싱 | ✅ 내장 Markdown 엔진 |
| 코드 하이라이팅 | ✅ 내장 Chroma |
| 경로 관리 | ✅ Render Hooks |
| Taxonomy | ✅ 자동 Tags/Categories 페이지 |

### **Hugo로 해결된 것들**

#### **1. 완벽한 SEO**

```html
<!-- Hugo가 생성한 HTML (빌드 타임) -->
<html>
  <head>
    <title>실제 제목</title>
    <meta name="description" content="실제 내용 요약">
    <meta property="og:title" content="...">
    <!-- 모든 메타 태그가 이미 존재 -->
  </head>
  <body>
    <!-- 완전한 콘텐츠가 이미 HTML로 존재 -->
    <h1>제목</h1>
    <p>본문 내용...</p>
  </body>
</html>
```

검색 엔진이 보는 것 = 사용자가 보는 것

#### **2. 경로 문제 해결 (Render Hooks)**

**내가 작성** (Obsidian):
```markdown
![이미지](../../08.media/image.png)
```

**Hugo가 변환** (빌드 타임):
```html
<img src="/08.media/image.png" alt="이미지">
```

모든 상대 경로를 자동으로 절대 경로로 변환!

#### **3. 표준 기능들 즉시 사용**

```markdown
<!-- YouTube 임베딩 -->
{{< youtube VIDEO_ID >}}

<!-- 코드 하이라이팅 -->
```python
print("자동으로 하이라이팅")
```

<!-- LaTeX -->
$$ E = mc^2 $$
```

더 이상 직접 구현할 필요 없음!

---

## 🎨 Phase 4: 그렇다면 JavaScript는 왜?

### **Hugo로 충분하지 않나?**

Hugo는 **정적 HTML**을 생성한다. 하지만:

> **동적인 인터랙션은 여전히 필요하다**

### **Hugo vs JavaScript 책임 분리 철학**

**Hugo의 역할**: "초기 로딩 및 SEO"
- 완전한 HTML 생성 (사이트틀 및 내부 콘텐츠)
- 검색 엔진 최적화
- 좌측 네비게이션 (SEO를 위해 미리 생성)

**JavaScript의 역할**: "사용자 경험 향상"
- 네비게이션 토글 (모바일)
- TOC 생성 및 하이라이트
- 다크모드 토글
- 반응형 레이아웃 조정

**예시: TOC (Table of Contents)**

```html
<!-- Hugo가 생성 (SEO를 위해) -->
<nav class="toc">
  <ul>
    <li><a href="#section1">섹션 1</a></li>
    <li><a href="#section2">섹션 2</a></li>
  </ul>
</nav>

<script>
// JavaScript가 추가 (UX를 위해)
// - 현재 읽고 있는 섹션 하이라이트
// - 스크롤 시 자동 업데이트
// - 클릭 시 부드러운 이동
</script>
```

### **왜 이렇게 나누는가?**

1. **점진적 향상 (Progressive Enhancement)**
   - JavaScript 없어도 기본 기능은 동작
   - JavaScript 있으면 더 나은 경험

2. **성능**
   - 초기 HTML은 즉시 표시 (Hugo)
   - 인터랙션은 비동기로 추가 (JavaScript)

3. **유지보수**
   - Hugo: 콘텐츠 구조, SEO
   - JavaScript: 동적 기능
   - 각자의 역할이 명확

---

## 💬 Phase 5: 그리고 백엔드는?

### **"백엔드 싫다고 하지 않았나?"**

맞다. **초기에는 싫었다**. 하지만:

> **필요한 기능이 생겼다 - 댓글 시스템**

### **왜 댓글에 백엔드가 필요한가?**

**정적 사이트의 한계**:
- Hugo: 빌드 타임에 모든 HTML 생성
- JavaScript: 브라우저에서만 동작
- **데이터 영속성 불가능**

**댓글 시스템 요구사항**:
1. ✅ 댓글 저장 (영구적으로)
2. ✅ 댓글 조회 (다른 사용자도 볼 수 있게)
3. ✅ 인증 (누가 작성했는지)
4. ✅ 수정/삭제

→ **이 모든 것은 서버(백엔드)가 필요**

### **향후 백엔드 계획**

**최소한의 백엔드**:
```
정적 사이트 (GitHub Pages) + 작은 백엔드 API
```

**백엔드가 할 일**:
- 댓글 CRUD (Create, Read, Update, Delete)
- 사용자 인증 (OAuth)
- 조회수 추적
- 좋아요/북마크

**백엔드가 하지 않을 일**:
- HTML 렌더링 (Hugo가 함)
- 콘텐츠 관리 (Obsidian + Git)
- SEO 최적화 (Hugo가 함)

**이점**:
- 여전히 대부분은 정적 (빠름, 저렴)
- 필요한 동적 기능만 백엔드 특히 동적 데이터 저장과 관련된 부분만 처리 (최소한)

---

## 🌟 최종 아키텍처: 하이브리드 접근

### **왜 이렇게 복잡한가?**

```
Obsidian (콘텐츠 작성)
    ↓
Hugo (정적 HTML 생성, SEO)
    ↓
JavaScript (동적 UX)
    ↓
Backend (데이터 영속성) [향후]
```

**한 줄 답변**:
> **각 단계에서 마주한 실제 문제를 해결하다 보니 자연스럽게 진화한 결과**

### **각 레이어의 존재 이유**

| 레이어 | 왜 필요한가? | 해결하는 문제 |
|--------|------------|--------------|
| **Obsidian** | 데이터 소유권, 플랫폼 독립성 | OneNote/Notion의 종속성 |
| **Hugo** | SEO, 초기 로딩 성능 | SPA의 검색 엔진 최적화 문제 |
| **JavaScript** | 동적 UX | 정적 HTML의 인터랙션 부족 |
| **Backend** | 데이터 영속성 | 댓글 등 사용자 생성 콘텐츠 |

### **핵심 원칙**

1. **단순함보다 문제 해결**
   - 단순한 아키텍처가 목표가 아님
   - 실제 문제를 해결하는 것이 목표

2. **각 레이어의 책임 명확**
   - 겹치는 역할 없음
   - 각자 최선의 역할 수행

3. **점진적 복잡성**
   - 처음부터 복잡하게 설계한 것 아님
   - 필요에 따라 하나씩 추가

4. **여전히 진화 중**
   - 백엔드는 아직 구현 전
   - 더 나은 방법을 계속 찾는 중

---

## 🔮 미래 방향

### **현재 상태**
```
✅ Obsidian: 완성
✅ Hugo: 완성
✅ JavaScript: 기본 기능 완성
🔜 Backend: 설계 단계
```

### **앞으로의 계획**

1. **단기**
   - JavaScript TOC 향상
   - 검색 기능 개선
   - 다크모드 완성

2. **중기**
   - 댓글 시스템 백엔드 구축
   - OAuth 인증
   - 조회수 추적

3. **장기**
   - AI 기반 관련 글 추천
   - 실시간 협업 기능?
   - 다국어 지원?

### **변하지 않을 원칙**

- ✅ Markdown 파일은 여전히 순수하게
- ✅ 데이터 소유권은 내가
- ✅ 플랫폼 독립성 유지
- ✅ 각 레이어의 책임 분리

---

## 📖 결론

### **"복잡해 보이지만, 사실은..."**

각 레이어는 **실제로 겪은 고통**에서 나온 해결책이다:

1. **Obsidian**: OneNote/Notion 이동의 고통 → Markdown
2. **Hugo**: SPA의 SEO 지옥 → Static Site Generation
3. **JavaScript**: 정적 페이지의 답답함 → 동적 인터랙션
4. **Backend**: 댓글의 필요성 → 최소한의 서버

**이 아키텍처는**:
- ❌ 처음부터 계획한 복잡한 설계가 아니라
- ✅ 문제를 하나씩 해결하며 **자연스럽게 진화한 결과**

### **배운 것**

> "완벽한 아키텍처는 없다. 문제를 해결하는 아키텍처만 있을 뿐."

- 단순함이 항상 정답은 아니다
- 각 도구는 특정 문제를 잘 해결한다
- 여러 도구를 조합하는 것을 두려워하지 말자
- 하지만 각 도구의 **역할은 명확**해야 한다

---
