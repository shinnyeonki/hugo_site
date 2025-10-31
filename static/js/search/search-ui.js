/**
 * Search UI
 * 검색 UI 및 사이드바 하이라이팅을 담당합니다.
 */

class SearchUI {
    constructor(searchEngine) {
        this.searchEngine = searchEngine;
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

        const maxResults = 20;
        const displayResults = results.slice(0, maxResults);
        
        const html = displayResults.map(result => {
            return this.createResultItem(result);
        }).join('');

        this.searchResults.classList.remove('hidden');
        this.searchResults.innerHTML = html;

        // 추가 결과 표시
        if (results.length > maxResults) {
            const moreHtml = `<div class="p-2 text-xs text-neutral-500 text-center">외 ${results.length - maxResults}개 더...</div>`;
            this.searchResults.innerHTML += moreHtml;
        }

        // 클릭 이벤트 등록
        this.attachClickHandlers();
    }

    /**
     * 단일 결과 아이템 HTML 생성
     */
    createResultItem(result) {
        const { fileName, fileData, matches, searchType } = result;
        
        // 파일명 하이라이팅
        const displayNameHTML = this.highlightFileName(fileName, matches);
        
        // 태그 표시
        const tagsHTML = this.createTagsHTML(fileData.frontmatter?.tags, matches);
        
        // 컨텍스트 정보 (메타데이터 매치)
        const contextHTML = this.createContextHTML(matches);
        
        // 본문 스니펫
        const snippetHTML = this.createSnippetHTML(fileData.content, matches);
        
        // URL 생성 (Text Fragment 포함)
        const url = this.createURL(fileName, matches);
        
        return `
            <a href="${url}" 
               class="search-result-item block p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
               data-filename="${this.escapeHtml(fileName)}"
               data-matches='${JSON.stringify(matches)}'>
                <div class="text-sm font-medium">${displayNameHTML}</div>
                ${tagsHTML}
                ${contextHTML}
                ${snippetHTML}
            </a>
        `;
    }

    /**
     * 파일명 하이라이팅
     */
    highlightFileName(fileName, matches) {
        const fileMatches = matches.filter(m => m.scope === 'file');
        
        if (fileMatches.length === 0) {
            return this.escapeHtml(fileName);
        }

        let result = fileName;
        // 가장 긴 term부터 하이라이트 (중복 방지)
        const sortedMatches = fileMatches.sort((a, b) => b.term.length - a.term.length);
        
        for (const match of sortedMatches) {
            const regex = new RegExp(`(${this.escapeRegex(match.term)})`, 'gi');
            result = result.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600">$1</mark>');
        }
        
        return result;
    }

    /**
     * 태그 HTML 생성
     */
    createTagsHTML(tags, matches) {
        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            return '';
        }

        const tagMatches = matches.filter(m => m.scope === 'tag');
        const displayTags = tags.slice(0, 3);
        
        const tagsHtml = displayTags.map(tag => {
            const tagStr = String(tag);
            const isMatched = tagMatches.some(m => 
                String(m.value).toLowerCase() === tagStr.toLowerCase()
            );
            
            if (isMatched) {
                return `<mark class="bg-yellow-200 dark:bg-yellow-600">${this.escapeHtml(tagStr)}</mark>`;
            }
            return this.escapeHtml(tagStr);
        }).join(', ');
        
