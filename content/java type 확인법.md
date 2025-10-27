---
title: java type 확인법
resource-path: java type 확인법.md
keywords:
tags:
date: 2025-09-12T20:51:17+09:00
lastmod: 2025-09-12T21:00:28+09:00
share_link: https://share.note.sx/tj6qxwcw#PRwNTJvX39gW2hDdS96kHdqOnAc+chVkWGF/HET2ofY
share_updated: 2025-09-12T20:53:26+09:00
---
Java에는 JavaScript나 C++ 같은 언어에서 사용하는 `typeof` 연산자와 **정확히 동일한 문법적 연산자**가 없습니다. Java는 정적 타입 언어(statically typed language)이기 때문에, 컴파일 시점에 변수의 타입이 결정되며, 런타임에 타입을 "확인"하는 것이 일반적인 용도가 아닙니다. 하지만 Java에서는 **런타임에 객체의 타입을 확인할 수 있는 여러 가지 방법**이 있습니다.

아래에 Java에서 **타입(type)을 확인할 수 있는 모든 주요 방법**을 정리해 드립니다.

---

## ✅ 1. `instanceof` 연산자 — 가장 흔한 타입 확인 방법

```java
Object obj = "Hello";

if (obj instanceof String) {
    System.out.println("obj는 String 타입입니다.");
} else if (obj instanceof Integer) {
    System.out.println("obj는 Integer 타입입니다.");
}
```

### 특징:
- `null`과 비교하면 항상 `false`를 반환.
- 컴파일 시점에 타입 호환성이 없는 경우 **컴파일 에러** 발생 (예: `String instanceof Integer`)
- **상속 관계**도 인식: `instanceof`는 부모 클래스/인터페이스에도 `true`를 반환함.

```java
class Animal {}
class Dog extends Animal {}

Dog dog = new Dog();
System.out.println(dog instanceof Animal); // true
System.out.println(dog instanceof Dog);    // true
```

> 📌 **JavaScript의 `typeof`와 유사한 용도로 자주 사용됨**

---

## ✅ 2. `getClass()` 메서드 — 실제 실행 타입 얻기

```java
Object obj = new ArrayList<String>();
Class<?> clazz = obj.getClass();
System.out.println(clazz.getName()); // java.util.ArrayList
```

### 특징:
- `Object` 클래스의 메서드로, **모든 객체에 사용 가능**
- **정확한 런타임 타입**(concrete class)을 반환
- `instanceof`와 달리 **부모 타입은 포함하지 않음**

```java
Dog dog = new Dog();
System.out.println(dog.getClass().getName()); // Dog (Animal 아님!)
```

### 활용 예: 타입 이름 비교

```java
if (obj.getClass().equals(String.class)) {
    System.out.println("String입니다");
}
```

> ⚠️ `==` 대신 `.equals()`를 써야 함. `Class` 객체는 참조 비교가 아니라 내용 비교가 필요.

---

## ✅ 3. `Class.isInstance()` 메서드 — `instanceof`의 반대 버전

```java
Class<String> stringClass = String.class;
Object obj = "hello";

if (stringClass.isInstance(obj)) {
    System.out.println("obj는 String입니다");
}
```

### 특징:
- `instanceof`의 **반대 방향**으로 사용 (클래스 객체 → 객체 확인)
- 리플렉션(Reflection) 상황에서 유용
- `null` 처리: `isInstance(null)` → `false`

---

## ✅ 4. `Class.isAssignableFrom()` — 상속/구현 관계 확인

```java
Class<Animal> animalClass = Animal.class;
Class<Dog> dogClass = Dog.class;

System.out.println(animalClass.isAssignableFrom(dogClass)); // true
System.out.println(dogClass.isAssignableFrom(animalClass)); // false
```

### 특징:
- `A.isAssignableFrom(B)` → B가 A의 하위 타입(또는 같음)인가?
- **상속 계층 구조**를 체크할 때 유용
- `List.class.isAssignableFrom(ArrayList.class)` → `true`

---

## ✅ 5. `Type` 및 `ParameterizedType` — 제네릭 타입 정보 확인 (리플렉션)

```java
import java.lang.reflect.*;
import java.util.List;

public class GenericTypeExample {
    public List<String> list;

    public static void main(String[] args) throws Exception {
        Field field = GenericTypeExample.class.getDeclaredField("list");
        Type genericType = field.getGenericType();

        if (genericType instanceof ParameterizedType) {
            ParameterizedType pt = (ParameterizedType) genericType;
            Type rawType = pt.getRawType();       // java.util.List
            Type[] typeArgs = pt.getActualTypeArguments(); // [java.lang.String]

            System.out.println("Raw type: " + rawType);
            System.out.println("Type arg: " + typeArgs[0]); // class java.lang.String
        }
    }
}
```

