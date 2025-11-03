/**
 * Search Query Parser
 * 검색 쿼리를 파싱하여 통합 검색과 범위 지정 검색을 구분합니다.
 */

class SearchQueryParser {
    constructor() {
        // SearchConfig에서 범위 별칭 가져오기 (없으면 기본값)
        this.scopeAliases = window.SearchConfig?.SCOPE_ALIASES || {
            // Filename
            'filename:': 'file',
            'file:': 'file',
            'f:': 'file',
            
            // Tag
            'tag:': 'tag',
            't:': 'tag',
            
            // Metadata/Frontmatter
            'frontmatter:': 'metadata',
            'fm:': 'metadata',
            'metadata:': 'metadata',
            'meta:': 'metadata',
            'm:': 'metadata',
            
            // Content
            'content:': 'content',
            'c:': 'content'
        };
    }

    /**
     * 쿼리를 파싱합니다.
     * @param {string} query - 원본 쿼리 문자열
     * @returns {Object} 파싱 결과
     * {
     *   type: 'integrated' | 'scoped',
     *   query: string,              // 원본 쿼리
     *   scopes: [{                  // scoped인 경우
     *     scope: 'file' | 'tag' | 'metadata' | 'content',
     *     term: string,
     *     metaKey: string | null    // metadata인 경우 키
     *   }]
     * }
     */
    parse(query) {
        if (!query || typeof query !== 'string') {
            return {
                type: 'integrated',
                query: '',
                scopes: []
            };
        }

        const trimmedQuery = query.trim();
        
        if (trimmedQuery.length === 0) {
            return {
                type: 'integrated',
                query: '',
                scopes: []
            };
        }

        // 접두사 감지
        const scopes = this.extractScopes(trimmedQuery);

        if (scopes.length === 0) {
            // 접두사가 없으면 통합 검색
            return {
                type: 'integrated',
                query: trimmedQuery,
                scopes: []
            };
        }

        // 접두사가 있으면 범위 지정 검색
        return {
            type: 'scoped',
            query: trimmedQuery,
            scopes: scopes
        };
    }

    /**
     * 정규식 특수 문자를 이스케이프합니다.
     * @param {string} str 
     * @returns {string}
     */
    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * 쿼리에서 모든 scope를 추출합니다.
     * 'prefix:term' 형식을 지원하며, term에는 공백이 포함될 수 있습니다.
     * @param {string} query 
     * @returns {Array} scope 배열
     */
    extractScopes(query) {
        const scopes = [];
        // 모든 별칭을 길이 내림차순으로 정렬 (e.g., 'filename:'이 'file:'보다 먼저 매치되도록)
        const sortedAliases = Object.entries(this.scopeAliases).sort((a, b) => b[0].length - a[0].length);

        // 쿼리에서 모든 접두사의 위치를 찾습니다.
        const foundPrefixes = [];
        for (const [prefix, scopeName] of sortedAliases) {
            const regex = new RegExp(this.escapeRegex(prefix), 'gi');
            let match;
            while ((match = regex.exec(query)) !== null) {
                // 더 긴 접두사가 같은 위치에서 이미 발견된 경우 무시합니다 (e.g., 'file:' vs 'filename:')
                if (!foundPrefixes.some(p => p.index === match.index)) {
                    foundPrefixes.push({
                        prefix: match[0],
                        scopeName,
                        index: match.index
                    });
                }
            }
        }

        // 접두사가 없으면 빈 배열 반환
        if (foundPrefixes.length === 0) {
            return [];
        }

        // 인덱스 순으로 정렬
        foundPrefixes.sort((a, b) => a.index - b.index);

        // 각 접두사 사이의 텍스트를 term으로 추출합니다.
        for (let i = 0; i < foundPrefixes.length; i++) {
            const current = foundPrefixes[i];
            const next = foundPrefixes[i + 1];
            
            const termStart = current.index + current.prefix.length;
            const termEnd = next ? next.index : query.length;
            
            const termPart = query.substring(termStart, termEnd).trim();

            if (termPart.length > 0) {
                if (current.scopeName === 'metadata') {
                    // metadata는 'key:value' 형식을 추가로 파싱
                    scopes.push(this.parseMetadataScope(termPart));
                } else {
                    scopes.push({
                        scope: current.scopeName,
                        term: termPart,
                        metaKey: null
                    });
                }
            }
        }

        return scopes;
    }

    /**
     * metadata scope 파싱 (key:value 또는 value만)
     * @param {string} termPart 
     * @returns {Object}
     */
    parseMetadataScope(termPart) {
        const colonIndex = termPart.indexOf(':');
        
        if (colonIndex > 0) {
            // key:value 형태
            const key = termPart.substring(0, colonIndex).trim();
            const value = termPart.substring(colonIndex + 1).trim();
            
            if (key && value) {
                return {
                    scope: 'metadata',
                    term: value,
                    metaKey: key
                };
            }
        }

        // value만 있는 경우
        return {
            scope: 'metadata',
            term: termPart,
            metaKey: null
        };
    }

    /**
     * 단일 scope 쿼리인지 확인
     * @param {Object} parsedQuery 
     * @returns {boolean}
     */
    isSingleScope(parsedQuery) {
        return parsedQuery.type === 'scoped' && parsedQuery.scopes.length === 1;
    }

    /**
     * 복합 scope 쿼리인지 확인
     * @param {Object} parsedQuery 
     * @returns {boolean}
     */
    isMultipleScopes(parsedQuery) {
        return parsedQuery.type === 'scoped' && parsedQuery.scopes.length > 1;
    }
}

// ES6 모듈 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SearchQueryParser };
}
