---
title: asm parameter passing 인자 전달 방식
resource-path: 02.inbox/asm parameter passing 인자 전달 방식.md
aliases:
tags:
  - operating-system
  - assembler
date: 2025-03-11T11:35:00+09:00
lastmod: 2025-03-11T11:35:00+09:00
---
다음은 인텔 어셈블리 문법으로 각 파라미터 전달 방식을 구현한 예시

---

### **1. Register를 통한 파라미터 전달**
```asm
section .data
    ; (데이터 섹션은 필요 시 정의)

section .text
    global _start

_start:
    ; 두 정수를 레지스터로 전달 (EAX=5, EBX=10)
    mov eax, 5
    mov ebx, 10
    call add_registers  ; 함수 호출

    ; 결과 확인 (EAX에 저장됨)
    ; ... (종료 코드 생략)

add_registers:
    add eax, ebx  ; EAX = EAX + EBX
    ret           ; 결과를 EAX에 반환
```
- **특징**: 레지스터(`eax`, `ebx`)에 직접 값 저장 → 빠른 접근 가능.
- **주의**: 레지스터 수가 제한적이므로 복잡한 함수에는 부적합.

---

### **2. Memory를 통한 파라미터 전달 (포인터 사용)**
```asm
section .data
    var1 dd 15      ; 32비트 정수 (15)
    var2 dd 25      ; 32비트 정수 (25)

section .text
    global _start

_start:
    ; 메모리 주소를 레지스터로 전달
    mov esi, var1   ; ESI = var1의 주소
    mov edi, var2   ; EDI = var2의 주소
    call add_memory ; 함수 호출

    ; ... (종료 코드 생략)

add_memory:
    mov eax, [esi]  ; EAX = [var1] (15)
    add eax, [edi]  ; EAX += [var2] (25)
    ret             ; 결과 반환
```
- **특징**: 메모리 주소를 레지스터(`esi`, `edi`)로 전달 → 대용량 데이터 처리 가능.
- **주의**: 메모리 접근 오버헤드 발생 (캐시 미스 시 성능 저하).
일반적으로 힙 영역에 적층
---

### **3. Stack을 통한 파라미터 전달**
```asm
section .data
    ; (데이터 섹션은 필요 시 정의)

section .text
    global _start

_start:
    ; 스택에 파라미터 푸시 (역순으로 전달)
    push 30         ; 두 번째 인자
    push 40         ; 첫 번째 인자
    call add_stack  ; 함수 호출

    ; 스택 정리 (cdecl 규약: 호출자가 정리)
    add esp, 8      ; 2개의 DWORD(4바이트*2) 제거

    ; ... (종료 코드 생략)

add_stack:
    push ebp        ; 베이스 포인터 보존
    mov ebp, esp    ; 스택 프레임 설정
    ; [ebp+8] = 첫 번째 인자 (40)
    ; [ebp+12] = 두 번째 인자 (30)
    mov eax, [ebp+8]
    add eax, [ebp+12]
    pop ebp         ; 베이스 포인터 복구
    ret             ; 결과 반환
```
- **특징**: 스택을 통해 인자 전달 → 재귀 호출 등 복잡한 로직에 적합.
- **주의**: 스택 오버플로우 위험 (너무 큰 데이터 전달 금지).

---

### **키 포인트**
1. **Register**: 빠르지만 제한적 → 최적화된 코드에 사용.
2. **Memory**: 대용량 데이터 처리 가능 → 구조체/배열 전달 시 유리.
3. **Stack**: 함수 호출 관리 용이 → 대부분의 고수준 언어 기본 방식.

인텔 문법에서 `mov eax, [ebx]`는 "ebx가 가리키는 메모리 값 로드"이며, `push`, `pop`은 스택 조작 명령어입니다.