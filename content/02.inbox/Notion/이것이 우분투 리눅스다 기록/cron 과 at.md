---
title: cron 과 at
resource-path: 02.inbox/Notion/이것이 우분투 리눅스다 기록/cron 과 at.md
---
주기적 반복 자동 실행 cron

/etc/crontab 에서 설정할 수 있음

- 설정형식
    
    분 시 일 월 요일 사용자 실행명령
    

  

  

- 일회성 자동 실행 at
    
    at -l 리스트 확인  
    at 시간 {am,pm} {tomorrow}  
    atrm 숫자 : 명령 삭제