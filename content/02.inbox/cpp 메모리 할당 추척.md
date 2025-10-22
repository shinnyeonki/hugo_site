---
title: cpp 메모리 할당 추척
aliases:
  - new 재정의
tags:
  - cpp
created: 2025-01-21T10:52:00+09:00
modified: 2025-06-27T19:48:59+09:00

---
operator new를 오버로딩하여 메모리 할당 시 로그를 출력

```cpp
void* operator new(std::size_t count) {
    std::cout << count << " bytes 할당 " << std::endl;
    return malloc(count);
}
```

stdout 으로 할당된 양을 뽑는다