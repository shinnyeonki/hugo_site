# Search System Architecture

## 개요

검색 시스템은 **단일 책임 원칙(Single Responsibility Principle)**에 따라 설계된 클라이언트 사이드 검색 엔진입니다. 각 모듈은 명확한 책임을 가지며, 의존성 주입을 통해 느슨하게 결합되어 있습니다.

## 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────────┐
│                         Search System                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐        ┌──────────────────────┐       │
│  │  SearchIndexManager  │        │  SearchQueryParser   │       │
│  │  (인덱스 관리)       │        │  (쿼리 파싱)         │       │
│  └──────────────────────┘        └──────────────────────┘       │
│           │                                    │                  │
│           │                                    │                  │
│           └────────────┬───────────────────────┘                  │
│                        ▼                                          │
│               ┌──────────────────────┐                           │
│               │   SearchEngine       │                           │
│               │   (검색 로직)        │                           │
│               └──────────────────────┘                           │
│                        │                                          │
│           ┌────────────┴────────────┐                           │
│           │                         │                            │
│           ▼                         ▼                            │
│  ┌──────────────────┐      ┌──────────────────┐                │
│  │ TextHighlighter  │      │   URLBuilder     │                │
│  │ (텍스트 강조)    │      │   (URL 생성)     │                │
│  └──────────────────┘      └──────────────────┘                │
│           │                         │                            │
│           └────────────┬────────────┘                           │
│                        ▼                                          │
│            ┌──────────────────────────┐                         │
│            │ SearchResultRenderer     │                         │
│            │ (결과 렌더링)            │                         │
│            └──────────────────────────┘                         │
│                        │                                          │
│                        ▼                                          │
│               ┌──────────────────────┐                           │
│               │     SearchUI         │                           │
│               │  (UI 오케스트레이션) │                           │
│               └──────────────────────┘                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 모듈 구성

### 0. SearchConfig (설정 계층)

**위치**: `static/js/search/search-config.js`

**책임**: 검색 시스템의 모든 설정값을 중앙 관리

**주요 기능**:
- 우선순위 점수 정의 (PRIORITY_SCORES)
- UI 설정 (디바운스 지연, 스니펫 길이, 최대 태그 표시 개수, 하이라이트 클래스)
- 캐시 설정 (로컬 스토리지 키)
- 검색 범위 별칭 매핑 (SCOPE_ALIASES)
- 아이콘 및 배지 설정 (ICONS)
- 배너 스타일 설정 (BANNER_STYLES)

**설정 구조**:
```javascript
const SearchConfig = {
    PRIORITY_SCORES: { ... },
    UI: { 
        DEBOUNCE_DELAY: 200,
        SNIPPET_LENGTH: 80,
        MAX_TAGS_DISPLAY: 10,
        HIGHLIGHT_CLASS: '...'
    },
    CACHE: { ... },
    SCOPE_ALIASES: { ... },
    ICONS: { 
        EXACT_MATCH: '🎯',
        PARTIAL_MATCH: '≈',
        INTEGRATED_SEARCH: '🔍',
        SCOPED_SEARCH: '🔭'
    },
    BANNER_STYLES: { ... }
};
```

**특징**:
- 모든 설정 객체가 `Object.freeze()`로 동결되어 읽기 전용
- `window.SearchConfig`로 전역 접근 가능
- 각 모듈은 `window.SearchConfig`에서 설정값을 가져오며, 없으면 기본값 사용

### 1. SearchIndexManager (데이터 계층)

**위치**: `static/js/search/search-index-manager.js`

**책임**: 검색 인덱스의 로딩, 캐싱, 버전 관리

**주요 기능**:
- 서버의 `version.json`과 로컬 캐시를 비교하여 최신 상태 유지
- LocalStorage를 활용한 인덱스 캐싱으로 반복 로딩 방지
- 인덱스 준비 상태 관리 및 콜백 시스템
- SearchConfig에서 캐시 키 설정 가져오기

**핵심 메서드**:
```javascript
class SearchIndexManager {
    async initialize()           // 인덱스 초기화
    async fetchVersion()         // 서버 버전 확인 (캐시 방지)
    async fetchAndCacheIndex()   // 인덱스 다운로드 및 캐싱
    loadFromCache()              // 캐시에서 로드
    clearCache()                 // 캐시 강제 삭제
    getIndex()                   // 인덱스 반환
    ready()                      // 준비 상태 확인
    onReady(callback)            // 준비 완료 콜백 등록
    triggerReadyCallbacks()      // 준비 완료 콜백 실행
    getCacheInfo()               // 캐시 정보 반환 (디버깅용)
}
```

**설정 사용**:
```javascript
const config = window.SearchConfig?.CACHE || {};
this.cacheKey = config.INDEX_KEY || 'search_index_cache';
this.versionKey = config.VERSION_KEY || 'search_index_version';
```

**데이터 구조**:
```javascript
{
    files: {
        "파일명.md": {
            path: "/path/to/file/",
            frontmatter: {
                title: "...",
                tags: ["tag1", "tag2"],
                // ... 기타 메타데이터
            },
            content: "본문 내용..."
        }
    }
}
```

