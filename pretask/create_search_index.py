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
    """파일 경로를 Hugo의 Pretty URL 형식으로 변환"""
    p = Path(relative_path_str)
    slug = p.stem.lower()
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'[^\w\-@]', '', slug, flags=re.UNICODE)
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    url_path = p.parent / slug
    return f"/{url_path.as_posix().strip('./')}/"


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


def clean_markdown_for_search(content):
    content = re.sub(r'^---\s*\n[\s\S]*?---\s*\n?', '', content, flags=re.DOTALL)
    content = re.sub(r'```[\s\S]*?```', ' ', content)
    content = re.sub(r'`[^`]+`', ' ', content)
    content = re.sub(r'!\[.*?\]\(.*?\)', ' ', content)
    content = re.sub(r'\[([^\]]+)\]\(.*?\)', r'\1', content)
    content = re.sub(r'^[#>*+-]+\s*', '', content, flags=re.MULTILINE)
    content = re.sub(r'^---\s*$', '', content, flags=re.MULTILINE)
    content = re.sub(r'(\*\*|\*|__|_|~~)', '', content)
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