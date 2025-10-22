---
title: python 매개변수 전달
aliases:
  - parametor
tags:
  - python
  - language
created: 2024-01-08T07:12:00+09:00
modified: 2024-01-08T07:12:00+09:00

---
파이썬의 매개변수 전달 방식 : 혼합 방식
- 파이썬은 모든 것이 객체이며 다음 2 종류가 있음
- 불변 객체 (immutable object) : int, float, complex, tuples, string, bytes 등
- 가변 객체 (mutable object) : list, dict, set, bytearray 등
- 
- 불변 객체가 매개변수로 전달될 때는 call-by-value 로 전달
- 가변 객체가 매개변수로 전달될 때는 call-by-reference 로 전달 


> [!NOTE] 참조
>Call-by-value : 실 매개변수의 값이 전달되며, 함수 내에서 형식 매개변수의 값을 변경해도 실 매개변수의 값은 변하지 않음
>Call-by-reference : 실 매개변수의 주소가 전달