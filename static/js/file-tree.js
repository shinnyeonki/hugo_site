// File Tree Icons Injection
document.addEventListener('DOMContentLoaded', function () {
    // SVG 아이콘 정의
    const icons = {
        folder: `
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 4.5 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H19.5A2.25 2.25 0 0 1 21.75 9v.776" />
            </svg>
        `,
        file: `
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
        `,
        chevron: `
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
        `,
        tag: `
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
            </svg>
        `,
        chevronDown: `
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
        `
    };

    // 파일 트리 아이콘 삽입
    // 폴더 아이콘 삽입
    document.querySelectorAll('#ln-file-tree .ln-folder-icon .ln-icon').forEach(el => {
        el.innerHTML = icons.folder;
    });

    // 파일 아이콘 삽입
    document.querySelectorAll('#ln-file-tree .ln-icon').forEach(el => {
        if (!el.closest('.ln-folder-icon') && !el.closest('.ln-chevron')) {
            el.innerHTML = icons.file;
        }
    });

    // chevron 아이콘 삽입
    document.querySelectorAll('#ln-file-tree .ln-chevron').forEach(el => {
        el.innerHTML = icons.chevron;
    });

    // 태그 트리 아이콘 삽입
    // 태그 그룹 아이콘 삽입
    document.querySelectorAll('.ln-tag-group-icon .ln-icon').forEach(el => {
        el.innerHTML = icons.tag;
    });

    // 개별 태그 아이콘 삽입
    document.querySelectorAll('#ln-tag-tree .ln-tag-icon .ln-icon').forEach(el => {
        el.innerHTML = icons.tag;
    });

    // 태그 트리의 파일 아이콘 삽입
    document.querySelectorAll('#ln-tag-tree .ln-icon').forEach(el => {
        if (!el.closest('.ln-tag-icon') && !el.closest('.ln-chevron') && !el.closest('.ln-tag-group-icon') && !el.closest('.ln-chevron-main')) {
            el.innerHTML = icons.file;
        }
    });

    // 태그 트리 chevron 아이콘 삽입
    document.querySelectorAll('#ln-tag-tree .ln-chevron').forEach(el => {
        el.innerHTML = icons.chevron;
    });

    // 메인 chevron 아이콘 삽입 (하향)
    document.querySelectorAll('.ln-chevron-main').forEach(el => {
        el.innerHTML = icons.chevronDown;
    });
});
