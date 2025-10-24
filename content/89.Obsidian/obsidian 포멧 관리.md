---
title: obsidian 포멧 관리
date: 2025-06-27T19:49:36+09:00
lastmod: 2025-06-27T19:49:46+09:00
resource-path: 89.Obsidian/obsidian 포멧 관리.md
aliases: 
tags:
  - obsidian
---
좋습니다!  
지금까지 만든 `process_text` 함수를 사용해서 **특정 폴더 아래의 모든 `.md` 파일을 검사하고**,  
내용을 자동으로 수정하는 Python 스크립트를 만들어 드릴게요.

---

## 📁 요구사항 요약

- 특정 폴더 내부의 모든 `.md` 파일 열기
- 각 파일 내용에서 다음 조건 처리:
  - `created: YYYY-MM-DDTHH:MM` 형식이면
  - 초(`:00`)와 타임존(`+09:00`) 추가
  - 그 바로 다음 줄에 `modified:`가 없다면 추가
- 수정된 내용은 원본 파일에 **덮어쓰기**

---

## ✅ Python 전체 스크립트

```python
import os
import re
from datetime import datetime

def process_text(text):
    lines = text.splitlines()
    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        # created: 라인 발견
        match = re.match(r'^(created:\s)(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})$', line)
        if match:
            created_prefix, date_str = match.groups()
            try:
                dt = datetime.strptime(date_str, "%Y-%m-%dT%H:%M")
                iso_date = dt.strftime("%Y-%m-%dT%H:%M:%S+09:00")

                # 다음 줄이 modified:인지 확인
                if i + 1 < len(lines) and lines[i + 1].startswith('modified:'):
                    # 이미 modified 존재 → created만 업데이트
                    new_lines.append(f"{created_prefix}{iso_date}")
                    i += 1
                    continue
                else:
                    # modified: 없음 → 추가
                    new_lines.append(f"{created_prefix}{iso_date}")
                    new_lines.append(f"modified: {iso_date}")
                    i += 1
            except ValueError:
                # 잘못된 날짜 형식 → 그대로 유지
                new_lines.append(line)
                i += 1
        else:
            new_lines.append(line)
            i += 1
    return '\n'.join(new_lines)


def process_md_files_in_folder(folder_path):
    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.endswith(".md"):
                file_path = os.path.join(root, file)
                print(f"Processing: {file_path}")

                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                updated_content = process_text(content)

                if updated_content != content:
                    print(f"  -> 변경 감지됨. 저장 중...")
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(updated_content)
                else:
                    print(f"  -> 변경 없음.")


# 실행 예시
if __name__ == "__main__":
    folder = input("처리할 폴더 경로를 입력하세요: ").strip()
    if os.path.isdir(folder):
        process_md_files_in_folder(folder)
        print("✅ 모든 파일 처리 완료.")
    else:
        print("❌ 유효하지 않은 폴더 경로입니다.")
```

---

## 🧪 사용법

1. 위 코드를 복사해서 `update_metadata.py` 같은 이름으로 저장
2. 터미널/명령 프롬프트에서 실행:

```bash
python update_metadata.py
```

3. 폴더 경로 입력하면, 해당 폴더 안의 모든 `.md` 파일이 자동으로 처리됩니다.
