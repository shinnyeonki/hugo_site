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
# 기능: Frontmatter에 'title'이 없을 경우, 파일명을 기반으로 자동 생성합니다.
# ------------------------------------------------------------------------------
TITLE_MANAGE = True # 제목 관리 활성화/비활성화
# 아래 설정은 TITLE_MANAGE가 True일 때만 동작합니다.
TITLE_CAPITALIZE = False # (신규 생성 시) 제목의 첫 글자를 대문자로 변환
TITLE_QUOTE_STYLE = 'none' # (신규 생성 시) 'double', 'single', 'none'
TITLE_CONVERT_SYMBOLS_TO_SPACES = True # (신규 생성 시) 하이픈/언더스코어를 공백으로 변환

# ------------------------------------------------------------------------------
# --- 2. 타임스탬프 관리 설정 ---
# 기능: 'date'와 'lastmod' 속성을 관리합니다.
#   1. 이름 변경: 'created' -> 'date', 'modified' -> 'lastmod'로 변경.
#   2. 신규 생성: 'date'/'lastmod'가 없으면 파일 시스템 시간으로 새로 생성.
# ------------------------------------------------------------------------------
TIMESTAMPS_MANAGE = True
# 신규 생성 시 사용할 날짜/시간 형식 ( ISO 8601)
TIMESTAMPS_FORMAT = '%Y-%m-%dT%H:%M:%S%z'

# ------------------------------------------------------------------------------
# --- 3. Draft(초안) 상태 관리 설정 ---
# 기능: 특정 조건 하에 문서를 자동으로 초안 상태('draft: true')로 만듭니다.
# ------------------------------------------------------------------------------
DRAFT_MANAGE = True
# 아래 설정은 DRAFT_MANAGE가 True일 때만 동작합니다.
# True: Frontmatter가 없거나, 'date'/'created'가 없는 경우 'draft: true'를 추가합니다.
#       'draft'가 이미 'false'로 명시되어 있어도 'true'로 덮어씁니다. (안전장치)
DRAFT_ADD_IF_NO_DATE = True

# ------------------------------------------------------------------------------
# --- 4. 파일 시스템 설정 (전역) ---
# ------------------------------------------------------------------------------
# True로 설정 시, 파일 내용 수정 후 원래의 수정/접근 시간을 복원합니다.
# Git에서 불필요한 변경사항으로 감지되는 것을 방지합니다.
RESTORE_MODIFICATION_TIME = True
RESTORE_ACCESS_TIME = True

# ==============================================================================

