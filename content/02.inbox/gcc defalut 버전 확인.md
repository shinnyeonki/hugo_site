---
title: gcc defalut 버전 확인
date: 2024-12-23T13:30:00+09:00
lastmod: 2024-12-23T13:30:00+09:00
resource-path: 02.inbox/gcc defalut 버전 확인.md
aliases: 
tags:
  - 잡지식
  - c
  - cpp
---
```bash
gcc -dM -E -x c - < /dev/null | grep __STDC_VERSION__
```



	
```bash
g++ -dM -E -x c++ - < /dev/null | grep __cplusplus
```
C++98: 199711
C++11: 201103
C++14: 201402
C++17: 201703
C++20: 202002