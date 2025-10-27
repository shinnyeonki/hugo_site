import os
import re
from pathlib import Path
import stat
from datetime import datetime, timezone

# ==============================================================================
# --- 전역 설정 영역 ---
# 아래 변수들을 수정하여 스크립트의 동작을 자유롭게 제어하세요.
# ==============================================================================

# [최상위 설정]
# 이 스크립트의 모든 관리 기능을 켤지 여부를 결정합니다.
# False로 설정하면 스크립트는 아무 작업도 하지 않습니다.
ENTIRE_SCRIPT_ENABLED = True

# ------------------------------------------------------------------------------
# --- 1. Frontmatter 관리 설정 ---
# 기능: 개별 마크다운 파일의 Frontmatter를 관리합니다. (title, draft, resource-path 등)
# ------------------------------------------------------------------------------
FRONTMATTER_MANAGE_ENABLED = True

# [1-1. Title 관리 설정]
TITLE_MANAGE = True  # 제목 관리 활성화/비활성화
TITLE_CAPITALIZE = False  # (신규 생성 및 기존 제목 정규화 시) 제목의 첫 글자를 대문자로 변환
TITLE_QUOTE_STYLE = 'none'  # (신규 생성 및 기존 제목 정규화 시) 'double', 'single', 'none'
TITLE_CONVERT_SYMBOLS_TO_SPACES = True  # (신규 생성 시) 하이픈/언더스코어를 공백으로 변환

# [1-2. Draft(초안) 상태 관리 설정]
# DRAFT_MANAGE = True # 현재는 기능이 구현되지 않아 주석 처리

# [1-3. Resource Path 관리 설정]
RESOURCE_PATH_MANAGE = True  # 리소스 경로 관리 활성화/비활성화
RESOURCE_PATH_QUOTE_STYLE = 'none'  # 'double', 'single', 'none'


# ------------------------------------------------------------------------------
# --- 4. 파일 시스템 및 경로 설정 (전역) ---
# ------------------------------------------------------------------------------
# Hugo 프로젝트의 content 디렉터리 경로 (스크립트 파일 위치 기준)
CONTENT_DIRECTORY = '../content'

# Frontmatter 수정 시 파일의 원본 수정 시간을 보존할지 여부
RESTORE_MODIFICATION_TIME = True
# Frontmatter 수정 시 파일의 원본 접근 시간을 보존할지 여부
RESTORE_ACCESS_TIME = True


# ==============================================================================
# --- 함수 정의 영역 ---
# ==============================================================================