### 특징:
- **제네릭 타입 파라미터**(예: `List<String>`)의 실제 타입을 런타임에 알 수 있음
- **타입 추출**(Type Erasure) 후에도 제네릭 정보가 필드/메서드/생성자에 저장되어 있을 때만 가능
- 컴파일된 `.class` 파일에 제네릭 정보가 남아 있어야 함 (디버그 옵션 등)

---

## ✅ 6. `switch` 문 + `instanceof` (Java 17+ 패턴 매칭)

Java 17부터 `instanceof`와 `switch`를 결합한 **패턴 매칭** 기능이 도입되었습니다:

```java
Object obj = "Hello";

switch (obj) {
    case String s -> System.out.println("문자열: " + s.toUpperCase());
    case Integer i -> System.out.println("정수: " + i * 2);
    case null -> System.out.println("null입니다");
    default -> System.out.println("알 수 없는 타입: " + obj.getClass().getSimpleName());
}
```

> 이 방식은 `instanceof` + 캐스팅을 자동으로 해주는 **안전하고 간결한** 문법입니다.

---

## ✅ 7. `Objects.toString()` 또는 `String.valueOf()` — 타입 정보 출력

```java
Object obj = new HashMap<>();
System.out.println(obj); // { } → toString() 호출
System.out.println(obj.getClass().getSimpleName()); // HashMap
System.out.println(String.valueOf(obj.getClass())); // class java.util.HashMap
```

- `toString()`은 보통 클래스명을 포함하므로 **간접적으로 타입 확인** 가능

---

## ✅ 8. `Class.getSimpleName()` / `getCanonicalName()` / `getTypeName()`

```java
Class<?> c = String.class;
System.out.println(c.getSimpleName());        // String
System.out.println(c.getCanonicalName());     // java.lang.String
System.out.println(c.getTypeName());          // java.lang.String
```

- `getSimpleName()`: 단순 클래스명
- `getCanonicalName()`: 패키지 포함 표준 이름
- `getTypeName()`: 제네릭 타입까지 표현 가능 (Java 8+)

---

## ❌ Java에는 `typeof`가 없다!

| 언어 | typeof |
|------|--------|
| JavaScript | `typeof x === "string"` ✅ |
| C# | `typeof(string)` ✅ (컴파일 타임) |
| Java | ❌ 없음 |

Java는 **컴파일 타임 타입 검사**가 강력하기 때문에, `typeof`처럼 **변수의 선언 타입을 문자열로 얻는 기능**이 없습니다.

> 💡 Java에서 `String.class`는 **클래스 객체**이고, `typeof`처럼 **타입 이름 문자열**을 얻는 게 아님.

---

## 🔍 요약: Java에서 타입 확인 방법 정리

| 방법 | 설명 | 사용 목적 | null 안전? |
|------|------|-----------|------------|
| `instanceof` | 객체가 특정 타입 또는 하위 타입인지 확인 | 일반적인 타입 체크 | ✅ (`null` → `false`) |
| `getClass()` | 실제 런타임 클래스 객체 가져오기 | 정확한 클래스 비교 | ✅ |
| `Class.isInstance()` | 클래스 객체로 객체 타입 확인 | 리플렉션 환경 | ✅ |
| `Class.isAssignableFrom()` | 상속/구현 관계 확인 | API 설계, 프레임워크 | ✅ |
| `switch + instanceof` (Java 17+) | 다중 타입 분기 | 간결한 타입 분기 로직 | ✅ |
| `ParameterizedType` | 제네릭 타입 파라미터 추출 | 커스텀 직렬화, ORM 등 | ✅ (정보 존재 시) |
| `getSimpleName()`, `getTypeName()` | 타입 이름 출력 | 디버깅, 로깅 | - |

---

## 💡 실무 팁

- **`instanceof`** → 대부분의 경우 최선의 선택
- **`getClass()`** → 정확한 클래스 비교가 필요할 때 (예: `HashMap` vs `LinkedHashMap`)
- **리플렉션** → 프레임워크 개발 시 사용 (Spring, Jackson, Hibernate 등)
- **패턴 매칭** → Java 17 이상이라면 `switch`로 타입 분기를 깔끔하게!

---

## ✅ 예시: `instanceof` vs `getClass()` 차이

```java
class Animal {}
class Cat extends Animal {}

Cat cat = new Cat();

System.out.println(cat instanceof Animal);     // true
System.out.println(cat.getClass() == Animal.class); // false
System.out.println(cat.getClass() == Cat.class);    // true
```

→ `instanceof`는 **상속 포함**, `getClass()`는 **정확한 클래스만**

---

필요에 따라 적절한 메서드를 선택하세요!  
Java는 `typeof`가 없지만, 위의 다양한 도구들로 충분히 타입을 안전하고 정밀하게 다룰 수 있습니다.