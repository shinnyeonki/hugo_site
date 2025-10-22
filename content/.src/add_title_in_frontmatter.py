import os
import re
from pathlib import Path
import stat

# ==============================================================================
# --- 전역 설정 영역 ---
# 아래 변수들을 수정하여 스크립트의 동작을 자유롭게 제어하세요.
# ==============================================================================

# 1. 파일명을 제목으로 변환할 때 첫 글자를 대문자로 할지 설정합니다.
#    True: 'my new post' -> 'My new post' (첫 글자만 대문자, 나머지는 소문자)
#    False: 'my new post' -> 'my new post' (원본 대소문자 유지)
CAPITALIZE_TITLE = False

# 2. 제목(title)을 감싸는 따옴표 스타일을 설정합니다.
#    'double', 'single', 'none' 중 선택
QUOTE_STYLE = 'none'

# 3. 파일명의 하이픈(-)과 밑줄(_)을 공백으로 변환할지 설정합니다.
#    True: 'my-new-post' -> 'my new post'
#    False: 'my-new-post' -> 'my-new-post'
CONVERT_SYMBOLS_TO_SPACES = False

# 4. 파일 수정 시간(Modification Time)을 원래대로 복원할지 설정합니다.
#    True: 스크립트 실행 전의 수정 시간으로 복원합니다.
#    False: 스크립트가 파일을 수정한 시간으로 갱신합니다. (Git 변경사항 추적에 유용)
RESTORE_MODIFICATION_TIME = True

# 5. 파일 접근 시간(Access Time)을 원래대로 복원할지 설정합니다.
#    True: 스크립트 실행 전의 접근 시간으로 복원합니다.
#    False: 스크립트 실행 후의 접근 시간으로 갱신합니다.
RESTORE_ACCESS_TIME = True

# ==============================================================================

def add_title_to_frontmatter(file_path):
    try:
        p = Path(file_path)
        
        # 파일의 원래 시간과 권한을 항상 먼저 저장
        original_stat = p.stat()
        original_atime = original_stat.st_atime
        original_mtime = original_stat.st_mtime
        original_mode = stat.S_IMODE(original_stat.st_mode)

        content = p.read_text(encoding='utf-8')

        fm_match = re.match(r'^(?P<start_delimiter>---\s*\n)(?P<frontmatter_content>[\s\S]*?)(?P<end_delimiter>\n---\s*\n?)', content)

        if fm_match:
            frontmatter_content_text = fm_match.group('frontmatter_content')
            
            # --- 설정에 따라 title 생성 ---
            derived_title = p.stem
            if CONVERT_SYMBOLS_TO_SPACES:
                derived_title = derived_title.replace('-', ' ').replace('_', ' ')
            if CAPITALIZE_TITLE:
                derived_title = derived_title.capitalize()

            # --- 최종 title 라인 생성 ---
            if QUOTE_STYLE == 'double':
                # 제목 내 큰따옴표를 이스케이프 처리 (예: " -> \")
                derived_title_escaped = derived_title.replace('"', '\\"')
                new_title_line = f'title: "{derived_title_escaped}"'
            elif QUOTE_STYLE == 'single':
                # 제목 내 작은따옴표를 이스케이프 처리 (예: ' -> \')
                derived_title_escaped = derived_title.replace("'", "\\'")
                new_title_line = f"title: '{derived_title_escaped}'"
            else: # 'none' 또는 그 외의 경우
                new_title_line = f'title: {derived_title}'

            # --- Frontmatter 내용 재구성 ---
            title_pattern = re.compile(r'^\s*title:.*$\n?', re.IGNORECASE | re.MULTILINE)
            content_without_title = title_pattern.sub('', frontmatter_content_text).strip()
            if content_without_title:
                new_frontmatter_content = new_title_line + '\n' + content_without_title
            else:
                new_frontmatter_content = new_title_line
            
            new_content = content.replace(frontmatter_content_text, new_frontmatter_content + '\n', 1)

            if content != new_content:
                p.write_text(new_content, encoding='utf-8')
                
                # --- 설정에 따라 파일 시간 복원 또는 유지 ---
                if RESTORE_MODIFICATION_TIME or RESTORE_ACCESS_TIME:
                    # 복원이 하나라도 필요한 경우, 최신 파일 상태를 다시 읽어옴
                    current_stat = p.stat()
                    
                    # 복원할 접근 시간 결정 (False면 현재 시간 사용)
                    atime_to_set = original_atime if RESTORE_ACCESS_TIME else current_stat.st_atime
                    
                    # 복원할 수정 시간 결정 (False면 현재 시간 사용)
                    mtime_to_set = original_mtime if RESTORE_MODIFICATION_TIME else current_stat.st_mtime
                    
                    os.utime(file_path, (atime_to_set, mtime_to_set))
                
                # 파일 권한은 항상 원래대로 복원
                os.chmod(file_path, original_mode) 

                print(f"Set/Updated title in: {file_path}")
            else:
                print(f"Skipping {file_path}: No changes needed.")
        else:
            print(f"Skipping {file_path}: No frontmatter found.")
            return

    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def process_all_files(directory):
    if not os.path.isdir(directory):
        print(f"Error: Directory '{directory}' not found.")
        return

    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):
                full_path = os.path.join(root, file)
                add_title_to_frontmatter(full_path)

# 스크립트 실행 예시
process_all_files('..')