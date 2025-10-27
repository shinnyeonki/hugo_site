---
title: cpp 생성자 소멸자 규칙
resource-path: leetcode75/cpp 생성자 소멸자 규칙.md
keywords:
tags:
date: 2025-01-30T22:58:00+09:00
lastmod: 2025-01-30T22:58:00+09:00
---
디폴트 생성자(Default Constructor)

명시적으로 디폴트 생성자
`{클래스 이름}() = default;  // 디폴트 생성자를 정의해라`

 `new` 와 [malloc](https://modoocode.com/243) 모두 동적으로 할당하지만 `new` 의 경우 객체를 동적으로 생성하면서와 동시에 자동으로 생성자도 호출해준다는 점입니다.
 `delete` 와 `free` 의 경우도 소멸자 호출 여부가 다름과 동일


`~{클래스의 이름}` 소멸자