def update_frontmatter(file_path, content_root):
    """개별 마크다운 파일의 Frontmatter를 파싱하고 설정에 따라 업데이트합니다."""
    p = Path(file_path)
    display_root = content_root.parent
    relative_path_str = str(p.relative_to(display_root)) if p.is_relative_to(display_root) else str(p)

    try:
        # 1. 원본 정보 저장
        original_stat = p.stat()
        original_atime = original_stat.st_atime
        original_mtime = original_stat.st_mtime
        original_mode = stat.S_IMODE(original_stat.st_mode)

        content = p.read_text(encoding='utf-8')

        # 2. Frontmatter 파싱 준비
        fm_regex = r'^(?P<start_delimiter>---\s*\n)(?P<frontmatter_content>[\s\S]*?)(?P<end_delimiter>\n---\s*\n?)'
        fm_match = re.match(fm_regex, content)
        has_frontmatter_block = fm_match is not None

        original_fm_text = fm_match.group('frontmatter_content').strip() if has_frontmatter_block else ""
        body_content = content[fm_match.end():] if has_frontmatter_block else content

        managed_keys = {'title', 'draft', 'resource-path'}

        fm_data = {}
        unmanaged_lines = []
        is_in_multiline_block = False

        for line in original_fm_text.split('\n'):
            stripped_line = line.strip()
            if not stripped_line: continue

            match = re.match(r'^\s*([\w-]+)\s*:\s*(.*)', line)

            if match:
                key, value = match.groups()
                key = key.lower()

                if key in managed_keys:
                    fm_data[key] = value.strip()
                    is_in_multiline_block = False
                else:
                    unmanaged_lines.append(line)
                    is_in_multiline_block = not value.strip()
            elif is_in_multiline_block or stripped_line.startswith('-'):
                unmanaged_lines.append(line)
            else:
                unmanaged_lines.append(line)
                is_in_multiline_block = False

        changes_made = []

        # 3. 설정에 따라 Frontmatter 데이터 수정
        if FRONTMATTER_MANAGE_ENABLED:
            if TITLE_MANAGE and 'title' not in fm_data:
                derived_title = p.stem
                if TITLE_CONVERT_SYMBOLS_TO_SPACES: derived_title = derived_title.replace('-', ' ').replace('_', ' ')
                fm_data['title'] = derived_title
                changes_made.append("added 'title' from filename")

            if TITLE_MANAGE and 'title' in fm_data:
                original_title_value = fm_data['title']
                title_text = original_title_value
                if title_text.startswith('"') and title_text.endswith('"'):
                    title_text = title_text[1:-1].replace('\\"', '"')
                elif title_text.startswith("'") and title_text.endswith("'"):
                    title_text = title_text[1:-1].replace("\\'", "'")

                if TITLE_CAPITALIZE:
                    title_text = title_text.capitalize()

                if TITLE_QUOTE_STYLE == 'double': new_title_value = '"' + title_text.replace('"', '\\"') + '"'
                elif TITLE_QUOTE_STYLE == 'single': new_title_value = "'" + title_text.replace("'", "\\'") + "'"
                else: new_title_value = title_text

                if new_title_value != original_title_value:
                    fm_data['title'] = new_title_value
                    if not any("added 'title'" in change for change in changes_made):
                        changes_made.append("normalized 'title' style")

            if RESOURCE_PATH_MANAGE:
                path_str = str(p.relative_to(content_root)).replace(os.sep, '/')

                if RESOURCE_PATH_QUOTE_STYLE == 'double': path_value = '"' + path_str.replace('"', '\\"') + '"'
                elif RESOURCE_PATH_QUOTE_STYLE == 'single': path_value = "'" + path_str.replace("'", "\\'") + "'"
                else: path_value = path_str

                if fm_data.get('resource-path') != path_value:
                    fm_data['resource-path'] = path_value
                    changes_made.append("added/updated 'resource-path'")

        # 4. 변경사항 최종 확인
        if not changes_made:
            if has_frontmatter_block: # Frontmatter가 있는데 변경이 없는 경우만 스킵
                 print(f"Skipping {relative_path_str}: No changes needed.")
            return

        # 5. 재구성 로직
        key_order = ['title', 'resource-path', 'draft']
        managed_lines = []

        for key in key_order:
            if key in fm_data:
                managed_lines.append(f"{key}: {fm_data.pop(key)}")
        for key, value in fm_data.items():
            managed_lines.append(f"{key}: {value}")

        new_fm_lines = managed_lines + unmanaged_lines
        new_fm_text = '\n'.join(filter(None, new_fm_lines))

        if not has_frontmatter_block and new_fm_text:
            changes_made.insert(0, "created frontmatter block")
        
        if not changes_made:
            print(f"Skipping {relative_path_str}: No changes needed.")
            return

        print(f"Processed {relative_path_str}: [{', '.join(changes_made)}]")
        new_content = f"---\n{new_fm_text}\n---\n{body_content.lstrip()}"
        p.write_text(new_content, encoding='utf-8')

        # 6. 원본 파일 정보 복원
        if RESTORE_MODIFICATION_TIME or RESTORE_ACCESS_TIME:
            os.utime(p, (original_atime if RESTORE_ACCESS_TIME else p.stat().st_atime,
                         original_mtime if RESTORE_MODIFICATION_TIME else p.stat().st_mtime))
        os.chmod(p, original_mode)

    except Exception as e:
        print(f"Error processing frontmatter for {relative_path_str}: {e}")


def process_frontmatter_files(directory):
    """지정된 디렉터리의 모든 마크다운 파일의 Frontmatter를 처리합니다."""
    if not ENTIRE_SCRIPT_ENABLED:
        print("Skipping all processes: ENTIRE_SCRIPT_ENABLED is set to False.")
        return

    script_dir = Path(__file__).parent.resolve()
    target_dir = (script_dir / directory).resolve()

    if not target_dir.is_dir():
        print(f"Error: Directory '{target_dir}' not found.")
        print(f"Please check the 'CONTENT_DIRECTORY' variable ('{directory}') in the script.")
        return

    # --- Frontmatter 업데이트 ---
    if FRONTMATTER_MANAGE_ENABLED:
        print(f"--- Starting frontmatter processing in '{target_dir}' ---")
        for root, _, files in os.walk(target_dir):
            for file in files:
                if file.lower().endswith(('.md', '.mdx')):
                    # _index.md 파일은 frontmatter 자동 관리에서 제외
                    if file.lower() == "_index.md":
                        continue
                    full_path = Path(root) / file
                    update_frontmatter(full_path, target_dir)
        print("--- Frontmatter processing finished ---")
    else:
        print("Skipping frontmatter processing: FRONTMATTER_MANAGE_ENABLED is set to False.")

    print("\n--- Frontmatter management process finished ---")


# ==============================================================================
# --- 스크립트 실행 ---
# ==============================================================================
if __name__ == "__main__":
    process_frontmatter_files(CONTENT_DIRECTORY)