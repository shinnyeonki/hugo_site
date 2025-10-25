---
title: sudo 명령 안쓰기
resource-path: 02.inbox/Notion/Notion/sudo 명령 안쓰기.md
---
docker 명령의 root 권한 을 안쓰기 위해 사용자에게 docker 그룹으로 추가한다

```
sudo usermod -aG docker ${USER}
sudo systemctl restart docker
```