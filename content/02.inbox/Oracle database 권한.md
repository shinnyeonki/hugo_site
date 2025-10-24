---
title: Oracle database 권한
date: 2024-11-29T13:13:00+09:00
lastmod: 2024-11-29T13:13:00+09:00
resource-path: 02.inbox/Oracle database 권한.md
aliases: 
tags:
  - database
---
Oracle 데이터베이스에서 사용자의 권한을 설정할 때 사용할 수 있는 다양한 **권한**(privileges)과 **역할**(roles)의 예시는 아래와 같습니다. 권한은 크게 **시스템 권한**과 **객체 권한**으로 나뉩니다. 아래는 그 주요 예들입니다.

---

## **1. 시스템 권한 (System Privileges)**

시스템 권한은 데이터베이스 전체에서 특정 작업을 수행할 수 있도록 허용합니다.

|**권한**|**설명**|
|---|---|
|`CREATE SESSION`|데이터베이스에 연결할 수 있는 권한.|
|`CREATE TABLE`|새 테이블을 생성할 수 있는 권한.|
|`CREATE VIEW`|새 뷰(View)를 생성할 수 있는 권한.|
|`CREATE MATERIALIZED VIEW`|새 물리화된 뷰(Materialized View)를 생성할 수 있는 권한.|
|`CREATE PROCEDURE`|프로시저, 함수 또는 패키지를 생성할 수 있는 권한.|
|`CREATE SEQUENCE`|새 시퀀스를 생성할 수 있는 권한.|
|`CREATE TRIGGER`|트리거(Trigger)를 생성할 수 있는 권한.|
|`CREATE USER`|새로운 사용자를 생성할 수 있는 권한.|
|`CREATE ROLE`|새로운 역할(Role)을 생성할 수 있는 권한.|
|`CREATE INDEX`|새로운 인덱스를 생성할 수 있는 권한.|
|`CREATE SYNONYM`|새로운 동의어(Synonym)를 생성할 수 있는 권한.|
|`CREATE PUBLIC SYNONYM`|공용 동의어(Public Synonym)를 생성할 수 있는 권한.|
|`CREATE DATABASE LINK`|데이터베이스 링크(Database Link)를 생성할 수 있는 권한.|
|`ALTER USER`|사용자의 속성(예: 비밀번호, 테이블스페이스 등)을 변경할 수 있는 권한.|
|`DROP USER`|사용자를 삭제할 수 있는 권한.|
|`DROP ANY TABLE`|모든 테이블을 삭제할 수 있는 권한.|
|`SELECT ANY TABLE`|모든 테이블에 대해 SELECT 쿼리를 실행할 수 있는 권한.|
|`UPDATE ANY TABLE`|모든 테이블의 데이터를 업데이트할 수 있는 권한.|
|`DELETE ANY TABLE`|모든 테이블의 데이터를 삭제할 수 있는 권한.|
|`INSERT ANY TABLE`|모든 테이블에 데이터를 삽입할 수 있는 권한.|
|`EXECUTE ANY PROCEDURE`|모든 프로시저와 함수를 실행할 수 있는 권한.|
|`MANAGE TABLESPACE`|테이블스페이스를 관리할 수 있는 권한.|

---

## **2. 객체 권한 (Object Privileges)**

객체 권한은 특정 객체(예: 테이블, 뷰, 시퀀스 등)에 대해 작업을 수행할 수 있는 권한입니다.

|**권한**|**설명**|
|---|---|
|`SELECT`|테이블 또는 뷰에서 데이터를 조회할 수 있는 권한.|
|`INSERT`|테이블에 데이터를 삽입할 수 있는 권한.|
|`UPDATE`|테이블 데이터를 수정할 수 있는 권한.|
|`DELETE`|테이블 데이터를 삭제할 수 있는 권한.|
|`REFERENCES`|다른 테이블에서 외래 키 제약 조건을 생성할 때 참조할 수 있는 권한.|
|`INDEX`|테이블의 인덱스를 생성할 수 있는 권한.|
|`EXECUTE`|특정 프로시저, 함수, 또는 패키지를 실행할 수 있는 권한.|
|`ALTER`|특정 객체(테이블, 뷰 등)를 수정할 수 있는 권한.|
|`GRANT`|다른 사용자에게 객체 권한을 부여할 수 있는 권한.|

---

## **3. 역할 (Roles)**

역할은 권한의 집합으로, 여러 권한을 하나의 그룹으로 묶어 효율적으로 관리할 수 있습니다.

|**역할(Role)**|**설명**|
|---|---|
|`CONNECT`|기본 연결 권한.|
|`RESOURCE`|데이터베이스 객체(테이블, 뷰, 시퀀스 등)를 생성할 수 있는 권한 세트.|
|`DBA`|데이터베이스 관리자가 사용하는 모든 권한 세트.|
|`READ ONLY`|데이터베이스를 읽기 전용으로 접근할 수 있는 역할.|
|`READ WRITE`|읽기 및 쓰기 권한을 포함하는 역할.|
|`PUBLIC`|모든 사용자에게 적용되는 기본 역할.|

---

## **4. 특정 권한 부여 예시**

다양한 권한 부여 예시는 아래와 같습니다:

```sql
-- 테이블 관련 권한 부여
GRANT SELECT, INSERT, UPDATE ON employees TO user_name;

-- 프로시저 실행 권한 부여
GRANT EXECUTE ON my_procedure TO user_name;

-- 테이블스페이스 관리 권한 부여
GRANT UNLIMITED TABLESPACE TO user_name;

-- 모든 테이블에 대한 SELECT 권한 부여
GRANT SELECT ANY TABLE TO user_name;

-- 특정 데이터베이스 링크 생성 권한 부여
GRANT CREATE DATABASE LINK TO user_name;

-- 역할(Role) 부여
GRANT CONNECT TO user_name;
GRANT RESOURCE TO user_name;
GRANT DBA TO user_name;
```

---

## **5. 고급 권한 관리**

Oracle에서는 특정 작업에 대해 더 세부적으로 권한을 관리할 수 있습니다:

- **권한 회수**: `REVOKE` 명령을 사용하여 권한을 회수할 수 있습니다.
    
    ```sql
    REVOKE CREATE TABLE FROM user_name;
    ```
    
- **권한 전달 허용**: `WITH GRANT OPTION`을 추가하면 사용자가 다른 사용자에게 권한을 다시 부여할 수 있습니다.
    
    ```sql
    GRANT SELECT ON employees TO user_name WITH GRANT OPTION;
    ```
    

이 예시들을 기반으로, 사용자의 역할과 요구 사항에 맞는 권한 구성을 설계할 수 있습니다.