/**
 * Text Highlighter
 * 텍스트 하이라이팅 로직을 담당합니다.
 */

class TextHighlighter {
    constructor() {
        this.highlightClass = 'bg-yellow-200 dark:bg-yellow-600';
    }

    /**
     * 파일명 하이라이팅
     * @param {string} fileName 
     * @param {Array} matches 
     * @returns {string} HTML 문자열
     */
    highlightFileName(fileName, matches) {
        const fileMatches = matches.filter(m => m.scope === 'file');
        
        if (fileMatches.length === 0) {
            return this.escapeHtml(fileName);
        }

        let result = fileName;
        // 가장 긴 term부터 하이라이트 (중복 방지)
        const sortedMatches = fileMatches.sort((a, b) => b.term.length - a.term.length);
        
        for (const match of sortedMatches) {
            const regex = new RegExp(`(${this.escapeRegex(match.term)})`, 'gi');
            result = result.replace(regex, `<mark class="${this.highlightClass}">$1</mark>`);
        }
        
        return result;
    }

    /**
     * 일반 텍스트 하이라이팅
     * @param {string} text 
     * @param {string} term 
     * @returns {string} HTML 문자열
     */
    highlightText(text, term) {
        if (!text || !term) return this.escapeHtml(text);
        
        const regex = new RegExp(`(${this.escapeRegex(term)})`, 'gi');
        return this.escapeHtml(text).replace(regex, `<mark class="${this.highlightClass}">$1</mark>`);
    }

    /**
     * HTML 이스케이프
     * @param {string} text 
     * @returns {string}
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 정규식 이스케이프
     * @param {string} str 
     * @returns {string}
     */
    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TextHighlighter };
}
