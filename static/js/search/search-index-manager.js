/**
 * 검색 인덱스 캐시 관리 모듈
 * version.json을 체크하여 search_index.json의 캐시를 관리합니다.
 */

class SearchIndexManager {
    constructor() {
        this.versionUrl = '/indexing/version.json';
        this.indexUrl = '/indexing/search_index.json';
        this.cacheKey = 'search_index_cache';
        this.versionKey = 'search_index_version';
        this.searchIndex = null;
        this.isReady = false;
        this.readyCallbacks = [];
    }

    /**
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
     * 파일 검색을 수행합니다.
     * @param {string} query - 검색어
     * @returns {Array} - 검색 결과 배열
     */
    search(query) {
        if (!this.isReady || !this.searchIndex) {
            console.warn('Search index not ready');
            return [];
        }

        if (!query || query.trim().length === 0) {
            return [];
        }

        const lowerQuery = query.toLowerCase().trim();
        const results = [];

        // search_index.json의 files 객체를 순회하며 검색
        const files = this.searchIndex.files || {};
        
        for (const [fileName, fileData] of Object.entries(files)) {
            let score = 0;
            const lowerFileName = fileName.toLowerCase();

            // 1. 파일명 매칭
            if (lowerFileName.includes(lowerQuery)) {
                score += 100;
                if (lowerFileName === lowerQuery) {
                    score += 50; // 정확한 매칭
                }
                if (lowerFileName.startsWith(lowerQuery)) {
                    score += 30; // 시작 부분 매칭
                }
            }

            // 2. 태그 매칭
            if (fileData.frontmatter && fileData.frontmatter.tags) {
                const tags = fileData.frontmatter.tags;
                if (Array.isArray(tags)) {
                    tags.forEach(tag => {
                        if (tag.toLowerCase().includes(lowerQuery)) {
                            score += 50;
                        }
                    });
                }
            }

            // 3. 콘텐츠 매칭 (있는 경우)
            if (fileData.content) {
                const lowerContent = fileData.content.toLowerCase();
                if (lowerContent.includes(lowerQuery)) {
                    score += 10;
                }
            }

            // 점수가 있는 경우 결과에 추가
            if (score > 0) {
                results.push({
                    fileName,
                    fileData,
                    score
                });
            }
        }

        // 점수 순으로 정렬
        results.sort((a, b) => b.score - a.score);

        return results;
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

// 전역 인스턴스 생성 및 자동 초기화
const searchIndexManager = new SearchIndexManager();

// DOM 로드 완료 시 자동으로 초기화
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            searchIndexManager.initialize().catch(console.error);
        });
    } else {
        // 이미 로드된 경우 즉시 초기화
        searchIndexManager.initialize().catch(console.error);
    }
}

// ES6 모듈로 export (필요한 경우)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SearchIndexManager, searchIndexManager };
}
