---
title: sudo vs su
aliases: 
tags:
  - command
  - shell
created: 2024-02-28T09:13:00+09:00
modified: 2024-02-28T09:13:00+09:00

---

sudo, sudoedit — 명령을 다른 사용자로 실행합니다  
su - 대체 사용자 및 그룹 ID를 사용하여 명령을 실행합니다

```shell
   3308    3308    3308 pts/1    00:00:00     bash
   3519    3519    3308 pts/1    00:00:00       sudo
   3520    3520    3520 pts/3    00:00:00         sudo
   3521    3521    3520 pts/3    00:00:00           su
   3522    3522    3520 pts/3    00:00:00             bash
   3388    3388    3388 pts/2    00:00:00     bash
   3539    3539    3388 pts/2    00:00:00       sudo
   3540    3540    3540 pts/4    00:00:00         sudo
   3541    3541    3540 pts/4    00:00:00           bash
```
