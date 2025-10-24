---
title: mjuecs 프로젝트
date: 2025-03-13T17:00:00+09:00
lastmod: 2025-06-04T06:11:17+09:00
resource-path: 06.University/mju_ecs project/mjuecs 프로젝트.md
aliases: 
tags: 
---
mux
### 프로젝트 개요
mju_ecs는 명지대 학생들을 대상으로 컨테이너 컴퓨팅 자원을 빌려주는 서비스 입니다.  
aws  의 컨테이너 서비스인 ecs 서비스와 일정 부분 비슷하지만 무료 유료 부분, 규모에서 차이가 있습니다




## 📈 docker api 컨테이너 상태(Stats) 실시간 보기

```bash
curl --unix-socket /var/run/docker.sock http://localhost:2375/containers/{containerId}/stats
```

- CPU 사용률, 메모리, 네트워크 I/O, 디스크 I/O 등의 실시간 데이터를 스트리밍 방식으로 반환합니다.


로컬에서 Docker API 사용해보기 (Unix 소켓 기반):

```bash
# 컨테이너 목록 보기
curl --unix-socket /var/run/docker.sock http://localhost/containers/json

# 특정 컨테이너 로그 보기
curl --unix-socket /var/run/docker.sock http://localhost/containers/my_container/logs?stdout=1

# 컨테이너 시작
curl -X POST --unix-socket /var/run/docker.sock http://localhost/containers/my_container/start
```

### 배포

1. 사용자가 docker 그룹에 존재하는가

  ```bash
  sudo usermod -aG docker $USER
  ```

2. my-ttyd-docker 이미지가 존재하는가 =>  `docker build -t my-ttyd-docker .` 

3.  h2 기본 db 를 만들었는가 `java -cp h2-2.3.232.jar org.h2.tools.Shell` [h2 database 사용법](../../02.inbox/h2%20database%20사용법.md)

   ```sql
   select * from STUDENT;
   select * from DOCKER_CONTAINER;
   select * from TTYD_CONTAINER;
   ```

4. 