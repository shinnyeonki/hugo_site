#!/usr/bin/env python3
"""
Search Index Generator for Hugo Site (using hugo.toml)

Generates only search_index.json from ../content markdown files,
respecting ignoreFiles defined in hugo.toml.
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime
import argparse
import fnmatch
import subprocess


# ==============================
# 🔧 전역 설정 (Global Config)
# ==============================

# 기본 경로 설정
SCRIPT_DIR = Path(__file__).parent.resolve()
PROJECT_ROOT = SCRIPT_DIR.parent.resolve()
HUGO_CONFIG_PATH = PROJECT_ROOT / "hugo.toml"
CONTENT_DIR = PROJECT_ROOT / "content"  # ../content
DEFAULT_OUTPUT_DIR = PROJECT_ROOT / "static" / "indexing"

# ✅ 포함할 확장자 (이 확장자만 인덱싱 대상)
INCLUDE_EXTENSIONS = {'.md'}

# 디렉터리 제외 기본값 (hugo.toml 정의된 ignoreFiles 외 추가 제외 항목이 필요하면 여기에 추가)
ADDITIONAL_EXCLUDE_PATTERNS = ['content/08.media']


# ==============================
# 📄 헬퍼 함수
# ==============================

def parse_hugo_toml_ignore_files(toml_path):
    """hugo.toml에서 ignoreFiles 배열을 파싱하여 경로 리스트 반환"""
    ignore_patterns = []
    if not toml_path.is_file():
        print(f"⚠️  Warning: {toml_path} not found. No ignore rules loaded.")
        return ignore_patterns

    try:
        with open(toml_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # TOML 파싱: ignoreFiles = [ ... ]
        match = re.search(r'^\s*ignoreFiles\s*=\s*\[(.*?)\]', content, re.MULTILINE | re.DOTALL)
        print(f"ℹ️  Parsing ignoreFiles from {toml_path}")
        if match:
            list_content = match.group(1)
            entries = re.findall(r'["\']([^"\']+)["\']', list_content)
            ignore_patterns = [entry.strip() for entry in entries if entry.strip()]
        # else:
            print("ℹ️  No ignoreFiles found in hugo.toml")

    except Exception as e:
        print(f"❌ Error parsing hugo.toml: {e}")

    return ignore_patterns


def generate_pretty_url(relative_path_str):
    """파일 경로를 Hugo의 Pretty URL 형식으로 변환 (공백 포함 경로도 안전하게 처리)"""
    p = Path(relative_path_str)
    
    # 모든 경로 구성 요소(디렉터리 + 파일명)를 정제
    def clean_part(part):
        part = part.lower()
        part = re.sub(r'\s+', '-', part)               # 공백 → 하이픈
        part = re.sub(r'[^\w\-@.]', '', part, flags=re.UNICODE)  # 허용되지 않는 문자 제거
        part = re.sub(r'-+', '-', part)                # 연속 하이픈 → 하나로
        return part.strip('-')
    
    cleaned_parts = [clean_part(part) for part in p.parts if part]
    if not cleaned_parts:
        return "/"
    
    # 마지막은 확장자 없는 파일명(stem)이어야 함
    cleaned_parts[-1] = clean_part(p.stem)
    
    url_path = "/".join(cleaned_parts).strip('/')
    return f"/{url_path}/" if url_path else "/"


def extract_frontmatter(content):
    match = re.match(r'^---\s*\n([\s\S]*?)\n---\s*\n?', content, re.DOTALL)
    if not match:
        return {}

    frontmatter_text = match.group(1)
    frontmatter = {}
    lines = frontmatter_text.strip().split('\n')
    current_key = None
    current_list = []

    for line in lines:
        if line.strip().startswith('- '):
            if current_key:
                current_list.append(line.strip()[2:])
            continue

        if ':' in line:
            if current_key and current_list:
                frontmatter[current_key] = current_list
                current_list = []

            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()

            if value:
                frontmatter[key] = value.strip("'\"")
                current_key = None
                current_list = []
            else:
                current_key = key

    if current_key and current_list:
        frontmatter[current_key] = current_list

    return frontmatter


# def clean_markdown_for_search(content):
#     content = re.sub(r'^---\s*\n[\s\S]*?---\s*\n?', '', content, flags=re.DOTALL)
#     content = re.sub(r'```[\s\S]*?```', ' ', content)
#     content = re.sub(r'`[^`]+`', ' ', content)
#     content = re.sub(r'!\[.*?\]\(.*?\)', ' ', content)
#     content = re.sub(r'\[([^\]]+)\]\(.*?\)', r'\1', content)
#     content = re.sub(r'^[#>*+-]+\s*', '', content, flags=re.MULTILINE)
#     content = re.sub(r'^---\s*$', '', content, flags=re.MULTILINE)
#     content = re.sub(r'(\*\*|\*|__|_|~~)', '', content)
#     content = re.sub(r'\s+', ' ', content)
#     return content.strip()

# def clean_markdown_for_search(content):
#     """
#     마크다운 텍스트를 검색 인덱싱에 적합한 순수 텍스트로 정제합니다.
#     - 1단계: Frontmatter 등 검색에 불필요한 섹션을 완전히 제거합니다.
#     - 2단계: 코드, 이미지, 링크 등에서 문법(syntax)은 제거하되, 내용(content)은 보존합니다.
#     - 3단계: 헤더, 목록, 강조 등 순수한 텍스트 서식을 제거합니다.
#     - 4단계: 공백을 정규화하여 마무리합니다.
#     """
#     # 1단계: 버릴 것들을 먼저 확실하게 제거하기 (Unambiguous Removal)
#     # Frontmatter 제거
#     content = re.sub(r'^---\s*\n[\s\S]*?---\s*\n?', '', content, flags=re.DOTALL)

