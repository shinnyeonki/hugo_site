---
title: mjuecs project
date: 2025-06-03T06:05:16+09:00
lastmod: 2025-06-11T15:06:32+09:00
resource-path: 06.University/mju_ecs project/mjuecs project.md
aliases: 
tags: 
---
### 물리 환경
db,backend,frontend 컴퓨터 1대
여러대의 docker host




### 로그인 처리

나의 경우는 mju 에 로그인이 가능한 사람을 기준으로 했지만 
어떠한 방식으로 로그인처리를 할 지 고를 수 있어야함

### api

| METHOD | endpoint            | 설명  |
| ------ | ------------------- | --- |
| POST   | /api/docker/run     |     |
| POST   | /api/docker/start   |     |
| POST   | /api/docker/restart |     |
|        | /api/docker/stop    |     |
|        | /api/docker/status  |     |
|        | /api/auth/login     |     |
|        | /api/auth/          |     |
|        |                     |     |
|        |                     |     |
|        |                     |     |
|        |                     |     |


### 필요 요구 사항
- 사용자가 새로운 컨테이너를 만들려고 할 때 docker host 컴퓨터들의 상태 (cpu, memory, ...) 을 보고 그곳에 컨테이너를 생성 가능(일종의 aws 의 리전개념)
- 사용자가 
- 백엔드는 백엔드에서 관리하고 있는 모든 host 의 정보(사용량, 컨테이너 사용량 등등)를 순차적으로 돌아가며 가져와서 메모리에 저장해두었다가 사용자에게 갱신해 주면 됨
- back 엔드에서는 사용자 정보만 db 에 저장하고 컨테이너 상태와 같은것들은 가져오지 않아야 한다
- 사용자 마다 전체 컨테이너의 개수 max 제한이 있어야 함
- 사용자가 1개의 컨테이너를 생성중에 있을 때는 컨테이너가 만들어지고 난 후 생성가능
- 컨테이너에 터미널 접근을위해 websocket 을 사용
- 터미널 창은 tab 으로 구성되며 첫 탭은 컨테이너 log 만 존재하는 tab 으로 상호작용은 없는 탭
- 사용자는 초기 화면에서 자신의 컨테이너 상태를 확인 할 수 있어야 한다(실시간 sse 활용)
- 사용자는 특정 컨테이너 정보 창에서 상세한 컨테이너 stats 을 확인할 수 있어야 한다(실시간 sse 활용)
- front 의 경우 onepage 로 만들어 구성이 쉽도록 한다

