/**
 * URL Builder
 * URL 생성 및 Text Fragment 처리를 담당합니다.
 */

class URLBuilder {
    constructor(indexManager) {
        this.indexManager = indexManager;
    }

    /**
     * 검색 결과용 URL 생성 (Text Fragment 포함)
     * @param {string} fileName 
     * @param {Array} matches 
     * @returns {string}
     */
    buildURL(fileName, matches) {
        const baseUrl = this.getFileUrl(fileName);
        
        if (!baseUrl) {
            return '#';
        }
        
        const textFragment = this.createTextFragment(matches);
        
        if (textFragment) {
            return `${baseUrl}#:~:text=${textFragment}`;
        }
        
        return baseUrl;
    }

    /**
     * Text Fragment 생성
     * https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment/Text_fragments
     * @param {Array} matches 
     * @returns {string|null}
     */
    createTextFragment(matches) {
        // file 매치 우선, 없으면 content 매치 사용
        const fileMatch = matches.find(m => m.scope === 'file');
        const contentMatch = matches.find(m => m.scope === 'content');
        
        // file 매치가 있으면 우선 사용
        if (fileMatch && fileMatch.term) {
            return encodeURIComponent(fileMatch.term);
        }
        
        // content 매치 사용
        if (contentMatch && contentMatch.term) {
            return encodeURIComponent(contentMatch.term);
        }
        
        return null;
    }

    /**
     * 파일명을 URL로 변환 (인덱스에서 path 가져오기)
     * @param {string} fileName 
     * @returns {string|null}
     */
    getFileUrl(fileName) {
        const index = this.indexManager.getIndex();
        
        if (index && index.files && index.files[fileName]) {
            const path = index.files[fileName].path;
            if (path) {
                // 상대 경로 사용 (path는 이미 /로 시작)
                return path;
            }
        }
        
        console.warn(`Path not found for file: ${fileName}`);
        return null;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { URLBuilder };
}
