---
title: 익명 클래스(Anonymous Class)
aliases: 
tags:
  - language
created: 2023-12-20T07:12:00+09:00
modified: 2023-12-20T07:12:00+09:00

---

내부 클래스의 일종으로 이름이 없는 클래스

## java
인라인으로 한방에 사용
새로 정의한 메소드 사용 불가
```java
// 부모 클래스
class Animal {
    public String bark() {
        return "동물이 웁니다";
    }
}
public class Main {
    public static void main(String[] args) {
        Animal dog = new Animal() {
            // @Override 메소드
            public String bark() {
                return "개가 짖습니다";
            }
            
            // 새로 정의한 메소드
            public String run() {
                return "달리기 ㄱㄱ싱";
            }
        };
        
        dog.bark();
        dog.run(); // ! Error - 외부에서 호출 불가능
    }
}
```


### **1. 클래스 필드로 이용**

- 특정 클래스 내부에서 여러 메소드에서 이용될때 고려해볼 만 하다

```java
class Animal { ... }

class Creature {
    // 필드에 익명자식 객체를 생성 하여 이용
    Animal dog = new Animal() {
        public String bark() {
            return "멍멍";
        }
    };

    public void method() {
        dog.bark();
    }
    
    public void method2() {
        dog.bark();
    }
}
```

### **2. 지역 변수로서 이용**

- 메소드에서 일회용으로 사용하고 버려질 클래스라면 적당하다

```java
class Animal { ... }

class Creature {
	// ...
    
    public void method() {
    	// 지역 변수같이 클래스를 선언하여 일회용으로 사용
        Animal dog = new Animal() {
            public String bark() {
                return "멍멍";
            }
        };
        dog.bark();
    }
}
```

### **3. 메소드 아규먼트로 이용**

- 만일 메소드 매개변수로서 클래스 자료형이 이용된다고 할때 일회성으로만 사용한다면 아규먼트로 익명 객체를 넘겨주면 된다.

```java
class Animal { ... }

class Creature {
	// ...
    
    public void method(Animal dog) { // 익명 객체 매개변수로 받아 사용
        dog.bark();
    }
}

public class Main {
    public static void main(String[] args) {
        Creature monster = new Creature();
        
        // 메소드 아규먼트에 익명 클래스 자체를 입력값으로 할당
        monster.method(new Animal() {
            public String bark() {
                return "멍멍";
            }
        });
    }
}
```