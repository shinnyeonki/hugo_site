---
title: netstat
date: 2025-10-26T01:27:29+09:00
lastmod: 2025-10-26T01:27:29+09:00
resource-path: 02.inbox/Notion/LINUX & C/netstat.md
draft: true
---
- a : 모든 소켓 정보 출력
- n : 호스트명이나 포트명 대신 숫자로 표시 (예를 들어 www는 80으로 출력)
- p : 소켓에 대한 PID 및 프로그램명 출력
- r : 라우팅 정보 출력
- l : Listening (대기)하고 있는 포트 출력
- i : 네트워크 인터페이스 테이블 출력
- s : 네트워크 통계 정보 출력
- c : 네트워크 정보를 주기적으로 계속 출력

  

네, 알려드리겠습니다. netstat -altu 명령어는 현재 활성화된 인터넷 연결 (서버와 연결된 상태)을 보여주는 명령어입니다. -a 옵션은 모든 연결과 리스닝 소켓을 보여주고, -l 옵션은 리스닝 소켓만 보여줍니다. -t 옵션은 TCP 프로토콜을 사용하는 연결을 보여주고, -u 옵션은 UDP 프로토콜을 사용하는 연결을 보여줍니다.

각 열의 의미는 다음과 같습니다.

- Proto : 프로토콜 종류 (TCP / UDP)
- Recv-Q : 해당 프로세스가 현재 받는 바이트 표기
- Send-Q : 해당 프로세스가 현재 보내는 바이트 표기
- Local Address : 출발지 주소 및 포트 (자신의 주소 및 포트)
- Foreign Address : 목적지 주소 및 포트
- State : 포트의 상태 표기 (LISTEN, ESTABLISHED, CLOSED 등)

예를 들어, 첫 번째 줄은 다음과 같이 해석할 수 있습니다.

- Proto : TCP 프로토콜 사용
- Recv-Q : 0 바이트 받음
- Send-Q : 0 바이트 보냄
- Local Address : 127.0.0.53:53 (자신의 IP 주소와 53번 포트)
- Foreign Address : 0.0.0.0:* (모든 IP 주소와 모든 포트와 연결 가능)
- State : LISTEN (대기 상태)

즉, 이 줄은 자신의 IP 주소와 53번 포트를 사용하는 TCP 프로토콜의 서버가 대기하고 있다는 것을 의미합니다.