#     # 2단계: 내용(Content)은 살리되, 문법(Syntax)만 제거하기
#     # (TO-BE) 코드 블록: 내용물은 남기고, ``` 구문만 제거
#     # ```python, ``` 등 코드 블록의 시작과 끝 라인을 제거합니다.
#     content = re.sub(r'^```[a-zA-Z0-9-]*\s*$', '', content, flags=re.MULTILINE)

#     # (TO-BE) 인라인 코드: 내용물은 남기고, ` 구문만 제거 (캡처 그룹 \1 사용)
#     # `code` -> code
#     content = re.sub(r'`([^`]+)`', r'\1', content)

#     # (TO-BE) 이미지: 대체 텍스트(alt text)는 남기고, 나머지 구문 제거 (캡처 그룹 \1 사용)
#     # ![alt text](url) -> alt text
#     content = re.sub(r'!\[([^\]]*)\]\(.*?\)', r'\1', content)

#     # (유지) 링크: 링크 텍스트는 남기고, 나머지 구문 제거 (캡처 그룹 \1 사용)
#     # [link text](url) -> link text
#     content = re.sub(r'\[([^\]]+)\]\(.*?\)', r'\1', content)

#     # 3단계: 순수 텍스트 서식 제거하기 (Formatting Cleanup)
#     # 헤더, 목록, 인용 기호 제거
#     content = re.sub(r'^[#>*+-]+\s*', '', content, flags=re.MULTILINE)

#     # 수평선 제거 (---, *** 등)
#     content = re.sub(r'^\s*[-*_]{3,}\s*$', '', content, flags=re.MULTILINE)

#     # 강조(볼드, 이탤릭), 취소선 등 인라인 서식 기호 제거
#     content = re.sub(r'(\*\*|\*|__|_|~~)', '', content)

#     # 4단계: 최종 정제 (Final Polishing)
#     # 여러 공백/개행을 하나의 공백으로 통합하고, 앞뒤 공백 제거
#     content = re.sub(r'\s+', ' ', content)
#     return content.strip()

