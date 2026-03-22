/**
 * Search Result Renderer
 * 검색 결과의 HTML 렌더링을 담당합니다.
 */

class SearchResultRenderer {
    constructor(textHighlighter, urlBuilder) {
        this.textHighlighter = textHighlighter;
        this.urlBuilder = urlBuilder;
    }

    /**
     * 검색 결과 아이템 HTML 생성
     * @param {Object} result 
     * @returns {string}
     */
    renderResultItem(result) {
        const { fileName, fileData, matches, searchType } = result;
        
        const displayNameHTML = this.renderFileName(fileName, matches);
        
        let tagsHTML = '';
        const tagMatches = matches.filter(m => m.scope === 'tag');
        if ((searchType === 'integrated' && tagMatches.length > 0) || 
            (searchType === 'scoped' && matches.some(m => m.scope === 'tag'))) {
            tagsHTML = this.renderTags(fileData.frontmatter?.tags, matches);
        }
        
        let contextHTML = '';
        const metaMatches = matches.filter(m => m.scope === 'metadata');
        if ((searchType === 'integrated' && metaMatches.length > 0) ||
            (searchType === 'scoped' && matches.some(m => m.scope === 'metadata'))) {
            contextHTML = this.renderMetadata(matches, fileData.frontmatter);
        }
        
        let snippetHTML = '';
        if (searchType === 'integrated') {
            snippetHTML = this.renderSnippetForIntegrated(fileData.content, matches);
        } else if (searchType === 'scoped' && matches.some(m => m.scope === 'content')) {
            snippetHTML = this.renderSnippet(fileData.content, matches);
        }
        
        const url = this.urlBuilder.buildURL(fileName, matches);
        
        return `
            <a href="${url}" 
               class="search-result-item block p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md border-b border-neutral-200 dark:border-neutral-700"
               data-filename="${this.textHighlighter.escapeHtml(fileName)}"
               data-matches='${JSON.stringify(matches)}'>
                <div class="flex-1 min-w-0">
                    ${displayNameHTML}
                    ${tagsHTML}
                    ${contextHTML}
                    ${snippetHTML}
                </div>
            </a>
        `;
    }

    /**
     * 매치 타입 텍스트 렌더링
     * @param {string} matchType - 'exact' or 'partial'
     * @returns {string} HTML 문자열
     */
    renderMatchTypeText(matchType) {
        if (!matchType) return '';

        const displays = window.SearchConfig?.MATCH_TYPE_DISPLAYS || {};
        const text = (matchType === 'exact') 
            ? (displays.EXACT_MATCH || '정확 매치')
            : (displays.PARTIAL_MATCH || '부분 매치');
        
        return `<span class="text-[0.625rem] text-neutral-500 dark:text-neutral-400 ml-2">${text}</span>`;
    }

    /**
     * 파일명 렌더링 (매치 타입 텍스트 우측 정렬)
     * @param {string} fileName 
     * @param {Array} matches 
     * @returns {string}
     */
    renderFileName(fileName, matches) {
        const highlightedName = this.textHighlighter.highlightFileName(fileName, matches);
        const fileMatch = matches.find(m => m.scope === 'file');
        const matchTypeText = this.renderMatchTypeText(fileMatch?.matchType);

        return `
            <div class="flex justify-between items-center text-sm font-medium">
                <span>${highlightedName}</span>
                ${matchTypeText}
            </div>
        `;
    }

    /**
     * 통합 검색용 스니펫 (매치 타입 텍스트 우측 정렬)
     * @param {string} content 
     * @param {Array} matches 
     * @returns {string}
     */
    renderSnippetForIntegrated(content, matches) {
        const contentMatches = matches.filter(m => m.scope === 'content');
        let snippetContent;
        let matchType = null;

        if (contentMatches.length > 0 && content) {
            const term = contentMatches[0].term;
            const snippet = this.createSnippet(content, term);
            snippetContent = this.textHighlighter.highlightText(snippet, term);
            matchType = contentMatches[0].matchType;
        } else if (content) {
            const snippet = content.substring(0, 80) + (content.length > 80 ? '...' : '');
            snippetContent = this.textHighlighter.escapeHtml(snippet);
        } else {
            return '';
        }

        const matchTypeText = this.renderMatchTypeText(matchType);

        return `
            <div class="flex justify-between items-center text-xs text-neutral-500 mt-1 break-words">
                <span>${snippetContent}</span>
                ${matchTypeText}
            </div>
        `;
    }

