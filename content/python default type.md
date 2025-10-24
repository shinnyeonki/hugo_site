---
title: python default type
date: 2025-07-01T06:52:17+09:00
lastmod: 2025-07-01T23:01:01+09:00
resource-path: python default type.md
aliases: 
tags:
  - python
---
## default type

| 자료형 그룹                                | 자료형 (Type)                              | 설명                                                         |
| :------------------------------------ | :-------------------------------------- | :--------------------------------------------------------- |
| **숫자형 (Numeric Types)**               | `int`                                   | 정수 (정밀도 무제한)                                               |
|                                       | `float`                                 | 부동소수점 숫자                                                   |
|                                       | `complex`                               | 복소수                                                        |
| **불리언형 (Boolean Type)**               | `bool`                                  | `True` 또는 `False` 값을 가지며, `int`의 하위 클래스입니다.                |
| **시퀀스형 (Sequence Types)**             | `list`                                  | 변경 가능한(mutable) 시퀀스.                                       |
|                                       | `tuple`                                 | 변경 불가능한(immutable) 시퀀스.                                    |
|                                       | `range`                                 | 변경 불가능한(immutable) 숫자 시퀀스.                                 |
|                                       | `str` (문자열)                             | 변경 불가능한(immutable) 유니코드 코드 포인트의 시퀀스.                       |
| **바이너리 시퀀스형 (Binary Sequence Types)** | `bytes`                                 | 변경 불가능한(immutable) 단일 바이트의 시퀀스.                            |
|                                       | `bytearray`                             | 변경 가능한(mutable) `bytes` 버전.                                |
|                                       | `memoryview`                            | 복사 없이 다른 바이너리 객체의 메모리에 접근합니다.                              |
| **세트형 (Set Types)**                   | `set`                                   | 순서가 없고, 중복되지 않는 해시 가능한(hashable) 객체들의 변경 가능한(mutable) 컬렉션. |
|                                       | `frozenset`                             | 변경 불가능한(immutable) `set`.                                  |
| **매핑형 (Mapping Types)**               | `dict` (사전)                             | 해시 가능한(hashable) 값을 임의의 객체에 매핑하는 변경 가능한(mutable) 객체.       |
| **컨텍스트 관리자형 (Context Manager Types)** | -                                       | `with` 문에 의해 정의된 런타임 컨텍스트를 지원하는 형식.                        |
| **타입 어노테이션형 (Type Annotation Types)** | `GenericAlias`                          | 클래스를 구독하여 생성되는 제네릭 타입의 프록시 (`list[int]` 등).                |
|                                       | `Union`                                 | 여러 타입을 허용하는 타입 어노테이션을 위한 형식 (`int                          |
| **기타 내장형 (Other Built-in Types)**     | `module`                                | 모듈 객체.                                                     |
|                                       | `class` and `instance`                  | 클래스와 그 클래스의 인스턴스.                                          |
|                                       | `function`                              | 함수 객체.                                                     |
|                                       | `method`                                | 인스턴스에 바인딩된 메서드 객체.                                         |
|                                       | `code object`                           | 컴파일된 실행 가능한 파이썬 코드.                                        |
|                                       | `type object`                           | 객체의 타입을 나타내는 객체.                                           |
|                                       | `NoneType` (`None`)                     | 값이 없음을 나타내는 단일 객체.                                         |
|                                       | `ellipsis` (`...`)                      | 슬라이싱에 주로 사용되는 단일 객체.                                       |
|                                       | `NotImplementedType` (`NotImplemented`) | 지원되지 않는 연산에서 반환되는 단일 객체.                                   |


| 분류 (Category)                           | 내장 타입 (Built-in Type)                              | 설명 (Description)                                                                          | 출처 (Source)                            |
| :-------------------------------------- | :------------------------------------------------- | :---------------------------------------------------------------------------------------- | :------------------------------------- |
| **숫자 타입** (Numeric Types)               | **`int`**                                          | 정수                                                                                        |                                        |
|                                         | **`float`**                                        | 부동 소수점 숫자                                                                                 |                                        |
|                                         | **`complex`**                                      | 실수부와 허수부를 모두 갖는 복소수                                                                       |                                        |
|                                         | **`bool`**                                         | 진리값을 나타내는 타입으로, `int`의 서브타입입니다. `True`와 `False` 두 개의 상수 인스턴스가 있습니다.                       |                                        |
| **시퀀스 타입** (Sequence Types)             | **`list`**                                         | 가변 시퀀스로, 일반적으로 동종 항목의 컬렉션을 저장하는 데 사용됩니다.                                                  |                                        |
|                                         | **`tuple`**                                        | 불변 시퀀스로, 일반적으로 이종 데이터를 저장하는 데 사용됩니다.                                                      |                                        |
|                                         | **`range`**                                        | 불변 숫자 시퀀스를 나타내며, `for` 루프에서 특정 횟수만큼 반복하는 데 일반적으로 사용됩니다.                                   |                                        |
|                                         | **`str`**                                          | 유니코드 코드 포인트의 불변 시퀀스로, 텍스트 데이터를 처리합니다.                                                     |                                        |
| **이진 시퀀스 타입** (Binary Sequence Types)   | **`bytes`**                                        | 단일 바이트의 불변 시퀀스입니다.                                                                        |                                        |
|                                         | **`bytearray`**                                    | `bytes` 객체의 가변 counterpart입니다.                                                            |                                        |
|                                         | **`memoryview`**                                   | 버퍼 프로토콜을 지원하는 객체의 내부 데이터에 복사 없이 접근할 수 있도록 합니다.                                            |                                        |
| **집합 타입** (Set Types)                   | **`set`**                                          | 해시 가능한 고유 객체의 순서 없는 컬렉션입니다. `add()` 및 `remove()`와 같은 메서드를 사용하여 내용을 변경할 수 있는 **가변** 타입입니다. |                                        |
|                                         | **`frozenset`**                                    | 해시 가능한 고유 객체의 순서 없는 컬렉션입니다. 생성 후 내용을 변경할 수 없는 **불변** 타입이며, 딕셔너리 키나 다른 집합의 요소로 사용될 수 있습니다. |                                        |
| **매핑 타입** (Mapping Types)               | **`dict`**                                         | 해시 가능한 값을 임의의 객체에 매핑하는 **가변** 객체입니다.                                                      |                                        |
|                                         | **`Dictionary view objects`**                      | `dict.keys()`, `dict.values()`, `dict.items()` 메서드가 반환하는 객체입니다. 딕셔너리의 항목에 대한 동적 뷰를 제공합니다. |                                        |
| **타입 어노테이션 타입** (Type Annotation Types) | **`Generic Alias`**                                | 클래스를 서브스크립션하여 생성되며, 주로 타입 어노테이션(`list[int]` 등)에 사용됩니다.                                    |                                        |
|                                         | **`Union`**                                        | 여러 타입 객체에 대한 `                                                                            | `(비트 OR) 연산의 값을 보유하며, 주로 타입 어노테이션(`int |
| **기타 내장 타입** (Other Built-in Types)     | **`Modules`**                                      | 모듈의 심볼 테이블에 정의된 이름에 접근할 수 있습니다 (예: `m.name`).                                             |                                        |
|                                         | **`Classes and Class Instances`**                  | 객체, 값 및 타입, 그리고 클래스 정의에 대한 정보를 포함합니다.                                                     |                                        |
|                                         | **`Functions`**                                    | 함수 정의에 의해 생성되며, 호출하는 것이 유일한 연산입니다. 내장 함수와 사용자 정의 함수가 있습니다.                                |                                        |
|                                         | **`Methods`**                                      | 속성 표기법을 사용하여 호출되는 함수입니다. 내장 메서드와 클래스 인스턴스 메서드(바운드 메서드)가 있습니다.                             |                                        |
|                                         | **`Code Objects`**                                 | 함수 본문과 같은 "의사 컴파일된" 실행 가능한 Python 코드를 나타내는 데 구현에서 사용됩니다.                                  |                                        |
|                                         | **`Type Objects`**                                 | 다양한 객체 타입을 나타내며, 객체의 타입은 내장 함수 `type()`을 통해 접근할 수 있습니다.                                   |                                        |
|                                         | **`The Null Object`** (`None`)                     | 함수가 명시적으로 값을 반환하지 않을 때 반환되는 객체입니다. 정확히 하나의 널 객체 `None`이 있습니다.                             |                                        |
|                                         | **`The Ellipsis Object`** (`Ellipsis` 또는 `...`)    | 슬라이싱(`Slicings`)에 일반적으로 사용되는 객체입니다. 정확히 하나의 생략 객체가 있습니다.                                  |                                        |
|                                         | **`The NotImplemented Object`** (`NotImplemented`) | 비교 및 이진 연산이 지원하지 않는 타입에 대해 작동하도록 요청받을 때 반환되는 객체입니다.                                       |                                        |
|                                         | **`Internal Objects`**                             | 스택 프레임, 트레이스백, 슬라이스 객체 등을 포함합니다.                                                          |                                        |


---

## collection

`collections` 모듈은 파이썬의 기본 내장 컨테이너(`dict`, `list`, `set`, `tuple`)를 확장하여 더 전문화된 데이터 구조를 제공


| 클래스 (Class)    | 설명                                                                                                                       |
| :------------- | :----------------------------------------------------------------------------------------------------------------------- |
| `namedtuple()` | 각 위치에 이름(필드)을 부여하여 인덱스뿐만 아니라 이름으로도 데이터에 접근할 수 있는 튜플을 생성하는 팩토리 함수입니다.                                                     |
| `deque`        | 'double-ended queue'의 약자로, 리스트와 유사하지만 양쪽 끝에서 항목을 추가하고 제거하는(append/pop) 속도가 매우 빠릅니다.                                      |
| `ChainMap`     | 여러 개의 딕셔너리나 다른 매핑(mapping)들을 하나의 뷰(view)로 묶어줍니다. 검색은 여러 매핑에서 순차적으로 이루어집니다.                                               |
| `Counter`      | 해시 가능한(hashable) 객체의 개수를 세는 데 특화된 딕셔너리 서브클래스입니다. 요소(key)와 그 요소의 개수(value)를 매핑 형태로 저장합니다.                                 |
| `OrderedDict`  | 항목이 추가된 순서를 기억하는 딕셔너리 서브클래스입니다. (참고: Python 3.7부터는 기본 `dict`도 삽입 순서를 유지하지만, `OrderedDict`는 순서를 재정렬하는 메서드 등 추가 기능을 가집니다.) |
| `defaultdict`  | 딕셔너리에서 존재하지 않는 키를 조회할 때, 미리 지정된 기본값(예: 0, 빈 리스트)을 자동으로 생성해주는 딕셔너리 서브클래스입니다. `KeyError`를 방지하는 데 유용합니다.                    |
| `UserDict`     | 딕셔너리 객체를 감싸는(wrapper) 클래스로, 기존 딕셔너리를 상속받아 새로운 클래스를 만들 때 더 편리하게 사용할 수 있도록 도와줍니다.                                          |
| `UserList`     | 리스트 객체를 감싸는 래퍼 클래스입니다. `UserDict`와 마찬가지로 리스트를 상속받아 커스텀 클래스를 만들 때 유용합니다.                                                  |
| `UserString`   | 문자열 객체를 감싸는 래퍼 클래스입니다.                                                                                                   |


---

### nametuple

네, `namedtuple`에 대해 자세히 설명해 드리겠습니다. 말씀하신 정의는 정확합니다.   `namedtuple`은 **'이름이 붙은 튜플'**을 만드는 아주 유용한 도구입니다.  

간단히 비유하자면, **메서드(기능)는 필요 없고 데이터만 담을 아주 가벼운 '클래스(Class)'를 즉석에서 만드는 것**과 같습니다.

#### 왜 `namedtuple`을 사용할까요?

일반 튜플은 인덱스로만 값에 접근할 수 있습니다.

```python
# 일반 튜플
point = (10, 20)
print(point[0]) # x 좌표
print(point[1]) # y 좌표
```

이 코드는 `point[0]`이 무엇을 의미하는지 바로 알기 어렵습니다. 코드가 길어지면 이 값들이 x, y 좌표라는 것을 잊기 쉽죠.  

`namedtuple`은 이 문제를 해결합니다.  

#### `namedtuple` 사용법

`namedtuple`은 두 단계를 거쳐 사용됩니다.  

1.  **1단계: `namedtuple` '타입(Type)' 정의하기**
    `collections.namedtuple()` 함수를 호출하여 새로운 클래스(타입)를 만듭니다.

    `namedtuple('타입이름', ['필드이름1', '필드이름2', ...])`

2.  **2단계: 정의된 타입으로 '객체(Instance)' 생성하기**
    마치 클래스로 객체를 만들 듯이, 위에서 정의한 타입에 값을 넣어 객체를 생성합니다.  

#### 자세한 코드 예제

```python
from collections import namedtuple

# 1. 'Point'라는 이름의 namedtuple 타입을 정의합니다.
# 이 타입은 'x'와 'y'라는 필드 이름을 가집니다.
Point = namedtuple('Point', ['x', 'y'])

# 2. Point 타입을 사용하여 객체를 생성합니다.
p1 = Point(10, 20)
p2 = Point(x=30, y=40) # 키워드 인자로도 생성 가능

# --- 주요 특징 ---

# 1. 이름으로 값에 접근 (가장 큰 장점!)
print(f"p1의 x좌표: {p1.x}")  # 출력: p1의 x좌표: 10
print(f"p1의 y좌표: {p1.y}")  # 출력: p1의 y좌표: 20

# 2. 인덱스로도 값에 접근 (튜플의 특성 유지)
print(f"p2의 첫 번째 값: {p2[0]}") # 출력: p2의 첫 번째 값: 30
print(f"p2의 두 번째 값: {p2[1]}") # 출력: p2의 두 번째 값: 40

# 3. 불변성(Immutable) - 값 변경 불가 (튜플의 특성 유지)
try:
    p1.x = 100
except AttributeError as e:
    print(f"값 변경 시도 시 에러 발생: {e}")
    # 출력: 값 변경 시도 시 에러 발생: can't set attribute

# 4. 언패킹(Unpacking) 가능 (튜플의 특성 유지)
x_val, y_val = p1
print(f"언패킹된 값: x={x_val}, y={y_val}") # 출력: 언패킹된 값: x=10, y=20

# 5. 객체 표현이 명확함
print(p1) # 출력: Point(x=10, y=20)
```

#### 언제 사용하면 좋을까요?

*   **CSV 파일이나 데이터베이스의 행(Row)을 처리할 때**: `row[0]`, `row[1]` 대신 `row.id`, `row.name`처럼 명확하게 데이터를 다룰 수 있습니다.
*   **함수에서 여러 값을 반환할 때**: `return (id, name, email)` 대신, `namedtuple` 객체를 반환하면 어떤 값이 무엇을 의미하는지 명확해집니다.
*   **좌표(x, y, z), RGB 색상(r, g, b) 등** 명확한 이름이 있는 데이터 묶음을 표현할 때 유용합니다.

#### 다른 자료형과의 비교

| 비교 대상 | `namedtuple`의 장점 |
| :--- | :--- |
| **일반 `tuple`** | **가독성**이 월등히 좋습니다. `point[0]` 대신 `point.x`로 의미를 명확히 할 수 있습니다. |
| **`dict` (딕셔셔리)** | **불변성(immutable)**을 가집니다. 값이 실수로 변경되는 것을 막을 수 있습니다. <br> 더 **가볍고(메모리 효율적)** 빠릅니다. |
| **`class`** | 데이터 필드만 필요한 경우, `class`를 직접 정의하는 것보다 **코드가 훨씬 간결**합니다. |

---

#### 요약

**`namedtuple`**은 **데이터를 담기 위한 간단한 '객체'가 필요하지만, 완전한 `class`를 정의하기는 번거로울 때** 사용하는 최고의 도구입니다. 튜플의 특성(불변성, 효율성)과 객체지향의 장점(가독성)을 모두 가지고 있어 코드를 훨씬 깔끔하고 이해하기 쉽게 만들어 줍니다.




완전히 정리된 상태입니다! ✅  
아래는 **리스트 컴프리헨션을 자연스럽게 읽는 방법**, 그리고 **주석**(docstring, 코드 주석 등)에 사용할 수 있는 **한글 / 영어 표현 패턴**을 체계적으로 정리한 내용이에요.

---

## list comprehension

### 기본 구조

```python
[표현식 for 항목 in 반복대상 if 조건]
```

→ 이걸 영어 문장처럼 읽으면:

> "**expression for item in iterable if condition**"

즉,  
"조건이 있다면 해당 조건을 만족하는 `item`들 중에서, 각각에 대해 `expression`을 적용해서 리스트를 만들자"


### 1. 기본 리스트 생성

```python
[x for x in range(5)]
```

- 👉 한글: "0부터 4까지의 숫자로 구성된 리스트"
- 👉 영어: "a list of numbers from 0 to 4"

---

### 2. 제곱수 리스트

```python
[x**2 for x in range(1, 6)]
```

- 👉 한글: "1부터 5까지 각 숫자의 제곱으로 구성된 리스트"
- 👉 영어: "a list of squares of numbers from 1 to 5"

---

### 3. 짝수만 필터링

```python
[x for x in range(10) if x % 2 == 0]
```

- 👉 한글: "0부터 9까지 중 짝수만 포함하는 리스트"
- 👉 영어: "a list of even numbers from 0 to 9"

---

### 4. 문자열로 변환

```python
[str(x) for x in range(2, 11)]
```

- 👉 한글: "2부터 10까지의 숫자를 문자열로 변환한 리스트"
- 👉 영어: "a list of strings converted from numbers 2 to 10"

---

### 5. 조건 + 변환 동시 적용

```python
[x.upper() for x in ['apple', 'banana', 'cherry'] if len(x) > 5]
```

- 👉 한글: "길이가 5보다 큰 단어만 대문자로 바꾼 리스트"
- 👉 영어: "a list of words converted to uppercase where length is greater than 5"

---

### 6. 중첩된 예시 (딕셔너리 키 추출 등)

```python
[key for key, value in my_dict.items() if value > 10]
```

- 👉 한글: "값이 10보다 큰 항목들의 키만 포함하는 리스트"
- 👉 영어: "a list of keys where the corresponding value is greater than 10"

---