def clean_markdown_for_search(content: str) -> str:
    """
    마크다운 텍스트를 검색 인덱싱에 최적화된 순수 텍스트로 정제합니다.
    '보호-처리-복원' 전략을 사용하여 코드(`...` 및 ```...```, ~~~...~~~)를 안전하게 격리하고,
    나머지 마크다운 문법만 제거하여 의미 있는 콘텐츠만 남깁니다.
    플레이스홀더를 마크다운 문법에 영향을 받지 않는 문자열로 변경하여 안정성을 높였습니다.
    테이블 구분선 제거를 추가하고, 코드 블록 패턴을 더 유연하게 수정했습니다.
    """
    if not content:
        return ""

    protected_fragments = []

    def protect_fragment(match):
        fragment = match.group(0)
        placeholder = f"PROTECTEDFRAGMENT{len(protected_fragments)}END"
        protected_fragments.append(fragment)
        return placeholder

    # 1단계: 코드 보호 — 인라인 코드와 코드 블록을 플레이스홀더로 대체
    # 먼저 ~~~ 코드 블록 처리
    content = re.sub(r'^\s*~~~[a-zA-Z0-9+-]*\s*\n[\s\S]*?^\s*~~~', protect_fragment, content, flags=re.MULTILINE)
    # 다음 ``` 코드 블록 처리 (멀티라인, 언어 식별자 포함 가능, 공백 허용)
    content = re.sub(r'^\s*```[a-zA-Z0-9+-]*\s*\n[\s\S]*?^\s*```', protect_fragment, content, flags=re.MULTILINE)
    # 인라인 코드: 단순 처리 (`code`)
    content = re.sub(r'`[^`]+?`', protect_fragment, content)

    # 2단계: 마크다운 문법 제거 (코드는 이미 보호됨)

    # Frontmatter (YAML) 제거 — 정확히 문서 시작에만 허용
    content = re.sub(r'^---\s*\n(?:.*\n)*?---\s*\n?', '', content, count=1, flags=re.MULTILINE)

    # 이미지: ![alt](url) → alt (alt가 비어 있으면 제거)
    content = re.sub(r'!\[([^\]]*?)\]\([^)]*?\)', lambda m: m.group(1) if m.group(1).strip() else '', content)

    # 링크: [text](url) → text
    content = re.sub(r'\[([^\]]+?)\]\([^)]*?\)', r'\1', content)

    # 헤더, 리스트, 인용문, 태스크 리스트 등 라인 시작 문법 제거
    content = re.sub(r'^\s*([#>*+-]|\d+\.)\s+', '', content, flags=re.MULTILINE)

    # 테이블: 파이프(|)를 공백으로 대체 → 셀 내용은 유지
    content = content.replace('|', ' ')

    # 테이블 구분선 제거 (--- 또는 :--: 등)
    content = re.sub(r'^\s*[-:=]+(?:\s*[-:=]+)*\s*$', '', content, flags=re.MULTILINE)

    # 볼드/이탤릭/취소선 — 단어 경계를 고려하여 손상 방지
    # __bold__ 또는 **bold**
    content = re.sub(r'(\*\*|__)(.+?)\1', r'\2', content)
    # _italic_ — 단어 경계 확인 (my_var는 건드리지 않음)
    content = re.sub(r'\b_([^_]+?)_\b', r'\1', content)
    # *italic* — 단어 경계 없이도 안전하게
    content = re.sub(r'\*([^*]+?)\*', r'\1', content)
    # ~~strikethrough~~
    content = re.sub(r'~~([^~]+?)~~', r'\1', content)

    # 수평선 제거
    content = re.sub(r'^\s*[-*_]{3,}\s*$', '', content, flags=re.MULTILINE)

    # HTML 태그 제거
    content = re.sub(r'<[^>]+>', '', content)

    # 3단계: 보호된 코드 조각 복원 — 코드 문법 제거, 내용만 추출
    for i, fragment in enumerate(protected_fragments):
        cleaned = fragment
        # 코드 블록: ```lang\n...\n``` 또는 ~~~lang\n...\n~~~ → ...
        if fragment.lstrip().startswith(('```', '~~~')):
            # 공백과 펜스 제거
            lines = fragment.split('\n')
            if len(lines) >= 2:
                # 첫 줄: ```lang 또는 ~~~lang → 제거
                # 마지막 줄: ``` 또는 ~~~ → 제거
                inner = '\n'.join(lines[1:-1]).strip()
                cleaned = inner
            else:
                cleaned = ''
        elif fragment.startswith('`') and fragment.endswith('`'):
            # 인라인 코드: `code` → code
            cleaned = fragment[1:-1]
        # 플레이스홀더 교체
        placeholder = f"PROTECTEDFRAGMENT{i}END"
        content = content.replace(placeholder, " " + cleaned + " ")

    # 4단계: 최종 정제
    # 연속된 공백/탭/개행 → 단일 공백
    content = re.sub(r'\s+', ' ', content)
    return content.strip()

    # 3단계: 보호된 코드 조각 복원 — 코드 문법 제거, 내용만 추출
    for i, fragment in enumerate(protected_fragments):
        cleaned = fragment
        # 코드 블록: ```lang\n...\n``` → ...
        if fragment.startswith('```'):
            # 언어 식별자와 백틱 제거
            lines = fragment.split('\n')
            if len(lines) >= 2:
                # 첫 줄: ```lang → 제거
                # 마지막 줄: ``` → 제거
                inner = '\n'.join(lines[1:-1])
                cleaned = inner
            else:
                cleaned = ''  # 잘못된 코드 블록
        elif fragment.startswith('`') and fragment.endswith('`'):
            # 인라인 코드: `code` → code
            cleaned = fragment[1:-1]
        # 코드 내부의 불필요한 공백은 유지 (검색 시 의미 있을 수 있음)
        placeholder = f"__PROTECTED_FRAGMENT_{i}__"
        content = content.replace(placeholder, " " + cleaned + " ")

    # 4단계: 최종 정제
    # 연속된 공백/탭/개행 → 단일 공백
    content = re.sub(r'\s+', ' ', content)
    return content.strip()

