---
title: gcc include path 확인하기
aliases: 
tags:
  - 잡지식
created: 2024-02-15T04:55:00+09:00
modified: 2024-02-15T04:55:00+09:00

---
```bash
echo | gcc -xc -E -v -

echo | gcc -xc++ -E -v -
```