### 2. SearchQueryParser (쿼리 분석 계층)

**위치**: `static/js/search/search-query-parser.js`

**책임**: 사용자 입력 쿼리를 파싱하여 검색 타입 결정

**주요 기능**:
- 접두사(`file:`, `tag:`, `meta:`, `content:`) 감지
- 통합 검색 vs 범위 지정 검색 구분
- 메타데이터 키-값 쿼리 파싱 (`meta:author:shinnk`)
- SearchConfig에서 범위 별칭 가져오기

**핵심 메서드**:
```javascript
class SearchQueryParser {
    parse(query)              // 쿼리 파싱
    extractScopes(query)      // scope 추출
    parseScope(part)          // 단일 scope 파싱
    parseMetadataScope(part)  // 메타데이터 scope 파싱
    isSingleScope(parsedQuery)     // 단일 scope 쿼리 확인
    isMultipleScopes(parsedQuery)  // 복합 scope 쿼리 확인
}
```

**설정 사용**:
```javascript
this.scopeAliases = window.SearchConfig?.SCOPE_ALIASES || {
    'filename:': 'file', 'file:': 'file', 'f:': 'file',
    'tag:': 'tag', 't:': 'tag',
    'metadata:': 'metadata', 'meta:': 'metadata', 'm:': 'metadata',
    'content:': 'content', 'c:': 'content'
};
```

**파싱 결과 구조**:
```javascript
// 통합 검색
{
    type: 'integrated',
    query: 'react',
    scopes: []
}

// 범위 지정 검색 (단일)
{
    type: 'scoped',
    query: 'tag:spring',
    scopes: [{
        scope: 'tag',
        term: 'spring',
        metaKey: null
    }]
}

// 범위 지정 검색 (복합)
{
    type: 'scoped',
    query: 't:java f:concept',
    scopes: [
        { scope: 'tag', term: 'java', metaKey: null },
        { scope: 'file', term: 'concept', metaKey: null }
    ]
}
```

### 3. SearchEngine (검색 로직 계층)

**위치**: `static/js/search/search-engine.js`

**책임**: 핵심 검색 알고리즘 구현

**주요 기능**:
- 통합 검색: 8단계 우선순위 기반 검색
- 범위 지정 검색: 단일/복합 조건 처리
- 파일명, 태그, 메타데이터, 본문 검색
- 정확한 일치/부분 일치 구분
- SearchConfig에서 우선순위 점수 가져오기

**우선순위 점수 체계**:
```javascript
const config = window.SearchConfig?.PRIORITY_SCORES || {};
this.PRIORITY_SCORES = {
    // 정확한 일치 (Exact Match)
    EXACT_FILE: config.EXACT_FILE || 400,       // 1순위
    EXACT_TAG: config.EXACT_TAG || 300,        // 2순위
    EXACT_METADATA: config.EXACT_METADATA || 200,   // 3순위
    EXACT_CONTENT: config.EXACT_CONTENT || 100,    // 4순위
    
    // 부분 일치 (Substring Match)
    PARTIAL_FILE: config.PARTIAL_FILE || 40,      // 5순위
    PARTIAL_TAG: config.PARTIAL_TAG || 30,       // 6순위
    PARTIAL_METADATA: config.PARTIAL_METADATA || 20,  // 7순위
    PARTIAL_CONTENT: config.PARTIAL_CONTENT || 10    // 8순위
};
```

**핵심 메서드**:
```javascript
class SearchEngine {
    search(query)                          // 메인 검색 진입점
    performIntegratedSearch(parsedQuery)   // 통합 검색
    performScopedSearch(parsedQuery)       // 범위 지정 검색
    performSingleScopedSearch(scopeObj)    // 단일 범위 검색
    performMultipleScopedSearch(scopes)    // 복합 범위 검색 (AND)
    
    // 개별 영역 검색
    searchInFile(fileName, query, matches, partialOnly)
    searchInTags(tags, query, matches, partialOnly)
    searchInMetadata(frontmatter, query, matches, targetKey, partialOnly)
    searchInContent(content, query, matches, partialOnly)
    
    // 유틸리티
    escapeRegex(str)                       // 정규식 이스케이프
    isExactWordMatch(text, query)          // 정확한 단어 일치 확인
}
```

**검색 알고리즘 세부사항**:

**파일명 검색 (searchInFile)**:
- 정확한 일치: 
  - 확장자 제외한 파일명과 완전 일치 비교
  - 공백이나 특수문자로 구분된 정확한 단어 일치 (한글/영문 지원)
  - `isExactWordMatch` 메서드 활용
- 부분 일치: 파일명에 검색어 포함 여부
- `partialOnly` 플래그로 정확한 일치 스킵 가능

**태그 검색 (searchInTags)**:
- 정확한 일치: 태그 문자열 완전 일치 (우선 처리)
- 부분 일치: 태그 문자열에 검색어 포함
- `partialOnly` 플래그로 정확한 일치 스킵 가능
- 여러 태그 중 최고 점수 반환

