/**
 * Search Result Renderer
 * 검색 결과의 HTML 렌더링을 담당합니다.
 */

class SearchResultRenderer {
    constructor(textHighlighter, urlBuilder) {
        this.textHighlighter = textHighlighter;
        this.urlBuilder = urlBuilder;
        
        // 아이콘 정의 (layouts/** 에서 가져옴)
        this.icons = {
            document: `<svg class="h-5 w-5 text-neutral-400 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"></path>
            </svg>`,
            tag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3 text-primary-blue-light">
                <path fill-rule="evenodd" d="M4.5 2A2.5 2.5 0 0 0 2 4.5v2.879a2.5 2.5 0 0 0 .732 1.767l4.5 4.5a2.5 2.5 0 0 0 3.536 0l2.878-2.878a2.5 2.5 0 0 0 0-3.536l-4.5-4.5A2.5 2.5 0 0 0 7.38 2H4.5ZM5 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" />
            </svg>`,
            info: `<svg class="w-3 h-3 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>`
        };
    }

    /**
     * 검색 결과 아이템 HTML 생성
     * @param {Object} result 
     * @returns {string}
     */
    renderResultItem(result) {
        const { fileName, fileData, matches, searchType } = result;
        const url = this.urlBuilder.buildURL(fileName, matches);
        
        const displayNameHTML = this.renderFileName(fileName, matches);
        
        let metaHTML = '';
        
        // 태그 매치 또는 일반 태그 표시
        const tagMatches = matches.filter(m => m.scope === 'tag');
        if (fileData.frontmatter?.tags) {
            metaHTML += this.renderTags(fileData.frontmatter.tags, matches);
        }
        
        // 메타데이터 매치 표시
        const metaMatches = matches.filter(m => m.scope === 'metadata' && m.key?.toLowerCase() !== 'tags');
        if (metaMatches.length > 0) {
            metaHTML += this.renderMetadata(matches, fileData.frontmatter);
        }
        
        // 스니펫 표시
        let snippetHTML = '';
        if (searchType === 'integrated') {
            snippetHTML = this.renderSnippetForIntegrated(fileData.content, matches);
        } else if (searchType === 'scoped' && matches.some(m => m.scope === 'content')) {
            snippetHTML = this.renderSnippet(fileData.content, matches);
        }
        
        return `
            <a href="${url}" 
               class="search-result-item block p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-lg transition-all border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 mb-1"
               data-filename="${this.textHighlighter.escapeHtml(fileName)}"
               data-matches='${JSON.stringify(matches)}'>
                <div class="flex items-start gap-3">
                    <div class="mt-1 flex-shrink-0">
                        ${this.icons.document}
                    </div>
                    <div class="flex-1 min-w-0">
                        ${displayNameHTML}
                        ${metaHTML}
                        ${snippetHTML}
                    </div>
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
        
        return `<span class="text-[0.6rem] uppercase tracking-tighter text-neutral-400 dark:text-neutral-500 ml-2">${text}</span>`;
    }

    /**
     * 파일명 렌더링
     */
    renderFileName(fileName, matches) {
        const highlightedName = this.textHighlighter.highlightFileName(fileName, matches);
        const fileMatch = matches.find(m => m.scope === 'file');
        const matchTypeText = this.renderMatchTypeText(fileMatch?.matchType);

        return `
            <div class="flex justify-between items-center text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-0.5">
                <span class="truncate">${highlightedName}</span>
                ${matchTypeText}
            </div>
        `;
    }

    /**
     * 통합 검색용 스니펫
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
            <div class="flex justify-between items-start text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed break-words">
                <span class="flex-1">${snippetContent}</span>
                <div class="flex-shrink-0 ml-2">${matchTypeText}</div>
            </div>
        `;
    }

    /**
     * 태그 HTML 생성
     */
    renderTags(tags, matches) {
        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            return '';
        }

        const config = window.SearchConfig?.UI || {};
        const maxTags = config.MAX_TAGS_DISPLAY || 10;
        const tagMatches = matches.filter(m => m.scope === 'tag');
        
        const displayTags = tags.slice(0, maxTags);
        
        const tagsHtml = displayTags.map(tag => {
            const tagStr = String(tag);
            const matchedTerm = tagMatches.find(m => String(m.value).toLowerCase() === tagStr.toLowerCase());
            
            if (matchedTerm) {
                return `<span class="inline-flex items-center gap-1">${this.icons.tag}${this.textHighlighter.highlightText(tagStr, matchedTerm.term)}</span>`;
            }
            return `<span class="inline-flex items-center gap-1">${this.icons.tag}${this.textHighlighter.escapeHtml(tagStr)}</span>`;
        }).join(' ');

        const hasExactMatch = tagMatches.some(m => m.matchType === 'exact');
        const lineMatchType = tagMatches.length > 0 ? (hasExactMatch ? 'exact' : 'partial') : null;
        const matchTypeText = this.renderMatchTypeText(lineMatchType);

