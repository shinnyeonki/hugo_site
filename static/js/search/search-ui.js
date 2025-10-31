/**
 * Search UI
 * 검색 UI 이벤트 처리 및 결과 표시 오케스트레이션을 담당합니다.
 */

class SearchUI {
    constructor(searchEngine, resultRenderer) {
        this.searchEngine = searchEngine;
        this.resultRenderer = resultRenderer;
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        this.debounceTimer = null;
        this.debounceDelay = 150; // ms
        
        this.init();
    }

    init() {
        if (!this.searchInput || !this.searchResults) {
            console.warn('Search UI elements not found');
            return;
        }

        // 입력 이벤트
        this.searchInput.addEventListener('input', (e) => {
            this.handleInput(e.target.value);
        });

        // 포커스 이벤트
        this.searchInput.addEventListener('focus', (e) => {
            if (e.target.value.trim().length > 0) {
                this.performSearch(e.target.value);
            }
        });
    }

    /**
     * 입력 핸들러 (디바운스 적용)
     */
    handleInput(query) {
        clearTimeout(this.debounceTimer);
        
        this.debounceTimer = setTimeout(() => {
            this.performSearch(query);
        }, this.debounceDelay);
    }

    /**
     * 검색 실행
     */
    performSearch(query) {
        if (!query || query.trim().length === 0) {
            this.hideResults();
            return;
        }

        // 인덱스 준비 확인
        if (!searchIndexManager.ready()) {
            this.showLoading();
            searchIndexManager.onReady(() => {
                this.performSearch(query);
            });
            return;
        }

        // 검색 실행
        const results = this.searchEngine.search(query);
        
        // 결과 표시
        this.displaySearchResults(results);
    }

    /**
     * 검색 결과 표시
     */
    displaySearchResults(results) {
        if (results.length === 0) {
            this.showNoResults();
            return;
        }

        // 검색 타입 결정 (첫 번째 결과의 searchType 사용)
        const searchType = results[0]?.searchType || 'integrated';

        // 결과 렌더링 (Renderer에 위임)
        const html = this.resultRenderer.renderResults(results, searchType);

        this.searchResults.classList.remove('hidden');
        this.searchResults.innerHTML = html;

        // 클릭 이벤트 등록
        this.attachClickHandlers();
    }

    /**
     * 클릭 이벤트 핸들러 등록
     */
    attachClickHandlers() {
        const items = this.searchResults.querySelectorAll('.search-result-item');
        
        items.forEach(item => {
            item.addEventListener('click', (e) => {
                // 기본 동작(링크 이동)은 그대로 수행
                // Text Fragment가 URL에 포함되어 있으므로 브라우저가 자동으로 처리
            });
        });
    }

    /**
     * 로딩 표시
     */
    showLoading() {
        this.searchResults.classList.remove('hidden');
        this.searchResults.innerHTML = '<div class="p-2 text-sm text-neutral-500">검색 준비 중...</div>';
    }

    /**
     * 결과 숨기기
     */
    hideResults() {
        this.searchResults.classList.add('hidden');
        this.searchResults.innerHTML = '';
    }

    /**
     * 결과 없음 표시
     */
    showNoResults() {
        this.searchResults.classList.remove('hidden');
        this.searchResults.innerHTML = '<div class="p-2 text-sm text-neutral-500">검색 결과가 없습니다.</div>';
    }
}

// 전역 인스턴스 생성 (DOMContentLoaded 후)
let searchUI;

if (typeof document !== 'undefined') {
    const initSearchUI = () => {
        // 의존성 확인
        if (typeof searchIndexManager === 'undefined' || 
            typeof searchQueryParser === 'undefined' ||
            typeof TextHighlighter === 'undefined' ||
            typeof URLBuilder === 'undefined' ||
            typeof SearchResultRenderer === 'undefined') {
            console.error('Search dependencies not loaded');
            return;
        }

        // 의존성 인스턴스 생성
        const textHighlighter = new TextHighlighter();
        const urlBuilder = new URLBuilder(searchIndexManager);
        const resultRenderer = new SearchResultRenderer(textHighlighter, urlBuilder);
        const searchEngine = new SearchEngine(searchIndexManager, searchQueryParser);
        
        // SearchUI 인스턴스 생성
        searchUI = new SearchUI(searchEngine, resultRenderer);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearchUI);
    } else {
        initSearchUI();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SearchUI };
}
