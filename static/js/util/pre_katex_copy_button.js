document.addEventListener('DOMContentLoaded', () => {
    enhanceCodeBlocks(document.body);
});

/**
 * code 엘리먼트에서 언어 정보 추출
 * Hugo는 code 태그에 language-{lang} 또는 data-lang 속성을 추가
 */
function getLanguage(codeElement) {
    // data-lang 속성 먼저 확인 (Hugo 기본 방식)
    const dataLang = codeElement.getAttribute('data-lang');
    if (dataLang) return dataLang;
    
    // class에서 language- 찾기
    const languageClass = [...(codeElement.classList || [])].find(cls => cls.startsWith('language-'));
    return languageClass ? languageClass.replace('language-', '') : null;
}

/**
 * Copy 버튼 클릭 핸들러
 */
function handleCopyClick(copyButton, codeElement) {
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
function enhanceSingleBlock(pre) {
    // 이미 처리된 블록은 건너뛰기
    if (pre.classList.contains('code-block-enhanced')) return;

    const codeElement = pre.querySelector('code');
    if (!codeElement) return;

    // pre 태그에 스타일 클래스 추가
    pre.classList.add('code-block-enhanced', 'relative', 'group');
    const language = getLanguage(codeElement);

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

    // 클릭 이벤트 핸들러 등록
    handleCopyClick(copyButton, codeElement);
}

/**
 * 컨테이너 내의 모든 pre 블록 향상
 */
function enhanceCodeBlocks(container) {
    if (!container) return;
    const preElements = container.querySelectorAll('pre');
    preElements.forEach(enhanceSingleBlock);
}
