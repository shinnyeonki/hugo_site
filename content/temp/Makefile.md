---
title: Makefile
resource-path: temp/Makefile.md
aliases:
tags:
  - c
date: 2024-01-22T03:36:00+09:00
lastmod: 2024-01-22T03:36:00+09:00
---
```
target : dependency
<탭> command
```
tarrget 은 일반적인 command 로 생성된 파일을 의미할 수도 있고 목표하는 의미가 될 수도 있다
예를 들어 target 에 clean 이 들어가면 빌드 생성파일을 삭제한다


## 변수
> 매크로의 사용에서 ${..}, $(..), $..를 모두 사용할 수 있습니다. 그러나 대부분의 책에서는 $(..) 을 사용하라고 권하는군요

```
OBJS = main.o read.o write.o

test : $(OBJS)
	gcc -o test $(OBJS)
```

### 미리 정해저 있는 predefind 변수
make -p


## 자동변수
- `$@` : 현재 타겟 이름
- `$^` : 현재 타겟이 의존하는 대상들의 전체 목록
- `$^` : 의존 대상의 처음 대상