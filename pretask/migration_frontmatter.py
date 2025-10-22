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
# 이 스크립트의 모든 Frontmatter 관리 기능을 켤지 여부를 결정합니다.
# False로 설정하면 스크립트는 아무 작업도 하지 않습니다.
ENTIRE_MANAGE_FRONTMATTER = True

# ------------------------------------------------------------------------------
# --- 1. Title 관리 설정 ---
# 기능: Frontmatter에 'title'이 없으면 파일명 기반으로 자동 생성하고,
#       이미 'title'이 있으면 설정에 맞게 스타일(대소문자, 인용부호)을 정규화합니다.
# ------------------------------------------------------------------------------
TITLE_MANAGE = True # 제목 관리 활성화/비활성화
TITLE_CAPITALIZE = False # (신규 생성 및 기존 제목 정규화 시) 제목의 첫 글자를 대문자로 변환
TITLE_QUOTE_STYLE = 'none' # (신규 생성 및 기존 제목 정규화 시) 'double', 'single', 'none'
TITLE_CONVERT_SYMBOLS_TO_SPACES = True # (신규 생성 시) 하이픈/언더스코어를 공백으로 변환

# ------------------------------------------------------------------------------
# --- 2. 타임스탬프 관리 설정 ---
# 기능: 'date'와 'lastmod' 속성을 관리합니다.
# ------------------------------------------------------------------------------
TIMESTAMPS_MANAGE = True
TIMESTAMPS_FORMAT = '%Y-%m-%dT%H:%M:%S%z'

# ------------------------------------------------------------------------------
# --- 3. Draft(초안) 상태 관리 설정 ---
# 기능: 특정 조건 하에 문서를 자동으로 초안 상태('draft: true')로 만듭니다.
# ------------------------------------------------------------------------------
DRAFT_MANAGE = True
DRAFT_ADD_IF_NO_DATE = True

# ------------------------------------------------------------------------------
# --- 4. Resource Path 관리 설정 --- 
# 기능: 'content' 디렉터리를 기준으로 파일의 상대 경로를 'resource-path' 속성에 추가/업데이트합니다.
# ------------------------------------------------------------------------------
RESOURCE_PATH_MANAGE = True # 리소스 경로 관리 활성화/비활성화
# 아래 설정은 RESOURCE_PATH_MANAGE가 True일 때만 동작합니다.
RESOURCE_PATH_QUOTE_STYLE = 'none' # 'double', 'single', 'none'

# ------------------------------------------------------------------------------
# --- 5. 파일 시스템 설정 (전역) ---
# ------------------------------------------------------------------------------
RESTORE_MODIFICATION_TIME = True
RESTORE_ACCESS_TIME = True

# ==============================================================================


