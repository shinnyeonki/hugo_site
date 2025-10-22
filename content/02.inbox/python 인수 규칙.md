---
title: python 인수 규칙
aliases: 
tags:
  - python
  - language
description: 
source: 
sequence: 
created: 2023-12-22T07:18:00+09:00
modified: 2023-12-22T07:18:00+09:00

---


```python
def print(  
*values: object,  
sep: str | None = " ",  
end: str | None = "\n",  
file: SupportsWrite[str] | None = None,  
flush: Literal[False] = False  
) -> None
```

파이썬의 print 내장함수 구현체이다

[가변인자](가변인자(variadic)#위치%20가변%20인자%20*args) 를 사용함 정확하게는 위치 가변인자를 사용하였다
: object 매개변수의 올 수 있는 타입을 지정하여 오류를 막는다
`: str | None` str 또는 None 가 올 수 있다는 이야기이다
` = " "` None 일때의 기본값을 지정해준다