**메타데이터 검색 (searchInMetadata)**:
- `tags` 필드는 별도 태그 검색으로 처리하므로 제외
- `targetKey` 지정 시: 해당 키의 값에서만 검색
  - 예: `meta:author:shinnk` → author 키의 값에서 'shinnk' 검색
  - 키가 정확히 일치하거나 포함되어야 함
- `targetKey` 미지정 시: 모든 메타데이터의 키 또는 값에서 검색
  - 예: `meta:shinnk` → 모든 키와 값에서 'shinnk' 검색
  - 예: `meta:author` → 키 또는 값에서 'author' 검색
- 정확한 일치: 키 또는 값이 검색어와 완전 일치
- 부분 일치: 키 또는 값에 검색어 포함
- `partialOnly` 플래그로 정확한 일치 스킵 가능
- 여러 메타데이터 중 최고 점수 반환

**본문 검색 (searchInContent)**:
- 정확한 일치: `isExactWordMatch`를 활용한 완전 단어 일치
  - 공백/특수문자로 구분된 단어 단위 검색
  - 한글, 영문 모두 지원
  - 여러 단어 구문인 경우 구문 전체가 단어 경계와 함께 매치되는지 확인
- 부분 일치: 본문에 검색어 포함
- `partialOnly` 플래그로 정확한 일치 스킵 가능

**isExactWordMatch 메서드**:
- 여러 단어 구문: 전체 구문이 단어 경계와 함께 텍스트에 포함되어 있는지 정규식으로 확인
- 단일 단어: 공백과 특수문자로 분리된 단어 중 정확히 일치하는 것이 있는지 확인
- 지원하는 단어 경계 문자: 공백, `-_.,;:!?@#$%^&*()[]{}/<>"'\`~+=|\` 등

**검색 결과 구조**:
```javascript
{
    fileName: "파일명.md",
    fileData: { /* 인덱스 데이터 */ },
    score: 1000,
    matches: [
        {
            scope: 'file',
            term: 'react',
            matchType: 'exact'
        }
    ],
    searchType: 'integrated',
    matchedTerm: 'react'
}
```

### 4. TextHighlighter (유틸리티 계층)

**위치**: `static/js/search/text-highlighter.js`

**책임**: 검색어 하이라이팅 처리

**주요 기능**:
- 파일명 하이라이팅 (중복 방지 알고리즘)
- 일반 텍스트 하이라이팅
- 여러 검색어 동시 하이라이팅
- HTML 이스케이프
- 정규식 이스케이프
- SearchConfig에서 하이라이트 클래스 가져오기

**핵심 메서드**:
```javascript
class TextHighlighter {
    highlightFileName(fileName, matches)       // 파일명 하이라이트
    highlightText(text, term)                  // 일반 텍스트 하이라이트
    highlightMultipleTerms(text, terms)        // 여러 검색어 하이라이트
    escapeHtml(text)                           // HTML 이스케이프
    escapeRegex(str)                           // 정규식 이스케이프
}
```

**설정 사용**:
```javascript
const config = window.SearchConfig?.UI || {};
this.highlightClass = config.HIGHLIGHT_CLASS || 'bg-yellow-200 dark:bg-yellow-600';
```

**하이라이트 전략**:
- `highlightFileName`: 가장 긴 term부터 하이라이팅하여 중복 방지
- `highlightMultipleTerms`: 여러 term을 한 번에 하이라이팅 (메타데이터 렌더링용)
  - 동일 키에 여러 term이 매치될 때 사용
  - 긴 term부터 처리하여 중복 방지

### 5. URLBuilder (유틸리티 계층)

**위치**: `static/js/search/url-builder.js`

**책임**: 검색 결과 URL 생성 및 Text Fragment 처리

**주요 기능**:
- 인덱스에서 파일 경로 조회
- Text Fragment API를 활용한 본문 하이라이팅 URL 생성
- 브라우저의 네이티브 검색어 강조 활용

**핵심 메서드**:
```javascript
class URLBuilder {
    buildURL(fileName, matches)         // URL 생성
    createTextFragment(matches)         // Text Fragment 생성
    getFileUrl(fileName)                // 파일 경로 조회
}
```

**Text Fragment 예시**:
```javascript
// 본문에 'react' 검색어가 있는 경우
"/path/to/file/#:~:text=react"

