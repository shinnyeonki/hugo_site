/**
 * Search System Factory
 * 검색 시스템의 모든 컴포넌트를 생성하고 의존성을 주입합니다.
 * 전역 변수 의존성을 제거하고 중앙에서 관리합니다.
 */

class SearchSystem {
    constructor() {
        this.components = null;
        this.isInitialized = false;
    }

    /**
     * 검색 시스템을 초기화합니다.
     * 모든 컴포넌트를 생성하고 의존성을 주입합니다.
     * @returns {Promise<Object>} 초기화된 컴포넌트들
     */
    async initialize() {
        if (this.isInitialized) {
            console.warn('SearchSystem already initialized');
            return this.components;
        }

        try {
            // 1. 의존성이 없는 컴포넌트부터 생성
            const indexManager = new SearchIndexManager();
            const queryParser = new SearchQueryParser();
            const textHighlighter = new TextHighlighter();

            // 2. 인덱스 초기화 (비동기)
            await indexManager.initialize();

            // 3. 1차 의존성 주입
            const urlBuilder = new URLBuilder(indexManager);
            const searchEngine = new SearchEngine(indexManager, queryParser);

            // 4. 2차 의존성 주입
            const resultRenderer = new SearchResultRenderer(textHighlighter, urlBuilder);

            // 5. 최종 UI 컴포넌트 생성 (indexManager도 주입)
            const searchUI = new SearchUI(searchEngine, resultRenderer, indexManager);

            // 6. 컴포넌트 저장
            this.components = {
                indexManager,
                queryParser,
                textHighlighter,
                urlBuilder,
                searchEngine,
                resultRenderer,
                searchUI
            };

            this.isInitialized = true;

            // console.log('✅ SearchSystem initialized successfully');
            return this.components;

        } catch (error) {
            console.error('❌ Failed to initialize SearchSystem:', error);
            throw error;
        }
    }

    /**
     * 특정 컴포넌트를 가져옵니다.
     * @param {string} componentName - 컴포넌트 이름
     * @returns {Object|null}
     */
    getComponent(componentName) {
        if (!this.isInitialized) {
            console.warn('SearchSystem not initialized yet');
            return null;
        }
        return this.components[componentName] || null;
    }

    /**
     * 모든 컴포넌트를 가져옵니다.
     * @returns {Object|null}
     */
    getAllComponents() {
        return this.components;
    }

    /**
     * 초기화 상태를 확인합니다.
     * @returns {boolean}
     */
    ready() {
        return this.isInitialized;
    }

    /**
     * 검색 시스템을 재초기화합니다.
     * (캐시 무효화 등이 필요한 경우)
     */
    async reinitialize() {
        // console.log('Reinitializing SearchSystem...');
        
        if (this.components && this.components.indexManager) {
            this.components.indexManager.clearCache();
        }

        this.isInitialized = false;
        this.components = null;

        return await this.initialize();
    }

    /**
     * 정적 팩토리 메서드
     * SearchSystem 인스턴스를 생성하고 초기화합니다.
     * @returns {Promise<SearchSystem>}
     */
    static async create() {
        const system = new SearchSystem();
        await system.initialize();
        return system;
    }
}

// 전역 SearchSystem 인스턴스
let globalSearchSystem = null;

/**
 * 전역 SearchSystem 인스턴스를 가져옵니다.
 * 아직 생성되지 않았다면 생성합니다.
 * @returns {Promise<SearchSystem>}
 */
async function getSearchSystem() {
    if (!globalSearchSystem) {
        globalSearchSystem = await SearchSystem.create();
    }
    return globalSearchSystem;
}

// DOM 로드 완료 시 자동 초기화
if (typeof document !== 'undefined') {
    const initSearchSystem = async () => {
        try {
            await getSearchSystem();
        } catch (error) {
            console.error('Failed to auto-initialize SearchSystem:', error);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearchSystem);
    } else {
        // 이미 로드된 경우 즉시 초기화
        initSearchSystem();
    }
}

// 전역 객체로 노출 (디버깅 및 호환성)
if (typeof window !== 'undefined') {
    window.SearchSystem = SearchSystem;
    window.getSearchSystem = getSearchSystem;
}

// ES6 모듈 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SearchSystem, getSearchSystem };
}
