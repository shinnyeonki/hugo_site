/**
 * 콘텐츠 너비 조절 기능
 * 슬라이더를 사용하여 본문 너비를 동적으로 조절합니다.
 */

document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('contentWidthSlider');
    const content = document.getElementById('content');
    
    if (!slider || !content) {
        return;
    }

    // 저장된 너비 값 불러오기 (로컬 스토리지)
    const savedWidth = localStorage.getItem('contentWidth');
    const defaultWidth = slider.value; // 슬라이더의 기본값 (72)
    
    if (savedWidth) {
        slider.value = savedWidth;
        updateContentWidth(savedWidth);
    } else {
        // 저장된 값이 없으면 기본값으로 초기화
        updateContentWidth(defaultWidth);
    }

    // 슬라이더 값 변경 시 너비 업데이트
    slider.addEventListener('input', function() {
        const width = this.value;
        updateContentWidth(width);
        localStorage.setItem('contentWidth', width);
    });

    /**
     * 콘텐츠 컨테이너의 너비를 업데이트합니다.
     * @param {string|number} width - ch 단위로 적용할 너비 값
     */
    function updateContentWidth(width) {
        // 모든 max-w 관련 클래스 제거 (Tailwind의 임의 값 포함)
        const classes = content.className.split(' ');
        const filteredClasses = classes.filter(cls => {
            // max-w-로 시작하거나 max-w-[로 시작하는 모든 클래스 제거
            return !cls.startsWith('max-w-') && !cls.includes('max-w-[');
        });
        
        // 새로운 클래스 적용 및 인라인 스타일로 너비 설정
        content.className = filteredClasses.join(' ');
        content.style.maxWidth = `${width}ch`;
    }
});
