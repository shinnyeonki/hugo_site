document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('header-search-button');
    const leftNavToggle = document.getElementById('leftNavToggleCheckbox');
    const searchInput = document.getElementById('left-nav-search-input');

    if (searchButton && leftNavToggle && searchInput) {
        searchButton.addEventListener('click', (e) => {
            e.preventDefault();

            // 만약 내비게이션이 이미 열려있다면, 포커스만 맞추고 종료
            if (leftNavToggle.checked) {
                searchInput.focus();
                return;
            }
            
            // 내비게이션 열기
            leftNavToggle.checked = true;
            
            // left-nav.js의 `inert` 속성 관리를 위한 change 이벤트 강제 발생
            leftNavToggle.dispatchEvent(new Event('change'));

            // CSS 트랜지션(300ms) 후 포커스 이동
            setTimeout(() => {
                searchInput.focus();
            }, 310);
        });
    }
});
