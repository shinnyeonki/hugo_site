---
title: 가변인자(variadic)
resource-path: 02.inbox/가변인자(variadic).md
aliases:
tags:
  - python
  - language
date: 2023-12-20T07:12:00+09:00
lastmod: 2025-10-21T20:40:27+09:00
---
- [가변 인자 매크로의 모든 것 - 개론](http://blog.woong.org/v/59aa5b8cd845cbff6d76d418)
- [가변 인자 매크로의 모든 것 - 과거](http://blog.woong.org/v/59aa6080d845cbff6d76d421)
- [가변 인자 매크로의 모든 것 - 현재 #1](http://blog.woong.org/v/59aa6099d845cbff6d76d422)
- [가변 인자 매크로의 모든 것 - 현재 #2](http://blog.woong.org/v/59c0bf15d2db27f70d345e76)
- [가변 인자 매크로의 모든 것 - 현재 #3](http://blog.woong.org/v/59f9be99e7d0b554c97017cc)
- [가변 인자 매크로의 모든 것 - 미래](http://blog.woong.org/v/59c0bf41d2db27f70d345e77)
- [가변 인자 매크로의 모든 것 - 구현](http://blog.woong.org/v/59aa60b0d845cbff6d76d423)
- [가변 인자 매크로의 모든 것 - 보충](http://blog.woong.org/v/5a52fb5aa51c946933994ee3)


여러개의 데이터를 묶어 하나의 변수에 대입 (패킹)
vs
컬랙션 속의 요소들을 여러 개의 변수에 나누어 대입(언패킹)
컬랙션 (list tuple dictionary set)...

기본 구분

```python
numbers = (1, 2, 3, 4, 5)  # 패킹
a, b, c, d, e = numbers  # 언패킹
```

필요없는 요소 생략

```python
a, _, _, d, e = numbers  # 필요 없는 요소를 _ 변수에 대입
```

```python
>>> a, b, *rest = numbers     # 1, 2를 제외한 나머지를 rest에 대입
>>> print(a, b, rest)
1 2 [3, 4, 5]
```

```python
>>> a, *rest, e = numbers     # 1, 5를 제외한 나머지를 rest에 대입
>>> print(rest)
[2, 3, 4] 무조건 리스트로 반환
```

```python
>>> x = [10, 20, 30]
>>> print_numbers(*x)
10
20
30
```

```python
num_dict = {'a':1,'b':2,'c':3,'d':4,'e':5}
num_set = {1,2,3,4,5}

a3,b3,*rest3 = num_dict
a4,b4,*rest4 = num_set

print(a3, b3, rest3) # a b ['c', 'd', 'e']
print(a4, b4, rest4) # 1 2 [3, 4, 5]
```

## 함수 인자
함수의 인자를 보내는 방식을 2가지
위치로 매핑 하는 방법과 키워드로 매핑하는 방법
**위치로 매칭하는 방법**

```python
func('py', 'thon') #호출시
```

**키워드로 매칭하는 방법**

```python
func(b='thon', a='py') #호출시

print(a,b,sep=" 그리고 ")
```

## 위치 가변 인자 \*args
언패킹 방식을 함수의 인자에 사용
위치를 사용하므로 위치 가변 인자라고 한다
함수인자의 언패킹 방식과 일반 언패킹 방식은 리스트와 튜플로 다르다

```python
num_tuple = (1,2,3,4,5)
num_list = [1,2,3,4,5]


a1,b1,*rest1 = num_list
a2,b2,*rest2 = num_tuple


print(a1, b1, rest1) # 1 2 [3, 4, 5]
print(a2, b2, rest2) # 1 2 [3, 4, 5] # 그냥 언패킹은 무조건 리스트


def unpacking1(a3,b3,*rest3):
	 # 1 2 (3, 4, 5) 함수내부에서의 언패킹은 무조건 튜플
    print(a3,b3,rest3) 
    
unpacking1(1,2,3,4,5)
```

## 키워드 가변 인자 \*\*kwargs

함수는 임의의 개수의 키워드 인자도 받을 수 있다. 예:

```python
def f(x, y, **kwargs):
    ...
```

함수 호출.

```python
f(2, 3, flag=True, mode='fast', header='debug')
```

추가적인 키워드를 딕셔너리로 전달한다.

```python
def f(x, y, **kwargs):
    # x -> 2
    # y -> 3
    # kwargs -> { 'flag': True, 'mode': 'fast', 'header': 'debug' }
```

## 튜플과 딕셔너리를 전달하기

튜플을 가변 인자로 확장할 수 있다.

```python
numbers = (2,3,4)
f(1, *numbers)      # f(1,2,3,4)와 같음
```

마찬가지로 딕셔너리를 키워드 인자로 확장할 수 있다.

```python
options = {
    'color' : 'red',
    'delimiter' : ',',
    'width' : 400
}
f(data, **options)
```