def update_frontmatter(file_path, content_root):
    p = Path(file_path)
    display_root = content_root.parent
    relative_path_str = str(p.relative_to(display_root)) if p.is_relative_to(display_root) else str(p)

    try:
        # 1. 원본 정보 저장
        original_stat = p.stat()
        original_atime = original_stat.st_atime
        original_mtime = original_stat.st_mtime
        original_mode = stat.S_IMODE(original_stat.st_mode)
        try:
            creation_time = original_stat.st_birthtime
        except AttributeError:
            creation_time = original_stat.st_ctime
        
        content = p.read_text(encoding='utf-8')

        # 2. Frontmatter 파싱 준비
        fm_regex = r'^(?P<start_delimiter>---\s*\n)(?P<frontmatter_content>[\s\S]*?)(?P<end_delimiter>\n---\s*\n?)'
        fm_match = re.match(fm_regex, content)
        has_frontmatter_block = fm_match is not None
        
        original_fm_text = fm_match.group('frontmatter_content').strip() if has_frontmatter_block else ""
        body_content = content[fm_match.end():] if has_frontmatter_block else content
        
        # --- [변경] 'path'를 'resource-path'로 수정 ---
        managed_keys = {'title', 'date', 'lastmod', 'created', 'modified', 'draft', 'resource-path'}
        
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
        
        original_fm_data_snapshot = fm_data.copy()
        changes_made = []

        # 3. 설정에 따라 Frontmatter 데이터 수정
        if DRAFT_MANAGE and DRAFT_ADD_IF_NO_DATE:
            has_date_key = 'date' in fm_data or 'created' in fm_data
            if not has_frontmatter_block or not has_date_key:
                if fm_data.get('draft') != 'true':
                    fm_data['draft'] = 'true'
                    changes_made.append("added 'draft: true' due to missing date")

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

        if TIMESTAMPS_MANAGE:
            def format_rfc3339_with_colon(dt_object):
                if not dt_object: return None
                raw_timestamp = dt_object.strftime(TIMESTAMPS_FORMAT)
                if len(raw_timestamp) > 5 and raw_timestamp[-5] in ('+', '-'):
                    return f"{raw_timestamp[:-2]}:{raw_timestamp[-2:]}"
                return raw_timestamp

            if 'created' in fm_data and 'date' not in fm_data:
                fm_data['date'] = fm_data.pop('created')
                changes_made.append("renamed 'created' to 'date'")
            elif 'date' not in fm_data:
                dt_creation = datetime.fromtimestamp(creation_time).astimezone()
                fm_data['date'] = format_rfc3339_with_colon(dt_creation)
                changes_made.append("added 'date' from file creation time")

            if 'modified' in fm_data and 'lastmod' not in fm_data:
                fm_data['lastmod'] = fm_data.pop('modified')
                changes_made.append("renamed 'modified' to 'lastmod'")
            elif 'lastmod' not in fm_data:
                dt_modification = datetime.fromtimestamp(original_mtime).astimezone()
                fm_data['lastmod'] = format_rfc3339_with_colon(dt_modification)
                changes_made.append("added 'lastmod' from file modification time")

            if 'created' in fm_data: fm_data.pop('created')
            if 'modified' in fm_data: fm_data.pop('modified')

        # --- [변경] 'PATH_MANAGE' 로직을 'RESOURCE_PATH_MANAGE'로 수정 ---
        if RESOURCE_PATH_MANAGE:
            path_str = str(p.relative_to(content_root)).replace(os.sep, '/')
            
            if RESOURCE_PATH_QUOTE_STYLE == 'double': path_value = '"' + path_str.replace('"', '\\"') + '"'
            elif RESOURCE_PATH_QUOTE_STYLE == 'single': path_value = "'" + path_str.replace("'", "\\'") + "'"
            else: path_value = path_str
            
            # 키 이름을 'resource-path'로 확인하고 업데이트합니다.
            if fm_data.get('resource-path') != path_value:
                fm_data['resource-path'] = path_value
                changes_made.append("added/updated 'resource-path'")

        # 4. 변경사항 최종 확인
        if not changes_made and has_frontmatter_block:
             print(f"Skipping {relative_path_str}: No changes needed.")
             return

        # 5. 재구성 로직
        # --- [변경] key_order에서 'path'를 'resource-path'로 수정 ---
        key_order = ['title', 'date', 'lastmod', 'resource-path', 'draft']
        managed_lines = []
        
        for key in key_order:
            if key in fm_data:
                # 'resource-path'는 하이픈이 있으므로 그대로 사용
                managed_lines.append(f"{key}: {fm_data.pop(key)}")
        for key, value in fm_data.items():
            managed_lines.append(f"{key}: {value}")

        new_fm_lines = managed_lines + unmanaged_lines
        new_fm_text = '\n'.join(filter(None, new_fm_lines))
        
        if not has_frontmatter_block:
            if "created frontmatter block" not in changes_made:
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
        print(f"Error processing {relative_path_str}: {e}")

def process_all_files(directory):
    if not ENTIRE_MANAGE_FRONTMATTER:
        print("Skipping all files: ENTIRE_MANAGE_FRONTMATTER is set to False.")
        return

    script_dir = Path(__file__).parent.resolve()
    target_dir = (script_dir / directory).resolve()
    
    if not target_dir.is_dir():
        print(f"Error: Directory '{target_dir}' not found.")
        return

    print(f"--- Starting processing in '{target_dir}' ---")
    print(f"--- Project root detected as '{target_dir.parent}' ---")
    for root, _, files in os.walk(target_dir):
        for file in files:
            if file.lower().endswith(('.md', '.mdx')):
                full_path = Path(root) / file
                update_frontmatter(full_path, target_dir)
    print("--- Processing finished ---")

# --- 스크립트 실행 ---
content_directory = '../content' 
process_all_files(content_directory)