// 브라우저가 자동으로 해당 텍스트를 찾아 스크롤하고 강조
```

### 6. SearchResultRenderer (프레젠테이션 계층)

**위치**: `static/js/search/search-result-renderer.js`

**책임**: 검색 결과를 HTML로 렌더링

**주요 기능**:
- 검색 결과 아이템 HTML 생성
- 파일명, 태그, 메타데이터, 본문 스니펫 렌더링
- 검색 타입별 조건부 렌더링 (통합 검색 vs 범위 지정 검색)
- 검색 타입 배너 표시
- 매치 타입 아이콘 표시 (정확한 일치/부분 일치)
- SearchConfig에서 UI 설정 및 아이콘 가져오기

**핵심 메서드**:
```javascript
class SearchResultRenderer {
    renderResults(results, searchType)         // 전체 결과 렌더링 (배너 포함)
    renderBanner(searchType)                   // 검색 타입 배너 생성
    renderResultItem(result)                   // 단일 결과 아이템
    renderFileName(fileName, matches)          // 파일명 렌더링 (매치 타입 아이콘 포함)
    renderMatchTypeIcon(matchType)             // 매치 타입 아이콘 반환
    renderMatchTypeBadge(matchType)            // 매치 타입 배지 생성 (레거시)
    renderTags(tags, matches)                  // 태그 렌더링
    renderMetadata(matches, frontmatter)       // 메타데이터 렌더링
    renderSnippet(content, matches)            // 본문 스니펫 렌더링 (범위 지정 검색용)
    renderSnippetForIntegrated(content, matches) // 본문 스니펫 렌더링 (통합 검색용)
    createSnippet(content, term, contextLength) // 스니펫 추출
}
```

**설정 사용**:
```javascript
// 아이콘
const icons = window.SearchConfig?.ICONS || {};
const exactIcon = icons.EXACT_MATCH || '🎯';
const partialIcon = icons.PARTIAL_MATCH || '≈';

// UI 설정
const config = window.SearchConfig?.UI || {};
const maxTags = config.MAX_TAGS_DISPLAY || 3;
const snippetLength = config.SNIPPET_LENGTH || 80;

// 배너 스타일
const bannerStyles = window.SearchConfig?.BANNER_STYLES || {};
```

**렌더링 규칙**:

**통합 검색 (Integrated Search)**:
1. **파일명**: 항상 표시, 매치 시 하이라이트 및 매치 타입 아이콘 (🎯 정확한 일치, ≈ 부분 일치)
   - 형식: `{파일명} 🎯` 또는 `{파일명} ≈`
2. **태그**: 검색어가 태그에 매치된 경우만 표시 (최대 10개, SearchConfig.UI.MAX_TAGS_DISPLAY), 매치된 태그에 하이라이트 및 매치 타입 아이콘
   - 형식: `태그: {태그1} 🎯, {태그2} ≈`
3. **메타데이터**: 검색어가 메타데이터에 매치된 경우만 표시 (tags 제외), 동일 키는 한 번만 표시하고 모든 매치된 term 하이라이팅
   - 형식: `메타데이터: {key: value} 🎯, {key2: value2} ≈`
   - 동일 키에 여러 term이 매치되면 `highlightMultipleTerms` 사용
   - 가장 높은 우선순위 matchType 아이콘 표시 (exact > partial)
4. **본문 스니펫**: 항상 표시
   - 본문에 매치된 경우: 해당 부분 포함한 앞뒤 문장 (검색어 하이라이트, 매치 타입 아이콘 추가)
     - 형식: `{...내용...} 🎯` 또는 `{...내용...} ≈`
   - 매치 안된 경우: 본문 앞부분 표시 (80자, 아이콘 없음)
     - 형식: `{...내용...}`
5. **배너**: "🔍 통합 검색 결과" 표시 (SearchConfig.BANNER_STYLES.integrated)

**범위 지정 검색 (Scoped Search)**:
1. **파일명**: 항상 표시, 매치 시 하이라이트 및 매치 타입 아이콘
   - 형식: `{파일명} 🎯` 또는 `{파일명} ≈`
2. **태그**: 태그 범위 지정 검색 시에만 표시 (최대 10개), 매치된 태그에 하이라이트 및 매치 타입 아이콘
   - 형식: `태그: {태그1} 🎯, {태그2} ≈`
3. **메타데이터**: 메타데이터 범위 지정 검색 시에만 표시 (tags 제외), 동일 키는 한 번만 표시하고 모든 매치된 term 하이라이팅
   - 형식: `메타데이터: {key: value} 🎯, {key2: value2} ≈`
4. **본문 스니펫**: 본문 범위 지정 검색 시에만 표시 (검색어 중심 80자, 매치 타입 아이콘 추가)
   - 형식: `본문: {...내용...} 🎯` 또는 `본문: {...내용...} ≈`
5. **배너**: "🔭 범위 지정 검색 결과" 표시 (SearchConfig.BANNER_STYLES.scoped)

**매치 타입 아이콘**:
- 🎯: 정확한 일치 (exact match) - SearchConfig.ICONS.EXACT_MATCH
- ≈: 부분 일치 (partial match) - SearchConfig.ICONS.PARTIAL_MATCH

**HTML 구조 (통합 검색)**:
```html
<div class="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-2 mb-2 rounded-md text-xs font-medium">
    🔍 통합 검색 결과
</div>

