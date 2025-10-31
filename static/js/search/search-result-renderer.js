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
        
        // 1. 파일명 하이라이팅 (항상 표시) + 매치 타입 아이콘
        const displayNameHTML = this.renderFileName(fileName, matches);
        
        // 2. 태그 표시 + 매치 타입 아이콘
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
        
        // 3. 메타데이터 표시 + 매치 타입 아이콘
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
        
        // 4. 본문 스니펫 + 매치 타입 아이콘
        let snippetHTML = '';
        if (searchType === 'integrated') {
            // 통합 검색: 항상 표시 (매치된 경우 해당 부분 포함, 아니면 앞부분)
            snippetHTML = this.renderSnippetForIntegrated(fileData.content, matches);
        } else if (searchType === 'scoped') {
            // 범위 지정 검색: 본문 범위 지정 검색 시에만
            const hasContentScope = matches.some(m => m.scope === 'content');
            snippetHTML = hasContentScope ? this.renderSnippet(fileData.content, matches) : '';
        }
        
        // URL 생성
        const url = this.urlBuilder.buildURL(fileName, matches);
        
        return `
            <a href="${url}" 
               class="search-result-item block p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
               data-filename="${this.textHighlighter.escapeHtml(fileName)}"
               data-matches='${JSON.stringify(matches)}'>
                <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium">${displayNameHTML}</div>
                    ${tagsHTML}
                    ${contextHTML}
                    ${snippetHTML}
                </div>
            </a>
        `;
    }

    /**
     * 매치 타입 아이콘만 반환 (배지 없이)
     * @param {string} matchType - 'exact' or 'partial'
     * @returns {string}
     */
    renderMatchTypeIcon(matchType) {
        if (matchType === 'exact') {
            return '🎯';
        } else {
            return '≈';
        }
    }

    /**
     * 파일명 렌더링 (매치 타입 아이콘 포함)
     * 형식: 파일명: {파일명} 🎯 또는 ≈
     * @param {string} fileName 
     * @param {Array} matches 
     * @returns {string}
     */
    renderFileName(fileName, matches) {
        // 파일명 하이라이팅
        const highlightedName = this.textHighlighter.highlightFileName(fileName, matches);
        
        // 파일명 매치 찾기
        const fileMatch = matches.find(m => m.scope === 'file');
        const matchIcon = fileMatch ? this.renderMatchTypeIcon(fileMatch.matchType) : '';
        
        if (matchIcon) {
            return `<span>파일명: ${highlightedName} ${matchIcon}</span>`;
        } else {
            return `<span>파일명: ${highlightedName}</span>`;
        }
    }

    /**
     * 매치 타입 배지 생성 (정확한 일치/부분 일치)
     * @param {string} matchType - 'exact' or 'partial'
     * @returns {string}
     */
    renderMatchTypeBadge(matchType) {
        if (matchType === 'exact') {
            return '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" title="정확히 일치">🎯</span>';
        } else {
            return '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300" title="부분 일치">≈</span>';
        }
    }

    /**
     * 통합 검색용 스니펫 (항상 표시, 매치 타입 아이콘 포함)
     * 형식: 본문: {...내용...} 🎯 또는 ≈
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
            const icon = this.renderMatchTypeIcon(contentMatches[0].matchType);
            return `<div class="text-xs text-neutral-500 mt-1 line-clamp-2">본문: ${highlightedSnippet} ${icon}</div>`;
        } else if (content) {
            // 본문에 매치 안된 경우: 앞부분만 표시 (아이콘 없음)
            const snippet = content.substring(0, 80) + (content.length > 80 ? '...' : '');
            const escapedSnippet = this.textHighlighter.escapeHtml(snippet);
            return `<div class="text-xs text-neutral-500 mt-1 line-clamp-2">본문: ${escapedSnippet}</div>`;
        }
        
        return '';
    }

    /**
     * 태그 HTML 생성 (매치 타입 아이콘 포함)
     * 형식: 태그: {태그1} 🎯, {태그2} ≈
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
            
            // 해당 태그와 매치되는 검색어 찾기
            const matchedTerm = tagMatches.find(m => 
                String(m.value).toLowerCase() === tagStr.toLowerCase()
            );
            
            if (matchedTerm) {
                // 하이라이팅 + 매치 타입 아이콘
                const highlighted = this.textHighlighter.highlightText(tagStr, matchedTerm.term);
                const icon = this.renderMatchTypeIcon(matchedTerm.matchType);
                return `${highlighted} ${icon}`;
            }
            return this.textHighlighter.escapeHtml(tagStr);
        }).join(', ');
        
        return `<div class="text-xs text-neutral-500 mt-1">태그: ${tagsHtml}</div>`;
    }

    /**
     * 메타데이터 HTML 생성 (매치 타입 아이콘 포함)
     * 형식: 메타데이터: {key: value} 🎯, {key2: value2} ≈
     * 동일한 키는 한 번만 표시하고 모든 매치된 term을 하이라이팅
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

        // 동일한 키끼리 그룹화
        const groupedByKey = {};
        metaMatches.forEach(m => {
            if (!groupedByKey[m.key]) {
                groupedByKey[m.key] = {
                    key: m.key,
                    value: m.value,
                    terms: [],
                    matchTypes: []
                };
            }
            groupedByKey[m.key].terms.push(m.term);
            groupedByKey[m.key].matchTypes.push(m.matchType);
        });

        // 각 키별로 렌더링
        const contexts = Object.values(groupedByKey).map(group => {
            const keyHtml = this.textHighlighter.escapeHtml(group.key);
            
            // 모든 term을 한 번에 하이라이팅 (highlightMultipleTerms 사용)
            const valueHtml = this.textHighlighter.highlightMultipleTerms(String(group.value), group.terms);
            
            // 가장 높은 우선순위 matchType 선택 (exact > partial)
            const hasExact = group.matchTypes.includes('exact');
            const icon = this.renderMatchTypeIcon(hasExact ? 'exact' : 'partial');
            
            return `${keyHtml}: ${valueHtml} ${icon}`;
        }).join(', ');

        return `<div class="text-xs text-neutral-400 mt-1">메타데이터: ${contexts}</div>`;
    }

    /**
     * 본문 스니펫 HTML 생성 (매치 타입 아이콘 포함)
     * 형식: 본문: {...내용...} 🎯 또는 ≈
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
        const icon = this.renderMatchTypeIcon(contentMatches[0].matchType);
        
        return `<div class="text-xs text-neutral-500 mt-1 line-clamp-2">본문: ${highlightedSnippet} ${icon}</div>`;
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
                text: '🔭 범위 지정 검색 결과',
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