    /**
     * 태그 HTML 생성 (가장 높은 수준의 매치 타입 텍스트 우측 정렬)
     * @param {Array} tags 
     * @param {Array} matches 
     * @returns {string}
     */
    renderTags(tags, matches) {
        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            return '';
        }

        const config = window.SearchConfig?.UI || {};
        const maxTags = config.MAX_TAGS_DISPLAY || 10;
        const tagMatches = matches.filter(m => m.scope === 'tag');
        
        if (tagMatches.length === 0) return '';

        const displayTags = tags.slice(0, maxTags);
        
        const tagsHtml = displayTags.map(tag => {
            const tagStr = String(tag);
            const matchedTerm = tagMatches.find(m => String(m.value).toLowerCase() === tagStr.toLowerCase());
            
            if (matchedTerm) {
                return this.textHighlighter.highlightText(tagStr, matchedTerm.term);
            }
            return this.textHighlighter.escapeHtml(tagStr);
        }).join(', ');

        const hasExactMatch = tagMatches.some(m => m.matchType === 'exact');
        const lineMatchType = hasExactMatch ? 'exact' : 'partial';
        const matchTypeText = this.renderMatchTypeText(lineMatchType);

        return `
            <div class="flex justify-between items-center text-xs text-neutral-500 mt-1">
                <span>태그: ${tagsHtml}</span>
                ${matchTypeText}
            </div>
        `;
    }

    /**
     * 메타데이터 HTML 생성 (가장 높은 수준의 매치 타입 텍스트 우측 정렬)
     * @param {Array} matches 
     * @param {Object} frontmatter 
     * @returns {string}
     */
    renderMetadata(matches, frontmatter) {
        const metaMatches = matches.filter(m => m.scope === 'metadata' && m.key?.toLowerCase() !== 'tags');
        if (metaMatches.length === 0) return '';

        const groupedByKey = {};
        metaMatches.forEach(m => {
            if (!groupedByKey[m.key]) {
                groupedByKey[m.key] = { key: m.key, value: m.value, terms: [] };
            }
            groupedByKey[m.key].terms.push(m.term);
        });

        const contexts = Object.values(groupedByKey).map(group => {
            const keyHtml = this.textHighlighter.escapeHtml(group.key);
            const valueHtml = this.textHighlighter.highlightMultipleTerms(String(group.value), group.terms);
            return `${keyHtml}: ${valueHtml}`;
        }).join(', ');

        const hasExactMatch = metaMatches.some(m => m.matchType === 'exact');
        const lineMatchType = hasExactMatch ? 'exact' : 'partial';
        const matchTypeText = this.renderMatchTypeText(lineMatchType);

        return `
            <div class="flex justify-between items-center text-xs text-neutral-400 mt-1">
                <span>메타데이터: ${contexts}</span>
                ${matchTypeText}
            </div>
        `;
    }

    /**
     * 본문 스니펫 HTML 생성 (매치 타입 텍스트 우측 정렬)
     * @param {string} content 
     * @param {Array} matches 
     * @returns {string}
     */
    renderSnippet(content, matches) {
        const contentMatches = matches.filter(m => m.scope === 'content');
        if (contentMatches.length === 0 || !content) return '';

        const term = contentMatches[0].term;
        const snippet = this.createSnippet(content, term);
        const highlightedSnippet = this.textHighlighter.highlightText(snippet, term);
        const matchTypeText = this.renderMatchTypeText(contentMatches[0].matchType);
        
        return `
            <div class="flex justify-between items-center text-xs text-neutral-500 mt-1 break-words">
                <span>본문: ${highlightedSnippet}</span>
                ${matchTypeText}
            </div>
        `;
    }

    /**
     * 본문에서 스니펫 추출
     * @param {string} content 
     * @param {string} term 
     * @param {number} contextLength 
     * @returns {string}
     */
    createSnippet(content, term, contextLength = null) {
        const config = window.SearchConfig?.UI || {};
        const snippetLength = contextLength || config.SNIPPET_LENGTH || 80;
        
        const lowerContent = content.toLowerCase();
        const lowerTerm = term.toLowerCase();
        const index = lowerContent.indexOf(lowerTerm);
        
        if (index === -1) {
            return content.substring(0, snippetLength) + (content.length > snippetLength ? '...' : '');
        }

        const halfContext = Math.floor(snippetLength / 2);
        const start = Math.max(0, index - halfContext);
        const end = Math.min(content.length, index + term.length + halfContext);
        
        let snippet = content.substring(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < content.length) snippet = snippet + '...';
        
        return snippet;
    }

    /**
     * 전체 결과 목록 HTML 생성
     * @param {Array} results 
     * @param {string} searchType 
     * @returns {string}
     */
    renderResults(results, searchType = 'integrated') {
        if (results.length === 0) return '';
        
        const bannerHTML = this.renderBanner(searchType);
        const itemsHTML = results.map(result => this.renderResultItem(result)).join('');
        
        return `${bannerHTML}${itemsHTML}`;
    }

    /**
     * 검색 도움말 HTML 생성
     * @returns {string}
     */
    renderHelp() {
        return `
            <div class="px-3 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                <div class="font-bold mb-3 text-neutral-800 dark:text-neutral-200 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                    🔍 검색 가이드
                </div>
                
                <div class="mb-4">
                    <div class="font-semibold mb-1 text-neutral-700 dark:text-neutral-300">통합 검색 (기본)</div>
                    <p class="text-xs">키워드 입력 시 파일명, 태그, 본문을 모두 검색합니다.</p>
                </div>

                <div>
                    <div class="font-semibold mb-1 text-neutral-700 dark:text-neutral-300">범위 지정 검색 (접두사 사용)</div>
                    <p class="text-xs mb-2">특정 범위를 지정하여 효율적으로 검색할 수 있습니다.</p>
                    <ul class="space-y-1.5 ml-1 text-xs">
                        <li class="flex items-center">
                            <code class="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono mr-2">file:</code> 
                            <span>파일명 (단축: f:)</span>
                        </li>
                        <li class="flex items-center">
                            <code class="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono mr-2">tag:</code> 
                            <span>태그 (단축: t:)</span>
                        </li>
                        <li class="flex items-center">
                            <code class="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono mr-2">meta:</code> 
                            <span>메타데이터 (단축: m:)</span>
                        </li>
                        <li class="flex items-center">
                            <code class="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono mr-2">content:</code> 
                            <span>본문 (단축: c:)</span>
                        </li>
                    </ul>
                </div>
                
                <div class="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-700 text-xs text-neutral-500 italic">
                    예: <code class="bg-neutral-100 dark:bg-neutral-800 px-1 rounded not-italic">t:hugo c:검색</code>
                </div>
            </div>
        `;
    }

    /**
     * 검색 타입 배너 생성
     * @param {string} searchType 
     * @returns {string}
     */
    renderBanner(searchType) {
        const bannerStyles = window.SearchConfig?.BANNER_STYLES || {};
        const displays = window.SearchConfig?.MATCH_TYPE_DISPLAYS || {};
        
        const bannerConfig = {
            'integrated': bannerStyles.integrated || {
                text: `${displays.INTEGRATED_SEARCH || '🔍'} 통합 검색 결과`,
                className: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
            },
            'scoped': bannerStyles.scoped || {
                text: `${displays.SCOPED_SEARCH || '🔭'} 범위 지정 검색 결과`,
                className: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
            }
        };
        
        const config = bannerConfig[searchType] || bannerConfig['integrated'];
        
        return `
            <div class="${config.className} px-3 py-2 mb-2 rounded-md text-xs font-medium">
                ${config.text}
            </div>
        `;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SearchResultRenderer };
}
