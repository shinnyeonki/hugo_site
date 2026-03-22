#!/usr/bin/env python3
"""
Graph Index Generator for Hugo Site

Extracts internal and external links to build a graph structure.
Consistent with search_index.json (uses Pretty URL as identifier).
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime
import argparse
import fnmatch
import urllib.parse

# ==============================
# 🔧 전역 설정 (Global Config)
# ==============================

SCRIPT_DIR = Path(__file__).parent.resolve()
PROJECT_ROOT = SCRIPT_DIR.parent.resolve()
HUGO_CONFIG_PATH = PROJECT_ROOT / "hugo.toml"
CONTENT_DIR = PROJECT_ROOT / "content"
DEFAULT_OUTPUT_DIR = PROJECT_ROOT / "static" / "indexing"

INCLUDE_EXTENSIONS = {'.md'}
ADDITIONAL_EXCLUDE_PATTERNS = ['content/08.media']

# ==============================
# 📄 헬퍼 함수
# ==============================

def parse_hugo_toml_ignore_files(toml_path):
    ignore_patterns = []
    if not toml_path.is_file():
        return ignore_patterns
    try:
        with open(toml_path, 'r', encoding='utf-8') as f:
            content = f.read()
        match = re.search(r'^\s*ignoreFiles\s*=\s*\[(.*?)\]', content, re.MULTILINE | re.DOTALL)
        if match:
            list_content = match.group(1)
            entries = re.findall(r'["\']([^"\']+)["\']', list_content)
            ignore_patterns = [entry.strip() for entry in entries if entry.strip()]
    except Exception as e:
        print(f"❌ Error parsing hugo.toml: {e}")
    return ignore_patterns

def generate_pretty_url(relative_path_str):
    """파일 경로를 Hugo의 Pretty URL 형식으로 변환 (search_index.py와 동일)"""
    p = Path(relative_path_str)
    
    def clean_part(part):
        part = part.lower()
        part = re.sub(r'\s+', '-', part)
        part = re.sub(r'[^\w\-@.+]', '', part, flags=re.UNICODE)
        part = re.sub(r'-+', '-', part)
        return part.strip('-')
    
    cleaned_parts = [clean_part(part) for part in p.parts if part]
    if not cleaned_parts:
        return "/"
    
    cleaned_parts[-1] = clean_part(p.stem)
    url_path = "/".join(cleaned_parts).strip('/')
    return f"/{url_path}/" if url_path else "/"

def should_exclude(path_obj, root_path, exclude_patterns):
    rel_path_from_project = str(path_obj.relative_to(PROJECT_ROOT))
    for pattern in exclude_patterns:
        if pattern.endswith('/'):
            dir_pattern = pattern.rstrip('/')
            if rel_path_from_project.startswith(dir_pattern + '/') or rel_path_from_project == dir_pattern:
                return True
        if fnmatch.fnmatch(rel_path_from_project, pattern) or fnmatch.fnmatch('/' + rel_path_from_project, pattern):
            return True
    return False

# ==============================
# 🔗 링크 추출 및 정제 로직
# ==============================

def extract_raw_links(content):
    """본문에서 내부 경로 후보와 외부 URL을 추출합니다."""
    internal_candidates = []
    external_links = set()

    # 1. Markdown links: [text](path/to/file.md)
    for match in re.finditer(r'\[[^\]]+\]\(([^)]+)\)', content):
        href = match.group(1).split('#')[0].strip()
        if not href: continue
        
        if re.match(r'^(https?|ftp|mailto):', href, re.IGNORECASE):
            external_links.add(href)
        else:
            internal_candidates.append(urllib.parse.unquote(href))

    # 2. Wikilinks: [[link]] or [[link|alias]]
    for match in re.finditer(r'\[\[([^\]\]]+)\]\]', content):
        target = match.group(1).split('|')[0].strip()
        if not target: continue

        if re.match(r'^(https?|ftp|mailto):', target, re.IGNORECASE):
            external_links.add(target)
        else:
            internal_candidates.append(urllib.parse.unquote(target))
    
    # 3. Plain URLs
    url_pattern = re.compile(r'(?<![\[\(])\b(https?://[^\s<>"{}|\\^`[\]]+)(?![\]\)])', re.IGNORECASE)
    for match in url_pattern.finditer(content):
        external_links.add(match.group(1))

    return internal_candidates, list(external_links)

# ==============================
# 🧠 메인 로직
# ==============================

def build_graph_index(output_dir):
    root_path = CONTENT_DIR.resolve()
    output_path = Path(output_dir).resolve()
    output_path.mkdir(parents=True, exist_ok=True)

    hugo_ignore_patterns = parse_hugo_toml_ignore_files(HUGO_CONFIG_PATH)
    exclude_patterns = set(hugo_ignore_patterns + ADDITIONAL_EXCLUDE_PATTERNS)

    # 1. 파일 스캔 및 URL 매핑 생성
    valid_urls = set()
    stem_to_url = {}
    file_list = [] # List of (pretty_url, absolute_path)

    for dirpath, dirnames, filenames in os.walk(root_path, topdown=True):
        dirnames[:] = [d for d in dirnames if not should_exclude(Path(dirpath) / d, root_path, exclude_patterns) and not d.startswith('.')]
        for filename in sorted(filenames):
            if filename.startswith('.') or not any(filename.lower().endswith(ext) for ext in INCLUDE_EXTENSIONS):
                continue
            
            file_path = Path(dirpath) / filename
            if should_exclude(file_path, root_path, exclude_patterns):
                continue
            
            rel_path = file_path.relative_to(root_path)
            pretty_url = generate_pretty_url(str(rel_path))
            
            valid_urls.add(pretty_url)
            stem_to_url[file_path.stem] = pretty_url
            file_list.append((pretty_url, file_path))

    # 2. 그래프 데이터 초기화
    nodes = {url: {"inDegree": 0, "outDegree": 0} for url in valid_urls}
    links = []
    external_links_data = []

    # 3. 링크 분석
    for current_url, file_path in file_list:
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            raw_internals, externals = extract_raw_links(content)
            
            unique_targets = set()
            for raw_path in raw_internals:
                # 위키링크([[파일]])나 마크다운 링크에서 파일명(stem) 추출 시도
                link_stem = Path(raw_path).stem
                target_url = stem_to_url.get(link_stem)
                
                if target_url and target_url != current_url:
                    unique_targets.add(target_url)
            
            for target_url in unique_targets:
                links.append({"source": current_url, "target": target_url})
                nodes[current_url]["outDegree"] += 1
                nodes[target_url]["inDegree"] += 1
            
            for url in externals:
                external_links_data.append({"source": current_url, "url": url})

        except Exception as e:
            print(f"❌ Error processing {file_path}: {e}")

    # 4. 결과 조립
    graph_index = {
        "generated_at": datetime.now().isoformat(),
        "nodes": nodes,
        "links": links,
        "externalLinks": external_links_data
    }

    # 5. 변경 감지 및 저장
    output_file = output_path / "graph_index.json"
    is_changed = True

    if output_file.is_file():
        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                existing = json.load(f)
            if (existing.get('nodes') == graph_index['nodes'] and 
                existing.get('links') == graph_index['links'] and 
                existing.get('externalLinks') == graph_index['externalLinks']):
                is_changed = False
        except:
            is_changed = True

    if is_changed:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(graph_index, f, ensure_ascii=False, indent=2)
        print(f"✅ Graph index updated with Pretty URLs. ({len(valid_urls)} nodes, {len(links)} links)")
        
        version_string = datetime.now().strftime("%Y%m%d%H%M%S")
        with open(output_path / "version.json", 'w', encoding='utf-8') as f:
            json.dump({"version": version_string}, f, ensure_ascii=False, indent=2)
    else:
        print("✅ No graph changes detected. Skipping file updates.")

if __name__ == "__main__":
    build_graph_index(DEFAULT_OUTPUT_DIR)
