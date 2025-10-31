/**
 * Search UI
 * 검색 UI 이벤트 처리 및 결과 표시 오케스트레이션을 담당합니다.
 */

class SearchUI {
    constructor(searchEngine, resultRenderer, indexManager) {
        this.searchEngine = searchEngine;
        this.resultRenderer = resultRenderer;
        this.indexManager = indexManager; // IndexManager 주입
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        
        // SearchConfig에서 UI 설정 가져오기 (없으면 기본값)
        const config = window.SearchConfig?.UI || {};
        this.debounceDelay = config.DEBOUNCE_DELAY; // ms
        
        this.debounceTimer = null;
        
        // 키보드 네비게이션 상태
        this.selectedIndex = -1;
        this.resultItems = [];
        
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

        // 키보드 네비게이션 이벤트
        this.searchInput.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
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
        if (!this.indexManager.ready()) {
            this.showLoading();
            this.indexManager.onReady(() => {
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

        // 결과 아이템 DOM 요소 저장
        this.resultItems = Array.from(this.searchResults.querySelectorAll('.search-result-item'));
        
        // 선택 인덱스 초기화
        this.selectedIndex = -1;

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
        this.resetSelection();
    }

    /**
     * 결과 없음 표시
     */
    showNoResults() {
        this.searchResults.classList.remove('hidden');
        this.searchResults.innerHTML = '<div class="p-2 text-sm text-neutral-500">검색 결과가 없습니다.</div>';
        this.resetSelection();
    }

    /**
     * 키보드 입력 처리
     */
    handleKeyDown(e) {
        const hasResults = this.resultItems.length > 0;
        
        switch(e.key) {
            case 'ArrowDown':
                if (hasResults) {
                    e.preventDefault();
                    this.selectNext();
                }
                break;
            case 'ArrowUp':
                if (hasResults) {
                    e.preventDefault();
                    this.selectPrevious();
                }
                break;
            case 'Enter':
                if (this.selectedIndex >= 0) {
                    e.preventDefault();
                    this.navigateToSelected();
                }
                break;
            case 'Escape':
                this.hideResults();
                this.searchInput.blur();
                break;
        }
    }

    /**
     * 다음 항목 선택
     */
    selectNext() {
        if (this.resultItems.length === 0) return;
        
        this.selectedIndex = (this.selectedIndex + 1) % this.resultItems.length;
        this.updateSelection();
    }

    /**
     * 이전 항목 선택
     */
    selectPrevious() {
        if (this.resultItems.length === 0) return;
        
        if (this.selectedIndex <= 0) {
            this.selectedIndex = this.resultItems.length - 1;
        } else {
            this.selectedIndex--;
        }
        this.updateSelection();
    }

    /**
     * 선택 상태 시각적 업데이트
     */
    updateSelection() {
        this.resultItems.forEach((item, index) => {
            if (index === this.selectedIndex) {
                // 선택된 항목 스타일 적용
                item.classList.add('bg-blue-100', 'dark:bg-blue-900/30', 'ring-2', 'ring-blue-500');
                item.classList.remove('hover:bg-neutral-100', 'dark:hover:bg-neutral-800');
                
                // 화면에 보이도록 스크롤
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                // 선택 해제된 항목 기본 스타일로 복원
                item.classList.remove('bg-blue-100', 'dark:bg-blue-900/30', 'ring-2', 'ring-blue-500');
                item.classList.add('hover:bg-neutral-100', 'dark:hover:bg-neutral-800');
            }
        });
    }

    /**
     * 선택된 항목으로 이동
     */
    navigateToSelected() {
        if (this.selectedIndex >= 0 && this.selectedIndex < this.resultItems.length) {
            const selectedItem = this.resultItems[this.selectedIndex];
            const url = selectedItem.getAttribute('href');
            if (url) {
                window.location.href = url;
            }
        }
    }

    /**
     * 선택 초기화
     */
    resetSelection() {
        this.selectedIndex = -1;
        this.resultItems = [];
    }
}

// ES6 모듈 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SearchUI };
}
