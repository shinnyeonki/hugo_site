---
title: dataview 제공 데이터
resource-path: 89.Obsidian/dataview 제공 데이터.md
keywords:
tags:
  - obsidian
  - reference
description:
series:
series_weight:
date: 2023-12-22T04:26:00+09:00
lastmod: 2023-12-22T04:26:00+09:00
---
|                    |        |                                                                                            |
| ------------------ | ------ | ------------------------------------------------------------------------------------------ |
| `file.name`        | 텍스트    | Obsidians 사이드바에 표시되는 파일 이름입니다.                                                             |
| `file.folder`      | 텍스트    | 이 파일이 속한 폴더의 경로입니다.                                                                        |
| `file.path`        | 텍스트    | 파일 이름을 포함한 전체 파일 경로입니다.                                                                    |
| `file.ext`         | 텍스트    | 파일 유형의 확장자. 일반적으로 `md`.                                                                    |
| `file.link`        | 링크     | 파일에 대한 링크입니다.                                                                              |
| `file.size`        | 숫자     | 파일의 크기(바이트)입니다.                                                                            |
| `file.ctime`       | 날짜와 시간 | 파일이 생성된 날짜입니다.                                                                             |
| `file.cday`        | 날짜     | 파일이 생성된 날짜입니다.                                                                             |
| `file.mtime`       | 날짜와 시간 | 파일이 마지막으로 수정된 날짜입니다.                                                                       |
| `file.mday`        | 날짜     | 파일이 마지막으로 수정된 날짜입니다.                                                                       |
| `file.tags`        | 목록     | 메모의 모든 고유 태그 목록입니다. 하위 태그는 각 레벨별로 분류되어 `#Tag/1/A`목록에 로 저장됩니다 `[#Tag, #Tag/1, #Tag/1/A]`.   |
| `file.etags`       | 목록     | 메모의 모든 명시적 태그 목록입니다. 와 달리 `file.tags`하위 태그를 분해하지 않습니다. 즉`[#Tag/1/A]`                       |
| `file.inlinks`     | 목록     | 이 파일에 대한 모든 수신 링크 목록, 즉 이 파일에 대한 링크가 포함된 모든 파일을 의미합니다.                                     |
| `file.outlinks`    | 목록     | 이 파일에서 나가는 모든 링크 목록, 즉 파일에 포함된 모든 링크를 의미합니다.                                               |
| `file.aliases`     | 목록     | [YAML 서문을](https://help.obsidian.md/How+to/Add+aliases+to+note) 통해 정의된 메모의 모든 별칭 목록입니다 .   |
| `file.tasks`       | 목록     | `\| [ ] some task`이 파일에 있는 모든 작업(예: )의 목록입니다 .                                             |
| `file.lists`       | 목록     | 파일의 모든 목록 요소 목록(작업 포함) 이러한 요소는 사실상 작업이며 작업 보기에서 렌더링될 수 있습니다.                               |
| `file.frontmatter` | 목록     | `key \| value`텍스트 값 형태로 모든 머리말의 원시 값을 포함합니다 . 주로 원시 머리말 값을 확인하거나 머리말 키를 동적으로 나열하는 데 유용합니다. |
| `file.day`         | 날짜     | 파일 이름 안에 날짜가 있거나( 형식 `yyyy-mm-dd`또는 ) 필드/인라인 필드가 `yyyymmdd`있는 경우에만 사용할 수 있습니다.`Date`       |
| `file.starred`     | 부울     | 이 파일이 Obsidian Core 플러그인 "Bookmarks"를 통해 북마크된 경우.                                          |