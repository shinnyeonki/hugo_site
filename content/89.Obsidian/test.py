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