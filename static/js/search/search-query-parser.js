/**
 * Search Query Parser
 * 검색 쿼리를 파싱하여 통합 검색과 범위 지정 검색을 구분합니다.
 */

class SearchQueryParser {
    constructor() {
        // 지원하는 접두사와 별칭 매핑
        this.scopeAliases = {
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
     * 쿼리에서 모든 scope 추출
     * @param {string} query 
     * @returns {Array} scope 배열
     */
    extractScopes(query) {
        const scopes = [];
        const parts = query.split(/\s+/);
        
        for (const part of parts) {
            const scope = this.parseScope(part);
            if (scope) {
                scopes.push(scope);
            }
        }

        return scopes;
    }

    /**
     * 단일 토큰을 파싱하여 scope 객체 반환
     * @param {string} token 
     * @returns {Object|null}
     */
    parseScope(token) {
        // 접두사 찾기
        for (const [prefix, scopeName] of Object.entries(this.scopeAliases)) {
            if (token.toLowerCase().startsWith(prefix)) {
                const termPart = token.substring(prefix.length).trim();
                
                if (termPart.length === 0) {
                    continue; // 빈 term은 무시
                }

                // metadata의 경우 key:value 형태 지원
                if (scopeName === 'metadata') {
                    return this.parseMetadataScope(termPart);
                }

                return {
                    scope: scopeName,
                    term: termPart,
                    metaKey: null
                };
            }
        }

        return null;
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

// 전역 인스턴스 생성
const searchQueryParser = new SearchQueryParser();

// ES6 모듈 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SearchQueryParser, searchQueryParser };
}
