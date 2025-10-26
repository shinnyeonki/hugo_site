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
        `,
        clock: `
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        `,
        calendar: `
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
        `
    };

    // 파일 트리 아이콘 삽입
    // 파일 트리 메인 폴더 아이콘 삽입
    document.querySelectorAll('.ln-file-tree-folder-icon .ln-icon').forEach(el => {
        el.innerHTML = icons.folder;
    });

    // 폴더 아이콘 삽입
    document.querySelectorAll('#ln-file-tree .ln-folder-icon .ln-icon').forEach(el => {
        el.innerHTML = icons.folder;
    });

    // 파일 아이콘 삽입
    document.querySelectorAll('#ln-file-tree .ln-icon').forEach(el => {
        if (!el.closest('.ln-folder-icon') && !el.closest('.ln-chevron') && !el.closest('.ln-file-tree-folder-icon')) {
            el.innerHTML = icons.file;
        }
    });

    // 파일 트리 관련 tailwindcss 동적 삽입
    // File tree summary 스타일링
    document.querySelectorAll('#ln-file-tree details > summary').forEach(el => {
        el.classList.add('flex', 'items-center', 'p-2', 'text-left', 'rounded-md', 'cursor-pointer', 'list-none', 'text-sm', 'transition-all', 'duration-300');
    });

    // File tree folder links 스타일링
    document.querySelectorAll('#ln-file-tree details > summary a').forEach(el => {
        el.classList.add('text-inherit', 'no-underline', 'font-semibold', 'hover:underline');
    });

    // File tree nested lists 스타일링
    document.querySelectorAll('#ln-file-tree details > ul').forEach(el => {
        el.classList.add('ml-6', 'mt-1', 'space-y-1', 'list-none');
    });

    // File tree list items 스타일링 (재귀적으로 모든 li 찾기)
    document.querySelectorAll('#ln-file-tree li').forEach(el => {
        el.classList.add('list-none');
    });

    // File tree folder icons 스타일링
    document.querySelectorAll('#ln-file-tree .ln-folder-icon').forEach(el => {
        el.classList.add('mr-2');
    });

    // File tree chevron container 스타일링
    document.querySelectorAll('#ln-file-tree details > summary > span:last-child').forEach(el => {
        if (el.querySelector('.ln-chevron')) {
            el.classList.add('flex', 'items-center', 'justify-center', 'w-5', 'h-5', 'ml-auto', 'shrink-0');
        }
    });

    // File tree file links 스타일링 (재귀적으로 모든 li > a 찾기)
    document.querySelectorAll('#ln-file-tree li > a').forEach(el => {
        el.classList.add('flex', 'items-center', 'p-2', 'text-sm', 'rounded-md', 'transition-all', 'duration-300');
    });

    // File tree file icons 스타일링
    document.querySelectorAll('#ln-file-tree li > a > span:first-child').forEach(el => {
        if (el.querySelector('.ln-icon')) {
            el.classList.add('mr-2');
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

    // tag 트리 관련 tailwindcss 동적 삽입
    // Tag tree summary 스타일링
    document.querySelectorAll('#ln-tag-tree details > summary').forEach(el => {
        el.classList.add('flex', 'items-center', 'p-2', 'text-left', 'rounded-md', 'cursor-pointer', 'list-none', 'text-sm', 'transition-all', 'duration-300');
    });

    // Tag tree tag links 스타일링
    document.querySelectorAll('#ln-tag-tree details > summary a').forEach(el => {
        el.classList.add('text-inherit', 'no-underline', 'font-semibold', 'hover:underline');
    });

    // Tag tree nested lists 스타일링
    document.querySelectorAll('#ln-tag-tree details > ul').forEach(el => {
        el.classList.add('ml-6', 'mt-1', 'space-y-1', 'list-none');
    });

    // Tag tree list items 스타일링 (재귀적으로 모든 li 찾기)
    document.querySelectorAll('#ln-tag-tree li').forEach(el => {
        el.classList.add('list-none');
    });

    // Tag tree tag icons 스타일링
    document.querySelectorAll('#ln-tag-tree .ln-tag-icon').forEach(el => {
        el.classList.add('mr-2');
    });

    // Tag count 스타일링
    document.querySelectorAll('#ln-tag-tree details > summary > span.text-xs').forEach(el => {
        el.classList.add('ml-2', 'text-neutral-400', 'dark:text-neutral-500');
    });

    // Tag tree chevron container 스타일링
    document.querySelectorAll('#ln-tag-tree details > summary > span:last-child').forEach(el => {
        if (el.querySelector('.ln-chevron')) {
            el.classList.add('flex', 'items-center', 'justify-center', 'w-5', 'h-5', 'ml-auto', 'shrink-0');
        }
    });

    // Tag tree file links 스타일링
    document.querySelectorAll('#ln-tag-tree li > a').forEach(el => {
        if (!el.closest('summary')) {
            el.classList.add('flex', 'items-center', 'p-2', 'text-sm', 'rounded-md', 'transition-all', 'duration-300');
        }
    });

    // Tag tree file icons 스타일링
    document.querySelectorAll('#ln-tag-tree li > a > span:first-child').forEach(el => {
        if (el.querySelector('.ln-icon')) {
            el.classList.add('mr-2');
        }
    });

    // 수정순 아이콘 삽입
    document.querySelectorAll('.ln-recent-modified-icon .ln-icon').forEach(el => {
        el.innerHTML = icons.clock;
    });

    // 생성순 아이콘 삽입
    document.querySelectorAll('.ln-recent-created-icon .ln-icon').forEach(el => {
        el.innerHTML = icons.calendar;
    });

    // 수정순/생성순 내 파일 아이콘 삽입
    document.querySelectorAll('.ln-recent-modified-icon').forEach(container => {
        const parent = container.closest('details');
        if (parent) {
            parent.querySelectorAll('.ln-icon').forEach(el => {
                if (!el.closest('.ln-recent-modified-icon')) {
                    el.innerHTML = icons.file;
                }
            });
        }
    });

    document.querySelectorAll('.ln-recent-created-icon').forEach(container => {
        const parent = container.closest('details');
        if (parent) {
            parent.querySelectorAll('.ln-icon').forEach(el => {
                if (!el.closest('.ln-recent-created-icon')) {
                    el.innerHTML = icons.file;
                }
            });
        }
    });

    // 최근 수정된 파일 및 생성된 파일 트리 관련 tailwindcss 동적 삽입
    // Recent modified/created list items 스타일링
    document.querySelectorAll('.ln-recent-modified-icon, .ln-recent-created-icon').forEach(container => {
        const parent = container.closest('details');
        if (parent) {
            // 링크 스타일링
            parent.querySelectorAll('div.space-y-1 > a').forEach(el => {
                el.classList.add('flex', 'items-center', 'justify-between', 'p-2', 'text-sm', 'rounded-md', 'group', 'transition-all', 'duration-300');
            });
            
            // 아이콘 여백 스타일링
            parent.querySelectorAll('div.space-y-1 > a > span:first-child > span:first-child').forEach(el => {
                if (el.querySelector('.ln-icon')) {
                    el.classList.add('mr-2');
                }
            });

            // 날짜 여백 스타일링
            parent.querySelectorAll('div.space-y-1 > a > span.text-xs').forEach(el => {
                el.classList.add('ml-2');
            });
        }
    });

});
