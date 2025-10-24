---
title: sql 틀린문제
date: 2024-04-11T13:04:00+09:00
lastmod: 2024-04-11T13:04:00+09:00
resource-path: temp/sql 틀린문제.md
aliases: 
tags:
  - sql
  - 문제풀이
---
## null 의 비교연산
null
```sql
where referee_id!=2 or referee_id = null -- 틀린답
이 아닌
where referee_id!=2 or referee_id is null -- 이것이 맞는 답
```
SQL에서 NULL 값은 특별하게 취급되며, NULL은 '값이 없음'을 의미합니다. 따라서, NULL 값은 다른 값들과 일반적인 비교 연산자(=, !=, <, >, 등)로 비교할 수 없습니다. NULL과의 비교는 IS NULL 또는 IS NOT NULL 연산자를 사용해야만 합니다.


## not in 문제
visits table and transactions table 이 존재 방문했지만 거래를 하지 않은 고객을 식별하려면 방문한 모든 고객의 목록에서 거래를 한 고객의 기록을 제거해야 합니다. 이를 통해 이 문제를 일반적인 "NOT IN" 문제로 변환합니다. "NOT IN" 문제를 해결하는 방법은 크게 두 가지입니다: 
1) NOT IN/EX와 유사한 기능을 직접 사용하거나
2) 오른쪽 테이블이 NULL로 설정된 LEFT OUTER JOIN 입니다.
```sql
-- left outer join
select customer_id, count(visit_id) as count_no_trans
from visits left join transactions using(visit_id)
where transaction_id is null
group by customer_id
```

```sql
-- not in 
select customer_id, count(visit_id) as count_no_trans
from visits
where visits.visit_id not in (select visit_id from transactions)
group by customer_id
```



## leetcode 1661
[leetcode 원본 문제 링크](https://leetcode.com/problems/average-time-of-process-per-machine/editorial/?envType=study-plan-v2&envId=top-sql-50)


group by 에서 새로운 relation 이 생성된다고 생각하고 참여하지 않은 attribute 는 사용할 수 없다고 생각한다면 아래와 같은답을 내였다
```sql
select d.machine_id, round(sum(d.timesub)/count(d.timesub),3) as processing_time
from (
	select a.machine_id, a.process_id, round(b.timestamp - a.timestamp, 3) as timesub
	from Activity as a join Activity as b
	where
		a.machine_id = b.machine_id and
		a.process_id = b.process_id and
		a.activity_type = 'start' and
		b.activity_type = 'end'
		) as d
group by d.machine_id
```

하지만 group by 에서 참여하지 않은 attribute 도 사용할 수 있다면 또한 문제에 제시된 답은 아래답이다

```sql
select a.machine_id, round(avg(b.timestamp - a.timestamp),3) as processing_time
from Activity as a join Activity as b
where
	a.machine_id = b.machine_id and
	a.process_id = b.process_id and
	a.activity_type = 'start' and
	b.activity_type = 'end'
group by a.machine_id
```


하지만 위의 2개 접근 (사실은 동일한 접근) 은 두개의 table을 조인 연산하여 select 문에서 산술연산을 통해 processing_time 을 산출 하는 것이 주된 접근으로 보이는데
사실은 두개의 table 을 join 하지 않고도 case 문 일종의 if 문으로 계산이 가능하다
