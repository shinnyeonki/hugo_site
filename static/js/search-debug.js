/**
 * 검색 인덱스 디버깅 유틸리티
 * 브라우저 콘솔에서 사용할 수 있는 헬퍼 함수들
 */

// 전역 객체에 디버그 함수 추가
window.searchDebug = {
    /**
     * SearchSystem 인스턴스 가져오기
     */
    async _getSystem() {
        if (typeof getSearchSystem === 'undefined') {
            throw new Error('SearchSystem not available');
        }
        return await getSearchSystem();
    },

    /**
     * 캐시 정보 출력
     */
    async info() {
        const system = await this._getSystem();
        const indexManager = system.getComponent('indexManager');
        const info = indexManager.getCacheInfo();
        console.log('=== Search Index Cache Info ===');
        console.log('Version:', info.version);
        console.log('Has Cache:', info.hasCache);
        console.log('Is Ready:', info.isReady);
        console.log('Index Size:', info.indexSize, 'files');
        console.log('==============================');
        return info;
    },

    /**
     * 캐시 클리어
     */
    async clear() {
        const system = await this._getSystem();
        const indexManager = system.getComponent('indexManager');
        indexManager.clearCache();
        console.log('Search index cache cleared. Reload the page to fetch a new index.');
    },

    /**
     * 강제 리로드
     */
    async reload() {
        console.log('Reloading search index...');
        const system = await this._getSystem();
        const indexManager = system.getComponent('indexManager');
        indexManager.clearCache();
        try {
            await indexManager.initialize();
            console.log('Search index reloaded successfully.');
            await this.info();
        } catch (error) {
            console.error('Failed to reload search index:', error);
        }
    },

    /**
     * 검색 테스트
     */
    async test(query) {
        const system = await this._getSystem();
        const searchEngine = system.getComponent('searchEngine');
        const indexManager = system.getComponent('indexManager');
        
        if (!indexManager.ready()) {
            console.warn('Search index not ready yet.');
            return [];
        }
        
        const results = searchEngine.search(query);
        console.log(`Found ${results.length} results for "${query}":`);
        results.slice(0, 10).forEach((result, index) => {
            console.log(`${index + 1}. ${result.fileName} (score: ${result.score})`);
        });
        return results;
    },

    /**
     * 전체 인덱스 조회
     */
    async getIndex() {
        const system = await this._getSystem();
        const indexManager = system.getComponent('indexManager');
        return indexManager.getIndex();
    },

    /**
     * 버전 정보만 조회
     */
    async checkVersion() {
        try {
            const system = await this._getSystem();
            const indexManager = system.getComponent('indexManager');
            const version = await indexManager.fetchVersion();
            console.log('Server version:', version);
            console.log('Cached version:', localStorage.getItem(window.SearchConfig?.CACHE?.VERSION_KEY || 'search_index_version'));
            return version;
        } catch (error) {
            console.error('Failed to check version:', error);
        }
    },

    /**
     * 시스템 상태 확인
     */
    async status() {
        const system = await this._getSystem();
        const components = system.getAllComponents();
        console.log('=== Search System Status ===');
        console.log('Initialized:', system.ready());
        console.log('Components:', Object.keys(components));
        console.log('===========================');
        return system;
    },

    /**
     * 도움말 출력
     */
    help() {
        console.log('=== Search Debug Commands ===');
        console.log('await searchDebug.info()           - Show cache information');
        console.log('await searchDebug.clear()          - Clear cache');
        console.log('await searchDebug.reload()         - Reload search index');
        console.log('await searchDebug.test(query)      - Test search with query');
        console.log('await searchDebug.getIndex()       - Get full search index');
        console.log('await searchDebug.checkVersion()   - Check version information');
        console.log('await searchDebug.status()         - Show system status');
        console.log('searchDebug.help()                 - Show this help');
        console.log('=============================');
    }
};

// 페이지 로드 시 간단한 안내 메시지
console.log('Search Debug Tools available. Type searchDebug.help() for commands.');

