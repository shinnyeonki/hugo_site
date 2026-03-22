/**
 * Search System Configuration
 * 검색 시스템의 모든 설정값을 중앙에서 관리합니다.
 */

const SearchConfig = {
    /**
     * 검색 우선순위 점수
     * 높을수록 우선순위가 높음
     */
    PRIORITY_SCORES: {
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
    },

    /**
     * UI 관련 설정
     */
    UI: {
        // 검색 입력 디바운스 지연 시간 (ms)
        DEBOUNCE_DELAY: 300,
        
        // 스니펫 최대 길이
        SNIPPET_LENGTH: 80,
        
        // 표시할 최대 태그 개수
        MAX_TAGS_DISPLAY: 10,
        
        // 하이라이트 CSS 클래스
        HIGHLIGHT_CLASS: 'bg-yellow-200 dark:bg-yellow-600'
    },

    /**
     * 캐시 관련 설정
     */
    CACHE: {
        // 로컬 스토리지 키
        INDEX_KEY: 'search_index_cache',
        VERSION_KEY: 'search_index_version'
    },

    /**
     * 검색 범위 별칭 매핑
     */
    SCOPE_ALIASES: {
        // Filename
        'filename:': 'file',
        'file:': 'file',
        'f:': 'file',
        
        // Tag
        'tag:': 'tag',
        't:': 'tag',
        
        // Metadata/Frontmatter
        'metadata:': 'metadata',
        'meta:': 'metadata',
        'm:': 'metadata',
        
        // Content
        'content:': 'content',
        'c:': 'content'
    },

    /**
     * 아이콘 및 텍스트 설정
     */
    MATCH_TYPE_DISPLAYS: {
        EXACT_MATCH: '정확 매치',
        PARTIAL_MATCH: '부분 매치',
        INTEGRATED_SEARCH: '🔍',
        SCOPED_SEARCH: '🔭'
    },

    /**
     * 배너 스타일 설정
     */
    BANNER_STYLES: {
        integrated: {
            text: '🔍 통합 검색 결과',
            className: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
        },
        scoped: {
            text: '🔭 범위 지정 검색 결과',
            className: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
        }
    }
};

// 설정 동결 (읽기 전용)
Object.freeze(SearchConfig);
Object.freeze(SearchConfig.PRIORITY_SCORES);
Object.freeze(SearchConfig.UI);
Object.freeze(SearchConfig.CACHE);
Object.freeze(SearchConfig.SCOPE_ALIASES);
Object.freeze(SearchConfig.MATCH_TYPE_DISPLAYS);
Object.freeze(SearchConfig.BANNER_STYLES);

// 전역 객체로 노출
if (typeof window !== 'undefined') {
    window.SearchConfig = SearchConfig;
}

// ES6 모듈 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SearchConfig };
}