<a href="/path/to/file/#:~:text=term" class="search-result-item">
    <div class="flex-1 min-w-0">
        <div class="text-sm font-medium">
            <span>파일명: 파일명 <mark>하이라이트</mark> 🎯</span>
        </div>
        <div class="text-xs text-neutral-500 mt-1">
            태그: tag1 🎯, <mark>tag2</mark> ≈
        </div>
        <div class="text-xs text-neutral-400 mt-1">
            메타데이터: author: <mark>shinnk</mark> 🎯
        </div>
        <div class="text-xs text-neutral-500 mt-1 line-clamp-2">
            본문: 본문 앞부분 표시... 또는 본문 내용 <mark>검색어</mark> 본문 🎯
        </div>
    </div>
</a>
```

**HTML 구조 (범위 지정 검색)**:
```html
<div class="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-2 mb-2 rounded-md text-xs font-medium">
    🔭 범위 지정 검색 결과
</div>

<a href="/path/to/file/#:~:text=term" class="search-result-item">
    <div class="flex-1 min-w-0">
        <div class="text-sm font-medium">
            <span>파일명: 파일명 <mark>하이라이트</mark> 🎯</span>
        </div>
        <!-- 태그 범위 검색 시에만 -->
        <div class="text-xs text-neutral-500 mt-1">
            태그: tag1, <mark>tag2</mark> 🎯
        </div>
        <!-- 메타데이터 범위 검색 시에만 -->
        <div class="text-xs text-neutral-400 mt-1">
            메타데이터: author: <mark>shinnk</mark> 🎯
        </div>
        <!-- 본문 범위 검색 시에만 -->
        <div class="text-xs text-neutral-500 mt-1 line-clamp-2">
            본문: ...본문 내용 <mark>검색어</mark> 본문... �
        </div>
    </div>
</a>
```

### 7. SearchUI (UI 오케스트레이션 계층)

**위치**: `static/js/search/search-ui.js`

**책임**: UI 이벤트 처리 및 모든 모듈 조합

**주요 기능**:
- 검색 입력 이벤트 처리 (디바운스)
- 검색 실행 및 결과 표시 오케스트레이션
- 로딩/결과 없음/숨기기 상태 관리
- 클릭 이벤트 핸들러 등록
- 키보드 네비게이션 (ArrowDown, ArrowUp, Enter, Escape)
- SearchConfig에서 디바운스 지연 시간 가져오기

**핵심 메서드**:
```javascript
class SearchUI {
    init()                           // 이벤트 리스너 초기화
    handleInput(query)               // 입력 핸들러 (디바운스)
    performSearch(query)             // 검색 실행
    displaySearchResults(results)    // 결과 표시 (검색 타입 자동 감지)
    attachClickHandlers()            // 클릭 이벤트 등록
    handleKeyDown(e)                 // 키보드 입력 처리
    selectNext()                     // 다음 항목 선택
    selectPrevious()                 // 이전 항목 선택
    updateSelection()                // 선택 상태 시각적 업데이트
    navigateToSelected()             // 선택된 항목으로 이동
    resetSelection()                 // 선택 초기화
    
    // 상태 표시
    showLoading()
    hideResults()
    showNoResults()
}
```

**설정 사용**:
```javascript
const config = window.SearchConfig?.UI || {};
this.debounceDelay = config.DEBOUNCE_DELAY; // ms (기본값 200)
```

**의존성 주입**:
```javascript
constructor(searchEngine, resultRenderer, indexManager) {
    this.searchEngine = searchEngine;
    this.resultRenderer = resultRenderer;
    this.indexManager = indexManager; // 인덱스 준비 상태 확인용
    // ...
}
```

**검색 타입 자동 감지**:
```javascript
// 첫 번째 결과의 searchType을 사용하여 렌더러에 전달
const searchType = results[0]?.searchType || 'integrated';
const html = this.resultRenderer.renderResults(results, searchType);
```

**디바운스 설정**:
```javascript
const config = window.SearchConfig?.UI || {};
this.debounceDelay = config.DEBOUNCE_DELAY; // ms (기본값 200)
```

**키보드 네비게이션**:
- **ArrowDown**: 다음 항목 선택
- **ArrowUp**: 이전 항목 선택
- **Enter**: 선택된 항목으로 이동
- **Escape**: 결과 숨기기 및 포커스 해제
- 선택된 항목은 `bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500` 클래스로 강조
- 자동 스크롤로 선택된 항목이 항상 화면에 보이도록 처리 (`scrollIntoView`)

### 8. SearchSystem (팩토리 계층)

**위치**: `static/js/search/search-system.js`

**책임**: 검색 시스템의 모든 컴포넌트 생성 및 의존성 주입 관리

**주요 기능**:
- 전역 변수 의존성 제거
- 중앙 집중식 컴포넌트 생성 및 관리
- 비동기 초기화 처리
- 컴포넌트 접근 API 제공

**핵심 메서드**:
```javascript
class SearchSystem {
    async initialize()               // 전체 시스템 초기화
    getComponents()                  // 모든 컴포넌트 반환
    getComponent(name)               // 특정 컴포넌트 반환
    isInitialized()                  // 초기화 상태 확인
}
```

**초기화 순서**:
```javascript
async initialize() {
    // 1. 의존성이 없는 컴포넌트
    const indexManager = new SearchIndexManager();
    const queryParser = new SearchQueryParser();
    const textHighlighter = new TextHighlighter();
    
    // 2. 인덱스 초기화 (비동기)
    await indexManager.initialize();
    
    // 3. 1차 의존성 주입
    const urlBuilder = new URLBuilder(indexManager);
    const searchEngine = new SearchEngine(indexManager, queryParser);
    
    // 4. 2차 의존성 주입
    const resultRenderer = new SearchResultRenderer(textHighlighter, urlBuilder);
    
    // 5. 최종 UI 컴포넌트 (indexManager도 주입)
    const searchUI = new SearchUI(searchEngine, resultRenderer, indexManager);
    
    return { indexManager, queryParser, searchEngine, ... };
}
```

**전역 인스턴스 생성**:
```javascript
// DOM 로드 완료 시 자동 초기화
document.addEventListener('DOMContentLoaded', async () => {
    const searchSystem = new SearchSystem();
    await searchSystem.initialize();
    window.searchSystem = searchSystem; // 디버깅용
});
```

## 의존성 주입 및 초기화

### 초기화 순서

```javascript
// 1. DOM 로드 완료 대기
document.addEventListener('DOMContentLoaded', async () => {
    const searchSystem = new SearchSystem();
    await searchSystem.initialize();
    window.searchSystem = searchSystem; // 디버깅용
});

