1. 파이썬 스크립트 분리 독립적으로 동작하도록 단 실행순서 무관하게 동작하게 한다
1. about, privacy 등등의 파일은 hugo_site 폴더에서 만들어서 관리한다. /contents/hugo_site/ 내부에 파일을 만들고 여기서 렌더한다 이 폴더는 섹션이 아니다
2. 좌측 사이드바의 내용을 미리 




Hugo 빌드 시점에 모든 내용을 HTML에 포함하면 초기 로딩이 느려질 수 있으므로, 왼쪽 네비게이션의 내용을 JSON으로 만들어 JavaScript로 동적으로 로드하는 것은
좋은 접근 방식입니다.

Hugo는 자체 기능만으로 사이트의 콘텐츠나 데이터를 JSON 파일로 만들 수 있는 강력한 기능을 제공합니다. 파이썬 스크립트를 별도로 실행할 필요가 없습니다.

이 방식의 가장 큰 장점은 Hugo가 콘텐츠를 빌드할 때마다 JSON 파일도 자동으로 최신 상태로 업데이트된다는 점입니다.

아래에 코드를 수정하지 않고, Hugo에서 JSON을 생성하는 방법을 단계별로 설명해 드리겠습니다.

Hugo에서 데이터 JSON 파일 생성하는 방법

1단계: hugo.toml에 JSON 출력 포맷 정의하기

먼저 hugo.toml 파일에 JSON이라는 이름의 새로운 출력 포맷을 정의해야 합니다. Hugo는 이미 application/json 미디어 타입을 알고 있으므로, 간단하게 추가할 수 있습니다.

1 # hugo.toml 파일에 아래 내용을 추가하거나 기존 outputFormats 섹션에 병합하세요.
2 [outputFormats]
3   [outputFormats.json]
4     mediaType = "application/json"
5     baseName = "index" # 파일 이름을 index.json으로 설정
6     isPlainText = false
7     notAlternative = true

2단계: JSON 데이터를 제공할 헤드리스(Headless) 페이지 생성하기

이제 이 JSON 데이터를 출력할 전용 페이지를 만듭니다. 이 페이지는 실제 웹사이트에는 표시되지 않고 데이터만 제공하는 역할을 하므로 "헤드리스" 페이지로 설정하는 것이 좋습니다.

content/ 디렉터리에 nav-data.md 같은 파일을 하나 생성하고 아래 내용을 입력하세요.

파일 경로: /Users/shinnk/Documents/hugo/hugo_site/content/nav-data.md
내용:
   1 ---
   2 title: "Navigation Data"
   3 headless: true
   4 outputs:
   5   - "json"
   6 ---
   * headless: true: 이 페이지가 실제 렌더링되어 사이트맵이나 목록에 나타나지 않도록 합니다.
   * outputs: ["json"]: 이 페이지의 출력물로 오직 json 포맷만 생성하도록 지정합니다.

3단계: JSON 생성을 위한 템플릿 만들기

  다음으로, 위에서 만든 헤드리스 페이지가 json 포맷으로 출력될 때 사용할 템플릿을 만들어야 합니다.

  파일 경로: /Users/shinnk/Documents/hugo/hugo_site/layouts/_default/single.json.json
  내용:

  `go-template
  {{- $data := dict -}}

  {{- / 1. 모든 페이지 정보 (파일 트리용) / -}}
  {{- $pages := slice -}}
  {{- range where .Site.Pages "Kind" "page" -}}
    {{- $pages = $pages | append (dict
        "title" .Title
        "permalink" .Permalink
        "path" .Path
        "section" .Section
      )
    -}}
  {{- end -}}
  {{- $data = merge $data (dict "pages" $pages) -}}

  {{- / 2. 모든 태그 정보 (태그 트리용) / -}}
  {{- $tags := dict -}}
  {{- range $name, $taxonomy := .Site.Taxonomies.tags -}}
    {{- $pagesForTag := slice -}}
    {{- range $taxonomy.Pages -}}
      {{- $pagesForTag = $pagesForTag | append (dict "title" .Title "permalink" .Permalink) -}}
    {{- end -}}
    {{- $tags = merge $tags (dict $name $pagesForTag) -}}
  {{- end -}}
  {{- $data = merge $data (dict "tags" $tags) -}}

  {{- / 3. 최근 수정된 문서 10개 / -}}
  {{- $recentModified := slice -}}
  {{- range first 10 (.Site.RegularPages.ByLastmod.Reverse) -}}
    {{- $recentModified = $recentModified | append (dict
        "title" .Title
        "permalink" .Permalink
        "lastmod" (.Lastmod.Format "2006-01-02")
      )
    -}}
  {{- end -}}
  {{- $data = merge $data (dict "recentModified" $recentModified) -}}

  {{- / 4. 최근 생성된 문서 10개 / -}}
  {{- $recentCreated := slice -}}
  {{- range first 10 (.Site.RegularPages.ByDate.Reverse) -}}
    {{- $recentCreated = $recentCreated | append (dict
        "title" .Title
        "permalink" .Permalink
        "date" (.Date.Format "2006-01-02")
      )
    -}}
  {{- end -}}
  {{- $data = merge $data (dict "recentCreated" $recentCreated) -}}

  {{- / 최종 데이터를 JSON으로 변환 / -}}
  {{- $data | jsonify (dict "indent" "  ") -}}
   1
   2 ### 다음 단계
   3
   4 위 설정을 완료하고 `hugo` 명령으로 사이트를 빌드하면 `public/nav-data/index.json` 경로에 사이트의 모든 페이지, 태그, 최신 글 정보가 담긴 JSON 파일이 생성됩니다.
  그 후에는 layouts/_partials/left-nav.html의 내용을 지우고, fetch('/nav-data/index.json')와 같은 JavaScript 코드를 사용하여 이 JSON 파일을 불러온 뒤 동적으로 HTML 요소를
  생성하여 채워 넣는 방식으로 구현하시면 됩니다.

  요청하신 대로 코드는 아직 수정하지 않았습니다. 위 설명이 원하시는 기능 구현에 도움이 되기를 바랍니다.