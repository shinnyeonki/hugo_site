/**
 * 검색 인덱스 디버깅 유틸리티
 * 브라우저 콘솔에서 사용할 수 있는 헬퍼 함수들
 */

// 전역 객체에 디버그 함수 추가
window.searchDebug = {
    /**
     * 캐시 정보 출력
     */
    info() {
        const info = searchIndexManager.getCacheInfo();
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
    clear() {
        searchIndexManager.clearCache();
        console.log('Search index cache cleared. Reload the page to fetch a new index.');
    },

    /**
     * 강제 리로드
     */
    async reload() {
        console.log('Reloading search index...');
        searchIndexManager.clearCache();
        try {
            await searchIndexManager.initialize();
            console.log('Search index reloaded successfully.');
            this.info();
        } catch (error) {
            console.error('Failed to reload search index:', error);
        }
    },

    /**
     * 검색 테스트
     */
    test(query) {
        if (!searchIndexManager.ready()) {
            console.warn('Search index not ready yet.');
            return [];
        }
        const results = searchIndexManager.search(query);
        console.log(`Found ${results.length} results for "${query}":`);
        results.slice(0, 10).forEach((result, index) => {
            console.log(`${index + 1}. ${result.fileName} (score: ${result.score})`);
        });
        return results;
    },

    /**
     * 전체 인덱스 조회
     */
    getIndex() {
        return searchIndexManager.getIndex();
    },

    /**
     * 버전 정보만 조회
     */
    async checkVersion() {
        try {
            const version = await searchIndexManager.fetchVersion();
            console.log('Server version:', version);
            console.log('Cached version:', localStorage.getItem('search_index_version'));
            return version;
        } catch (error) {
            console.error('Failed to check version:', error);
        }
    },

    /**
     * 도움말 출력
     */
    help() {
        console.log('=== Search Debug Commands ===');
        console.log('searchDebug.info()           - Show cache information');
        console.log('searchDebug.clear()          - Clear cache');
        console.log('searchDebug.reload()         - Reload search index');
        console.log('searchDebug.test(query)      - Test search with query');
        console.log('searchDebug.getIndex()       - Get full search index');
        console.log('searchDebug.checkVersion()   - Check version information');
        console.log('searchDebug.help()           - Show this help');
        console.log('=============================');
    }
};

// 페이지 로드 시 간단한 안내 메시지
console.log('Search Debug Tools available. Type searchDebug.help() for commands.');
