---
title: AT&T 문법 과 Intel Assemble 문법 차이
aliases: 
tags:
  - assembler
created: 2024-08-26T07:37:00+09:00
modified: 2024-08-26T07:37:00+09:00

---
x86 아키텍처에서 어셈블리 언어는 주로 Intel과 AT&T 두 가지 구문 형식으로 나뉘어 사용된다 이 두 형식은 문법과 명령어의 표현 방식에서 차이가 있다

## 1. Intel 구문

- **형식**:
    - 피연산자는 보통 목적지(대상) 먼저, 원천(소스) 다음으로 나열
- **예시**:
    ```assembly
    MOV EAX, EBX  ; EBX의 값을 EAX로 이동
    ADD EAX, 5    ; EAX에 5를 더함
    ```
    
## 2. AT&T 구문
- **형식**:
    - 소스가 먼저, 목적지가 뒤
    - 레지스터와 즉시 값 앞에 '%'와 '$'를 붙입니다.
- **예시**:
    ```assembly
    mov %ebx, %eax  ; EBX의 값을 EAX로 이동
    add $5, %eax    ; EAX에 5를 더함
    ```