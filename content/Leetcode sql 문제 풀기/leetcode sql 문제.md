---
title: leetcode sql 문제
resource-path: Leetcode sql 문제 풀기/leetcode sql 문제.md
aliases:
tags:
date: 2025-06-03T06:05:16+09:00
lastmod: 2025-09-04T20:49:28+09:00
---
## 1581 문제
not in 으로 풀기

```sql
SELECT customer_id, count(*) 'count_no_trans'
FROM visits as vi
where visit_id not in ( select visit_id
        from Transactions
    )
group by customer_id
```

left join 으로 풀기

```sql
select *
from Visits as vi left join Transactions as tr on vi.visit_id = tr.visit_id
where tr.visit_id is null --거래기록이 없는 사람 제외
group by customer_id
```

## 1280
참여한 시험이 0개를 어떻게 표현하지
join 풀이

```sql
select
    st.student_id,
    st.student_name,
    su.subject_name,
    COUNT(e.subject_name) AS attended_exams
from
    Students AS st
    CROSS JOIN Subjects AS su
    left JOIN Examinations AS e ON st.student_id = e.student_id and su.subject_name = e.subject_name
group by
    st.student_name,
    su.subject_name
order by
    st.student_id,
    su.subject_name
```

Coalese 함수 사용
속도와 null 의 적절한 처리를 위해 미리 exam 테이블의 개수를 세서 조인한다
또한 Coalese 함수 또는 NVL 사용해서 적절한 null 값 처리를 한다

```sql
SELECT s.student_id, s.student_name, sub.subject_name, COALESCE(e.attended_exams, 0) AS attended_exams
FROM Students s
CROSS JOIN Subjects sub
LEFT JOIN (
    SELECT student_id, subject_name, COUNT(*) AS attended_exams
    FROM Examinations
    GROUP BY student_id, subject_name
) e ON s.student_id = e.student_id AND sub.subject_name = e.subject_name
ORDER BY s.student_id, sub.subject_name;
```

## 570
미리 계산

```sql
with cte as (select t.id, count(s.id) as cnt
from Employee as s join Employee as t
    on s.managerId = t.id
group by s.managerId)
  
select name
from Employee as e
    join cte on e.id = cte.id
where cte.cnt is not null
```

join & group by

```sql
select t.name
from Employee as s
    join Employee as t on s.managerId = t.id
group by s.managerId
having count(s.id) is not null and count(s.id) >= 5
```

미친 깔끔

```sql
SELECT name
FROM Employee
WHERE id IN (
    SELECT managerId
    FROM Employee
    GROUP BY managerId
    HAVING COUNT(*) >= 5)
```

## 1934 개같이 멸망
요청조차 하지 않은 사용자의 비율 계산처리??

```sql
select s.user_id, round(avg
    (case
        when action = 'confirmed' then 1
        else 0
    end), 2) as confirmation_rate
from
    signups as s left join confirmations as c
        on s.user_id = c.user_id
group by s.user_id
```

round 소수점 숫자 정확도 정해주기
avg 를 사용하는 방법임 나는 나누기로 할려고 했지만...

```sql
SELECT
    s.user_id,
    COALESCE(
        ROUND(
	        COUNT ( 
		        CASE WHEN c.action = 'confirmed' THEN 1 END) * 1.0 / COUNT(c.user_id),2)
    ,0) AS confirmation_rate
FROM
    signups AS s
    LEFT JOIN confirmations AS c ON s.user_id = c.user_id
GROUP BY
    s.user_id;
```

끝까지 나누기로 풀기



## 1251 멸망
가격의 평균을 구하되 units 의 개수에 따른 가중치를 계산해주어야 한다

```sql
select product_id , round(avg(up)/sum(units),2) as average_price
from
    (select p.product_id , units , units *price
    from prices as p join unitssold as u
        on p.product_id = u.product_id and
            u.purchase_date BETWEEN start_date and end_date
    group by p.product_id, units , price) as temp(product_id, units, up)
group by product_id
```

```sql
SELECT
    p.product_id,
    round(SUM(p.price * u.units) / SUM(u.units),2) AS average_price
FROM prices AS p
JOIN unitssold AS u ON p.product_id = u.product_id
    AND u.purchase_date BETWEEN p.start_date AND p.end_date
GROUP BY p.product_id;
```

```sql
SELECT
    p.product_id,
    ROUND(SUM(p.price * u.units) OVER (PARTITION BY p.product_id) / SUM(u.units) OVER (PARTITION BY p.product_id), 2) AS average_price
FROM prices AS p
JOIN unitssold AS u ON p.product_id = u.product_id
AND u.purchase_date BETWEEN p.start_date AND p.end_date;
```

| product_id | start_date | end_date   | price | product_id | purchase_date | units |
| ---------- | ---------- | ---------- | ----- | ---------- | ------------- | ----- |
| 1          | 2019-02-17 | 2019-02-28 | 5     | 1          | 2019-02-25    | 100   |
| 1          | 2019-03-01 | 2019-03-22 | 20    | 1          | 2019-03-01    | 15    |
| 2          | 2019-02-01 | 2019-02-20 | 15    | 2          | 2019-02-10    | 200   |
| 2          | 2019-02-21 | 2019-03-31 | 30    | 2          | 2019-03-22    | 30    |
|            |            |            |       |            |               |       |



## 1633
null 이 존재하는 culumn 의 속성을 group 으로 묶으면?
애초에 고민을 할 필요가 없는 문제 join  할 필요가 없다

```sql
select 
	contest_id,
	round( count(user_id) / ( 
		select count(*) from users)
		 , 4) * 100 as percentage
from register
group by contest_id
order by percentage desc, contest_id
```

## 1211
그룹으로 묶인 것의 선택적으로 조건을 적용

```sql
select
    query_name,
    round( avg(rating/position),2 ) as quality,
    round( avg(
        (case when rating < 3 then 1 else 0 end )
    ) * 100 ,2) as poor_query_percentage
from Queries
group by query_name
having query_name is not null
```

month    | country | trans_count | approved_count | trans_total_amount | approved_total_amount