        return `<div class="text-xs text-neutral-500 mt-1">${tagsHtml}</div>`;
    }

    /**
     * 컨텍스트 HTML 생성 (메타데이터 매치 표시)
     */
    createContextHTML(matches) {
        const metaMatches = matches.filter(m => m.scope === 'metadata');
        
        if (metaMatches.length === 0) {
            return '';
        }

        const contexts = metaMatches.slice(0, 2).map(m => {
            const keyHtml = this.highlightText(m.key, m.term);
            const valueHtml = this.highlightText(String(m.value), m.term);
            return `${keyHtml}: ${valueHtml}`;
        }).join(' · ');

        return `<div class="text-xs text-neutral-400 mt-1">🏷️ ${contexts}</div>`;
    }

    /**
     * 본문 스니펫 HTML 생성
     */
    createSnippetHTML(content, matches) {
        const contentMatches = matches.filter(m => m.scope === 'content');
        
        if (contentMatches.length === 0 || !content) {
            return '';
        }

        const term = contentMatches[0].term;
        const snippet = this.createSnippet(content, term, 60);
        const highlightedSnippet = this.highlightText(snippet, term);
        
        return `<div class="text-xs text-neutral-500 mt-1 line-clamp-2">${highlightedSnippet}</div>`;
    }

    /**
     * 본문에서 스니펫 추출
     */
    createSnippet(content, term, maxLength = 60) {
        const lowerContent = content.toLowerCase();
        const lowerTerm = term.toLowerCase();
        const index = lowerContent.indexOf(lowerTerm);
        
        if (index === -1) {
            return content.substring(0, maxLength) + '...';
        }

        const start = Math.max(0, index - 20);
        const end = Math.min(content.length, index + term.length + 40);
        
        let snippet = content.substring(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < content.length) snippet = snippet + '...';
        
        return snippet;
    }

    /**
     * 텍스트 하이라이팅
     */
    highlightText(text, term) {
        if (!text || !term) return this.escapeHtml(text);
        
        const regex = new RegExp(`(${this.escapeRegex(term)})`, 'gi');
        return this.escapeHtml(text).replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600">$1</mark>');
    }

    /**
     * URL 생성 (Text Fragment 포함)
     */
    createURL(fileName, matches) {
        // 인덱스에서 path 가져오기
        const baseUrl = this.getFileUrl(fileName);
        
        // Text Fragment 생성
        const textFragment = this.createTextFragment(matches);
        
        if (textFragment) {
            return `${baseUrl}#:~:text=${textFragment}`;
        }
        
        return baseUrl;
    }

    /**
     * Text Fragment 생성
     * https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment/Text_fragments
     */
    createTextFragment(matches) {
        // content 매치에서 첫 번째 term 사용
        const contentMatch = matches.find(m => m.scope === 'content');
        
        if (contentMatch && contentMatch.term) {
            return encodeURIComponent(contentMatch.term);
        }
        
        return null;
    }

    /**
     * 파일명을 URL로 변환 (인덱스에서 path 가져오기)
     */
    getFileUrl(fileName) {
        const index = this.searchEngine.indexManager.getIndex();
        
        if (index && index.files && index.files[fileName]) {
            const path = index.files[fileName].path;
            if (path) {
                return path;
            }
        }
        
        console.warn(`Path not found for file: ${fileName}`);
        return null;
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
     * 결과 숨기기
     */
    hideResults() {
        this.searchResults.classList.add('hidden');
        this.searchResults.innerHTML = '';
    }

    /**
     * 로딩 표시
     */
    showLoading() {
        this.searchResults.classList.remove('hidden');
        this.searchResults.innerHTML = '<div class="p-2 text-sm text-neutral-500">검색 준비 중...</div>';
    }

    /**
     * 결과 없음 표시
     */
    showNoResults() {
        this.searchResults.classList.remove('hidden');
        this.searchResults.innerHTML = '<div class="p-2 text-sm text-neutral-500">검색 결과가 없습니다.</div>';
    }

    /**
     * HTML 이스케이프
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 정규식 이스케이프
     */
    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// 전역 인스턴스 생성 (DOMContentLoaded 후)
let searchUI;

if (typeof document !== 'undefined') {
    const initSearchUI = () => {
        // 의존성 확인
        if (typeof searchIndexManager === 'undefined' || 
            typeof searchQueryParser === 'undefined') {
            console.error('Search dependencies not loaded');
            return;
        }

        // SearchEngine 인스턴스 생성
        const searchEngine = new SearchEngine(searchIndexManager, searchQueryParser);
        
        // SearchUI 인스턴스 생성
        searchUI = new SearchUI(searchEngine);
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
