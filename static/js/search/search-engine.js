/**
 * Search Engine
 * 핵심 검색 로직을 담당합니다.
 * - 통합 검색 (Integrated Search): 8단계 우선순위
 * - 범위 지정 검색 (Scoped Search): 단일/복합 조건
 */

class SearchEngine {
    constructor(indexManager, queryParser) {
        this.indexManager = indexManager;
        this.queryParser = queryParser;
        
        // 우선순위 점수 (높을수록 우선)
        this.PRIORITY_SCORES = {
            // 정확한 일치 (Exact Match)
            EXACT_FILE: 400,
            EXACT_TAG: 300,
            EXACT_METADATA: 200,
            EXACT_CONTENT: 100,
            
            // 부분 일치 (Substring Match)
            PARTIAL_FILE: 40,
            PARTIAL_TAG: 30,
            PARTIAL_METADATA: 20,
            PARTIAL_CONTENT: 10
        };
    }

    /**
     * 메인 검색 함수
     * @param {string} query 
     * @returns {Array} 검색 결과 배열
     */
    search(query) {
        if (!this.indexManager.ready()) {
            return [];
        }

        const parsedQuery = this.queryParser.parse(query);

        if (parsedQuery.type === 'integrated') {
            return this.performIntegratedSearch(parsedQuery);
        } else {
            return this.performScopedSearch(parsedQuery);
        }
    }

    /**
     * 통합 검색: 8단계 우선순위 적용
     * @param {Object} parsedQuery 
     * @returns {Array}
     */
    performIntegratedSearch(parsedQuery) {
        const { query } = parsedQuery;
        const lowerQuery = query.toLowerCase();
        const results = [];
        const index = this.indexManager.getIndex();
        
        if (!index || !index.files) {
            return [];
        }

        // 모든 파일 순회
        for (const [fileName, fileData] of Object.entries(index.files)) {
            const matches = [];
            let totalScore = 0;

            // 1. 파일명 검색
            const fileScore = this.searchInFile(fileName, lowerQuery, matches);
            totalScore += fileScore;

            // 2. 태그 검색
            const tagScore = this.searchInTags(fileData.frontmatter?.tags, lowerQuery, matches);
            totalScore += tagScore;

            // 3. 메타데이터 검색
            const metaScore = this.searchInMetadata(fileData.frontmatter, lowerQuery, matches);
            totalScore += metaScore;

            // 4. 본문 검색
            const contentScore = this.searchInContent(fileData.content, lowerQuery, matches);
            totalScore += contentScore;

            // 점수가 있으면 결과에 추가
            if (totalScore > 0) {
                results.push({
                    fileName,
                    fileData,
                    score: totalScore,
                    matches,
                    searchType: 'integrated',
                    matchedTerm: query
                });
            }
        }

        // 점수순 정렬
        return results.sort((a, b) => b.score - a.score);
    }

    /**
     * 범위 지정 검색
     * @param {Object} parsedQuery 
     * @returns {Array}
     */
    performScopedSearch(parsedQuery) {
        const { scopes } = parsedQuery;
        
        if (scopes.length === 1) {
            // 단일 scope: 정확한 일치 > 부분 일치
            return this.performSingleScopedSearch(scopes[0]);
        } else {
            // 복합 scope: AND 조합, 모두 부분 일치
            return this.performMultipleScopedSearch(scopes);
        }
    }

    /**
     * 단일 범위 검색
     * @param {Object} scopeObj 
     * @returns {Array}
     */
    performSingleScopedSearch(scopeObj) {
        const { scope, term, metaKey } = scopeObj;
        const lowerTerm = term.toLowerCase();
        const results = [];
        const index = this.indexManager.getIndex();

        if (!index || !index.files) {
            return [];
        }

        for (const [fileName, fileData] of Object.entries(index.files)) {
            const matches = [];
            let score = 0;

            switch (scope) {
                case 'file':
                    score = this.searchInFile(fileName, lowerTerm, matches);
                    break;
                case 'tag':
                    score = this.searchInTags(fileData.frontmatter?.tags, lowerTerm, matches);
                    break;
                case 'metadata':
                    score = this.searchInMetadata(fileData.frontmatter, lowerTerm, matches, metaKey);
                    break;
                case 'content':
                    score = this.searchInContent(fileData.content, lowerTerm, matches);
                    break;
            }

            if (score > 0) {
                results.push({
                    fileName,
                    fileData,
                    score,
                    matches,
                    searchType: 'scoped',
                    scopeType: 'single'
                });
            }
        }

        return results.sort((a, b) => b.score - a.score);
    }

