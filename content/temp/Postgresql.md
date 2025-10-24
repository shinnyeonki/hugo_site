---
title: Postgresql
date: 2024-09-16T04:11:00+09:00
lastmod: 2024-09-16T04:11:00+09:00
resource-path: temp/Postgresql.md
aliases: 
tags: 
---
## Postgresql binary
1. **clusterdb**: 데이터베이스 클러스터의 모든 데이터베이스를 클러스터화합니다.
2. **createdb**: 새로운 데이터베이스를 생성합니다.
3. **createuser**: 새로운 사용자를 생성합니다.
4. **dropdb**: 데이터베이스를 삭제합니다.
5. **dropuser**: 사용자를 삭제합니다.
6. **initdb**: 새로운 데이터베이스 클러스터를 초기화합니다.
7. **oid2name**: OID(객체 식별자)와 이름을 매핑합니다.
8. **pg_amcheck**: 인덱스 접근 방법을 검사합니다.
9. **pg_archivecleanup**: 아카이브 로그 파일을 정리합니다.
10. **pg_basebackup**: 데이터베이스 클러스터의 전체 백업을 생성합니다.
11. **pgbench**: 벤치마킹 도구로, 성능 테스트를 수행합니다.
12. **pg_checksums**: 데이터베이스 블록의 체크섬을 확인합니다.
13. **pg_config**: PostgreSQL 설치 정보 및 구성을 출력합니다.
14. **pg_controldata**: 데이터베이스 클러스터의 제어 정보를 출력합니다.
15. **pg_ctl**: 데이터베이스 서버를 시작, 중지, 재시작합니다.
16. **pg_dump**: 데이터베이스의 백업을 생성합니다.
17. **pg_dumpall**: 모든 데이터베이스의 백업을 생성합니다.
18. **pg_isready**: 데이터베이스 서버의 상태를 체크합니다.
19. **pg_receivewal**: WAL(Write Ahead Log)을 수신합니다.
20. **pg_recvlogical**: 논리적 복제를 위한 WAL을 수신합니다.
21. **pg_resetwal**: WAL 파일의 상태를 재설정합니다.
22. **pg_restore**: pg_dump로 생성된 백업을 복원합니다.
23. **pg_rewind**: 마스터와 슬레이브 간의 데이터 동기화를 수행합니다.
24. **pg_test_fsync**: fsync 성능을 테스트합니다.
25. **pg_test_timing**: 시간 측정 테스트를 수행합니다.
26. **pg_upgrade**: 데이터베이스를 새로운 버전으로 업그레이드합니다.
27. **pg_verifybackup**: 백업의 유효성을 검사합니다.
28. **pg_waldump**: WAL 파일의 내용을 출력합니다.
29. **postgres**: PostgreSQL 데이터베이스 서버의 주요 실행 파일입니다.
30. **postmaster**: PostgreSQL 서버를 시작하는 데 사용되는 심볼릭 링크입니다.
31. **psql**: PostgreSQL의 명령줄 인터페이스입니다.
32. **reindexdb**: 데이터베이스의 인덱스를 재생성합니다.
33. **vacuumdb**: 데이터베이스의 공간을 회수하고, 통계를 업데이트합니다.






PostgreSQL에서 **Predefined Roles**(미리 정의된 역할)은 특정 권한과 기능에 대한 접근을 제공하는 역할로, 데이터베이스 관리자가 사용자나 다른 역할에 부여할 수 있습니다. 이러한 역할은 일반적으로 자주 필요한 권한을 집합적으로 관리할 수 있도록 설계되었습니다. 아래에 각 미리 정의된 역할에 대한 설명을 제공합니다.

## 미리 정의된 역할 목록과 설명

1. **pg_read_all_data**
   - **권한**: 모든 데이터(테이블, 뷰, 시퀀스)를 읽을 수 있는 권한을 가집니다. SELECT 권한이 없는 경우에도 USAGE 권한이 자동으로 부여됩니다.
   - **주의**: RLS(행 수준 보안)가 활성화된 경우, BYPASSRLS 속성이 설정되지 않으면 제한이 있을 수 있습니다.
