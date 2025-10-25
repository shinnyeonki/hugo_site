import os
from pathlib import Path

# ==============================================================================
# 전역 설정 (Global Configuration)
# 이 부분의 변수들을 수정하여 스크립트의 동작을 쉽게 변경할 수 있습니다.
# ==============================================================================

# ------------------------------------------------------------------------------
# [ 중요 ] Hugo 프로젝트의 루트 디렉터리 경로를 지정하세요.
# ------------------------------------------------------------------------------
# 이 경로는 스크립트 파일의 위치를 기준으로 한 상대 경로입니다.
# 이 방식은 터미널을 어느 위치에서 열고 실행하든 항상 동일하게 동작하여 안정적입니다.
#
# 예시: 스크립트가 'my-project/scripts/pretask' 폴더에 있다고 가정해 봅시다.
#   - "." 는 현재 폴더인 'pretask'를 가리킵니다.
#   - ".." 는 한 단계 위인 'scripts' 폴더를 가리킵니다.
#   - "../.." 는 두 단계 위인 'my-project' (프로젝트 루트)를 가리킵니다.
#
# 따라서, 이 스크립트의 기본 위치를 'pretask'와 같은 하위 폴더로 가정하고
# 프로젝트 루트를 가리키도록 기본값을 "../.."로 설정합니다.
#
PROJECT_ROOT = ".."

# Hugo 콘텐츠 디렉터리의 이름입니다.
CONTENT_DIR_NAME = "content"

# 섹션 인덱스 파일의 이름입니다. Hugo는 이 파일을 기준으로 섹션을 인식합니다.
INDEX_FILENAME = "_index.md"


def main():
    """
    Hugo 콘텐츠 디렉터리를 순회하며 모든 하위 디렉터리가 섹션이 되도록
    _index.md 파일을 생성하거나 필요한 경우 업데이트합니다.
    """
    try:
        # 1. 경로 계산: 이 스크립트 파일의 위치를 기준으로 절대 경로를 계산합니다.
        script_path = Path(__file__).resolve()
        script_dir = script_path.parent
        project_root_abs = (script_dir / PROJECT_ROOT).resolve()
        content_dir = project_root_abs / CONTENT_DIR_NAME

        print("=" * 50)
        print(f"스크립트 파일 위치: {script_dir}")
        print(f"설정된 프로젝트 상대 경로: '{PROJECT_ROOT}'")
        print(f"계산된 절대 프로젝트 루트: {project_root_abs}")
        print(f"대상 콘텐츠 디렉터리: {content_dir}")
        print("=" * 50)
        print("모든 디렉터리를 섹션으로 변환하는 작업을 시작합니다...")

        # 2. 콘텐츠 디렉터리 존재 여부 확인
        if not content_dir.is_dir():
            print(f"\n오류: '{content_dir}' 디렉터리를 찾을 수 없습니다.")
            print(f"스크립트 상단의 'PROJECT_ROOT' 변수('{PROJECT_ROOT}')가")
            print("스크립트 파일 위치 기준으로 올바르게 설정되었는지 확인하세요.")
            return

        # 3. 모든 하위 디렉터리 순회
        for dirpath, _, _ in os.walk(content_dir):
            current_dir = Path(dirpath)
            index_file_path = current_dir / INDEX_FILENAME

            # 4. _index.md 파일에 쓸 새로운 내용 생성
            dir_name = current_dir.name
            title = dir_name.title()
            new_content = f"---\ntitle: {title} \n---\n"

            # 5. _index.md 파일 존재 여부 확인 및 처리
            if index_file_path.exists():
                existing_content = index_file_path.read_text(encoding='utf-8')
                if existing_content != new_content:
                    index_file_path.write_text(new_content, encoding='utf-8')
                    print(f"  [갱신] {index_file_path}")
            else:
                index_file_path.write_text(new_content, encoding='utf-8')
                print(f"  [생성] {index_file_path}")

        print("\n작업 완료! 모든 디렉터리에 최신 _index.md 파일이 준비되었습니다.")

    except Exception as e:
        print(f"\n스크립트 실행 중 오류가 발생했습니다: {e}")


if __name__ == "__main__":
    main()