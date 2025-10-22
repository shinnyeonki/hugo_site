---
title: ryugod 프로젝트2
aliases: 
tags: 
created: 2025-03-15T10:30:00+09:00
modified: 2025-03-15T10:30:00+09:00

---
mysql template 자료 : https://hub.docker.com/_/mysql
postgres template 자료 : https://hub.docker.com/_/postgres
mongoDB template 자료 : https://hub.docker.com/_/mongo
...

### API

컨테이너 생성 : `POST /api/{userId}/container`
요청 본문:
```json
{
  "image": "ubuntu:22.04",
  "type": "template",  // 또는 "manual" 현재는 menual 만 사용
  "container_port" : "3306", // 컨테이너 내부에서 사용하는 서비스 포트 22는 자동
  "env" : [] // mysql 의 경우 MYSQL_ROOT_PASSWORD 변수가 필수로 필요하다
}
```
응답:
```json
{
  "status" : "success",
  "container_id": "c123456789",
  "container_name": "MjuEcs-username-1"
}
```
터미널 세션 API : `POST /api/terminals/create`