2. **pg_write_all_data**
   - **권한**: 모든 데이터에 대해 INSERT, UPDATE 및 DELETE 권한을 가집니다. USAGE 권한도 자동으로 부여됩니다.
   - **주의**: RLS가 활성화된 경우, BYPASSRLS 속성이 설정되지 않으면 제한이 있을 수 있습니다.
3. **pg_read_all_settings**
   - **권한**: 모든 설정 변수(일반 사용자에게는 보이지 않는 것까지 포함)를 읽을 수 있습니다.
4. **pg_read_all_stats**
   - **권한**: pg_stat_* 뷰와 다양한 통계 관련 확장을 읽을 수 있습니다. 일반 사용자에게는 보이지 않는 정보에 접근할 수 있습니다.
5. **pg_stat_scan_tables**
   - **권한**: 테이블에 ACCESS SHARE 잠금을 걸 수 있는 모니터링 기능을 실행할 수 있습니다.
6. **pg_monitor**
   - **권한**: 다양한 모니터링 뷰와 함수를 읽고 실행할 수 있습니다. 이 역할은 pg_read_all_settings, pg_read_all_stats, pg_stat_scan_tables의 멤버입니다.
7. **pg_database_owner**
   - **권한**: 현재 데이터베이스의 소유자에게만 자동으로 부여되는 역할입니다. 이 역할은 다른 역할의 구성원이 될 수 없습니다.
8. **pg_signal_backend**
   - **권한**: 다른 백엔드에 신호를 보내 쿼리를 취소하거나 세션을 종료할 수 있는 권한을 부여합니다.
9. **pg_read_server_files**
   - **권한**: 데이터베이스가 접근할 수 있는 파일을 읽을 수 있는 권한입니다.
10. **pg_write_server_files**
    - **권한**: 데이터베이스가 접근할 수 있는 파일에 쓸 수 있는 권한입니다.
11. **pg_execute_server_program**
    - **권한**: 데이터베이스 서버에서 프로그램을 실행할 수 있는 권한을 부여합니다.
12. **pg_checkpoint**
    - **권한**: CHECKPOINT 명령을 실행할 수 있는 권한입니다.
13. **pg_use_reserved_connections**
    - **권한**: 예약된 연결 슬롯을 사용할 수 있는 권한입니다.
- 
14. **pg_create_subscription**
    - **권한**: CREATE 권한이 있는 데이터베이스에서 CREATE SUBSCRIPTION 명령을 실행할 수 있는 권한입니다.

## 권한 부여

관리자는 다음과 같은 SQL 명령을 사용하여 특정 사용자에게 이러한 역할을 부여할 수 있습니다:

```sql
GRANT pg_signal_backend TO admin_user;
```

## 주의 사항
- **보안**: 이러한 역할은 강력한 권한을 부여하므로, 필요한 사용자에게만 부여해야 하며, 그 사용에 대한 이해가 필요합니다.
- **모니터링**: `pg_monitor`와 같은 역할은 데이터베이스 서버의 모니터링을 용이하게 하며, 일반적으로 슈퍼유저만 접근할 수 있는 통계 및 설정 정보에 접근할 수 있도록 합니다.










```sql
CREATE USER test_user WITH PASSWORD '1253' LOGIN;
CREATE ROLE personal_group;
GRANT personal_group TO test_user;
CREATE DATABASE test_db OWNER test_user;
REVOKE CONNECT ON DATABASE test_db FROM PUBLIC;
REVOKE TEMPORARY ON DATABASE test_db FROM PUBLIC;

GRANT CONNECT ON DATABASE test_db TO test_user; -- 필요 없을 수 있음
GRANT CONNECT ON DATABASE test_db TO postgres; -- 필요 없을 수 있음
```
