---
title: obsidian dataview
resource-path: 89.Obsidian/obsidian dataview.md
aliases:
tags:
  - obsidian
date: 2023-12-21T07:59:00+09:00
lastmod: 2023-12-21T07:59:00+09:00
---
1. 어떤 형태로 DB를 표현할꺼니? (WITHOUT ID : )
	1. TABLE
	2. LIST
	3. TASK
	4. CALENDAR
2. 어떤 변수를 포함시키고 싶은가
	1. tags 등등 정의한 front matter 의 속성이나 dataview 에서 주어진 객체를 사용
	2. [dataview 제공 데이터](https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-pages/) [dataview 제공 데이터](dataview%20제공%20데이터.md)
3.  FROM 어디서 왔으면 좋겠는가 뒤에 소스가 위치 (특정 폴더 특정 태그 필터링) (and or 키워드 사용 가능)
	1. 모든 노트 포함 ` ` `FOMR` `FROM ""`
	2. 태그 기반
	3. 폴더 기반
	4. 노트 기반
	5. 링크 기반 `a라는 파일을 언급한 소스들 \[\[a]]` `a라는 파일에서 언급한 소스들 outgoing\[\[a]]`
4. 필터링 어떤 조건을 만족했으면 좋겠는가
5. 정렬
	1. 필드 기준으로 모든 결과를 정렬합니다.`SORT date [ASCENDING/DESCENDING/ASC/DESC]` `메타데이터 필드는 key 와 value 의 쌍입니다`
	2. 정렬할 필드를 여러 개 제공할 수도 있습니다.  순서대로 우선순위가 부여됨. `SORT field1 [ASCENDING/DESCENDING/ASC/DESC], ..., fieldN [ASC/DESC]`
6. 그룹
	1. 
```
1. **FROM** like explained [](https://blacksmithgu.github.io/obsidian-dataview/queries/structure/#choose-your-source).
2. **WHERE**: Filter notes based on information **inside** notes, the meta data fields.
3. **SORT**: Sorts your results depending on a field and a direction.
4. **GROUP BY**: Bundles up several results into one result row per group.
5. **LIMIT**: Limits the result count of your query to the given number.
6. **FLATTEN**: Splits up one result into multiple results based on a field or calculation.
```





```dataview
TABLE tags 
FROM #algorizm 
FLATTEN tags as tags
```


```dataview
TABLE
WHERE #algorithm < 
```
