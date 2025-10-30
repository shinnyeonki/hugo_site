## hugo 빌드전 전처리 (Preprocessing)
Hugo가 마크다운 파일을 HTML로 변환하기 전에 실행되는 전처리 단계입니다. 이 단계의 목적은 다음과 같습니다: obsidian 에서 적은 순수한 마크다운파일을 hugo 에서 잘 처리할 수 있도록 하는 것을 목표로 합니다.

크게 2가지로 분류됩니다. 기존 문서의 fontmatter 보강, 원하는 요구사항을 반영하기 위해 hugo 가 원하는 파일을 생성

두 가지 작업은 우선순위가 있으며 기존 파일들의 frontmatter 보강 즉 올바른 hugo 로의 전환 작업이 우선이며 그 다음으로 hugo 가 원하는 파일 구조를 맞추기 위한 작업이 수행됩니다.

### 1. frontmatter 보강

1. title: hugo 에서 필요로 하는 frontmatter 필드 title 필드를 추가합니다. obsidian 에서는 title 을 명시하지 않고 파일명으로 처리하지만 hugo 에서는 title 필드가 필요합니다. 이 타이틀이 hugo 에서 페이지의 제목으로 사용됩니다.
2. resource-path: 추후 확장할 기능은 순수 markdown 파일을 받을 수 있는 즉 빌드전 원래의 경로를 기억하는 용도로 사용됩니다. 현재는 사용되지 않지만 추후 받기 기능을 위해 추가됩니다.
3. aliases: obsidian 에서는 추가적으로 검색할 수 있는 용도로 사용됩니다 [aliases 포럼 설명](https://forum.obsidian.md/t/how-do-aliases-in-front-matter-work/8852) 즉 동일한 페이지에 대해 여러 개의 별칭을 지정할 수 있습니다. hugo 에서는 obsidian 에서도 사용하는 기능인 검색시 동일한 이름처럼 보여줄주 있는 기능 뿐 아니라 seo 최적화를 위해 meta 태그의 keywords 로도 사용됩니다.


### 2. 요구 동작을 반영하기 위한 hugo 용 파일 생성

원하는 동작은 다음과 같습니다.
1. 모든 폴더를 섹션화 합니다
2. hugo 사이트에서 사용할 전용 페이지 (사이트 소개, 개인정보 보호 정책 페이지, 등)을 생성합니다. 단순한 마크다운 파일을 만들고 적절한 template 을 연결할 수 있도록 합니다 일종의 본드 역할 입니다
3. 향후 추가될 search 기능, graph 기능등 index싱 처리를 위한 data 파일 생성용 dummy 파일 입니다 실제 사용자에게는 보이지 않습니다(headless 등으로 처리) index를 만들기 위한 페이지를 생성합니다 이를 통해 data 를 생성할 수 있습니다


- 모든 폴더의 섹션화를 위해 모든 폴더 하위에 _index.md 파일을 추가합니다. (hugo 에서는 폴더를 섹션으로 인식하기 위해 _index.md 파일이 필요합니다)
- 전용 페이지 생성을 위해 지정된 폴더에 마크다운 파일을 추가합니다. 내부에는 frontmatter 에 type: section과 연관된 속성, layout: 원하는 템플릿 이름 을 지정하여 해당 layout 에서 올바르게 렌더링 되도록 합니다.
- index 싱 처리를 위한 dummy 파일을 추가합니다.