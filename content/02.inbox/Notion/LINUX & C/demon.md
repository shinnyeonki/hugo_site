---
title: demon
date: 2025-10-26T01:27:29+09:00
lastmod: 2025-10-26T01:27:29+09:00
resource-path: 02.inbox/Notion/LINUX & C/demon.md
draft: true
---
ps 프로세스 상태 명령 : ps -e

kill 프로세스 강제 종료 kill -9 프로세스 번호

pstree 부모 자식 프로세스 관계 트리

bg

fg

jobs

  

systemctl 실행스크립트

서비스 /lib/systemd/system/서비스 이름.service 라는 이름으로 확인할 수 있다

소켓 /lib/systemd/system/서비스 이름.socket 이름으로 확인할 수 있다


**# systemctl [명령] [서비스명]** : 서비스명 입력할 때 [서비스명].service를 다 쳐야하는 경우도 있습니다.

예시) **# systemctl start httpd** 아파치 서비스 시작

**# systemctl start tomcat.service** 톰캣 서비스 시작

위의 명령어들 처럼 .service 를 붙여야 하는 경우도 있고, 아닌 경우도 있습니다.

● 명령의 종류 ●

▷ start : 서비스 시작

▷ stop : 서비스 중지

▷ status : 서비스 상태 확인 (서비스가 구동 중인지 아닌지 알 수 있음)

▷ restart : 서비스 재시작 (중지 -> 시작) : 보통 변경한 설정 후에 많이 사용

▷ reload : 서비스를 중지하지 않고 설정 값을 반영 (서비스가 중지되면 안되는 경우 사용)

▷ enable : 시스템이 재부팅하면 자동으로 서비스 실행하도록 등록

▷ disable : enable 한 서비스 해제

**# systemctl list-units --type service [--all]** : [모든]서비스 목록 보기

**# systemctl list-unit-files --type service** : 모든 서비스의 현재 활성화 상태 보기

**# systemctl daemon-reload** : 설정들을 데몬에 즉시 반영하기 위한 명령어

**# systemctl kill [서비스명]** : 서비스와 관련된 프로세스까지 모두 종료

**# systemctl reset-failed** : 서비스를 disable 했는데도 계속 보이면 리셋 시키는 명령어


**# ps [옵션]** : ps 명령어는 실행중인 프로세스 목록과 상태를 보여줍니다.

process state 의 약자라고 합니다.

CPU 사용률과 사용중인 프로세스를 확인하기 위해서 많이 사용합니다.

리눅스는 서버 역할을 많이 하다보니 다수의 사용자가 접근해서 느려지는 경우도 있습니다.

불필요한 프로세스가 돌고있다면 강제로 종료해주기도 합니다.

그 중에서도 **# ps -ef** 옵션을 가장 많이 사용합니다.

**● 명령 옵션 ●**

(훨씬 더 많이 있지만 자주 사용하는 것만 기재)

- a : 일반적으로 로그인 쉘을 제외하고 데몬 프로세스처럼 터미널에 종속되지 않은 모든 프로세스를 출력
- e : 커널 프로세스를 제외한 모든 프로세스를 출력
- f : 풀 포맷으로 보여준다. (UID, PID 등 함께 표시)
- l : 긴 포맷으로 보여준다.
- u : 특정 사용자의 프로세스 정보 확인할 때 사용 (사용자 미지정 시 현재 사용자 기준으로 설정)
- x : 프로세서가 종료한 후에도 자신의 일을 계속 수행하는 프로세스가 있는데 그런 프로세스는 일반적인 ps명령으로

확인할 수 없다. 이때 -x옵션을 사용하면 확인할 수 있다.

**● ps 명령어가 보여주는 의미 ●**

**# ps -ef | grep sshd** : 많은 프로세스 중 sshd만 찾아서 보겠다는 뜻입니다.

**UID           PID       PPID   C  STIME  TTY          TIME        CMD**

[![](https://blog.kakaocdn.net/dn/FriJU/btqMAqEATmO/cARz3xUXIdv8zpBbyYQYY0/img.jpg)](https://blog.kakaocdn.net/dn/FriJU/btqMAqEATmO/cARz3xUXIdv8zpBbyYQYY0/img.jpg)

나타내주는 의미를 위에 용어로 살짝 적어놓았습니다. 이보다 더 많은 용어가 있지만 자주 쓰는 것만 살펴보겠습니다.

▷ UID(User ID) : 프로세스 소유자의 이름

▷ PID(Process ID) : 프로세스의 식별번호

▷ PPID(Parent PID) : 부모 프로세스 ID

▷ C : 짧은 기간 동안의 CPU 가동률

▷ STIME : 프로세스가 시작된 시간 or 날짜

▷ TTY : 프로세스와 연결된 터미널

▷ TIME : 총 CPU 사용 시간

▷ CMD(command) : 프로세스의 실행 명령

▷ PRI : 실제 실행 우선 순위

위에 명령어 | (파이프 라인 shift + \) 기호와 grep 명령어를 함께 사용하면 아주 유용합니다.

리눅스 자체 명령어라 다른 명령어와도 함께 잘 유용하게 쓸 수 있습니다. | grep 기억하시면 좋습니다.