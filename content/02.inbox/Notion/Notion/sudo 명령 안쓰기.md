---
title: sudo 명령 안쓰기
date: 2025-10-24T20:53:41+09:00
lastmod: 2025-10-24T20:53:41+09:00
resource-path: 02.inbox/Notion/Notion/sudo 명령 안쓰기.md
draft: true
---
docker 명령의 root 권한 을 안쓰기 위해 사용자에게 docker 그룹으로 추가한다

```
sudo usermod -aG docker ${USER}
sudo systemctl restart docker
```