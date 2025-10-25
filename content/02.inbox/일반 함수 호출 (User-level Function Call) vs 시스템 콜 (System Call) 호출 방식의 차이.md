---
title: 일반 함수 호출 (User level Function Call) vs 시스템 콜 (System Call) 호출 방식의 차이
resource-path: 02.inbox/일반 함수 호출 (User-level Function Call) vs 시스템 콜 (System Call) 호출 방식의 차이.md
aliases:
tags:
  - operating-system
date: 2025-03-11T11:39:00+09:00
lastmod: 2025-03-11T11:39:00+09:00
---
시스템 콜(system call)은 사용자 프로그램이 커널의 기능을 간접적으로 호출하는 메커니즘이며, **매핑 테이블(시스템 콜 테이블)**을 통해 실제 커널 함수로 연결됩니다. 일반 함수 호출과 시스템 콜의 동작 방식을 인텔 어셈블리 문법과 함께 비교 설명합니다.

---

### **1. 일반 함수 호출 (User-level Function Call)**
#### **동작 방식**
- **직접 호출**: 호출자(caller)가 함수의 메모리 주소를 직접 참조합니다.
- **파라미터 전달**: 레지스터 또는 스택을 사용합니다.
- **제어권 이동**: 사용자 공간 내에서만 실행되며, 커널 모드 전환 없이 동작합니다.

#### **예시: 간단한 덧셈 함수 호출**
```asm
section .data
    num1 dd 10
    num2 dd 20

section .text
    global _start

_start:
    ; 파라미터 전달 (레지스터 사용)
    mov eax, [num1]  ; EAX = 10
    mov ebx, [num2]  ; EBX = 20
    call add_numbers ; 함수 호출

    ; 종료 (시스템 콜 예시로 대체 가능)
    mov eax, 1       ; sys_exit 시스템 콜 번호
    int 0x80         ; 커널 호출

add_numbers:
    add eax, ebx     ; EAX = EAX + EBX
    ret              ; 결과 반환
```
- **특징**: `call` 명령어로 직접 함수 주소로 점프 → 커널 개입 없이 사용자 공간에서 실행.

---

### **2. 시스템 콜 (System Call)**
#### **동작 방식**
- **간접 호출**: 시스템 콜 번호를 **매핑 테이블(sys_call_table)**에 전달해 커널 함수를 찾아 실행합니다.
- **모드 전환**: 사용자 모드 → 커널 모드 전환 (特权级别 변경).
- **파라미터 전달**: 레지스터에 시스템 콜 번호와 인자 저장 (예: `eax`, `ebx`, `ecx` 등).

#### **시스템 콜 테이블의 역할**
- 커널은 **sys_call_table**이라는 배열을 유지하며, 각 인덱스는 시스템 콜 번호에 해당합니다.
- 예: Linux x86에서 `sys_write`의 시스템 콜 번호는 `4`입니다.
  ```c
  // Linux 커널 소스 (unistd_32.h)
  #define __NR_write 4
  ```

#### **예시: `sys_write` 시스템 콜 호출**
```asm
section .data
    msg db "Hello, World!", 0xA  ; 출력 메시지 (0xA = 개행)
    len equ $ - msg               ; 메시지 길이

section .text
    global _start

_start:
    ; 시스템 콜 파라미터 설정 (레지스터 사용)
    mov eax, 4          ; sys_write 시스템 콜 번호 (NR_write = 4)
    mov ebx, 1          ; 파일 디스크립터 (stdout = 1)
    mov ecx, msg        ; 메시지 주소
    mov edx, len        ; 메시지 길이
    int 0x80            ; 커널 모드 전환 (소프트웨어 인터럽트)

    ; 프로그램 종료
    mov eax, 1          ; sys_exit 시스템 콜 번호
    xor ebx, ebx        ; 반환 값 0
    int 0x80
```

#### **시스템 콜 처리 과정**
1. **인터럽트 발생**: `int 0x80` 또는 `syscall` 명령어로 커널 모드 진입.
2. **시스템 콜 번호 확인**: `eax` 레지스터에서 시스템 콜 번호를 읽습니다.
3. **매핑 테이블 조회**: 커널은 `sys_call_table`에서 해당 번호의 함수 포인터를 찾습니다.
   ```c
   // 커널 내부 sys_call_table 예시 (x86)
   asmlinkage long sys_write(unsigned int fd, const char __user *buf, size_t count);
   ```
4. **함수 실행**: 매핑된 커널 함수(예: `sys_write`)를 실행합니다.
5. **결과 반환**: 사용자 모드로 복귀 후 결과를 레지스터(`eax`)에 저장합니다.

---

### **3. 시스템 콜 vs 일반 함수 호출의 핵심 차이**
| **구분**          | **일반 함수 호출**                | **시스템 콜**                     |
|--------------------|-----------------------------------|-----------------------------------|
| **실행 모드**      | 사용자 모드 (User Mode)           | 커널 모드 (Kernel Mode)           |
| **호출 방식**      | 직접 호출 (`call` 명령어)         | 간접 호출 (인터럽트/시스템 콜 명령어) |
| **파라미터 전달**  | 레지스터/스택                     | 레지스터 (커널에서 정의한 규칙)   |
| **오버헤드**       | 낮음 (메모리 접근만 발생)         | 높음 (모드 전환, 컨텍스트 스위칭) |
| **보안**           | 제한 없음                         | 커널이 검증 후 실행               |

---

### **시스템 콜 테이블의 구조 (Linux x86 예시)**
```c
// arch/x86/kernel/syscall_32.c (커널 소스)
extern asmlinkage long sys_write(unsigned int, const char __user *, size_t);
extern asmlinkage long sys_read(unsigned int, char __user *, size_t);

static const sys_call_ptr_t sys_call_table[__NR_syscall_max + 1] = {
    [0 ... __NR_syscall_max] = &sys_ni_syscall,  // 기본값: 지원되지 않는 시스템 콜
    [__NR_write] = sys_write,
    [__NR_read] = sys_read,
    // ... (다른 시스템 콜 매핑)
};
```
- **간접 참조**: `sys_call_table[__NR_write]` → `sys_write` 함수 포인터.

---

### **요약**
- **일반 함수 호출**: 사용자 공간 내에서 직접 실행되며, 빠르지만 권한이 제한적입니다.
- **시스템 콜**: 커널의 매핑 테이블을 통해 간접적으로 실행되며, 모드 전환과 검증 과정을 거쳐 안전하게 하드웨어/커널 자원을 제어합니다.  
- **예시**: `int 0x80`은 커널의 **인터럽트 핸들러**를 호출해 시스템 콜 테이블을 조회하고, 실제 함수(예: `sys_write`)를 실행합니다.