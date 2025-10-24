---
title: mysql 명령 모음
date: 2024-03-05T16:15:00+09:00
lastmod: 2024-03-05T16:15:00+09:00
resource-path: 02.inbox/mysql 명령 모음.md
aliases: 
tags:
  - database
  - command
---
mysql 로그인
```shell
mysql -u {name} -p # name 유저로 -p 패스워드를 사용해 로그인 하겠다
```
mysql 유저 생성(외부에서)
```shell
mysqladmin -u {name}
```

mysql 유저 정보 확인
```sql
USE mysql; SELECT user, host FROM user; /* mysql 유저 정보 확인 */
```

mysql 유저 권한 추가
```sql
GRANT ALL privileges ON DB명.* TO username@hostname IDENTIFIED BY '비밀번호';
```

mysql 유저 권환 확인
```sql
SHOW GRANTS FOR username@hostname;
```

```sql
SHOW VARIABLES LIKE "general_log%";
```


서버 관리를 하다보면 mysql 사용자 계정을 추가해 줄때가 있다.

  