// 2. SearchSystem.initialize() 내부
// 2-1. 의존성 인스턴스 생성 (하위 레벨부터)
const indexManager = new SearchIndexManager();
const queryParser = new SearchQueryParser();
const textHighlighter = new TextHighlighter();

// 2-2. 인덱스 초기화 (비동기)
await indexManager.initialize();

// 2-3. 1차 의존성 주입
const urlBuilder = new URLBuilder(indexManager);
const searchEngine = new SearchEngine(indexManager, queryParser);

// 2-4. 2차 의존성 주입
const resultRenderer = new SearchResultRenderer(textHighlighter, urlBuilder);

// 2-5. 최상위 UI 인스턴스 생성
const searchUI = new SearchUI(searchEngine, resultRenderer, indexManager);
```

### 의존성 그래프

```
SearchSystem (팩토리)
    │
    └──> SearchUI (UI 오케스트레이션)
            ├── SearchEngine (검색 로직)
            │   ├── SearchIndexManager (데이터)
            │   └── SearchQueryParser (쿼리 분석)
            ├── SearchResultRenderer (렌더링)
            │   ├── TextHighlighter (하이라이팅)
            │   └── URLBuilder (URL 생성)
            │       └── SearchIndexManager (데이터)
            └── SearchIndexManager (인덱스 준비 상태 확인)

SearchConfig (설정)
    └──> 모든 모듈에서 window.SearchConfig로 참조
```

## 검색 흐름

### 1. 통합 검색 (Integrated Search)

```
사용자 입력: "react"
    ↓
SearchQueryParser.parse()
    ↓ { type: 'integrated', query: 'react' }
SearchEngine.performIntegratedSearch()
    ↓
모든 파일 순회:
  - searchInFile()       → 점수 계산 (정확한 일치/부분 일치)
  - searchInTags()       → 점수 계산 (정확한 일치/부분 일치)
  - searchInMetadata()   → 점수 계산 (정확한 일치/부분 일치)
  - searchInContent()    → 점수 계산 (정확한 일치/부분 일치)
    ↓
점수순 정렬 결과 반환
    ↓
SearchResultRenderer.renderResults(results, 'integrated')
    ↓
- 🔍 통합 검색 결과 배너 표시
- 파일명 (항상)
- 태그 (매치된 경우만)
- 메타데이터 (매치된 경우만)
- 본문 스니펫 (항상, 매치 시 하이라이트)
    ↓
HTML 표시
```

### 2. 범위 지정 검색 - 단일 (Scoped Search - Single)

```
사용자 입력: "tag:spring"
    ↓
SearchQueryParser.parse()
    ↓ { type: 'scoped', scopes: [{ scope: 'tag', term: 'spring' }] }
SearchEngine.performSingleScopedSearch()
    ↓
모든 파일 순회:
  - searchInTags() → 정확한 일치 우선, 부분 일치 차선
    ↓
점수순 정렬 결과 반환
    ↓
SearchResultRenderer.renderResults(results, 'scoped')
    ↓
- 🎯 범위 지정 검색 결과 배너 표시
- 파일명 (항상)
- 태그 (태그 범위 검색 시에만)
- 조건 일치 아이콘 (🏷️) 우측 표시
    ↓
HTML 표시
```

### 3. 범위 지정 검색 - 복합 (Scoped Search - Multiple)

```
사용자 입력: "t:java f:concept"
    ↓
SearchQueryParser.parse()
    ↓ { 
      type: 'scoped', 
      scopes: [
        { scope: 'tag', term: 'java' },
        { scope: 'file', term: 'concept' }
      ]
    }
SearchEngine.performMultipleScopedSearch()
    ↓
