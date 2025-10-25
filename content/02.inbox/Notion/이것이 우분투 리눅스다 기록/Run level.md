---
title: Run level
resource-path: 02.inbox/Notion/이것이 우분투 리눅스다 기록/Run level.md
---
![](../../../08.media/20231231210201-1.png)
default 런레벨을 GUI → CLI 로 변경

default.target 파일의 심볼릭 링크를 변경하는 명령어  
  
ln -sf /lib/systemd/system/multi-user.target /lib/systemd/system/default.target  

  

CLI → GUI startx 명령