def should_exclude(path_obj, root_path, exclude_patterns):
    """주어진 경로가 제외 대상인지 확인 (fnmatch 기반, 프로젝트 루트 기준)"""
    # 프로젝트 루트 기준 상대 경로 계산
    rel_path_from_project = str(path_obj.relative_to(PROJECT_ROOT))
    for pattern in exclude_patterns:
        # 패턴이 '/'로 끝나면 디렉터리 패턴이므로 하위 모든 파일도 매칭되도록 처리
        if pattern.endswith('/'):
            dir_pattern = pattern.rstrip('/')
            if rel_path_from_project.startswith(dir_pattern + '/') or rel_path_from_project == dir_pattern:
                return True
        # 일반 패턴 매칭
        if fnmatch.fnmatch(rel_path_from_project, pattern) or fnmatch.fnmatch('/' + rel_path_from_project, pattern):
            return True
    return False


# ==============================
# 🧠 메인 로직
# ==============================

def build_search_index(output_dir, additional_excludes=None):
    root_path = CONTENT_DIR.resolve()
    output_path = Path(output_dir).resolve()
    output_path.mkdir(parents=True, exist_ok=True)

    hugo_ignore_patterns = parse_hugo_toml_ignore_files(HUGO_CONFIG_PATH)
    exclude_patterns = set(hugo_ignore_patterns + ADDITIONAL_EXCLUDE_PATTERNS)
    if additional_excludes:
        exclude_patterns.update(additional_excludes)

    print(f"📁 Scanning content in: {root_path}")
    print(f"🚫 Ignoring patterns: {sorted(exclude_patterns)}")
    print(f"✅ Only including files with extensions: {sorted(INCLUDE_EXTENSIONS)}")

    all_file_data = []
    for dirpath, dirnames, filenames in os.walk(root_path, topdown=True):
        dirnames[:] = [d for d in dirnames if not should_exclude(Path(dirpath) / d, root_path, exclude_patterns) and not d.startswith('.')]
        for filename in sorted(filenames):
            if filename.startswith('.') or not any(filename.lower().endswith(ext) for ext in INCLUDE_EXTENSIONS):
                continue

            file_path = Path(dirpath) / filename
            if should_exclude(file_path, root_path, exclude_patterns):
                continue

            relative_path_str = str(file_path.relative_to(root_path))
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                if not content.strip(): continue

                frontmatter = extract_frontmatter(content)
                cleaned_content = clean_markdown_for_search(content)
                filename_stem = file_path.stem
                pretty_url = generate_pretty_url(relative_path_str)

                all_file_data.append({
                    "key": filename_stem, "path": pretty_url, "filename": filename_stem,
                    "frontmatter": frontmatter, "content": cleaned_content,
                })
            except Exception as e:
                print(f"❌ Error processing {file_path}: {e}")

    files = {data['key']: {"path": data['path'], "filename": data['filename'], "content": data['content'], "frontmatter": data['frontmatter']} for data in all_file_data}
    search_index = {"generated_at": datetime.now().isoformat(), "files": files}

    # ✨ 변경점: 기존 파일과 비교하여 변경되었는지 확인하는 로직 시작
    output_file = output_path / "search_index.json"
    is_changed = True # 기본적으로 변경되었다고 가정

    if output_file.is_file():
        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                existing_index = json.load(f)
            # 'files' 객체만 비교하여 실제 콘텐츠 변경 여부 확인
            if existing_index.get('files') == search_index['files']:
                is_changed = False
        except (json.JSONDecodeError, IOError) as e:
            print(f"⚠️ Warning: Could not read or parse existing {output_file}. Regenerating. Error: {e}")
            is_changed = True # 파일 읽기 실패 시, 변경된 것으로 간주

    if is_changed:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(search_index, f, ensure_ascii=False, indent=2)
        print(f"✅ Content changed. Saved search_index.json ({len(files)} files)")

        version_string = datetime.now().strftime("%Y%m%d%H%M%S")
        with open(output_path / "version.json", 'w', encoding='utf-8') as f:
            json.dump({"version": version_string}, f, ensure_ascii=False, indent=2)
        print(f"✅ Updated version.json (version: {version_string})")
    else:
        print(f"✅ No content changes detected. Skipping file updates.")


# ==============================
# 🚀 실행
# ==============================

def main():
    parser = argparse.ArgumentParser(description="Generate search_index.json using hugo.toml ignore rules")
    parser.add_argument('--output-dir', '-o', default=str(DEFAULT_OUTPUT_DIR),
                        help=f'Output directory (default: {DEFAULT_OUTPUT_DIR})')
    parser.add_argument('--exclude', '-e', nargs='*',
                        help='Additional glob patterns to exclude (e.g., "drafts/*")')
    args = parser.parse_args()

    build_search_index(args.output_dir, args.exclude)


if __name__ == "__main__":
    main()