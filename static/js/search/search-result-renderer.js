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
        const { fileName, fileData, matches, searchType, scopeType } = result;
        
        // 1. 파일명 하이라이팅 (항상 표시)
        const displayNameHTML = this.textHighlighter.highlightFileName(fileName, matches);
        
        // 2. 태그 표시
        let tagsHTML = '';
        if (searchType === 'integrated') {
            // 통합 검색: 태그에 매치된 경우만
            const tagMatches = matches.filter(m => m.scope === 'tag');
            tagsHTML = tagMatches.length > 0 ? this.renderTags(fileData.frontmatter?.tags, matches) : '';
        } else if (searchType === 'scoped') {
            // 범위 지정 검색: 태그 범위 지정 검색 시에만
            const hasTagScope = matches.some(m => m.scope === 'tag');
            tagsHTML = hasTagScope ? this.renderTags(fileData.frontmatter?.tags, matches) : '';
        }
        
        // 3. 메타데이터 표시
        let contextHTML = '';
        if (searchType === 'integrated') {
            // 통합 검색: 메타데이터에 매치된 경우만
            const metaMatches = matches.filter(m => m.scope === 'metadata');
            contextHTML = metaMatches.length > 0 ? this.renderMetadata(matches, fileData.frontmatter) : '';
        } else if (searchType === 'scoped') {
            // 범위 지정 검색: 메타데이터 범위 지정 검색 시에만
            const hasMetaScope = matches.some(m => m.scope === 'metadata');
            contextHTML = hasMetaScope ? this.renderMetadata(matches, fileData.frontmatter) : '';
        }
        
        // 4. 본문 스니펫
        let snippetHTML = '';
        if (searchType === 'integrated') {
            // 통합 검색: 항상 표시 (매치된 경우 해당 부분 포함, 아니면 앞부분)
            snippetHTML = this.renderSnippetForIntegrated(fileData.content, matches);
        } else if (searchType === 'scoped') {
            // 범위 지정 검색: 본문 범위 지정 검색 시에만
            const hasContentScope = matches.some(m => m.scope === 'content');
            snippetHTML = hasContentScope ? this.renderSnippet(fileData.content, matches) : '';
        }
        
        // 5. 범위 지정 검색 조건 일치 표시 (우측 정렬)
        let scopeIndicatorHTML = '';
        if (searchType === 'scoped') {
            scopeIndicatorHTML = this.renderScopeIndicator(matches);
        }
        
        // URL 생성
        const url = this.urlBuilder.buildURL(fileName, matches);
        
        return `
            <a href="${url}" 
               class="search-result-item block p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
               data-filename="${this.textHighlighter.escapeHtml(fileName)}"
               data-matches='${JSON.stringify(matches)}'>
                <div class="flex items-start justify-between gap-2">
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium">${displayNameHTML}</div>
                        ${tagsHTML}
                        ${contextHTML}
                        ${snippetHTML}
                    </div>
                    ${scopeIndicatorHTML}
                </div>
            </a>
        `;
    }

    /**
     * 범위 지정 검색 조건 일치 표시
     * @param {Array} matches 
     * @returns {string}
     */
    renderScopeIndicator(matches) {
        const scopes = new Set();
        matches.forEach(m => scopes.add(m.scope));
        
        const scopeLabels = {
            'file': '📄',
            'tag': '🏷️',
            'metadata': '📋',
            'content': '📝'
        };
        
        const indicators = Array.from(scopes)
            .map(scope => scopeLabels[scope] || scope)
            .join(' ');
        
        return `<div class="text-xs text-neutral-400 flex-shrink-0 ml-2">${indicators}</div>`;
    }

    /**
     * 통합 검색용 스니펫 (항상 표시)
     * @param {string} content 
     * @param {Array} matches 
     * @returns {string}
     */
    renderSnippetForIntegrated(content, matches) {
        const contentMatches = matches.filter(m => m.scope === 'content');
        
        if (contentMatches.length > 0 && content) {
            // 본문에 매치된 경우: 해당 부분 포함한 스니펫
            const term = contentMatches[0].term;
            const snippet = this.createSnippet(content, term, 80);
            const highlightedSnippet = this.textHighlighter.highlightText(snippet, term);
            return `<div class="text-xs text-neutral-500 mt-1 line-clamp-2">${highlightedSnippet}</div>`;
        } else if (content) {
            // 본문에 매치 안된 경우: 앞부분만 표시
            const snippet = content.substring(0, 80) + (content.length > 80 ? '...' : '');
            const escapedSnippet = this.textHighlighter.escapeHtml(snippet);
            return `<div class="text-xs text-neutral-500 mt-1 line-clamp-2">${escapedSnippet}</div>`;
        }
        
        return '';
    }

    /**
     * 태그 HTML 생성
     * @param {Array} tags 
     * @param {Array} matches 
     * @returns {string}
     */
    renderTags(tags, matches) {
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
                const highlightClass = 'bg-yellow-200 dark:bg-yellow-600';
                return `<mark class="${highlightClass}">${this.textHighlighter.escapeHtml(tagStr)}</mark>`;
            }
            return this.textHighlighter.escapeHtml(tagStr);
        }).join(', ');
        
        return `<div class="text-xs text-neutral-500 mt-1">${tagsHtml}</div>`;
    }

    /**
     * 메타데이터 HTML 생성 (tags 제외)
     * @param {Array} matches 
     * @param {Object} frontmatter 
     * @returns {string}
     */
    renderMetadata(matches, frontmatter) {
        const metaMatches = matches.filter(m => {
            // tags는 제외 (이미 위에서 표시)
            if (m.scope === 'metadata' && m.key && m.key.toLowerCase() === 'tags') {
                return false;
            }
            return m.scope === 'metadata';
        });
        
        if (metaMatches.length === 0) {
            return '';
        }

        const contexts = metaMatches.slice(0, 2).map(m => {
            const keyHtml = this.textHighlighter.highlightText(m.key, m.term);
            const valueHtml = this.textHighlighter.highlightText(String(m.value), m.term);
            return `${keyHtml}: ${valueHtml}`;
        }).join(' · ');

        return `<div class="text-xs text-neutral-400 mt-1">🏷️ ${contexts}</div>`;
    }

    /**
     * 본문 스니펫 HTML 생성
     * @param {string} content 
     * @param {Array} matches 
     * @returns {string}
     */
    renderSnippet(content, matches) {
        const contentMatches = matches.filter(m => m.scope === 'content');
        
        if (contentMatches.length === 0 || !content) {
            return '';
        }

        const term = contentMatches[0].term;
        const snippet = this.createSnippet(content, term, 80);
        const highlightedSnippet = this.textHighlighter.highlightText(snippet, term);
        
        return `<div class="text-xs text-neutral-500 mt-1 line-clamp-2">${highlightedSnippet}</div>`;
    }

    /**
     * 본문에서 스니펫 추출 (검색어 앞뒤로 적절히 자름)
     * @param {string} content 
     * @param {string} term 
     * @param {number} contextLength 
     * @returns {string}
     */
    createSnippet(content, term, contextLength = 80) {
        const lowerContent = content.toLowerCase();
        const lowerTerm = term.toLowerCase();
        const index = lowerContent.indexOf(lowerTerm);
        
        if (index === -1) {
            // 검색어를 찾지 못한 경우 앞부분만 표시
            return content.substring(0, contextLength) + '...';
        }

        // 검색어 위치를 중심으로 앞뒤로 contextLength/2 씩 자름
        const halfContext = Math.floor(contextLength / 2);
        const start = Math.max(0, index - halfContext);
        const end = Math.min(content.length, index + term.length + halfContext);
        
        let snippet = content.substring(start, end);
        
        // 앞부분이 잘렸으면 ... 추가
        if (start > 0) snippet = '...' + snippet;
        
        // 뒷부분이 잘렸으면 ... 추가
        if (end < content.length) snippet = snippet + '...';
        
        return snippet;
    }

    /**
     * 전체 결과 목록 HTML 생성
     * @param {Array} results 
     * @param {string} searchType - 'integrated' or 'scoped'
     * @returns {string}
     */
    renderResults(results, searchType = 'integrated') {
        if (results.length === 0) {
            return '';
        }
        
        // 배너 생성
        const bannerHTML = this.renderBanner(searchType);
        
        // 결과 아이템들
        const itemsHTML = results.map(result => this.renderResultItem(result)).join('');
        
        return `${bannerHTML}${itemsHTML}`;
    }

    /**
     * 검색 타입 배너 생성
     * @param {string} searchType 
     * @returns {string}
     */
    renderBanner(searchType) {
        const bannerConfig = {
            'integrated': {
                text: '🔍 통합 검색 결과',
                className: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
            },
            'scoped': {
                text: '🎯 범위 지정 검색 결과',
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
