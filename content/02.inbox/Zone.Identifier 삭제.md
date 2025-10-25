---
title: Zone.Identifier 삭제
resource-path: 02.inbox/Zone.Identifier 삭제.md
aliases:
tags:
  - 잡지식
date: 2025-07-24T00:00:18+09:00
lastmod: 2025-07-24T00:01:00+09:00
---
. 현재 폴더 아래의 ":Zone.Identifier" 이 뒤에 붙은 모든 파일을 삭제

```bash
find . -name "*:Zone.Identifier" -type f -delete
```

어떤 기능을 하는 명령어인지 알아봅시다.