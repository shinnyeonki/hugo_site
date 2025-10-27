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
# --- 2. Hugo 섹션 파일(_index.md) 관리 설정 ---
# 기능: 모든 하위 디렉터리에 '_index.md' 파일을 생성/업데이트하여 섹션으로 만듭니다.
# ------------------------------------------------------------------------------
SECTION_CREATE_ENABLED = True
INDEX_FILENAME = "_index.md"  # 섹션 인덱스 파일명

# ------------------------------------------------------------------------------
# --- 3. 사이트 정보 파일 생성 설정 ---
# 기능: 사이트의 주요 정보 페이지(about, contact 등)를 생성합니다.
# ------------------------------------------------------------------------------
SITE_INFO_CREATE_ENABLED = True
# 생성할 사이트 정보 페이지 목록
SITE_INFO_PAGES = ["about", "privacy", "terms"]
# 사이트 정보 페이지의 레이아웃 경로 (예: "site" -> "site/about.md")
# 비워두면 페이지 이름과 동일한 레이아웃을 사용합니다. (예: "" -> "about.md")
SITE_INFO_TYPE = ""

# ------------------------------------------------------------------------------
# --- 4. 파일 시스템 및 경로 설정 (전역) ---
# ------------------------------------------------------------------------------
# Hugo 프로젝트의 content 디렉터리 경로 (스크립트 파일 위치 기준)
CONTENT_DIRECTORY = '../content'


# ==============================================================================
# --- 함수 정의 영역 ---
# ==============================================================================

def section_create(content_dir):
    """콘텐츠 디렉터리를 순회하며 모든 하위 디렉터리에 _index.md 파일을 생성/갱신합니다."""
    if not SECTION_CREATE_ENABLED:
        print("Skipping section creation: SECTION_CREATE_ENABLED is set to False.")
        return

    print("\n--- Starting section file (_index.md) creation ---")
    try:
        # 모든 하위 디렉터리 순회
        for dirpath, _, _ in os.walk(content_dir):
            current_dir = Path(dirpath)
            index_file_path = current_dir / INDEX_FILENAME

            # _index.md 파일에 쓸 새로운 내용 생성
            dir_name = current_dir.name
            # title 생성 시 하이픈과 언더스코어를 공백으로 변환하고 각 단어의 첫 글자를 대문자로
            title = dir_name.replace('-', ' ').replace('_', ' ').title()
            new_content = f"---\ntitle: {title}\n---\n"

            # _index.md 파일 존재 여부 확인 및 처리
            if index_file_path.exists():
                existing_content = index_file_path.read_text(encoding='utf-8').strip()
                if existing_content != new_content.strip():
                    index_file_path.write_text(new_content, encoding='utf-8')
                    print(f"  [Updated] {index_file_path.relative_to(content_dir.parent)}")
            else:
                index_file_path.write_text(new_content, encoding='utf-8')
                print(f"  [Created] {index_file_path.relative_to(content_dir.parent)}")
        print("--- Section file creation finished ---")

    except Exception as e:
        print(f"\nAn error occurred during section creation: {e}")


def siteinfo_create(content_dir):
    """사이트 정보 페이지(about.md, contact.md 등)를 생성하거나 업데이트합니다."""
    if not SITE_INFO_CREATE_ENABLED:
        print("Skipping site info page creation: SITE_INFO_CREATE_ENABLED is set to False.")
        return

    print("\n--- Starting site info page creation/update ---")
    try:
        for page in SITE_INFO_PAGES:
            file_path = content_dir / f"{page}.md"
            # title은 파일명을 기반으로 첫 글자를 대문자로 만듭니다.
            title = page.capitalize()
            
            # --- Frontmatter 내용 생성 ---
            # 1. title 과 layout 은 항상 포함됩니다.
            frontmatter_lines = [
                f'title: "{title}"'
            ]

            # 2. SITE_INFO_TYPE 변수에 값이 있을 경우에만 type 필드를 추가합니다.
            if SITE_INFO_TYPE:
                frontmatter_lines.append(f'type: "{SITE_INFO_TYPE}"')
            
            # 3. layout 필드를 마지막에 추가합니다.
            frontmatter_lines.append(f'layout: "{page}"')

            # 최종 frontmatter 문자열을 조립합니다.
            new_frontmatter_content = "\n".join(frontmatter_lines)
            new_frontmatter = f"---\n{new_frontmatter_content}\n---"

            # --- 파일 처리 로직 ---
            if not file_path.exists():
                # 파일이 없으면 frontmatter만 있는 새 파일을 생성합니다.
                file_path.write_text(new_frontmatter + '\n', encoding='utf-8')
                print(f"  [Created] {file_path.relative_to(content_dir.parent)}")
            else:
                # 파일이 존재하면 내용을 읽어 frontmatter를 업데이트합니다.
                original_content = file_path.read_text(encoding='utf-8')
                
                # 정규식을 사용하여 기존 frontmatter를 찾습니다.
                fm_regex = r'^(?P<frontmatter>---\s*\n[\s\S]*?\n---\s*\n?)'
                fm_match = re.match(fm_regex, original_content)
                
                if fm_match:
                    # 기존 frontmatter가 있으면
                    existing_frontmatter = fm_match.group('frontmatter')
                    # 생성될 내용과 다를 경우에만 업데이트합니다.
                    if existing_frontmatter.strip() != new_frontmatter.strip():
                        body_content = original_content[fm_match.end():]
                        new_content = new_frontmatter + '\n' + body_content.lstrip()
                        file_path.write_text(new_content, encoding='utf-8')
                        print(f"  [Updated] {file_path.relative_to(content_dir.parent)}")
                    else:
                        print(f"  [Checked] No changes needed for {file_path.relative_to(content_dir.parent)}")
                else:
                    # frontmatter가 없으면 파일 맨 앞에 추가합니다.
                    new_content = new_frontmatter + '\n' + original_content
                    file_path.write_text(new_content, encoding='utf-8')
                    print(f"  [Updated] Added frontmatter to {file_path.relative_to(content_dir.parent)}")

        print("--- Site info page creation/update finished ---")
    except Exception as e:
        print(f"\nAn error occurred during site info page creation/update: {e}")


def create_site_files(directory):
    """지정된 디렉터리에 Hugo 섹션 파일 및 사이트 정보 파일을 생성합니다."""
    if not ENTIRE_SCRIPT_ENABLED:
        print("Skipping all processes: ENTIRE_SCRIPT_ENABLED is set to False.")
        return

    script_dir = Path(__file__).parent.resolve()
    target_dir = (script_dir / directory).resolve()

    if not target_dir.is_dir():
        print(f"Error: Directory '{target_dir}' not found.")
        print(f"Please check the 'CONTENT_DIRECTORY' variable ('{directory}') in the script.")
        return

    # --- 2. 섹션 파일 생성 ---
    section_create(target_dir)

    # --- 3. 사이트 정보 파일 생성 ---
    siteinfo_create(target_dir)

    print("\n--- All site file creation processes finished ---")


# ==============================================================================
# --- 스크립트 실행 ---
# ==============================================================================
if __name__ == "__main__":
    create_site_files(CONTENT_DIRECTORY)