        return `
            <div class="flex justify-between items-center text-[0.7rem] text-neutral-500 dark:text-neutral-400 gap-2 overflow-hidden">
                <div class="flex flex-wrap gap-x-2 gap-y-1 overflow-hidden">
                    ${tagsHtml}
                </div>
                ${matchTypeText}
            </div>
        `;
    }

    /**
     * 메타데이터 HTML 생성
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
            return `<span class="inline-flex items-center gap-1 text-neutral-400">${this.icons.info}<span class="font-medium">${keyHtml}</span>: ${valueHtml}</span>`;
        }).join(' ');

        const hasExactMatch = metaMatches.some(m => m.matchType === 'exact');
        const lineMatchType = hasExactMatch ? 'exact' : 'partial';
        const matchTypeText = this.renderMatchTypeText(lineMatchType);

        return `
            <div class="flex justify-between items-center text-[0.7rem] mt-1 gap-2 overflow-hidden">
                <div class="flex flex-wrap gap-2 overflow-hidden">
                    ${contexts}
                </div>
                ${matchTypeText}
            </div>
        `;
    }

    /**
     * 본문 스니펫 HTML 생성
     */
    renderSnippet(content, matches) {
        const contentMatches = matches.filter(m => m.scope === 'content');
        if (contentMatches.length === 0 || !content) return '';

        const term = contentMatches[0].term;
        const snippet = this.createSnippet(content, term);
        const highlightedSnippet = this.textHighlighter.highlightText(snippet, term);
        const matchTypeText = this.renderMatchTypeText(contentMatches[0].matchType);
        
        return `
            <div class="flex justify-between items-start text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed break-words">
                <span class="flex-1">${highlightedSnippet}</span>
                <div class="flex-shrink-0 ml-2">${matchTypeText}</div>
            </div>
        `;
    }

    /**
     * 본문에서 스니펫 추출
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
     */
    renderResults(results, searchType = 'integrated') {
        if (results.length === 0) return '';
        
        const bannerHTML = this.renderBanner(searchType);
        const itemsHTML = results.map(result => this.renderResultItem(result)).join('');
        
        return `<div class="space-y-1">${bannerHTML}${itemsHTML}</div>`;
    }

    /**
     * 검색 도움말 HTML 생성
     */
    renderHelp() {
        return `
            <div class="px-3 py-5 text-sm">
                <div class="flex items-center gap-2 font-bold mb-6 text-neutral-800 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-700 pb-3 text-xl latin-font">
                    <span>🔍</span>
                    <span>검색 가이드</span>
                </div>
                
                <!-- 1. 통합 검색 -->
                <div class="mb-8">
                    <div class="font-bold mb-2 text-neutral-700 dark:text-neutral-200 flex items-center gap-2 text-base">
                        <div class="w-1.5 h-4 bg-primary-blue-light rounded-full"></div>
                        통합 검색 (기본)
                    </div>
                    <div class="pl-3.5 space-y-2 text-neutral-600 dark:text-neutral-400">
                        <p class="text-xs leading-relaxed">
                            별도 접두사 없이 검색어를 입력하면 <span class="text-neutral-800 dark:text-neutral-200 font-medium">파일명 > 태그 > 메타데이터 > 본문</span> 순으로 중요도를 계산하여 가장 관련성 높은 결과를 보여줍니다.
                        </p>
                        <div class="bg-blue-50/50 dark:bg-blue-900/10 p-2.5 rounded-md border border-blue-100/50 dark:border-blue-900/20">
                            <div class="text-[0.65rem] font-bold text-primary-blue-light uppercase mb-1">Priority Strategy</div>
                            <ul class="text-[0.7rem] space-y-1">
                                <li class="flex items-center gap-1.5">• <strong>파일명:</strong> 가장 높은 가중치</li>
                                <li class="flex items-center gap-1.5">• <strong>정확 매치:</strong> 부분 일치보다 항상 우선 표시</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 2. 범위 지정 검색 -->
                <div class="mb-8 border-t border-neutral-100 dark:border-neutral-800/50 pt-6">
                    <div class="font-bold mb-3 text-neutral-700 dark:text-neutral-200 flex items-center gap-2 text-base">
                        <div class="w-1.5 h-4 bg-primary-green-light rounded-full"></div>
                        범위 지정 검색 (Scopes)
                    </div>
                    <p class="text-xs text-neutral-500 mb-4 ml-3.5 leading-relaxed">
                        접두사를 사용하여 검색 범위를 특정할 수 있습니다. <br/>여러 개를 조합하면 <span class="font-semibold text-neutral-700 dark:text-neutral-300">AND(교집합)</span> 조건으로 검색됩니다.
                    </p>
                    
                    <div class="space-y-4 ml-3.5">
                        <!-- f: -->
                        <div class="group">
                            <div class="flex items-center gap-2 mb-1">
                                <code class="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-primary-blue-light font-bold">f:</code>
                                <span class="text-xs font-semibold text-neutral-700 dark:text-neutral-300 italic">file:</span>
                                <span class="text-[0.65rem] text-neutral-400">파일명에서 찾기</span>
                            </div>
                            <p class="text-[0.7rem] text-neutral-400 pl-1">예: <span class="text-neutral-500">f:hugo</span> (hugo가 포함된 파일)</p>
                        </div>

                        <!-- t: -->
                        <div class="group">
                            <div class="flex items-center gap-2 mb-1">
                                <code class="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-primary-blue-light font-bold">t:</code>
                                <span class="text-xs font-semibold text-neutral-700 dark:text-neutral-300 italic">tag:</span>
                                <span class="text-[0.65rem] text-neutral-400">특정 태그 필터링</span>
                            </div>
                            <p class="text-[0.7rem] text-neutral-400 pl-1">예: <span class="text-neutral-500">t:android</span> (android 태그 문서)</p>
                        </div>

                        <!-- m: -->
                        <div class="group">
                            <div class="flex items-center gap-2 mb-1">
                                <code class="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-primary-blue-light font-bold">m:</code>
                                <span class="text-xs font-semibold text-neutral-700 dark:text-neutral-300 italic">meta:</span>
                                <span class="text-[0.65rem] text-neutral-400">메타데이터(속성) 검색</span>
                            </div>
                            <p class="text-[0.7rem] text-neutral-500 leading-relaxed mb-1.5">전체 속성 검색 또는 특정 키 지정을 지원합니다.</p>
                            <div class="flex gap-2 pl-1">
                                <span class="text-[0.65rem] bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 px-1.5 py-0.5 rounded text-neutral-400 font-mono">m:kim</span>
                                <span class="text-[0.65rem] bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 px-1.5 py-0.5 rounded text-neutral-400 font-mono">m:author:kim</span>
                            </div>
                        </div>

                        <!-- c: -->
                        <div class="group border-b border-dashed border-neutral-100 dark:border-neutral-800 pb-2">
                            <div class="flex items-center gap-2 mb-1">
                                <code class="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-primary-blue-light font-bold">c:</code>
                                <span class="text-xs font-semibold text-neutral-700 dark:text-neutral-300 italic">content:</span>
                                <span class="text-[0.65rem] text-neutral-400">본문 내용 검색</span>
                            </div>
                            <p class="text-[0.7rem] text-neutral-400 pl-1">예: <span class="text-neutral-500">c:"hello world"</span> (본문 내 구문 검색)</p>
                        </div>
                    </div>
                </div>

                <!-- 3. 파워 팁 -->
                <div class="mt-8 pt-5 border-t border-neutral-200 dark:border-neutral-700">
                    <div class="flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-100 mb-3 uppercase tracking-widest">
                        <span class="text-yellow-500 text-sm">💡</span>
                        <span>Search Power Tips</span>
                    </div>
                    <ul class="space-y-3 ml-1 text-xs text-neutral-500">
                        <li class="flex gap-2.5">
                            <span class="text-primary-blue-light font-bold">Q.</span>
                            <span class="leading-relaxed font-medium">공백이 있는 검색어는 <code class="bg-neutral-100 dark:bg-neutral-800 px-1 rounded not-italic text-primary-blue-light">" "</code>로 감싸면 정확한 구문으로 검색됩니다.</span>
                        </li>
                        <li class="flex gap-2.5">
                            <span class="text-primary-blue-light font-bold">Q.</span>
                            <span class="leading-relaxed font-medium"><code class="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded not-italic text-primary-green-light">t:hugo c:guide</code> 처럼 여러 범위를 조합해 결과를 좁혀보세요.</span>
                        </li>
                    </ul>
                </div>
            </div>
        `;
    }

    /**
     * 검색 타입 배너 생성
     */
    renderBanner(searchType) {
        const bannerStyles = window.SearchConfig?.BANNER_STYLES || {};
        const displays = window.SearchConfig?.MATCH_TYPE_DISPLAYS || {};
        
        const bannerConfig = {
            'integrated': bannerStyles.integrated || {
                text: `${displays.INTEGRATED_SEARCH || '🔍'} 통합 검색 결과`,
                className: 'bg-primary-blue-light/10 text-primary-blue-light border-l-4 border-primary-blue-light'
            },
            'scoped': bannerStyles.scoped || {
                text: `${displays.SCOPED_SEARCH || '🔭'} 범위 지정 검색 결과`,
                className: 'bg-primary-green-light/10 text-primary-green-light border-l-4 border-primary-green-light'
            }
        };
        
        const config = bannerConfig[searchType] || bannerConfig['integrated'];
        
        return `
            <div class="${config.className} px-3 py-2 mb-3 rounded-r-md text-xs font-bold uppercase tracking-wider">
                ${config.text}
            </div>
        `;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SearchResultRenderer };
}
