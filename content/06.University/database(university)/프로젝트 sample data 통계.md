---
title: 프로젝트 sample data 통계
date: 2024-11-18T18:07:00+09:00
lastmod: 2024-11-18T18:07:00+09:00
resource-path: 06.University/database(university)/프로젝트 sample data 통계.md
aliases: 
tags:
  - sql
  - database
description: 대학 수업 database 에서 배운 모든 내용 정리
source: database(university)
sequence: 
finish: 
---
## 개발자 70 명 나머지 30명
![](../../08.media/20241118165348.png)

## 월별 평균 10개 정도의 프로젝트 진행
![Pasted image 20241118201393](../../08.media/20241118201393.png)


```sql
SELECT
    EXTRACT(YEAR FROM month) AS PROJECT_YEAR,
    EXTRACT(MONTH FROM month) AS PROJECT_MONTH,
    COUNT(p.project_id) AS PROJECT_COUNT
FROM
    (SELECT ADD_MONTHS(TRUNC(DATE '2021-01-01', 'MM'), LEVEL - 1) AS month
     FROM dual
     CONNECT BY LEVEL <= 47) m
LEFT JOIN
    project p ON (p.start_date < LAST_DAY(m.month) + 1
                   AND (p.end_date > LAST_DAY(m.month) OR p.end_date IS NULL))
GROUP BY
    EXTRACT(YEAR FROM month), EXTRACT(MONTH FROM month)
ORDER BY
    PROJECT_YEAR, PROJECT_MONTH;
```