    /**
     * 복합 범위 검색 (AND 조합)
     * @param {Array} scopes 
     * @returns {Array}
     */
    performMultipleScopedSearch(scopes) {
        const results = [];
        const index = this.indexManager.getIndex();

        if (!index || !index.files) {
            return [];
        }

        for (const [fileName, fileData] of Object.entries(index.files)) {
            const allMatches = [];
            let matchedAll = true;

            // 모든 scope 조건을 만족하는지 확인
            for (const scopeObj of scopes) {
                const { scope, term, metaKey } = scopeObj;
                const lowerTerm = term.toLowerCase();
                const matches = [];
                let score = 0;

                switch (scope) {
                    case 'file':
                        score = this.searchInFile(fileName, lowerTerm, matches); // 정확한 일치도 확인
                        break;
                    case 'tag':
                        score = this.searchInTags(fileData.frontmatter?.tags, lowerTerm, matches);
                        break;
                    case 'metadata':
                        score = this.searchInMetadata(fileData.frontmatter, lowerTerm, matches, metaKey);
                        break;
                    case 'content':
                        score = this.searchInContent(fileData.content, lowerTerm, matches);
                        break;
                }

                if (score === 0) {
                    matchedAll = false;
                    break;
                }

                allMatches.push(...matches);
            }

            // 모든 조건 만족시 결과에 추가
            if (matchedAll) {
                results.push({
                    fileName,
                    fileData,
                    score: allMatches.length * 100, // 간단한 점수
                    matches: allMatches,
                    searchType: 'scoped',
                    scopeType: 'multiple'
                });
            }
        }

        return results.sort((a, b) => b.score - a.score);
    }

    /**
     * 파일명 검색
     * @param {string} fileName 
     * @param {string} query 
     * @param {Array} matches 
     * @param {boolean} partialOnly 
     * @returns {number} 점수
     */
    searchInFile(fileName, query, matches, partialOnly = false) {
        const lowerFileName = fileName.toLowerCase();
        
        // .md 확장자 제거한 파일명
        const fileNameWithoutExt = lowerFileName.replace(/\.md$/, '');
        
        if (!partialOnly) {
            // 정확한 일치 (확장자 제외한 파일명과 비교)
            if (fileNameWithoutExt === query || lowerFileName === query) {
                matches.push({ scope: 'file', term: query, matchType: 'exact' });
                return this.PRIORITY_SCORES.EXACT_FILE;
            }
            
            // 공백이나 특수문자로 구분된 정확한 단어 일치
            // 한글, 영문 모두 지원하도록 개선
            if (this.isExactWordMatch(lowerFileName, query)) {
                matches.push({ scope: 'file', term: query, matchType: 'exact' });
                return this.PRIORITY_SCORES.EXACT_FILE;
            }
        }

        // 부분 일치
        if (lowerFileName.includes(query)) {
            matches.push({ scope: 'file', term: query, matchType: 'partial' });
            return this.PRIORITY_SCORES.PARTIAL_FILE;
        }

        return 0;
    }

    /**
     * 태그 검색
     */
    searchInTags(tags, query, matches, partialOnly = false) {
        if (!tags || !Array.isArray(tags)) {
            return 0;
        }

        let maxScore = 0;

        for (const tag of tags) {
            const lowerTag = String(tag).toLowerCase();

            if (!partialOnly) {
                // 정확한 일치
                if (lowerTag === query) {
                    matches.push({ scope: 'tag', term: query, matchType: 'exact', value: tag });
                    maxScore = Math.max(maxScore, this.PRIORITY_SCORES.EXACT_TAG);
                    continue;
                }
            }
            
            // 부분 일치
            if (lowerTag.includes(query)) {
                matches.push({ scope: 'tag', term: query, matchType: 'partial', value: tag });
                maxScore = Math.max(maxScore, this.PRIORITY_SCORES.PARTIAL_TAG);
            }
        }

        return maxScore;
    }

