# Legacy Code 제거 완료

## 📅 작업 일자
2025년 11월 1일

## 🎯 목표
기존 레거시 코드(전역 변수 기반 시스템)를 제거하고 **SearchSystem 팩토리 패턴**만 사용하도록 전환

---

## ✅ 제거된 레거시 코드

### 1. **search-ui.js**
#### 제거된 항목:
- ❌ 전역 `searchUI` 변수 생성 코드
- ❌ `initSearchUI()` 함수 (SearchSystem 시도 + 폴백)
- ❌ `initSearchUILegacy()` 함수 (하위 호환성 코드)
- ❌ DOMContentLoaded 이벤트 리스너

#### 변경 사항:
```javascript
// 이전: 레거시 초기화 코드
let searchUI;
if (typeof document !== 'undefined') {
    const initSearchUI = () => { ... };
    const initSearchUILegacy = () => { ... };
    document.addEventListener('DOMContentLoaded', initSearchUI);
}

// 현재: 클래스만 export
class SearchUI {
    constructor(searchEngine, resultRenderer, indexManager) { ... }
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SearchUI };
}
```

#### 추가 수정:
- `searchIndexManager` 전역 변수 참조 제거
- `this.indexManager`로 의존성 주입 사용

---

### 2. **search-index-manager.js**
#### 제거된 항목:
- ❌ 전역 `searchIndexManager` 인스턴스 생성
- ❌ DOMContentLoaded 자동 초기화 코드

#### 변경 사항:
```javascript
// 이전
const searchIndexManager = new SearchIndexManager();
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            searchIndexManager.initialize().catch(console.error);
        });
    } else {
        searchIndexManager.initialize().catch(console.error);
    }
}

// 현재
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SearchIndexManager };
}
```

---

### 3. **search-query-parser.js**
#### 제거된 항목:
- ❌ 전역 `searchQueryParser` 인스턴스 생성

#### 변경 사항:
```javascript
// 이전
const searchQueryParser = new SearchQueryParser();
module.exports = { SearchQueryParser, searchQueryParser };

// 현재
module.exports = { SearchQueryParser };
```

---

### 4. **search-debug.js**
#### 변경 사항:
- 전역 변수 참조 제거
- SearchSystem 기반으로 전환

```javascript
// 이전
info() {
    const info = searchIndexManager.getCacheInfo();
    // ...
}

// 현재
async info() {
    const system = await this._getSystem();
    const indexManager = system.getComponent('indexManager');
    const info = indexManager.getCacheInfo();
    // ...
}
```

#### 새로운 기능:
- `await searchDebug.status()` - 시스템 상태 확인
- 모든 함수가 `async` 함수로 변경

---

## 🏗️ 현재 아키텍처

### 파일 구조
```
static/js/search/
├── search-config.js           # 설정 (상수, 우선순위)
├── search-index-manager.js    # 인덱스 캐시 관리 (클래스만)
├── search-query-parser.js     # 쿼리 파싱 (클래스만)
├── search-engine.js           # 검색 엔진 (클래스만)
├── text-highlighter.js        # 텍스트 하이라이트 (클래스만)
├── url-builder.js             # URL 생성 (클래스만)
├── search-result-renderer.js  # 결과 렌더링 (클래스만)
├── search-ui.js               # UI 이벤트 처리 (클래스만)
└── search-system.js           # 🆕 팩토리 & 의존성 주입
```

### 초기화 순서
1. **SearchSystem 로드** (`search-system.js`)
2. **자동 초기화** (DOMContentLoaded)
   ```javascript
   async function getSearchSystem() {
       if (!globalSearchSystem) {
           globalSearchSystem = await SearchSystem.create();
       }
       return globalSearchSystem;
   }
   ```
3. **컴포넌트 생성** (SearchSystem 내부)
   ```javascript
   const indexManager = new SearchIndexManager();
   const queryParser = new SearchQueryParser();
   const textHighlighter = new TextHighlighter();
   const urlBuilder = new URLBuilder(indexManager);
   const searchEngine = new SearchEngine(indexManager, queryParser);
   const resultRenderer = new SearchResultRenderer(textHighlighter, urlBuilder);
   const searchUI = new SearchUI(searchEngine, resultRenderer, indexManager);
   ```

