### 전제
2가지의 프로젝트가 존재함
1. obsidian 볼트
2. obsidian 볼트 전체를 hugo로 빌드해서 정적 사이트를 만들수 있는 프로젝트


### 워크플로우 트리거

이 과정은 Obsidian 볼트 저장소의 `master` 브랜치에 `push`가 발생하거나, 수동으로 `workflow_dispatch`를 통해 트리거될 수 있습니다. 즉 obsidian 폴더 저장소에서 이러한 일이 발생합니다

### 주요 단계

1. **Obsidian 볼트 체크아웃**: GitHub Actions 워크플로우는 먼저 Obsidian 볼트 저장소를 `obsidian-vault`라는 디렉터리에 체크아웃합니다.

2. **Hugo 사이트 복제**: 이후 Hugo 사이트의 구조, 테마, 설정 파일이 포함된 별도의 저장소를 `hugo-site` 디렉터리에 클론합니다.

3. **콘텐츠 복사**: `obsidian-vault` 디렉터리의 모든 콘텐츠를 `hugo-site/content/` 디렉터리로 복사하여, Hugo가 렌더링할 수 있도록 합니다.

4. **전처리(Preprocessing)**: `hugo-site`에서 `pretask.sh`라는 셸 스크립트를 실행합니다. 이 스크립트는 Hugo 빌드 전에 콘텐츠에 필요한 전처리 작업을 수행합니다.

5. **Hugo 빌드**: 워크플로우는 최신 버전의 Hugo(Extended)를 설정하고 사이트를 빌드합니다. 출력 파일의 크기를 줄이기 위해 `--minify` 플래그를 사용하며, GitHub Pages 배포를 위해 `baseURL`을 설정합니다.

6. **GitHub Pages에 배포**: 마지막으로, 빌드된 사이트(`hugo-site/public` 디렉터리)를 GitHub Pages 아티팩트로 업로드하고 배포합니다.