모든 파일 순회:
  - searchInTags('java') AND searchInFile('concept')
  - 모든 조건 만족하는 파일만 선택 (부분 일치로 유연성 확보)
    ↓
매치 수 기반 점수 정렬
    ↓
SearchResultRenderer.renderResults(results, 'scoped')
    ↓
- 🎯 범위 지정 검색 결과 배너 표시
- 파일명 (항상)
- 태그 (태그 범위 검색 포함 시에만)
- 조건 일치 아이콘 (🏷️ 📄) 우측 표시
    ↓
HTML 표시
```

## 스크립트 로딩 순서

**위치**: `layouts/baseof.html`

```html
<!-- 검색 시스템 (순서 중요) -->
<script src="/js/search/search-config.js" defer></script>
<script src="/js/search/search-index-manager.js" defer></script>
<script src="/js/search/search-query-parser.js" defer></script>
<script src="/js/search/search-engine.js" defer></script>
<script src="/js/search/text-highlighter.js" defer></script>
<script src="/js/search/url-builder.js" defer></script>
<script src="/js/search/search-result-renderer.js" defer></script>
<script src="/js/search/search-ui.js" defer></script>
<script src="/js/search/search-system.js" defer></script>
```

**로딩 순서 중요성**:
1. **SearchConfig**: 가장 먼저 로드하여 모든 모듈에서 설정 접근 가능
2. **하위 의존성 모듈**: 다른 모듈에 의존하지 않는 모듈부터 로드
3. **상위 오케스트레이션 모듈**: 의존성이 있는 모듈은 나중에 로드
4. **SearchSystem**: 마지막에 로드하여 모든 클래스 정의 완료 후 초기화
5. `defer` 속성으로 HTML 파싱 후 실행 보장

## 성능 최적화

### 1. 캐싱 전략
- **LocalStorage 캐싱**: 검색 인덱스를 로컬에 저장 (SearchConfig.CACHE 설정)
- **버전 기반 캐시 무효화**: `version.json` 비교로 최신 상태 유지
  - `fetchVersion()`: timestamp 쿼리 파라미터와 Cache-Control 헤더로 캐시 방지
- **캐시 우선 로드**: 유효한 캐시가 있으면 서버 요청 생략

### 2. 디바운스
- **입력 디바운스**: SearchConfig.UI.DEBOUNCE_DELAY ms 지연으로 불필요한 검색 방지 (기본값 200ms)
- **연속 입력 최적화**: 마지막 입력에만 검색 실행

### 3. Text Fragment API
- **브라우저 네이티브 기능**: JavaScript 없이 본문 하이라이팅
- **성능 향상**: 클라이언트 처리 부담 감소
- **URL 형식**: `#:~:text=검색어`

### 4. 설정 기반 커스터마이징
- **중앙 집중식 설정**: SearchConfig에서 모든 설정 관리
- **동결된 객체**: Object.freeze()로 불변성 보장
- **폴백 메커니즘**: 설정이 없으면 기본값 사용하여 안정성 확보

## 확장성

### 새로운 검색 범위 추가

1. **SearchConfig 업데이트**:
```javascript
// search-config.js
SCOPE_ALIASES: {
    'newscope:': 'newscope',
    'ns:': 'newscope'
}
```

2. **Parser는 자동으로 처리** (SearchConfig.SCOPE_ALIASES 사용)

3. **Engine 업데이트**:
```javascript
// search-engine.js
searchInNewScope(data, query, matches, partialOnly) {
    // 검색 로직 구현
    return score;
}

// performSingleScopedSearch 메서드에 케이스 추가
case 'newscope':
    score = this.searchInNewScope(data, term, matches);
    break;
```

4. **스위치 케이스 추가** (필요시 렌더링 로직도 수정)

### 새로운 렌더링 항목 추가

```javascript
// search-result-renderer.js
renderNewItem(data, matches) {
    // HTML 생성 로직
    return html;
}

// renderResultItem() 메서드에 추가
const newItemHTML = this.renderNewItem(fileData, matches);
```

### SearchConfig 확장

```javascript
// 새로운 설정 섹션 추가
const SearchConfig = {
    // ... 기존 설정
    NEW_FEATURE: {
        OPTION1: value1,
        OPTION2: value2
    }
};

// 모듈에서 사용
const config = window.SearchConfig?.NEW_FEATURE || {};
const option1 = config.OPTION1 || 'default';
```

## 테스트 가능성

각 모듈이 독립적으로 테스트 가능:

```javascript
// TextHighlighter 테스트 예시
const highlighter = new TextHighlighter();
const result = highlighter.highlightText('react tutorial', 'react');
// result: '<mark class="...">react</mark> tutorial'

// SearchEngine 테스트 예시
const mockIndexManager = { 
    getIndex: () => mockData,
    ready: () => true 
};
const mockParser = { parse: (q) => ({ type: 'integrated', query: q }) };
const engine = new SearchEngine(mockIndexManager, mockParser);
const results = engine.search('react');

// SearchSystem을 통한 통합 테스트
const searchSystem = new SearchSystem();
await searchSystem.initialize();
const components = searchSystem.getComponents();
// components를 통해 각 모듈 개별 테스트 가능
```