### HTML 로드 순서
```html
<!-- baseof.html -->
<script src="/js/search/search-config.js" defer></script>
<script src="/js/search/search-index-manager.js" defer></script>
<script src="/js/search/search-query-parser.js" defer></script>
<script src="/js/search/search-engine.js" defer></script>
<script src="/js/search/text-highlighter.js" defer></script>
<script src="/js/search/url-builder.js" defer></script>
<script src="/js/search/search-result-renderer.js" defer></script>
<script src="/js/search/search-ui.js" defer></script>
<script src="/js/search/search-system.js" defer></script>  <!-- 🎯 마지막 -->
```

---

## 🧪 테스트 방법

### 브라우저 콘솔에서
```javascript
// 1. 시스템 상태 확인
await searchDebug.status();

// 2. 설정 확인
console.log(SearchConfig);

// 3. 컴포넌트 접근
const system = await getSearchSystem();
console.log(system.getAllComponents());

// 4. 검색 테스트
await searchDebug.test("리팩토링");
```

### 검색 UI 테스트
1. 검색창에 "hugo" 입력
2. 통합 검색 결과 확인
3. "file:test" 입력 → 파일명 검색
4. "tag:블로그" 입력 → 태그 검색
5. "content:검색" 입력 → 본문 검색

---

## 📊 변경 통계

| 항목 | 이전 | 현재 |
|------|------|------|
| 전역 변수 | 3개 (`searchUI`, `searchIndexManager`, `searchQueryParser`) | 0개 |
| 자동 초기화 코드 | 각 파일마다 존재 | `search-system.js`에만 존재 |
| 의존성 관리 | 스크립트 로드 순서 의존 | 팩토리 패턴으로 주입 |
| 레거시 코드 | 약 60줄 | 0줄 |

---

## 🎯 달성한 이점

### 1. **코드 명확성 ⬆️**
- 각 모듈이 순수한 클래스만 export
- 인스턴스 생성은 SearchSystem에서만 담당
- 의존성 관계가 명확함

### 2. **유지보수성 ⬆️**
- 레거시 코드 제거로 혼란 감소
- 수정할 곳이 한 곳(SearchSystem)으로 집중
- 디버깅이 쉬워짐

### 3. **테스트 용이성 ⬆️**
- 전역 변수 없어서 격리된 테스트 가능
- Mock 객체 주입이 쉬움

### 4. **에러 방지 ⬆️**
- 전역 변수 충돌 위험 제거
- 초기화 순서 문제 해결

---

## 🚨 주의사항

### ⚠️ 하위 호환성 없음
- 기존 전역 변수를 사용하던 외부 코드가 있다면 수정 필요
- 예: `searchIndexManager.search()` → `await getSearchSystem()` 후 `searchEngine.search()`

### ✅ 마이그레이션 가이드
기존 코드:
```javascript
if (searchIndexManager.ready()) {
    const results = searchIndexManager.search("query");
}
```

새로운 코드:
```javascript
const system = await getSearchSystem();
const searchEngine = system.getComponent('searchEngine');
const results = searchEngine.search("query");
```

---

## 📝 관련 문서
- [REFACTORING_COMPLETE.md](./REFACTORING_COMPLETE.md) - 리팩토링 전체 과정
- [ARCHITECTURE_RATIONALE.md](./ARCHITECTURE_RATIONALE.md) - 아키텍처 설계 근거
- [WORKFLOW_OVERVIEW.md](./WORKFLOW_OVERVIEW.md) - 시스템 동작 흐름

---

## ✅ 체크리스트

- [x] search-ui.js 레거시 제거
- [x] search-index-manager.js 레거시 제거
- [x] search-query-parser.js 레거시 제거
- [x] search-debug.js SearchSystem 기반으로 수정
- [x] baseof.html 주석 업데이트
- [x] 테스트 (Hugo 서버 정상 실행)
- [x] 문서화

---

**리팩토링 완전 종료!** 🎉
