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
        part = re.sub(r'[^\w\-@.+]', '', part, flags=re.UNICODE)  # 허용되지 않는 문자 제거 (+ 추가)
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

def clean_markdown_for_search(content: str) -> str:
    """
    마크다운 텍스트를 검색 인덱싱에 최적화된 순수 텍스트로 정제합니다.
    '보호-처리-복원' 전략을 사용하여 코드(`...` 및 ```...```, ~~~...~~~)를 안전하게 격리하고,
    나머지 마크다운 문법만 제거하여 의미 있는 콘텐츠만 남깁니다.
    """
    if not content:
        return ""

    protected_fragments = []

    def protect_fragment(match):
        fragment = match.group(0)
        # Use unprintable control characters for robust placeholders
        placeholder = f"\x02PROTECTED{len(protected_fragments)}\x03"
        protected_fragments.append(fragment)
        return placeholder

    # 1단계: 코드 블록 및 인라인 코드 보호
    content = re.sub(r'^\s*(?:> ?)*```[\s\S]+?^\s*(?:> ?)*```\s*$', protect_fragment, content, flags=re.MULTILINE)
    content = re.sub(r'^\s*(?:> ?)*~~~[\s\S]+?^\s*(?:> ?)*~~~\s*$', protect_fragment, content, flags=re.MULTILINE)
    content = re.sub(r'`[^`]+?`', protect_fragment, content)

    # 2단계: Frontmatter 제거
    content = re.sub(r'\A---[\s\S]+?^---\s*', '', content, flags=re.MULTILINE)

    # 3단계: HTML 태그 제거
    content = re.sub(r'<[^>]+>', '', content)

    # 4단계: 테이블 관련 문법 제거
    content = re.sub(r'^\s*\|?[-|: \t]+-[-|: \t]*\|?\s*$', '', content, flags=re.MULTILINE)
    content = content.replace('|', ' ')

    # 5단계: 이미지 및 링크 제거
    content = re.sub(r'!\[([^\]]*)\]\([^\)]*\)', r'\1', content) # 이미지
    content = re.sub(r'\[([^\]]+)\]\([^\)]*\)', r'\1', content) # 링크

    # 6단계: 헤더, 리스트, 인용문 등 라인 시작 문법을 반복적으로 제거
    lines = content.split('\n')
    cleaned_lines = []
    for line in lines:
        while True:
            new_line = re.sub(r'^\s*([#>*+-]|\d+\.)\s*', '', line)
            if new_line == line:
                break
            line = new_line
        cleaned_lines.append(line)
    content = '\n'.join(cleaned_lines)

    # 7단계: 나머지 마크다운 문법 제거
    content = re.sub(r'(\*\*|__)(.*?)\1', r'\2', content) # Bold
    content = re.sub(r'(\*|_)(.*?)\1', r'\2', content) # Italic
    content = re.sub(r'~~(.*?)~~', r'\1', content) # Strikethrough
    content = re.sub(r'^\[\^([^\]]+)\]:.*', '', content) # Footnote definition
    content = re.sub(r'\[\^([^\]]+)\]', '', content) # Footnote reference
    content = re.sub(r'^\s*[-*_]{3,}\s*$', '', content, flags=re.MULTILINE) # Horizontal rules

    # 8단계: 보호된 코드 조각 복원 및 정제
    for i, fragment in enumerate(protected_fragments):
        placeholder = f"\x02PROTECTED{i}\x03"
        cleaned_fragment = fragment

        if '\n' in fragment: # 블록 코드로 간주
            lines = fragment.strip().split('\n')
            lines = lines[1:-1] # 펜스 제거
            lines = [re.sub(r'^\s*(?:> ?)*', '', l) for l in lines] # '>' 제거
            cleaned_fragment = '\n'.join(lines)
        else: # 인라인 코드로 간주
            cleaned_fragment = fragment.strip('`')
        
        content = content.replace(placeholder, " " + cleaned_fragment + " ")

    # 9단계: 최종 정제
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