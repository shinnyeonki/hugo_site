import os
from pathlib import Path

# ==============================================================================
# 전역 설정 (Global Configuration)
# 이 부분의 변수들을 수정하여 스크립트의 동작을 쉽게 변경할 수 있습니다.
# ==============================================================================

# Hugo 콘텐츠 디렉터리의 이름입니다.
CONTENT_DIR_NAME = "content"

# 섹션 인덱스 파일의 이름입니다. Hugo는 이 파일을 기준으로 섹션을 인식합니다.
INDEX_FILENAME = "_index.md"


def main():
    """
    Hugo 콘텐츠 디렉터리를 순회하며 모든 하위 디렉터리가 섹션이 되도록
    _index.md 파일을 생성합니다.
    """
    try:
        # 1. 경로 계산: 터미널의 현재 위치(CWD)에 영향을 받지 않는 절대 경로 사용
        # __file__ 은 이 스크립트 파일 자체의 경로를 나타냅니다.
        script_path = Path(__file__).resolve()
        # 이 스크립트는 'pretask' 폴더 안에 있으므로, 프로젝트 루트는 두 단계 위입니다.
        project_root = script_path.parent.parent
        content_dir = project_root / CONTENT_DIR_NAME

        print("=" * 50)
        print(f"Hugo 프로젝트 루트: {project_root}")
        print(f"대상 콘텐츠 디렉터리: {content_dir}")
        print("=" * 50)
        print("모든 디렉터리를 섹션으로 변환하는 작업을 시작합니다...")

        # 2. 콘텐츠 디렉터리 존재 여부 확인
        if not content_dir.is_dir():
            print(f"오류: '{content_dir}' 디렉터리를 찾을 수 없습니다.")
            print("스크립트가 Hugo 프로젝트의 'pretask' 폴더 내에 있는지 확인하세요.")
            return

        # 3. 모든 하위 디렉터리 순회
        # os.walk를 사용하면 현재 디렉터리부터 모든 하위 디렉터리까지 순회할 수 있습니다.
        for dirpath, _, _ in os.walk(content_dir):
            current_dir = Path(dirpath)
            index_file_path = current_dir / INDEX_FILENAME

            # 4. _index.md 파일 존재 여부 확인 및 생성
            if not index_file_path.exists():
                # 디렉터리 이름을 기반으로 제목 자동 생성
                dir_name = current_dir.name
                # 하이픈(-)과 언더스코어(_)를 공백으로 바꾸고, 각 단어의 첫 글자를 대문자로 만듭니다.
                # title = dir_name.replace("-", " ").replace("_", " ").title()
                title = dir_name.title()

                # 파일에 쓸 프론트매터 내용
                content = f"---\ntitle: {title}\n---\n"
                # UTF-8 인코딩으로 파일 생성 및 쓰기
                index_file_path.write_text(content, encoding='utf-8')
                print(f"  [생성] {index_file_path}")

        print("\n작업 완료! 모든 디렉터리에 _index.md 파일이 존재합니다.")

    except Exception as e:
        print(f"\n스크립트 실행 중 오류가 발생했습니다: {e}")


if __name__ == "__main__":
    main()