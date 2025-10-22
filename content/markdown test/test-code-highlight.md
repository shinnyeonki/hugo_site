---
title: test-code-highlight
aliases: 
tags: 
created: 2025-09-10T12:34:37+09:00
modified: 2025-09-11T07:14:15+09:00

---
# 코드 구문 강조 테스트

## JavaScript 코드

```javascript
function hello(name) {
    console.log(`Hello, ${name}!`);
    return true;
}

const users = ['Alice', 'Bob', 'Charlie'];
users.forEach(user => hello(user));
```

## Python 코드

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 리스트 컴프리헨션 예제
squares = [x**2 for x in range(10)]
print(squares)
```

## SQL 코드

```sql
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2023-01-01'
GROUP BY u.id, u.name
ORDER BY order_count DESC;
```

## Bash 스크립트

```bash
#!/bin/bash

# 환경 변수 설정
export NODE_ENV=production

# 패키지 설치 및 빌드
npm install
npm run build

echo "배포 완료!"
```

## 인라인 코드

일반 텍스트 중에 `console.log("inline code")` 같은 인라인 코드도 포함할 수 있습니다.

## Java 코드

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
        names.stream()
             .map(String::toUpperCase)
             .forEach(System.out::println);
    }
}
```
