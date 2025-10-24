---
title: RISC V 명령어 구조
date: 2024-08-31T09:44:00+09:00
lastmod: 2024-08-31T09:44:00+09:00
resource-path: 02.inbox/그래서 컴퓨터는 어떻게 동작하나요/RISC-V 명령어 구조.md
aliases: 
tags:
  - cs
  - cpu
---
RISC-V emulator RV32I 를 코드로 구현하기 위해 먼저 RISC-V 공식 문서를 확인하여 
구현할 명령의 구조를 공부한다

RISC V 의 경우 32비트인지 64 비트인지 128비트인지에 따라 RV32, RV64, RV128 로 나누어지며 기본적인 명령인 integer instruction set 을 구현하면 RV32I, RV64I, RV128I 라고 불리운다 또한 아래의 4가지 확장을 추가하여 자유롭게 가능한 명령을 추가 할 수 있다
또한 문서는 2가지로 privilige 명령과 non privilige 명령 문서가 있으며 아래는 non privilige 명령만을 설명한다
- 1권, 권한 없는 사양 버전 20240411 [PDF](https://drive.google.com/file/d/1uviu1nH-tScFfgrovvFCrj7Omv8tFtkp/view?usp=drive_link), [GitHub](https://github.com/riscv/riscv-isa-manual/releases/tag/20240411)
- 2권, 권한 사양 버전 20240411 [PDF](https://drive.google.com/file/d/17GeetSnT5wW3xNuAHI95-SI1gPGd5sJ_/view?usp=drive_link), [GitHub](https://github.com/riscv/riscv-isa-manual/releases/tag/20240411)


non privilige 의 확장 명령 종류
- M : multifly 정수 곱셈 및 나눗셈 확장
- A : atomic 원자적 연산 확장 멀티 코어의 공유 자원 접근을 위한 명령)
- F : Single-Precision Floating-Point 단정밀도 부동소수점에 대한 표준 확장
- D : Double-Precision Floating-Point 배정밀로 부동소수점에 대한 표준 확장
- Q : Quad-Precision Floating-Point 쿼드정밀도 부동소수점에 대한 표준 확장
- L : Decimal Floating-Point 10진수 부동소수점에 대한 표준 확장
- C : Compressed Instructions 압축 명령어용 명령
- B : Bit Manipulation 비트 조작 명령
- J : Dynamically Translated Languages 동적 번역용 언어
- T : Transactional Memory 트랜잭션 메모리용 확장
- P : Packed-SIMD Instructions
- V : Vector Operations 벡터 확장
- N : Standard Extension for User-Level Interrupts 유저 레벨 인터럽트

![PDF file riscv-spec-v2.2  20240831124214](../../08.media/PDF%20file%20riscv-spec-v2.2%20%2020240831124214.pdf)




## 명령어 기본 구조

| **Bits**   | **31 - 25**                | **24 - 20** | **19 - 15** | **14 - 12** | **11 - 7**     | **6 - 0** |
| ---------- | -------------------------- | ----------- | ----------- | ----------- | -------------- | --------- |
| **R-type** | funct7                     | rs2         | rs1         | funct3      | rd             | opcode    |
| **I-type** | imm\[11:0\]                | ''          | rs1         | funct3      | rd             | opcode    |
| **S-type** | imm\[11:5\]                | rs2         | rs1         | funct3      | imm\[4:0\]     | opcode    |
| **B-type** | imm\[12\|10:5]             | rs2         | rs1         | funct3      | imm[4:1\| 11\] | opcode    |
| **U-type** | imm[31:12]                 | ''          | ''          | ''          | rd             | opcode    |
| **J-type** | imm\[20\|10:1\|11\|19:12\] | ''          | ''          | ''          | rd             | opcode    |




## RV32I 세부 명령 종류

| Type   | Instruction | Description                                   | 한글 설명                     | 명령어 예시             | 명령어 설명                            |
| ------ | ----------- | --------------------------------------------- | ------------------------- | ------------------ | --------------------------------- |
| R-type | ADD         | Add                                           | 덧셈                        | add x1, x2, x3     | x1 = x2 + x3                      |
| R-type | SUB         | Subtract                                      | 뺄셈                        | sub x1, x2, x3     | x1 = x2 - x3                      |
| R-type | SLL         | Shift Left Logical                            | 논리적 왼쪽 시프트                | sll x1, x2, x3     | x1 = x2 << x3                     |
| R-type | SLT         | Set Less Than                                 | 작음 설정                     | slt x1, x2, x3     | x1 = (x2 < x3) ? 1 : 0            |
| R-type | SLTU        | Set Less Than Unsigned                        | 부호 없는 작음 설정               | sltu x1, x2, x3    | x1 = (x2 < x3) ? 1 : 0 (부호 없음)    |
| R-type | XOR         | Exclusive OR                                  | 배타적 논리합                   | xor x1, x2, x3     | x1 = x2 ^ x3                      |
| R-type | SRL         | Shift Right Logical                           | 논리적 오른쪽 시프트               | srl x1, x2, x3     | x1 = x2 >> x3 (논리적)               |
| R-type | SRA         | Shift Right Arithmetic                        | 산술적 오른쪽 시프트               | sra x1, x2, x3     | x1 = x2 >> x3 (산술적)               |
| R-type | OR          | OR                                            | 논리합                       | or x1, x2, x3      | x1 = x2 \| x3                     |
| R-type | AND         | AND                                           | 논리곱                       | and x1, x2, x3     | x1 = x2 & x3                      |
| I-type | ADDI        | Add Immediate                                 | 즉시값 덧셈                    | addi x1, x2, 10    | x1 = x2 + 10                      |
| I-type | SLTI        | Set Less Than Immediate                       | 즉시값 작음 설정                 | slti x1, x2, 10    | x1 = (x2 < 10) ? 1 : 0            |
| I-type | SLTIU       | Set Less Than Immediate Unsigned              | 부호 없는 즉시값 작음 설정           | sltiu x1, x2, 10   | x1 = (x2 < 10) ? 1 : 0 (부호 없음)    |
| I-type | XORI        | Exclusive OR Immediate                        | 즉시값 배타적 논리합               | xori x1, x2, 0xFF  | x1 = x2 ^ 0xFF                    |
| I-type | ORI         | OR Immediate                                  | 즉시값 논리합                   | ori x1, x2, 0xFF   | x1 = x2 \| 0xFF                   |
| I-type | ANDI        | AND Immediate                                 | 즉시값 논리곱                   | andi x1, x2, 0xFF  | x1 = x2 & 0xFF                    |
| I-type | SLLI        | Shift Left Logical Immediate                  | 즉시값 논리적 왼쪽 시프트            | slli x1, x2, 2     | x1 = x2 << 2                      |
| I-type | SRLI        | Shift Right Logical Immediate                 | 즉시값 논리적 오른쪽 시프트           | srli x1, x2, 2     | x1 = x2 >> 2 (논리적)                |
| I-type | SRAI        | Shift Right Arithmetic Immediate              | 즉시값 산술적 오른쪽 시프트           | srai x1, x2, 2     | x1 = x2 >> 2 (산술적)                |
| I-type | LB          | Load Byte                                     | 바이트 로드                    | lb x1, 0(x2)       | x1 = MEM[x2 + 0] (1 byte)         |
| I-type | LH          | Load Halfword                                 | 하프워드 로드                   | lh x1, 2(x2)       | x1 = MEM[x2 + 2] (2 bytes)        |
| I-type | LW          | Load Word                                     | 워드 로드                     | lw x1, 4(x2)       | x1 = MEM[x2 + 4] (4 bytes)        |
| I-type | LBU         | Load Byte Unsigned                            | 부호 없는 바이트 로드              | lbu x1, 0(x2)      | x1 = MEM[x2 + 0] (1 byte, 부호 없음)  |
| I-type | LHU         | Load Halfword Unsigned                        | 부호 없는 하프워드 로드             | lhu x1, 2(x2)      | x1 = MEM[x2 + 2] (2 bytes, 부호 없음) |
| I-type | JALR        | Jump and Link Register                        | 레지스터로 점프 및 링크             | jalr x1, 0(x2)     | x1 = PC + 4; PC = x2 + 0          |
| S-type | SB          | Store Byte                                    | 바이트 저장                    | sb x1, 0(x2)       | MEM[x2 + 0] = x1 (1 byte)         |
| S-type | SH          | Store Halfword                                | 하프워드 저장                   | sh x1, 2(x2)       | MEM[x2 + 2] = x1 (2 bytes)        |
| S-type | SW          | Store Word                                    | 워드 저장                     | sw x1, 4(x2)       | MEM[x2 + 4] = x1 (4 bytes)        |
| B-type | BEQ         | Branch if Equal                               | 같으면 분기                    | beq x1, x2, label  | if (x1 == x2) PC = label          |
| B-type | BNE         | Branch if Not Equal                           | 다르면 분기                    | bne x1, x2, label  | if (x1 != x2) PC = label          |
| B-type | BLT         | Branch if Less Than                           | 작으면 분기                    | blt x1, x2, label  | if (x1 < x2) PC = label           |
| B-type | BGE         | Branch if Greater Than or Equal               | 크거나 같으면 분기                | bge x1, x2, label  | if (x1 >= x2) PC = label          |
| B-type | BLTU        | Branch if Less Than Unsigned                  | 부호 없이 작으면 분기              | bltu x1, x2, label | if (x1 < x2) PC = label (부호 없음)   |
| B-type | BGEU        | Branch if Greater Than or Equal Unsigned      | 부호 없이 크거나 같으면 분기          | bgeu x1, x2, label | if (x1 >= x2) PC = label (부호 없음)  |
| U-type | LUI         | Load Upper Immediate                          | 상위 즉시값 로드                 | lui x1, 0x12345    | x1 = 0x12345000                   |
| U-type | AUIPC       | Add Upper Immediate to PC                     | PC에 상위 즉시값 더하기            | auipc x1, 0x12345  | x1 = PC + 0x12345000              |
| J-type | JAL         | Jump and Link                                 | 점프 및 링크                   | jal x1, label      | x1 = PC + 4; PC = label           |
| I-type | FENCE       | Fence                                         | 펜스                        | fence              | 메모리 순서 보장                         |
| I-type | FENCE.I     | Fence Instruction                             | 명령어 펜스                    | fence.i            | 명령어 캐시 동기화                        |
| I-type | ECALL       | Environment Call                              | 환경 호출                     | ecall              | 시스템 콜                             |
| I-type | EBREAK      | Environment Break                             | 환경 중단                     | ebreak             | 디버그 중단점                           |
| I-type | CSRRW       | Atomic Read/Write CSR                         | 원자적 CSR 읽기/쓰기             | csrrw x1, csr, x2  | t = CSR; CSR = x2; x1 = t         |
| I-type | CSRRS       | Atomic Read and Set Bits in CSR               | 원자적 CSR 읽기 및 비트 설정        | csrrs x1, csr, x2  | t = CSR; CSR = t \| x2; x1 = t    |
| I-type | CSRRC       | Atomic Read and Clear Bits in CSR             | 원자적 CSR 읽기 및 비트 클리어       | csrrc x1, csr, x2  | t = CSR; CSR = t & ~x2; x1 = t    |
| I-type | CSRRWI      | Atomic Read/Write CSR (Immediate)             | 원자적 CSR 읽기/쓰기 (즉시값)       | csrrwi x1, csr, 5  | t = CSR; CSR = 5; x1 = t          |
| I-type | CSRRSI      | Atomic Read and Set Bits in CSR (Immediate)   | 원자적 CSR 읽기 및 비트 설정 (즉시값)  | csrrsi x1, csr, 5  | t = CSR; CSR = t \| 5; x1 = t     |
| I-type | CSRRCI      | Atomic Read and Clear Bits in CSR (Immediate) | 원자적 CSR 읽기 및 비트 클리어 (즉시값) | csrrci x1, csr, 5  | t = CSR; CSR = t & ~5; x1 = t     |

## RISC-V Register 종류

| **Register** | **ABI Name** | **Description**                   | **Saver** |
| ------------ | ------------ | --------------------------------- | --------- |
| x0           | `zero`       | Hard-wired zero                   | —         |
| x1           | `ra`         | Return address                    | Caller    |
| x2           | `sp`         | Stack pointer                     | Callee    |
| x3           | `gp`         | Global pointer                    | —         |
| x4           | `tp`         | Thread pointer                    | —         |
| x5           | `t0`         | Temporary/alternate link register | Caller    |
| x6–7         | `t1–2`       | Temporaries                       | Caller    |
| x8           | `s0/fp`      | Saved register/frame pointer      | Callee    |
| x9           | `s1`         | Saved register                    | Callee    |
| x10–11       | `a0–1`       | Function arguments/return values  | Caller    |
| x12–17       | `a2–7`       | Function arguments                | Caller    |
| x18–27       | `s2–11`      | Saved registers                   | Callee    |
| x28–31       | `t3–6`       | Temporaries                       | Caller    |
| ====         | ====         | F, D등의 부동소수점 확장 시에만               | ====      |
| f0–7         | `ft0–7`      | FP (Floating Point) temporaries   | Caller    |
| f8–9         | `fs0–1`      | FP saved registers                | Callee    |
| f10–11       | `fa0–1`      | FP arguments/return values        | Caller    |
| f12–17       | `fa2–7`      | FP arguments                      | Caller    |
| f18–27       | `fs2–11`     | FP saved registers                | Callee    |
| f28–31       | `ft8–11`     | FP temporaries                    | Caller    |
