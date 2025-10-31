    /**
     * 검색 인덱스 캐시 관리 모듈
 * version.json을 체크하여 search_index.json의 캐시를 관리합니다.
 */

class SearchIndexManager {
    constructor() {
        // 상대 경로 사용 (CORS 문제 방지)
        // Hugo가 현재 origin에서 제공하므로 절대 경로만 사용
        this.versionUrl = '/indexing/version.json';
        this.indexUrl = '/indexing/search_index.json';
        
        // SearchConfig 사용 (있으면 사용, 없으면 기본값)
        const config = window.SearchConfig?.CACHE || {};
        this.cacheKey = config.INDEX_KEY || 'search_index_cache';
        this.versionKey = config.VERSION_KEY || 'search_index_version';
        
        this.searchIndex = null;
        this.isReady = false;
        this.readyCallbacks = [];
    }    /**
     * 검색 인덱스를 초기화합니다.
     * version을 체크하고 필요시 새로운 인덱스를 로드합니다.
     * @returns {Promise<void>}
     */
    async initialize() {
        try {
            // 1. 서버의 최신 버전 확인 (캐시 없이)
            const serverVersion = await this.fetchVersion();
            
            // 2. 로컬 스토리지의 캐시된 버전 확인
            const cachedVersion = localStorage.getItem(this.versionKey);
            
            // 3. 버전 비교
            if (cachedVersion && cachedVersion === serverVersion) {
                // 캐시가 유효한 경우 - 로컬 스토리지에서 로드
                console.log('Using cached search index (version:', serverVersion + ')');
                this.loadFromCache();
            } else {
                // 캐시가 없거나 버전이 다른 경우 - 서버에서 새로 로드
                console.log('Fetching new search index (version:', serverVersion + ')');
                await this.fetchAndCacheIndex(serverVersion);
            }
            
            this.isReady = true;
            this.triggerReadyCallbacks();
            
        } catch (error) {
            console.error('Failed to initialize search index:', error);
            throw error;
        }
    }

    /**
     * 서버에서 최신 버전 정보를 가져옵니다.
     * 캐시를 방지하기 위해 timestamp를 쿼리 파라미터로 추가합니다.
     * @returns {Promise<string>}
     */
    async fetchVersion() {
        const timestamp = new Date().getTime();
        const response = await fetch(`${this.versionUrl}?t=${timestamp}`, {
            cache: 'no-store',  // 캐시 사용 안 함
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch version: ${response.status}`);
        }
        
        const data = await response.json();
        return data.version;
    }

    /**
     * 서버에서 검색 인덱스를 가져와 캐시에 저장합니다.
     * @param {string} version - 저장할 버전
     * @returns {Promise<void>}
     */
    async fetchAndCacheIndex(version) {
        const response = await fetch(this.indexUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch search index: ${response.status}`);
        }
        
        const indexData = await response.json();
        
        // 로컬 스토리지에 저장
        try {
            localStorage.setItem(this.cacheKey, JSON.stringify(indexData));
            localStorage.setItem(this.versionKey, version);
            this.searchIndex = indexData;
        } catch (e) {
            // 로컬 스토리지가 가득 찬 경우 등
            console.warn('Failed to cache search index:', e);
            // 캐시 실패해도 메모리에는 보관
            this.searchIndex = indexData;
        }
    }

    /**
     * 로컬 스토리지에서 캐시된 인덱스를 로드합니다.
     */
    loadFromCache() {
        const cached = localStorage.getItem(this.cacheKey);
        if (cached) {
            try {
                this.searchIndex = JSON.parse(cached);
            } catch (e) {
                console.error('Failed to parse cached index:', e);
                // 파싱 실패시 캐시 제거
                localStorage.removeItem(this.cacheKey);
                localStorage.removeItem(this.versionKey);
                throw e;
            }
        } else {
            throw new Error('No cached index found');
        }
    }

    /**
     * 캐시를 강제로 지웁니다.
     */
    clearCache() {
        localStorage.removeItem(this.cacheKey);
        localStorage.removeItem(this.versionKey);
        this.searchIndex = null;
        this.isReady = false;
    }

    /**
     * 검색 인덱스를 반환합니다.
     * @returns {Object|null}
     */
    getIndex() {
        return this.searchIndex;
    }

    /**
     * 검색 인덱스가 준비되었는지 확인합니다.
     * @returns {boolean}
     */
    ready() {
        return this.isReady;
    }

    /**
     * 검색 인덱스가 준비되면 콜백을 실행합니다.
     * @param {Function} callback
     */
    onReady(callback) {
        if (this.isReady) {
            callback(this.searchIndex);
        } else {
            this.readyCallbacks.push(callback);
        }
    }

    /**
     * 준비 완료 시 등록된 모든 콜백을 실행합니다.
     */
    triggerReadyCallbacks() {
        this.readyCallbacks.forEach(callback => {
            try {
                callback(this.searchIndex);
            } catch (e) {
                console.error('Error in ready callback:', e);
            }
        });
        this.readyCallbacks = [];
    }

    /**
     * 캐시 정보를 반환합니다 (디버깅용)
     * @returns {Object}
     */
    getCacheInfo() {
        return {
            version: localStorage.getItem(this.versionKey),
            hasCache: !!localStorage.getItem(this.cacheKey),
            isReady: this.isReady,
            indexSize: this.searchIndex ? Object.keys(this.searchIndex.files || {}).length : 0
        };
    }
}

// ES6 모듈로 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SearchIndexManager };
}