## 디버깅

### 콘솔 로그
```javascript
// 인덱스 로딩 상태
console.log('Using cached search index (version: 1.0.0)');
console.log('Fetching new search index (version: 1.0.1)');

// 경로 조회 실패
console.warn('Path not found for file: example.md');

// SearchSystem 초기화 경고
console.warn('SearchSystem already initialized');
```

### 브라우저 개발자 도구
- **Application > LocalStorage**: 캐시 확인
  - `search_index_cache`: 인덱스 데이터
  - `search_index_version`: 버전 정보
- **Console > window.searchSystem**: 전역 SearchSystem 인스턴스 접근
  - `window.searchSystem.getComponents()`: 모든 컴포넌트 확인
  - `window.searchSystem.getComponent('indexManager')`: 특정 컴포넌트 접근
- **Console > window.SearchConfig**: 설정 확인

### 디버그 스크립트
```javascript
// search-debug.js (별도 로드)
console.log('SearchConfig:', window.SearchConfig);
console.log('SearchSystem:', window.searchSystem);
```

## 보안 고려사항

### XSS 방지
- **HTML 이스케이프**: 모든 사용자 입력 및 컨텐츠 이스케이프
- **정규식 이스케이프**: 특수 문자 처리

```javascript
escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
```

### 안전한 정규식
```javascript
escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
```

## 향후 개선 사항

1. **퍼지 검색**: 오타 허용 검색
2. **검색 히스토리**: 최근 검색어 저장
3. **자동 완성**: 입력 중 제안
4. **필터링**: 검색 결과 추가 필터링
5. **정렬 옵션**: 날짜순, 관련도순 등
6. **검색 통계**: 인기 검색어 분석
7. **고급 메타데이터 검색**: 날짜 범위, 숫자 비교 등

## 최근 업데이트

### 2025-01-01
- ✅ SearchConfig 모듈 추가 (중앙 집중식 설정 관리)
  - 모든 설정값을 SearchConfig에서 관리
  - Object.freeze()로 불변성 보장
  - 각 모듈에서 window.SearchConfig로 접근, 없으면 기본값 사용
- ✅ SearchSystem 팩토리 패턴 도입
  - 전역 변수 의존성 제거
  - 중앙 집중식 컴포넌트 생성 및 관리
  - 비동기 초기화 처리
- ✅ SearchUI에 IndexManager 의존성 주입
  - 인덱스 준비 상태 확인 기능 개선
  - 로딩 상태 표시 및 준비 완료 콜백 처리
- ✅ 스크립트 로딩 순서 최적화
  - SearchConfig를 가장 먼저 로드
  - SearchSystem을 마지막에 로드하여 초기화

### 2025-11-01
- ✅ 통합 검색과 범위 지정 검색의 배너 추가 (🔍 통합 검색, 🔭 범위 지정 검색)
- ✅ 매치 타입 아이콘 시스템 도입 (🎯 정확한 일치, ≈ 부분 일치)
- ✅ 파일명, 태그, 메타데이터, 본문 스니펫에 매치 타입 아이콘 표시
- ✅ 범위 지정 검색 배너 아이콘 변경 (🎯 → 🔭)
- ✅ 본문 스니펫 표시 조건 개선 (통합 검색: 항상, 범위 지정: 본문 검색 시만)
- ✅ 태그/메타데이터 표시 조건 개선
- ✅ 메타데이터 검색 로직 개선 (meta:key:value, meta:value, meta:key 모두 지원)
- ✅ 정확한 일치 알고리즘 개선 (파일명, 태그, 본문)
  - 파일명: 공백/특수문자로 구분된 정확한 단어 일치
  - 본문: `isExactWordMatch` 메서드로 한글/영문 단어 단위 검색
  - 여러 단어 구문: 전체 구문이 단어 경계와 함께 매치되는지 확인
- ✅ 키보드 네비게이션 기능 추가
  - ArrowDown/ArrowUp으로 항목 선택
  - Enter로 선택된 항목 이동
  - Escape로 결과 닫기
  - 선택된 항목 시각적 강조 및 자동 스크롤
- ✅ 메타데이터 렌더링 개선 (동일 키는 한 번만 표시, 모든 매치된 term 하이라이팅)
- ✅ `highlightMultipleTerms` 메서드 추가 (여러 검색어 한 번에 하이라이팅)
- ✅ 최대 태그 표시 개수 설정 가능 (SearchConfig.UI.MAX_TAGS_DISPLAY, 기본값 10)
- ✅ 디바운스 지연 시간 설정 가능 (SearchConfig.UI.DEBOUNCE_DELAY, 기본값 200ms)

## 결론

이 검색 시스템은 단일 책임 원칙을 철저히 따라 설계되었으며, 각 모듈이 명확한 역할을 수행합니다. 의존성 주입을 통한 느슨한 결합으로 유지보수가 용이하고, 테스트와 확장이 쉬운 구조를 갖추고 있습니다.
