---
title: gcc include path 확인하기
resource-path: 02.inbox/gcc include path 확인하기.md
keywords:
tags:
  - 잡지식
date: 2024-02-15T04:55:00+09:00
lastmod: 2024-02-15T04:55:00+09:00
---
```bash
echo | gcc -xc -E -v -

echo | gcc -xc++ -E -v -
```