def update_frontmatter(file_path, project_root):
    p = Path(file_path)
    # [개선] 경로 표시 기준을 프로젝트 루트의 부모(hugo_site)로 하여 더 명확하게 표시
    display_root = project_root.parent
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

        # 2. Frontmatter 파싱 준비 (이전과 동일)
        fm_regex = r'^(?P<start_delimiter>---\s*\n)(?P<frontmatter_content>[\s\S]*?)(?P<end_delimiter>\n---\s*\n?)'
        fm_match = re.match(fm_regex, content)
        has_frontmatter_block = fm_match is not None
        original_fm_text = fm_match.group('frontmatter_content').strip() if has_frontmatter_block else ""
        body_content = content[fm_match.end():] if has_frontmatter_block else content
        fm_data = {}
        key_pattern = re.compile(r'^\s*([\w-]+)\s*:\s*(.*)')
        for line in original_fm_text.split('\n'):
            if not line.strip(): continue
            match = key_pattern.match(line)
            if match:
                key, value = match.groups()
                fm_data[key.lower()] = value.strip()
        
        original_fm_data_snapshot = fm_data.copy()
        changes_made = []

        # 4. 설정에 따라 Frontmatter 데이터 수정 (Draft, Title 부분은 이전과 동일)
        if DRAFT_MANAGE and DRAFT_ADD_IF_NO_DATE:
            has_date_key = 'date' in fm_data or 'created' in fm_data
            if not has_frontmatter_block or not has_date_key:
                if fm_data.get('draft') != 'true':
                    fm_data['draft'] = 'true'
                    changes_made.append("added 'draft: true' due to missing date")

        if TITLE_MANAGE and 'title' not in fm_data:
            derived_title = p.stem
            if TITLE_CONVERT_SYMBOLS_TO_SPACES: derived_title = derived_title.replace('-', ' ').replace('_', ' ')
            if TITLE_CAPITALIZE: derived_title = derived_title.capitalize()
            
            if TITLE_QUOTE_STYLE == 'double': title_value = '"' + derived_title.replace('"', '\\"') + '"'
            elif TITLE_QUOTE_STYLE == 'single': title_value = "'" + derived_title.replace("'", "\\'") + "'"
            else: title_value = derived_title
            
            fm_data['title'] = title_value
            changes_made.append("added 'title' from filename")

        # --- [타임스탬프 처리 로직 수정됨] ---
        if TIMESTAMPS_MANAGE:
            def format_rfc3339_with_colon(dt_object):
                """datetime 객체를 Hugo 표준 형식(+09:00) 문자열로 변환합니다."""
                if not dt_object:
                    return None
                # 1. TIMESTAMPS_FORMAT을 사용해 '+0900' 형식의 기본 문자열 생성
                raw_timestamp = dt_object.strftime(TIMESTAMPS_FORMAT)
                
                # 2. 마지막 2글자(분) 앞에 ':'를 삽입
                if len(raw_timestamp) > 5 and raw_timestamp[-5] in ('+', '-'):
                    return f"{raw_timestamp[:-2]}:{raw_timestamp[-2:]}"
                
                # 시간대 정보가 없는 경우 등 예외 상황에서는 원본 반환
                return raw_timestamp

            # Date 처리
            if 'created' in fm_data and 'date' not in fm_data:
                fm_data['date'] = fm_data.pop('created')
                changes_made.append("renamed 'created' to 'date'")
            elif 'date' not in fm_data:
                dt_creation = datetime.fromtimestamp(creation_time).astimezone()
                fm_data['date'] = format_rfc3339_with_colon(dt_creation)
                changes_made.append("added 'date' from file creation time")

            # Lastmod 처리
            if 'modified' in fm_data and 'lastmod' not in fm_data:
                fm_data['lastmod'] = fm_data.pop('modified')
                changes_made.append("renamed 'modified' to 'lastmod'")
            elif 'lastmod' not in fm_data:
                dt_modification = datetime.fromtimestamp(original_mtime).astimezone()
                fm_data['lastmod'] = format_rfc3339_with_colon(dt_modification)
                changes_made.append("added 'lastmod' from file modification time")

            if 'created' in fm_data: fm_data.pop('created')
            if 'modified' in fm_data: fm_data.pop('modified')
        # --- [타임스탬프 처리 로직 수정 완료] ---

        # 5. 변경사항 최종 확인 (이후 코드는 이전과 동일)
        if fm_data == original_fm_data_snapshot:
            return

        key_order = ['title', 'date', 'lastmod', 'draft']
        new_fm_lines = []
        for key in key_order:
            if key in fm_data:
                new_fm_lines.append(f"{key}: {fm_data.pop(key)}")
        for key in original_fm_data_snapshot:
             if key in fm_data:
                new_fm_lines.append(f"{key}: {fm_data.pop(key)}")
        for key, value in fm_data.items():
            new_fm_lines.append(f"{key}: {value}")
            
        new_fm_text = '\n'.join(new_fm_lines)
        if not has_frontmatter_block:
             changes_made.insert(0, "created frontmatter block")
        
        print(f"Processed {relative_path_str}: [{', '.join(changes_made)}]")
        new_content = f"---\n{new_fm_text}\n---\n{body_content.lstrip()}"
        p.write_text(new_content, encoding='utf-8')

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
                # [개선] 경로 표시 기준을 target_dir(content 폴더)로 전달
                update_frontmatter(full_path, target_dir)
    print("--- Processing finished ---")

# --- 스크립트 실행 ---
# 처리할 대상 디렉터리 (스크립트 파일 위치 기준)
content_directory = '../content' 
process_all_files(content_directory)