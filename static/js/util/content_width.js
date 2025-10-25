/**
 * 콘텐츠 너비 조절 기능
 * 슬라이더를 사용하여 본문 너비를 동적으로 조절합니다.
 */

document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('contentWidthSlider');
    const contentContainer = document.getElementById('content-container');
    
    if (!slider || !contentContainer) {
        return;
    }

    // 저장된 너비 값 불러오기 (로컬 스토리지)
    const savedWidth = localStorage.getItem('contentWidth');
    if (savedWidth) {
        slider.value = savedWidth;
        updateContentWidth(savedWidth);
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
        // 기존 max-w 클래스 제거
        const classes = contentContainer.className.split(' ');
        const filteredClasses = classes.filter(cls => !cls.startsWith('max-w-'));
        
        // 새로운 너비 적용
        contentContainer.className = filteredClasses.join(' ');
        contentContainer.style.maxWidth = `${width}ch`;
    }
});