    /**
     * 메타데이터 검색
     */
    searchInMetadata(frontmatter, query, matches, targetKey = null, partialOnly = false) {
        if (!frontmatter || typeof frontmatter !== 'object') {
            return 0;
        }

        let maxScore = 0;

        for (const [key, value] of Object.entries(frontmatter)) {
            // tags는 별도로 처리하므로 제외
            if (key.toLowerCase() === 'tags') {
                continue;
            }

            const lowerKey = key.toLowerCase();
            const lowerValue = String(value).toLowerCase();

            // targetKey가 지정된 경우
            if (targetKey) {
                const lowerTargetKey = targetKey.toLowerCase();
                
                // 키가 일치하는 경우에만 값 검색
                if (lowerKey === lowerTargetKey || lowerKey.includes(lowerTargetKey)) {
                    if (!partialOnly && lowerValue === query) {
                        // 정확한 값 일치
                        matches.push({ scope: 'metadata', term: query, matchType: 'exact', key, value });
                        maxScore = Math.max(maxScore, this.PRIORITY_SCORES.EXACT_METADATA);
                    } else if (lowerValue.includes(query)) {
                        // 부분 값 일치
                        matches.push({ scope: 'metadata', term: query, matchType: 'partial', key, value });
                        maxScore = Math.max(maxScore, this.PRIORITY_SCORES.PARTIAL_METADATA);
                    }
                }
            } else {
                // targetKey가 없는 경우: 키 또는 값 검색
                
                if (!partialOnly) {
                    // 정확한 일치 (키 또는 값)
                    if (lowerKey === query) {
                        matches.push({ scope: 'metadata', term: query, matchType: 'exact', key, value });
                        maxScore = Math.max(maxScore, this.PRIORITY_SCORES.EXACT_METADATA);
                        continue;
                    }
                    if (lowerValue === query) {
                        matches.push({ scope: 'metadata', term: query, matchType: 'exact', key, value });
                        maxScore = Math.max(maxScore, this.PRIORITY_SCORES.EXACT_METADATA);
                        continue;
                    }
                }

                // 부분 일치 (키 또는 값)
                const keyMatch = lowerKey.includes(query);
                const valueMatch = lowerValue.includes(query);
                
                if (keyMatch || valueMatch) {
                    matches.push({ scope: 'metadata', term: query, matchType: 'partial', key, value });
                    maxScore = Math.max(maxScore, this.PRIORITY_SCORES.PARTIAL_METADATA);
                }
            }
        }

        return maxScore;
    }

    /**
     * 본문 검색
     */
    searchInContent(content, query, matches, partialOnly = false) {
        if (!content || typeof content !== 'string') {
            return 0;
        }

        const lowerContent = content.toLowerCase();

        // 정확한 단어 일치 (공백/특수문자로 구분된 단어)
        if (!partialOnly) {
            if (this.isExactWordMatch(lowerContent, query)) {
                matches.push({ scope: 'content', term: query, matchType: 'exact' });
                return this.PRIORITY_SCORES.EXACT_CONTENT;
            }
        }

        // 부분 일치
        if (lowerContent.includes(query)) {
            matches.push({ scope: 'content', term: query, matchType: 'partial' });
            return this.PRIORITY_SCORES.PARTIAL_CONTENT;
        }

        return 0;
    }

    /**
     * 정규식 이스케이프
     */
    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * 공백이나 특수문자로 구분된 정확한 단어 일치 확인
     * 한글, 영문 모두 지원
     * @param {string} text - 검색 대상 텍스트
     * @param {string} query - 검색어
     * @returns {boolean}
     */
    isExactWordMatch(text, query) {
        // 파일명을 공백과 특수문자로 분리
        const words = text.split(/[\s\-_.,;:!?@#$%^&*()[\]{}<>/"'`~+=|\\]+/);
        
        // 분리된 단어 중 정확히 일치하는 것이 있는지 확인
        return words.some(word => word === query);
    }
}

// 전역 인스턴스는 UI에서 생성
// (indexManager, queryParser 의존성 필요)

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SearchEngine };
}
