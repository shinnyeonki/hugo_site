---
title: Zone.Identifier 삭제
aliases: 
tags:
  - 잡지식
created: 2025-07-24T00:00:18+09:00
modified: 2025-07-24T00:01:00+09:00

---
. 현재 폴더 아래의 ":Zone.Identifier" 이 뒤에 붙은 모든 파일을 삭제

```bash
find . -name "*:Zone.Identifier" -type f -delete
```

어떤 기능을 하는 명령어인지 알아봅시다.