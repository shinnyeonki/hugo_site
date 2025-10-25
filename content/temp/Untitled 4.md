---
title: Untitled 4
resource-path: temp/Untitled 4.md
---
SQL 표준에서는
- dirty read: commit 되지 않은 데이터를 읽었을 때 발생하며, 데이터를 읽은 이후에 이 데이터를 rollback하게 되는 경우 문제가 발생하는 현상
- non-repeatable read: 한 트랜잭션에서 같은 데이터를 두 번 읽었는데 두 데이터의 결과가 다른 현상
- phantom read: 한 트랜잭션에서 같은 조건으로 데이터를 두 번 읽었는데 두 데이터의 결과가 다른 현상

이렇게 세 가지 이상 현상 개념에 대해서 다루고 이에 대한 isolation level을 아래와 같이 정의했습니다.
- read uncommited: 세 가지 이상 현상을 다 허용
- read commited: dirty read가 발생하는 schedule은 허용 X
- repeatable read: non-repeatable read까지 발생하는 scehdule은 허용 X
- serializable: 가장 엄격한 isolation level로 모든 이상 현상이 발생하는 schedule 허용 X

하지만 1995년 이 SQL 표준을 비판하는 논문이 등장하였고 이 논문에서는 SQL 표준에서 언급한 이상 현상 외에 더 많은 이상 현상이 존재하며, 다룬 이상 현상도 더 넓은 개념에서 바라보아야 한다고 비판하였습니다.

그렇게 소개한 새로운 이상 현상은 다음과 같습니다.
- read skew: 한 트랜잭션에서 관련 있는 서로 다른 데이터를 읽었는데 데이터 일관성이 깨지는 현상
- write skew: 두 트랜잭션에서 관련 있는 서로 다른 데이터에 쓰기 작업을 진행했는데 데이터 일관성이 깨지는 현상
- lost update: 한 트랜잭션이 abort혹은 commit되면서 다른 트랜잭션이 commit하여 업데이트한 결과가 사라지는 현상
- dirty write: 한 트랜잭션이 commit 되지 않은 다른 트랜잭션이 write한 데이터를 write 작업을 하면서 나타나는 이상 현상

그리고 더 넓은 개념으로 바라보아야 하는 이상 현상
- dirty read의 확장: commit 되지 않은 데이터를 읽었을 때, 그 데이터가 rollback 되는 경우에만 발생하지 않음
- phantom read의 확장: 같은 조건으로 데이터를 여러 번 읽는 경우가 아니더라도 phantom read가 발생

이렇게 두 가지를 비판하였습니다.