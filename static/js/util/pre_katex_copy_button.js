// 페이지가 로드되면 문서 전체에서 하이라이트 블록을 향상시킵니다.
// When the page is loaded, enhance highlight blocks across the document.
document.addEventListener('DOMContentLoaded', () => {
    enhanceHighlightBlocks(document.body);
});

/**
 * code 엘리먼트에서 언어 정보 추출
 * Hugo는 code 태그에 language-{lang} 또는 data-lang 속성을 추가
 */
/**
 * 코드 요소에서 언어 정보를 추출합니다.
 * 우선 data-lang 속성을 확인하고, 없으면 class에서 language- 접두사를 찾습니다.
 * Extract language information from a <code> element: prefer data-lang, then class names.
 */
function getCodeLanguage(codeElement) {
    const dataLang = codeElement.getAttribute('data-lang');
    if (dataLang) return dataLang;

    const languageClass = [...(codeElement.classList || [])].find(cls => cls.startsWith('language-'));
    return languageClass ? languageClass.replace('language-', '') : null;
}

/**
 * Copy 버튼 클릭 핸들러
 */
/**
 * 복사 버튼에 클릭 핸들러를 등록합니다.
 * Registers a click handler on the copy button that copies the code text to clipboard.
 */
function registerCopyClickHandler(copyButton, codeElement) {
    copyButton.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(codeElement.textContent);
            copyButton.textContent = 'Copied!';
            copyButton.classList.add('bg-primary-blue-light', 'hover:bg-primary-blue');
            copyButton.classList.remove('bg-slate-600', 'hover:bg-slate-500');
            setTimeout(() => {
                copyButton.textContent = 'Copy';
                copyButton.classList.remove('bg-primary-blue-light', 'hover:bg-primary-blue');
                copyButton.classList.add('bg-slate-600', 'hover:bg-slate-500');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
            copyButton.textContent = 'Error';
        }
    });
}

/**
 * 단일 pre 블록에 언어 태그와 복사 버튼 추가
 */
/**
 * 단일 하이라이트(pre/code) 블록에 언어 라벨과 복사 버튼을 추가합니다.
 * Enhance a single highlight block by adding a language label and a copy button.
 */
function enhanceHighlightBlock(pre) {
    // 이미 처리된 블록은 건너뛰기
    if (pre.classList.contains('code-block-enhanced')) return;

    const codeElement = pre.querySelector('code');
    if (!codeElement) return;

    // pre 태그에 스타일 클래스 추가
    pre.classList.add('code-block-enhanced', 'relative', 'group');
    const language = getCodeLanguage(codeElement);

    // 컨트롤 래퍼 생성 (언어 표시 + 복사 버튼)
    const controlsWrapper = document.createElement('div');
    controlsWrapper.className = 'absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-x-2';

    // 언어 표시
    if (language) {
        const languageSpan = document.createElement('span');
        languageSpan.className = 'text-slate-400 text-xs font-mono select-none';
        languageSpan.textContent = language;
        controlsWrapper.appendChild(languageSpan);
    }

    // 복사 버튼 생성
    const copyButton = document.createElement('button');
    copyButton.className = 'bg-slate-600 hover:bg-slate-500 text-white text-xs px-2.5 py-1 rounded-md transition-colors';
    copyButton.textContent = 'Copy';
    copyButton.type = 'button';
    controlsWrapper.appendChild(copyButton);

    pre.appendChild(controlsWrapper);

    // 클릭 이벤트 핸들러 등록 (클립보드 복사 기능)
    registerCopyClickHandler(copyButton, codeElement);
}


/**
 * 컨테이너 내의 모든 highlight 블록 향상
 */
/**
 * 주어진 컨테이너 내의 모든 하이라이트 블록을 찾아 향상시킵니다.
 * Enhance all highlight blocks inside a container (expects elements with class "highlight").
 */
function enhanceHighlightBlocks(container) {
    if (!container) return;
    const highlightElements = container.querySelectorAll('.highlight');
    highlightElements.forEach(enhanceHighlightBlock);
}
